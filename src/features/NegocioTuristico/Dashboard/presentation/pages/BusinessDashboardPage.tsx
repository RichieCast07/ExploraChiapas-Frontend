import { Eye, Heart, MousePointerClick, Route, Star, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { apiRequest } from '../../../../../core/shared/api/apiClient';
import { PanelShell } from '../../../../../core/shared/layout/PanelShell';
import './BusinessDashboardPage.css';

interface Business { id: string; name: string; }
interface BusinessStats {
  totalFavoritos: number;
  calificacionPromedio: number;
  totalResenas: number;
  visualizaciones: number;
  clicsReserva: number;
  vecesEnRutas: number;
}

const dayWeights = [0.1, 0.12, 0.11, 0.14, 0.16, 0.2, 0.17];
const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export function BusinessDashboardPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [stats, setStats] = useState<BusinessStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const businesses = await apiRequest<Business[]>('/businesses/mine');
      const selected = businesses[0] ?? null;
      setBusiness(selected);
      setStats(selected ? await apiRequest<BusinessStats>(`/stats/businesses/${selected.id}`) : null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo cargar el dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const traffic = useMemo(() => dayNames.map((day, index) => ({
    day,
    views: Math.round((stats?.visualizaciones ?? 0) * dayWeights[index]),
  })), [stats?.visualizaciones]);

  const conversion = stats?.visualizaciones
    ? Math.round(((stats.clicsReserva ?? 0) / stats.visualizaciones) * 100)
    : 0;

  return (
    <PanelShell kind="business">
      <div className="ec-page business-dashboard-page">
        <div className="ec-page-header"><div><h1 className="ec-page-title">Dashboard del Negocio</h1><p className="ec-page-subtitle">Consulta el alcance, las conversiones y el rendimiento de {business?.name ?? 'tu perfil'}.</p></div><div className="ec-actions"><button className="ec-button" type="button">Acumulado</button><button className="ec-button ec-button--primary" type="button" onClick={() => void load()}>Actualizar datos</button></div></div>
        {isLoading && <div className="ec-note">Cargando métricas...</div>}
        {error && <div className="ec-note" style={{ borderColor: '#ef4444', color: '#991b1b' }}>{error}</div>}
        {!isLoading && !business && <div className="ec-note">Registra un negocio para consultar sus métricas.</div>}

        <section className="ec-stat-grid">
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon"><Eye size={18} /></span></div><div><div className="ec-stat-card__label">Total visualizaciones</div><div className="ec-stat-card__value">{stats?.visualizaciones.toLocaleString('es-MX') ?? '0'}</div><div className="ec-stat-card__hint">Métrica acumulada</div></div></article>
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon ec-stat-card__icon--blue"><Route size={18} /></span></div><div><div className="ec-stat-card__label">Veces en rutas</div><div className="ec-stat-card__value">{stats?.vecesEnRutas.toLocaleString('es-MX') ?? '0'}</div><div className="ec-stat-card__hint">Rutas personalizadas</div></div></article>
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon ec-stat-card__icon--orange"><MousePointerClick size={18} /></span></div><div><div className="ec-stat-card__label">Clics en “Reserva”</div><div className="ec-stat-card__value">{stats?.clicsReserva.toLocaleString('es-MX') ?? '0'}</div><div className="ec-stat-card__hint">Tasa de conversión {conversion}%</div></div></article>
          <article className="ec-stat-card"><div className="ec-stat-card__top"><span className="ec-stat-card__icon"><Star size={18} /></span></div><div><div className="ec-stat-card__label">Puntaje del perfil</div><div className="ec-stat-card__value">{(stats?.calificacionPromedio ?? 0).toFixed(1)}/5 <small className="business-rating-stars">{'★'.repeat(Math.round(stats?.calificacionPromedio ?? 0))}{'☆'.repeat(5 - Math.round(stats?.calificacionPromedio ?? 0))}</small></div></div></article>
        </section>

        <section className="ec-grid-2 business-dashboard-grid">
          <article className="ec-card"><div className="ec-card__header"><h2>Distribución estimada del tráfico</h2><span className="ec-badge ec-badge--green">Datos acumulados</span></div><div className="business-dashboard-chart"><ResponsiveContainer width="100%" height={300}><AreaChart data={traffic}><defs><linearGradient id="businessViews" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#167a39" stopOpacity={0.4} /><stop offset="95%" stopColor="#167a39" stopOpacity={0.02} /></linearGradient></defs><CartesianGrid vertical={false} stroke="#eef2ee" /><XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={10} /><YAxis axisLine={false} tickLine={false} fontSize={10} /><Tooltip /><Area dataKey="views" type="monotone" stroke="#167a39" strokeWidth={3} fill="url(#businessViews)" /></AreaChart></ResponsiveContainer></div></article>
          <aside className="ec-card"><div className="ec-card__header"><h2>Resumen del perfil</h2></div><div className="ec-card__body business-audience-list"><div><span className="ec-stat-card__icon"><Heart size={17} /></span><div><strong>{stats?.totalFavoritos.toLocaleString('es-MX') ?? '0'} favoritos</strong><small>Usuarios que guardaron el negocio</small></div></div><div><span className="ec-stat-card__icon ec-stat-card__icon--orange"><TrendingUp size={17} /></span><div><strong>{stats?.totalResenas.toLocaleString('es-MX') ?? '0'} reseñas</strong><small>Opiniones registradas</small></div></div><div><span className="ec-stat-card__icon ec-stat-card__icon--blue"><Route size={17} /></span><div><strong>{stats?.vecesEnRutas.toLocaleString('es-MX') ?? '0'} recomendaciones</strong><small>Incluido en rutas personalizadas</small></div></div></div></aside>
        </section>
      </div>
    </PanelShell>
  );
}
