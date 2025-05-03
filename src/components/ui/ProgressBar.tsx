
import { cn } from '@/lib/utils';
import { ProjectStatus } from '@/types';

interface ProgressBarProps {
  progress: number;
  status: ProjectStatus;
  className?: string;
}

const statusColorMap = {
  'pending': 'bg-status-pending',
  'in-progress': 'bg-status-in-progress',
  'delayed': 'bg-status-delayed',
  'completed': 'bg-status-completed'
};

const ProgressBar = ({ progress, status, className }: ProgressBarProps) => {
  return (
    <div className={cn("w-full bg-gray-200 rounded-full h-2", className)}>
      <div 
        className={cn(
          "h-2 rounded-full", 
          statusColorMap[status]
        )}
        style={{ width: `${progress}%` }} 
      />
    </div>
  );
};

export default ProgressBar;
