import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;       // explicit route override
  backLabel?: string;
  children?: React.ReactNode; // right-side actions
}

/**
 * Consistent page header used across all dashboard sub-pages.
 * Shows a back button (navigates -1 in history by default, or to `backTo`).
 */
export default function PageHeader({ title, subtitle, backTo, backLabel = 'Back', children }: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      // Only go back if we have history; otherwise fall back to dashboard
      navigate(-1);
    }
  };

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <button
          onClick={handleBack}
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl btn-ghost hover:scale-105 active:scale-95 transition-all duration-150"
          title={backLabel}
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold page-title leading-tight">{title}</h1>
          {subtitle && (
            <p className="mt-0.5 text-sm page-subtitle">{subtitle}</p>
          )}
        </div>
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-3 sm:flex-shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}
