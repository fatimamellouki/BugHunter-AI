import { Bug, Code, FileSearch, House, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAnalysis } from '../../context/AnalysisContext';
import { API_BASE_URL } from '../../services/api';

const LINKS = [
  { to: '/', label: 'Home', icon: House, end: true },
  { to: '/analysis', label: 'Code Analysis', icon: Code },
  { to: '/results', label: 'Analysis Results', icon: FileSearch },
];

export default function Sidebar({ isOpen, onClose }) {
  const { result } = useAnalysis();
  return (
    <aside id="sidebar" className={`sidebar${isOpen ? ' sidebar--open' : ''}`} aria-label="Sidebar">
      <div className="sidebar__brand">
        <span className="logo-mark" aria-hidden="true">
          <Bug size={18} />
        </span>
        <div>
          <p className="sidebar__name">BugHunter AI</p>
          <p className="sidebar__tagline">Code analysis & debugging</p>
        </div>
        <button type="button" className="icon-button sidebar__close" onClick={onClose} aria-label="Close navigation">
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="Main navigation">
        <ul className="sidebar__links">
          {LINKS.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink to={to} end={end} className="sidebar__link">
                <Icon size={18} aria-hidden="true" />
                <span>{label}</span>
                {to === '/results' && result && <span className="sidebar__count">{result.issues.length}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

     
    </aside>
  );
}
