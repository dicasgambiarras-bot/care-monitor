import { GoogleGenAI, Type } from "@google/genai";
import type { HealthMetric, AIAnalysis, PatientProfile, AIAlert } from '../types';

const API_KEY = process.env.API_KEY || "";

if (!API_KEY) {
  // Em um aplicativo real, você lidaria com isso de forma mais elegante.
  // Para este contexto, assumimos que a chave está presente.
  console.warn("A variável de ambiente API_KEY não está definida.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "Um resumo breve, de um parágrafo, sobre o estado de saúde atual do paciente com base na medição mais recente em contexto com o histórico. Deve ser escrito em um tom calmo e claro para um cuidador, em português do Brasil.",
    },
    alerts: {
      type: Type.ARRAY,
      description: "Uma lista de objetos de alerta para quaisquer tendências ou leituras preocupantes, com foco na medição mais recente.",
      items: {
        type: Type.OBJECT,
        properties: {
          level: {
            type: Type.STRING,
            enum: ['info', 'warning', 'critical'],
            description: "Nível de severidade do alerta. 'info' para observações, 'warning' para sugerir a consulta a um médico, 'critical' para atenção médica imediata.",
          },
          title: {
            type: Type.STRING,
            description: "Um título curto e claro para o alerta, em português do Brasil.",
          },
          description: {
            type: Type.STRING,
            description: "Uma explicação detalhada da preocupação e por que é um alerta, em português do Brasil.",
          },
          firstAid: {
              type: Type.STRING,
              description: "Apenas para alertas 'critical'. Instruções de primeiros socorros simples, seguras e passo a passo para o cuidador seguir enquanto aguarda os serviços de emergência. Deve ser muito claro e fácil de seguir sob estresse, em português do Brasil."
          },
          emergencyScript: {
              type: Type.STRING,
              description: "Apenas para alertas 'critical'. Um roteiro conciso para o cuidador ler aos serviços de emergência (ex: SAMU). Deve começar com 'Alerta médico para [Nome do Paciente]'. Inclua a idade do paciente, a condição principal e a medição exata que acionou o alerta. Ex: 'Pressão arterial de 185 por 110'. Seja breve e direto."
          }
        },
        required: ['level', 'title', 'description'],
      },
    },
    recommendations: {
        type: Type.ARRAY,
        description: "Uma lista de recomendações de cuidados gerais e não urgentes ou dicas com base nos dados, em português do Brasil.",
        items: {
            type: Type.STRING
        }
    }
  },
  required: ['summary', 'alerts', 'recommendations'],
};

const getAge = (birthDate: string) => {
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
    throw new Error("A chave da API do Google Gemini não está configurada.");
  }

  const formattedMetrics = metrics.map(m => ({
    timestamp: m.timestamp.toISOString(),
    type: m.type,
    ...m.value
  }));

  const latestMetric = formattedMetrics[0] || {};
  
  const prompt = `
    Analise os seguintes dados de saúde de um paciente e forneça uma resposta JSON estruturada em português do Brasil.

    **Sua Tarefa (Análise Proativa):**
    Você é uma IA assistente de saúde proativa, monitorando um paciente pós-AVC. Sua análise deve se concentrar **principalmente na medição mais recente** listada abaixo, contextualizando-a com o histórico do paciente e as medições anteriores. Aja como se a medição mais recente tivesse acabado de ser inserida. Sua resposta deve ser imediata e acionável para o cuidador.

    **Perfil do Paciente:**
    - Nome: ${patientProfile.name}
    - Idade: ${getAge(patientProfile.birthDate)}
    - Gênero: ${patientProfile.gender}
    - Condição Principal: ${patientProfile.mainCondition}
    - Histórico Médico Relevante: ${patientProfile.medicalHistory}
    - Alergias: ${patientProfile.allergies}

    **Medição Mais Recente para Análise Imediata:**
    ${JSON.stringify(latestMetric, null, 2)}

    **Histórico de Métricas Recentes (para contexto):**
    ${JSON.stringify(formattedMetrics.slice(1, 20), null, 2)}

    **Instruções de Análise:**
    1.  **Priorize a Segurança:** Sua principal diretiva é a segurança do paciente. Identifique imediatamente quaisquer leituras na medição mais recente que se desviem das faixas seguras para um paciente com este perfil.
    2.  **Gere Alertas Acionáveis:** Se a medição mais recente for preocupante, gere um alerta. Para alertas 'critical', forneça um roteiro de emergência ('emergencyScript') claro e conciso para o cuidador ler aos serviços de emergência (SAMU 192). O roteiro deve incluir o nome do paciente, idade, condição principal e a medição exata que disparou o alerta.
    3.  **Seja Claro e Calmo:** Toda a comunicação deve ser em português do Brasil, em um tom claro e tranquilizador, mas direto quando necessário.
    4.  **Siga o Esquema:** Sua resposta DEVE seguir estritamente o esquema JSON fornecido.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonText = response.text.trim();
    const analysis = JSON.parse(jsonText) as AIAnalysis;

    // Ensure emergencyScript is only present on critical alerts
    analysis.alerts = analysis.alerts.map((alert: AIAlert) => {
        if (alert.level !== 'critical') {
            delete alert.emergencyScript;
            delete alert.firstAid;
        }
        return alert;
    });

    return analysis;

  } catch (error)
  {
    console.error("Error analyzing health data with Gemini API:", error);
    throw new Error("Falha ao obter a análise da IA. Por favor, verifique o console para mais detalhes.");
  }
};