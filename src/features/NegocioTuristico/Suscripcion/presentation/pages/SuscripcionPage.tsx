import { useState } from 'react';
import {
  BadgeCheck,
  Check,
  CreditCard,
  Lock,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react';

import { PanelShell } from '../../../../../core/shared/layout/PanelShell';
import { fetchAuth } from '../../../../../core/shared/utils/auth';
import { BASE_URL } from '../../../../../core/shared/config/api';
import './SuscripcionPage.css';

const FREE_FEATURES = [
  'Perfil básico del negocio',
  'Gestión de promociones',
  'Visualización de reseñas',
  'Registro en el directorio',
];

const PRO_FEATURES = [
  'Todo lo del plan gratuito',
  'Insignia de negocio verificado',
  'Mayor visibilidad en búsquedas',
  'Destacado en la app móvil',
  'Estadísticas de visitas y favoritos',
  'Soporte prioritario',
];

interface SuscripcionPageProps {
  isVerified?: boolean;
}

export function SuscripcionPage({ isVerified = false }: SuscripcionPageProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res  = await fetchAuth(`${BASE_URL}/payments/checkout`, { method: 'POST' });
      const body = await res.json() as { success: boolean; url?: string; message?: string };

      if (body.success && body.url) {
        window.location.href = body.url;
      } else {
        setError(body.message ?? 'No se pudo iniciar el pago. Intenta de nuevo.');
      }
    } catch {
      setError('Error de conexión. Verifica tu red e intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PanelShell kind="business">
      <div className="suscripcion-page">

        {/* Encabezado */}
        <div className="suscripcion-hero">
          <div className="suscripcion-hero__eyebrow">
            <Sparkles size={12} />
            Planes y suscripción
          </div>
          <h1 className="suscripcion-hero__title">
            Haz crecer tu negocio con ExploraChiapas
          </h1>
          <p className="suscripcion-hero__sub">
            Elige el plan que mejor se adapte a ti. Cancela en cualquier momento.
          </p>
        </div>

        {/* Banner si ya está verificado */}
        {isVerified && (
          <div className="suscripcion-verified">
            <div className="suscripcion-verified__icon">
              <BadgeCheck size={20} />
            </div>
            <div className="suscripcion-verified__text">
              <strong>Tu negocio ya está verificado</strong>
              <span>Tienes activo el Plan Verificado. Los turistas pueden identificarte con la insignia oficial.</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="suscripcion-error">
            <ShieldCheck size={16} />
            {error}
          </div>
        )}

        {/* Grid de planes */}
        <div className="suscripcion-plans">

          {/* Plan Gratuito */}
          <div className="plan-card">
            <div className="plan-card__header">
              <div className="plan-card__icon plan-card__icon--muted">
                <Star size={18} />
              </div>
              <h2 className="plan-card__name">Gratuito</h2>
            </div>

            <div className="plan-card__price-row">
              <span className="plan-card__currency">$</span>
              <span className="plan-card__price">0</span>
              <span className="plan-card__period">/ mes</span>
            </div>

            <p className="plan-card__desc">
              Todo lo esencial para tener presencia en la plataforma.
            </p>

            <div className="plan-card__divider" />

            <ul className="plan-card__features">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="plan-card__feature">
                  <span className="plan-card__check plan-card__check--muted">
                    <Check size={11} strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            <button className="plan-card__btn plan-card__btn--ghost" disabled>
              Plan actual
            </button>
          </div>

          {/* Plan Verificado */}
          <div className="plan-card plan-card--featured">
            <div className="plan-card__badge">
              <Zap size={10} style={{ display: 'inline', marginRight: 4 }} />
              Más popular
            </div>

            <div className="plan-card__header">
              <div className="plan-card__icon">
                <BadgeCheck size={18} />
              </div>
              <h2 className="plan-card__name">Verificado</h2>
            </div>

            <div className="plan-card__price-row">
              <span className="plan-card__currency">$</span>
              <span className="plan-card__price">99</span>
              <span className="plan-card__period">MXN / mes</span>
            </div>

            <p className="plan-card__desc">
              Más visibilidad, confianza y herramientas para atraer más turistas.
            </p>

            <div className="plan-card__divider" />

            <ul className="plan-card__features">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="plan-card__feature">
                  <span className="plan-card__check">
                    <Check size={11} strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>

            {isVerified ? (
              <button className="plan-card__btn plan-card__btn--ghost" disabled>
                <BadgeCheck size={16} />
                Plan activo
              </button>
            ) : (
              <button
                className="plan-card__btn plan-card__btn--primary"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="suscripcion-spinner" />
                    Redirigiendo...
                  </>
                ) : (
                  <>
                    <CreditCard size={16} />
                    Suscribirme — $99 MXN/mes
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Garantías */}
        <div className="suscripcion-trust">
          <span className="suscripcion-trust__item">
            <Lock size={14} />
            Pago seguro con Stripe
          </span>
          <span className="suscripcion-trust__item">
            <RefreshCw size={14} />
            Cancela cuando quieras
          </span>
          <span className="suscripcion-trust__item">
            <BadgeCheck size={14} />
            Insignia activa de inmediato
          </span>
          <span className="suscripcion-trust__item">
            <ShieldCheck size={14} />
            Sin costos ocultos
          </span>
        </div>

      </div>
    </PanelShell>
  );
}
