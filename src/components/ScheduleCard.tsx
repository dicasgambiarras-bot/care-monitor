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
  return (
    <div className={`p-3 border rounded ${done ? 'opacity-60' : ''}`}>
      <div className="flex justify-between">
        <div>
          <div className="font-semibold">{item.title}</div>
          {item.startTime && <div className="text-sm text-gray-600">{item.startTime}</div>}
        </div>
        <div>
          {isCaregiver && <input type="checkbox" checked={!!done} onChange={() => onToggle(item.id, occurrenceDate)} />}
        </div>
      </div>
    </div>
  );
};
