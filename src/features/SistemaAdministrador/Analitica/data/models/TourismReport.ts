export interface AnalyticsSummary {
  totalUsuarios: number;
  totalDestinos: number;
  totalNegocios: number;
  negociosVerificados: number;
  totalEventos: number;
  totalResenas: number;
  totalRutas: number;
  totalFavoritosDestinos: number;
  totalFavoritosNegocios: number;
  promedioCalificacionDestinos: number;
  afluenciaDestinos: number;
  visualizacionesNegocios: number;
  clicsReservaNegocios: number;
}

export interface MonthlyAnalytics {
  monthKey: string;
  month: string;
  users: number;
  routes: number;
  events: number;
}

export interface CategoryDistribution {
  name: string;
  total: number;
  searches: number;
}

export interface MunicipalityDistribution {
  municipality: string;
  latitude: number;
  longitude: number;
  visits: number;
  searches: number;
  destinations: number;
  averageRating: number;
  saturatedDestinations: number;
}

export interface InterestDistribution {
  name: string;
  total: number;
}