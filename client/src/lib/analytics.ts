import { AppState, ApplicationStats, ApplicationStatus } from '@/types';

/**
 * Calculate statistics from application data
 */
export function calculateStats(state: AppState): ApplicationStats {
  const applications = state.applications;
  
  const stats: ApplicationStats = {
    total: applications.length,
    byStatus: {
      applied: 0,
      screening: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
      accepted: 0,
      withdrawn: 0,
    },
    byProfile: {},
  };

  // Count by status
  applications.forEach(app => {
    stats.byStatus[app.status]++;
  });

  // Count by profile
  state.profiles.forEach(profile => {
    const count = applications.filter(app => app.profileId === profile.id).length;
    stats.byProfile[profile.role] = count;
  });

  // Calculate success rate (offers / total)
  if (stats.total > 0) {
    stats.successRate = (stats.byStatus.offer / stats.total) * 100;
  }

  // Calculate average days to response
  const applicationsWithResponse = applications.filter(
    app => app.status !== 'applied'
  );
  if (applicationsWithResponse.length > 0) {
    const totalDays = applicationsWithResponse.reduce((sum, app) => {
      const appliedDate = new Date(app.appliedDate);
      const today = new Date();
      return sum + Math.floor((today.getTime() - appliedDate.getTime()) / (1000 * 60 * 60 * 24));
    }, 0);
    stats.averageDaysToResponse = Math.round(totalDays / applicationsWithResponse.length);
  }

  return stats;
}

/**
 * Get applications for a specific profile
 */
export function getApplicationsByProfile(state: AppState, profileId: string) {
  return state.applications.filter(app => app.profileId === profileId);
}

/**
 * Get interviews for a specific application
 */
export function getInterviewsByApplication(state: AppState, applicationId: string) {
  return state.interviews.filter(i => i.applicationId === applicationId);
}

/**
 * Get upcoming interviews
 */
export function getUpcomingInterviews(state: AppState) {
  const now = new Date();
  return state.interviews
    .filter(i => new Date(i.scheduledDate) > now)
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get status badge color
 */
export function getStatusColor(status: ApplicationStatus): string {
  const colors: Record<ApplicationStatus, string> = {
    applied: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    screening: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    interview: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    offer: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
    accepted: 'bg-green-500/10 text-green-400 border-green-500/20',
    withdrawn: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };
  return colors[status];
}

/**
 * Get status label
 */
export function getStatusLabel(status: ApplicationStatus): string {
  const labels: Record<ApplicationStatus, string> = {
    applied: 'Applied',
    screening: 'Screening',
    interview: 'Interview',
    offer: 'Offer',
    rejected: 'Rejected',
    accepted: 'Accepted',
    withdrawn: 'Withdrawn',
  };
  return labels[status];
}
