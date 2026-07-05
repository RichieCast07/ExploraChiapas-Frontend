// features/NegocioTuristico/Promociones/presentation/pages/NuevaPromocionPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../../../../core/shared/layout/Sidebar';
import { negocioNavConfig } from '../../../../../core/shared/config/navigation/negocioNavConfig';
import { Bell, Megaphone, ImagePlus, ChevronRight } from 'lucide-react';
import './FormularioPromociones.css';
import { useNuevaPromocionViewModel } from '../viewmodels/useNuevaPromocionViewModel';

export function NuevaPromocionPage() {
  const navigate = useNavigate();
  const {
    titulo, setTitulo,
    precio, setPrecio,
    descripcion, setDescripcion,
    fechaInicio, setFechaInicio,
    fechaFin, setFechaFin,
    isLoading,
    error,
    publicar,
  } = useNuevaPromocionViewModel();

  const userName = localStorage.getItem('user_name') ?? 'Mi Negocio';

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await publicar();
    if (ok) navigate('/negocio/promociones');
  };

  return (
    <div className="nueva-promo-layout">
      <Sidebar config={negocioNavConfig} onLogout={() => console.log('logout')} />

      <div className="nueva-promo-layout__main">
        {/* Header */}
        <header className="nueva-promo-header">
          <h1 className="nueva-promo-header__brand">ExploraChiapas</h1>
          <div className="nueva-promo-header__right">
            <button className="nueva-promo-header__bell">
              <Bell size={20} />
            </button>
            <div className="nueva-promo-header__divider" />
            <div className="nueva-promo-header__user">
              <div className="nueva-promo-header__user-info">
                <span className="nueva-promo-header__user-name">{userName}</span>
                <span className="nueva-promo-header__user-role">Administrador</span>
              </div>
              <div className="nueva-promo-header__avatar">{userName.charAt(0)}</div>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="nueva-promo-content">
          <div className="nueva-promo-breadcrumb">
            <span>SERVICIOS</span>
            <ChevronRight size={14} />
            <span className="active">NUEVA PROMOCIÓN</span>
          </div>

          <h2 className="nueva-promo-title">Configurar Nueva Promoción</h2>
          <p className="nueva-promo-subtitle">
            Crea ofertas atractivas para atraer a más exploradores a tus tours y actividades.
          </p>

          {error && <p style={{ color: 'red', padding: '0 1.5rem' }}>{error}</p>}

          <form className="nueva-promo-card" onSubmit={handleSubmit}>
            <div className="nueva-promo-card__header">
              <Megaphone size={16} />
              <span>DETALLES DEL INCENTIVO</span>
            </div>

            <div className="nueva-promo-card__body">
              <div className="form-row">
                <div className="form-group">
                  <label>Título de la Promoción</label>
                  <input
                    type="text"
                    placeholder="Ej: Especial de Verano en Cañón del Sumidero"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group form-group--small">
                  <label>Precio (MXN)</label>
                  <div className="input-suffix">
                    <input
                      type="number"
                      placeholder="500"
                      value={precio}
                      onChange={(e) => setPrecio(e.target.value)}
                    />
                    <span>$</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Descripción de la Oferta</label>
                <textarea
                  placeholder="Describe los beneficios y condiciones de esta promoción..."
                  rows={4}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha de Inicio</label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Fecha de Finalización</label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Imagen Promocional</label>
                <label className="upload-box">
                  <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                  {previewUrl ? (
                    <img src={previewUrl} alt="preview" className="upload-box__preview" />
                  ) : (
                    <>
                      <div className="upload-box__icon">
                        <ImagePlus size={22} />
                      </div>
                      <p className="upload-box__text">Haz clic para subir o arrastra una imagen</p>
                      <p className="upload-box__hint">Recomendado: 1200x630px (Max 5MB, JPG/PNG)</p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="nueva-promo-card__footer">
              <button type="button" className="btn-cancel" onClick={() => navigate('/negocio/promociones')}>
                Cancelar
              </button>
              <button type="submit" className="btn-publish" disabled={isLoading}>
                {isLoading ? 'Publicando...' : 'Publicar Promoción'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}