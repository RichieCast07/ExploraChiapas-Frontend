import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getPremiumSubscriptionStatus } from '../api/premiumSubscription';

interface PremiumRouteProps { children: ReactNode; }
type State = 'loading' | 'allowed' | 'denied';

export function PremiumRoute({ children }: PremiumRouteProps) {
  const [state, setState] = useState<State>('loading');

  useEffect(() => {
    let cancelled = false;
    getPremiumSubscriptionStatus()
      .then((status) => {
        if (!cancelled) setState(status.isPremium ? 'allowed' : 'denied');
      })
      .catch(() => {
        if (!cancelled) setState('denied');
      });
    return () => { cancelled = true; };
  }, []);

  if (state === 'loading') {
    return <div style={{ minHeight: '40vh', display: 'grid', placeItems: 'center' }}>Verificando suscripción Premium...</div>;
  }

  if (state === 'denied') return <Navigate to="/negocio/suscripcion" replace />;
  return <>{children}</>;
}
