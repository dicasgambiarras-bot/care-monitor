import React, { useState } from 'react';
import type { MetricType, HealthMetric } from '../types';

export const AddMetricModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (m: Omit<HealthMetric, 'id'>) => void }> = ({ isOpen, onClose, onSave }) => {
  const [type, setType] = useState<MetricType>('blood_pressure');
  const [value, setValue] = useState<string>('');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white p-4 rounded">
        <h3>Adicionar Métrica</h3>
        <select value={type} onChange={e => setType(e.target.value as MetricType)}>
          <option value="blood_pressure">Pressão</option>
          <option value="temperature">Temperatura</option>
        </select>
        <input value={value} onChange={e => setValue(e.target.value)} />
        <div className="flex space-x-2">
          <button onClick={() => { onSave({ type, value: parseFloat(value) || 0, unit: '', timestamp: new Date() }); }}>Salvar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};
