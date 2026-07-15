export interface DestinationRanking {
  id: string;
  name: string;
  municipality: string | null;
  category: string | null;
  latitude: number;
  longitude: number;
  visits: number;
  searches: number;
  views: number;
  reviews: number;
  rating: number;
  saturated: boolean;
}