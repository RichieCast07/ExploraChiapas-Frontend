export interface TourismOpportunity {
  destinationId: string;
  name: string;
  municipality: string | null;
  category: string | null;
  visits: number;
  rating: number;
  reviews: number;
  opportunityScore: number;
  recommendation: string;
}