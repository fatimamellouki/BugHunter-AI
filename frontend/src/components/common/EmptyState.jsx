export default function EmptyState({ icon: Icon, title, children, action, tone = 'neutral' }) {
  return (
    <div className={`empty-state empty-state--${tone}`}>
      {Icon && <Icon className="empty-state__icon" size={28} aria-hidden="true" />}
      <h3 className="empty-state__title">{title}</h3>
      {children && <p className="empty-state__text">{children}</p>}
      {action}
    </div>
  );
}
