import type { AdminAnalyticsData, AnalyticsFilters } from '../data/models/Analytics';
import type { AnalyticsRepository } from '../data/repository/AnalyticsRepository';

export class GetAdminAnalytics {
  constructor(private readonly repository: AnalyticsRepository) {}

  execute(filters: AnalyticsFilters): Promise<AdminAnalyticsData> {
    return this.repository.getAnalytics(filters);
  }
}