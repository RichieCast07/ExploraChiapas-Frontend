import {
  AlertTriangle,
  BarChart3,
  Building2,
  CalendarRange,
  Crown,
  Filter,
  Heart,
  Leaf,
  MapPinned,
  RefreshCw,
  Route,
  Search,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  UsersRound,
} from 'lucide-react';

import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Link,
  useLocation,
} from 'react-router-dom';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  PanelShell,
} from '../../../../../core/shared/layout/PanelShell';

import {
  getDestinationCategories,
  getPremiumAudienceBudget,
  getPremiumAudienceInterests,
  getPremiumAudienceTypes,
  getPremiumHeatmap,
  getPremiumMunicipalities,
  getPremiumOpportunities,
  getPremiumRanking,
  getPremiumRedistribution,
  getPremiumReport,
  getPremiumSaturation,
  getPremiumTrends,
  type AudienceBudgetResponse,
  type AudienceInterestsResponse,
  type AudienceTypesResponse,
  type CategoryOption,
  type HeatmapResponse,
  type MunicipalityMetric,
  type OpportunitiesResponse,
  type PremiumFilters,
  type PremiumReport,
  type RankingMetric,
  type RankingResponse,
  type RedistributionResponse,
  type SaturationResponse,
  type TrendsResponse,
} from '../../data/premiumAnalyticsApi';

import {
  PremiumHeatmapMap,
} from '../components/PremiumHeatmapMap';

import './PremiumIntelligencePage.css';

type ViewKey =
  | 'resumen'
  | 'reportes'
  | 'tendencias'
  | 'oportunidades'
  | 'audiencia'
  | 'sostenibilidad';

const tabs: Array<{
  key: ViewKey;
  label: string;
  path: string;
}> = [
  { key: 'resumen', label: 'Resumen', path: '/negocio/inteligencia' },
  { key: 'reportes', label: 'Reportes', path: '/negocio/inteligencia/reportes' },
  { key: 'tendencias', label: 'Tendencias', path: '/negocio/inteligencia/tendencias' },
  { key: 'oportunidades', label: 'Oportunidades', path: '/negocio/inteligencia/oportunidades' },
  { key: 'audiencia', label: 'Audiencia', path: '/negocio/inteligencia/audiencia' },
  { key: 'sostenibilidad', label: 'Sostenibilidad', path: '/negocio/inteligencia/sostenibilidad' },
];

const chartColors = [
  'var(--ec-green-700)',
  '#2680c2',
  '#d27b2a',
  '#816ac6',
  '#b9810c',
];

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function initialFilters(): PremiumFilters {
  const to = new Date();
  const from = new Date();

  from.setDate(
    to.getDate() - 29,
  );

  return {
    from: isoDate(from),
    to: isoDate(to),
  };
}

function getView(pathname: string): ViewKey {
  if (pathname.endsWith('/reportes')) return 'reportes';
  if (pathname.endsWith('/tendencias')) return 'tendencias';
  if (pathname.endsWith('/oportunidades')) return 'oportunidades';
  if (pathname.endsWith('/audiencia')) return 'audiencia';
  if (pathname.endsWith('/sostenibilidad')) return 'sostenibilidad';
  return 'resumen';
}

function number(
  value: number | undefined,
): string {
  return (value ?? 0).toLocaleString('es-MX');
}

function humanType(
  value: string,
): string {
  return value
    .replace(/_/g, ' ')
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="premium-empty">
      <BarChart3 size={26} />
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}

export function PremiumIntelligencePage() {
  const location =
    useLocation();

  const active =
    getView(location.pathname);

  const [
    draftFilters,
    setDraftFilters,
  ] =
    useState<PremiumFilters>(
      initialFilters,
    );

  const [
    filters,
    setFilters,
  ] =
    useState<PremiumFilters>(
      initialFilters,
    );

  const [report, setReport] =
    useState<PremiumReport | null>(null);

  const [trends, setTrends] =
    useState<TrendsResponse | null>(null);

  const [ranking, setRanking] =
    useState<RankingResponse | null>(null);

  const [heatmap, setHeatmap] =
    useState<HeatmapResponse | null>(null);

  const [
    opportunities,
    setOpportunities,
  ] =
    useState<OpportunitiesResponse | null>(
      null,
    );

  const [
    audienceTypes,
    setAudienceTypes,
  ] =
    useState<AudienceTypesResponse | null>(
      null,
    );

  const [
    audienceInterests,
    setAudienceInterests,
  ] =
    useState<AudienceInterestsResponse | null>(
      null,
    );

  const [
    audienceBudget,
    setAudienceBudget,
  ] =
    useState<AudienceBudgetResponse | null>(
      null,
    );

  const [
    municipalities,
    setMunicipalities,
  ] =
    useState<MunicipalityMetric[]>([]);

  const [
    saturation,
    setSaturation,
  ] =
    useState<SaturationResponse | null>(
      null,
    );

  const [
    redistribution,
    setRedistribution,
  ] =
    useState<RedistributionResponse | null>(
      null,
    );

  const [
    categories,
    setCategories,
  ] =
    useState<CategoryOption[]>([]);

  const [
    rankingMetric,
    setRankingMetric,
  ] =
    useState<RankingMetric>('views');

  const [
    redistributionDestinationId,
    setRedistributionDestinationId,
  ] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(true);

  const [
    isRedistributing,
    setIsRedistributing,
  ] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const load =
    async (
      nextFilters: PremiumFilters,
    ) => {
      setIsLoading(true);
      setError(null);

      const results =
        await Promise.allSettled([
          getPremiumReport(nextFilters),
          getPremiumTrends(nextFilters),
          getPremiumRanking(nextFilters, 'views'),
          getPremiumHeatmap(nextFilters),
          getPremiumOpportunities(nextFilters),
          getPremiumAudienceTypes(nextFilters),
          getPremiumAudienceInterests(nextFilters),
          getPremiumAudienceBudget(nextFilters),
          getPremiumMunicipalities(nextFilters),
          getPremiumSaturation(nextFilters),
        ] as const);

      const [
        reportResult,
        trendsResult,
        rankingResult,
        heatmapResult,
        opportunitiesResult,
        audienceTypesResult,
        audienceInterestsResult,
        audienceBudgetResult,
        municipalitiesResult,
        saturationResult,
      ] = results;

      if (reportResult.status === 'fulfilled') {
        setReport(reportResult.value);
      }

      if (trendsResult.status === 'fulfilled') {
        setTrends(trendsResult.value);
      }

      if (rankingResult.status === 'fulfilled') {
        setRanking(rankingResult.value);
      }

      if (heatmapResult.status === 'fulfilled') {
        setHeatmap(heatmapResult.value);
      }

      if (opportunitiesResult.status === 'fulfilled') {
        setOpportunities(opportunitiesResult.value);
      }

      if (audienceTypesResult.status === 'fulfilled') {
        setAudienceTypes(audienceTypesResult.value);
      }

      if (audienceInterestsResult.status === 'fulfilled') {
        setAudienceInterests(audienceInterestsResult.value);
      }

      if (audienceBudgetResult.status === 'fulfilled') {
        setAudienceBudget(audienceBudgetResult.value);
      }

      if (municipalitiesResult.status === 'fulfilled') {
        setMunicipalities(
          municipalitiesResult.value.municipalities,
        );
      }

      if (saturationResult.status === 'fulfilled') {
        setSaturation(saturationResult.value);
      }

      const failures =
        results.filter(
          (result) =>
            result.status === 'rejected',
        );

      if (failures.length > 0) {
        const first = failures[0];

        setError(
          first.status === 'rejected' &&
          first.reason instanceof Error
            ? first.reason.message
            : 'Algunas métricas no pudieron cargarse.',
        );
      }

      setIsLoading(false);
    };

  useEffect(() => {
    void Promise.all([
      load(filters),

      getDestinationCategories()
        .then((data) =>
          setCategories(data),
        )
        .catch(() =>
          setCategories([]),
        ),
    ]);
    // Carga inicial.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortedRanking =
    useMemo(
      () => {
        const rows = [
          ...(ranking?.ranking ?? []),
        ];

        const keyMap: Record<
          RankingMetric,
          keyof (typeof rows)[number]
        > = {
          searches: 'searches',
          views: 'views',
          favorites: 'favorites',
          visitIntents: 'visitIntents',
          routes: 'routeAppearances',
        };

        const key =
          keyMap[rankingMetric];

        return rows.sort(
          (first, second) =>
            Number(second[key] ?? 0) -
            Number(first[key] ?? 0),
        );
      },
      [ranking, rankingMetric],
    );

  const applyFilters =
    () => {
      setFilters(draftFilters);
      void load(draftFilters);
    };

  const loadRedistribution =
    async () => {
      if (!redistributionDestinationId) {
        return;
      }

      setIsRedistributing(true);

      try {
        setRedistribution(
          await getPremiumRedistribution(
            filters,
            redistributionDestinationId,
          ),
        );
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'No se pudieron obtener alternativas.',
        );
      } finally {
        setIsRedistributing(false);
      }
    };

  const summary =
    report?.summary;

  return (
    <PanelShell kind="business">
      <div className="ec-page premium-page">
        <header className="premium-header">
          <div>
            <div className="ec-breadcrumb">
              Negocio
              <span>›</span>
              Inteligencia Premium
            </div>

            <div className="premium-title">
              <h1 className="ec-page-title">
                Inteligencia turística
              </h1>

              <span>
                <Crown size={14} />
                Premium
              </span>
            </div>

            <p className="ec-page-subtitle">
              Datos reales de actividad turística para analizar demanda, visitantes, oportunidades y sostenibilidad.
            </p>
          </div>

          <button
            type="button"
            className="premium-refresh"
            disabled={isLoading}
            onClick={() =>
              void load(filters)
            }
          >
            <RefreshCw size={15} />
            Actualizar
          </button>
        </header>

        <nav className="premium-tabs">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              to={tab.path}
              className={
                active === tab.key
                  ? 'is-active'
                  : ''
              }
            >
              {tab.label}
            </Link>
          ))}
        </nav>

        <section className="premium-filters">
          <div className="premium-filters__title">
            <Filter size={15} />
            Filtros
          </div>

          <label>
            <CalendarRange size={15} />
            <input
              type="date"
              value={draftFilters.from}
              onChange={(event) =>
                setDraftFilters({
                  ...draftFilters,
                  from: event.target.value,
                })
              }
            />
          </label>

          <label>
            <CalendarRange size={15} />
            <input
              type="date"
              value={draftFilters.to}
              onChange={(event) =>
                setDraftFilters({
                  ...draftFilters,
                  to: event.target.value,
                })
              }
            />
          </label>

          <label>
            <MapPinned size={15} />
            <select
              value={
                draftFilters.municipality ??
                ''
              }
              onChange={(event) =>
                setDraftFilters({
                  ...draftFilters,
                  municipality:
                    event.target.value ||
                    undefined,
                })
              }
            >
              <option value="">
                Todo Chiapas
              </option>

              {municipalities.map((item) => (
                <option
                  key={item.name}
                  value={item.name}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            <Search size={15} />
            <select
              value={
                draftFilters.categoryId ??
                ''
              }
              onChange={(event) =>
                setDraftFilters({
                  ...draftFilters,
                  categoryId:
                    event.target.value ||
                    undefined,
                })
              }
            >
              <option value="">
                Todas las categorías
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.nombre}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={applyFilters}
            disabled={isLoading}
          >
            Aplicar filtros
          </button>
        </section>

        {error && (
          <div className="premium-warning">
            <AlertTriangle size={16} />
            <span>{error}</span>
          </div>
        )}

        {isLoading && (
          <div className="premium-loading">
            <RefreshCw size={19} />
            Actualizando inteligencia turística...
          </div>
        )}

        {active === 'resumen' && (
          <>
            <section className="premium-kpis">
              <article>
                <Search size={18} />
                <div>
                  <small>Búsquedas</small>
                  <strong>
                    {number(summary?.searches)}
                  </strong>
                  <span>En el periodo</span>
                </div>
              </article>

              <article>
                <TrendingUp size={18} />
                <div>
                  <small>Visualizaciones</small>
                  <strong>
                    {number(
                      summary?.destinationViews,
                    )}
                  </strong>
                  <span>Destinos consultados</span>
                </div>
              </article>

              <article>
                <Heart size={18} />
                <div>
                  <small>Favoritos</small>
                  <strong>
                    {number(summary?.favorites)}
                  </strong>
                  <span>Interés guardado</span>
                </div>
              </article>

              <article>
                <Route size={18} />
                <div>
                  <small>Intenciones de visita</small>
                  <strong>
                    {number(
                      summary?.visitIntents,
                    )}
                  </strong>
                  <span>Acción “Deseo ir”</span>
                </div>
              </article>
            </section>

            <section className="premium-grid">
              <article className="premium-panel">
                <header>
                  <BarChart3 size={18} />
                  <div>
                    <h2>Actividad turística</h2>
                    <p>
                      Búsquedas, vistas e intención de visita.
                    </p>
                  </div>
                </header>

                {(trends?.series.length ?? 0) > 0 ? (
                  <div className="premium-chart">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <AreaChart
                        data={trends?.series ?? []}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                        />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="views"
                          name="Visualizaciones"
                          stroke="var(--ec-green-700)"
                          fill="var(--ec-green-700)"
                          fillOpacity={0.12}
                        />
                        <Area
                          type="monotone"
                          dataKey="visitIntents"
                          name="Deseo ir"
                          stroke="#d27b2a"
                          fill="#d27b2a"
                          fillOpacity={0.08}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <EmptyState
                    title="Aún no hay serie histórica"
                    description="Los datos aparecerán conforme móvil y web registren actividad analítica."
                  />
                )}
              </article>

              <article className="premium-panel">
                <header>
                  <Target size={18} />
                  <div>
                    <h2>Destinos destacados</h2>
                    <p>Mayor actividad observada.</p>
                  </div>
                </header>

                <div className="premium-ranking-list">
                  {sortedRanking
                    .slice(0, 5)
                    .map((item, index) => (
                      <div
                        key={item.destinationId}
                      >
                        <span>#{index + 1}</span>
                        <div>
                          <strong>{item.name}</strong>
                          <small>
                            {item.municipality ??
                              'Sin municipio'}
                          </small>
                        </div>
                        <b>
                          {number(item.views)}
                        </b>
                      </div>
                    ))}

                  {sortedRanking.length === 0 && (
                    <EmptyState
                      title="Sin ranking todavía"
                      description="No existen eventos analíticos suficientes."
                    />
                  )}
                </div>
              </article>

              <article className="premium-panel premium-panel--full">
                <header>
                  <MapPinned size={18} />
                  <div>
                    <h2>
                      Mapa de calor de interés
                    </h2>
                    <p>
                      Intensidad relativa basada en búsquedas, vistas, favoritos e intención de visita.
                    </p>
                  </div>
                </header>

                {(heatmap?.points.length ?? 0) > 0 ? (
                  <PremiumHeatmapMap
                    points={heatmap?.points ?? []}
                  />
                ) : (
                  <EmptyState
                    title="Sin puntos para el mapa"
                    description="El mapa se poblará conforme existan interacciones con destinos."
                  />
                )}
              </article>
            </section>
          </>
        )}

        {active === 'reportes' && (
          <section className="premium-stack">
            <article className="premium-report-summary">
              <div>
                <h2>Reporte general</h2>
                <p>
                  Resumen consolidado del periodo y filtros seleccionados.
                </p>
              </div>

              <div className="premium-report-summary__metrics">
                <span>
                  Búsquedas
                  <strong>
                    {number(summary?.searches)}
                  </strong>
                </span>

                <span>
                  Visualizaciones
                  <strong>
                    {number(
                      summary?.destinationViews,
                    )}
                  </strong>
                </span>

                <span>
                  Deseo ir
                  <strong>
                    {number(
                      summary?.visitIntents,
                    )}
                  </strong>
                </span>

                <span>
                  Rutas
                  <strong>
                    {number(
                      summary?.routeAppearances,
                    )}
                  </strong>
                </span>
              </div>
            </article>

            <article className="premium-panel">
              <header>
                <Target size={18} />
                <div>
                  <h2>
                    Destinos con mayor actividad
                  </h2>
                  <p>
                    Datos reales del reporte analítico.
                  </p>
                </div>
              </header>

              <div className="premium-table-wrap">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Destino</th>
                      <th>Municipio</th>
                      <th>Búsquedas</th>
                      <th>Vistas</th>
                      <th>Deseo ir</th>
                      <th>Favoritos</th>
                    </tr>
                  </thead>

                  <tbody>
                    {(report?.topDestinations ?? []).map(
                      (item) => (
                        <tr
                          key={item.destinationId}
                        >
                          <td>{item.name}</td>
                          <td>
                            {item.municipality ??
                              '—'}
                          </td>
                          <td>
                            {number(item.searches)}
                          </td>
                          <td>
                            {number(item.views)}
                          </td>
                          <td>
                            {number(
                              item.visitIntents,
                            )}
                          </td>
                          <td>
                            {number(
                              item.favorites,
                            )}
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </article>

            <section className="premium-grid">
              <article className="premium-panel">
                <header>
                  <BarChart3 size={18} />
                  <div>
                    <h2>Categorías</h2>
                    <p>
                      Interés por tipo de experiencia.
                    </p>
                  </div>
                </header>

                <div className="premium-chart">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={
                        report?.topCategories ??
                        []
                      }
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                      />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="views"
                        name="Visualizaciones"
                        fill="var(--ec-green-700)"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className="premium-panel">
                <header>
                  <Building2 size={18} />
                  <div>
                    <h2>Municipios</h2>
                    <p>
                      Interés observado por territorio.
                    </p>
                  </div>
                </header>

                <div className="premium-ranking-list">
                  {municipalities
                    .slice(0, 8)
                    .map((item, index) => (
                      <div key={item.name}>
                        <span>#{index + 1}</span>
                        <div>
                          <strong>
                            {item.name}
                          </strong>
                          <small>
                            {number(
                              item.destinations,
                            )}{' '}
                            destinos
                          </small>
                        </div>
                        <b>
                          {number(
                            item.visitIntents,
                          )}
                        </b>
                      </div>
                    ))}
                </div>
              </article>
            </section>
          </section>
        )}

        {active === 'tendencias' && (
          <section className="premium-stack">
            <article className="premium-panel premium-panel--full">
              <header>
                <TrendingUp size={18} />
                <div>
                  <h2>Tendencia temporal</h2>
                  <p>
                    Evolución de búsquedas, visualizaciones, favoritos e intención de visita.
                  </p>
                </div>
              </header>

              {(trends?.series.length ?? 0) > 0 ? (
                <div className="premium-chart premium-chart--large">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <AreaChart
                      data={trends?.series ?? []}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                      />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="searches"
                        name="Búsquedas"
                        stroke="#2680c2"
                        fill="#2680c2"
                        fillOpacity={0.07}
                      />
                      <Area
                        type="monotone"
                        dataKey="views"
                        name="Visualizaciones"
                        stroke="var(--ec-green-700)"
                        fill="var(--ec-green-700)"
                        fillOpacity={0.09}
                      />
                      <Area
                        type="monotone"
                        dataKey="visitIntents"
                        name="Deseo ir"
                        stroke="#d27b2a"
                        fill="#d27b2a"
                        fillOpacity={0.07}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState
                  title="Sin tendencia disponible"
                  description="No existen datos históricos suficientes para el periodo."
                />
              )}
            </article>

            <article className="premium-panel premium-panel--full">
              <header className="premium-panel-header-split">
                <div>
                  <Target size={18} />
                  <div>
                    <h2>Ranking de destinos</h2>
                    <p>
                      Ordena por la métrica que necesites analizar.
                    </p>
                  </div>
                </div>

                <select
                  value={rankingMetric}
                  onChange={(event) =>
                    setRankingMetric(
                      event.target.value as
                        RankingMetric,
                    )
                  }
                >
                  <option value="views">
                    Visualizaciones
                  </option>
                  <option value="searches">
                    Búsquedas
                  </option>
                  <option value="visitIntents">
                    Deseo ir
                  </option>
                  <option value="favorites">
                    Favoritos
                  </option>
                  <option value="routes">
                    Rutas
                  </option>
                </select>
              </header>

              <div className="premium-table-wrap">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Destino</th>
                      <th>Municipio</th>
                      <th>Búsquedas</th>
                      <th>Vistas</th>
                      <th>Favoritos</th>
                      <th>Deseo ir</th>
                      <th>Rutas</th>
                    </tr>
                  </thead>

                  <tbody>
                    {sortedRanking
                      .slice(0, 25)
                      .map((item, index) => (
                        <tr
                          key={item.destinationId}
                        >
                          <td>{index + 1}</td>
                          <td>{item.name}</td>
                          <td>
                            {item.municipality ??
                              '—'}
                          </td>
                          <td>
                            {number(item.searches)}
                          </td>
                          <td>
                            {number(item.views)}
                          </td>
                          <td>
                            {number(
                              item.favorites,
                            )}
                          </td>
                          <td>
                            {number(
                              item.visitIntents,
                            )}
                          </td>
                          <td>
                            {number(
                              item.routeAppearances,
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="premium-panel premium-panel--full">
              <header>
                <MapPinned size={18} />
                <div>
                  <h2>Mapa de calor regional</h2>
                  <p>
                    Intensidad relativa de interés turístico.
                  </p>
                </div>
              </header>

              {(heatmap?.points.length ?? 0) > 0 ? (
                <PremiumHeatmapMap
                  points={heatmap?.points ?? []}
                />
              ) : (
                <EmptyState
                  title="Sin datos geográficos"
                  description="Aún no existen métricas suficientes para el mapa."
                />
              )}
            </article>
          </section>
        )}

        {active === 'oportunidades' && (
          <section className="premium-stack">
            <div className="premium-callout">
              <Sparkles size={22} />
              <div>
                <h2>
                  Oportunidades de desarrollo
                </h2>
                <p>
                  Índice basado en calificación, baja visibilidad y demanda observada.
                </p>
              </div>
            </div>

            <article className="premium-panel premium-panel--full">
              <div className="premium-table-wrap">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Destino</th>
                      <th>Municipio</th>
                      <th>Calificación</th>
                      <th>Visibilidad</th>
                      <th>Demanda</th>
                      <th>Oportunidad</th>
                      <th>Motivo</th>
                    </tr>
                  </thead>

                  <tbody>
                    {(opportunities?.opportunities ?? []).map(
                      (item) => (
                        <tr
                          key={item.destinationId}
                        >
                          <td>{item.name}</td>
                          <td>
                            {item.municipality ??
                              '—'}
                          </td>
                          <td>
                            <Star size={13} />{' '}
                            {item.rating}
                          </td>
                          <td>
                            {item.visibilityScore}/100
                          </td>
                          <td>
                            {item.demandScore}/100
                          </td>
                          <td>
                            <strong className="premium-score">
                              {item.opportunityScore}
                              /100
                            </strong>
                          </td>
                          <td>{item.reason}</td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>

              {(opportunities?.opportunities.length ?? 0) ===
                0 && (
                <EmptyState
                  title="Sin oportunidades calculables"
                  description="Se requieren destinos con métricas y calificaciones suficientes."
                />
              )}
            </article>
          </section>
        )}

        {active === 'audiencia' && (
          <section className="premium-grid premium-grid--3">
            <article className="premium-panel">
              <header>
                <UsersRound size={18} />
                <div>
                  <h2>Tipo de visitante</h2>
                  <p>
                    Usuarios con actividad observada.
                  </p>
                </div>
              </header>

              {(audienceTypes?.segments.length ?? 0) > 0 ? (
                <div className="premium-chart">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={
                        audienceTypes?.segments ??
                        []
                      }
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                      />
                      <XAxis
                        dataKey="type"
                        tickFormatter={humanType}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="users"
                        name="Usuarios"
                        fill="var(--ec-green-700)"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState
                  title="Sin segmentación"
                  description="Todavía no hay suficiente actividad identificada por tipo de usuario."
                />
              )}
            </article>

            <article className="premium-panel">
              <header>
                <Heart size={18} />
                <div>
                  <h2>Intereses observados</h2>
                  <p>
                    Categorías con más interacción.
                  </p>
                </div>
              </header>

              {(audienceInterests?.interests.length ?? 0) >
              0 ? (
                <div className="premium-chart">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <PieChart>
                      <Pie
                        data={
                          audienceInterests?.interests ??
                          []
                        }
                        dataKey="interactions"
                        nameKey="name"
                        outerRadius={88}
                        label
                      >
                        {(audienceInterests?.interests ?? []).map(
                          (item, index) => (
                            <Cell
                              key={item.categoryId}
                              fill={
                                chartColors[
                                  index %
                                    chartColors.length
                                ]
                              }
                            />
                          ),
                        )}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState
                  title="Sin intereses observados"
                  description="Las preferencias aparecerán conforme existan interacciones por categoría."
                />
              )}
            </article>

            <article className="premium-panel">
              <header>
                <BarChart3 size={18} />
                <div>
                  <h2>Presupuesto</h2>
                  <p>
                    Solo datos proporcionados explícitamente.
                  </p>
                </div>
              </header>

              {(audienceBudget?.segments.length ?? 0) > 0 ? (
                <div className="premium-chart">
                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >
                    <BarChart
                      data={
                        audienceBudget?.segments ??
                        []
                      }
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                      />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="users"
                        name="Usuarios"
                        fill="#816ac6"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <EmptyState
                  title="Sin datos de presupuesto"
                  description="No se inventan rangos: aparecerán cuando los usuarios proporcionen esta preferencia."
                />
              )}
            </article>
          </section>
        )}

        {active === 'sostenibilidad' && (
          <section className="premium-stack">
            <div className="premium-callout premium-callout--green">
              <Leaf size={22} />
              <div>
                <h2>Turismo sostenible</h2>
                <p>
                  Presión turística estimada con intenciones de visita y capacidad configurada.
                </p>
              </div>
            </div>

            <article className="premium-panel premium-panel--full">
              <header>
                <AlertTriangle size={18} />
                <div>
                  <h2>Alertas de presión</h2>
                  <p>
                    No representan visitas físicas confirmadas.
                  </p>
                </div>
              </header>

              <div className="premium-table-wrap">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Destino</th>
                      <th>Municipio</th>
                      <th>Demanda diaria</th>
                      <th>Capacidad</th>
                      <th>Presión</th>
                      <th>Nivel</th>
                    </tr>
                  </thead>

                  <tbody>
                    {(saturation?.alerts ?? []).map(
                      (item) => (
                        <tr
                          key={item.destinationId}
                        >
                          <td>{item.name}</td>
                          <td>
                            {item.municipality ??
                              '—'}
                          </td>
                          <td>
                            {number(
                              item.estimatedDailyDemand,
                            )}
                          </td>
                          <td>
                            {number(
                              item.dailyCapacity,
                            )}
                          </td>
                          <td>
                            {item.pressurePercentage}%
                          </td>
                          <td>
                            <span
                              className={`premium-pressure premium-pressure--${item.level}`}
                            >
                              {item.level}
                            </span>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>

              {(saturation?.alerts.length ?? 0) ===
                0 && (
                <EmptyState
                  title="Sin destinos con capacidad configurada"
                  description="El administrador de plataforma debe registrar capacidades antes de calcular presión turística."
                />
              )}
            </article>

            <article className="premium-panel premium-panel--full">
              <header>
                <Route size={18} />
                <div>
                  <h2>
                    Redistribución de visitantes
                  </h2>
                  <p>
                    Busca alternativas de la misma categoría con menor presión estimada.
                  </p>
                </div>
              </header>

              <div className="premium-redistribution-controls">
                <select
                  value={
                    redistributionDestinationId
                  }
                  onChange={(event) =>
                    setRedistributionDestinationId(
                      event.target.value,
                    )
                  }
                >
                  <option value="">
                    Selecciona un destino
                  </option>

                  {(saturation?.alerts ??
                    report?.topDestinations ??
                    []).map((item) => (
                    <option
                      key={item.destinationId}
                      value={item.destinationId}
                    >
                      {item.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={
                    !redistributionDestinationId ||
                    isRedistributing
                  }
                  onClick={() =>
                    void loadRedistribution()
                  }
                >
                  {isRedistributing
                    ? 'Buscando...'
                    : 'Buscar alternativas'}
                </button>
              </div>

              {redistribution && (
                <div className="premium-alternatives">
                  {redistribution.alternatives.map(
                    (item) => (
                      <article
                        key={item.destinationId}
                      >
                        <strong>{item.name}</strong>
                        <span>
                          {item.municipality ??
                            'Sin municipio'}
                        </span>
                        <p>{item.reason}</p>
                        <div>
                          <small>
                            {item.distanceKm} km
                          </small>
                          <small>
                            ★ {item.rating}
                          </small>
                          <small>
                            Presión:{' '}
                            {item.pressurePercentage ??
                              'N/D'}
                            {item.pressurePercentage !==
                            null
                              ? '%'
                              : ''}
                          </small>
                        </div>
                      </article>
                    ),
                  )}
                </div>
              )}
            </article>
          </section>
        )}
      </div>
    </PanelShell>
  );
}
