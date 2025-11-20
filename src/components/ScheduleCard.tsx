import React from 'react';
import type { ScheduleItem } from '../types';

interface Props {
  item: ScheduleItem;
  onToggle: (id: string, date: string) => void;
  occurrenceDate: string;
  isCaregiver?: boolean;
}

export const ScheduleCard: React.FC<Props> = ({ item, onToggle, occurrenceDate, isCaregiver }) => {
  const done = item.completedDates?.[occurrenceDate];
  const typeColors: { [key: string]: string } = {
    medication: 'bg-blue-100 border-blue-300',
    appointment: 'bg-purple-100 border-purple-300',
    care: 'bg-green-100 border-green-300',
  };
  
  return (
    <div className={`p-3 sm:p-4 border rounded-lg transition-all duration-200 w-full ${done ? 'opacity-50 bg-gray-50' : typeColors[item.type] || 'bg-white'}`}>
      <div className="flex justify-between items-start sm:items-center gap-2">
        <div className="flex-1 min-w-0">
          <div className={`font-semibold text-sm sm:text-base text-gray-800 ${done ? 'line-through text-gray-500' : ''}`}>
            {item.title}
          </div>
          {item.startTime && <div className="text-xs sm:text-sm text-gray-600 mt-1">⏰ {item.startTime}</div>}
        </div>
        {isCaregiver && (
          <label className="flex items-center cursor-pointer ml-2 flex-shrink-0">
            <input
              type="checkbox"
              checked={!!done}
              onChange={() => onToggle(item.id, occurrenceDate)}
              className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="ml-1 sm:ml-2 text-xs font-semibold text-gray-600 hidden sm:inline">Concluído</span>
          </label>
        )}
      </div>
    </div>
  );
};
