import { ChevronRight, ImagePlus, Megaphone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PanelShell } from '../../../../../core/shared/layout/PanelShell';
import { useNuevaPromocionViewModel } from '../viewmodels/useNuevaPromocionViewModel';
import './FormularioPromociones.css';

export function NuevaPromocionPage() {
  const navigate = useNavigate();
  const { titulo, setTitulo, precio, setPrecio, descripcion, setDescripcion, fechaInicio, setFechaInicio, fechaFin, setFechaFin, isLoadingBusiness, isLoading, error, publicar } = useNuevaPromocionViewModel();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState('');

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
    setImageName(file.name);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const created = await publicar();
    if (created) navigate('/negocio/promociones');
  };

  return (
    <PanelShell kind="business">
      <div className="ec-page new-promotion-page">
        <div className="ec-breadcrumb">SERVICIOS <ChevronRight size={13}/> NUEVA PROMOCIÓN</div>
        <div className="ec-page-header"><div><h1 className="ec-page-title">Configurar Nueva Promoción</h1><p className="ec-page-subtitle">Crea ofertas atractivas para atraer a más exploradores a tus tours y actividades.</p></div></div>
        {error && <div className="ec-alert">{error}</div>}
        <form className="ec-card new-promotion-form" onSubmit={handleSubmit}>
          <div className="ec-card__header new-promotion-heading"><h2><Megaphone size={17}/> DETALLES DEL INCENTIVO</h2></div>
          <div className="ec-card__body ec-form-grid">
            <div className="ec-field"><label>Título de la Promoción</label><input className="ec-input" value={titulo} onChange={(event)=>setTitulo(event.target.value)} placeholder="Ej: Especial de Verano en Cañón del Sumidero" required/></div>
            <div className="ec-field"><label>Porcentaje de Descuento</label><div className="promotion-percent-input"><input className="ec-input" type="number" min="0" max="100" value={precio} onChange={(event)=>setPrecio(event.target.value)} placeholder="15"/><span>%</span></div></div>
            <div className="ec-field ec-field--full"><label>Descripción de la Oferta</label><textarea className="ec-textarea" value={descripcion} onChange={(event)=>setDescripcion(event.target.value)} placeholder="Describe los beneficios y condiciones de esta promoción..."/></div>
            <div className="ec-field"><label>Fecha de Inicio</label><input className="ec-input" type="date" value={fechaInicio} onChange={(event)=>setFechaInicio(event.target.value)} required/></div>
            <div className="ec-field"><label>Fecha de Finalización</label><input className="ec-input" type="date" value={fechaFin} onChange={(event)=>setFechaFin(event.target.value)}/></div>
            <div className="ec-field ec-field--full"><label>Imagen Promocional</label><label className="promotion-upload"><input type="file" accept="image/png,image/jpeg" onChange={handleImageChange} hidden/>{previewUrl?<img src={previewUrl} alt="Vista previa de la promoción"/>:<><span><ImagePlus size={25}/></span><strong>Haz clic para subir o arrastra una imagen</strong><small>Recomendado: 1200×630px (Máx. 5MB, JPG/PNG)</small></>}{imageName && <em>{imageName}</em>}</label></div>
          </div>
          <footer className="new-promotion-actions"><button className="ec-button" type="button" onClick={()=>navigate('/negocio/promociones')}>Cancelar</button><button className="ec-button ec-button--primary" type="submit" disabled={isLoading || isLoadingBusiness}>{isLoading?'Publicando...':'Publicar Promoción'}</button></footer>
        </form>
      </div>
    </PanelShell>
  );
}

export const FormularioPromociones = NuevaPromocionPage;
