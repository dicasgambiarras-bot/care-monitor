import React, { useState } from 'react';
import type { ScheduleItem } from '../types';

export const AddScheduleItemModal: React.FC<{ isOpen: boolean; onClose: () => void; onSave: (item: any) => void; itemToEdit?: ScheduleItem | null }> = ({ isOpen, onClose, onSave, itemToEdit }) => {
  const [title, setTitle] = useState(itemToEdit?.title || '');
  const [date, setDate] = useState(itemToEdit?.date || new Date().toISOString().split('T')[0]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-white p-4 rounded">
        <h3>{itemToEdit ? 'Editar' : 'Adicionar'} Item</h3>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <div className="flex space-x-2">
          <button onClick={() => onSave({ ...itemToEdit, title, date, startTime: '09:00' })}>Salvar</button>
          <button onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
};
