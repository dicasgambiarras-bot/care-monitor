import React from 'react';
import type { ScheduleItem } from '../types';
import { ScheduleCard } from './ScheduleCard';
import { toYYYYMMDD } from '../utils/dateUtils';

export const SchedulePage: React.FC<{ schedule: ScheduleItem[]; onAddItem: () => void; onEditItem?: (i: ScheduleItem) => void; onDeleteItem?: (id: string) => void; onToggleComplete?: (id: string, date: string) => void; isCaregiver?: boolean }> = ({ schedule, onAddItem, onEditItem, onDeleteItem, onToggleComplete, isCaregiver }) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2>Agenda</h2>
        <button onClick={onAddItem}>Adicionar</button>
      </div>
      <div className="space-y-2 mt-3">
        {schedule.map(s => <div key={s.id} className="flex items-start gap-2">
          <ScheduleCard item={s} onToggle={onToggleComplete || (()=>{})} occurrenceDate={toYYYYMMDD(new Date())} isCaregiver={isCaregiver} />
          {isCaregiver && <button onClick={() => onDeleteItem && onDeleteItem(s.id)}>✕</button>}
        </div>)}
      </div>
    </div>
  );
};
