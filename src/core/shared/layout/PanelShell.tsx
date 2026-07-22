import {
  Bell,
  Moon,
  Sun,
} from 'lucide-react';

import type {
  ReactNode,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import {
  adminNavConfig,
} from '../config/navigation/adminNavConfig';

import {
  negocioNavConfig,
} from '../config/navigation/negocioNavConfig';

import {
  useTheme,
} from '../theme/UseTheme';

import {
  logout,
} from '../utils/auth';

import {
  Sidebar,
} from './Sidebar';

import './PanelShell.css';
import './PanelUI.css';

type PanelKind =
  | 'admin'
  | 'business';

interface PanelShellProps {
  kind: PanelKind;
  children: ReactNode;
  searchPlaceholder?: string;
}

export function PanelShell({
  kind,
  children,
}: PanelShellProps) {
  const isAdmin =
    kind === 'admin';

  const {
    theme,
    toggleTheme,
  } = useTheme();

  const userName =
    localStorage.getItem(
      'user_name',
    ) ??
    (
      isAdmin
        ? 'Administrador'
        : 'Administrador de negocio'
    );

  return (
    <div
      className={`panel-shell panel-shell--${kind}`}
    >
      <Sidebar
        config={
          isAdmin
            ? adminNavConfig
            : negocioNavConfig
        }
        onLogout={logout}
      />

      <div className="panel-shell__body">
        <header className="panel-topbar">
          <Link
            className="panel-topbar__brand"
            to={
              isAdmin
                ? '/admin/dashboard'
                : '/negocio/inicio'
            }
          >
            ExploraChiapas
          </Link>

          <div className="panel-topbar__actions">
            <button
              className="panel-icon-button"
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === 'dark'
                  ? 'Cambiar a modo claro'
                  : 'Cambiar a modo oscuro'
              }
              title={
                theme === 'dark'
                  ? 'Modo claro'
                  : 'Modo oscuro'
              }
            >
              {theme === 'dark'
                ? (
                  <Sun size={19} />
                )
                : (
                  <Moon size={19} />
                )}
            </button>

            {isAdmin && (
              <Link
                className="panel-icon-button"
                to="/admin/moderacion"
                aria-label="Ver alertas"
                title="Ver alertas"
              >
                <Bell size={19} />
              </Link>
            )}

            <div className="panel-topbar__separator" />

            {isAdmin
              ? (
                <div className="panel-user">
                  <span className="panel-user__text">
                    <strong>
                      {userName}
                    </strong>

                    <small>
                      SUPERADMINISTRADOR
                    </small>
                  </span>

                  <span className="panel-user__avatar">
                    {userName
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                </div>
              )
              : (
                <Link
                  className="panel-user"
                  to="/negocio/cuenta"
                >
                  <span className="panel-user__text">
                    <strong>
                      {userName}
                    </strong>

                    <small>
                      Administrador
                    </small>
                  </span>

                  <span className="panel-user__avatar">
                    {userName
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                </Link>
              )}
          </div>
        </header>

        <main className="panel-shell__content">
          {children}
        </main>
      </div>
    </div>
  );
}
