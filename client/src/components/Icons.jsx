const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };

export const LogoIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" className={className}>
    <defs>
      <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#a78bfa" />
        <stop offset="1" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
    <rect width="64" height="64" rx="16" fill="url(#lg)" />
    <path d="M16 20h32a4 4 0 0 1 4 4v16a4 4 0 0 1-4 4H30l-9 8v-8h-5a4 4 0 0 1-4-4V24a4 4 0 0 1 4-4z" fill="#fff" />
  </svg>
);

export const MenuIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><circle cx="12" cy="5" r="1.2" /><circle cx="12" cy="12" r="1.2" /><circle cx="12" cy="19" r="1.2" /></svg>
);
export const SearchIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const ImageIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="1.6" /><path d="m21 16-5-5-9 9" /></svg>
);
export const SendIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="m22 2-11 11" /><path d="m22 2-7 20-4-9-9-4z" /></svg>
);
export const BackIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="m15 18-6-6 6-6" /></svg>
);
export const InfoIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg>
);
export const CameraIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.5" /></svg>
);
