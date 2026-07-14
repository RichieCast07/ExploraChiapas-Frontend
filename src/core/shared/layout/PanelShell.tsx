import type { ReactNode } from 'react';
import { Bell, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

import { adminNavConfig } from '../config/navigation/adminNavConfig';
import { negocioNavConfig } from '../config/navigation/negocioNavConfig';
import { logout } from '../utils/auth';
import { Sidebar } from './Sidebar';

import './PanelShell.css';
import './PanelUI.css';

type PanelKind = 'admin' | 'business';

interface PanelShellProps {
  kind: PanelKind;
  children: ReactNode;
  searchPlaceholder?: string;
}

export function PanelShell({
  kind,
  children,
  searchPlaceholder = 'Buscar destinos, negocios o usuarios...',
}: PanelShellProps) {
  const isAdmin = kind === 'admin';
  const userName = localStorage.getItem('user_name') ?? (isAdmin ? 'Admin Explora' : 'Selva Verde Resort');
  const profilePath = isAdmin ? '/admin/perfil' : '/negocio/perfil';

  return (
    <div className={`panel-shell panel-shell--${kind}`}>
      <Sidebar
        config={isAdmin ? adminNavConfig : negocioNavConfig}
        onLogout={logout}
      />

      <div className="panel-shell__body">
        <header className="panel-topbar">
          {isAdmin ? (
            <label className="panel-topbar__search">
              <Search size={18} aria-hidden="true" />
              <input type="search" placeholder={searchPlaceholder} />
            </label>
          ) : (
            <Link className="panel-topbar__brand" to="/negocio/inicio">
              ExploraChiapas
            </Link>
          )}

          <div className="panel-topbar__actions">
            <button className="panel-icon-button" type="button" aria-label="Notificaciones">
              <Bell size={19} />
              <span className="panel-icon-button__dot" />
            </button>

            <div className="panel-topbar__separator" />

            <Link className="panel-user" to={profilePath}>
              <span className="panel-user__text">
                <strong>{userName}</strong>
                <small>{isAdmin ? 'SUPERADMINISTRADOR' : 'Administrador'}</small>
              </span>
              <span className="panel-user__avatar">{userName.charAt(0).toUpperCase()}</span>
            </Link>
          </div>
        </header>

        <main className="panel-shell__content">{children}</main>
      </div>
    </div>
  );
}
