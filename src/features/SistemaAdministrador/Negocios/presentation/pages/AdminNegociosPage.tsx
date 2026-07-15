import { useCallback, useEffect, useState } from 'react';
import { Briefcase, RefreshCw, BadgeCheck } from 'lucide-react';
import { adminNavConfig } from '../../../../../core/shared/config/navigation/adminNavConfig';
import { Sidebar } from '../../../../../core/shared/layout/Sidebar';
import { logout, fetchAuth } from '../../../../../core/shared/utils/auth';
import { BASE_URL } from '../../../../../core/shared/config/api';

interface Negocio {
  id: string;
  nombre: string;
  categoria: string;
  municipio: string;
  isVerified: boolean;
  activo: boolean;
  propietarioNombre?: string;
}

export function AdminNegociosPage() {
  const [negocios, setNegocios] = useState<Negocio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAuth(`${BASE_URL}/negocios?limit=100`);
      const body = await res.json() as { success: boolean; data?: Negocio[]; message?: string };
      if (!res.ok || !body.success) throw new Error(body.message ?? 'Error al cargar negocios');
      setNegocios(body.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión');
      setNegocios([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void cargar(); }, [cargar]);

  const toggleVerificado = async (negocio: Negocio) => {
    setVerifyingId(negocio.id);
    try {
      const res = await fetchAuth(`${BASE_URL}/admin/negocios/${negocio.id}/verificar`, {
        method: 'PATCH',
        body: JSON.stringify({ isVerified: !negocio.isVerified }),
      });
      if (res.ok) {
        setNegocios(prev => prev.map(n => n.id === negocio.id ? { ...n, isVerified: !negocio.isVerified } : n));
      }
    } finally {
      setVerifyingId(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7f5' }}>
      <Sidebar config={adminNavConfig} onLogout={logout} />
      <main style={{ marginLeft: 260, minHeight: '100vh', padding: 32, fontFamily: 'Inter, system-ui, sans-serif' }}>
        <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#16a34a', textTransform: 'uppercase', letterSpacing: 1 }}>
              Gestión Turística
            </span>
            <h1 style={{ margin: '4px 0', fontSize: 24, fontWeight: 700 }}>Negocios</h1>
            <p style={{ color: '#6b7280', marginTop: 4 }}>Revisa y verifica los negocios turísticos registrados.</p>
          </div>
          <button
            type="button"
            onClick={() => void cargar()}
            disabled={isLoading}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', border: '1px solid #d1d5db', borderRadius: 8, background: '#fff', cursor: 'pointer', fontWeight: 500 }}
          >
            <RefreshCw size={16} />
            Actualizar
          </button>
        </header>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '12px 16px', marginBottom: 16, color: '#b91c1c', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{error}</span>
            <button type="button" onClick={() => void cargar()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b91c1c', fontWeight: 600 }}>Reintentar</button>
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          {isLoading ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#9ca3af' }}>Cargando negocios...</div>
          ) : negocios.length === 0 && !error ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#9ca3af' }}>
              <Briefcase size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
              <p>No hay negocios registrados.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Negocio</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Categoría</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Municipio</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Verificado</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {negocios.map((n, i) => (
                    <tr key={n.id} style={{ borderBottom: i < negocios.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 500 }}>{n.nombre}</div>
                        {n.propietarioNombre && <div style={{ fontSize: 12, color: '#9ca3af' }}>{n.propietarioNombre}</div>}
                      </td>
                      <td style={{ padding: '14px 16px', color: '#6b7280', textTransform: 'capitalize' }}>{n.categoria}</td>
                      <td style={{ padding: '14px 16px', color: '#6b7280' }}>{n.municipio ?? '—'}</td>
                      <td style={{ padding: '14px 16px' }}>
                        {n.isVerified
                          ? <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#16a34a', fontWeight: 600 }}><BadgeCheck size={16} /> Verificado</span>
                          : <span style={{ color: '#9ca3af' }}>Sin verificar</span>}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          type="button"
                          disabled={verifyingId === n.id}
                          onClick={() => void toggleVerificado(n)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: 6,
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 500,
                            fontSize: 13,
                            background: n.isVerified ? '#fee2e2' : '#dcfce7',
                            color: n.isVerified ? '#dc2626' : '#16a34a',
                          }}
                        >
                          {verifyingId === n.id ? 'Guardando...' : n.isVerified ? 'Revocar' : 'Verificar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
