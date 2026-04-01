import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { JobProfile } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface NewApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProfileId: string | null;
  profiles: JobProfile[];
}

export default function NewApplicationDialog({
  open,
  onOpenChange,
  selectedProfileId,
  profiles,
}: NewApplicationDialogProps) {
  const { addApplication } = useApp();
  const [profileId, setProfileId] = useState(selectedProfileId || '');
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [location, setLocation] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!profileId || !companyName || !position) {
      toast.error('Please fill in required fields');
      return;
    }

    setIsLoading(true);
    try {
      addApplication(profileId, {
        companyName,
        position,
        status: 'applied',
        appliedDate: new Date().toISOString(),
        location: location || undefined,
        jobUrl: jobUrl || undefined,
      });
      toast.success('Application added');
      // Reset form
      setCompanyName('');
      setPosition('');
      setLocation('');
      setJobUrl('');
      setProfileId(selectedProfileId || '');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to add application');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Application</DialogTitle>
          <DialogDescription>
            Log a new job application to track your progress
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="profile">Job Profile *</Label>
            <Select value={profileId} onValueChange={setProfileId}>
              <SelectTrigger id="profile">
                <SelectValue placeholder="Select a profile..." />
              </SelectTrigger>
              <SelectContent>
                {profiles.map(profile => (
                  <SelectItem key={profile.id} value={profile.id}>
                    {profile.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Company Name *</Label>
            <Input
              id="company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., Google, Microsoft"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position *</Label>
            <Input
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="e.g., Senior Data Engineer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., Remote, San Francisco"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobUrl">Job URL</Label>
            <Input
              id="jobUrl"
              type="url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://..."
            />
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
            disabled={!profileId || !companyName || !position || isLoading}
          >
            {isLoading ? 'Adding...' : 'Add Application'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
