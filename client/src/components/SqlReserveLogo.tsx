const SqlReserveLogo = ({ size = 24, className = '' }: { size?: number; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    width={size}
    height={size}
    className={className}
  >
    <defs>
      <linearGradient id="cyl" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#a8c8dc', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#7ba8c4', stopOpacity: 1 }} />
      </linearGradient>
      <linearGradient id="cylDark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#6a9ab8', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: '#5088a4', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    {/* Cylinder body */}
    <rect x="80" y="100" width="260" height="310" rx="6" fill="url(#cyl)" opacity="0.9" />
    {/* Disk lines */}
    <line x1="80" y1="200" x2="340" y2="200" stroke="url(#cylDark)" strokeWidth="6" opacity="0.5" />
    <line x1="80" y1="300" x2="340" y2="300" stroke="url(#cylDark)" strokeWidth="6" opacity="0.5" />
    {/* Top ellipse */}
    <ellipse cx="210" cy="100" rx="130" ry="48" fill="url(#cyl)" stroke="#5a8faa" strokeWidth="4" />
    <ellipse cx="210" cy="100" rx="100" ry="32" fill="url(#cylDark)" opacity="0.35" />
    {/* Bottom ellipse */}
    <ellipse cx="210" cy="410" rx="130" ry="48" fill="url(#cylDark)" opacity="0.6" />
    {/* S curve */}
    <path
      d="M185 120 C130 155 310 210 240 270 C170 330 330 380 260 400"
      stroke="white"
      strokeWidth="18"
      fill="none"
      strokeLinecap="round"
      opacity="0.5"
    />
    {/* Lock */}
    <rect x="310" y="330" width="76" height="62" rx="8" fill="#7ba8c4" stroke="#5a8faa" strokeWidth="3" />
    <path
      d="M330 330 L330 308 C330 286 376 286 376 308 L376 330"
      stroke="#5a8faa"
      strokeWidth="6"
      fill="none"
      strokeLinecap="round"
    />
    <circle cx="348" cy="360" r="9" fill="#1e5a7e" />
  </svg>
);

export default SqlReserveLogo;
