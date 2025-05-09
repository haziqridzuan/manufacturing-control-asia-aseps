
import { cn } from '@/lib/utils';
import { ProjectStatus } from '@/types';

interface StatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

const statusConfig = {
  'pending': {
    bg: 'bg-status-pending/15 dark:bg-status-pending/25',
    text: 'text-status-pending dark:text-status-pending',
    border: 'border-status-pending/30 dark:border-status-pending/40',
    label: 'Pending'
  },
  'in-progress': {
    bg: 'bg-status-in-progress/15 dark:bg-status-in-progress/25',
    text: 'text-status-in-progress dark:text-status-in-progress',
    border: 'border-status-in-progress/30 dark:border-status-in-progress/40',
    label: 'In Progress'
  },
  'delayed': {
    bg: 'bg-status-delayed/15 dark:bg-status-delayed/25',
    text: 'text-status-delayed dark:text-status-delayed',
    border: 'border-status-delayed/30 dark:border-status-delayed/40',
    label: 'Delayed'
  },
  'completed': {
    bg: 'bg-status-completed/15 dark:bg-status-completed/25',
    text: 'text-status-completed dark:text-status-completed',
    border: 'border-status-completed/30 dark:border-status-completed/40',
    label: 'Completed'
  }
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
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
