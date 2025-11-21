import { GoogleGenAI, Type } from "@google/genai";
import type { HealthMetric, AIAnalysis, PatientProfile } from '../types';

// 1. Verificação de Segurança da Chave
const API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY || "";

// Log discreto para confirmação em produção
if (API_KEY) {
    console.log("IA conectada: Gemini 2.5 Pro ✅");
} else {
    console.error("ERRO CRÍTICO: Chave da IA não encontrada (VITE_GEMINI_API_KEY) ❌");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Schema de resposta forçado para garantir JSON
const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "Resumo clínico conciso e acolhedor do estado atual.",
    },
    alerts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          level: { type: Type.STRING, enum: ['info', 'warning', 'critical'] },
          title: { type: Type.STRING },
          message: { type: Type.STRING, description: "Mensagem direta e clara para o cuidador." },
          recommendation: { type: Type.STRING }
        },
        required: ['level', 'title', 'message'],
      },
    },
    recommendations: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
    }
  },
  required: ['summary', 'alerts', 'recommendations'],
};

const getAge = (birthDate: string) => {
    if(!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

export const analyzeHealthData = async (
  metrics: HealthMetric[],
  patientProfile: PatientProfile
): Promise<AIAnalysis> => {
  if (!API_KEY) {
    return createFallbackAnalysis("Chave da IA não configurada. Verifique o painel da Vercel.");
  }

  // Formata as últimas 20 métricas para dar bastante contexto ao modelo 2.5
  const formattedMetrics = metrics.slice(0, 20).map(m => {
      let valStr = typeof m.value === 'object' ? JSON.stringify(m.value) : String(m.value);
      const unit = (m as any).unit || ''; 
      return `- ${m.type}: ${valStr} ${unit} em ${new Date(m.timestamp).toLocaleString('pt-BR')}`;
  }).join('\n');

  const prompt = `
    Você é um assistente médico geriátrico avançado monitorando um paciente pós-AVC.
    Utilize sua capacidade de raciocínio clínico (Gemini 2.5 Pro) para analisar os dados.

    PACIENTE:
    Nome: ${patientProfile.name}
    Idade: ${getAge(patientProfile.birthDate)} anos
    Condição Principal: ${patientProfile.mainCondition}
    Histórico: ${patientProfile.medicalHistory}
    Alergias: ${patientProfile.allergies}

    SINAIS VITAIS RECENTES (Cronológico reverso):
    ${formattedMetrics || "Nenhum dado recente disponível."}

    DIRETRIZES DE ANÁLISE:
    1. Priorize a detecção de 'Descompensação': Mudanças súbitas em PA, O2 ou Glicemia.
    2. Para Pressão Arterial: Considere perigoso se Sistólica > 180 ou < 90 (salvo histórico específico).
    3. Contexto: Se houver febre + taquicardia, considere risco de infecção.
    4. Responda em JSON estrito seguindo o schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro", // Atualizado para o modelo consolidado
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonText = response.text; 
    
    if (!jsonText) throw new Error("IA não retornou dados.");
    
    const analysis = JSON.parse(jsonText) as AIAnalysis;
    
    // Sanitização final para garantir que a UI não quebre
    analysis.alerts = analysis.alerts?.map((a: any) => ({
        ...a,
        level: a.level || 'info',
        title: a.title || 'Aviso',
        message: a.message || a.description || "Verifique os dados."
    })) || [];

    return analysis;

  } catch (error: any) {
    console.error("Falha na análise Gemini:", error);
    
    // Feedback específico para facilitar debug na Vercel
    if (error.toString().includes("404")) {
        return createFallbackAnalysis("Modelo Gemini 2.5 Pro não encontrado ou sem acesso na chave atual.");
    } else if (error.toString().includes("403") || error.toString().includes("API key")) {
        return createFallbackAnalysis("Erro de permissão na API. Verifique a chave na Vercel.");
    }
    
    return createFallbackAnalysis("A análise inteligente está indisponível no momento.");
  }
};

// Função de segurança para manter a UI funcionando mesmo se a IA falhar
function createFallbackAnalysis(msg: string): AIAnalysis {
    return {
        id: 'error',
        timestamp: new Date(),
        summary: msg,
        alerts: [],
        recommendations: ["Mantenha o monitoramento manual e consulte um médico em caso de dúvida."]
    };
}