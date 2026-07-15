import { BarChart3 } from 'lucide-react';

interface AnalyticsEmptyStateProps {
  title?: string;
  description?: string;
}

export function AnalyticsEmptyState({
  title = 'Sin datos para este periodo',
  description = 'Cambia los filtros o registra actividad turística para generar indicadores.',
}: AnalyticsEmptyStateProps) {
  return <div className="analytics-empty-state"><BarChart3 size={24} /><strong>{title}</strong><p>{description}</p></div>;
}