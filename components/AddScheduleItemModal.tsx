import React, { useState, useEffect } from 'react';
import { ScheduleItem, ScheduleItemType, RecurrenceFrequency } from '../types';
import { XCircleIcon, PillIcon, HeartIcon, CalendarIcon } from './icons';

interface AddScheduleItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Omit<ScheduleItem, 'id' | 'completedDates'> & { id?: string }) => void;
  itemToEdit: ScheduleItem | null;
}

const itemTypeConfig = {
    [ScheduleItemType.Medication]: { label: "Medicamento", icon: <PillIcon className="w-6 h-6 text-blue-500" /> },
    [ScheduleItemType.Care]: { label: "Cuidado Pessoal", icon: <HeartIcon className="w-6 h-6 text-green-500" /> },
    [ScheduleItemType.Appointment]: { label: "Consulta", icon: <CalendarIcon className="w-6 h-6 text-indigo-500" /> },
};

const weekDays = [
    { label: 'D', value: 0 }, { label: 'S', value: 1 }, { label: 'T', value: 2 },
    { label: 'Q', value: 3 }, { label: 'Q', value: 4 }, { label: 'S', value: 5 },
    { label: 'S', value: 6 }
];

export const AddScheduleItemModal: React.FC<AddScheduleItemModalProps> = ({ isOpen, onClose, onSave, itemToEdit }) => {
    const [title, setTitle] = useState('');
    const [type, setType] = useState<ScheduleItemType>(ScheduleItemType.Medication);
    const [startDate, setStartDate] = useState('');
    const [time, setTime] = useState('');
    const [details, setDetails] = useState('');
    const [frequency, setFrequency] = useState<RecurrenceFrequency>(RecurrenceFrequency.None);
    const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
    const [endDate, setEndDate] = useState('');


    useEffect(() => {
        if (isOpen) {
            if (itemToEdit) {
                setTitle(itemToEdit.title);
                setType(itemToEdit.type);
                setStartDate(itemToEdit.startDate);
                setTime(itemToEdit.time);
                setDetails(itemToEdit.details || '');
                setFrequency(itemToEdit.frequency);
                setDaysOfWeek(itemToEdit.daysOfWeek || []);
                setEndDate(itemToEdit.endDate || '');
            } else {
                // Reset form for new item
                const now = new Date();
                const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];
                const localTime = now.toTimeString().slice(0,5);
                
                setTitle('');
                setType(ScheduleItemType.Medication);
                setStartDate(localDate);
                setTime(localTime);
                setDetails('');
                setFrequency(RecurrenceFrequency.None);
                setDaysOfWeek([]);
                setEndDate('');
            }
        }
    }, [isOpen, itemToEdit]);

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
           if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    const isFormValid = () => {
        if (!title || !startDate || !time) return false;
        if (frequency === RecurrenceFrequency.Weekly && daysOfWeek.length === 0) return false;
        return true;
    };

    const handleToggleDay = (dayValue: number) => {
        setDaysOfWeek(prev => 
            prev.includes(dayValue) 
                ? prev.filter(d => d !== dayValue) 
                : [...prev, dayValue]
        );
    };

    const handleSubmit = () => {
        if (!isFormValid()) return;
        onSave({
            id: itemToEdit?.id,
            title,
            type,
            startDate,
            time,
            details: details || undefined,
            frequency,
            daysOfWeek: frequency === RecurrenceFrequency.Weekly ? daysOfWeek : undefined,
            endDate: endDate || undefined,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg m-4 transform transition-all animate-fade-in-up max-h-[90vh] overflow-y-auto">
                <style>{`
                    @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
                    .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
                `}</style>
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-800">{itemToEdit ? 'Editar Item da Agenda' : 'Adicionar Novo Item'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XCircleIcon className="w-7 h-7" />
                    </button>
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Ex: Fisioterapia respiratória"/>
                    </div>

                    <div>
                        <p className="font-semibold mb-2 text-sm text-gray-700">Tipo</p>
                        <div className="grid grid-cols-3 gap-2">
                            {(Object.keys(itemTypeConfig) as ScheduleItemType[]).map(itemType => (
                                <button
                                    key={itemType}
                                    onClick={() => setType(itemType)}
                                    className={`flex items-center justify-center space-x-2 p-3 rounded-lg border-2 transition-colors ${type === itemType ? 'bg-blue-50 border-blue-500' : 'bg-gray-50 border-gray-200 hover:border-blue-300'}`}
                                >
                                    {itemTypeConfig[itemType].icon}
                                    <span className={`font-medium text-sm ${type === itemType ? 'text-blue-700' : 'text-gray-600'}`}>{itemTypeConfig[itemType].label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="p-3 bg-gray-50 rounded-lg border">
                        <p className="font-semibold mb-2 text-sm text-gray-700">Recorrência</p>
                         <div className="space-y-3">
                            <select value={frequency} onChange={e => setFrequency(e.target.value as RecurrenceFrequency)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                <option value={RecurrenceFrequency.None}>Não se repete</option>
                                <option value={RecurrenceFrequency.Daily}>Diariamente</option>
                                <option value={RecurrenceFrequency.Weekly}>Semanalmente</option>
                                <option value={RecurrenceFrequency.Monthly}>Mensalmente</option>
                            </select>

                            {frequency === RecurrenceFrequency.Weekly && (
                                <div className="flex justify-around bg-white p-2 rounded-md border">
                                    {weekDays.map(day => (
                                        <button key={day.value} onClick={() => handleToggleDay(day.value)} className={`w-8 h-8 rounded-full font-bold text-sm transition-colors ${daysOfWeek.includes(day.value) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}>
                                            {day.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                         </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">{frequency === RecurrenceFrequency.None ? 'Data' : 'Data de Início'}</label>
                            <input type="date" id="startDate" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                        <div>
                            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                            <input type="time" id="time" value={time} onChange={e => setTime(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                    </div>
                    
                     {frequency !== RecurrenceFrequency.None && (
                         <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">Data de Término (Opcional)</label>
                            <input type="date" id="endDate" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"/>
                        </div>
                     )}

                    <div>
                        <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">Detalhes (Opcional)</label>
                        <textarea id="details" value={details} onChange={e => setDetails(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Ex: Preparar 200ml de dieta enteral..."></textarea>
                    </div>
                </div>
                
                <div className="mt-8 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold">
                        Cancelar
                    </button>
                    <button onClick={handleSubmit} disabled={!isFormValid()} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors">
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
};