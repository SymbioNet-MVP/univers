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
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className={`rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
    >
      {initials || '?'}
    </span>
  );
}