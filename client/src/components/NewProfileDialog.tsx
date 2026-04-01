import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { JobProfileRole } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const PROFILE_ROLES: JobProfileRole[] = [
  'Data Architect',
  'AI Architect',
  'Data Engineer',
  'AI Engineer',
  'Data Leader',
  'AI Leader',
  'Database Administrator',
];

interface NewProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NewProfileDialog({
  open,
  onOpenChange,
}: NewProfileDialogProps) {
  const { addProfile } = useApp();
  const [selectedRole, setSelectedRole] = useState<JobProfileRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }

    setIsLoading(true);
    try {
      addProfile(selectedRole as JobProfileRole);
      toast.success(`${selectedRole} profile created`);
      setSelectedRole(null);
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to create profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Job Profile</DialogTitle>
          <DialogDescription>
            Select a role to create a new job search profile
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="role">Job Role</Label>
            <Select value={selectedRole || ''} onValueChange={(value) => setSelectedRole(value as JobProfileRole)}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role..." />
              </SelectTrigger>
              <SelectContent>
                {PROFILE_ROLES.map(role => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={selectedRole === null || isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Profile'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
