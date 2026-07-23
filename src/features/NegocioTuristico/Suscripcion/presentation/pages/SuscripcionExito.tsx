import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeCheck, LoaderCircle } from 'lucide-react';
import { getPremiumSubscriptionStatus } from '../../../../../core/shared/api/premiumSubscription';

type ActivationState = 'checking' | 'active' | 'pending';
const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export function SuscripcionExito() {
  const navigate = useNavigate();
  const [state, setState] = useState<ActivationState>('checking');

  useEffect(() => {
    let cancelled = false;
    async function verify() {
      for (let i = 0; i < 12; i += 1) {
        try {
          const status = await getPremiumSubscriptionStatus();
          if (status.isPremium) {
            if (!cancelled) {
              setState('active');
              window.dispatchEvent(new CustomEvent('ec-premium-updated'));
            }
            return;
          }
        } catch { /* reintentar */ }
        await sleep(1200);
      }
      if (!cancelled) setState('pending');
    }
    void verify();
    return () => { cancelled = true; };
  }, []);

  const active = state === 'active';
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ec-bg, #f8fafc)', padding: 24 }}>
      <div style={{ textAlign: 'center', padding: 40, background: 'var(--ec-card, white)', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', maxWidth: 460, width: '100%' }}>
        {state === 'checking' ? <LoaderCircle size={58} style={{ marginBottom: 16 }} /> : <BadgeCheck size={64} style={{ marginBottom: 16 }} />}
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
          {state === 'checking' ? 'Confirmando tu suscripción' : active ? 'Inteligencia Premium activada' : 'Pago recibido'}
        </h1>
        <p style={{ marginBottom: 28, lineHeight: 1.6 }}>
          {state === 'checking'
            ? 'Stripe confirmó el regreso del pago. Estamos esperando la confirmación segura del webhook.'
            : active
              ? 'Tu suscripción Premium está activa. Ya puedes acceder a Inteligencia Premium.'
              : 'La activación todavía se está procesando. Vuelve a Suscripción y actualiza el estado en unos segundos.'}
        </p>
        <button onClick={() => navigate(active ? '/negocio/inteligencia' : '/negocio/suscripcion')} style={{ border: 'none', borderRadius: 8, padding: '12px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
          {active ? 'Abrir Inteligencia Premium' : 'Volver a Suscripción'}
        </button>
      </div>
    </div>
  );
}
