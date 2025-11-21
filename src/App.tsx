import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LoginPage } from './components/LoginPage';
import { 
  auth, db, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  setDoc, doc, 
  collection, addDoc, updateDoc, deleteDoc, onSnapshot, query, orderBy,
  where, getDocs, getDoc // CORREÇÃO: getDoc importado daqui
} from './firebase/config';
import { signOut } from 'firebase/auth'; // signOut importado direto do auth
import type { User } from 'firebase/auth';
import { toYYYYMMDD, getScheduleForDate } from './utils/dateUtils';
import { analyzeHealthData } from './services/geminiService';
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

// --- Ícones SVG ---
const PlusCircleIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>;
const SparklesIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
const WarningIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>;
const XCircleIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;
const HeartIcon = () => <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>;
const HomeIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
const CalendarIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v2H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 00-2-2V7a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v2H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
const ClipboardListIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 012-2h6a2 2 0 012 2v1h2a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h2V3zM4 7h12v8H4V7zm2 3a1 1 0 100 2h4a1 1 0 100-2H6zm0 4a1 1 0 100 2h4a1 1 0 100-2H6z" /></svg>;
const UserCircleIcon = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" /></svg>;
const LogoutIcon = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

const METRIC_TYPES = { BloodPressure: 'blood_pressure' as MetricType, Temperature: 'temperature' as MetricType, Glucose: 'glucose' as MetricType, Saturation: 'oxygen_saturation' as MetricType, HeartRate: 'heart_rate' as MetricType, Weight: 'weight' as MetricType };
const ALERT_LEVELS = { Critical: 'critical' as AlertLevel, Warning: 'warning' as AlertLevel, Info: 'info' as AlertLevel };
const USER_ROLES = { Caregiver: 'caregiver' as UserRole, Observer: 'observer' as UserRole, Professional: 'professional' as UserRole };

const PATIENT_PROFILE_TEMPLATE: Omit<PatientProfile, 'team'> = { name: "Nome do Paciente", birthDate: "1950-01-01", gender: "Masculino", mainCondition: "Pós-AVC", medicalHistory: "Nenhum histórico.", allergies: "Nenhuma", surgeries: "", emergencyContacts: [], physicianContacts: [], team_uids: [] };
const URGENT_SERVICES: UrgentService[] = [{ name: "SAMU", phone: "192", type: "ambulance" }, { name: "Bombeiros", phone: "193", type: "fire" }, { name: "Polícia Militar", phone: "190", type: "police" }];

const App: React.FC = () => {
    // Estados
    const [metrics, setMetrics] = useState<HealthMetric[]>([]);
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
    const [historyLog, setHistoryLog] = useState<HistoryEvent[]>([]);
    const [dailyNotes, setDailyNotes] = useState<{ [date: string]: DailyNote }>({});
    
    const [patientProfile, setPatientProfile] = useState<PatientProfile | null>(null);
    const [patientDocId, setPatientDocId] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<TeamMember | null>(null);
    const [authUser, setAuthUser] = useState<User | null>(null);
    
    const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [alertNotification, setAlertNotification] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<'dashboard' | 'profile' | 'schedule' | 'history'>('dashboard');
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

    const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
    const [editingScheduleItem, setEditingScheduleItem] = useState<ScheduleItem | null>(null);

    const isCaregiver = currentUser?.role === USER_ROLES.Caregiver;

    // Função auxiliar para pedir notificação
    const requestNotificationPermission = () => {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    };

    const sendSystemNotification = (title: string, body: string) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body, icon: '/vite.svg' });
        }
        setAlertNotification(`${title}: ${body}`);
    };

    // 1. Autenticação
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setAuthUser(user);
            setIsAuthLoading(false);
            if (!user) {
                setPatientProfile(null);
                setPatientDocId(null);
                setCurrentUser(null);
                setMetrics([]);
                setSchedule([]);
            }
        });
        return () => unsubscribe();
    }, []);

    // 2. Determinar Paciente (Busca Compartilhada)
    useEffect(() => {
        if (!authUser) return;

        const findPatient = async () => {
            try {
                // A. Tenta encontrar meu próprio perfil
                const myProfileRef = doc(db, 'patients', authUser.uid);
                const myProfileSnap = await getDoc(myProfileRef);

                if (myProfileSnap.exists()) {
                    setPatientDocId(authUser.uid);
                    return;
                }

                // B. Procura onde sou membro da equipe (email)
                // Obs: Isso requer um índice composto no futuro se a query ficar complexa, mas para MVP funciona
                const q = query(collection(db, 'patients'), where('team_emails', 'array-contains', authUser.email));
                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    setPatientDocId(querySnapshot.docs[0].id);
                } else {
                    // C. Cria novo
                    const newTeamMember: TeamMember = {
                        id: authUser.uid,
                        name: authUser.email?.split('@')[0] || 'Usuário',
                        email: authUser.email || '',
                        role: USER_ROLES.Caregiver,
                        joinedAt: new Date(),
                    };
                    const newProfile = { 
                        ...PATIENT_PROFILE_TEMPLATE, 
                        team: [newTeamMember], 
                        team_uids: [authUser.uid],
                        team_emails: [authUser.email] 
                    };
                    await setDoc(myProfileRef, newProfile);
                    setPatientDocId(authUser.uid);
                }
            } catch (err) {
                console.error("Erro ao localizar paciente:", err);
            }
        };

        findPatient();
    }, [authUser]);

    // 3. Carregar Dados
    useEffect(() => {
        if (!patientDocId || !authUser) return;

        const unsubProfile = onSnapshot(doc(db, 'patients', patientDocId), (snap) => {
            if (snap.exists()) {
                const data = snap.data() as PatientProfile;
                setPatientProfile(data);
                const me = data.team?.find(m => m.email === authUser.email || m.id === authUser.uid);
                setCurrentUser(me || { id: authUser.uid, name: 'Visitante', role: USER_ROLES.Observer });
            }
        });

        const metricsRef = collection(db, 'patients', patientDocId, 'metrics');
        const unsubMetrics = onSnapshot(query(metricsRef, orderBy('timestamp', 'desc')), (snap) => {
            setMetrics(snap.docs.map(d => ({ ...d.data(), id: d.id, timestamp: d.data().timestamp?.toDate() })) as HealthMetric[]);
        });

        const scheduleRef = collection(db, 'patients', patientDocId, 'schedule');
        const unsubSchedule = onSnapshot(scheduleRef, (snap) => {
            setSchedule(snap.docs.map(d => ({ ...d.data(), id: d.id })) as ScheduleItem[]);
        });

        const historyRef = collection(db, 'patients', patientDocId, 'history');
        const unsubHistory = onSnapshot(query(historyRef, orderBy('timestamp', 'desc')), (snap) => {
            setHistoryLog(snap.docs.map(d => ({ ...d.data(), id: d.id, timestamp: d.data().timestamp?.toDate() })) as HistoryEvent[]);
        });

        const notesRef = collection(db, 'patients', patientDocId, 'notes');
        const unsubNotes = onSnapshot(notesRef, (snap) => {
            const notesObj: { [date: string]: DailyNote } = {};
            snap.docs.forEach(d => notesObj[d.data().date] = { ...d.data(), id: d.id, timestamp: d.data().timestamp?.toDate() } as DailyNote);
            setDailyNotes(notesObj);
        });

        return () => { unsubProfile(); unsubMetrics(); unsubSchedule(); unsubHistory(); unsubNotes(); };
    }, [patientDocId, authUser]);

    // --- Handlers ---

    const handleLogin = async (email: string, pass: string) => {
        setAuthError(null);
        try { 
            await signInWithEmailAndPassword(auth, email, pass); 
            requestNotificationPermission(); // Pede permissão ao logar
        } catch (err: any) { setAuthError('Erro ao login. Verifique credenciais.'); }
    };

    const handleCreateAccount = async (email: string, pass: string) => {
        setAuthError(null);
        try { 
            await createUserWithEmailAndPassword(auth, email, pass); 
            requestNotificationPermission(); // Pede permissão ao criar
        } catch (err: any) { setAuthError('Erro ao criar conta. Tente outro email.'); }
    };

    const handleLogout = async () => {
        try { await signOut(auth); } catch (e) { console.error(e); }
    };

    const addHistoryEvent = useCallback(async (event: Omit<HistoryEvent, 'id'>) => {
        if (!patientDocId) return;
        await addDoc(collection(db, 'patients', patientDocId, 'history'), event);
    }, [patientDocId]);

    const handleAnalyze = useCallback(async (newestMetric?: HealthMetric) => {
        if (!patientProfile || !patientDocId) return;
        setIsLoading(true);
        setError(null);
        setAlertNotification(null);
        try {
            const analysis = await analyzeHealthData(newestMetric ? [newestMetric, ...metrics] : metrics, patientProfile);
            setAiAnalysis(analysis);
            
            analysis.alerts.forEach(alert => {
                addHistoryEvent({ type: 'alert', timestamp: new Date(), title: 'Alerta IA', description: alert.message });
                
                if (alert.level === ALERT_LEVELS.Critical) {
                    sendSystemNotification('ALERTA CRÍTICO', alert.message);
                } else if (alert.level === ALERT_LEVELS.Warning && isCaregiver) {
                    sendSystemNotification('Atenção Necessária', alert.message);
                }
            });

        } catch (err) { setError('IA indisponível.'); } 
        finally { setIsLoading(false); }
    }, [metrics, patientProfile, addHistoryEvent, isCaregiver, patientDocId]);

    const handleAddMetric = async (newMetricsData: Omit<HealthMetric, 'id'>[]) => {
        if (!patientDocId) return;
        const timestamp = new Date();
        
        const descriptions = newMetricsData.map(m => {
             if (m.type === 'blood_pressure' && typeof m.value === 'object') {
                 return `PA ${m.value.systolic}/${m.value.diastolic}`;
             }
             return `${m.type} ${m.value}`;
        });

        const promises = newMetricsData.map(m => 
            addDoc(collection(db, 'patients', patientDocId, 'metrics'), { ...m, timestamp })
        );
        await Promise.all(promises); 

        await addHistoryEvent({ type: 'metric_added', timestamp, title: 'Check-up', description: descriptions.join(', ') });
        
        handleAnalyze({ ...newMetricsData[0], id: 'temp', timestamp } as HealthMetric);
        setIsMetricModalOpen(false);
    };

    const handleSaveScheduleItem = async (itemData: any) => {
        if (!patientDocId || !isCaregiver) return;
        if (itemData.id) {
            await updateDoc(doc(db, 'patients', patientDocId, 'schedule', itemData.id), itemData);
        } else {
            await addDoc(collection(db, 'patients', patientDocId, 'schedule'), { ...itemData, completedDates: {} });
        }
        setIsScheduleModalOpen(false);
    };

    const handleEditScheduleItem = (item: ScheduleItem) => {
        if (!isCaregiver) return;
        setEditingScheduleItem(item);
        setIsScheduleModalOpen(true);
    };

    const handleDeleteScheduleItem = async (id: string) => {
        if (!patientDocId || !isCaregiver) return;
        await deleteDoc(doc(db, 'patients', patientDocId, 'schedule', id));
    };

    const handleToggleSchedule = async (id: string, date: string) => {
        if (!patientDocId || !isCaregiver) return;
        const item = schedule.find(s => s.id === id);
        if (!item) return;

        const newCompletedDates = { ...item.completedDates };
        const isCompleting = !newCompletedDates[date];

        if (isCompleting) {
            newCompletedDates[date] = true;
            addHistoryEvent({ type: 'schedule_completed', timestamp: new Date(), title: `${item.title} realizado`, description: `Tarefa completada em ${date}` });
        } else {
            delete newCompletedDates[date];
        }
        await updateDoc(doc(db, 'patients', patientDocId, 'schedule', id), { completedDates: newCompletedDates });
    };

    const handleUpdateProfile = async (newProfile: PatientProfile) => {
        if (!patientDocId || !isCaregiver) return;
        await updateDoc(doc(db, 'patients', patientDocId), newProfile as any);
        setIsProfileModalOpen(false);
    };

    const handleUpdateTeam = async (newTeam: TeamMember[]) => {
        if (!patientDocId || !isCaregiver) return;
        const teamEmails = newTeam.map(m => m.email).filter(e => e);
        
        await updateDoc(doc(db, 'patients', patientDocId), { 
            team: newTeam,
            team_emails: teamEmails
        });
        setIsTeamModalOpen(false);
    };

    const handleSaveDailyNote = async (date: string, content: string) => {
        if (!patientDocId) return;
        await setDoc(doc(db, 'patients', patientDocId, 'notes', date), { date, content, timestamp: new Date() }, { merge: true });
    };

    // Render Helpers
    const todaySchedule = useMemo(() => getScheduleForDate(schedule, new Date()), [schedule]);
    const latestMetrics = useMemo(() => {
        const latest: { [key: string]: HealthMetric } = {};
        metrics.forEach(metric => { if (!latest[metric.type]) latest[metric.type] = metric; });
        const preferredOrder = [METRIC_TYPES.BloodPressure, METRIC_TYPES.Temperature, METRIC_TYPES.Glucose, METRIC_TYPES.Saturation, METRIC_TYPES.HeartRate, METRIC_TYPES.Weight];
        return preferredOrder.map(type => latest[type]).filter(Boolean) as HealthMetric[];
    }, [metrics]);

    const getAge = (birthDate: string) => {
        if (!birthDate) return 0;
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
        return age;
    }

    const renderContent = () => {
        if (!patientProfile) return <div className="text-center p-10 text-gray-500">Carregando dados...</div>;
        
        switch (activeView) {
            case 'dashboard': return renderDashboard();
            case 'profile': return <PatientProfilePage profile={patientProfile} onEdit={() => setIsProfileModalOpen(true)} isCaregiver={isCaregiver} onManageTeam={() => setIsTeamModalOpen(true)} />;
            case 'schedule': return <SchedulePage schedule={schedule} onAddItem={() => { setEditingScheduleItem(null); setIsScheduleModalOpen(true); }} onEditItem={handleEditScheduleItem} onDeleteItem={handleDeleteScheduleItem} onToggleComplete={handleToggleSchedule} isCaregiver={isCaregiver} />;
            case 'history': return <HistoryPage log={historyLog} />;
            default: return renderDashboard();
        }
    };

    const renderDashboard = () => {
        if (!patientProfile) return null;
        const todayStr = toYYYYMMDD(new Date());
        const todayNote = dailyNotes[todayStr] || { date: todayStr, content: '', timestamp: new Date() };

        return (
            <>
                <div className="bg-white p-4 rounded-lg shadow-md mb-6 border-l-4 border-blue-600">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{patientProfile.name}, {getAge(patientProfile.birthDate)} anos</h2>
                            <p className="text-sm text-gray-600 mt-1"><strong>Condição:</strong> {patientProfile.mainCondition}</p>
                        </div>
                        {currentUser && (
                            <div className="text-right hidden sm:block">
                                <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${isCaregiver ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {isCaregiver ? 'Modo Cuidador' : 'Modo Visualização'}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                        <section>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><CalendarIcon /> Agenda Hoje</h2>
                            <div className="space-y-3">
                                {todaySchedule.length > 0 ? todaySchedule.map(item => <ScheduleCard key={`${item.id}-${todayStr}`} item={item} onToggle={handleToggleSchedule} occurrenceDate={todayStr} isCaregiver={isCaregiver} />) : <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">Nada pendente hoje.</div>}
                            </div>
                        </section>
                        <DailyNotesCard note={todayNote} onSave={handleSaveDailyNote} isCaregiver={isCaregiver} />
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        <section>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><HeartIcon /> Sinais Vitais</h2>
                                <button onClick={() => setIsMetricModalOpen(true)} disabled={!isCaregiver} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                    <PlusCircleIcon /> <span>Check-up</span>
                                </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {latestMetrics.length > 0 ? latestMetrics.map(metric => <MetricCard key={metric.id} metric={metric} />) : <div className="col-span-full bg-gray-50 p-8 rounded-lg text-center text-gray-500 border border-dashed border-gray-300">Sem medições recentes.</div>}
                            </div>
                        </section>

                        <section>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2"><SparklesIcon /> Análise IA</h2>
                                {isLoading && <span className="text-sm text-blue-600 animate-pulse">Gerando análise...</span>}
                            </div>
                            <div className="bg-white p-5 rounded-lg shadow-md min-h-[200px] border border-gray-100">
                                {error && <div className="text-red-600 bg-red-50 p-4 rounded">{error}</div>}
                                {!error && !aiAnalysis && !isLoading && <div className="flex flex-col items-center justify-center h-40 text-gray-400"><span className="text-4xl mb-2">🤖</span><p>Realize um check-up para iniciar a análise.</p></div>}
                                {aiAnalysis && (
                                    <div className="space-y-6">
                                        <div><h3 className="font-bold text-lg mb-2">Resumo</h3><p className="text-gray-700 bg-blue-50 p-4 rounded border border-blue-100">{aiAnalysis.summary}</p></div>
                                        {aiAnalysis.alerts.length > 0 && <div><h3 className="font-bold text-lg mb-3">Alertas</h3><div className="space-y-3">{aiAnalysis.alerts.map((a, i) => <AlertCard key={i} alert={a}/>)}</div></div>}
                                        {aiAnalysis.recommendations.length > 0 && <div><h3 className="font-bold text-lg mb-3">Recomendações</h3><ul className="space-y-2">{aiAnalysis.recommendations.map((r, i) => <li key={i} className="flex gap-2 text-gray-700 bg-gray-50 p-2 rounded"><span className="text-blue-500">•</span>{r}</li>)}</ul></div>}
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </>
        );
    };

    if (isAuthLoading) return <div className="flex items-center justify-center min-h-screen bg-gray-50 font-semibold text-gray-500">Carregando Care Monitor...</div>;
    if (!authUser) return <LoginPage onLogin={handleLogin} onCreateAccount={handleCreateAccount} error={authError} />;

    return (
        <div className="bg-gray-100 min-h-screen font-sans text-gray-800 pb-20">
            {isMetricModalOpen && <AddMetricModal isOpen={isMetricModalOpen} onClose={() => setIsMetricModalOpen(false)} onSave={handleAddMetric} />}
            {isProfileModalOpen && patientProfile && <EditProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} onSave={handleUpdateProfile} currentProfile={patientProfile} />}
            {isScheduleModalOpen && <AddScheduleItemModal isOpen={isScheduleModalOpen} onClose={() => {setIsScheduleModalOpen(false); setEditingScheduleItem(null);}} onSave={handleSaveScheduleItem} itemToEdit={editingScheduleItem} />}
            {isTeamModalOpen && patientProfile && <ManageTeamModal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} onSave={handleUpdateTeam} currentTeam={patientProfile.team} />}
            
            <UrgentContactsBar services={URGENT_SERVICES} />
            {alertNotification && <div className="bg-red-100 border-b-4 border-red-500 text-red-800 p-4 animate-bounce sticky top-0 z-50 shadow-lg"><div className="container mx-auto flex items-center justify-between"><div className="flex items-center gap-3 font-bold"><WarningIcon /><span>{alertNotification}</span></div><button onClick={() => setAlertNotification(null)}><XCircleIcon /></button></div></div>}

            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center space-x-2"><HeartIcon /><h1 className="text-2xl font-extrabold text-blue-600 tracking-tight">Care Monitor</h1></div>
                        <div className="flex items-center gap-3">
                            {patientProfile && currentUser && (
                                <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 border border-gray-200">
                                    <span className="text-xs text-gray-500 mr-2 uppercase font-bold hidden sm:inline">Usuário:</span>
                                    <span className="text-sm font-semibold text-gray-700 max-w-[80px] truncate">{currentUser.name ? currentUser.name.split(' ')[0] : 'Visitante'}</span>
                                </div>
                            )}
                            <button onClick={handleLogout} className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-gray-100 transition-colors" title="Sair">
                                <LogoutIcon />
                            </button>
                        </div>
                    </div>
                    <nav className="flex items-center gap-4 overflow-x-auto pb-2 no-scrollbar">
                        <NavItem label="Principal" icon={<HomeIcon />} isActive={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
                        <NavItem label="Agenda" icon={<CalendarIcon />} isActive={activeView === 'schedule'} onClick={() => setActiveView('schedule')} />
                        <NavItem label="Histórico" icon={<ClipboardListIcon />} isActive={activeView === 'history'} onClick={() => setActiveView('history')} />
                        <NavItem label="Perfil" icon={<UserCircleIcon />} isActive={activeView === 'profile'} onClick={() => setActiveView('profile')} />
                    </nav>
                </div>
            </header>
            <main className="container mx-auto px-4 py-6">{renderContent()}</main>
        </div>
    );
};

export default App;