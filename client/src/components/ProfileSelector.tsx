import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import NewProfileDialog from './NewProfileDialog';

interface ProfileSelectorProps {
  selectedProfileId: string | null;
  onSelectProfile: (profileId: string | null) => void;
}

/**
 * Profile Selector Component
 * Displays and manages job profiles with Swiss Design aesthetics
 */
export default function ProfileSelector({
  selectedProfileId,
  onSelectProfile,
}: ProfileSelectorProps) {
  const { state, deleteProfile } = useApp();
  const [showNewProfile, setShowNewProfile] = useState(false);

  const activeProfiles = state.profiles.filter(p => p.isActive);

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Job Profiles</h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowNewProfile(true)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Profile
          </Button>
        </div>

        {activeProfiles.length === 0 ? (
          <Card className="card-subtle p-8 text-center">
            <p className="text-muted-foreground mb-4">
              No job profiles yet. Create your first profile to get started.
            </p>
            <Button onClick={() => setShowNewProfile(true)}>
              Create First Profile
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* "All Profiles" button */}
            <button
              onClick={() => onSelectProfile(null)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedProfileId === null
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <p className="font-medium text-foreground">All Profiles</p>
              <p className="text-sm text-muted-foreground mt-1">
                {state.applications.length} applications
              </p>
            </button>

            {/* Individual profiles */}
            {activeProfiles.map(profile => {
              const appCount = state.applications.filter(
                a => a.profileId === profile.id
              ).length;

              return (
                <button
                  key={profile.id}
                  onClick={() => onSelectProfile(profile.id)}
                  className={`p-4 rounded-lg border-2 transition-all group relative ${
                    selectedProfileId === profile.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <p className="font-medium text-foreground text-left">{profile.role}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {appCount} applications
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Delete "${profile.role}" profile?`)) {
                        deleteProfile(profile.id);
                        if (selectedProfileId === profile.id) {
                          onSelectProfile(null);
                        }
                      }
                    }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
                  >
                    <X className="w-4 h-4 text-destructive" />
                  </button>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <NewProfileDialog
        open={showNewProfile}
        onOpenChange={setShowNewProfile}
      />
    </>
  );
}
