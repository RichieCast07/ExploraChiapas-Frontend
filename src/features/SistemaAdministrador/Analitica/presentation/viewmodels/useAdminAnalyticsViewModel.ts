import { useCallback, useEffect, useState } from 'react';

import type { AdminAnalyticsData, AnalyticsFilters } from '../../data/models/Analytics';
import { ApiAnalyticsRepository } from '../../data/repository/AnalyticsRepository';
import { GetAdminAnalytics } from '../../domain/AnalyticsUseCases';

const getAdminAnalytics = new GetAdminAnalytics(new ApiAnalyticsRepository());

function dateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function initialFilters(): AnalyticsFilters {
  const to = new Date();
  const from = new Date(to.getFullYear(), to.getMonth() - 5, 1);

  return {
    from: dateInputValue(from),
    to: dateInputValue(to),
    municipality: '',
  };
}

export function useAdminAnalyticsViewModel() {
  const [data, setData] = useState<AdminAnalyticsData | null>(null);
  const [filters, setFilters] = useState<AnalyticsFilters>(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (currentFilters: AnalyticsFilters) => {
    setIsLoading(true);
    setError(null);

    try {
      setData(await getAdminAnalytics.execute(currentFilters));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudieron cargar los datos analíticos',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(filters);
  }, [filters, load]);

  const applyFilters = useCallback((nextFilters: AnalyticsFilters) => {
    setFilters(nextFilters);
  }, []);

  const reload = useCallback(() => load(filters), [filters, load]);

  return { data, filters, isLoading, error, applyFilters, reload };
}