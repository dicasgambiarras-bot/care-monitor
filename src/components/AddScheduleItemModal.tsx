import React, { useState } from 'react';
import type { ScheduleItem, RecurrenceFrequency, ScheduleItemType } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: any) => void;
  itemToEdit?: ScheduleItem | null;
}

export const AddScheduleItemModal: React.FC<Props> = ({ isOpen, onClose, onSave, itemToEdit }) => {
  const [title, setTitle] = useState(itemToEdit?.title || '');
  const [date, setDate] = useState(itemToEdit?.date || new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(itemToEdit?.startTime || '09:00');
  const [type, setType] = useState<ScheduleItemType>(itemToEdit?.type || 'medication');
  const [frequency, setFrequency] = useState<RecurrenceFrequency>(itemToEdit?.frequency || 'daily');
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-md w-full">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          {itemToEdit ? '✏️ Editar Item' : '➕ Agendar Cuidado'}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">O que será feito?</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Losartana 50mg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Categoria</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as ScheduleItemType)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="medication">💊 Medicação</option>
                <option value="care">❤️ Cuidado (Banho, etc)</option>
                <option value="appointment">📅 Consulta</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Horário</label>
              <input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <label className="block text-sm font-bold text-gray-700 mb-2">Frequência / Repetição</label>
            <div className="grid grid-cols-2 gap-2 mb-3">
                <button 
                    type="button"
                    onClick={() => setFrequency('daily')}
                    className={`px-2 py-2 text-sm rounded-md border ${frequency === 'daily' ? 'bg-blue-100 border-blue-500 text-blue-700 font-bold' : 'bg-white border-gray-300 text-gray-600'}`}
                >
                    Todo Dia
                </button>
                <button 
                    type="button"
                    onClick={() => setFrequency('once')}
                    className={`px-2 py-2 text-sm rounded-md border ${frequency === 'once' ? 'bg-blue-100 border-blue-500 text-blue-700 font-bold' : 'bg-white border-gray-300 text-gray-600'}`}
                >
                    Uma vez
                </button>
                <button 
                    type="button"
                    onClick={() => setFrequency('weekly')}
                    className={`px-2 py-2 text-sm rounded-md border ${frequency === 'weekly' ? 'bg-blue-100 border-blue-500 text-blue-700 font-bold' : 'bg-white border-gray-300 text-gray-600'}`}
                >
                    Semanal
                </button>
                <button 
                    type="button"
                    onClick={() => setFrequency('monthly')}
                    className={`px-2 py-2 text-sm rounded-md border ${frequency === 'monthly' ? 'bg-blue-100 border-blue-500 text-blue-700 font-bold' : 'bg-white border-gray-300 text-gray-600'}`}
                >
                    Mensal
                </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                {frequency === 'daily' ? 'Começar a partir de:' : 'Data do compromisso:'}
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onSave({ ...itemToEdit, title, date, startTime, type, frequency })}
            className="flex-1 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            Confirmar
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};