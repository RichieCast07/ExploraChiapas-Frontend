// features/NegocioTuristico/Promociones/presentation/pages/PromocionesPage.tsx
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../../../../core/shared/layout/Sidebar';
import { negocioNavConfig } from '../../../../../core/shared/config/navigation/negocioNavConfig';
import { Bell, Plus, Calendar, Pencil, Trash2 } from 'lucide-react';
import './PromocionesPage.css';

// ---- Datos ficticios (mock) ----
const promociones = [
  {
    id: '1',
    titulo: 'Aventura en el Cañón del Sumidero',
    descripcion: 'Aplica para tours grupales de fin de semana con guía certificado y equipo incluido.',
    descuento: '20% OFF',
    vigencia: 'Vigencia: 01 Oct - 31 Oct, 2023',
    estado: 'activa' as const,
    imagen: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=600',
  },
  {
    id: '2',
    titulo: 'Ruta del Café: Pack Parejas',
    descripcion: 'Degustación premium y recorrido por beneficios históricos. Ideal para escapadas románticas.',
    descuento: '15% OFF',
    vigencia: 'Vigencia: 15 Oct - 15 Nov, 2023',
    estado: 'pendiente' as const,
    imagen: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600',
  },
];

const usuario = { nombre: 'Selva Verde Resort', rol: 'Administrador', avatarUrl: '' };

export function PromocionesPage() {
  const navigate = useNavigate();

  return (
    <div className="promo-layout">
      <Sidebar config={negocioNavConfig} onLogout={() => console.log('logout')} />

      <div className="promo-layout__main">
        {/* Header */}
        <header className="promo-header">
          <h1 className="promo-header__brand">ExploraChiapas</h1>
          <div className="promo-header__right">
            <button className="promo-header__bell">
              <Bell size={20} />
            </button>
            <div className="promo-header__divider" />
            <div className="promo-header__user">
              <div className="promo-header__user-info">
                <span className="promo-header__user-name">{usuario.nombre}</span>
                <span className="promo-header__user-role">{usuario.rol}</span>
              </div>
              {usuario.avatarUrl ? (
                <img src={usuario.avatarUrl} alt={usuario.nombre} className="promo-header__avatar" />
              ) : (
                <div className="promo-header__avatar promo-header__avatar--placeholder">
                  {usuario.nombre.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="promo-content">
          <div className="promo-content__top">
            <p className="promo-content__subtitle">Gestiona tus ofertas activas y atrae a más exploradores.</p>
            <button className="btn-primary" onClick={() => navigate('/negocio/promociones/nueva')}>
              <Plus size={18} /> Nueva Promoción
            </button>
          </div>

          <div className="promo-grid">
            {promociones.map((promo) => (
              <div key={promo.id} className="promo-card">
                <div className="promo-card__image-wrap">
                  <img src={promo.imagen} alt={promo.titulo} className="promo-card__image" />
                  <span className="promo-card__badge">{promo.descuento}</span>
                </div>

                <div className="promo-card__body">
                  <h3>{promo.titulo}</h3>
                  <p className="promo-card__desc">{promo.descripcion}</p>

                  <div className="promo-card__vigencia">
                    <Calendar size={14} />
                    <span>{promo.vigencia}</span>
                  </div>

                  <hr className="promo-card__divider" />

                  <div className="promo-card__footer">
                    <span className={`promo-card__status promo-card__status--${promo.estado}`}>
                      <i className="dot" /> {promo.estado === 'activa' ? 'Activa' : 'Pendiente'}
                    </span>
                    <div className="promo-card__actions">
                      <button className="icon-btn"><Pencil size={16} /></button>
                      <button className="icon-btn icon-btn--danger"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Card de "Crear Nueva Oferta" */}
            <button
              className="promo-card promo-card--create"
              onClick={() => navigate('/negocio/promociones/nueva')}
            >
              <div className="promo-card__create-icon">
                <Plus size={24} />
              </div>
              <h3>Crear Nueva Oferta</h3>
              <p>Llega a más clientes con descuentos exclusivos por temporada.</p>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}