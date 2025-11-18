
import React, { useState, useEffect } from 'react';
import { MetricType, HealthMetric } from '../types';
import { HeartIcon, ThermometerIcon, PillIcon, XCircleIcon } from './icons';

interface AddMetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (metric: Omit<HealthMetric, 'id'>) => void;
}

const metricConfig = {
    [MetricType.BloodPressure]: {
        label: "Pressão Arterial",
        icon: <HeartIcon className="w-6 h-6 text-red-500" />,
        fields: [
            { name: 'systolic', label: 'Sistólica (mmHg)', type: 'number' },
            { name: 'diastolic', label: 'Diastólica (mmHg)', type: 'number' },
        ]
    },
    [MetricType.Temperature]: {
        label: "Temperatura",
        icon: <ThermometerIcon className="w-6 h-6 text-orange-500" />,
        fields: [{ name: 'temp', label: 'Temperatura (°C)', type: 'number', step: '0.1' }]
    },
    [MetricType.Glucose]: {
        label: "Glicemia",
        icon: <PillIcon className="w-6 h-6 text-purple-500" />,
        fields: [{ name: 'level', label: 'Nível (mg/dL)', type: 'number' }]
    },
    [MetricType.Saturation]: {
        label: "Saturação",
        icon: <HeartIcon className="w-6 h-6 text-blue-500" />,
        fields: [{ name: 'spO2', label: 'SpO2 (%)', type: 'number' }]
    },
};

export const AddMetricModal: React.FC<AddMetricModalProps> = ({ isOpen, onClose, onSave }) => {
    const [selectedType, setSelectedType] = useState<MetricType>(MetricType.BloodPressure);
    const [values, setValues] = useState<any>({});
    const [notes, setNotes] = useState('');
    const [entryMode, setEntryMode] = useState<'now' | 'historical'>('now');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');


    const resetForm = () => {
        setValues({});
        setNotes('');
        setEntryMode('now');
        const now = new Date();
        const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];
        const localTime = now.toTimeString().slice(0,5);
        setDate(localDate);
        setTime(localTime);
    }
    
    useEffect(() => {
        resetForm();
    }, [selectedType]);
    
    useEffect(() => {
        if (isOpen) {
            resetForm();
            setSelectedType(MetricType.BloodPressure); // Reset type only when modal opens
        }
    }, [isOpen])

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') {
              onClose();
           }
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    if (!isOpen) return null;

    const handleValueChange = (field: string, value: string) => {
        setValues(prev => ({ ...prev, [field]: value ? parseFloat(value) : undefined }));
    };

    const isFormValid = () => {
        const config = metricConfig[selectedType];
        const valuesValid = config.fields.every(field => values[field.name] != null && values[field.name] > 0);
        if (entryMode === 'historical') {
            return valuesValid && date && time;
        }
        return valuesValid;
    };

    const handleSubmit = () => {
        if (!isFormValid()) return;
        
        let timestamp: Date;
        if (entryMode === 'historical') {
            timestamp = new Date(`${date}T${time}`);
        } else {
            timestamp = new Date();
        }

        onSave({
            type: selectedType,
            value: values,
            notes: notes || undefined,
            timestamp,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4 transform transition-all animate-fade-in-up">
                <style>{`
                    @keyframes fade-in-up {
                        0% { opacity: 0; transform: translateY(20px); }
                        100% { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
                `}</style>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Registrar Nova Medição</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XCircleIcon className="w-7 h-7" />
                    </button>
                </div>
                
                <div className="mb-4">
                    <p className="font-semibold mb-2 text-gray-700">Tipo de Medição</p>
                    <div className="grid grid-cols-2 gap-2">
                        {(Object.keys(metricConfig) as MetricType[]).map(type => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-colors ${selectedType === type ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-200 hover:border-blue-300'}`}
                            >
                                {metricConfig[type].icon}
                                <span className={`font-medium ${selectedType === type ? 'text-blue-700' : 'text-gray-600'}`}>{metricConfig[type].label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Entry Mode Toggle */}
                    <div className="mb-4">
                        <div className="flex bg-gray-200 rounded-lg p-1">
                            <button 
                                onClick={() => setEntryMode('now')}
                                className={`w-full py-2 rounded-md text-sm font-semibold transition-colors ${entryMode === 'now' ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}
                            >
                                Registrar Agora
                            </button>
                            <button
                                onClick={() => setEntryMode('historical')}
                                className={`w-full py-2 rounded-md text-sm font-semibold transition-colors ${entryMode === 'historical' ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}
                            >
                                Registrar Histórico
                            </button>
                        </div>
                    </div>

                     {entryMode === 'historical' && (
                        <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg border">
                            <div>
                                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Data da Medição</label>
                                <input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                             <div>
                                <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Hora da Medição</label>
                                <input
                                    type="time"
                                    id="time"
                                    name="time"
                                    value={time}
                                    onChange={e => setTime(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    )}


                    {metricConfig[selectedType].fields.map(field => (
                         <div key={field.name}>
                            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                            <input
                                type={field.type}
                                id={field.name}
                                name={field.name}
                                step={field.step || '1'}
                                value={values[field.name] || ''}
                                onChange={(e) => handleValueChange(field.name, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                    ))}
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notas (Opcional)</label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ex: Medido após o almoço."
                        />
                    </div>
                </div>
                
                <div className="mt-8 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold">
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSubmit}
                        disabled={!isFormValid()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
                    >
                        Salvar Medição
                    </button>
                </div>
            </div>
        </div>
    );
};
