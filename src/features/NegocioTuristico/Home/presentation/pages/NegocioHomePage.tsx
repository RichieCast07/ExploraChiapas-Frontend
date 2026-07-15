import { Eye, LayoutDashboard, Plus, Route, Star, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

import { PanelShell } from '../../../../../core/shared/layout/PanelShell';
import { useNegocioStatsViewModel } from '../viewmodels/useNegocioStatsViewModel';
import './NegocioHomePage.css';

function relativeDate(dateValue: string): string {
  const date = new Date(dateValue);
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return 'Ahora';
  if (minutes < 60) return `Hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;
  return date.toLocaleDateString('es-MX');
}
import { useState } from 'react';
import { Sidebar } from '../../../../../core/shared/layout/Sidebar';
import { negocioNavConfig } from '../../../../../core/shared/config/navigation/negocioNavConfig';
import { Bell, Heart, MessageSquare, Star, ShieldCheck, BadgeCheck } from 'lucide-react';
import './NegocioHomePage.css';
import { useNegocioStatsViewModel } from '../viewmodels/useNegocioStatsViewModel';
import { logout, fetchAuth } from '../../../../../core/shared/utils/auth';
import { BASE_URL } from '../../../../../core/shared/config/api';

export function NegocioHomePage() {
  const { stats, isLoading, error } = useNegocioStatsViewModel();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const userName = localStorage.getItem('user_name') ?? 'Mi Negocio';

export function NegocioHomePage() {
  const { stats, recentReviews, isLoading, error, reload } = useNegocioStatsViewModel();

  async function handleSuscribirse() {
    setCheckoutLoading(true);
    try {
      const res = await fetchAuth(`${BASE_URL}/payments/checkout`, { method: 'POST' });
      const body = await res.json();
      if (body.success && body.url) {
        window.location.href = body.url;
      }
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <div className="negocio-layout">
      <Sidebar config={negocioNavConfig} onLogout={logout} />

      <div className="negocio-layout__main">
        <header className="negocio-header">
          <h1 className="negocio-header__brand">ExploraChiapas</h1>

          <div className="negocio-header__right">
            <button className="negocio-header__bell">
              <Bell size={20} />
            </button>
            <div className="negocio-header__divider" />
            <div className="negocio-header__user">
              <div className="negocio-header__user-info">
                <span className="negocio-header__user-name">{stats?.negocioNombre ?? userName}</span>
                <span className="negocio-header__user-role">Administrador</span>
              </div>
              <div className="negocio-header__avatar negocio-header__avatar--placeholder">
                {(stats?.negocioNombre ?? userName).charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <main className="negocio-content">
          {error && <p style={{ color: 'red', padding: '1rem' }}>{error}</p>}

          {!isLoading && stats && (
            stats.isVerified ? (
              <div className="negocio-verified-banner negocio-verified-banner--active">
                <BadgeCheck size={20} />
                <span>Negocio verificado</span>
              </div>
            ) : (
              <div className="negocio-verified-banner">
                <ShieldCheck size={20} />
                <div className="negocio-verified-banner__text">
                  <strong>Verifica tu negocio</strong>
                  <span>Suscríbete por $99 MXN/mes y obtén la insignia de negocio verificado</span>
                </div>
                <button
                  className="negocio-verified-banner__btn"
                  onClick={handleSuscribirse}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? 'Cargando...' : 'Suscribirse'}
                </button>
              </div>
            )
          )}

          <div className="negocio-stats-grid">
            <div className="negocio-stat-card">
              <div className="negocio-stat-card__top">
                <span className="negocio-stat-card__label">Favoritos del Negocio</span>
                <div className="negocio-stat-card__icon icon--green">
                  <Heart size={18} />
                </div>
              </div>
              <div className="negocio-stat-card__value-row">
                <span className="negocio-stat-card__value">{val(stats?.totalFavoritos)}</span>
              </div>
              <p className="negocio-stat-card__footer">usuarios lo han marcado como favorito</p>
            </div>

            <div className="negocio-stat-card">
              <div className="negocio-stat-card__top">
                <span className="negocio-stat-card__label">Total de Reseñas</span>
                <div className="negocio-stat-card__icon icon--blue">
                  <MessageSquare size={18} />
                </div>
              </div>
              <div className="negocio-stat-card__value-row">
                <span className="negocio-stat-card__value">{val(stats?.totalResenas)}</span>
              </div>
              <p className="negocio-stat-card__footer">reseñas recibidas</p>
            </div>

            <div className="negocio-stat-card">
              <div className="negocio-stat-card__top">
                <span className="negocio-stat-card__label">Calificación Promedio</span>
                <div className="negocio-stat-card__icon icon--yellow">
                  <Star size={18} />
                </div>
              </div>
              <div className="negocio-stat-card__value-row">
                <span className="negocio-stat-card__value">
                  {isLoading ? '...' : `${stats?.calificacionPromedio?.toFixed(1) ?? '0.0'}/5`}
                </span>
              </div>
              <div className="negocio-stat-card__stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.round(stats?.calificacionPromedio ?? 0) ? '#f59e0b' : 'none'}
                    color="#f59e0b"
                  />
                ))}
              </div>
            </div>
          </div>
          {!isLoading && recentReviews.length === 0 && <div className="ec-note">Todavía no hay reseñas para este negocio.</div>}
        </section>
      </div>
    </PanelShell>
  );
}
