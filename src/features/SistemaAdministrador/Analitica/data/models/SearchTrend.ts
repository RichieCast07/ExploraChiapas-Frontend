export interface SearchTrend {
  monthKey: string;
  month: string;
  searches: number;
  destinationViews: number;
  businessViews: number;
}

export interface TopSearch {
  term: string;
  targetType: string;
  total: number;
}