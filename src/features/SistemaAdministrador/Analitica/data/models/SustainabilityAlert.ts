export interface SustainabilityAlert {
  destinationId: string;
  name: string;
  municipality: string | null;
  visits: number;
  rating: number;
  level: 'media' | 'alta';
  recommendation: string;
}