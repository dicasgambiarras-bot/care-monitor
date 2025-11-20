import type { HealthMetric, AIAnalysis, PatientProfile } from '../types';

export async function analyzeHealthData(metrics: HealthMetric[], profile: PatientProfile): Promise<AIAnalysis> {
  // implementação mínima / mock
  const alerts = [];
  const recommendations: string[] = [];

  if (metrics.length === 0) {
    return {
      id: String(Date.now()),
      timestamp: new Date(),
      summary: 'Sem dados para análise',
      alerts,
      recommendations,
    };
  }

  // exemplo simples
  const latest = metrics[0];
  if (latest && latest.type === 'temperature') {
    const val = typeof latest.value === 'number' ? latest.value : (latest.value.temp ?? null);
    if (typeof val === 'number' && val > 38) {
      alerts.push({ level: 'warning', message: 'Temperatura elevada' });
      recommendations.push('Verificar febre e consultar profissional.');
    }
  }

  return {
    id: String(Date.now()),
    timestamp: new Date(),
    summary: `Análise básica de ${metrics.length} métrica(s)`,
    alerts,
    recommendations,
  };
}
