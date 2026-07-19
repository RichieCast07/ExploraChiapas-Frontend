import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../../../../core/shared/layout/Sidebar';
import { adminNavConfig } from '../../../../../core/shared/config/navigation/adminNavConfig';
import { Search, Bell, Info, Map, ChevronRight, ImagePlus } from 'lucide-react';
import { logout, fetchAuth } from '../../../../../core/shared/utils/auth';
import { BASE_URL } from '../../../../../core/shared/config/api';
import './Eventos.css';

const usuario = { nombre: localStorage.getItem('user_name') ?? 'Admin', rol: 'SUPER ADMINISTRADOR' };

const categorias = ['Cultural', 'Gastronómico', 'Deportivo', 'Religioso', 'Artesanal'];
const municipios = ['San Cristóbal de las Casas', 'Tuxtla Gutiérrez', 'Palenque', 'Comitán', 'Chiapa de Corzo'];

export function Eventos() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagen(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!titulo.trim()) { setError('El título es obligatorio.'); return; }
    if (!fechaInicio) { setError('La fecha de inicio es obligatoria.'); return; }

    const fechaInicioISO = horaInicio
      ? `${fechaInicio}T${horaInicio}:00`
      : `${fechaInicio}T00:00:00`;

    const fechaFinISO = fechaFin
      ? (horaFin ? `${fechaFin}T${horaFin}:00` : `${fechaFin}T23:59:00`)
      : null;

    setIsLoading(true);
    try {
      const res = await fetchAuth(`${BASE_URL}/events`, {
        method: 'POST',
        body: JSON.stringify({
          titulo: titulo.trim(),
          descripcion: descripcion.trim() || null,
          fechaInicio: fechaInicioISO,
          fechaFin: fechaFinISO,
        }),
      });

      const body = await res.json() as { success: boolean; data?: { id: string }; message?: string };

      if (!res.ok || !body.success) {
        throw new Error(body.message ?? 'No se pudo crear el evento');
      }

      const eventoId = body.data?.id;

      if (imagen && eventoId) {
        const formData = new FormData();
        formData.append('imagen', imagen);
        await fetchAuth(`${BASE_URL}/uploads/eventos/${eventoId}`, {
          method: 'POST',
          body: formData,
        });
      }

      navigate('/admin/eventos');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="evento-layout">
      <Sidebar config={adminNavConfig} onLogout={logout} />

      <div className="evento-layout__main">
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

        <main className="evento-content">
          <div className="evento-breadcrumb">
            <span>Panel Administrativo</span>
            <ChevronRight size={14} />
            <span>Eventos</span>
            <ChevronRight size={14} />
            <span className="active">Nuevo Evento</span>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '12px 16px', marginBottom: 16, color: '#b91c1c' }}>
              {error}
            </div>
          )}

          <form onSubmit={(e) => { void handleSubmit(e); }}>
            <div className="evento-card">
              <div className="evento-card__header">
                <Info size={18} />
                <span>Información General</span>
              </div>

              <div className="evento-card__body">
                <div className="form-group">
                  <label>Nombre del evento *</label>
                  <input
                    type="text"
                    placeholder="Ej. Festival del Café en San Cristóbal"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Descripción</label>
                  <textarea
                    rows={4}
                    placeholder="Describe los aspectos más relevantes del evento para los visitantes..."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="evento-card">
              <div className="evento-card__header">
                <Map size={18} />
                <span>Logística y Fechas</span>
              </div>

              <div className="evento-card__body">
                <div className="form-row form-row--2">
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
                    <label>Categoría</label>
                    <select>
                      <option value="">Selecciona una categoría</option>
                      {categorias.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row form-row--2">
                  <div className="form-group">
                    <label>Fecha de inicio *</label>
                    <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Hora de inicio</label>
                    <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
                  </div>
                </div>

                <div className="form-row form-row--2">
                  <div className="form-group">
                    <label>Fecha de fin</label>
                    <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Hora de fin</label>
                    <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

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

            <div className="evento-actions">
              <button type="button" className="btn-cancel" onClick={() => navigate('/admin/eventos')} disabled={isLoading}>
                Cancelar
              </button>
              <button type="submit" className="btn-save" disabled={isLoading}>
                {isLoading ? 'Guardando...' : 'Guardar Evento'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
