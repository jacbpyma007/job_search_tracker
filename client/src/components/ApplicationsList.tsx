import { JobApplication, JobProfile } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getStatusColor, getStatusLabel, formatDate } from '@/lib/analytics';
import { useApp } from '@/contexts/AppContext';
import { Trash2, Edit2, Calendar } from 'lucide-react';
import { useState } from 'react';
import EditApplicationDialog from './EditApplicationDialog';

interface ApplicationsListProps {
  applications: JobApplication[];
  profiles: JobProfile[];
}

export default function ApplicationsList({
  applications,
  profiles,
}: ApplicationsListProps) {
  const { deleteApplication, state } = useApp();
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);

  if (applications.length === 0) {
    return (
      <Card className="card-subtle p-12 text-center">
        <img 
          src="https://d2xsxph8kpxj0f.cloudfront.net/310419663030447867/BFgj8bSDHgMq2gwALa56Dn/empty-state-illustration-GCkVfmyZ4BiBDrfwRin2Db.webp"
          alt="No applications"
          className="w-48 h-48 mx-auto mb-6 opacity-80"
        />
        <p className="text-muted-foreground text-lg">
          No applications yet. Start your job search journey!
        </p>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {applications.map(app => {
          const profile = profiles.find(p => p.id === app.profileId);
          const interviews = state.interviews.filter(i => i.applicationId === app.id);

          return (
            <Card key={app.id} className="card-subtle p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {app.position}
                    </h3>
                    <Badge variant="outline" className={getStatusColor(app.status)}>
                      {getStatusLabel(app.status)}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">{app.companyName}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {app.location && (
                      <span>📍 {app.location}</span>
                    )}
                    <span>📅 {formatDate(app.appliedDate)}</span>
                    {app.salary && (
                      <span>
                        💰 {app.salary.min && app.salary.max 
                          ? `$${app.salary.min.toLocaleString()}-$${app.salary.max.toLocaleString()}`
                          : 'Salary TBD'
                        }
                      </span>
                    )}
                    {interviews.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {interviews.length} interview{interviews.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  {profile && (
                    <div className="mt-3 text-xs">
                      <span className="inline-block px-2 py-1 bg-primary/10 text-primary rounded">
                        {profile.role}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingApp(app)}
                    className="gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      if (window.confirm('Delete this application?')) {
                        deleteApplication(app.id);
                      }
                    }}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {editingApp && (
        <EditApplicationDialog
          application={editingApp}
          open={!!editingApp}
          onOpenChange={(open: boolean) => !open && setEditingApp(null)}
        />
      )}
    </>
  );
}
