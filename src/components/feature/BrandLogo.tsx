import { Link } from 'react-router-dom';

interface BrandLogoProps {
  /** Where the logo links to. Pass null to render a non-interactive mark. */
  to?: string | null;
  size?: 'sm' | 'md';
  tone?: 'light' | 'dark';
  showName?: boolean;
  className?: string;
}

/**
 * The single source of truth for the UniverS brand mark.
 * Use this everywhere so the logo stays consistent across the product.
 */
export default function BrandLogo({
  to = '/',
  size = 'md',
  tone = 'light',
  showName = true,
  className = '',
}: BrandLogoProps) {
  const mark = size === 'sm' ? 'w-8 h-8' : 'w-9 h-9';
  const icon = size === 'sm' ? 'text-base' : 'text-lg';
  const word = size === 'sm' ? 'text-base' : 'text-lg';
  const wordColor = tone === 'dark' ? 'text-background-50' : 'text-foreground-950';

  const inner = (
    <>
      <span className={`${mark} flex items-center justify-center rounded-md bg-primary-500 text-background-50`}>
        <i className={`ri-graduation-cap-line ${icon}`}></i>
      </span>
      {showName && (
        <span className={`font-heading ${word} font-semibold tracking-tight ${wordColor}`}>UniverS</span>
      )}
    </>
  );

  if (!to) {
    return <div className={`flex items-center gap-2 ${className}`}>{inner}</div>;
  }

  return (
    <Link to={to} aria-label="UniverS" className={`flex items-center gap-2 cursor-pointer ${className}`}>
      {inner}
    </Link>
  );
}