type P = { className?: string; size?: number };
const base = (size = 20) => ({ width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true });

export const BagIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M6 7h12l-1 13H7z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
);
export const ChatIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.7-5.2A8.5 8.5 0 1 1 21 12z" /></svg>
);
export const PhoneIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>
);
export const MailIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
export const PinIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z" /><circle cx="12" cy="9" r="2.5" /></svg>
);
export const StarIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z" /></svg>
);
export const CheckIcon = ({ className, size }: P) => (
  <svg {...base(size)} strokeWidth={2.6} className={className}><path d="M5 12l5 5L20 7" /></svg>
);
export const LockIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
);
export const MenuIcon = ({ className, size }: P) => (
  <svg {...base(size)} strokeWidth={2} className={className}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const CloseIcon = ({ className, size }: P) => (
  <svg {...base(size)} strokeWidth={2} className={className}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const UploadIcon = ({ className, size }: P) => (
  <svg {...base(size)} className={className}><path d="M12 16V4M7 9l5-5 5 5M4 20h16" /></svg>
);
