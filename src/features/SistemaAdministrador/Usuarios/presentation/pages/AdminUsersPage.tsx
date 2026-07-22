import {
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
  Users,
} from 'lucide-react';

import {
  useMemo,
  useState,
} from 'react';

import { PanelShell } from '../../../../../core/shared/layout/PanelShell';

import {
  type AdminUserType,
  useAdminUsersViewModel,
} from '../viewmodels/useAdminUsersViewModel';

import './AdminUsersPage.css';

const roleLabels: Record<
  AdminUserType,
  string
> = {
  turista_nacional: 'Turista nacional',
  turista_extranjero:
    'Turista extranjero',
  habitante_local: 'Habitante local',
  admin_negocio:
    'Administrador de negocio',
  admin_plataforma:
    'Administrador de plataforma',
};

function formatDate(
  value: string,
): string {
  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return 'Sin fecha';
  }

  return new Intl.DateTimeFormat(
    'es-MX',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  ).format(date);
}

export function AdminUsersPage() {
  const {
    usuarios,
    isLoading,
    updatingUserId,
    error,
    cargarUsuarios,
    cambiarEstado,
    cambiarTipoUsuario,
  } = useAdminUsersViewModel();

  const [
    search,
    setSearch,
  ] = useState('');

  const [
    role,
    setRole,
  ] = useState<
    'todos' | AdminUserType
  >('todos');

  const [
    status,
    setStatus,
  ] = useState<
    | 'todos'
    | 'activos'
    | 'bloqueados'
  >('todos');

  const filtered =
    useMemo(
      () =>
        usuarios.filter(
          (user) => {
            const term =
              search
                .trim()
                .toLowerCase();

            const matchesSearch =
              !term ||
              user.nombre
                .toLowerCase()
                .includes(
                  term,
                ) ||
              user.email
                .toLowerCase()
                .includes(
                  term,
                ) ||
              user.id
                .toLowerCase()
                .includes(
                  term,
                );

            const matchesRole =
              role ===
                'todos' ||
              user.tipoUsuario ===
                role;

            const matchesStatus =
              status ===
                'todos' ||
              (
                status ===
                'activos'
                  ? user.activo
                  : !user.activo
              );

            return (
              matchesSearch &&
              matchesRole &&
              matchesStatus
            );
          },
        ),
      [
        usuarios,
        search,
        role,
        status,
      ],
    );

  const activeUsers =
    usuarios.filter(
      (user) =>
        user.activo,
    ).length;

  const blockedUsers =
    usuarios.filter(
      (user) =>
        !user.activo,
    ).length;

  const platformAdmins =
    usuarios.filter(
      (user) =>
        user.tipoUsuario ===
        'admin_plataforma',
    ).length;

  return (
    <PanelShell kind="admin">
      <div className="ec-page admin-users-page">
        <div className="ec-page-header">
          <div className="ec-page-header__copy">
            <div className="ec-breadcrumb">
              Administración
              <span>›</span>
              Usuarios
            </div>

            <h1 className="ec-page-title">
              Gestión de Usuarios
            </h1>

            <p className="ec-page-subtitle">
              Consulta y administra
              usuarios registrados en
              ExploraChiapas.
            </p>
          </div>

          <button
            className="ec-button"
            type="button"
            disabled={
              isLoading
            }
            onClick={() =>
              void cargarUsuarios()
            }
          >
            <RefreshCw
              size={16}
            />

            {isLoading
              ? 'Actualizando...'
              : 'Actualizar'}
          </button>
        </div>

        {error && (
          <div className="ec-alert">
            {error}
          </div>
        )}

        <section className="ec-stat-grid">
          <article className="ec-stat-card">
            <div className="ec-stat-card__top">
              <span className="ec-stat-card__icon">
                <Users
                  size={18}
                />
              </span>
            </div>

            <div>
              <div className="ec-stat-card__label">
                Usuarios cargados
              </div>

              <div className="ec-stat-card__value">
                {isLoading
                  ? '…'
                  : usuarios.length}
              </div>

              <div className="ec-stat-card__hint">
                Datos obtenidos
                desde la API
              </div>
            </div>
          </article>

          <article className="ec-stat-card">
            <div className="ec-stat-card__top">
              <span className="ec-stat-card__icon">
                <UserCheck
                  size={18}
                />
              </span>
            </div>

            <div>
              <div className="ec-stat-card__label">
                Usuarios activos
              </div>

              <div className="ec-stat-card__value">
                {isLoading
                  ? '…'
                  : activeUsers}
              </div>
            </div>
          </article>

          <article className="ec-stat-card">
            <div className="ec-stat-card__top">
              <span className="ec-stat-card__icon ec-stat-card__icon--red">
                <UserX
                  size={18}
                />
              </span>
            </div>

            <div>
              <div className="ec-stat-card__label">
                Usuarios bloqueados
              </div>

              <div className="ec-stat-card__value">
                {isLoading
                  ? '…'
                  : blockedUsers}
              </div>
            </div>
          </article>

          <article className="ec-stat-card">
            <div className="ec-stat-card__top">
              <span className="ec-stat-card__icon ec-stat-card__icon--blue">
                <ShieldCheck
                  size={18}
                />
              </span>
            </div>

            <div>
              <div className="ec-stat-card__label">
                Administradores
              </div>

              <div className="ec-stat-card__value">
                {isLoading
                  ? '…'
                  : platformAdmins}
              </div>
            </div>
          </article>
        </section>

        <section className="ec-toolbar">
          <label className="ec-search">
            <Search
              size={17}
            />

            <input
              value={search}
              onChange={(
                event,
              ) =>
                setSearch(
                  event
                    .target
                    .value,
                )
              }
              placeholder="Buscar por nombre, correo o ID..."
            />
          </label>

          <select
            className="ec-select admin-users-filter"
            value={role}
            onChange={(
              event,
            ) =>
              setRole(
                event.target
                  .value as
                  | 'todos'
                  | AdminUserType,
              )
            }
          >
            <option value="todos">
              Todos los roles
            </option>

            {Object.entries(
              roleLabels,
            ).map(
              ([
                value,
                label,
              ]) => (
                <option
                  key={
                    value
                  }
                  value={
                    value
                  }
                >
                  {label}
                </option>
              ),
            )}
          </select>

          <select
            className="ec-select admin-users-filter"
            value={status}
            onChange={(
              event,
            ) =>
              setStatus(
                event.target
                  .value as
                  typeof status,
              )
            }
          >
            <option value="todos">
              Todos los estados
            </option>

            <option value="activos">
              Activos
            </option>

            <option value="bloqueados">
              Bloqueados
            </option>
          </select>
        </section>

        <section className="ec-card">
          <div className="ec-table-wrap">
            <table className="ec-table admin-users-table">
              <thead>
                <tr>
                  <th>
                    Usuario
                  </th>

                  <th>
                    Rol
                  </th>

                  <th>
                    Estado
                  </th>

                  <th>
                    Fecha de registro
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map(
                  (user) => {
                    const updating =
                      updatingUserId ===
                      user.id;

                    return (
                      <tr
                        key={
                          user.id
                        }
                      >
                        <td>
                          <div className="ec-identity">
                            <span className="ec-avatar">
                              {user.nombre
                                .charAt(
                                  0,
                                )
                                .toUpperCase()}
                            </span>

                            <div>
                              <strong>
                                {
                                  user.nombre
                                }
                              </strong>

                              <small>
                                {
                                  user.email
                                }
                              </small>
                            </div>
                          </div>
                        </td>

                        <td>
                          <select
                            className="admin-users-role"
                            value={
                              user.tipoUsuario
                            }
                            disabled={
                              updating
                            }
                            onChange={(
                              event,
                            ) =>
                              void cambiarTipoUsuario(
                                user.id,
                                event
                                  .target
                                  .value as
                                  AdminUserType,
                              )
                            }
                          >
                            {Object.entries(
                              roleLabels,
                            ).map(
                              ([
                                value,
                                label,
                              ]) => (
                                <option
                                  key={
                                    value
                                  }
                                  value={
                                    value
                                  }
                                >
                                  {
                                    label
                                  }
                                </option>
                              ),
                            )}
                          </select>
                        </td>

                        <td>
                          <button
                            className={`admin-user-status ${
                              user.activo
                                ? 'admin-user-status--active'
                                : 'admin-user-status--blocked'
                            }`}
                            type="button"
                            disabled={
                              updating
                            }
                            onClick={() =>
                              void cambiarEstado(
                                user,
                              )
                            }
                          >
                            <span />

                            {updating
                              ? 'Guardando...'
                              : user.activo
                                ? 'Activo'
                                : 'Bloqueado'}
                          </button>
                        </td>

                        <td>
                          {formatDate(
                            user.fechaRegistro,
                          )}
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>

          {isLoading && (
            <div className="ec-note">
              Consultando
              usuarios del
              backend...
            </div>
          )}

          {!isLoading &&
            !error &&
            filtered.length ===
              0 && (
              <div className="ec-note">
                No hay usuarios
                que coincidan con
                los filtros.
              </div>
            )}

          {!isLoading &&
            !error && (
              <footer className="admin-users-pagination">
                <span>
                  Mostrando{' '}
                  {
                    filtered.length
                  }{' '}
                  de{' '}
                  {
                    usuarios.length
                  }{' '}
                  usuarios cargados
                  desde la API
                </span>
              </footer>
            )}
        </section>
      </div>
    </PanelShell>
  );
}