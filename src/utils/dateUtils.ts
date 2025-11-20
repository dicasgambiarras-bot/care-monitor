import type { ScheduleItem as SItem } from '../types';

export function toYYYYMMDD(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getScheduleForDate(schedule: SItem[], date: Date): SItem[] {
  const dateStr = toYYYYMMDD(date);
  return schedule.filter(item => item.date === dateStr);
}
