export type MetricType = 'blood_pressure' | 'heart_rate' | 'temperature' | 'glucose' | 'weight' | 'oxygen_saturation';
export type ScheduleItemType = 'medication' | 'appointment' | 'care';
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'once';
export type HistoryEventType = 'metric_added' | 'alert' | 'schedule_completed' | 'note';
export type AlertLevel = 'info' | 'warning' | 'critical';
export type UserRole = 'patient' | 'caregiver' | 'observer' | 'professional';

export interface HealthMetric {
  id: string;
  type: MetricType;
  value: number | { systolic?: number; diastolic?: number };
  unit: string;
  timestamp: Date;
}

export interface ScheduleItem {
  id: string;
  type: ScheduleItemType;
  title: string;
  startTime: string; // HH:MM
  date: string; // Data de início (YYYY-MM-DD)
  frequency: RecurrenceFrequency;
  daysOfWeek?: number[]; // 0=Domingo, 1=Segunda... (Para semanal)
  endDate?: string; // Opcional (Para tratamentos com fim)
  completedDates: { [date: string]: boolean }; // Registro de quando foi feito
}

export interface AIAnalysis {
  id: string;
  timestamp: Date;
  summary: string;
  alerts: Array<{ level: AlertLevel; message: string }>;
  recommendations: string[];
}

export interface HistoryEvent {
  id: string;
  type: HistoryEventType;
  title?: string;
  description?: string;
  timestamp: Date;
}

export interface DailyNote {
  id?: string;
  date: string;
  content: string;
  timestamp?: Date;
}

export interface UrgentService {
  name: string;
  phone: string;
  type: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email?: string;
  role: UserRole;
  joinedAt?: Date;
}

export interface Contact {
    id: string;
    name: string;
    relationship: string;
    phone: string;
}

export interface PatientProfile {
  name: string;
  birthDate: string;
  gender: string;
  mainCondition: string;
  medicalHistory: string;
  allergies: string;
  surgeries: string;
  emergencyContacts: Contact[];
  physicianContacts: Contact[];
  team_uids: string[];
  team?: TeamMember[];
}