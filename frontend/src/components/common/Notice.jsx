import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';

const ICONS = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleAlert,
};

/** Inline message. `error` notices are announced immediately (role="alert"). */
export default function Notice({ variant = 'info', title, children, actions }) {
  const Icon = ICONS[variant];
  return (
    <div className={`notice notice--${variant}`} role={variant === 'error' ? 'alert' : 'status'}>
      <Icon className="notice__icon" size={18} aria-hidden="true" />
      <div className="notice__body">
        {title && <p className="notice__title">{title}</p>}
        {children}
      </div>
      {actions && <div className="notice__actions">{actions}</div>}
    </div>
  );
}
