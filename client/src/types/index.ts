/**
 * Job Search Tracker - Data Models
 * Defines all core types for managing job profiles, applications, and interviews
 */

export type JobProfileRole = 
  | 'Data Architect'
  | 'AI Architect'
  | 'Data Engineer'
  | 'AI Engineer'
  | 'Data Leader'
  | 'AI Leader'
  | 'Database Administrator';

export type ApplicationStatus = 
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'accepted'
  | 'withdrawn';

export type InterviewType = 
  | 'phone'
  | 'technical'
  | 'behavioral'
  | 'system-design'
  | 'final';

export interface JobProfile {
  id: string;
  role: JobProfileRole;
  createdAt: string;
  description?: string;
  isActive: boolean;
}

export interface JobApplication {
  id: string;
  profileId: string;
  companyName: string;
  position: string;
  status: ApplicationStatus;
  appliedDate: string;
  salary?: {
    min?: number;
    max?: number;
    currency: string;
  };
  location?: string;
  jobUrl?: string;
  notes?: string;
  recruiterName?: string;
  recruiterEmail?: string;
  recruiterPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  type: InterviewType;
  scheduledDate: string;
  scheduledTime?: string;
  duration?: number; // in minutes
  interviewer?: string;
  interviewerEmail?: string;
  notes?: string;
  outcome?: 'passed' | 'failed' | 'pending';
  feedbackUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  profiles: JobProfile[];
  applications: JobApplication[];
  interviews: Interview[];
}

export interface ApplicationStats {
  total: number;
  byStatus: Record<ApplicationStatus, number>;
  byProfile: Record<string, number>;
  averageDaysToResponse?: number;
  successRate?: number;
}
