import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export function LoadingSpinner({ size = 24, className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className="animate-spin" size={size} />
    </div>
  );
}

export function PageLoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <LoadingSpinner size={48} />
    </div>
  );
}
