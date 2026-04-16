interface IconProps {
  size?: number;
  className?: string;
}

export function InstagramIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <defs>
        <radialGradient id="ig-grad" cx="30%" cy="107%" r="150%">
          <stop offset="0%" stopColor="#ffd600" />
          <stop offset="30%" stopColor="#ff6f00" />
          <stop offset="60%" stopColor="#e91e8c" />
          <stop offset="100%" stopColor="#6a1de4" />
        </radialGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#ig-grad)" />
      <circle cx="12" cy="12" r="4.2" stroke="white" strokeWidth="1.8" fill="none" />
      <circle cx="17.3" cy="6.7" r="1.1" fill="white" />
    </svg>
  );
}

export function TikTokIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <rect width="24" height="24" rx="6" fill="#000000" />
      <path
        d="M16.5 5.5c.4 1.7 1.5 2.7 3 3v2.2c-1.1 0-2.1-.3-3-.9v5.2c0 2.8-2 5-4.5 5s-4.5-2.2-4.5-5 2-5 4.5-5c.2 0 .5 0 .7.1v2.3c-.2-.1-.5-.1-.7-.1-1.4 0-2.5 1.2-2.5 2.7s1.1 2.7 2.5 2.7 2.5-1.2 2.5-2.7V5.5h2z"
        fill="white"
      />
      <path
        d="M17.5 8.7c.9.6 1.9.9 3 .9v-1c-.6-.1-1.2-.4-1.7-.8-.7-.6-1.2-1.5-1.3-2.3h-1v9.5c0 1.5-1.1 2.7-2.5 2.7s-2.5-1.2-2.5-2.7 1.1-2.7 2.5-2.7c.2 0 .5 0 .7.1V11c-.2 0-.5-.1-.7-.1-2.5 0-4.5 2.2-4.5 5s2 5 4.5 5 4.5-2.2 4.5-5V8.7z"
        fill="#fe2c55"
      />
    </svg>
  );
}

export function FacebookIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <rect width="24" height="24" rx="6" fill="#1877F2" />
      <path
        d="M16 12h-2.5v8h-3v-8H9V9.5h1.5V8c0-2 1.2-3 3-3 .8 0 1.7.1 2.5.2V7.5H15c-.8 0-1 .4-1 1v1h2.2L16 12z"
        fill="white"
      />
    </svg>
  );
}

export function GoogleMapsIcon({ size = 24, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <rect width="24" height="24" rx="6" fill="#ffffff" />
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335" />
      <circle cx="12" cy="9" r="2.5" fill="white" />
    </svg>
  );
}
