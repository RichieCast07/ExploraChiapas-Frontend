import { useNavigate } from 'react-router-dom';
import { BadgeCheck } from 'lucide-react';

export function SuscripcionExito() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0fdf4' }}>
      <div style={{ textAlign: 'center', padding: '40px', background: 'var(--ec-card)', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', maxWidth: '420px', width: '90%' }}>
        <BadgeCheck size={64} color="#16a34a" style={{ marginBottom: '16px' }} />
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#15803d', marginBottom: '12px' }}>
          Suscripción activada
        </h1>
        <p style={{ color: '#555', marginBottom: '28px', lineHeight: 1.6 }}>
          Tu negocio ahora tiene la insignia de verificado. Los turistas podrán identificarlo con mayor confianza.
        </p>
        <button
          onClick={() => navigate('/negocio/inicio')}
          style={{ background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', padding: '12px 28px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}
        >
          Ir al inicio
        </button>
      </div>
    </div>
  );
}
