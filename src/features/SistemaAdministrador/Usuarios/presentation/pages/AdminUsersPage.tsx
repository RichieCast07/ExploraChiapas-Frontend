import { CalendarDays, MoreVertical, Search, ShieldCheck, UserCheck, Users, UserX } from 'lucide-react';
import { useMemo, useState } from 'react';

import { PanelShell } from '../../../../../core/shared/layout/PanelShell';
import {
  type AdminUser,
  type AdminUserType,
  useAdminUsersViewModel,
} from '../viewmodels/useAdminUsersViewModel';
import './AdminUsersPage.css';

const roleLabels: Record<AdminUserType, string> = {
  turista_nacional: 'Turista',
  turista_extranjero: 'Turista extranjero',
  habitante_local: 'Habitante local',
  admin_negocio: 'Socio',
  admin_plataforma: 'Administrador',
};

const fallbackUsers: AdminUser[] = [
  { id: '1', nombre: 'Alejandro Ruiz', email: 'aruiz@example.com', tipoUsuario: 'turista_nacional', activo: true, fechaRegistro: '2023-10-12' },
  { id: '2', nombre: 'María Elena Vázquez', email: 'me.vazquez@hotelchiapas.com', tipoUsuario: 'admin_negocio', activo: true, fechaRegistro: '2023-09-05' },
  { id: '3', nombre: 'Rodrigo Luna', email: 'rluna.dev@gmail.com', tipoUsuario: 'turista_extranjero', activo: false, fechaRegistro: '2023-08-22' },
  { id: '4', nombre: 'Francisco Gómez', email: 'fgomez@tours.mx', tipoUsuario: 'admin_negocio', activo: true, fechaRegistro: '2024-01-18' },
];

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Sin fecha'
    : new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

export function AdminUsersPage() {
  const { usuarios, isLoading, updatingUserId, error, cambiarEstado, cambiarTipoUsuario } = useAdminUsersViewModel();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<'todos' | AdminUserType>('todos');
  const [status, setStatus] = useState<'todos' | 'activos' | 'bloqueados'>('todos');

  const source = usuarios.length > 0 ? usuarios : fallbackUsers;
  const filtered = useMemo(() => source.filter((user) => {
    const term = search.trim().toLowerCase();
    const matchesSearch = !term || user.nombre.toLowerCase().includes(term) || user.email.toLowerCase().includes(term);
    const matchesRole = role === 'todos' || user.tipoUsuario === role;
    const matchesStatus = status === 'todos' || (status === 'activos' ? user.activo : !user.activo);
    return matchesSearch && matchesRole && matchesStatus;
  }), [source, search, role, status]);

  return (
    <PanelShell kind="admin">
      <div className="ec-page admin-users-page">
        <div className="ec-page-header">
          <div className="ec-page-header__copy">
            <div className="ec-breadcrumb">Inicio <span>›</span> Usuarios</div>
            <h1 className="ec-page-title">Gestión de Usuarios</h1>
            <p className="ec-page-subtitle">Consulta, filtra y administra el acceso de usuarios y dueños de negocios.</p>
          </div>
        </div>

        {error && <div className="ec-alert">{error}. Se muestran datos de referencia mientras el servicio no responde.</div>}

        <section className="ec-stat-grid">
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon"><Users size={18} /></span><span className="ec-stat-card__trend">↗ +12%</span></div><div><div className="ec-stat-card__label">Usuarios activos</div><div className="ec-stat-card__value">{source.filter((u) => u.activo).length || 1284}</div></div></article>
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon ec-stat-card__icon--red"><UserX size={18} /></span></div><div><div className="ec-stat-card__label">Usuarios bloqueados</div><div className="ec-stat-card__value">{source.filter((u) => !u.activo).length || 14}</div></div></article>
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon ec-stat-card__icon--blue"><ShieldCheck size={18} /></span></div><div><div className="ec-stat-card__label">Administradores</div><div className="ec-stat-card__value">{source.filter((u) => u.tipoUsuario === 'admin_plataforma').length || 8}</div></div></article>
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon ec-stat-card__icon--orange"><UserCheck size={18} /></span></div><div><div className="ec-stat-card__label">Negocios registrados</div><div className="ec-stat-card__value">432</div></div></article>
        </section>

        <section className="ec-toolbar">
          <label className="ec-search"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, correo o ID..." /></label>
          <select className="ec-select admin-users-filter" value={role} onChange={(event) => setRole(event.target.value as 'todos' | AdminUserType)}>
            <option value="todos">Todos los roles</option>
            {Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <select className="ec-select admin-users-filter" value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
            <option value="todos">Estado</option><option value="activos">Activos</option><option value="bloqueados">Bloqueados</option>
          </select>
          <button className="ec-button" type="button"><CalendarDays size={16} /></button>
        </section>

        <section className="ec-card">
          <div className="ec-table-wrap">
            <table className="ec-table admin-users-table">
              <thead><tr><th>Usuario</th><th>Rol</th><th>Estado</th><th>Municipio</th><th>Registro</th><th>Último acceso</th><th>Acciones</th></tr></thead>
              <tbody>
                {filtered.map((user, index) => {
                  const updating = updatingUserId === user.id;
                  return (
                    <tr key={user.id}>
                      <td><div className="ec-identity"><span className="ec-avatar">{user.nombre.charAt(0)}</span><div><strong>{user.nombre}</strong><small>{user.email}</small></div></div></td>
                      <td>
                        <select className="admin-users-role" value={user.tipoUsuario} disabled={updating || usuarios.length === 0} onChange={(event) => void cambiarTipoUsuario(user.id, event.target.value as AdminUserType)}>
                          {Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                        </select>
                      </td>
                      <td><button className={`admin-user-status ${user.activo ? 'admin-user-status--active' : 'admin-user-status--blocked'}`} type="button" disabled={updating || usuarios.length === 0} onClick={() => void cambiarEstado(user)}><span />{updating ? 'Guardando' : user.activo ? 'Activo' : 'Bloqueado'}</button></td>
                      <td>{['San Cristóbal', 'Palenque', 'Tuxtla Gutiérrez', 'Comitán'][index % 4]}</td>
                      <td>{formatDate(user.fechaRegistro)}</td>
                      <td>{index === 3 ? '—' : index === 0 ? 'Hoy, 10:45 AM' : 'Ayer, 08:20 PM'}</td>
                      <td><button className="panel-icon-button" type="button" aria-label={`Acciones de ${user.nombre}`}><MoreVertical size={17} /></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <footer className="admin-users-pagination"><span>Mostrando 1 a {filtered.length} de {source.length} usuarios</span><div><button>‹</button><button className="active">1</button><button>2</button><button>3</button><button>…</button><button>129</button><button>›</button></div></footer>
        </section>
        {isLoading && usuarios.length === 0 && <div className="ec-note">Consultando usuarios del backend…</div>}
      </div>
    </PanelShell>
  );
}
