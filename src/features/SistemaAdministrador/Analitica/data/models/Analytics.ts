import type { DestinationRanking } from './DestianationRakings';
import type { SearchTrend, TopSearch } from './SearchTrend';
import type { SustainabilityAlert } from './SustainabilityAlert';
import type { TourismOpportunity } from './TourismOpportunity';
import type {
  AnalyticsSummary,
  CategoryDistribution,
  InterestDistribution,
  MonthlyAnalytics,
  MunicipalityDistribution,
} from './TourismReport';
import type { VisitorSegment } from './VisitorSegment';

export interface AnalyticsFilters {
  from: string;
  to: string;
  municipality: string;
}

export interface AdminAnalyticsData {
  filters: {
    from: string;
    to: string;
    municipality: string | null;
  };
  availableMunicipalities: string[];
  summary: AnalyticsSummary;
  monthly: MonthlyAnalytics[];
  topDestinations: DestinationRanking[];
  categoryDistribution: CategoryDistribution[];
  municipalityDistribution: MunicipalityDistribution[];
  searchTrends: SearchTrend[];
  topSearches: TopSearch[];
  visitorSegments: VisitorSegment[];
  interestDistribution: InterestDistribution[];
  opportunities: TourismOpportunity[];
  sustainabilityAlerts: SustainabilityAlert[];
}

export type {
  AnalyticsSummary,
  CategoryDistribution,
  DestinationRanking,
  InterestDistribution,
  MonthlyAnalytics,
  MunicipalityDistribution,
  SearchTrend,
  SustainabilityAlert,
  TopSearch,
  TourismOpportunity,
  VisitorSegment,
};