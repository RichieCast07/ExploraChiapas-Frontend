import {
  BadgeCheck,
  Bell,
  ChevronDown,
  LogOut,
  Moon,
  Sun,
  UserRound,
} from 'lucide-react';

import {
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import {
  Link,
} from 'react-router-dom';

import {
  apiRequest,
  resolveMediaUrl,
} from '../api/apiClient';

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

interface UserProfile {
  id?: string;
  name: string;
  email?: string;
  phone?: string | null;
  imgUrl?: string | null;

  alias?: string | null;

  imageProfileUrl?: string | null;
  profileImageUrl?: string | null;
  imagenPerfilUrl?: string | null;
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

  const [accountOpen, setAccountOpen] =
    useState(false);

  const [profile, setProfile] =
    useState<UserProfile | null>(
      null,
    );

  const storedName =
    localStorage.getItem(
      'user_name',
    );

  const userName =
    profile?.name ??
    storedName ??
    (
      isAdmin
        ? 'Administrador'
        : 'Administrador de negocio'
    );

  useEffect(() => {
    apiRequest<UserProfile>(
      '/users/profile',
    )
      .then((data) => {
        setProfile(data);

        if (data?.name) {
          localStorage.setItem(
            'user_name',
            data.name,
          );
        }
      })
      .catch(() => {
        // La cabecera sigue funcionando
        // con los datos locales.
      });
  }, []);

  useEffect(() => {
    const handleProfileUpdated = (
      event: Event,
    ) => {
      const customEvent =
        event as CustomEvent<UserProfile>;

      if (customEvent.detail) {
        setProfile(
          customEvent.detail,
        );
      }
    };

    window.addEventListener(
      'ec-profile-updated',
      handleProfileUpdated,
    );

    return () =>
      window.removeEventListener(
        'ec-profile-updated',
        handleProfileUpdated,
      );
  }, []);

  const rawAvatar =
    profile?.imgUrl ??
    profile?.imageProfileUrl ??
    profile?.profileImageUrl ??
    profile?.imagenPerfilUrl ??
    null;

  const avatarUrl =
    resolveMediaUrl(rawAvatar);

  const alias =
    profile?.alias?.trim() ||
    profile?.email
      ?.split('@')[0] ||
    userName
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        '.',
      )
      .replace(
        /^\.+|\.+$/g,
        '',
      );

  const initial =
    userName
      .charAt(0)
      .toUpperCase();

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

            {isAdmin ? (
              <Link
                className="panel-user"
                to="/admin/perfil"
                title="Abrir mi perfil"
              >
                <span className="panel-user__text">
                  <strong>
                    {userName}
                  </strong>

                  <small>
                    SUPERADMINISTRADOR
                  </small>
                </span>

                <span className="panel-user__avatar">
                  <span>
                    {initial}
                  </span>

                  {avatarUrl && (
                    <img
                      src={avatarUrl}
                      alt=""
                    />
                  )}
                </span>
              </Link>
            ) : (
              <div className="panel-account">
                <button
                  className="panel-user panel-user--button"
                  type="button"
                  onClick={() =>
                    setAccountOpen(
                      (current) =>
                        !current,
                    )
                  }
                  aria-expanded={
                    accountOpen
                  }
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
                    <span>
                      {initial}
                    </span>

                    {avatarUrl && (
                      <img
                        src={avatarUrl}
                        alt=""
                      />
                    )}
                  </span>

                  <ChevronDown
                    size={15}
                  />
                </button>

                {accountOpen && (
                  <div className="panel-account-menu">
                    <div className="panel-account-menu__profile">
                      <span className="panel-account-menu__avatar">
                        <span>
                          {initial}
                        </span>

                        {avatarUrl && (
                          <img
                            src={avatarUrl}
                            alt=""
                          />
                        )}
                      </span>

                      <div>
                        <strong>
                          {userName}
                        </strong>

                        <small>
                          @{alias}
                        </small>

                        {profile?.email && (
                          <small>
                            {
                              profile.email
                            }
                          </small>
                        )}
                      </div>
                    </div>

                    <Link
                      className="panel-account-menu__premium"
                      to="/negocio/suscripcion"
                      onClick={() =>
                        setAccountOpen(
                          false,
                        )
                      }
                    >
                      <BadgeCheck
                        size={18}
                      />

                      <span>
                        <strong>
                          Premium
                        </strong>

                        <small>
                          Consulta tu plan y beneficios
                        </small>
                      </span>
                    </Link>

                    <div className="panel-account-menu__links">
                      <Link
                        to="/negocio/cuenta"
                        onClick={() =>
                          setAccountOpen(
                            false,
                          )
                        }
                      >
                        <UserRound
                          size={16}
                        />

                        Mi cuenta
                      </Link>

                      <button
                        type="button"
                        onClick={logout}
                      >
                        <LogOut
                          size={16}
                        />

                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
