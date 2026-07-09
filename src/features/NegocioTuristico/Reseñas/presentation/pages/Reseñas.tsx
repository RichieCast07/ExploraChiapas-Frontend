// features/NegocioTuristico/Reseñas/presentation/pages/Reseñas.tsx
import { Sidebar } from '../../../../../core/shared/layout/Sidebar';
import { negocioNavConfig } from '../../../../../core/shared/config/navigation/negocioNavConfig';
import { Bell, Star, Filter, MessageSquare } from 'lucide-react';
import './Reseñas.css';

// ---- Datos ficticios (mock) ----
const usuario = { nombre: 'Selva Verde Resort', rol: 'Administrador', avatarUrl: '' };

const resumen = {
  promedio: 4.8,
  totalReseñas: 128,
  cambioMesAnterior: 0.3,
};

const distribucion = [
  { estrellas: 5, porcentaje: 89 },
  { estrellas: 4, porcentaje: 8 },
  { estrellas: 3, porcentaje: 2 },
  { estrellas: 2, porcentaje: 1 },
  { estrellas: 1, porcentaje: 0 },
];

const reseñas = [
  {
    id: '1',
    nombre: 'Elena Rodríguez',
    fecha: '12 Oct, 2023',
    calificacion: 5,
    comentario:
      '¡Me encantó esta experiencia! El tour por el Cañón del Sumidero fue increíble, la organización impecable y el guía muy profesional. Sin duda repetiría y lo recomendaría a todos los que visiten Chiapas.',
    respondida: false,
  },
  {
    id: '2',
    nombre: 'Mark Silverstock',
    fecha: '08 Oct, 2023',
    calificacion: 4,
    comentario:
      'Fue una excelente experiencia en general, aunque el tiempo de espera al inicio del recorrido fue un poco más largo de lo esperado. Aun así, el paisaje y el servicio compensaron la espera.',
    respondida: true,
    respuesta:
      'Gracias por tu comentario, Mark. Trabajaremos en mejorar los tiempos de espera para futuras visitas.',
  },
  {
    id: '3',
    nombre: 'Sarah Tom J.',
    fecha: '02 Oct, 2023',
    calificacion: 5,
    comentario:
      'Hermoso lugar, excelente atención de todo el equipo. Definitivamente uno de los mejores tours que he tomado en la región.',
    respondida: false,
  },
];

export function ReseñasPage() {
  return (
    <div className="resenas-layout">
      <Sidebar config={negocioNavConfig} onLogout={() => console.log('logout')} />

      <div className="resenas-layout__main">
        {/* Header */}
        <header className="resenas-header">
          <h1 className="resenas-header__brand">ExploraChiapas</h1>
          <div className="resenas-header__right">
            <button className="resenas-header__bell">
              <Bell size={20} />
            </button>
            <div className="resenas-header__divider" />
            <div className="resenas-header__user">
              <div className="resenas-header__user-info">
                <span className="resenas-header__user-name">{usuario.nombre}</span>
                <span className="resenas-header__user-role">{usuario.rol}</span>
              </div>
              <div className="resenas-header__avatar">{usuario.nombre.charAt(0)}</div>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="resenas-content">
          <div className="resenas-content__top">
            <div>
              <h2>Reseñas y Comentarios</h2>
              <p>Gestiona y responde a las opiniones de tus huéspedes en Chiapas.</p>
            </div>
            <button className="btn-filter">
              <Filter size={16} /> Filtrar
            </button>
          </div>

          <div className="resenas-summary-grid">
            {/* Calificación general */}
            <div className="resumen-card">
              <span className="resumen-card__label">Calificación General</span>
              <div className="resumen-card__score">
                <span className="resumen-card__number">{resumen.promedio}</span>
                <span className="resumen-card__max">/5</span>
              </div>
              <div className="resumen-card__stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.round(resumen.promedio) ? '#f59e0b' : 'none'}
                    color="#f59e0b"
                  />
                ))}
              </div>
              <span className="resumen-card__change">
                +{resumen.cambioMesAnterior} desde el mes pasado
              </span>
            </div>

            {/* Distribución de calificaciones */}
            <div className="resumen-card resumen-card--dist">
              <div className="resumen-card__dist-header">
                <span className="resumen-card__label">Distribución de Calificaciones</span>
                <span className="resumen-card__total">{resumen.totalReseñas} reseñas</span>
              </div>
              {distribucion.map((d) => (
                <div key={d.estrellas} className="dist-row">
                  <span className="dist-row__label">{d.estrellas} <Star size={12} fill="#f59e0b" color="#f59e0b" /></span>
                  <div className="dist-row__bar-bg">
                    <div className="dist-row__bar-fill" style={{ width: `${d.porcentaje}%` }} />
                  </div>
                  <span className="dist-row__percent">{d.porcentaje}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Lista de reseñas recientes */}
          <div className="resenas-list">
            <div className="resenas-list__header">
              <h3>Reseñas Recientes</h3>
            </div>

            {reseñas.map((r) => (
              <div key={r.id} className="resena-item">
                <div className="resena-item__avatar">{r.nombre.charAt(0)}</div>

                <div className="resena-item__body">
                  <div className="resena-item__top">
                    <div>
                      <span className="resena-item__nombre">{r.nombre}</span>
                      <div className="resena-item__stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            fill={i < r.calificacion ? '#f59e0b' : 'none'}
                            color="#f59e0b"
                          />
                        ))}
                      </div>
                    </div>
                    <span className="resena-item__fecha">{r.fecha}</span>
                  </div>

                  <p className="resena-item__comentario">{r.comentario}</p>

                  {r.respondida && r.respuesta && (
                    <div className="resena-item__respuesta">
                      <span className="resena-item__respuesta-label">Tu respuesta</span>
                      <p>{r.respuesta}</p>
                    </div>
                  )}

                  <button className="resena-item__responder">
                    <MessageSquare size={14} />
                    {r.respondida ? 'Editar Respuesta' : 'Responder'}
                  </button>
                </div>
              </div>
            ))}

            <button className="btn-ver-todas">Ver las 128 Reseñas</button>
          </div>
        </main>
      </div>
    </div>
  );
}