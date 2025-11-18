import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  HealthMetric,
  MetricType,
  ScheduleItem,
  ScheduleItemType,
  AIAnalysis,
  AlertLevel,
  AIAlert,
  PatientProfile,
  RecurrenceFrequency,
  UrgentService,
  UserRole,
  TeamMember,
  HistoryEvent,
  HistoryEventType,
  DailyNote,
} from './types';
import { analyzeHealthData } from './services/geminiService';
import {
    PillIcon,
    HeartIcon,
    CalendarIcon,
    ThermometerIcon,
    CheckCircleIcon,
    HomeIcon,
    SparklesIcon,
    PlusCircleIcon,
    InfoIcon,
    WarningIcon,
    CriticalIcon,
    UserCircleIcon,
    PhoneIcon,
    XCircleIcon,
    ClipboardListIcon,
} from './components/icons';
import { AddMetricModal } from './components/AddMetricModal';
import { PatientProfilePage } from './components/PatientProfilePage';
import { EditProfileModal } from './components/EditProfileModal';
import { SchedulePage } from './components/SchedulePage';
import { AddScheduleItemModal } from './components/AddScheduleItemModal';
import { UrgentContactsBar } from './components/UrgentContactsBar';
import { ManageTeamModal } from './components/ManageTeamModal';
import { HistoryPage } from './components/HistoryPage';
import { DailyNotesCard } from './components/DailyNotesCard';


// Mock Data
const generateMockMetrics = (): HealthMetric[] => {
    const metrics: HealthMetric[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
        const day = new Date(now);
        day.setDate(now.getDate() - i);
        
        metrics.push({id: `bp-${i}`, type: MetricType.BloodPressure, value: {systolic: 130 + Math.floor(Math.random() * 20) - 10, diastolic: 80 + Math.floor(Math.random() * 10) - 5}, timestamp: day});
        metrics.push({id: `temp-${i}`, type: MetricType.Temperature, value: {temp: 36.5 + Math.random() * 1.5 - 0.5}, timestamp: day});
        metrics.push({id: `gluc-${i}`, type: MetricType.Glucose, value: {level: 90 + Math.floor(Math.random() * 30) - 15}, timestamp: day});
        metrics.push({id: `sat-${i}`, type: MetricType.Saturation, value: {spO2: 95 + Math.floor(Math.random() * 4)}, timestamp: day});
    }
    return metrics.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const todayStr = new Date().toISOString().split('T')[0];
const oneMonthFromNow = new Date();
oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);
const oneMonthFromNowStr = oneMonthFromNow.toISOString().split('T')[0];

const initialSchedule: ScheduleItem[] = [
    {id: 'med1', type: ScheduleItemType.Medication, title: 'Anticoagulante', startDate: todayStr, time: '08:00', frequency: RecurrenceFrequency.Daily, completedDates: {}},
    {id: 'med2', type: ScheduleItemType.Medication, title: 'Anti-hipertensivo', startDate: todayStr, time: '08:00', frequency: RecurrenceFrequency.Daily, completedDates: {}},
    {id: 'care1', type: ScheduleItemType.Care, title: 'Banho', startDate: todayStr, time: '09:00', frequency: RecurrenceFrequency.Daily, completedDates: {}},
    {id: 'med3', type: ScheduleItemType.Medication, title: 'Vitamina D', startDate: todayStr, time: '12:00', frequency: RecurrenceFrequency.Daily, completedDates: {}},
    {id: 'appoint1', type: ScheduleItemType.Appointment, title: 'Fonoaudióloga', startDate: "2024-01-01", time: '14:00', details: 'Dra. Sofia', frequency: RecurrenceFrequency.Weekly, daysOfWeek: [1], completedDates: {}}, // Mondays
    {id: 'appoint2', type: ScheduleItemType.Appointment, title: 'Fisioterapia', startDate: "2024-01-01", time: '09:00', details: 'Exercícios de mobilidade.', frequency: RecurrenceFrequency.Weekly, daysOfWeek: [2, 5], completedDates: {}}, // Tuesdays and Fridays
    {id: 'appoint3', type: ScheduleItemType.Appointment, title: 'Consulta com Clínico Geral', startDate: oneMonthFromNowStr, time: '15:00', details: 'Dr. Carlos, na clínica Reabilita.', frequency: RecurrenceFrequency.None, completedDates: {}},
    {id: 'med4', type: ScheduleItemType.Medication, title: 'Anticoagulante', startDate: todayStr, time: '20:00', frequency: RecurrenceFrequency.Daily, completedDates: {}},
];

const initialTeam: TeamMember[] = [
    { id: 'user1', name: 'Maria (Filha)', role: UserRole.Caregiver },
    { id: 'user2', name: 'Carlos (Filho)', role: UserRole.Caregiver },
    { id: 'user3', name: 'Ana (Esposa)', role: UserRole.Caregiver },
    { id: 'user4', name: 'João (Filho)', role: UserRole.Observer },
    { id: 'user5', name: 'Dr. Ricardo', role: UserRole.Professional },
]

const initialPatientProfile: PatientProfile = {
    name: "José Silva",
    birthDate: "1952-03-15",
    gender: "Masculino",
    mainCondition: "Pós-AVC (Acidente Vascular Cerebral) Isquêmico",
    medicalHistory: "Hipertensão Arterial Sistêmica (HAS), Diabetes Mellitus Tipo 2.",
    allergies: "Nenhuma conhecida.",
    surgeries: "Apendicectomia em 1985.",
    emergencyContacts: [
        { id: 'ec1', name: "Maria Silva", relationship: "Filha", phone: "(11) 98765-4321" },
    ],
    physicianContacts: [
        { id: 'pc1', name: "Dr. Carlos Batista", relationship: "Clínico Geral", phone: "(11) 12345-6789" },
    ],
    team: initialTeam,
}

const urgentServices: UrgentService[] = [
    { name: "SAMU", phone: "192" },
    { name: "Bombeiros", phone: "193" },
    { name: "Polícia Militar", phone: "190" },
];


// Helper Components defined outside App to prevent re-creation on re-renders

const MetricCard: React.FC<{ metric: HealthMetric }> = ({ metric }) => {
    const { type, value, timestamp, notes } = metric;
    
    const metricDetails = {
        [MetricType.BloodPressure]: { icon: <HeartIcon className="w-6 h-6 text-red-500" />, label: "Pressão Arterial", value: `${value.systolic}/${value.diastolic} mmHg` },
        [MetricType.Temperature]: { icon: <ThermometerIcon className="w-6 h-6 text-orange-500" />, label: "Temperatura", value: `${value.temp?.toFixed(1)} °C` },
        [MetricType.Glucose]: { icon: <PillIcon className="w-6 h-6 text-purple-500" />, label: "Glicemia", value: `${value.level} mg/dL` },
        [MetricType.Saturation]: { icon: <HeartIcon className="w-6 h-6 text-blue-500" />, label: "Saturação", value: `${value.spO2}% SpO2` },
    };
    
    const details = metricDetails[type];

    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between">
             <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">{details.icon}</div>
                <div className="flex-grow">
                    <p className="text-sm text-gray-500">{details.label}</p>
                    <p className="text-lg font-bold text-gray-800">{details.value}</p>
                </div>
                <p className="text-xs text-gray-400 self-start">{timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
            {notes && (
                 <p className="text-xs text-gray-500 italic mt-2 pt-2 border-t border-gray-100">Nota: {notes}</p>
            )}
        </div>
    );
};

const ScheduleCard: React.FC<{ item: ScheduleItem; onToggle: (id: string, date: string) => void; occurrenceDate: string, isCaregiver: boolean }> = ({ item, onToggle, occurrenceDate, isCaregiver }) => {
    const icons = {
        [ScheduleItemType.Medication]: <PillIcon className="w-6 h-6 text-blue-500" />,
        [ScheduleItemType.Care]: <HeartIcon className="w-6 h-6 text-green-500" />,
        [ScheduleItemType.Appointment]: <CalendarIcon className="w-6 h-6 text-indigo-500" />,
    };

    const isCompleted = !!item.completedDates[occurrenceDate];

    return (
        <div className={`p-4 rounded-lg shadow-md flex items-center space-x-4 transition-all ${isCompleted ? 'bg-gray-100 opacity-60' : 'bg-white'}`}>
            <div className="flex-shrink-0">{icons[item.type]}</div>
            <div className="flex-grow">
                <p className={`font-bold text-gray-800 ${isCompleted ? 'line-through' : ''}`}>{item.title}</p>
                <p className="text-sm text-gray-500">{item.time}{item.details ? ` - ${item.details}` : ''}</p>
            </div>
            <button
              onClick={() => onToggle(item.id, occurrenceDate)}
              disabled={!isCaregiver}
              className={`p-2 rounded-full transition-colors ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'} ${isCaregiver ? 'hover:bg-gray-300' : 'cursor-not-allowed'}`}
            >
                <CheckCircleIcon className="w-6 h-6" />
            </button>
        </div>
    );
};

const AlertCard: React.FC<{ alert: AIAlert }> = ({ alert }) => {
    const alertStyles = {
        [AlertLevel.Info]: {
            icon: <InfoIcon className="w-8 h-8 text-blue-500" />,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-500',
            textColor: 'text-blue-800'
        },
        [AlertLevel.Warning]: {
            icon: <WarningIcon className="w-8 h-8 text-yellow-500" />,
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-500',
            textColor: 'text-yellow-800'
        },
        [AlertLevel.Critical]: {
            icon: <CriticalIcon className="w-8 h-8 text-red-500" />,
            bgColor: 'bg-red-50',
            borderColor: 'border-red-500',
            textColor: 'text-red-800'
        },
    };

    const styles = alertStyles[alert.level];

    return (
        <div className={`p-4 rounded-lg border-l-4 ${styles.bgColor} ${styles.borderColor} shadow-md`}>
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">{styles.icon}</div>
                <div className="flex-1">
                    <h3 className={`text-lg font-bold ${styles.textColor}`}>{alert.title}</h3>
                    <p className={`mt-1 text-sm ${styles.textColor}`}>{alert.description}</p>
                    
                     {alert.level === AlertLevel.Critical && alert.emergencyScript && (
                        <div className="mt-4 p-3 bg-red-100 rounded-md border border-red-200">
                             <div className="flex items-center font-bold text-red-900">
                                <PhoneIcon className="w-5 h-5 mr-2"/>
                                <span>AÇÃO IMEDIATA NECESSÁRIA</span>
                            </div>
                            <p className="mt-2 text-sm text-red-800">
                                Por favor, ligue para os serviços de emergência <strong>(SAMU 192)</strong> imediatamente.
                            </p>
                            <div className="mt-3 bg-white p-3 rounded-md shadow-inner">
                                <p className="text-sm font-semibold text-gray-800 mb-1">Leia o seguinte para o atendente:</p>
                                <p className="text-base text-gray-900 font-mono whitespace-pre-wrap">{alert.emergencyScript}</p>
                            </div>
                        </div>
                    )}
                    
                     {alert.level === AlertLevel.Critical && alert.firstAid && (
                        <div className="mt-4 p-3 bg-red-100 rounded-md">
                            <h4 className="font-bold text-red-900">Enquanto aguarda, siga estes Primeiros Socorros:</h4>
                            <p className="mt-1 text-sm text-red-900 whitespace-pre-wrap">{alert.firstAid}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const NavItem: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-full py-2 px-1 text-sm font-medium transition-colors duration-200 ${
        isActive
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-blue-500'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);


const toYYYYMMDD = (date: Date) => date.toISOString().split('T')[0];

const getScheduleForDate = (schedule: ScheduleItem[], date: Date): ScheduleItem[] => {
    const dateStr = toYYYYMMDD(date);
    const dayOfWeek = date.getDay();

    return schedule.filter(item => {
        const itemStartDate = new Date(item.startDate + 'T00:00:00');
        const itemEndDate = item.endDate ? new Date(item.endDate + 'T00:00:00') : null;

        if (date < itemStartDate) return false;
        if (itemEndDate && date > itemEndDate) return false;

        switch (item.frequency) {
            case RecurrenceFrequency.None:
                return item.startDate === dateStr;
            case RecurrenceFrequency.Daily:
                return true;
            case RecurrenceFrequency.Weekly:
                return item.daysOfWeek?.includes(dayOfWeek) ?? false;
            case RecurrenceFrequency.Monthly:
                return itemStartDate.getDate() === date.getDate();
            default:
                return false;
        }
    }).sort((a,b) => a.time.localeCompare(b.time));
}

const App: React.FC = () => {
    const [metrics, setMetrics] = useState<HealthMetric[]>(generateMockMetrics);
    const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
    const [patientProfile, setPatientProfile] = useState<PatientProfile>(initialPatientProfile);
    const [currentUser, setCurrentUser] = useState<TeamMember>(initialPatientProfile.team[0]);
    const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Start loading on initial load
    const [error, setError] = useState<string | null>(null);
    const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [editingScheduleItem, setEditingScheduleItem] = useState<ScheduleItem | null>(null);
    const [activeView, setActiveView] = useState<'dashboard' | 'profile' | 'schedule' | 'history'>('dashboard');
    const [alertNotification, setAlertNotification] = useState<string | null>(null);
    const [historyLog, setHistoryLog] = useState<HistoryEvent[]>([]);
    const [dailyNotes, setDailyNotes] = useState<{ [date: string]: DailyNote }>({});
    
    const isInitialMount = useRef(true);
    const isCaregiver = currentUser.role === UserRole.Caregiver;

    const addHistoryEvent = useCallback((event: Omit<HistoryEvent, 'id'>) => {
        // FIX: The error on line 300 is caused by TypeScript losing the discriminated union type
        // when spreading the `event` parameter. Casting the new object to `HistoryEvent` resolves this.
        setHistoryLog(prev => [{ ...event, id: `hist-${Date.now()}` } as HistoryEvent, ...prev]);
    }, []);

    const handleAnalyze = useCallback(async (newestMetric?: HealthMetric) => {
        setIsLoading(true);
        setError(null);
        setAlertNotification(null);
        try {
            const analysis = await analyzeHealthData(newestMetric ? [newestMetric, ...metrics] : metrics, patientProfile);
            setAiAnalysis(analysis);
            
            analysis.alerts.forEach(alert => {
                addHistoryEvent({
                    type: HistoryEventType.Alert,
                    timestamp: new Date(),
                    data: alert
                });
            });


            // Simulate notifications for critical alerts
            const criticalAlert = analysis.alerts.find(a => a.level === AlertLevel.Critical);
            if (criticalAlert) {
                const caregivers = patientProfile.team.filter(m => m.role === UserRole.Caregiver).map(m => m.name.split(' ')[0]);
                const observers = patientProfile.team.filter(m => m.role !== UserRole.Caregiver).map(m => m.name.split(' ')[0]);
                let notification = `Alerta Crítico enviado para cuidadores (${caregivers.join(', ')}).`;
                if (observers.length > 0) {
                    notification += ` Notificação de emergência enviada para acompanhantes (${observers.join(', ')}).`;
                }
                setAlertNotification(notification);
            }

        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    }, [metrics, patientProfile, addHistoryEvent]);

    // Initial analysis on app load
    useEffect(() => {
        handleAnalyze();
    }, []);

    // Re-analyze whenever new metrics are added
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
             // We pass the newest metric to the analyze function to focus on it
             if(metrics.length > 0) {
                handleAnalyze(metrics[0]);
             }
        }
    }, [metrics]);


    const handleToggleSchedule = (id: string, date: string) => {
        if (!isCaregiver) return;
        let toggledItem: ScheduleItem | undefined;
        let isCompleting = false;

        setSchedule(prev => prev.map(item => {
            if (item.id === id) {
                const newCompletedDates = { ...item.completedDates };
                 isCompleting = !newCompletedDates[date];
                if (isCompleting) {
                    newCompletedDates[date] = true;
                } else {
                    delete newCompletedDates[date];
                }
                toggledItem = { ...item, completedDates: newCompletedDates };
                return toggledItem;
            }
            return item;
        }));
        
        // Add to history only when completing the task
        if (toggledItem && isCompleting) {
            addHistoryEvent({
                type: HistoryEventType.Schedule,
                timestamp: new Date(),
                data: { item: toggledItem, occurrenceDate: date }
            });
        }
    };

    const handleAddMetric = (newMetricData: Omit<HealthMetric, 'id'>) => {
        const newMetric: HealthMetric = {
            ...newMetricData,
            id: `metric-${Date.now()}`,
        };
        addHistoryEvent({
            type: HistoryEventType.Metric,
            timestamp: newMetric.timestamp,
            data: newMetric
        });
        setMetrics(prevMetrics => [newMetric, ...prevMetrics].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
        setIsMetricModalOpen(false);
    };
    
    const handleUpdateProfile = (newProfile: PatientProfile) => {
        setPatientProfile(newProfile);
        setIsProfileModalOpen(false);
    }
    
    const handleUpdateTeam = (newTeam: TeamMember[]) => {
        setPatientProfile(prev => ({...prev, team: newTeam}));
        // Update current user if they were removed or their role changed
        const updatedCurrentUser = newTeam.find(m => m.id === currentUser.id);
        if (updatedCurrentUser) {
            setCurrentUser(updatedCurrentUser);
        } else {
            setCurrentUser(newTeam[0]); // Default to first user
        }
    };


    const handleSaveScheduleItem = (itemData: Omit<ScheduleItem, 'id' | 'completedDates'> & { id?: string }) => {
        if (itemData.id) {
            // Update existing
             setSchedule(prev => prev.map(item => item.id === itemData.id ? { ...item, ...itemData } : item));
        } else {
            // Add new
            const newItem: ScheduleItem = {
                ...itemData,
                id: `schedule-${Date.now()}`,
                completedDates: {},
            };
            setSchedule(prev => [...prev, newItem]);
        }
        setIsScheduleModalOpen(false);
        setEditingScheduleItem(null);
    };
    
    const handleEditScheduleItem = (item: ScheduleItem) => {
        if (!isCaregiver) return;
        setEditingScheduleItem(item);
        setIsScheduleModalOpen(true);
    };

    const handleDeleteScheduleItem = (id: string) => {
        if (!isCaregiver) return;
        setSchedule(prev => prev.filter(item => item.id !== id));
    };
    
    const handleSaveDailyNote = (date: string, content: string) => {
        const note: DailyNote = { date, content };
        setDailyNotes(prev => ({...prev, [date]: note }));
         addHistoryEvent({
            type: HistoryEventType.Note,
            timestamp: new Date(),
            data: note
        });
    }

     const todaySchedule = useMemo(() => getScheduleForDate(schedule, new Date()), [schedule]);

    const latestMetrics = useMemo(() => {
      const latest: { [key in MetricType]?: HealthMetric } = {};
      [...metrics].forEach(metric => {
          if (!latest[metric.type]) {
            latest[metric.type] = metric;
          }
        });
      return Object.values(latest).sort((a,b) => a.type.localeCompare(b.type)) as HealthMetric[];
    }, [metrics]);

    const getAge = (birthDate: string) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }
    
    const roleLabels: { [key in UserRole]: string } = {
        [UserRole.Caregiver]: 'Cuidador',
        [UserRole.Observer]: 'Acompanhante',
        [UserRole.Professional]: 'Profissional de Saúde',
    }

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard':
                return renderDashboard();
            case 'profile':
                return <PatientProfilePage profile={patientProfile} onEdit={() => setIsProfileModalOpen(true)} isCaregiver={isCaregiver} onManageTeam={() => setIsTeamModalOpen(true)} />;
            case 'schedule':
                return (
                    <SchedulePage
                        schedule={schedule}
                        onAddItem={() => { setEditingScheduleItem(null); setIsScheduleModalOpen(true); }}
                        onEditItem={handleEditScheduleItem}
                        onDeleteItem={handleDeleteScheduleItem}
                        onToggleComplete={handleToggleSchedule}
                        isCaregiver={isCaregiver}
                    />
                );
             case 'history':
                return <HistoryPage log={historyLog} />;
            default:
                return renderDashboard();
        }
    };

    const renderDashboard = () => {
        const todayNote = dailyNotes[toYYYYMMDD(new Date())] || { date: toYYYYMMDD(new Date()), content: '' };
        return (
        <>
        {/* Patient Info Card */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold">{patientProfile.name}, {getAge(patientProfile.birthDate)} anos</h2>
            <p className="text-sm text-gray-600"><strong>Condição:</strong> {patientProfile.mainCondition}</p>
            <p className="text-sm text-gray-600"><strong>Histórico:</strong> {patientProfile.medicalHistory}</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Schedule */}
            <div className="lg:col-span-1 space-y-6">
                <section>
                    <h2 className="text-xl font-semibold mb-4">Agenda do Dia</h2>
                    <div className="space-y-3">
                        {todaySchedule.length > 0 ?
                            todaySchedule.map(item => <ScheduleCard key={`${item.id}-${toYYYYMMDD(new Date())}`} item={item} onToggle={handleToggleSchedule} occurrenceDate={toYYYYMMDD(new Date())} isCaregiver={isCaregiver} />) :
                            <p className="text-gray-500">Nenhuma tarefa para hoje.</p>
                        }
                    </div>
                </section>
                 <DailyNotesCard 
                    note={todayNote}
                    onSave={handleSaveDailyNote}
                    isCaregiver={isCaregiver}
                />
            </div>

            {/* Middle Column: Metrics & AI */}
            <div className="lg:col-span-2 space-y-6">
               <section>
                   <div className="flex justify-between items-center mb-4">
                     <h2 className="text-xl font-semibold">Medições Recentes</h2>
                      <button
                        onClick={() => setIsMetricModalOpen(true)}
                        disabled={!isCaregiver}
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 flex items-center space-x-2 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <PlusCircleIcon className="w-5 h-5"/>
                        <span>Registrar</span>
                      </button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {latestMetrics.map(metric => <MetricCard key={metric.id} metric={metric} />)}
                   </div>
               </section>

                <section>
                     <div className="flex justify-between items-center mb-4">
                       <h2 className="text-xl font-semibold">Análise da IA</h2>
                        {isLoading && <span className="text-sm text-gray-500 flex items-center"><SparklesIcon className="w-4 h-4 mr-2 animate-spin"/>Analisando...</span>}
                     </div>

                     <div className="bg-white p-4 rounded-lg shadow-md min-h-[200px]">
                        {error && <div className="text-red-500 bg-red-50 p-3 rounded-md">{error}</div>}
                        {!error && !aiAnalysis && isLoading && (
                            <div className="flex justify-center items-center h-full"><p className="text-gray-500">Aguarde, a IA está realizando a análise inicial...</p></div>
                        )}
                        {!error && !aiAnalysis && !isLoading && (
                            <div className="text-center text-gray-500 flex flex-col items-center justify-center h-full">
                                <SparklesIcon className="w-12 h-12 text-gray-300 mb-2"/>
                                <p>Nenhuma análise disponível. Registre uma nova medição para obter insights.</p>
                            </div>
                        )}
                        {aiAnalysis && (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-bold text-lg">Resumo da IA</h3>
                                    <p className="text-gray-600 mt-1">{aiAnalysis.summary}</p>
                                </div>
                                
                                {aiAnalysis.alerts.length > 0 && (
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">Alertas</h3>
                                        <div className="space-y-3">
                                            {aiAnalysis.alerts.map((alert, index) => <AlertCard key={index} alert={alert}/>)}
                                        </div>
                                    </div>
                                )}

                                 {aiAnalysis.recommendations.length > 0 && (
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">Recomendações</h3>
                                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                                           {aiAnalysis.recommendations.map((rec, index) => <li key={index}>{rec}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                     </div>
                </section>
            </div>
        </div>
        </>
    )};

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
             {isMetricModalOpen && (
                <AddMetricModal
                    isOpen={isMetricModalOpen}
                    onClose={() => setIsMetricModalOpen(false)}
                    onSave={handleAddMetric}
                />
            )}
             {isProfileModalOpen && (
                <EditProfileModal
                    isOpen={isProfileModalOpen}
                    onClose={() => setIsProfileModalOpen(false)}
                    onSave={handleUpdateProfile}
                    currentProfile={patientProfile}
                />
            )}
            {isScheduleModalOpen && (
                <AddScheduleItemModal
                    isOpen={isScheduleModalOpen}
                    onClose={() => { setIsScheduleModalOpen(false); setEditingScheduleItem(null); }}
                    onSave={handleSaveScheduleItem}
                    itemToEdit={editingScheduleItem}
                />
            )}
            {isTeamModalOpen && (
                <ManageTeamModal
                    isOpen={isTeamModalOpen}
                    onClose={() => setIsTeamModalOpen(false)}
                    onSave={handleUpdateTeam}
                    currentTeam={patientProfile.team}
                />
            )}
            
            <UrgentContactsBar services={urgentServices} />

            {alertNotification && (
                <div className="bg-yellow-100 border-b-2 border-yellow-400 text-yellow-800 text-sm text-center py-2 px-4 animate-fade-in-down">
                     <div className="flex items-center justify-center">
                        <WarningIcon className="w-5 h-5 mr-2" />
                        <span><strong>Notificação:</strong> {alertNotification}</span>
                        <button onClick={() => setAlertNotification(null)} className="ml-4 text-yellow-600 hover:text-yellow-800"><XCircleIcon className="w-5 h-5"/></button>
                    </div>
                </div>
            )}


            <header className="bg-white shadow-md sticky top-0 z-10">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-2">
                            <HeartIcon className="w-8 h-8 text-blue-600" />
                            <h1 className="text-2xl font-bold text-blue-600">Pai Care Monitor</h1>
                        </div>
                         <div className="flex items-center space-x-2">
                           <span className="text-sm text-gray-500">Perfil de Acesso:</span>
                            <select
                                value={currentUser.id}
                                onChange={(e) => setCurrentUser(patientProfile.team.find(m => m.id === e.target.value)!)}
                                className="text-sm font-semibold text-blue-600 bg-gray-100 border-gray-300 rounded-md p-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {patientProfile.team.map(member => (
                                    <option key={member.id} value={member.id}>
                                        {member.name} ({roleLabels[member.role]})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <nav className="flex items-center space-x-2 border-t">
                        <NavItem label="Painel Principal" icon={<HomeIcon className="w-5 h-5 mb-1" />} isActive={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
                        <NavItem label="Agenda" icon={<CalendarIcon className="w-5 h-5 mb-1" />} isActive={activeView === 'schedule'} onClick={() => setActiveView('schedule')} />
                        <NavItem label="Histórico" icon={<ClipboardListIcon className="w-5 h-5 mb-1" />} isActive={activeView === 'history'} onClick={() => setActiveView('history')} />
                        <NavItem label="Perfil do Paciente" icon={<UserCircleIcon className="w-5 h-5 mb-1" />} isActive={activeView === 'profile'} onClick={() => setActiveView('profile')} />
                    </nav>
                </div>
            </header>
            
            <main className="container mx-auto p-4 pb-20">
               {renderContent()}
            </main>
        </div>
    );
};

export default App;