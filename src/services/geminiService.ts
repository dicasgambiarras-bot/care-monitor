import { GoogleGenAI, Type } from "@google/genai";
import type { HealthMetric, AIAnalysis, PatientProfile } from '../types';

// CORREÇÃO 1: Casting para evitar erro de 'env' no TypeScript
const API_KEY = (import.meta as any).env.VITE_GEMINI_API_KEY || "";

if (!API_KEY) {
  console.warn("A chave VITE_GEMINI_API_KEY não foi encontrada. A IA não funcionará.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// CORREÇÃO 2: Usando 'Type' ao invés de 'SchemaType'
const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "Resumo breve do estado de saúde.",
    },
    alerts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          level: { type: Type.STRING, enum: ['info', 'warning', 'critical'] },
          title: { type: Type.STRING },
          message: { type: Type.STRING, description: "Mensagem curta do alerta." },
          description: { type: Type.STRING },
          firstAid: { type: Type.STRING },
          emergencyScript: { type: Type.STRING }
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
    // Retorna um objeto vazio/seguro para não quebrar o app se não tiver chave
    return {
        id: 'error',
        timestamp: new Date(),
        summary: 'IA não configurada (Chave API ausente).',
        alerts: [],
        recommendations: []
    };
  }

  // Formatar dados
  const formattedMetrics = metrics.slice(0, 15).map(m => {
      let valStr = "";
      if (typeof m.value === 'object' && m.value !== null) {
          valStr = JSON.stringify(m.value);
      } else {
          valStr = String(m.value);
      }
      // CORREÇÃO 3: Verificação de segurança para 'unit'
      const unit = (m as any).unit || ''; 
      return `${m.type}: ${valStr} ${unit} (${new Date(m.timestamp).toLocaleString()})`;
  }).join('\n');

  const prompt = `
    Analise os dados de saúde abaixo para um paciente pós-AVC.
    PERFIL: Nome: ${patientProfile.name}, Idade: ${getAge(patientProfile.birthDate)}, Condição: ${patientProfile.mainCondition}
    DADOS RECENTES:
    ${formattedMetrics}
    Responda estritamente com o JSON solicitado.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    // CORREÇÃO 4: Removido () pois nesta versão 'text' é uma propriedade, não função
    const jsonText = response.text; 
    
    if (!jsonText) throw new Error("IA não retornou texto.");
    
    const analysis = JSON.parse(jsonText) as AIAnalysis;
    
    // Garantir campos obrigatórios
    analysis.alerts = analysis.alerts?.map((a: any) => ({
        ...a,
        message: a.message || a.description || a.title || "Alerta sem descrição"
    })) || [];

    return analysis;

  } catch (error) {
    console.error("Erro na análise Gemini:", error);
    // Fallback gracioso para não travar o app
    return {
        id: 'error',
        timestamp: new Date(),
        summary: 'Não foi possível realizar a análise no momento.',
        alerts: [],
        recommendations: []
    };
  }
};