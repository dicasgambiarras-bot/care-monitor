import React from 'react';

export type MetricType = 'blood_pressure' | 'heart_rate' | 'temperature' | 'glucose' | 'weight' | 'oxygen_saturation';
export type ScheduleItemType = 'medication' | 'appointment' | 'exercise' | 'meal' | 'rest' | 'monitoring' | 'care';
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'once';
export type HistoryEventType = 'metric_added' | 'appointment' | 'note' | 'alert' | 'schedule_completed';
export type AlertLevel = 'info' | 'warning' | 'critical';
export type UserRole = 'patient' | 'caregiver' | 'physician' | 'observer' | 'professional';

export interface HealthMetric {
  id: string;
  type: MetricType;
  // aceita número simples (ex: bpm) ou objeto para medidas compostas (pressão etc)
  value: number | { systolic?: number; diastolic?: number; temp?: number; level?: number; spO2?: number };
  unit: string;
  timestamp: Date;
  notes?: string;
}

export interface ScheduleItem {
  id: string;
  type: ScheduleItemType;
  title: string;
  description?: string;
  startTime?: string; // adicionado para compatibilidade com App.tsx
  endTime?: string;
  date: string;
  recurrence?: RecurrenceFrequency;
  frequency?: RecurrenceFrequency;
  completedDates?: { [date: string]: boolean };
  notes?: string;
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
  severity?: AlertLevel;
  data?: any;
}

export interface DailyNote {
  id?: string;
  date: string;
  content: string;
  timestamp?: Date;
  mood?: string;
}

export interface UrgentService {
  name: string;
  phone: string;
  type: string;
}

export interface TeamMember {
  id: string; // App.tsx usa 'id'
  name: string;
  email?: string;
  role: UserRole;
  specialization?: string;
  phone?: string;
  joinedAt?: Date;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface PhysicianContact {
  id: string;
  name: string;
  phone: string;
  specialization: string;
  email?: string;
}

export interface PatientProfile {
  name: string;
  birthDate: string;
  gender: string;
  mainCondition: string;
  medicalHistory: string;
  allergies: string;
  surgeries: string;
  emergencyContacts: EmergencyContact[];
  physicianContacts: PhysicianContact[];
  team_uids: string[];
  team?: TeamMember[];
}