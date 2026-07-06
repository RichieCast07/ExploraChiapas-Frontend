// core/shared/layout/Sidebar.tsx
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NavConfig } from '../config/types/NavItem';
import logo from '../../../assets/logo.png';
import './Sidebar.css';

interface SidebarProps {
  config: NavConfig;
  onLogout?: () => void;
}

export function Sidebar({ config, onLogout }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Botón hamburguesa, solo visible en mobile */}
      <button className="sidebar__toggle" onClick={() => setIsOpen(true)}>
        <Menu size={20} />
      </button>

      {/* Overlay oscuro detrás del sidebar en mobile */}
      <div
        className={`sidebar__overlay ${isOpen ? 'sidebar__overlay--visible' : ''}`}
        onClick={closeSidebar}
      />

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__logo">
          <img src={logo} alt="ExploraChiapas" />
        </div>

        <nav className="sidebar__nav">
          {config.main.map((section, idx) => (
            <div className="sidebar__section" key={idx}>
              {section.title && (
                <p className="sidebar__section-title">{section.title}</p>
              )}
              {section.items.map((item) => (
                <SidebarItem key={item.path} item={item} onClick={closeSidebar} />
              ))}
              {idx < config.main.length - 1 && <hr className="sidebar__divider" />}
            </div>
          ))}
        </nav>

        <div className="sidebar__bottom">
          {config.bottom.map((item) =>
            item.path === '/logout' ? (
              <button
                key={item.path}
                onClick={onLogout}
                className="sidebar__item sidebar__item--danger"
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ) : (
              <SidebarItem key={item.path} item={item} onClick={closeSidebar} />
            )
          )}
        </div>
      </aside>
    </>
  );
}

function SidebarItem({
  item,
  onClick,
}: {
  item: NavConfig['main'][number]['items'][number];
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={item.path}
      onClick={onClick}
      className={({ isActive }) =>
        `sidebar__item ${isActive ? 'sidebar__item--active' : ''}`
      }
    >
      <item.icon size={20} />
      <span>{item.label}</span>
    </NavLink>
  );
}