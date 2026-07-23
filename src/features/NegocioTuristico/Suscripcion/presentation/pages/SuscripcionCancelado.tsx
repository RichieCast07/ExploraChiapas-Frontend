import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';

export function SuscripcionCancelado() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fef2f2' }}>
      <div style={{ textAlign: 'center', padding: '40px', background: 'var(--ec-card)', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', maxWidth: '420px', width: '90%' }}>
        <XCircle size={64} color="#dc2626" style={{ marginBottom: '16px' }} />
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#b91c1c', marginBottom: '12px' }}>
          Pago cancelado
        </h1>
        <p style={{ color: '#555', marginBottom: '28px', lineHeight: 1.6 }}>
          No se realizó ningún cargo. Puedes intentarlo de nuevo cuando quieras.
        </p>
        <button
          onClick={() => navigate('/negocio/inicio')}
          style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', padding: '12px 28px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
