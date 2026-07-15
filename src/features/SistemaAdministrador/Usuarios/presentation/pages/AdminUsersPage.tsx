import {
  Search,
  RefreshCw,
  ShieldCheck,
  UserCheck,
  UserX,
} from 'lucide-react';
import {
  useMemo,
  useState,
} from 'react';

import { adminNavConfig } from '../../../../../core/shared/config/navigation/adminNavConfig';
import { Sidebar } from '../../../../../core/shared/layout/Sidebar';
import { logout } from '../../../../../core/shared/utils/auth';

import {
  type AdminUser,
  type AdminUserType,
  useAdminUsersViewModel,
} from '../viewmodels/useAdminUsersViewModel';

import './AdminUsersPage.css';

const roleLabels: Record<
  AdminUserType,
  string
> = {
  turista_nacional: 'Turista nacional',
  turista_extranjero: 'Turista extranjero',
  habitante_local: 'Habitante local',
  admin_negocio: 'Administrador de negocio',
  admin_plataforma: 'Administrador de plataforma',
};

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Sin fecha';
  }

  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
  }).format(date);
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

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<'todos' | 'activos' | 'inactivos'>(
      'todos',
    );

  const filteredUsers = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return usuarios.filter((user) => {
      const matchesSearch =
        normalizedSearch === '' ||
        user.nombre
          .toLowerCase()
          .includes(normalizedSearch) ||
        user.email
          .toLowerCase()
          .includes(normalizedSearch) ||
        roleLabels[user.tipoUsuario]
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === 'todos' ||
        (statusFilter === 'activos' &&
          user.activo) ||
        (statusFilter === 'inactivos' &&
          !user.activo);

      return matchesSearch && matchesStatus;
    });
  }, [usuarios, search, statusFilter]);

  const handleStatusChange = async (
    user: AdminUser,
  ) => {
    await cambiarEstado(user);
  };

  return (
    <div className="admin-users-layout">
      <Sidebar
        config={adminNavConfig}
        onLogout={logout}
      />

      <main className="admin-users">
        <header className="admin-users__header">
          <div>
            <span className="admin-users__eyebrow">
              Administración
            </span>

            <h1>Gestión de usuarios</h1>

            <p>
              Consulta usuarios, modifica sus permisos
              y controla el acceso a la plataforma.
            </p>
          </div>

          <button
            type="button"
            className="admin-users__refresh"
            onClick={() => void cargarUsuarios()}
            disabled={isLoading}
          >
            <RefreshCw size={18} />
            Actualizar
          </button>
        </header>

        <section className="admin-users__summary">
          <article>
            <ShieldCheck size={22} />
            <div>
              <strong>{usuarios.length}</strong>
              <span>Usuarios cargados</span>
            </div>
          </article>

          <article>
            <UserCheck size={22} />
            <div>
              <strong>
                {
                  usuarios.filter(
                    (user) => user.activo,
                  ).length
                }
              </strong>
              <span>Usuarios activos</span>
            </div>
          </article>

          <article>
            <UserX size={22} />
            <div>
              <strong>
                {
                  usuarios.filter(
                    (user) => !user.activo,
                  ).length
                }
              </strong>
              <span>Usuarios inactivos</span>
            </div>
          </article>
        </section>

        <section className="admin-users__panel">
          <div className="admin-users__filters">
            <label className="admin-users__search">
              <Search size={18} />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Buscar por nombre, correo o rol"
              />
            </label>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value as
                    | 'todos'
                    | 'activos'
                    | 'inactivos',
                )
              }
            >
              <option value="todos">
                Todos los estados
              </option>

              <option value="activos">
                Activos
              </option>

              <option value="inactivos">
                Inactivos
              </option>
            </select>
          </div>

          {error && (
            <div className="admin-users__error">
              <span>{error}</span>

              <button
                type="button"
                onClick={() =>
                  void cargarUsuarios()
                }
              >
                Reintentar
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="admin-users__state">
              Cargando usuarios...
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="admin-users__state">
              No se encontraron usuarios.
            </div>
          ) : (
            <div className="admin-users__table-wrapper">
              <table className="admin-users__table">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Tipo</th>
                    <th>Registro</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => {
                    const isUpdating =
                      updatingUserId === user.id;

                    return (
                      <tr key={user.id}>
                        <td>
                          <div className="admin-users__identity">
                            <div className="admin-users__avatar">
                              {user.nombre
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {user.nombre}
                              </strong>

                              <span>
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <select
                            value={user.tipoUsuario}
                            disabled={isUpdating}
                            onChange={(event) =>
                              void cambiarTipoUsuario(
                                user.id,
                                event.target
                                  .value as AdminUserType,
                              )
                            }
                          >
                            {Object.entries(
                              roleLabels,
                            ).map(
                              ([value, label]) => (
                                <option
                                  key={value}
                                  value={value}
                                >
                                  {label}
                                </option>
                              ),
                            )}
                          </select>
                        </td>

                        <td>
                          {formatDate(
                            user.fechaRegistro,
                          )}
                        </td>

                        <td>
                          <span
                            className={
                              user.activo
                                ? 'admin-users__status admin-users__status--active'
                                : 'admin-users__status admin-users__status--inactive'
                            }
                          >
                            {user.activo
                              ? 'Activo'
                              : 'Inactivo'}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className={
                              user.activo
                                ? 'admin-users__action admin-users__action--disable'
                                : 'admin-users__action admin-users__action--enable'
                            }
                            disabled={isUpdating}
                            onClick={() =>
                              void handleStatusChange(
                                user,
                              )
                            }
                          >
                            {isUpdating
                              ? 'Guardando...'
                              : user.activo
                                ? 'Desactivar'
                                : 'Activar'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}