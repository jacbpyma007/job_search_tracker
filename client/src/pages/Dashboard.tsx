import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { calculateStats, getUpcomingInterviews } from '@/lib/analytics';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, TrendingUp, Calendar, Target, CheckCircle2 } from 'lucide-react';
import ProfileSelector from '@/components/ProfileSelector';
import ApplicationsList from '@/components/ApplicationsList';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import NewApplicationDialog from '@/components/NewApplicationDialog';

/**
 * Main Dashboard - Professional Minimalist Design
 * Displays job search overview, applications, and analytics
 */
export default function Dashboard() {
  const { state } = useApp();
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [showNewApplication, setShowNewApplication] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'analytics'>('overview');

  const stats = calculateStats(state);
  const upcomingInterviews = getUpcomingInterviews(state);
  const selectedProfile = selectedProfileId 
    ? state.profiles.find(p => p.id === selectedProfileId)
    : null;

  const profileApplications = selectedProfileId
    ? state.applications.filter(a => a.profileId === selectedProfileId)
    : state.applications;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative h-64 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://d2xsxph8kpxj0f.cloudfront.net/310419663030447867/BFgj8bSDHgMq2gwALa56Dn/dashboard-hero-bg-9ayk2gG44ESQRJ9MEyysnm.webp)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="relative h-full flex flex-col justify-center px-6 md:px-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Job Search Tracker
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your career journey across multiple profiles
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Profile Selector */}
        <div className="mb-8">
          <ProfileSelector 
            selectedProfileId={selectedProfileId}
            onSelectProfile={setSelectedProfileId}
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="card-subtle p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Applications</p>
                <p className="text-3xl font-bold text-foreground mt-2">{stats.total}</p>
              </div>
              <Target className="w-10 h-10 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="card-subtle p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Interviews</p>
                <p className="text-3xl font-bold text-foreground mt-2">{stats.byStatus.interview}</p>
              </div>
              <Calendar className="w-10 h-10 text-primary opacity-20" />
            </div>
          </Card>

          <Card className="card-subtle p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Offers</p>
                <p className="text-3xl font-bold text-foreground mt-2">{stats.byStatus.offer}</p>
              </div>
              <CheckCircle2 className="w-10 h-10 text-emerald-500 opacity-20" />
            </div>
          </Card>

          <Card className="card-subtle p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm font-medium">Success Rate</p>
                <p className="text-3xl font-bold text-foreground mt-2">
                  {stats.successRate ? `${stats.successRate.toFixed(1)}%` : 'N/A'}
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-primary opacity-20" />
            </div>
          </Card>
        </div>

        {/* Upcoming Interviews */}
        {upcomingInterviews.length > 0 && (
          <Card className="card-subtle p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Upcoming Interviews</h2>
            <div className="space-y-3">
              {upcomingInterviews.slice(0, 3).map(interview => {
                const app = state.applications.find(a => a.id === interview.applicationId);
                return (
                  <div key={interview.id} className="flex items-center justify-between p-3 bg-background rounded border border-border">
                    <div>
                      <p className="font-medium text-foreground">{app?.companyName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(interview.scheduledDate).toLocaleDateString()} at {interview.scheduledTime || 'TBD'}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                      {interview.type}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'applications'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Applications
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">
                  {selectedProfile ? `${selectedProfile.role} Applications` : 'All Applications'}
                </h2>
                <Button 
                  onClick={() => setShowNewApplication(true)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Application
                </Button>
              </div>
              <ApplicationsList 
                applications={profileApplications}
                profiles={state.profiles}
              />
            </div>
          )}

          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-foreground">All Applications</h2>
                <Button 
                  onClick={() => setShowNewApplication(true)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Application
                </Button>
              </div>
              <ApplicationsList 
                applications={state.applications}
                profiles={state.profiles}
              />
            </div>
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard stats={stats} state={state} />
          )}
        </div>
      </div>

      {/* New Application Dialog */}
      <NewApplicationDialog 
        open={showNewApplication}
        onOpenChange={setShowNewApplication}
        selectedProfileId={selectedProfileId}
        profiles={state.profiles}
      />
    </div>
  );
}
