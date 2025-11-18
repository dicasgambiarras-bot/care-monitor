import React, { useMemo } from 'react';
import { ScheduleItem, ScheduleItemType, RecurrenceFrequency } from '../types';
import { PillIcon, HeartIcon, CalendarIcon, PlusCircleIcon, PencilIcon, TrashIcon, CheckCircleIcon } from './icons';

interface SchedulePageProps {
  schedule: ScheduleItem[];
  onAddItem: () => void;
  onEditItem: (item: ScheduleItem) => void;
  onDeleteItem: (id: string) => void;
  onToggleComplete: (id: string, date: string) => void;
  isCaregiver: boolean;
}

const icons = {
    [ScheduleItemType.Medication]: <PillIcon className="w-6 h-6 text-blue-500" />,
    [ScheduleItemType.Care]: <HeartIcon className="w-6 h-6 text-green-500" />,
    [ScheduleItemType.Appointment]: <CalendarIcon className="w-6 h-6 text-indigo-500" />,
};

const toYYYYMMDD = (date: Date) => date.toISOString().split('T')[0];

// This function expands recurring events into a list of occurrences for a given date range
const expandSchedule = (schedule: ScheduleItem[], numDays: number) => {
    const occurrences: { [date: string]: ScheduleItem[] } = {};
    const today = new Date();
    today.setHours(0,0,0,0);

    schedule.forEach(item => {
        for (let i = 0; i < numDays; i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            const itemStartDate = new Date(item.startDate + 'T00:00:00');
            const itemEndDate = item.endDate ? new Date(item.endDate + 'T00:00:00') : null;

            if (currentDate < itemStartDate) continue;
            if (itemEndDate && currentDate > itemEndDate) continue;

            let shouldAdd = false;
            switch (item.frequency) {
                case RecurrenceFrequency.None:
                    if (toYYYYMMDD(currentDate) === item.startDate) shouldAdd = true;
                    break;
                case RecurrenceFrequency.Daily:
                    shouldAdd = true;
                    break;
                case RecurrenceFrequency.Weekly:
                    if (item.daysOfWeek?.includes(currentDate.getDay())) shouldAdd = true;
                    break;
                case RecurrenceFrequency.Monthly:
                    if (currentDate.getDate() === itemStartDate.getDate()) shouldAdd = true;
                    break;
            }

            if (shouldAdd) {
                const dateStr = toYYYYMMDD(currentDate);
                if (!occurrences[dateStr]) {
                    occurrences[dateStr] = [];
                }
                occurrences[dateStr].push(item);
            }
        }
    });
    
    // Sort items within each day by time
    Object.keys(occurrences).forEach(date => {
        occurrences[date].sort((a, b) => a.time.localeCompare(b.time));
    });
    
    return occurrences;
};


const ScheduleListItem: React.FC<{ item: ScheduleItem, occurrenceDate: string, onEdit: () => void, onDelete: () => void, onToggle: () => void, isCaregiver: boolean }> = ({ item, occurrenceDate, onEdit, onDelete, onToggle, isCaregiver }) => {
    const isCompleted = !!item.completedDates[occurrenceDate];
    
    return (
        <div className={`p-4 rounded-lg shadow-md flex items-start space-x-4 transition-all ${isCompleted ? 'bg-gray-100 opacity-70' : 'bg-white'}`}>
            <button 
                onClick={onToggle} 
                disabled={!isCaregiver}
                className={`mt-1 p-1 rounded-full transition-colors ${isCompleted ? 'text-green-600' : 'text-gray-400'} ${isCaregiver ? 'hover:text-green-700' : 'cursor-not-allowed'}`}>
                <CheckCircleIcon className="w-6 h-6" />
            </button>
            <div className="flex-shrink-0 mt-1">{icons[item.type]}</div>
            <div className="flex-grow">
                <p className={`font-bold text-gray-800 ${isCompleted ? 'line-through' : ''}`}>{item.title}</p>
                <p className="text-sm text-gray-600">{item.time}</p>
                {item.details && <p className="text-sm text-gray-500 mt-1 whitespace-pre-wrap">{item.details}</p>}
            </div>
             {isCaregiver && (
                <div className="flex space-x-2">
                    <button onClick={onEdit} className="text-gray-400 hover:text-blue-500 p-2"><PencilIcon className="w-5 h-5"/></button>
                    <button onClick={onDelete} className="text-gray-400 hover:text-red-500 p-2"><TrashIcon className="w-5 h-5"/></button>
                </div>
            )}
        </div>
    )
};

export const SchedulePage: React.FC<SchedulePageProps> = ({ schedule, onAddItem, onEditItem, onDeleteItem, onToggleComplete, isCaregiver }) => {
    
    const futureOccurrences = useMemo(() => expandSchedule(schedule, 30), [schedule]);
    const sortedDates = Object.keys(futureOccurrences).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    const formatDateHeader = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.getTime() === today.getTime()) return 'Hoje';
        if (date.getTime() === tomorrow.getTime()) return 'Amanhã';

        return new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(date);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold">Agenda de Cuidados</h2>
                <button
                    onClick={onAddItem}
                    disabled={!isCaregiver}
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 flex items-center space-x-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    <PlusCircleIcon className="w-5 h-5" />
                    <span>Novo Item</span>
                </button>
            </div>

            {sortedDates.length > 0 ? (
                sortedDates.map(date => (
                    <section key={date}>
                        <h3 className="text-xl font-semibold mb-3 text-gray-700">{formatDateHeader(date)}</h3>
                        <div className="space-y-3">
                            {futureOccurrences[date].map(item => (
                                <ScheduleListItem 
                                    key={`${item.id}-${date}`}
                                    item={item}
                                    occurrenceDate={date}
                                    onEdit={() => onEditItem(item)}
                                    onDelete={() => onDeleteItem(item.id)}
                                    onToggle={() => onToggleComplete(item.id, date)}
                                    isCaregiver={isCaregiver}
                                />
                            ))}
                        </div>
                    </section>
                ))
            ) : (
                <div className="text-center bg-white p-10 rounded-lg shadow-md">
                    <CalendarIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Nenhum item na agenda.</p>
                     {isCaregiver && <p className="text-sm text-gray-400 mt-2">Clique em "Novo Item" para começar a planejar os cuidados.</p>}
                </div>
            )}
        </div>
    );
};