import { CheckCircle2, KeyRound, Save, ShieldCheck, UserRound, XCircle } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

import { apiRequest } from '../../../../../core/shared/api/apiClient';
import { getStoredUser, logout, saveSession } from '../../../../../core/shared/utils/auth';
import type { ApiUser } from '../../../../Auth/data/models/User';
import { PanelShell } from '../../../../../core/shared/layout/PanelShell';
import './AdminProfilePage.css';

export function AdminProfilePage() {
  const [profile, setProfile] = useState<ApiUser | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(() => localStorage.getItem('admin_two_factor_ui') === 'true');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const user = await apiRequest<ApiUser>('/users/profile');
        setProfile(user);
        setName(user.name);
        setEmail(user.email);
        setPhone(user.phone ?? '');
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : 'No se pudo cargar el perfil');
      } finally {
        setIsLoading(false);
      }
    };
    void load();
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const updated = await apiRequest<ApiUser>('/users/profile', {
        method: 'PATCH',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || null,
          ...(password ? { password } : {}),
        }),
      });

      setProfile(updated);
      setPassword('');
      const session = getStoredUser();
      if (session) saveSession({ ...updated, token: session.token });
      setMessage('Perfil actualizado correctamente en el servidor.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleTwoFactor = () => {
    const next = !twoFactor;
    setTwoFactor(next);
    localStorage.setItem('admin_two_factor_ui', String(next));
    setMessage('La preferencia visual de dos pasos se guardó en este navegador. El backend todavía no implementa códigos 2FA.');
  };

  const memberSince = profile?.registeredAt
    ? new Date(profile.registeredAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })
    : '—';
  const userName = profile?.name || name || 'Administrador';

  return (
    <PanelShell kind="admin">
      <form className="ec-page admin-profile-page" onSubmit={submit}>
        <div className="ec-page-header">
          <div className="ec-page-header__copy"><h1 className="ec-page-title">Perfil del Administrador</h1><p className="ec-page-subtitle">Consulta y actualiza la cuenta autenticada mediante la API.</p></div>
          <button className="ec-button ec-button--primary" type="submit" disabled={isLoading || isSaving}><Save size={16} /> {isSaving ? 'Guardando…' : 'Guardar cambios'}</button>
        </div>
        {error && <div className="ec-note ec-note--danger">{error}</div>}
        {message && <div className="ec-note">{message}</div>}

        <section className="admin-profile-main-grid">
          <article className="ec-card admin-profile-summary">
            <div className="admin-profile-photo"><span>{userName.charAt(0).toUpperCase()}</span></div>
            <h2>{isLoading ? 'Cargando…' : userName}</h2>
            <span className="ec-badge ec-badge--green">Administrador de plataforma</span>
            <small>Miembro desde: {memberSince}</small>
          </article>

          <article className="ec-card admin-profile-data">
            <div className="ec-card__header"><h2>Datos personales</h2><UserRound size={18} /></div>
            <div className="ec-card__body ec-form-grid">
              <div className="ec-field"><label>Nombre completo</label><input className="ec-input" value={name} onChange={(event) => setName(event.target.value)} minLength={3} maxLength={100} required disabled={isLoading} /></div>
              <div className="ec-field"><label>Correo electrónico</label><input className="ec-input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} maxLength={150} required disabled={isLoading} /></div>
              <div className="ec-field"><label>Número de teléfono</label><input className="ec-input" value={phone} onChange={(event) => setPhone(event.target.value)} maxLength={20} disabled={isLoading} /></div>
              <div className="ec-field"><label>Identificador de usuario</label><input className="ec-input" value={profile?.id ?? ''} disabled /></div>
              <div className="ec-field ec-field--full"><label>Nueva contraseña</label><input className="ec-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} maxLength={72} placeholder="Déjala vacía para conservar la actual" autoComplete="new-password" disabled={isLoading} /></div>
            </div>
          </article>
        </section>

        <section className="admin-profile-bottom-grid">
          <article className="ec-card">
            <div className="ec-card__header"><h2>Seguridad y acceso</h2></div>
            <div className="ec-card__body admin-security-list">
              <div className="admin-security-row"><span className="admin-security-icon"><KeyRound size={18} /></span><div><strong>Contraseña</strong><small>Puede cambiarse desde el formulario superior</small></div><span className="ec-badge ec-badge--green">API</span></div>
              <div className="admin-security-row"><span className="admin-security-icon"><ShieldCheck size={18} /></span><div><strong>Autenticación de dos pasos</strong><small>Preferencia visual; requiere implementación adicional en backend</small></div><button className={`profile-toggle ${twoFactor ? 'active' : ''}`} type="button" onClick={toggleTwoFactor} aria-label="Cambiar preferencia de autenticación de dos pasos"><span /></button></div>
            </div>
          </article>

          <article className="ec-card">
            <div className="ec-card__header"><h2>Permisos y roles</h2></div>
            <div className="ec-card__body"><p className="admin-permission-intro">El rol recibido por la API es: <strong>{profile?.userType ?? '—'}</strong>.</p><div className="admin-permission-grid">{['Gestión de Usuarios','Validación de Negocios','Moderación de Contenido','Gestión de Destinos','Gestión de Eventos'].map((permission)=><div key={permission}><CheckCircle2 size={15}/><span>{permission}</span></div>)}<div className="disabled"><XCircle size={15}/><span>Acceso fuera del rol</span></div></div></div>
          </article>
        </section>

        <div className="admin-profile-logout"><button className="ec-button ec-button--danger" type="button" onClick={logout}><ShieldCheck size={16} /> Cerrar sesión segura</button></div>
      </form>
    </PanelShell>
  );
}
