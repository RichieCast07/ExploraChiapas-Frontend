import { useCallback, useEffect, useState } from 'react';
import { Ban, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';
import { adminNavConfig } from '../../../../../core/shared/config/navigation/adminNavConfig';
import { Sidebar } from '../../../../../core/shared/layout/Sidebar';
import { logout, fetchAuth } from '../../../../../core/shared/utils/auth';
import { BASE_URL } from '../../../../../core/shared/config/api';

interface Reporte {
  id: string;
  motivo: string;
  descripcion: string;
  targetType: string;
  targetId: string;
  estado: 'pendiente' | 'resuelto' | 'rechazado';
  creadoEn: string;
  reportadoPor?: string;
}

export function AdminModeracionPage() {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAuth(`${BASE_URL}/moderacion/reportes?limit=100`);
      const body = await res.json() as { success: boolean; data?: Reporte[]; message?: string };
      if (!res.ok || !body.success) throw new Error(body.message ?? 'Error al cargar reportes');
      setReportes(body.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión');
      setReportes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void cargar(); }, [cargar]);

  const resolver = async (id: string, accion: 'resuelto' | 'rechazado') => {
    try {
      const res = await fetchAuth(`${BASE_URL}/moderacion/reportes/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ estado: accion }),
      });
      if (res.ok) {
        setReportes(prev => prev.map(r => r.id === id ? { ...r, estado: accion } : r));
      }
    } catch {
      // no crash
    }
  };

  const pendientes = reportes.filter(r => r.estado === 'pendiente');
  const resueltos = reportes.filter(r => r.estado !== 'pendiente');

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7f5' }}>
      <Sidebar config={adminNavConfig} onLogout={logout} />
      <main style={{ marginLeft: 260, minHeight: '100vh', padding: 32, fontFamily: 'Inter, system-ui, sans-serif' }}>
        <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#16a34a', textTransform: 'uppercase', letterSpacing: 1 }}>
              Operaciones
            </span>
            <h1 style={{ margin: '4px 0', fontSize: 24, fontWeight: 700 }}>Moderación</h1>
            <p style={{ color: '#6b7280', marginTop: 4 }}>Revisa y gestiona los reportes de contenido enviados por usuarios.</p>
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
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '12px 16px', marginBottom: 16, color: '#b91c1c' }}>
            {error}
          </div>
        )}

        {isLoading ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#9ca3af' }}>Cargando reportes...</div>
        ) : (
          <>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={18} color="#f59e0b" />
              Pendientes ({pendientes.length})
            </h2>

            {pendientes.length === 0 ? (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: 24, marginBottom: 24, textAlign: 'center', color: '#16a34a' }}>
                <CheckCircle size={28} style={{ marginBottom: 8 }} />
                <p style={{ fontWeight: 500 }}>No hay reportes pendientes</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                {pendientes.map(r => (
                  <div key={r.id} style={{ background: '#fff', borderRadius: 10, border: '1px solid #fcd34d', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                    <Ban size={20} color="#f59e0b" style={{ flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{r.motivo}</div>
                      <div style={{ fontSize: 13, color: '#6b7280' }}>{r.descripcion}</div>
                      <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 4 }}>
                        {r.targetType} · {new Date(r.creadoEn).toLocaleDateString('es-MX')}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button type="button" onClick={() => void resolver(r.id, 'resuelto')} style={{ padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', background: '#dcfce7', color: '#16a34a', fontWeight: 600, fontSize: 13 }}>
                        Resolver
                      </button>
                      <button type="button" onClick={() => void resolver(r.id, 'rechazado')} style={{ padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', background: '#fee2e2', color: '#dc2626', fontWeight: 600, fontSize: 13 }}>
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {resueltos.length > 0 && (
              <>
                <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: '#9ca3af' }}>
                  Resueltos ({resueltos.length})
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {resueltos.map(r => (
                    <div key={r.id} style={{ background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <CheckCircle size={16} color={r.estado === 'resuelto' ? '#16a34a' : '#9ca3af'} />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontWeight: 500, fontSize: 14 }}>{r.motivo}</span>
                        <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 8 }}>{r.estado}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
