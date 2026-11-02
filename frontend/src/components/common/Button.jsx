import { LoaderCircle } from 'lucide-react';

export default function Button({
  variant = 'secondary',
  icon: Icon,
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} ${className}`.trim()}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <LoaderCircle className="btn__icon spin" size={16} aria-hidden="true" />
      ) : (
        Icon && <Icon className="btn__icon" size={16} aria-hidden="true" />
      )}
      <span>{children}</span>
    </button>
  );
}
