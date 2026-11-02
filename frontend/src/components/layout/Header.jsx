import { Menu } from 'lucide-react';

export default function Header({ title, onMenuClick, menuOpen }) {
  return (
    <header className="header">
      <button
        type="button"
        className="icon-button header__menu"
        onClick={onMenuClick}
        aria-label="Open navigation"
        aria-expanded={menuOpen}
        aria-controls="sidebar"
      >
        <Menu size={20} aria-hidden="true" />
      </button>
      <p className="header__title">{title}</p>
      <p className="header__subtitle">AI-Powered Code Analysis & Debugging Assistant</p>
    </header>
  );
}
