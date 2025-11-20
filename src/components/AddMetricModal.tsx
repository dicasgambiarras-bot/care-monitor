import React, { useState } from 'react';
import type { MetricType, HealthMetric } from '../types';

export const AddMetricModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (m: Omit<HealthMetric, 'id'>) => void }> = ({ isOpen, onClose, onSave }) => {
  const [type, setType] = useState<MetricType>('blood_pressure');
  const [value, setValue] = useState<string>('');
  
  const metricUnits: { [key in MetricType]?: string } = {
    blood_pressure: 'mmHg',
    temperature: '°C',
    glucose: 'mg/dL',
    oxygen_saturation: '%',
    heart_rate: 'bpm',
    weight: 'kg',
  };
  
  const metricLabels: { [key in MetricType]?: string } = {
    blood_pressure: 'Pressão Arterial',
    temperature: 'Temperatura',
    glucose: 'Glicose',
    oxygen_saturation: 'Saturação O₂',
    heart_rate: 'Frequência Cardíaca',
    weight: 'Peso',
  };
  
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">📊 Adicionar Métrica</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Métrica</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as MetricType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="blood_pressure">Pressão Arterial</option>
              <option value="temperature">Temperatura</option>
              <option value="glucose">Glicose</option>
              <option value="oxygen_saturation">Saturação O₂</option>
              <option value="heart_rate">Frequência Cardíaca</option>
              <option value="weight">Peso</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Valor ({metricUnits[type] || 'unidade'})
            </label>
            <input
              type="number"
              value={value}
              onChange={e => setValue(e.target.value)}
              placeholder="Digite o valor"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => {
              onSave({
                type,
                value: parseFloat(value) || 0,
                unit: metricUnits[type] || '',
                timestamp: new Date()
              });
              setValue('');
              onClose();
            }}
            className="flex-1 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Salvar
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
