import React, { useMemo } from 'react';
import { HistoryEvent, HistoryEventType, MetricType, ScheduleItemType, AlertLevel } from '../types';
// FIX: Import missing ClipboardListIcon component used on line 138.
import { PillIcon, HeartIcon, CalendarIcon, ThermometerIcon, InfoIcon, WarningIcon, CriticalIcon, CheckCircleIcon, ClipboardListIcon } from './icons';

const metricDetails = {
    [MetricType.BloodPressure]: { icon: <HeartIcon className="w-5 h-5 text-red-500" />, label: "Pressão Arterial", format: (v: any) => `${v.systolic}/${v.diastolic} mmHg` },
    [MetricType.Temperature]: { icon: <ThermometerIcon className="w-5 h-5 text-orange-500" />, label: "Temperatura", format: (v: any) => `${v.temp?.toFixed(1)} °C` },
    [MetricType.Glucose]: { icon: <PillIcon className="w-5 h-5 text-purple-500" />, label: "Glicemia", format: (v: any) => `${v.level} mg/dL` },
    [MetricType.Saturation]: { icon: <HeartIcon className="w-5 h-5 text-blue-500" />, label: "Saturação", format: (v: any) => `${v.spO2}% SpO2` },
};

const scheduleIcons = {
    [ScheduleItemType.Medication]: <PillIcon className="w-5 h-5 text-blue-500" />,
    [ScheduleItemType.Care]: <HeartIcon className="w-5 h-5 text-green-500" />,
    [ScheduleItemType.Appointment]: <CalendarIcon className="w-5 h-5 text-indigo-500" />,
};

const alertDetails = {
    [AlertLevel.Info]: { icon: <InfoIcon className="w-5 h-5 text-blue-500" />, color: 'bg-blue-50' },
    [AlertLevel.Warning]: { icon: <WarningIcon className="w-5 h-5 text-yellow-500" />, color: 'bg-yellow-50' },
    [AlertLevel.Critical]: { icon: <CriticalIcon className="w-5 h-5 text-red-500" />, color: 'bg-red-50' },
};

const HistoryEventItem: React.FC<{ event: HistoryEvent }> = ({ event }) => {
    const time = event.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const renderEventContent = () => {
        switch (event.type) {
            case HistoryEventType.Metric: {
                const details = metricDetails[event.data.type];
                return (
                    <>
                        <div className="flex-shrink-0">{details.icon}</div>
                        <div className="flex-grow">
                            <p className="font-semibold">{details.label}: <span className="font-bold text-gray-800">{details.format(event.data.value)}</span></p>
                            {event.data.notes && <p className="text-sm text-gray-500 italic">Nota: {event.data.notes}</p>}
                        </div>
                    </>
                );
            }
            case HistoryEventType.Schedule: {
                 const { item } = event.data;
                 return (
                    <>
                        <div className="flex-shrink-0">{scheduleIcons[item.type]}</div>
                        <div className="flex-grow">
                            <p className="text-gray-600">Tarefa Concluída: <span className="font-semibold text-gray-800">{item.title}</span></p>
                        </div>
                    </>
                );
            }
            case HistoryEventType.Alert: {
                const details = alertDetails[event.data.level];
                return (
                     <>
                        <div className="flex-shrink-0">{details.icon}</div>
                        <div className="flex-grow">
                            <p className="font-semibold">{event.data.title}</p>
                            <p className="text-sm text-gray-600">{event.data.description}</p>
                        </div>
                    </>
                );
            }
            case HistoryEventType.Note:
                 return (
                    <>
                         <div className="flex-shrink-0"><CheckCircleIcon className="w-5 h-5 text-gray-500"/></div>
                        <div className="flex-grow">
                            <p className="font-semibold">Anotação do Dia</p>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{event.data.content}</p>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="flex items-start space-x-3 p-3 bg-white rounded-md shadow-sm">
            <span className="text-xs text-gray-500 font-mono mt-1">{time}</span>
            <div className="flex-grow flex items-start space-x-3">
               {renderEventContent()}
            </div>
        </div>
    );
};

export const HistoryPage: React.FC<{ log: HistoryEvent[] }> = ({ log }) => {
    
    const groupedLog = useMemo(() => {
        const groups: { [date: string]: HistoryEvent[] } = {};
        const sortedLog = [...log].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        sortedLog.forEach(event => {
            const dateStr = event.timestamp.toISOString().split('T')[0];
            if (!groups[dateStr]) {
                groups[dateStr] = [];
            }
            groups[dateStr].push(event);
        });
        return groups;
    }, [log]);

    const sortedDates = Object.keys(groupedLog).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    const formatDateHeader = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.getTime() === today.getTime()) return 'Hoje';
        if (date.getTime() === yesterday.getTime()) return 'Ontem';

        return new Intl.DateTimeFormat('pt-BR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }).format(date);
    };

    return (
        <div className="space-y-6">
             <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold">Histórico Completo</h2>
                <p className="text-gray-600">Um registro de todas as medições, tarefas, alertas e anotações.</p>
            </div>
            
            {sortedDates.length > 0 ? (
                sortedDates.map(date => (
                    <section key={date}>
                        <h3 className="text-xl font-semibold mb-3 text-gray-700 sticky top-[150px] bg-gray-50 py-2 z-10">{formatDateHeader(date)}</h3>
                        <div className="space-y-2">
                           {groupedLog[date].map(event => (
                               <HistoryEventItem key={event.id} event={event} />
                           ))}
                        </div>
                    </section>
                ))
            ) : (
                <div className="text-center bg-white p-10 rounded-lg shadow-md">
                    <ClipboardListIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Nenhum evento no histórico ainda.</p>
                    <p className="text-sm text-gray-400 mt-2">Novas medições, tarefas concluídas e anotações aparecerão aqui.</p>
                </div>
            )}
        </div>
    );
};