import type { ReactNode } from 'react';

interface ChipProps {
  children: ReactNode;
  icon?: string;
  tone?: 'default' | 'accent' | 'secondary' | 'positive';
  className?: string;
}

const TONES: Record<string, string> = {
  default: 'bg-background-100 text-foreground-800 border-background-200',
  accent: 'bg-accent-100 text-accent-900 border-accent-200',
  secondary: 'bg-secondary-100 text-secondary-900 border-secondary-200',
  positive: 'bg-primary-100 text-primary-700 border-primary-200',
};

export default function Chip({ children, icon, tone = 'default', className = '' }: ChipProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${TONES[tone]} ${className}`}
    >
      {icon && (
        <span className="w-3.5 h-3.5 flex items-center justify-center">
          <i className={`${icon} text-[13px]`}></i>
        </span>
      )}
      {children}
    </span>
  );
}