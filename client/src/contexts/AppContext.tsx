import React, { createContext, useContext, useCallback } from 'react';
import { AppState, JobProfile, JobApplication, Interview, JobProfileRole } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { nanoid } from 'nanoid';

interface AppContextType {
  state: AppState;
  // Profile actions
  addProfile: (role: JobProfileRole, description?: string) => void;
  deleteProfile: (profileId: string) => void;
  toggleProfileActive: (profileId: string) => void;
  // Application actions
  addApplication: (profileId: string, data: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt' | 'profileId'>) => void;
  updateApplication: (applicationId: string, data: Partial<JobApplication>) => void;
  deleteApplication: (applicationId: string) => void;
  // Interview actions
  addInterview: (applicationId: string, data: Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInterview: (interviewId: string, data: Partial<Interview>) => void;
  deleteInterview: (interviewId: string) => void;
  // Utility
  exportData: () => string;
  importData: (jsonData: string) => void;
  clearAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_STATE: AppState = {
  profiles: [],
  applications: [],
  interviews: [],
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useLocalStorage<AppState>('job-tracker-state', INITIAL_STATE);

  const addProfile = useCallback((role: JobProfileRole, description?: string) => {
    const newProfile: JobProfile = {
      id: nanoid(),
      role,
      description,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      profiles: [...prev.profiles, newProfile],
    }));
  }, [setState]);

  const deleteProfile = useCallback((profileId: string) => {
    setState(prev => ({
      ...prev,
      profiles: prev.profiles.filter(p => p.id !== profileId),
      applications: prev.applications.filter(a => a.profileId !== profileId),
    }));
  }, [setState]);

  const toggleProfileActive = useCallback((profileId: string) => {
    setState(prev => ({
      ...prev,
      profiles: prev.profiles.map(p =>
        p.id === profileId ? { ...p, isActive: !p.isActive } : p
      ),
    }));
  }, [setState]);

  const addApplication = useCallback((profileId: string, data: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt' | 'profileId'>) => {
    const newApplication: JobApplication = {
      ...data,
      id: nanoid(),
      profileId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as JobApplication;
    setState(prev => ({
      ...prev,
      applications: [...prev.applications, newApplication],
    }));
  }, [setState]);

  const updateApplication = useCallback((applicationId: string, data: Partial<JobApplication>) => {
    setState(prev => ({
      ...prev,
      applications: prev.applications.map(a =>
        a.id === applicationId
          ? { ...a, ...data, updatedAt: new Date().toISOString() }
          : a
      ),
    }));
  }, [setState]);

  const deleteApplication = useCallback((applicationId: string) => {
    setState(prev => ({
      ...prev,
      applications: prev.applications.filter(a => a.id !== applicationId),
      interviews: prev.interviews.filter(i => i.applicationId !== applicationId),
    }));
  }, [setState]);

  const addInterview = useCallback((applicationId: string, data: Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newInterview: Interview = {
      ...data,
      id: nanoid(),
      applicationId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState(prev => ({
      ...prev,
      interviews: [...prev.interviews, newInterview],
    }));
  }, [setState]);

  const updateInterview = useCallback((interviewId: string, data: Partial<Interview>) => {
    setState(prev => ({
      ...prev,
      interviews: prev.interviews.map(i =>
        i.id === interviewId
          ? { ...i, ...data, updatedAt: new Date().toISOString() }
          : i
      ),
    }));
  }, [setState]);

  const deleteInterview = useCallback((interviewId: string) => {
    setState(prev => ({
      ...prev,
      interviews: prev.interviews.filter(i => i.id !== interviewId),
    }));
  }, [setState]);

  const exportData = useCallback(() => {
    return JSON.stringify(state, null, 2);
  }, [state]);

  const importData = useCallback((jsonData: string) => {
    try {
      const importedState = JSON.parse(jsonData) as AppState;
      setState(importedState);
    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Invalid JSON data');
    }
  }, [setState]);

  const clearAllData = useCallback(() => {
    setState(INITIAL_STATE);
  }, [setState]);

  const value: AppContextType = {
    state,
    addProfile,
    deleteProfile,
    toggleProfileActive,
    addApplication,
    updateApplication,
    deleteApplication,
    addInterview,
    updateInterview,
    deleteInterview,
    exportData,
    importData,
    clearAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
