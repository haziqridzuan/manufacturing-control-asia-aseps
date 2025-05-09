
import { cn } from '@/lib/utils';
import { ProjectStatus } from '@/types';

interface StatusBadgeProps {
  status: ProjectStatus | string;
  className?: string;
}

const statusConfig: Record<string, { bg: string; text: string; border: string; label: string }> = {
  'pending': {
    bg: 'bg-status-pending/15',
    text: 'text-status-pending',
    border: 'border-status-pending/30',
    label: 'Pending'
  },
  'in-progress': {
    bg: 'bg-status-in-progress/15',
    text: 'text-status-in-progress',
    border: 'border-status-in-progress/30',
    label: 'In Progress'
  },
  'delayed': {
    bg: 'bg-status-delayed/15',
    text: 'text-status-delayed',
    border: 'border-status-delayed/30',
    label: 'Delayed'
  },
  'completed': {
    bg: 'bg-status-completed/15',
    text: 'text-status-completed',
    border: 'border-status-completed/30',
    label: 'Completed'
  },
  'active': {
    bg: 'bg-status-in-progress/15',
    text: 'text-status-in-progress',
    border: 'border-status-in-progress/30',
    label: 'Active'
  },
  'canceled': {
    bg: 'bg-status-delayed/15',
    text: 'text-status-delayed',
    border: 'border-status-delayed/30',
    label: 'Canceled'
  }
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  // Use the status config or fallback to pending if the status doesn't exist
  const config = statusConfig[status] || statusConfig['pending'];
  
  return (
    <div className={cn(
      'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
      config.bg,
      config.text,
      config.border,
      className
    )}>
      {config.label}
    </div>
  );
};

export default StatusBadge;
