import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { LoginPage } from './components/LoginPage';
import { auth, db, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, setDoc, doc } from './firebase/config';
import { getDoc } from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { toYYYYMMDD, getScheduleForDate } from './utils/dateUtils';
import { analyzeHealthData } from './utils/analysisUtils';
import { ScheduleCard } from './components/ScheduleCard';
import { MetricCard } from './components/MetricCard';
import { AlertCard } from './components/AlertCard';
import { NavItem } from './components/NavItem';
import { DailyNotesCard } from './components/DailyNotesCard';
import { AddMetricModal } from './components/AddMetricModal';
import { EditProfileModal } from './components/EditProfileModal';
import { AddScheduleItemModal } from './components/AddScheduleItemModal';
import { ManageTeamModal } from './components/ManageTeamModal';
import { UrgentContactsBar } from './components/UrgentContactsBar';
import { PatientProfilePage } from './components/PatientProfilePage';
import { SchedulePage } from './components/SchedulePage';
import { HistoryPage } from './components/HistoryPage';
import type { PatientProfile, HealthMetric, ScheduleItem, AIAnalysis, HistoryEvent, DailyNote, UrgentService, TeamMember, UserRole, MetricType, ScheduleItemType, RecurrenceFrequency, HistoryEventType, AlertLevel } from './types';

// Icon SVG components
const PlusCircleIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>;
const SparklesIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
const WarningIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const XCircleIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;
const HeartIcon = () => <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>;
const HomeIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
const CalendarIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v2H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 00-2-2V7a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v2H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
const ClipboardListIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 012-2h6a2 2 0 012 2v1h2a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h2V3zM4 7h12v8H4V7zm2 3a1 1 0 100 2h4a1 1 0 100-2H6zm0 4a1 1 0 100 2h4a1 1 0 100-2H6z" /></svg>;
const UserCircleIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg>;

// Constants for enum-like values (used as actual values)
const METRIC_TYPES = {
  BloodPressure: 'blood_pressure' as MetricType,
  Temperature: 'temperature' as MetricType,
  Glucose: 'glucose' as MetricType,
  Saturation: 'oxygen_saturation' as MetricType,
  HeartRate: 'heart_rate' as MetricType,
  Weight: 'weight' as MetricType,
};

const SCHEDULE_ITEM_TYPES = {
  Medication: 'medication' as ScheduleItemType,
  Care: 'care' as ScheduleItemType,
  Appointment: 'appointment' as ScheduleItemType,
};

const RECURRENCE = {
  Daily: 'daily' as RecurrenceFrequency,
  Weekly: 'weekly' as RecurrenceFrequency,
  Monthly: 'monthly' as RecurrenceFrequency,
  Once: 'once' as RecurrenceFrequency,
};

const HISTORY_EVENT_TYPES = {
  Alert: 'alert' as HistoryEventType,
  Schedule: 'schedule_completed' as HistoryEventType,
  Metric: 'metric_added' as HistoryEventType,
  Note: 'note' as HistoryEventType,
};

const ALERT_LEVELS = {
  Critical: 'critical' as AlertLevel,
  Warning: 'warning' as AlertLevel,
  Info: 'info' as AlertLevel,
};

const USER_ROLES = {
  Caregiver: 'caregiver' as UserRole,
  Observer: 'observer' as UserRole,
  Professional: 'professional' as UserRole,
};

// Mock Data
const generateMockMetrics = (): HealthMetric[] => {
    const metrics: HealthMetric[] = [];
    const now = new Date();
    // Adicionando dados iniciais variados para teste
    metrics.push({id: 'init-1', type: METRIC_TYPES.BloodPressure, value: { systolic: 120, diastolic: 80 }, unit: 'mmHg', timestamp: now});
    metrics.push({id: 'init-2', type: METRIC_TYPES.Temperature, value: 36.5, unit: '°C', timestamp: now});
    
    return metrics.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const todayStr = new Date().toISOString().split('T')[0];

const INITIAL_SCHEDULE: ScheduleItem[] = [
    {id: 'med1', type: SCHEDULE_ITEM_TYPES.Medication, title: 'Anticoagulante', startTime: '08:00', date: todayStr, frequency: RECURRENCE.Daily, completedDates: {}},
    {id: 'med2', type: SCHEDULE_ITEM_TYPES.Medication, title: 'Anti-hipertensivo', startTime: '08:00', date: todayStr, frequency: RECURRENCE.Daily, completedDates: {}},
    {id: 'care1', type: SCHEDULE_ITEM_TYPES.Care, title: 'Banho', startTime: '09:00', date: todayStr, frequency: RECURRENCE.Daily, completedDates: {}},
    {id: 'med3', type: SCHEDULE_ITEM_TYPES.Medication, title: 'Vitamina D', startTime: '12:00', date: todayStr, frequency: RECURRENCE.Daily, completedDates: {}},
];

const PATIENT_PROFILE_TEMPLATE: Omit<PatientProfile, 'team'> = {
    name: "Nome do Paciente",
    birthDate: "1950-01-01",
    gender: "Masculino",
    mainCondition: "Pós-AVC Isquêmico",
    medicalHistory: "Hipertensão controlada",
    allergies: "Nenhuma conhecida",
    surgeries: "",
    emergencyContacts: [],
    physicianContacts: [],
    team_uids: [],
}

const URGENT_SERVICES: UrgentService[] = [
    { name: "SAMU", phone: "192", type: "ambulance" },
    { name: "Bombeiros", phone: "193", type: "fire" },
    { name: "Polícia Militar", phone: "190", type: "police" },
];

const App: React.FC = () => {
    const [metrics, setMetrics] = useState<HealthMetric[]>(generateMockMetrics);
    const [schedule, setSchedule] = useState<ScheduleItem[]>(INITIAL_SCHEDULE);
    const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
    const [currentUser, setCurrentUser] = useState<TeamMember | null>(null);
    const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(true);
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
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

    const isInitialMount = useRef(true);
    const isCaregiver = currentUser?.role === USER_ROLES.Caregiver;

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthUser(user);
            setIsAuthLoading(false);
            if (!user) {
                setPatientProfile(null);
                setCurrentUser(null);
            }
        });
        return () => unsubscribe();
    }, []);

    // Load or create patient profile when user authenticates
    useEffect(() => {
        if (!authUser) return;
        let mounted = true;
        const loadOrCreateProfile = async () => {
            try {
                const ref = doc(db, 'patients', authUser.uid);
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    const data = snap.data() as PatientProfile;
                    if (Array.isArray(data.team)) {
                        data.team = data.team.map(member => {
                            const cloned = { ...member } as any;
                            const j = cloned.joinedAt as any;
                            if (j) {
                                if (typeof j.toDate === 'function') {
                                    cloned.joinedAt = j.toDate();
                                } else if (j.seconds != null) {
                                    cloned.joinedAt = new Date((Number(j.seconds) * 1000) + (Number(j.nanoseconds || 0) / 1e6));
                                }
                            }
                            return cloned;
                        });
                    }
                    if (!mounted) return;
                    setPatientProfile(data);
                    const me = data.team?.find(m => m.id === authUser.uid) || data.team?.[0] || null;
                    setCurrentUser(me || null);
                } else {
                    const newTeamMember: TeamMember = {
                        id: authUser.uid,
                        name: authUser.email || 'Usuário',
                        email: authUser.email || '',
                        role: USER_ROLES.Caregiver,
                        joinedAt: new Date(),
                    } as TeamMember;

                    const newProfile: PatientProfile = {
                        ...PATIENT_PROFILE_TEMPLATE,
                        team: [newTeamMember],
                        team_uids: [authUser.uid],
                    } as PatientProfile;

                    await setDoc(ref, newProfile);
                    if (!mounted) return;
                    setPatientProfile(newProfile);
                    setCurrentUser(newTeamMember);
                }
            } catch (err) {
                console.error('Erro ao carregar/criar perfil do paciente:', err);
            }
        };
        loadOrCreateProfile();
        return () => { mounted = false; };
    }, [authUser]);

    const handleLogin = async (email: string, pass: string) => {
        setAuthError(null);
        try {
            await signInWithEmailAndPassword(auth, email, pass);
        } catch (error: any) {
            console.error('Login error', error);
            setAuthError(error?.code === 'auth/invalid-credential' ? 'Email ou senha inválidos.' : `Erro ao login: ${error?.code}`);
        }
    };

    const handleCreateAccount = async (email: string, pass: string) => {
        setAuthError(null);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            const newUser = userCredential.user;
            const newTeamMember: TeamMember = {
                id: newUser.uid,
                name: newUser.email || "Novo Usuário",
                email: newUser.email || "",
                role: USER_ROLES.Caregiver,
                joinedAt: new Date(),
            };
            const newProfile: PatientProfile = {
                ...PATIENT_PROFILE_TEMPLATE,
                team: [newTeamMember],
                team_uids: [newUser.uid],
            };
            await setDoc(doc(db, "patients", newUser.uid), newProfile);
            setPatientProfile(newProfile);
            setCurrentUser(newTeamMember);
        } catch (error: any) {
             console.error('Create account error', error);
             setAuthError(error?.code === 'auth/email-already-in-use' ? 'Email já em uso.' : `Erro ao criar conta: ${error?.code}`);
        }
    };
    
    const addHistoryEvent = useCallback((event: Omit<HistoryEvent, 'id'>) => {
        setHistoryLog(prev => [{ ...event, id: `hist-${Date.now()}-${Math.random()}` } as HistoryEvent, ...prev]);
    }, []);

    const handleAnalyze = useCallback(async (newestMetric?: HealthMetric) => {
        if (!patientProfile) return;
        setIsLoading(true);
        setError(null);
        setAlertNotification(null);
        try {
            const analysis = await analyzeHealthData(newestMetric ? [newestMetric, ...metrics] : metrics, patientProfile);
            setAiAnalysis(analysis);
            
            analysis.alerts.forEach(alert => {
                addHistoryEvent({ type: HISTORY_EVENT_TYPES.Alert, timestamp: new Date(), title: 'Alerta IA', description: alert.message });
            });

            const criticalAlert = analysis.alerts.find(a => a.level === ALERT_LEVELS.Critical);
            if (criticalAlert) {
                setAlertNotification(`ALERTA CRÍTICO: ${criticalAlert.message}`);
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro desconhecido.');
        } finally {
            setIsLoading(false);
        }
    }, [metrics, patientProfile, addHistoryEvent]);

    useEffect(() => {
        if(patientProfile && !isInitialMount.current) {
           handleAnalyze();
        }
    }, [patientProfile]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            // Initial load analysis can happen here if needed
            if (patientProfile) handleAnalyze();
        }
    }, [patientProfile]);

    const handleToggleSchedule = (id: string, date: string) => {
        if (!isCaregiver) return;
        let toggledItem: ScheduleItem | undefined;
        let isCompleting = false;

        setSchedule(prev => prev.map(item => {
            if (item.id === id) {
                const newCompletedDates = { ...item.completedDates };
                 isCompleting = !newCompletedDates?.[date];
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
        
        if (toggledItem && isCompleting) {
            addHistoryEvent({
                type: HISTORY_EVENT_TYPES.Schedule,
                timestamp: new Date(),
                title: `${toggledItem.title} concluído`,
                description: `Tarefa completada em ${date}`
            });
        }
    };

    // -- FUNÇÃO DE ADICIONAR MÉTRICAS EM LOTE (ATUALIZADA) --
    const handleAddMetric = (newMetricsData: Omit<HealthMetric, 'id'>[]) => {
        const timestamp = new Date();
        const newMetricsWithIds: HealthMetric[] = newMetricsData.map(m => ({
            ...m,
            id: `metric-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp // garantindo mesmo timestamp para o lote
        }));

        // Adiciona ao histórico como um evento único de "Check-up"
        const descriptions = newMetricsData.map(m => {
             if (m.type === 'blood_pressure' && typeof m.value === 'object') {
                 return `PA ${m.value.systolic}/${m.value.diastolic}`;
             }
             return `${m.type} ${m.value}`;
        });
        
        addHistoryEvent({
            type: HISTORY_EVENT_TYPES.Metric,
            timestamp: timestamp,
            title: 'Sinais Vitais Registrados',
            description: descriptions.join(', ')
        });

        setMetrics(prevMetrics => {
            const updated = [...newMetricsWithIds, ...prevMetrics].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            // Chama a análise com a primeira métrica nova como "contexto recente", a IA receberá a lista atualizada
            handleAnalyze(newMetricsWithIds[0]); 
            return updated;
        });
        
        setIsMetricModalOpen(false);
    };
    
    const handleUpdateProfile = (newProfile: PatientProfile) => {
        if(!patientProfile) return;
        setPatientProfile(newProfile);
        setIsProfileModalOpen(false);
    }
    
    const handleUpdateTeam = (newTeam: TeamMember[]) => {
        if(!patientProfile) return;
        setPatientProfile(prev => ({...prev!, team: newTeam}));
        setIsTeamModalOpen(false);
    };

    const handleSaveScheduleItem = (itemData: Omit<ScheduleItem, 'id' | 'completedDates'> & { id?: string }) => {
        if (itemData.id) {
             setSchedule(prev => prev.map(item => item.id === itemData.id ? { ...item, ...itemData } : item));
        } else {
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
        const note: DailyNote = { id: `note-${Date.now()}`, date, content, timestamp: new Date() };
        setDailyNotes(prev => ({...prev, [date]: note }));
         addHistoryEvent({
            type: HISTORY_EVENT_TYPES.Note,
            timestamp: new Date(),
            title: 'Nota do dia',
            description: content
        });
    }

    const todaySchedule = useMemo(() => getScheduleForDate(schedule, new Date()), [schedule]);

    // -- CÁLCULO DAS MÉTRICAS MAIS RECENTES (ATUALIZADO) --
    // Garante que pegamos a mais recente de CADA tipo para exibir no dashboard
    const latestMetrics = useMemo(() => {
      const latest: { [key: string]: HealthMetric } = {};
      
      // Percorre todas e guarda apenas a primeira encontrada de cada tipo (já que estão ordenadas por data desc)
      metrics.forEach(metric => {
          if (!latest[metric.type]) {
            latest[metric.type] = metric;
          }
      });
      
      // Ordem de exibição preferida
      const preferredOrder = [
          METRIC_TYPES.BloodPressure, 
          METRIC_TYPES.Temperature, 
          METRIC_TYPES.Glucose, 
          METRIC_TYPES.Saturation, 
          METRIC_TYPES.HeartRate, 
          METRIC_TYPES.Weight
      ];

      return preferredOrder
        .map(type => latest[type])
        .filter(Boolean) as HealthMetric[];
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

    const renderContent = () => {
        if (!patientProfile) {
             return <div className="text-center p-10 text-gray-500">Carregando perfil do paciente...</div>;
        }
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
        if (!patientProfile) return null;
        const todayNote = dailyNotes[toYYYYMMDD(new Date())] || { id: '', date: toYYYYMMDD(new Date()), content: '', timestamp: new Date() };
        
        return (
        <>
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 border-l-4 border-blue-600">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{patientProfile.name}, {getAge(patientProfile.birthDate)} anos</h2>
                    <p className="text-sm text-gray-600 mt-1"><strong>Condição:</strong> {patientProfile.mainCondition}</p>
                </div>
                <div className="text-right hidden sm:block">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Monitoramento Ativo</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna da Esquerda: Agenda e Notas */}
            <div className="lg:col-span-1 space-y-6">
                <section>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <CalendarIcon /> Agenda Hoje
                    </h2>
                    <div className="space-y-3">
                        {todaySchedule.length > 0 ?
                            todaySchedule.map(item => <ScheduleCard key={`${item.id}-${toYYYYMMDD(new Date())}`} item={item} onToggle={handleToggleSchedule} occurrenceDate={toYYYYMMDD(new Date())} isCaregiver={isCaregiver} />) :
                            <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">Nenhuma tarefa pendente.</div>
                        }
                    </div>
                </section>
                 <DailyNotesCard 
                    note={todayNote}
                    onSave={handleSaveDailyNote}
                    isCaregiver={isCaregiver}
                />
            </div>

            {/* Coluna Central e Direita: Métricas e IA */}
            <div className="lg:col-span-2 space-y-6">
               <section>
                   <div className="flex justify-between items-center mb-4">
                     <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <HeartIcon /> Sinais Vitais
                     </h2>
                      <button
                        onClick={() => setIsMetricModalOpen(true)}
                        disabled={!isCaregiver}
                        className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                      >
                        <PlusCircleIcon />
                        <span>Registrar Check-up</span>
                      </button>
                   </div>
                   
                   {/* Grid de Cards de Métricas */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {latestMetrics.length > 0 ? (
                           latestMetrics.map(metric => <MetricCard key={metric.id} metric={metric} />)
                       ) : (
                           <div className="col-span-full bg-gray-50 p-8 rounded-lg text-center text-gray-500 border border-dashed border-gray-300">
                               Nenhuma medição registrada ainda. Clique em "Registrar Check-up" para começar.
                           </div>
                       )}
                   </div>
               </section>

                <section>
                     <div className="flex justify-between items-center mb-4">
                       <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                           <SparklesIcon /> Análise Inteligente
                       </h2>
                        {isLoading && <span className="text-sm text-blue-600 flex items-center gap-1 animate-pulse">Analisando dados...</span>}
                     </div>

                     <div className="bg-white p-5 rounded-lg shadow-md min-h-[200px] border border-gray-100">
                        {error && <div className="text-red-600 bg-red-50 p-4 rounded-md border border-red-200">{error}</div>}
                        
                        {!error && !aiAnalysis && !isLoading && (
                            <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                                <span className="text-4xl mb-2">🤖</span>
                                <p>Aguardando dados para gerar análise...</p>
                            </div>
                        )}

                        {aiAnalysis && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800 mb-2">Resumo do Estado Atual</h3>
                                    <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        {aiAnalysis.summary}
                                    </p>
                                </div>
                                
                                {aiAnalysis.alerts.length > 0 && (
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800 mb-3">Alertas e Atenção</h3>
                                        <div className="space-y-3">
                                            {aiAnalysis.alerts.map((alert, index) => <AlertCard key={index} alert={alert}/>)}
                                        </div>
                                    </div>
                                )}

                                 {aiAnalysis.recommendations.length > 0 && (
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-800 mb-3">Recomendações</h3>
                                        <ul className="space-y-2">
                                           {aiAnalysis.recommendations.map((rec, index) => (
                                               <li key={index} className="flex items-start gap-2 text-gray-700 bg-gray-50 p-2 rounded">
                                                   <span className="text-blue-500 mt-1">•</span>
                                                   <span>{rec}</span>
                                               </li>
                                           ))}
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
    
    if (isAuthLoading) {
        return <div className="flex items-center justify-center min-h-screen bg-gray-50 text-blue-600 font-semibold">Carregando Care Monitor...</div>;
    }

    if (!authUser) {
        return <LoginPage onLogin={handleLogin} onCreateAccount={handleCreateAccount} error={authError} />;
    }

    return (
        <div className="bg-gray-100 min-h-screen font-sans text-gray-800 pb-20">
             {isMetricModalOpen && (
                <AddMetricModal
                    isOpen={isMetricModalOpen}
                    onClose={() => setIsMetricModalOpen(false)}
                    onSave={handleAddMetric}
                />
            )}
             {isProfileModalOpen && patientProfile && (
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
            {isTeamModalOpen && patientProfile && (
                <ManageTeamModal
                    isOpen={isTeamModalOpen}
                    onClose={() => setIsTeamModalOpen(false)}
                    onSave={handleUpdateTeam}
                    currentTeam={patientProfile.team}
                />
            )}
            
            <UrgentContactsBar services={URGENT_SERVICES} />

            {alertNotification && (
                <div className="bg-red-100 border-b-4 border-red-500 text-red-800 p-4 animate-bounce sticky top-0 z-50 shadow-lg">
                     <div className="container mx-auto flex items-center justify-between">
                        <div className="flex items-center gap-3 font-bold text-lg">
                            <WarningIcon />
                            <span>{alertNotification}</span>
                        </div>
                        <button onClick={() => setAlertNotification(null)}><XCircleIcon /></button>
                    </div>
                </div>
            )}

            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-2">
                            <HeartIcon />
                            <h1 className="text-2xl font-extrabold text-blue-600 tracking-tight">Care Monitor</h1>
                        </div>
                         {patientProfile && currentUser && (
                            <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 border border-gray-200">
                                <span className="text-xs text-gray-500 mr-2 uppercase font-bold tracking-wide">Logado como:</span>
                                <span className="text-sm font-semibold text-gray-700 truncate max-w-[100px] sm:max-w-none">{currentUser.name.split(' ')[0]}</span>
                            </div>
                         )}
                    </div>
                    
                    {/* Navegação Mobile-Friendly */}
                    <nav className="flex items-center gap-1 sm:gap-4 overflow-x-auto pb-2 no-scrollbar">
                        <NavItem label="Principal" icon={<HomeIcon />} isActive={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
                        <NavItem label="Agenda" icon={<CalendarIcon />} isActive={activeView === 'schedule'} onClick={() => setActiveView('schedule')} />
                        <NavItem label="Histórico" icon={<ClipboardListIcon />} isActive={activeView === 'history'} onClick={() => setActiveView('history')} />
                        <NavItem label="Perfil" icon={<UserCircleIcon />} isActive={activeView === 'profile'} onClick={() => setActiveView('profile')} />
                    </nav>
                </div>
            </header>
            
            <main className="container mx-auto px-4 py-6">
               {renderContent()}
            </main>
        </div>
    );
};

export default App;