import React, { useState, useEffect } from 'react';
import type { HealthMetric } from '../types';

interface AddMetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (metrics: Omit<HealthMetric, 'id'>[]) => void;
}

export const AddMetricModal: React.FC<AddMetricModalProps> = ({ isOpen, onClose, onSave }) => {
  // Estados para cada métrica possível
  const [bpSystolic, setBpSystolic] = useState('');
  const [bpDiastolic, setBpDiastolic] = useState('');
  const [temp, setTemp] = useState('');
  const [glucose, setGlucose] = useState('');
  const [oxygen, setOxygen] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [weight, setWeight] = useState('');
  
  // Resetar campos ao abrir o modal
  useEffect(() => {
    if (isOpen) {
      setBpSystolic('');
      setBpDiastolic('');
      setTemp('');
      setGlucose('');
      setOxygen('');
      setHeartRate('');
      setWeight('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const timestamp = new Date();
    const metricsToSave: Omit<HealthMetric, 'id'>[] = [];

    // 1. Pressão Arterial (Só salva se tiver os dois valores)
    if (bpSystolic && bpDiastolic) {
      metricsToSave.push({
        type: 'blood_pressure',
        value: { systolic: parseFloat(bpSystolic), diastolic: parseFloat(bpDiastolic) },
        unit: 'mmHg',
        timestamp
      });
    }

    // 2. Temperatura
    if (temp) {
      metricsToSave.push({
        type: 'temperature',
        value: parseFloat(temp),
        unit: '°C',
        timestamp
      });
    }

    // 3. Glicose
    if (glucose) {
      metricsToSave.push({
        type: 'glucose',
        value: parseFloat(glucose),
        unit: 'mg/dL',
        timestamp
      });
    }

    // 4. Saturação
    if (oxygen) {
      metricsToSave.push({
        type: 'oxygen_saturation',
        value: parseFloat(oxygen),
        unit: '%',
        timestamp
      });
    }

    // 5. Frequência Cardíaca
    if (heartRate) {
      metricsToSave.push({
        type: 'heart_rate',
        value: parseFloat(heartRate),
        unit: 'bpm',
        timestamp
      });
    }

    // 6. Peso
    if (weight) {
      metricsToSave.push({
        type: 'weight',
        value: parseFloat(weight),
        unit: 'kg',
        timestamp
      });
    }

    if (metricsToSave.length > 0) {
      onSave(metricsToSave);
    } else {
      alert("Por favor, preencha pelo menos uma medição para salvar.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-lg w-full my-8 border-t-4 border-blue-500">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">🩺 Check-up de Sinais Vitais</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
        </div>
        
        <p className="text-sm text-gray-500 mb-5 bg-blue-50 p-3 rounded-md border border-blue-100">
          📝 <strong>Instrução:</strong> Preencha apenas os dados coletados agora. Campos em branco serão ignorados pela IA.
        </p>

        <div className="space-y-5">
          {/* Seção Destacada: Pressão Arterial */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              ❤️ Pressão Arterial (mmHg)
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                <span className="text-xs text-gray-500 block mb-1 font-medium">Sistólica (Máxima)</span>
                <input
                  type="number"
                  value={bpSystolic}
                  onChange={e => setBpSystolic(e.target.value)}
                  placeholder="Ex: 120"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                />
              </div>
              <div className="flex-1">
                <span className="text-xs text-gray-500 block mb-1 font-medium">Diastólica (Mínima)</span>
                <input
                  type="number"
                  value={bpDiastolic}
                  onChange={e => setBpDiastolic(e.target.value)}
                  placeholder="Ex: 80"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                />
              </div>
            </div>
          </div>

          {/* Grid para os outros inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">🌡️ Temperatura (°C)</label>
              <input
                type="number"
                step="0.1"
                value={temp}
                onChange={e => setTemp(e.target.value)}
                placeholder="Ex: 36.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">🩸 Glicemia (mg/dL)</label>
              <input
                type="number"
                value={glucose}
                onChange={e => setGlucose(e.target.value)}
                placeholder="Ex: 98"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">🌬️ Saturação O₂ (%)</label>
              <input
                type="number"
                value={oxygen}
                onChange={e => setOxygen(e.target.value)}
                placeholder="Ex: 98"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">💓 Freq. Cardíaca (bpm)</label>
              <input
                type="number"
                value={heartRate}
                onChange={e => setHeartRate(e.target.value)}
                placeholder="Ex: 72"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">⚖️ Peso (kg) - <span className='text-gray-400 font-normal'>Opcional</span></label>
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                placeholder="Ex: 75.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 mt-8">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Salvar Check-up
          </button>
        </div>
      </div>
    </div>
  );
};