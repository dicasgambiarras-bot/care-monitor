import React from 'react';
import type { HealthMetric } from '../types';

export const MetricCard: React.FC<{ metric: HealthMetric }> = ({ metric }) => {
  // Lógica para exibir valor: trata objeto (PA) ou número simples
  let displayValue: string | number = '';

  if (metric.type === 'blood_pressure' && typeof metric.value === 'object') {
     displayValue = `${metric.value.systolic} / ${metric.value.diastolic}`;
  } else if (typeof metric.value === 'number') {
     displayValue = metric.value;
  } else {
     displayValue = JSON.stringify(metric.value);
  }

  // Configuração de Labels e Ícones (Texto)
  const typeConfig: { [key: string]: { label: string; icon: string } } = {
    blood_pressure: { label: 'Pressão Arterial', icon: '❤️' },
    temperature: { label: 'Temperatura', icon: '🌡️' },
    glucose: { label: 'Glicose', icon: '🩸' },
    oxygen_saturation: { label: 'Saturação O₂', icon: '🌬️' },
    heart_rate: { label: 'Freq. Cardíaca', icon: '💓' },
    weight: { label: 'Peso', icon: '⚖️' },
  };

  const config = typeConfig[metric.type] || { label: metric.type, icon: '📊' };
  
  // Configuração de Cores (Borda lateral e Texto do valor)
  const typeColors: { [key: string]: string } = {
      blood_pressure: 'border-red-500 text-red-700', 
      temperature: 'border-orange-500 text-orange-700',
      glucose: 'border-pink-500 text-pink-700',
      oxygen_saturation: 'border-blue-500 text-blue-700',
      heart_rate: 'border-red-600 text-red-800',
      weight: 'border-gray-500 text-gray-700', 
  };

  const colorClass = typeColors[metric.type] || 'border-blue-500 text-blue-600';
  const [borderColor, textColor] = colorClass.split(' ');

  return (
    <div className={`bg-white p-4 border-l-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${borderColor}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <span>{config.icon}</span> {config.label}
          </div>
          <div className={`text-2xl font-extrabold mt-1 ${textColor}`}>
            {displayValue}
            <span className="text-xs font-medium text-gray-400 ml-1 align-top">{metric.unit}</span>
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-400 mt-3 flex justify-end">
        {metric.timestamp instanceof Date 
          ? metric.timestamp.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit' }) 
          : metric.timestamp.toString()}
      </div>
    </div>
  );
};