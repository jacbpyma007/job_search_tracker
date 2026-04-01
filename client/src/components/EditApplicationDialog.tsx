import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { JobApplication, ApplicationStatus } from '@/types';
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

const STATUS_OPTIONS: ApplicationStatus[] = [
  'applied',
  'screening',
  'interview',
  'offer',
  'rejected',
  'accepted',
  'withdrawn',
];

interface EditApplicationDialogProps {
  application: JobApplication;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditApplicationDialog({
  application,
  open,
  onOpenChange,
}: EditApplicationDialogProps) {
  const { updateApplication } = useApp();
  const [formData, setFormData] = useState(application);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      updateApplication(application.id, formData);
      toast.success('Application updated');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update application');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Application</DialogTitle>
          <DialogDescription>
            Update application details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => 
                  setFormData({ ...formData, status: value as ApplicationStatus })
                }
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Remote, San Francisco"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minSalary">Min Salary</Label>
              <Input
                id="minSalary"
                type="number"
                value={formData.salary?.min || ''}
                onChange={(e) => 
                  setFormData({
                    ...formData,
                    salary: {
                      ...formData.salary,
                      min: e.target.value ? parseInt(e.target.value) : undefined,
                      currency: formData.salary?.currency || 'USD',
                    }
                  })
                }
                placeholder="0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxSalary">Max Salary</Label>
              <Input
                id="maxSalary"
                type="number"
                value={formData.salary?.max || ''}
                onChange={(e) => 
                  setFormData({
                    ...formData,
                    salary: {
                      ...formData.salary,
                      max: e.target.value ? parseInt(e.target.value) : undefined,
                      currency: formData.salary?.currency || 'USD',
                    }
                  })
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recruiterName">Recruiter Name</Label>
            <Input
              id="recruiterName"
              value={formData.recruiterName || ''}
              onChange={(e) => setFormData({ ...formData, recruiterName: e.target.value })}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recruiterEmail">Recruiter Email</Label>
            <Input
              id="recruiterEmail"
              type="email"
              value={formData.recruiterEmail || ''}
              onChange={(e) => setFormData({ ...formData, recruiterEmail: e.target.value })}
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recruiterPhone">Recruiter Phone</Label>
            <Input
              id="recruiterPhone"
              value={formData.recruiterPhone || ''}
              onChange={(e) => setFormData({ ...formData, recruiterPhone: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes about this application..."
              className="min-h-24"
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
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
