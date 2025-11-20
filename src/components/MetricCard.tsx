import React from 'react';
import type { HealthMetric } from '../types';

export const MetricCard: React.FC<{ metric: HealthMetric }> = ({ metric }) => {
  const displayValue = typeof metric.value === 'number' ? metric.value : JSON.stringify(metric.value);
  const typeLabels: { [key: string]: string } = {
    blood_pressure: 'Pressão Arterial',
    temperature: 'Temperatura',
    glucose: 'Glicose',
    oxygen_saturation: 'Saturação O₂',
    heart_rate: 'Frequência Cardíaca',
    weight: 'Peso',
  };
  
  return (
    <div className="bg-white p-3 sm:p-4 border-l-4 border-blue-500 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="text-xs sm:text-xs font-semibold text-blue-600 uppercase tracking-wider">
            {typeLabels[metric.type] || metric.type}
          </div>
          <div className="text-lg sm:text-2xl font-bold text-gray-800 mt-1">
            {displayValue}
            <span className="text-xs sm:text-sm text-gray-500 ml-1">{metric.unit}</span>
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-400 mt-2">
        {metric.timestamp instanceof Date ? metric.timestamp.toLocaleString('pt-BR') : metric.timestamp.toString()}
      </div>
    </div>
  );
};
