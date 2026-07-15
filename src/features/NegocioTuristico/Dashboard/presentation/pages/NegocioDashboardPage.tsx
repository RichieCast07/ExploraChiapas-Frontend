import { Sidebar } from '../../../../../core/shared/layout/Sidebar';
import { negocioNavConfig } from '../../../../../core/shared/config/navigation/negocioNavConfig';
import { Bell, TrendingUp, Users, Star, MessageSquare } from 'lucide-react';
import { logout } from '../../../../../core/shared/utils/auth';
import { useNegocioStatsViewModel } from '../../../Home/presentation/viewmodels/useNegocioStatsViewModel';

export function NegocioDashboardPage() {
  const { stats, isLoading } = useNegocioStatsViewModel();
  const userName = localStorage.getItem('user_name') ?? 'Mi Negocio';

  const val = (n: number | undefined) => isLoading ? '...' : (n?.toLocaleString('es-MX') ?? '0');

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
                <div style={{ fontSize: 13, fontWeight: 600 }}>{stats?.negocioNombre ?? userName}</div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>Administrador</div>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#16a34a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>
                {(stats?.negocioNombre ?? userName).charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <main style={{ padding: 32 }}>
          <h2 style={{ margin: '0 0 4px', fontSize: 22, fontWeight: 700 }}>Dashboard</h2>
          <p style={{ margin: '0 0 28px', color: '#6b7280' }}>Resumen del rendimiento de tu negocio.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 28 }}>
            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Favoritos</span>
                <Users size={18} color="#16a34a" />
              </div>
              <p style={{ fontSize: 30, fontWeight: 700, margin: '0 0 4px' }}>{val(stats?.totalFavoritos)}</p>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>usuarios lo han guardado</p>
            </div>

            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Reseñas</span>
                <MessageSquare size={18} color="#2563eb" />
              </div>
              <p style={{ fontSize: 30, fontWeight: 700, margin: '0 0 4px' }}>{val(stats?.totalResenas)}</p>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>reseñas recibidas</p>
            </div>

            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Calificación</span>
                <Star size={18} color="#f59e0b" />
              </div>
              <p style={{ fontSize: 30, fontWeight: 700, margin: '0 0 4px' }}>
                {isLoading ? '...' : `${stats?.calificacionPromedio?.toFixed(1) ?? '0.0'}/5`}
              </p>
              <div style={{ display: 'flex', gap: 3, marginTop: 2 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.round(stats?.calificacionPromedio ?? 0) ? '#f59e0b' : 'none'} color="#f59e0b" />
                ))}
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>Tendencia</span>
                <TrendingUp size={18} color="#16a34a" />
              </div>
              <p style={{ fontSize: 16, fontWeight: 600, margin: '0 0 4px', color: '#16a34a' }}>
                {stats?.isVerified ? 'Negocio verificado' : 'Sin verificar'}
              </p>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                {stats?.isVerified ? 'Mayor visibilidad en la plataforma' : 'Suscríbete para destacar'}
              </p>
            </div>
          </div>

          <div style={{ background: '#f0fdf4', borderRadius: 10, border: '1px solid #bbf7d0', padding: 20 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: '#15803d' }}>Consejo</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#16a34a' }}>
              Los negocios verificados con más de 10 reseñas y calificación mayor a 4.0 aparecen primero en las recomendaciones del motor de IA de ExploraChiapas.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
