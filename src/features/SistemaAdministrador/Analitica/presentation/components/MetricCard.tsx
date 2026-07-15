import type { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: 'green' | 'orange' | 'blue' | 'red';
  isLoading?: boolean;
}

export function MetricCard({ label, value, icon: Icon, tone = 'green', isLoading = false }: MetricCardProps) {
  const toneClass = tone === 'green' ? '' : `ec-stat-card__icon--${tone}`;

  return <article className="ec-stat-card"><div className="ec-stat-card__top"><span className={`ec-stat-card__icon ${toneClass}`}><Icon size={16} /></span></div><div><div className="ec-stat-card__label">{label}</div><div className="ec-stat-card__value">{isLoading ? '…' : value}</div></div></article>;
}