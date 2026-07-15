import { useCallback, useEffect, useState } from 'react';
import { Compass, RefreshCw } from 'lucide-react';
import { adminNavConfig } from '../../../../../core/shared/config/navigation/adminNavConfig';
import { Sidebar } from '../../../../../core/shared/layout/Sidebar';
import { logout, fetchAuth } from '../../../../../core/shared/utils/auth';
import { BASE_URL } from '../../../../../core/shared/config/api';

interface Destino {
  id: string;
  nombre: string;
  tipo: string;
  municipio: string;
  calificacionPromedio: number;
  activo: boolean;
}

const tipoLabel: Record<string, string> = {
  naturaleza: 'Naturaleza',
  cultura: 'Cultura',
  gastronomia: 'Gastronomía',
  aventura: 'Aventura',
  alojamiento: 'Alojamiento',
};

export function AdminDestinosPage() {
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAuth(`${BASE_URL}/destinos?limit=100`);
      const body = await res.json() as { success: boolean; data?: Destino[]; message?: string };
      if (!res.ok || !body.success) throw new Error(body.message ?? 'Error al cargar destinos');
      setDestinos(body.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión');
      setDestinos([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void cargar(); }, [cargar]);

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7f5' }}>
      <Sidebar config={adminNavConfig} onLogout={logout} />
      <main style={{ marginLeft: 260, minHeight: '100vh', padding: 32, fontFamily: 'Inter, system-ui, sans-serif' }}>
        <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#16a34a', textTransform: 'uppercase', letterSpacing: 1 }}>
              Gestión Turística
            </span>
            <h1 style={{ margin: '4px 0', fontSize: 24, fontWeight: 700 }}>Destinos</h1>
            <p style={{ color: '#6b7280', marginTop: 4 }}>Consulta y gestiona los destinos turísticos registrados en la plataforma.</p>
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
            <div style={{ padding: 48, textAlign: 'center', color: '#9ca3af' }}>Cargando destinos...</div>
          ) : destinos.length === 0 && !error ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#9ca3af' }}>
              <Compass size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
              <p>No hay destinos registrados.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Nombre</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Tipo</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Municipio</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Calificación</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {destinos.map((d, i) => (
                    <tr key={d.id} style={{ borderBottom: i < destinos.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 500 }}>{d.nombre}</td>
                      <td style={{ padding: '14px 16px', color: '#6b7280' }}>{tipoLabel[d.tipo] ?? d.tipo}</td>
                      <td style={{ padding: '14px 16px', color: '#6b7280' }}>{d.municipio ?? '—'}</td>
                      <td style={{ padding: '14px 16px' }}>{d.calificacionPromedio?.toFixed(1) ?? '—'}/5</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                          background: d.activo ? '#dcfce7' : '#fee2e2',
                          color: d.activo ? '#16a34a' : '#dc2626',
                        }}>
                          {d.activo ? 'Activo' : 'Inactivo'}
                        </span>
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
