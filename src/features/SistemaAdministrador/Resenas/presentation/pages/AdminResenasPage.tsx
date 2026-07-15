import { useCallback, useEffect, useState } from 'react';
import { Star, RefreshCw, Trash2 } from 'lucide-react';
import { adminNavConfig } from '../../../../../core/shared/config/navigation/adminNavConfig';
import { Sidebar } from '../../../../../core/shared/layout/Sidebar';
import { logout, fetchAuth } from '../../../../../core/shared/utils/auth';
import { BASE_URL } from '../../../../../core/shared/config/api';

interface Resena {
  id: string;
  calificacion: number;
  comentario: string;
  targetType: string;
  targetNombre?: string;
  autorNombre?: string;
  creadoEn: string;
}

export function AdminResenasPage() {
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetchAuth(`${BASE_URL}/resenas?limit=100`);
      const body = await res.json() as { success: boolean; data?: Resena[]; message?: string };
      if (!res.ok || !body.success) throw new Error(body.message ?? 'Error al cargar reseñas');
      setResenas(body.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión');
      setResenas([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void cargar(); }, [cargar]);

  const eliminar = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetchAuth(`${BASE_URL}/resenas/${id}`, { method: 'DELETE' });
      if (res.ok) setResenas(prev => prev.filter(r => r.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7f5' }}>
      <Sidebar config={adminNavConfig} onLogout={logout} />
      <main style={{ marginLeft: 260, minHeight: '100vh', padding: 32, fontFamily: 'Inter, system-ui, sans-serif' }}>
        <header style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#16a34a', textTransform: 'uppercase', letterSpacing: 1 }}>
              Operaciones
            </span>
            <h1 style={{ margin: '4px 0', fontSize: 24, fontWeight: 700 }}>Comentarios y Reseñas</h1>
            <p style={{ color: '#6b7280', marginTop: 4 }}>Modera las reseñas publicadas en la plataforma.</p>
          </div>
          <button
            type="button"
            onClick={() => void cargar()}
            disabled={isLoading}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', border: '1px solid #d1d5db', borderRadius: 8, background: '#fff', cursor: 'pointer', fontWeight: 500 }}
          >
            <RefreshCw size={16} />
            Actualizar
          </button>
        </header>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '12px 16px', marginBottom: 16, color: '#b91c1c', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{error}</span>
            <button type="button" onClick={() => void cargar()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#b91c1c', fontWeight: 600 }}>Reintentar</button>
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          {isLoading ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#9ca3af' }}>Cargando reseñas...</div>
          ) : resenas.length === 0 && !error ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#9ca3af' }}>
              <Star size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
              <p>No hay reseñas registradas.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {resenas.map((r, i) => (
                <div key={r.id} style={{ padding: '16px 20px', borderBottom: i < resenas.length - 1 ? '1px solid #f3f4f6' : 'none', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} size={14} fill={idx < r.calificacion ? '#f59e0b' : 'none'} color="#f59e0b" />
                    ))}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 14 }}>{r.comentario}</p>
                    <div style={{ marginTop: 4, fontSize: 12, color: '#9ca3af' }}>
                      {r.autorNombre ?? 'Usuario'} · {r.targetNombre ?? r.targetType} · {new Date(r.creadoEn).toLocaleDateString('es-MX')}
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={deletingId === r.id}
                    onClick={() => void eliminar(r.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4 }}
                    title="Eliminar reseña"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
