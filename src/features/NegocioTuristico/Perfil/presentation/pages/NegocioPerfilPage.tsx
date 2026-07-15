import { useState } from 'react';
import { Sidebar } from '../../../../../core/shared/layout/Sidebar';
import { negocioNavConfig } from '../../../../../core/shared/config/navigation/negocioNavConfig';
import { Bell, Save, User } from 'lucide-react';
import { logout, fetchAuth } from '../../../../../core/shared/utils/auth';
import { BASE_URL } from '../../../../../core/shared/config/api';

export function NegocioPerfilPage() {
  const userName = localStorage.getItem('user_name') ?? '';
  const [nombre, setNombre] = useState(userName);
  const [email] = useState(localStorage.getItem('user_email') ?? '');
  const [telefono, setTelefono] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMensaje(null);
    try {
      const res = await fetchAuth(`${BASE_URL}/me`, {
        method: 'PATCH',
        body: JSON.stringify({ nombre, telefono }),
      });
      if (res.ok) {
        localStorage.setItem('user_name', nombre);
        setMensaje({ tipo: 'ok', texto: 'Perfil actualizado correctamente.' });
      } else {
        const body = await res.json() as { message?: string };
        setMensaje({ tipo: 'error', texto: body.message ?? 'Error al guardar.' });
      }
    } catch {
      setMensaje({ tipo: 'error', texto: 'Error de conexión.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7f5' }}>
      <Sidebar config={negocioNavConfig} onLogout={logout} />
      <div style={{ marginLeft: 260, minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
        <header style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>ExploraChiapas</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
              <Bell size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{nombre || userName}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>Administrador</div>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#16a34a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>
                {(nombre || userName).charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main style={{ padding: 32 }}>
          <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700 }}>Mi Perfil</h2>
          <p style={{ margin: '0 0 28px', color: '#6b7280' }}>Actualiza los datos de tu cuenta.</p>

          {mensaje && (
            <div style={{ background: mensaje.tipo === 'ok' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${mensaje.tipo === 'ok' ? '#bbf7d0' : '#fca5a5'}`, borderRadius: 8, padding: '12px 16px', marginBottom: 20, color: mensaje.tipo === 'ok' ? '#15803d' : '#b91c1c', fontWeight: 500 }}>
              {mensaje.texto}
            </div>
          )}

          <form onSubmit={(e) => { void handleGuardar(e); }} style={{ maxWidth: 520 }}>
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 24, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                <User size={18} color="#16a34a" />
                <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Información personal</h2>
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Nombre</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Correo electrónico</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, boxSizing: 'border-box', background: '#f9fafb', color: '#9ca3af' }}
                />
                <p style={{ margin: '4px 0 0', fontSize: 12, color: '#9ca3af' }}>El correo no puede cambiarse desde aquí.</p>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Teléfono de contacto</label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={e => setTelefono(e.target.value)}
                  placeholder="+52 961 000 0000"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: isSaving ? '#9ca3af' : '#16a34a', color: '#fff', border: 'none', borderRadius: 8, cursor: isSaving ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: 14 }}
            >
              <Save size={16} />
              {isSaving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
