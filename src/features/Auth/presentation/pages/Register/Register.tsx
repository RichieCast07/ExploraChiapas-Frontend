// src/features/Auth/presentation/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useRegisterViewModel } from '../../viewmodels/useRegisterViewModel';
import './Register.css';

export default function RegisterPage() {
  const {
    fullName,
    setFullName,
    email,
    setEmail,
    role,
    setRole,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    acceptTerms,
    setAcceptTerms,
    isLoading,
    error,
    handleRegister,
  } = useRegisterViewModel();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRegister();
  };

  const roles: { label: string; value: string }[] = [
    { label: 'Turista Nacional', value: 'turista_nacional' },
    { label: 'Turista Extranjero', value: 'turista_extranjero' },
    { label: 'Habitante Local', value: 'habitante_local' },
  ];

  return (
    <div className="register-root">
      <div className="register-card">
        <div className="register-header">
          <img src="/src/assets/logo.png" alt="ExploraChiapas" className="register-logo" />
          <h1 className="register-brand">ExploraChiapas</h1>
          <h2 className="register-title">Crear Cuenta de Administrador</h2>
          <p className="register-subtitle">Únete al ecosistema de ExploraChiapas</p>
        </div>

        <div className="register-divider" />

        <form className="register-form" onSubmit={onSubmit} noValidate>
          {error && (
            <div className="register-error">
              <span>⚠️ {error}</span>
            </div>
          )}

          {/* Nombre Completo */}
          <div className="field-group">
            <label className="field-label">Nombre Completo</label>
            <div className="field-input-wrap">
              <span className="field-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9e9e9e" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                type="text"
                className="field-input"
                placeholder="Ej. Ana García"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
          </div>

          {/* Correo Corporativo */}
          <div className="field-group">
            <label className="field-label">Correo Corporativo</label>
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
                placeholder="ana@explorachiapas.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Rol / Departamento - ACTUALIZADO CON LOS NUEVOS ROLES */}
          <div className="field-group">
            <label className="field-label">Rol / Departamento</label>
            <div className="field-input-wrap">
              <span className="field-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9e9e9e" strokeWidth="2" strokeLinecap="round">
                  <path d="M12 2a8 8 0 0 0-8 8c0 5 8 12 8 12s8-7 8-12a8 8 0 0 0-8-8z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </span>
              <select
                className="field-input field-select"
                value={role}
                onChange={e => setRole(e.target.value)}
                required
              >
                <option value="">Selecciona tu rol...</option>
                {roles.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Contraseña */}
          <div className="field-group">
            <label className="field-label">Contraseña</label>
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
                placeholder="********"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                minLength={8}
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
            <div className="password-hint">
              <span className="hint-text">Mínimo 8 caracteres</span>
              {password && (
                <span className={`password-strength ${getPasswordStrength(password)}`}>
                  {getPasswordStrengthLabel(password)}
                </span>
              )}
            </div>
          </div>

          {/* Confirmar Contraseña */}
          <div className="field-group">
            <label className="field-label">Confirmar Contraseña</label>
            <div className="field-input-wrap">
              <span className="field-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9e9e9e" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                className={`field-input ${password && confirmPassword && password !== confirmPassword ? 'field-input-error' : ''}`}
                placeholder="********"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className="field-eye"
                onClick={() => setShowConfirmPassword(p => !p)}
                aria-label="Mostrar contraseña"
              >
                {showConfirmPassword ? (
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
            {confirmPassword && password && password !== confirmPassword && (
              <div className="password-error-hint">⚠️ Las contraseñas no coinciden</div>
            )}
          </div>

          {/* Términos - ACTUALIZADO CON LOS LINKS CORRECTOS */}
          <div className="terms-group">
            <label className="terms-label">
              <input
                type="checkbox"
                className="terms-check"
                checked={acceptTerms}
                onChange={e => setAcceptTerms(e.target.checked)}
                required
              />
              <span>
                Acepto los{' '}
                <a 
                  href="https://explorachiapas-legal.vercel.app/terminos-condiciones" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Términos de Servicio
                </a>{' '}
                y la{' '}
                <a 
                  href="https://explorachiapas-legal.vercel.app/politica-privacidad" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Política de Privacidad
                </a>{' '}
                de la plataforma administrativa.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className={`btn-register ${isLoading ? 'loading' : ''}`}
            disabled={isLoading || !acceptTerms || (password !== confirmPassword)}
          >
            {isLoading ? (
              <span className="spinner" />
            ) : (
              <>
                Crear Cuenta
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="register-divider" />

        <div className="register-footer">
          <div className="footer-login">
            <span>¿Ya tienes cuenta? </span>
            <a href="/login" className="link-login">Iniciar Sesión</a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Funciones auxiliares para la fortaleza de la contraseña
function getPasswordStrength(password: string): string {
  if (password.length < 6) return 'weak';
  if (password.length < 10) return 'medium';
  return 'strong';
}

function getPasswordStrengthLabel(password: string): string {
  const strength = getPasswordStrength(password);
  const labels = {
    weak: '🔴 Débil',
    medium: '🟡 Media',
    strong: '🟢 Fuerte'
  };
  return labels[strength as keyof typeof labels] || '';
}