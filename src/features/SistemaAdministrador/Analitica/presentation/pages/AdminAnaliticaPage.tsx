import { useCallback, useEffect, useState } from 'react';
import { BarChart3, RefreshCw, TrendingUp, Users, MapPin } from 'lucide-react';
import { adminNavConfig } from '../../../../../core/shared/config/navigation/adminNavConfig';
import { Sidebar } from '../../../../../core/shared/layout/Sidebar';
import { logout, fetchAuth } from '../../../../../core/shared/utils/auth';
import { BASE_URL } from '../../../../../core/shared/config/api';
import { useAdminStatsViewModel } from '../../../Home/presentation/viewmodels/useAdminStatsViewModel';

interface ClusterInfo {
  cluster: number;
  label: string;
  count: number;
  descripcion: string;
  color: string;
}

const ML_URL = 'https://ml-explorachiapas.onrender.com';

export function AdminAnaliticaPage() {
  const { stats, isLoading: statsLoading } = useAdminStatsViewModel();
  const [clusters, setClusters] = useState<ClusterInfo[]>([]);
  const [mlLoading, setMlLoading] = useState(false);
  const [mlError, setMlError] = useState<string | null>(null);

  const cargarClusters = useCallback(async () => {
    setMlLoading(true);
    setMlError(null);
    try {
      const res = await fetchAuth(`${BASE_URL}/analitica/clusters`);
      const body = await res.json() as { success: boolean; data?: ClusterInfo[]; message?: string };
      if (res.ok && body.success && body.data) {
        setClusters(body.data);
        return;
      }
    } catch {
      // fallback to ML engine direct
    }
    try {
      const res = await fetch(`${ML_URL}/cluster-summary`);
      if (res.ok) {
        const body = await res.json() as { clusters?: ClusterInfo[] };
        setClusters(body.clusters ?? []);
      }
    } catch (err) {
      setMlError('No se pudo conectar con el motor de análisis');
    } finally {
      setMlLoading(false);
    }
  }, []);

  useEffect(() => { void cargarClusters(); }, [cargarClusters]);

  const clusterDefaults: ClusterInfo[] = [
    { cluster: 0, label: 'Exploradores Activos', count: 0, descripcion: 'Turistas con alta frecuencia de visitas a destinos de naturaleza y aventura.', color: '#16a34a' },
    { cluster: 1, label: 'Culturales y Gastronómicos', count: 0, descripcion: 'Usuarios enfocados en experiencias culturales y gastronomía local.', color: '#2563eb' },
    { cluster: 2, label: 'Visitantes Ocasionales', count: 0, descripcion: 'Turistas con visitas esporádicas a destinos populares.', color: '#f59e0b' },
  ];

  const displayClusters = clusters.length > 0 ? clusters : clusterDefaults;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7f5' }}>
      <Sidebar config={adminNavConfig} onLogout={logout} />
      <main style={{ marginLeft: 260, minHeight: '100vh', padding: 32, fontFamily: 'Inter, system-ui, sans-serif' }}>
        <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#16a34a', textTransform: 'uppercase', letterSpacing: 1 }}>
              Operaciones
            </span>
            <h1 style={{ margin: '4px 0', fontSize: 24, fontWeight: 700 }}>Analítica e Inteligencia Turística</h1>
            <p style={{ color: '#6b7280', marginTop: 4 }}>Visualiza segmentación de usuarios (K-Means), patrones de visita y recomendaciones del motor de IA.</p>
          </div>
          <button
            type="button"
            onClick={() => void cargarClusters()}
            disabled={mlLoading}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', border: '1px solid #d1d5db', borderRadius: 8, background: '#fff', cursor: 'pointer', fontWeight: 500 }}
          >
            <RefreshCw size={16} />
            Actualizar
          </button>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Total usuarios</span>
              <Users size={18} color="#16a34a" />
            </div>
            <p style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>{statsLoading ? '...' : (stats?.totalUsuarios?.toLocaleString('es-MX') ?? '0')}</p>
          </div>
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Destinos</span>
              <MapPin size={18} color="#2563eb" />
            </div>
            <p style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>{statsLoading ? '...' : (stats?.totalDestinos?.toLocaleString('es-MX') ?? '0')}</p>
          </div>
          <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Favoritos destinos</span>
              <TrendingUp size={18} color="#f59e0b" />
            </div>
            <p style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>{statsLoading ? '...' : (stats?.totalFavoritosDestinos?.toLocaleString('es-MX') ?? '0')}</p>
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <BarChart3 size={20} color="#16a34a" />
            <div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Segmentación K-Means (3 clusters)</h2>
              <p style={{ margin: 0, fontSize: 13, color: '#9ca3af' }}>Clasificación automática de perfiles turísticos</p>
            </div>
          </div>

          {mlError && <p style={{ color: '#b91c1c', fontSize: 13 }}>{mlError} — mostrando estructura del modelo</p>}

          {mlLoading ? (
            <p style={{ color: '#9ca3af' }}>Consultando motor ML...</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {displayClusters.map(c => (
                <div key={c.cluster} style={{ borderRadius: 10, border: `2px solid ${c.color}20`, background: `${c.color}08`, padding: 20 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 12 }}>
                    {c.cluster}
                  </div>
                  <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700 }}>{c.label}</h3>
                  <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>{c.descripcion}</p>
                  {c.count > 0 && (
                    <p style={{ margin: '8px 0 0', fontSize: 13, fontWeight: 600, color: c.color }}>{c.count.toLocaleString('es-MX')} usuarios</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: '#f0fdf4', borderRadius: 12, border: '1px solid #bbf7d0', padding: 20 }}>
          <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: '#15803d' }}>Motor de recomendación activo</h3>
          <p style={{ margin: 0, fontSize: 13, color: '#16a34a' }}>
            Los usuarios reciben recomendaciones personalizadas basadas en K-Means + Apriori + Mochila 2D. El NLP procesa solicitudes en lenguaje natural y el motor ML genera itinerarios optimizados.
          </p>
        </div>
      </main>
    </div>
  );
}
