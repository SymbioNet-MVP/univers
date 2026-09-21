import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: string;
  title: string;
  body?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, body, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-background-200 bg-background-50 px-6 py-14 text-center">
      <span className="w-14 h-14 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
        <i className={`${icon} text-2xl`}></i>
      </span>
      <h4 className="mt-4 font-heading text-base font-semibold text-foreground-950">{title}</h4>
      {body && <p className="mt-1.5 max-w-md text-sm text-foreground-600">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}