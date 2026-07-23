import {
  apiRequest,
} from '../../../../core/shared/api/apiClient';

export type RankingMetric =
  | 'searches'
  | 'views'
  | 'favorites'
  | 'visitIntents'
  | 'routes';

export interface PremiumFilters {
  from: string;
  to: string;
  municipality?: string;
  categoryId?: string;
}

export interface PremiumSummary {
  searches: number;
  destinationViews: number;
  visitIntents: number;
  favorites: number;
  routeAppearances: number;
}

export interface DestinationMetric {
  destinationId: string;
  name: string;
  municipality: string | null;
  searches: number;
  views: number;
  favorites: number;
  visitIntents: number;
  routeAppearances: number;
}

export interface CategoryMetric {
  categoryId: string;
  name: string;
  searches: number;
  views: number;
  visitIntents: number;
}

export interface MunicipalityMetric {
  name: string;
  views: number;
  searches: number;
  visitIntents: number;
  favorites: number;
  routeAppearances: number;
  destinations?: number;
}

export interface PremiumReport {
  filters: {
    from: string;
    to: string;
    municipality: string | null;
    categoryId: string | null;
  };
  summary: PremiumSummary;
  topDestinations: DestinationMetric[];
  topCategories: CategoryMetric[];
  municipalities: MunicipalityMetric[];
}

export interface TrendPoint {
  date: string;
  searches: number;
  views: number;
  visitIntents: number;
  favorites: number;
  routeAppearances: number;
}

export interface TrendsResponse {
  series: TrendPoint[];
}

export interface RankingResponse {
  metric: RankingMetric;
  ranking: DestinationMetric[];
}

export interface HeatmapPoint {
  destinationId: string;
  name: string;
  latitude: number;
  longitude: number;
  intensity: number;
}

export interface HeatmapResponse {
  points: HeatmapPoint[];
}

export interface Opportunity {
  destinationId: string;
  name: string;
  municipality: string | null;
  rating: number;
  visibilityScore: number;
  demandScore: number;
  opportunityScore: number;
  reason: string;
}

export interface OpportunitiesResponse {
  methodology: string;
  opportunities: Opportunity[];
}

export interface AudienceType {
  type: string;
  users: number;
  percentage: number;
}

export interface AudienceTypesResponse {
  source: string;
  segments: AudienceType[];
}

export interface AudienceInterest {
  categoryId: string;
  name: string;
  interactions: number;
  uniqueUsers: number;
  percentage: number;
}

export interface AudienceInterestsResponse {
  source: string;
  interests: AudienceInterest[];
}

export interface AudienceBudgetSegment {
  range: string;
  users: number;
  percentage: number;
}

export interface AudienceBudgetResponse {
  currency: string;
  segments: AudienceBudgetSegment[];
}

export interface MunicipalitiesResponse {
  methodology: string;
  municipalities: MunicipalityMetric[];
}

export interface SaturationAlert {
  destinationId: string;
  name: string;
  municipality: string | null;
  dailyCapacity: number;
  alertThreshold: number;
  capacitySource: string | null;
  estimatedDailyDemand: number;
  pressurePercentage: number;
  views: number;
  searches: number;
  level: 'low' | 'medium' | 'high' | 'critical';
}

export interface SaturationResponse {
  methodology: string;
  disclaimer: string;
  alerts: SaturationAlert[];
}

export interface RedistributionAlternative {
  destinationId: string;
  name: string;
  municipality: string | null;
  rating: number;
  visitIntents: number;
  views: number;
  favorites: number;
  pressurePercentage: number | null;
  distanceKm: number;
  reason: string;
}

export interface RedistributionResponse {
  source: {
    destinationId: string;
    name: string;
  };
  methodology: string;
  alternatives: RedistributionAlternative[];
}

export interface CategoryOption {
  id: string;
  nombre: string;
}

function buildQuery(
  filters: PremiumFilters,
  extra: Record<string, string | number | undefined> = {},
): string {
  const params =
    new URLSearchParams();

  params.set('from', filters.from);
  params.set('to', filters.to);

  if (filters.municipality) {
    params.set('municipality', filters.municipality);
  }

  if (filters.categoryId) {
    params.set('categoryId', filters.categoryId);
  }

  Object.entries(extra).forEach(([key, value]) => {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  });

  return params.toString();
}

export function getPremiumReport(
  filters: PremiumFilters,
) {
  return apiRequest<PremiumReport>(
    `/premium-analytics/reports?${buildQuery(filters)}`,
  );
}

export function getPremiumTrends(
  filters: PremiumFilters,
) {
  return apiRequest<TrendsResponse>(
    `/premium-analytics/trends?${buildQuery(filters)}`,
  );
}

export function getPremiumRanking(
  filters: PremiumFilters,
  metric: RankingMetric = 'views',
) {
  return apiRequest<RankingResponse>(
    `/premium-analytics/rankings/destinations?${buildQuery(
      filters,
      {
        metric,
        limit: 100,
      },
    )}`,
  );
}

export function getPremiumHeatmap(
  filters: PremiumFilters,
) {
  return apiRequest<HeatmapResponse>(
    `/premium-analytics/heatmap?${buildQuery(filters)}`,
  );
}

export function getPremiumOpportunities(
  filters: PremiumFilters,
) {
  return apiRequest<OpportunitiesResponse>(
    `/premium-analytics/opportunities?${buildQuery(filters)}`,
  );
}

export function getPremiumAudienceTypes(
  filters: PremiumFilters,
) {
  return apiRequest<AudienceTypesResponse>(
    `/premium-analytics/audience/types?${buildQuery(filters)}`,
  );
}

export function getPremiumAudienceInterests(
  filters: PremiumFilters,
) {
  return apiRequest<AudienceInterestsResponse>(
    `/premium-analytics/audience/interests?${buildQuery(filters)}`,
  );
}

export function getPremiumAudienceBudget(
  filters: PremiumFilters,
) {
  return apiRequest<AudienceBudgetResponse>(
    `/premium-analytics/audience/budget?${buildQuery(filters)}`,
  );
}

export function getPremiumMunicipalities(
  filters: PremiumFilters,
) {
  const withoutMunicipality = {
    ...filters,
    municipality: undefined,
  };

  return apiRequest<MunicipalitiesResponse>(
    `/premium-analytics/municipalities?${buildQuery(withoutMunicipality)}`,
  );
}

export function getPremiumSaturation(
  filters: PremiumFilters,
) {
  return apiRequest<SaturationResponse>(
    `/premium-analytics/sustainability/saturation?${buildQuery(filters)}`,
  );
}

export function getPremiumRedistribution(
  filters: PremiumFilters,
  destinationId: string,
) {
  return apiRequest<RedistributionResponse>(
    `/premium-analytics/sustainability/redistribution?${buildQuery(
      filters,
      {
        destinationId,
      },
    )}`,
  );
}

export function getDestinationCategories() {
  return apiRequest<CategoryOption[]>(
    '/categories?scope=destinos',
  );
}
