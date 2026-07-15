import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  MapPinned,
  Route,
  Search,
  Sparkles,
  Store,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { PanelShell } from '../../../../../core/shared/layout/PanelShell';
import type { MunicipalityDistribution } from '../../data/models/Analytics';
import { AnalyticsEmptyState } from '../components/AnalyticsEmptyState';
import { AnalyticsFilters } from '../components/AnalyticsFilters';
import { ExportButtons } from '../components/ExportButtons';
import { MetricCard } from '../components/MetricCard';
import { useAdminAnalyticsViewModel } from '../viewmodels/useAdminAnalyticsViewModel';
import './AdminIntelligenceProPage.css';

function number(value: number | undefined): string {
  return (value ?? 0).toLocaleString('es-MX');
}

function visitorLabel(type: string): string {
  const labels: Record<string, string> = {
    turista_nacional: 'Turista nacional',
    turista_extranjero: 'Turista extranjero',
    habitante_local: 'Habitante local',
  };
  return labels[type] ?? type.replaceAll('_', ' ');
}

function mapPosition(
  item: MunicipalityDistribution,
  municipalities: MunicipalityDistribution[],
): { left: number; top: number; size: number; intensity: number } {
  const latitudes = municipalities.map((current) => current.latitude).filter(Number.isFinite);
  const longitudes = municipalities.map((current) => current.longitude).filter(Number.isFinite);
  const engagements = municipalities.map((current) => current.visits + current.searches);
  const minLatitude = Math.min(...latitudes);
  const maxLatitude = Math.max(...latitudes);
  const minLongitude = Math.min(...longitudes);
  const maxLongitude = Math.max(...longitudes);
  const latitudeRange = maxLatitude - minLatitude;
  const longitudeRange = maxLongitude - minLongitude;
  const maxEngagement = Math.max(1, ...engagements);
  const intensity = (item.visits + item.searches) / maxEngagement;

  return {
    left: longitudeRange ? 8 + ((item.longitude - minLongitude) / longitudeRange) * 84 : 50,
    top: latitudeRange ? 8 + ((maxLatitude - item.latitude) / latitudeRange) * 84 : 50,
    size: 24 + Math.sqrt(intensity) * 38,
    intensity,
  };
}

export function AdminIntelligenceProPage() {
  const {
    data,
    filters,
    isLoading,
    error,
    applyFilters,
    reload,
  } = useAdminAnalyticsViewModel();
  const summary = data?.summary;
  const topDestinations = data?.topDestinations ?? [];
  const municipalities = (data?.municipalityDistribution ?? []).filter(
    (item) => Number.isFinite(item.latitude) && Number.isFinite(item.longitude),
  );
  const maxDestinationActivity = Math.max(
    1,
    ...topDestinations.map((destination) => destination.visits + destination.searches),
  );
  const maxSearches = Math.max(1, ...(data?.topSearches ?? []).map((item) => item.total));
  const maxInterest = Math.max(1, ...(data?.interestDistribution ?? []).map((item) => item.total));
  const highest = topDestinations[0];

  return (
    <PanelShell kind="admin">
      <div className="ec-page intelligence-pro-page">
        <div className="ec-page-header">
          <div className="ec-page-header__copy">
            <div className="ec-breadcrumb">Dashboard <span>›</span> Analítica <span>›</span> Vista Pro</div>
            <h1 className="ec-page-title">Inteligencia Turística <span className="ec-badge ec-badge--green">PRO</span></h1>
            <p className="ec-page-subtitle">Tendencias, demanda, perfiles y sostenibilidad calculados con actividad real de ExploraChiapas.</p>
          </div>
          <div className="ec-actions">
            <Link className="ec-button" to="/admin/analitica">Vista general</Link>
            <ExportButtons data={data} />
            <button className="ec-button ec-button--primary" type="button" onClick={() => void reload()} disabled={isLoading}>Actualizar</button>
          </div>
        </div>

        {error && <div className="ec-note ec-note--danger">{error}</div>}

        <AnalyticsFilters
          value={filters}
          municipalities={data?.availableMunicipalities ?? []}
          isLoading={isLoading}
          onApply={applyFilters}
        />

        <section className="analytics-source-strip">
          <span><i /> API conectada</span>
          <strong>{data ? `${data.filters.from.slice(0, 10)} al ${data.filters.to.slice(0, 10)}` : 'Consultando periodo…'}</strong>
          <span>{data?.filters.municipality ?? 'Todo Chiapas'}</span>
        </section>

        <section className="ec-stat-grid ec-stat-grid--6 intelligence-pro-stats">
          <MetricCard label="Afluencia destinos" value={number(summary?.afluenciaDestinos)} icon={MapPinned} isLoading={isLoading} />
          <MetricCard label="Usuarios del periodo" value={number(summary?.totalUsuarios)} icon={Users} tone="orange" isLoading={isLoading} />
          <MetricCard label="Vistas de negocios" value={number(summary?.visualizacionesNegocios)} icon={Activity} tone="blue" isLoading={isLoading} />
          <MetricCard label="Clics en reservar" value={number(summary?.clicsReservaNegocios)} icon={Sparkles} isLoading={isLoading} />
          <MetricCard label="Rutas creadas" value={number(summary?.totalRutas)} icon={Route} tone="blue" isLoading={isLoading} />
          <MetricCard label="Negocios verificados" value={number(summary?.negociosVerificados)} icon={Store} tone="orange" isLoading={isLoading} />
        </section>

        <section className="intelligence-main-grid">
          <article className="ec-card">
            <div className="ec-card__header"><div><h2>Tendencias de búsqueda e interés</h2><small>Búsquedas y visualizaciones por mes</small></div><TrendingUp size={18} /></div>
            <div className="intelligence-chart">
              <ResponsiveContainer width="100%" height={310}>
                <AreaChart data={data?.searchTrends ?? []} margin={{ top: 10, right: 16, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="searchFill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#18783a" stopOpacity={0.42} /><stop offset="95%" stopColor="#18783a" stopOpacity={0.03} /></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#edf1ed" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={10} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} fontSize={10} />
                  <Tooltip />
                  <Legend />
                  <Area dataKey="searches" name="Búsquedas" type="monotone" stroke="#18783a" strokeWidth={3} fill="url(#searchFill)" />
                  <Area dataKey="destinationViews" name="Vistas de destinos" type="monotone" stroke="#e87528" strokeWidth={2} fillOpacity={0} />
                  <Area dataKey="businessViews" name="Vistas de negocios" type="monotone" stroke="#317bb5" strokeWidth={2} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </article>

          <aside className="ec-card">
            <div className="ec-card__header"><h2><Search size={17} /> Búsquedas principales</h2></div>
            <div className="ec-card__body analytics-bar-list">
              {(data?.topSearches ?? []).map((item, index) => (
                <div key={`${item.term}-${item.targetType}`}>
                  <p><strong>#{index + 1} {item.term}</strong><span>{number(item.total)}</span></p>
                  <i><span style={{ width: `${Math.max(5, (item.total / maxSearches) * 100)}%` }} /></i>
                </div>
              ))}
              {!isLoading && !data?.topSearches.length && <AnalyticsEmptyState title="Sin búsquedas registradas" description="Los eventos de búsqueda aparecerán aquí al conectar POST /stats/events desde la aplicación del visitante." />}
            </div>
          </aside>
        </section>

        <section className="intelligence-secondary-grid">
          <article className="ec-card">
            <div className="ec-card__header"><div><h2>Mapa de interés por municipio</h2><small>Posición geográfica e intensidad de visitas + búsquedas</small></div><MapPinned size={18} /></div>
            <div className="intelligence-data-map">
              {municipalities.map((municipality) => {
                const point = mapPosition(municipality, municipalities);
                return (
                  <button
                    className={municipality.saturatedDestinations > 0 ? 'municipality-point municipality-point--alert' : 'municipality-point'}
                    key={municipality.municipality}
                    type="button"
                    style={{ left: `${point.left}%`, top: `${point.top}%`, width: point.size, height: point.size, opacity: 0.55 + point.intensity * 0.45 }}
                    title={`${municipality.municipality}: ${number(municipality.visits)} visitas, ${number(municipality.searches)} búsquedas`}
                  >
                    <span>{municipality.municipality}</span>
                  </button>
                );
              })}
              {!isLoading && !municipalities.length && <AnalyticsEmptyState title="Sin coordenadas disponibles" description="Registra latitud y longitud en las ubicaciones de los destinos." />}
              <div className="intelligence-map-legend"><span><i /> Interés</span><span><i className="is-alert" /> Saturación</span></div>
            </div>
          </article>

          <article className="ec-card">
            <div className="ec-card__header"><h2>Destinos con mayor demanda</h2><span className="ec-badge">Visitas + búsquedas</span></div>
            <div className="ec-card__body intelligence-ranking">
              {topDestinations.map((destination, index) => {
                const activity = destination.visits + destination.searches;
                return <div key={destination.id}><p><strong>#{index + 1} {destination.name}</strong><span>{destination.municipality ?? 'Sin municipio'}</span></p><i><span style={{ width: `${Math.max(4, (activity / maxDestinationActivity) * 100)}%` }} /></i><small>{number(destination.visits)} visitas · {number(destination.searches)} búsquedas · ★ {destination.rating.toFixed(1)}</small></div>;
              })}
              {!isLoading && !topDestinations.length && <AnalyticsEmptyState />}
            </div>
          </article>
        </section>

        <section className="intelligence-cards-grid">
          <article className="ec-card">
            <div className="ec-card__header"><h2>Perfiles de visitantes</h2></div>
            <div className="ec-card__body visitor-segments">
              {(data?.visitorSegments ?? []).map((segment) => <div key={segment.type}><span style={{ '--segment': `${segment.percentage}%` } as React.CSSProperties}><i /></span><p><strong>{visitorLabel(segment.type)}</strong><small>{number(segment.total)} usuarios · {segment.percentage.toFixed(1)}%</small><small>Presupuesto promedio: ${number(segment.averageBudget)}</small></p></div>)}
              {!isLoading && !data?.visitorSegments.length && <AnalyticsEmptyState title="Sin perfiles turísticos" />}
            </div>
          </article>

          <article className="ec-card">
            <div className="ec-card__header"><h2>Experiencias preferidas</h2></div>
            <div className="ec-card__body analytics-bar-list analytics-bar-list--orange">
              {(data?.interestDistribution ?? []).map((interest) => <div key={interest.name}><p><strong>{interest.name}</strong><span>{number(interest.total)}</span></p><i><span style={{ width: `${Math.max(5, (interest.total / maxInterest) * 100)}%` }} /></i></div>)}
              {!isLoading && !data?.interestDistribution.length && <AnalyticsEmptyState title="Sin intereses registrados" />}
            </div>
          </article>

          <article className="ec-card">
            <div className="ec-card__header"><h2><BrainCircuit size={17} /> Resumen institucional</h2></div>
            <div className="ec-card__body intelligence-insight-list">
              <div><strong>Mayor interés actual</strong><p>{highest ? `${highest.name}, en ${highest.municipality ?? 'municipio no definido'}, encabeza el ranking con ${number(highest.visits)} visitas.` : 'Aún no existe afluencia suficiente para generar el indicador.'}</p></div>
              <div><strong>Cobertura comercial</strong><p>{number(summary?.negociosVerificados)} de {number(summary?.totalNegocios)} negocios activos están verificados.</p></div>
              <div><strong>Oferta disponible</strong><p>{number(summary?.totalDestinos)} destinos y {number(summary?.totalEventos)} eventos activos en el periodo.</p></div>
            </div>
          </article>
        </section>

        <section className="ec-card analytics-opportunities">
          <div className="ec-card__header"><div><h2>Zonas con potencial de desarrollo</h2><small>Baja afluencia y calificación alta</small></div><Sparkles size={18} /></div>
          <div className="ec-table-wrap">
            <table className="ec-table">
              <thead><tr><th>Destino</th><th>Municipio</th><th>Categoría</th><th>Visitas</th><th>Calificación</th><th>Puntaje</th><th>Acción sugerida</th></tr></thead>
              <tbody>
                {(data?.opportunities ?? []).map((opportunity) => <tr key={opportunity.destinationId}><td><strong>{opportunity.name}</strong></td><td>{opportunity.municipality ?? 'Sin municipio'}</td><td>{opportunity.category ?? 'Sin categoría'}</td><td>{number(opportunity.visits)}</td><td className="ranking-rating">★ {opportunity.rating.toFixed(1)}</td><td><span className="ec-badge ec-badge--green">{opportunity.opportunityScore.toFixed(0)}/100</span></td><td>{opportunity.recommendation}</td></tr>)}
                {!isLoading && !data?.opportunities.length && <tr><td colSpan={7}>No se detectaron destinos con baja afluencia y calificación mínima de 4.0 en este filtro.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>

        <section className="ec-card sustainability-card">
          <div className="ec-card__header"><div><h2>Turismo sostenible y redistribución</h2><small>Alertas basadas en saturación configurada o afluencia 50% superior al promedio</small></div><AlertTriangle size={18} /></div>
          <div className="sustainability-grid">
            {(data?.sustainabilityAlerts ?? []).map((alert) => <article key={alert.destinationId} className={`sustainability-alert sustainability-alert--${alert.level}`}><span><AlertTriangle size={16} /> Riesgo {alert.level}</span><strong>{alert.name}</strong><small>{alert.municipality ?? 'Sin municipio'} · {number(alert.visits)} visitas</small><p>{alert.recommendation}</p></article>)}
            {!isLoading && !data?.sustainabilityAlerts.length && <div className="sustainability-ok"><Sparkles size={22} /><strong>Sin alertas de saturación</strong><p>No se identificaron destinos saturados para el periodo y región elegidos.</p></div>}
          </div>
        </section>
      </div>
    </PanelShell>
  );
}