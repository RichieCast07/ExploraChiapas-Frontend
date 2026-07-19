import { useState } from 'react';
import { Settings, Save } from 'lucide-react';
import { adminNavConfig } from '../../../../../core/shared/config/navigation/adminNavConfig';
import { Sidebar } from '../../../../../core/shared/layout/Sidebar';
import { logout } from '../../../../../core/shared/utils/auth';

export function AdminConfiguracionPage() {
  const [nombrePlataforma, setNombrePlataforma] = useState('ExploraChiapas');
  const [emailContacto, setEmailContacto] = useState('contacto@explorachiapas.mx');
  const [registroAbierto, setRegistroAbierto] = useState(true);
  const [moderacionAutomatica, setModeracionAutomatica] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7f5' }}>
      <Sidebar config={adminNavConfig} onLogout={logout} />
      <main style={{ marginLeft: 260, minHeight: '100vh', padding: 32, fontFamily: 'Inter, system-ui, sans-serif' }}>
        <header style={{ marginBottom: 28 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#16a34a', textTransform: 'uppercase', letterSpacing: 1 }}>
            Sistema
          </span>
          <h1 style={{ margin: '4px 0', fontSize: 24, fontWeight: 700 }}>Configuración</h1>
          <p style={{ color: '#6b7280', marginTop: 4 }}>Ajusta los parámetros generales de la plataforma.</p>
        </header>

        {saved && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '12px 16px', marginBottom: 20, color: '#15803d', fontWeight: 500 }}>
            Configuración guardada correctamente.
          </div>
        )}

        <form onSubmit={handleGuardar} style={{ maxWidth: 600 }}>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 24, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <Settings size={18} color="#16a34a" />
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>General</h2>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Nombre de la plataforma</label>
              <input
                type="text"
                value={nombrePlataforma}
                onChange={e => setNombrePlataforma(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>Correo de contacto</label>
              <input
                type="email"
                value={emailContacto}
                onChange={e => setEmailContacto(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 24, marginBottom: 20 }}>
            <h2 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 700 }}>Control de acceso</h2>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <p style={{ margin: 0, fontWeight: 500, fontSize: 14 }}>Registro de usuarios abierto</p>
                <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>Permite que nuevos usuarios se registren en la plataforma</p>
              </div>
              <button
                type="button"
                onClick={() => setRegistroAbierto(v => !v)}
                style={{
                  width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
                  background: registroAbierto ? '#16a34a' : '#d1d5db', transition: 'background 0.2s', position: 'relative',
                }}
              >
                <span style={{
                  position: 'absolute', top: 3, left: registroAbierto ? 24 : 4,
                  width: 20, height: 20, borderRadius: 10, background: '#fff', transition: 'left 0.2s',
                }} />
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, fontWeight: 500, fontSize: 14 }}>Moderación automática de reseñas</p>
                <p style={{ margin: 0, fontSize: 12, color: '#9ca3af' }}>Filtra automáticamente contenido inapropiado con IA</p>
              </div>
              <button
                type="button"
                onClick={() => setModeracionAutomatica(v => !v)}
                style={{
                  width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
                  background: moderacionAutomatica ? '#16a34a' : '#d1d5db', transition: 'background 0.2s', position: 'relative',
                }}
              >
                <span style={{
                  position: 'absolute', top: 3, left: moderacionAutomatica ? 24 : 4,
                  width: 20, height: 20, borderRadius: 10, background: '#fff', transition: 'left 0.2s',
                }} />
              </button>
            </div>
          </div>

          <button
            type="submit"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}
          >
            <Save size={16} />
            Guardar cambios
          </button>
        </form>
      </main>
    </div>
  );
}
