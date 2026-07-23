import { apiRequest } from './apiClient';
import { BASE_URL } from '../config/api';
import { fetchAuth } from '../utils/auth';

export interface PremiumSubscriptionStatus {
  businessId: string | null;
  isPremium: boolean;
  status: string;
  canManage: boolean;
}

interface CheckoutResponse {
  success: boolean;
  url?: string;
  message?: string;
}

export function getPremiumSubscriptionStatus(): Promise<PremiumSubscriptionStatus> {
  return apiRequest<PremiumSubscriptionStatus>('/payments/subscription');
}

export async function createPremiumCheckout(): Promise<string> {
  const response = await fetchAuth(`${BASE_URL}/payments/checkout`, { method: 'POST' });
  const body = await response.json().catch(() => null) as CheckoutResponse | null;

  if (!response.ok || !body?.success || !body.url) {
    throw new Error(body?.message ?? 'No se pudo iniciar Stripe Checkout');
  }

  return body.url;
}
