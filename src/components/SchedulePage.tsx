import React from 'react';
import type { ScheduleItem } from '../types';
import { ScheduleCard } from './ScheduleCard';
import { toYYYYMMDD } from '../utils/dateUtils';

export const SchedulePage: React.FC<{ schedule: ScheduleItem[]; onAddItem: () => void; onEditItem?: (i: ScheduleItem) => void; onDeleteItem?: (id: string) => void; onToggleComplete?: (id: string, date: string) => void; isCaregiver?: boolean }> = ({ schedule, onAddItem, onEditItem, onDeleteItem, onToggleComplete, isCaregiver }) => {
  const todaySchedule = schedule.filter(s => s.date === toYYYYMMDD(new Date()));
  const futureSchedule = schedule.filter(s => s.date > toYYYYMMDD(new Date()));
  
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex justify-between items-center gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">📅 Agenda</h1>
        {isCaregiver && (
          <button
            onClick={onAddItem}
            className="bg-blue-600 text-white font-semibold py-2 px-3 sm:px-4 text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap"
          >
            + Adicionar
          </button>
        )}
      </div>
      
      {todaySchedule.length > 0 && (
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">Hoje</h2>
          <div className="space-y-2 sm:space-y-3">
            {todaySchedule.map(s => (
              <div key={s.id} className="flex items-start gap-2 sm:gap-3">
                <div className="flex-1 min-w-0">
                  <ScheduleCard item={s} onToggle={onToggleComplete || (()=>{})} occurrenceDate={toYYYYMMDD(new Date())} isCaregiver={isCaregiver} />
                </div>
                {isCaregiver && (
                  <button
                    onClick={() => onDeleteItem && onDeleteItem(s.id)}
                    className="text-red-600 hover:text-red-800 font-bold text-lg transition-colors duration-200 flex-shrink-0 mt-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {futureSchedule.length > 0 && (
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">Próximos Dias</h2>
          <div className="space-y-2 sm:space-y-3">
            {futureSchedule.map(s => (
              <div key={s.id} className="flex items-start gap-2 sm:gap-3">
                <div className="flex-1 min-w-0">
                  <ScheduleCard item={s} onToggle={onToggleComplete || (()=>{})} occurrenceDate={s.date} isCaregiver={isCaregiver} />
                </div>
                {isCaregiver && (
                  <button
                    onClick={() => onDeleteItem && onDeleteItem(s.id)}
                    className="text-red-600 hover:text-red-800 font-bold text-lg transition-colors duration-200 flex-shrink-0 mt-1"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {schedule.length === 0 && (
        <div className="text-center p-6 sm:p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-base sm:text-lg">Nenhum item agendado.</p>
        </div>
      )}
    </div>
  );
};
