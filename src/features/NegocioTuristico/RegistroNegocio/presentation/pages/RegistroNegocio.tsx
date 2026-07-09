// features/NegocioTuristico/RegistroNegocio/presentation/pages/RegistroNegocio.tsx
import { useState } from 'react';
import { Sidebar } from '../../../../../core/shared/layout/Sidebar';
import { negocioNavConfig } from '../../../../../core/shared/config/navigation/negocioNavConfig';
import { Bell, MapPin, Camera, Image, Info, X, Plus } from 'lucide-react';
import './RegistroNegocio.css';

const usuario = { nombre: 'Selva Verde Resort', rol: 'Administrador', avatarUrl: '' };

type Categoria = 'restaurante' | 'hotel';

export function RegistroNegocio() {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState<Categoria>('restaurante');
  const [apertura, setApertura] = useState('08:00');
  const [cierre, setCierre] = useState('22:00');
  const [precio, setPrecio] = useState('');
  const [servicios, setServicios] = useState(['Wi-Fi Gratis', 'Estacionamiento', 'Pet Friendly']);

  // Simulación de coordenadas — a futuro vendrán de Google Maps / Leaflet
  const [coordenadas, setCoordenadas] = useState({ lat: 16.7371, lng: -92.6375 });

  const eliminarServicio = (servicio: string) => {
    setServicios(servicios.filter((s) => s !== servicio));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ nombre, categoria, apertura, cierre, precio, servicios, coordenadas });
    // A futuro: llamada al usecase / API (tablas Restaurantes y Destinos)
  };

  return (
    <div className="registro-layout">
      <Sidebar config={negocioNavConfig} onLogout={() => console.log('logout')} />

      <div className="registro-layout__main">
        {/* Header */}
        <header className="registro-header">
          <h1 className="registro-header__brand">ExploraChiapas</h1>
          <div className="registro-header__right">
            <button className="registro-header__bell">
              <Bell size={20} />
            </button>
            <div className="registro-header__divider" />
            <div className="registro-header__user">
              <div className="registro-header__user-info">
                <span className="registro-header__user-name">{usuario.nombre}</span>
                <span className="registro-header__user-role">{usuario.rol}</span>
              </div>
              <div className="registro-header__avatar">{usuario.nombre.charAt(0)}</div>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="registro-content">
          <h2 className="registro-title">Detalles del Negocio</h2>
          <p className="registro-subtitle">Comencemos con la información básica de tu establecimiento en Chiapas.</p>

          <form className="registro-grid" onSubmit={handleSubmit}>
            {/* Columna izquierda */}
            <div className="registro-col-left">
              <div className="registro-card">
                <label className="registro-label">Nombre del Negocio</label>
                <input
                  type="text"
                  placeholder="Ej. Restaurante Las Nubes"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div className="registro-card">
                <label className="registro-label">Categoría</label>
                <div className="categoria-options">
                  <button
                    type="button"
                    className={`categoria-chip ${categoria === 'restaurante' ? 'active' : ''}`}
                    onClick={() => setCategoria('restaurante')}
                  >
                    Restaurante
                  </button>
                  <button
                    type="button"
                    className={`categoria-chip ${categoria === 'hotel' ? 'active' : ''}`}
                    onClick={() => setCategoria('hotel')}
                  >
                    Hotel
                  </button>
                </div>
              </div>

              <div className="registro-card">
                <label className="registro-label">Horario de Operación</label>
                <div className="horario-row">
                  <div>
                    <span className="horario-label">APERTURA</span>
                    <input type="time" value={apertura} onChange={(e) => setApertura(e.target.value)} />
                  </div>
                  <div>
                    <span className="horario-label">CIERRE</span>
                    <input type="time" value={cierre} onChange={(e) => setCierre(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="registro-card">
                <label className="registro-label">Precio Promedio</label>
                <div className="precio-input">
                  <span>$</span>
                  <input
                    type="number"
                    placeholder="Ej. 500"
                    value={precio}
                    onChange={(e) => setPrecio(e.target.value)}
                  />
                </div>
              </div>

              <div className="registro-card">
                <label className="registro-label">Servicios Disponibles</label>
                <div className="servicios-tags">
                  {servicios.map((s) => (
                    <span key={s} className="servicio-tag">
                      {s}
                      <button type="button" onClick={() => eliminarServicio(s)}>
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
                <button type="button" className="btn-agregar">
                  <Plus size={14} /> Agregar
                </button>
              </div>
            </div>

            {/* Columna derecha */}
            <div className="registro-col-right">
              <div className="registro-card">
                <div className="mapa-header">
                  <span className="registro-label">Ubicación Exacta</span>
                  <button type="button" className="btn-ajustar-pin">AJUSTAR PIN</button>
                </div>

                {/* Mapa simulado — reemplazar por Google Maps / Leaflet cuando se conecte */}
                <div
                  className="mapa-preview"
                  onClick={() =>
                    setCoordenadas({
                      lat: coordenadas.lat + (Math.random() - 0.5) * 0.001,
                      lng: coordenadas.lng + (Math.random() - 0.5) * 0.001,
                    })
                  }
                >
                  <MapPin size={32} className="mapa-pin" />
                </div>

                <p className="mapa-hint">
                  <Info size={13} /> Arrastra el mapa para ubicar tu negocio con precisión.
                </p>

                <p className="mapa-coords">
                  Lat: {coordenadas.lat.toFixed(5)} · Lng: {coordenadas.lng.toFixed(5)}
                </p>
              </div>

              <div className="registro-card">
                <label className="registro-label">Galería del Negocio</label>
                <div className="galeria-grid">
                  <button type="button" className="galeria-principal">
                    <Camera size={26} />
                    <span>PRINCIPAL</span>
                  </button>
                  <button type="button" className="galeria-secundaria">
                    <Image size={20} />
                  </button>
                  <button type="button" className="galeria-secundaria">
                    <Image size={20} />
                  </button>
                </div>
                <p className="galeria-hint">Sube fotos reales de tu local para generar confianza en los usuarios.</p>
              </div>

              <div className="consejo-card">
                <span className="consejo-card__title">
                  <MapPin size={14} /> Consejo de Oro
                </span>
                <p>
                  Los negocios con más de 3 fotos y horarios precisos reciben un 40% más de visitas en ExploraChiapas.
                </p>
              </div>
            </div>

            <div className="registro-submit">
              <button type="submit" className="btn-continuar">Continuar Registro</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}