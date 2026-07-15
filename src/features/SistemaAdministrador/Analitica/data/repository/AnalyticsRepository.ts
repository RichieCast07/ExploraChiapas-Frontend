import { apiRequest } from '../../../../../core/shared/api/apiClient';
import type { AdminAnalyticsData, AnalyticsFilters } from '../models/Analytics';

export interface AnalyticsRepository {
  getAnalytics(filters: AnalyticsFilters): Promise<AdminAnalyticsData>;
}

function startOfDay(value: string): string {
  return `${value}T00:00:00.000Z`;
}

function endOfDay(value: string): string {
  return `${value}T23:59:59.999Z`;
}

export class ApiAnalyticsRepository implements AnalyticsRepository {
  async getAnalytics(filters: AnalyticsFilters): Promise<AdminAnalyticsData> {
    const parameters = new URLSearchParams({
      from: startOfDay(filters.from),
      to: endOfDay(filters.to),
    });

    if (filters.municipality) {
      parameters.set('municipality', filters.municipality);
    }

    return apiRequest<AdminAnalyticsData>(`/stats/analytics?${parameters.toString()}`);
  }
}