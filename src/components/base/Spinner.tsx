interface SpinnerProps {
  className?: string;
}

export default function Spinner({ className = '' }: SpinnerProps) {
  return <i className={`ri-loader-4-line animate-spin ${className}`}></i>;
}