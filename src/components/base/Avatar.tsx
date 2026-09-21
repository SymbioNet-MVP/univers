interface AvatarProps {
  name?: string | null;
  url?: string | null;
  size?: number;
  className?: string;
}

export default function Avatar({ name, url, size = 40, className = '' }: AvatarProps) {
  const initials = (name || '?')
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (url) {
    return (
      <img
        src={url}
        alt={name || 'User'}
        className={`shrink-0 rounded-full border border-background-200 bg-background-100 object-cover shadow-sm ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full border border-primary-200 bg-primary-100 font-semibold text-primary-700 shadow-sm ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
    >
      {initials || '?'}
    </span>
  );
}
