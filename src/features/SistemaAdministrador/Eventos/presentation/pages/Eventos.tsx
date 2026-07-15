
// features/SistemaAdministrador/Eventos/presentation/pages/Eventos.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../../../../core/shared/layout/Sidebar';
import { adminNavConfig } from '../../../../../core/shared/config/navigation/adminNavConfig';
import { Search, Bell, Info, Map, ChevronRight, ImagePlus } from 'lucide-react';
import './Eventos.css';

const usuario = { nombre: 'Admin Explora', rol: 'SUPER ADMINISTRADOR' };

const categorias = ['Cultural', 'Gastronómico', 'Deportivo', 'Religioso', 'Artesanal'];
const municipios = ['San Cristóbal de las Casas', 'Tuxtla Gutiérrez', 'Palenque', 'Comitán', 'Chiapa de Corzo'];

export function Eventos() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [fecha, setFecha] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagen(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ nombre, categoria, descripcion, municipio, fecha, capacidad, horaInicio, horaFin, imagen });
    navigate('/admin/eventos');
  };

  return (
    <div className="evento-layout">
      <Sidebar config={adminNavConfig} onLogout={() => console.log('logout')} />

      <div className="evento-layout__main">
        {/* Header */}
        <header className="evento-header">
          <div className="evento-header__search">
            <Search size={18} color="#9ca3af" />
            <input type="text" placeholder="Buscar destinos, negocios o usuarios..." />
          </div>
          <div className="evento-header__right">
            <button className="evento-header__bell">
              <Bell size={20} />
            </button>
            <div className="evento-header__user">
              <div className="evento-header__user-info">
                <span className="evento-header__user-name">{usuario.nombre}</span>
                <span className="evento-header__user-role">{usuario.rol}</span>
              </div>
              <div className="evento-header__avatar">{usuario.nombre.charAt(0)}</div>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="evento-content">
          <div className="evento-breadcrumb">
            <span>Panel Administrativo</span>
            <ChevronRight size={14} />
            <span>Eventos</span>
            <ChevronRight size={14} />
            <span className="active">Nuevo Evento</span>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Información General */}
            <div className="evento-card">
              <div className="evento-card__header">
                <Info size={18} />
                <span>Información General</span>
              </div>

              <div className="evento-card__body">
                <div className="form-group">
                  <label>Nombre del evento</label>
                  <input
                    type="text"
                    placeholder="Ej. Festival del Café en San Cristóbal"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Categoría</label>
                  <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                    <option value="">Selecciona una categoría</option>
                    {categorias.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Descripción detallada</label>
                  <textarea
                    rows={4}
                    placeholder="Describe los aspectos más relevantes del evento para los visitantes..."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Logística y Ubicación */}
            <div className="evento-card">
              <div className="evento-card__header">
                <Map size={18} />
                <span>Logística y Ubicación</span>
              </div>

              <div className="evento-card__body">
                <div className="form-row form-row--3">
                  <div className="form-group">
                    <label>Municipio</label>
                    <select value={municipio} onChange={(e) => setMunicipio(e.target.value)}>
                      <option value="">Selecciona municipio</option>
                      {municipios.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Fecha del evento</label>
                    <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                  </div>

                  <div className="form-group">
                    <label>Capacidad máxima</label>
                    <input
                      type="number"
                      placeholder="Ej. 100"
                      value={capacidad}
                      onChange={(e) => setCapacidad(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row form-row--2">
                  <div className="form-group">
                    <label>Hora de inicio</label>
                    <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Hora de fin</label>
                    <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Imagen del evento */}
            <div className="evento-card">
              <div className="evento-card__header">
                <ImagePlus size={18} />
                <span>Imagen del Evento</span>
              </div>

              <div className="evento-card__body">
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

            {/* Acciones */}
            <div className="evento-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate('/admin/eventos')}>
                Cancelar
              </button>
              <button type="submit" className="btn-save">
                Guardar Evento
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}