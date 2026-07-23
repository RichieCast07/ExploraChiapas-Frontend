import { useEffect, useState } from 'react';
import { BadgeCheck, Check, CreditCard, Lock, RefreshCw, ShieldCheck, Sparkles, Star, Zap } from 'lucide-react';
import { PanelShell } from '../../../../../core/shared/layout/PanelShell';
import { createPremiumCheckout, getPremiumSubscriptionStatus } from '../../../../../core/shared/api/premiumSubscription';
import './SuscripcionPage.css';

const FREE_FEATURES = [
  'Perfil del negocio',
  'Gestión de promociones',
  'Visualización de reseñas',
  'Registro en el directorio',
];

const PREMIUM_FEATURES = [
  'Todo lo del plan gratuito',
  'Acceso a Inteligencia Premium',
  'Reportes y tendencias turísticas',
  'Ranking y mapa de demanda observada',
  'Oportunidades de mercado',
  'Análisis de audiencia',
  'Indicadores de sostenibilidad',
];

export function SuscripcionPage() {
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState('inactive');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPremiumSubscriptionStatus()
      .then((status) => {
        setIsPremium(status.isPremium);
        setSubscriptionStatus(status.status);
      })
      .catch(() => {
        setIsPremium(false);
        setSubscriptionStatus('inactive');
      })
      .finally(() => setLoadingStatus(false));
  }, []);

  async function handleCheckout() {
    setLoadingCheckout(true);
    setError(null);
    try {
      window.location.href = await createPremiumCheckout();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo iniciar el pago.');
      setLoadingCheckout(false);
    }
  }

  return (
    <PanelShell kind="business">
      <div className="suscripcion-page">
        <div className="suscripcion-hero">
          <div className="suscripcion-hero__eyebrow"><Sparkles size={12} />Planes y suscripción</div>
          <h1 className="suscripcion-hero__title">Inteligencia Premium para tu negocio</h1>
          <p className="suscripcion-hero__sub">Consulta demanda observada, tendencias, oportunidades y señales turísticas para apoyar tus decisiones.</p>
        </div>

        {!loadingStatus && isPremium && (
          <div className="suscripcion-verified">
            <div className="suscripcion-verified__icon"><BadgeCheck size={20} /></div>
            <div className="suscripcion-verified__text">
              <strong>Inteligencia Premium está activa</strong>
              <span>Tu suscripción está en estado {subscriptionStatus}. Ya tienes acceso a las herramientas Premium.</span>
            </div>
          </div>
        )}

        {error && <div className="suscripcion-error"><ShieldCheck size={16} />{error}</div>}

        <div className="suscripcion-plans">
          <div className="plan-card">
            <div className="plan-card__header">
              <div className="plan-card__icon plan-card__icon--muted"><Star size={18} /></div>
              <h2 className="plan-card__name">Gratuito</h2>
            </div>
            <div className="plan-card__price-row"><span className="plan-card__currency">$</span><span className="plan-card__price">0</span><span className="plan-card__period">/ mes</span></div>
            <p className="plan-card__desc">Funciones esenciales para administrar la presencia de tu negocio.</p>
            <div className="plan-card__divider" />
            <ul className="plan-card__features">
              {FREE_FEATURES.map((f) => <li key={f} className="plan-card__feature"><span className="plan-card__check plan-card__check--muted"><Check size={11} strokeWidth={3} /></span>{f}</li>)}
            </ul>
            <button className="plan-card__btn plan-card__btn--ghost" disabled>{isPremium ? 'Incluido en Premium' : 'Plan actual'}</button>
          </div>

          <div className="plan-card plan-card--featured">
            <div className="plan-card__badge"><Zap size={10} style={{ display: 'inline', marginRight: 4 }} />Premium</div>
            <div className="plan-card__header">
              <div className="plan-card__icon"><BadgeCheck size={18} /></div>
              <h2 className="plan-card__name">Inteligencia Premium</h2>
            </div>
            <div className="plan-card__price-row"><span className="plan-card__currency">$</span><span className="plan-card__price">299</span><span className="plan-card__period">MXN / mes</span></div>
            <p className="plan-card__desc">Herramientas analíticas avanzadas para entender mejor el comportamiento turístico.</p>
            <div className="plan-card__divider" />
            <ul className="plan-card__features">
              {PREMIUM_FEATURES.map((f) => <li key={f} className="plan-card__feature"><span className="plan-card__check"><Check size={11} strokeWidth={3} /></span>{f}</li>)}
            </ul>

            {loadingStatus ? (
              <button className="plan-card__btn plan-card__btn--ghost" disabled>Consultando suscripción...</button>
            ) : isPremium ? (
              <button className="plan-card__btn plan-card__btn--ghost" disabled><BadgeCheck size={16} />Premium activo</button>
            ) : (
              <button className="plan-card__btn plan-card__btn--primary" onClick={handleCheckout} disabled={loadingCheckout}>
                {loadingCheckout ? <><span className="suscripcion-spinner" />Redirigiendo a Stripe...</> : <><CreditCard size={16} />Suscribirme — $299 MXN/mes</>}
              </button>
            )}
          </div>
        </div>

        <div className="suscripcion-trust">
          <span className="suscripcion-trust__item"><Lock size={14} />Pago seguro con Stripe</span>
          <span className="suscripcion-trust__item"><RefreshCw size={14} />Suscripción mensual</span>
          <span className="suscripcion-trust__item"><BadgeCheck size={14} />Acceso Premium tras activación</span>
          <span className="suscripcion-trust__item"><ShieldCheck size={14} />Premium independiente de la verificación</span>
        </div>
      </div>
    </PanelShell>
  );
}
