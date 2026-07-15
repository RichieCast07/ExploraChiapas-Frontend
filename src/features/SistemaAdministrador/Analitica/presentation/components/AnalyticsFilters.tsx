import { CalendarRange, Filter } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';

import type { AnalyticsFilters as AnalyticsFilterValues } from '../../data/models/Analytics';

interface AnalyticsFiltersProps {
  value: AnalyticsFilterValues;
  municipalities: string[];
  isLoading: boolean;
  onApply: (filters: AnalyticsFilterValues) => void;
}

export function AnalyticsFilters({
  value,
  municipalities,
  isLoading,
  onApply,
}: AnalyticsFiltersProps) {
  const [draft, setDraft] = useState(value);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => setDraft(value), [value]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (draft.from > draft.to) {
      setValidationError('La fecha inicial no puede ser posterior a la fecha final.');
      return;
    }

    const from = new Date(`${draft.from}T00:00:00`);
    const to = new Date(`${draft.to}T23:59:59`);
    const maximum = new Date(from);
    maximum.setMonth(maximum.getMonth() + 24);

    if (to > maximum) {
      setValidationError('El periodo máximo permitido es de 24 meses.');
      return;
    }

    setValidationError(null);
    onApply(draft);
  };

  return (
    <form className="analytics-filter-form" onSubmit={submit}>
      <div className="analytics-filter-form__heading">
        <Filter size={16} />
        <div>
          <strong>Filtros del reporte</strong>
          <small>Periodo máximo de 24 meses</small>
        </div>
      </div>

      <label>
        Desde
        <span><CalendarRange size={14} /><input type="date" value={draft.from} onChange={(event) => setDraft({ ...draft, from: event.target.value })} required /></span>
      </label>

      <label>
        Hasta
        <span><CalendarRange size={14} /><input type="date" value={draft.to} onChange={(event) => setDraft({ ...draft, to: event.target.value })} required /></span>
      </label>

      <label>
        Municipio
        <select value={draft.municipality} onChange={(event) => setDraft({ ...draft, municipality: event.target.value })}>
          <option value="">Todos los municipios</option>
          {municipalities.map((municipality) => <option key={municipality} value={municipality}>{municipality}</option>)}
        </select>
      </label>

      <button className="ec-button ec-button--primary" type="submit" disabled={isLoading}>
        {isLoading ? 'Consultando…' : 'Aplicar filtros'}
      </button>

      {validationError && <p className="analytics-filter-form__error">{validationError}</p>}
    </form>
  );
}