export enum MetricType {
  BloodPressure = 'blood_pressure',
  Temperature = 'temperature',
  Glucose = 'glucose',
  Saturation = 'saturation',
}

export interface HealthMetric {
  id: string;
  type: MetricType;
  value: {
    systolic?: number;
    diastolic?: number;
    temp?: number;
    level?: number;
    spO2?: number;
  };
  timestamp: Date;
  notes?: string;
}

export enum ScheduleItemType {
  Medication = 'medication',
  Care = 'care',
  Appointment = 'appointment',
}

export enum RecurrenceFrequency {
    None = 'none',
    Daily = 'daily',
    Weekly = 'weekly',
    Monthly = 'monthly',
}


export interface ScheduleItem {
  id: string;
  type: ScheduleItemType;
  title: string;
  time: string; // HH:MM
  details?: string;
  completedDates: { [date: string]: boolean }; // Key: 'YYYY-MM-DD', Value: true
  
  // Recurrence properties
  startDate: string; // YYYY-MM-DD
  frequency: RecurrenceFrequency;
  daysOfWeek?: number[]; // 0 for Sunday, 1 for Monday, etc. (for weekly)
  endDate?: string; // Optional end date
}


export enum AlertLevel {
    Info = 'info',
    Warning = 'warning',
    Critical = 'critical',
}

export interface AIAlert {
    level: AlertLevel;
    title: string;
    description: string;
    firstAid?: string;
    emergencyScript?: string;
}

export interface AIAnalysis {
    summary: string;
    alerts: AIAlert[];
    recommendations: string[];
}


// --- User & Team Management ---
export enum UserRole {
    Caregiver = 'caregiver',
    Observer = 'observer',
    Professional = 'professional',
}

export interface TeamMember {
    id: string;
    name: string;
    role: UserRole;
}


// Detailed Patient Profile
export interface Contact {
    id: string;
    name: string;
    relationship: string;
    phone: string;
}

export interface UrgentService {
    name: string;
    phone: string;
}

export interface PatientProfile {
    name: string;
    birthDate: string; // YYYY-MM-DD for easier input handling
    gender: string;
    mainCondition: string;
    medicalHistory: string; // Using textarea for simplicity, can be array later
    allergies: string; // Using textarea
    surgeries: string; // Using textarea
    emergencyContacts: Contact[];
    physicianContacts: Contact[];
    team: TeamMember[]; // List of users associated with this patient profile
}

// --- History & Notes ---
export interface DailyNote {
    date: string; // YYYY-MM-DD
    content: string;
}

export enum HistoryEventType {
    Metric = 'metric',
    Schedule = 'schedule',
    Alert = 'alert',
    Note = 'note',
}

export type HistoryEvent = {
    id: string;
    timestamp: Date;
} & (
    | { type: HistoryEventType.Metric; data: HealthMetric }
    | { type: HistoryEventType.Schedule; data: { item: ScheduleItem; occurrenceDate: string } }
    | { type: HistoryEventType.Alert; data: AIAlert }
    | { type: HistoryEventType.Note; data: DailyNote }
);
