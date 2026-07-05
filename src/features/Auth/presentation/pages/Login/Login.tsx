import React, { useState } from 'react';
import { useLoginViewModel } from '../../viewmodels/useLoginViewModel';
import "./Login.css";

export default function LoginPage() {
  const {
    email, setEmail,
    password, setPassword,
    rememberMe, setRememberMe,
    isLoading,
    error,
    handleLogin,
  } = useLoginViewModel();

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="login-root">
      <div className="login-card">

        <div className="login-header">
          <img src="/src/assets/logo.png" alt="ExploraChiapas" className="login-logo" />
          <h1 className="login-brand">ExploraChiapas</h1>
          <p className="login-subtitle">Inicia sesión para continuar</p>
        </div>

        <div className="login-divider" />

        <form className="login-form" onSubmit={onSubmit} noValidate>

          {error && (
            <div className="login-error">
              <span>⚠️ {error}</span>
            </div>
          )}

          <div className="field-group">
            <label className="field-label">Corporate Email</label>
            <div className="field-input-wrap">
              <span className="field-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9e9e9e" strokeWidth="2" strokeLinecap="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M2 7l10 7 10-7"/>
                </svg>
              </span>
              <input
                type="email"
                className="field-input"
                placeholder="admin@explorachiapas.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="field-group">
            <label className="field-label">Password</label>
            <div className="field-input-wrap">
              <span className="field-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9e9e9e" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                className="field-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="field-eye"
                onClick={() => setShowPassword(p => !p)}
                aria-label="Mostrar contraseña"
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9e9e9e" strokeWidth="2" strokeLinecap="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9e9e9e" strokeWidth="2" strokeLinecap="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="login-row">
            <label className="remember-label">
              <input
                type="checkbox"
                className="remember-check"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            <a href="/registro" className="link-register">Registrarse</a>
          </div>

          <button
            type="submit"
            className={`btn-login ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner" />
            ) : (
              <>
                Iniciar Sesión
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="login-divider" />

        <div className="login-footer">
          <div className="footer-links">
            <a
              href="https://explorachiapas-legal.vercel.app/terminos-condiciones"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Términos y Condiciones
            </a>
            <span className="footer-dot">·</span>
            <a
              href="https://explorachiapas-legal.vercel.app/politica-privacidad"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Política de Privacidad
            </a>
          </div>
          <div className="footer-support">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79-19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79-19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            Technical Support
          </div>
        </div>

      </div>
    </div>
  );
}
