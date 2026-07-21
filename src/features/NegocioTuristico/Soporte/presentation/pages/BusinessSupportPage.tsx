import { BookOpen, CircleHelp, Mail, MessageCircle, Phone, Send } from 'lucide-react';
import { FormEvent, useState } from 'react';

import { apiRequest } from '../../../../../core/shared/api/apiClient';
import { PanelShell } from '../../../../../core/shared/layout/PanelShell';
import './BusinessSupportPage.css';

export function BusinessSupportPage() {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSending(true);
    setMessage(null);
    setError(null);
    try {
      await apiRequest('/alerts', {
        method: 'POST',
        body: JSON.stringify({
          typeName: 'soporte_tecnico',
          description: `${subject.trim()}: ${description.trim()}`,
          scopeName: 'plataforma',
        }),
      });
      setSubject('');
      setDescription('');
      setMessage('Solicitud enviada. El administrador podrá atenderla desde Moderación.');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'No se pudo enviar la solicitud');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <PanelShell kind="business">
      <div className="ec-page business-support-page">
        <div className="ec-page-header"><div><h1 className="ec-page-title">Centro de Soporte</h1><p className="ec-page-subtitle">Registra una incidencia y envíala al panel de moderación de ExploraChiapas.</p></div></div>
        {message && <div className="ec-note">{message}</div>}
        {error && <div className="ec-note" style={{ borderColor: '#ef4444', color: '#991b1b' }}>{error}</div>}
        <section className="business-support-grid"><article className="ec-card"><span className="ec-stat-card__icon"><MessageCircle size={20}/></span><h2>Solicitud en plataforma</h2><p>La incidencia queda registrada en MariaDB para seguimiento administrativo.</p></article><article className="ec-card"><span className="ec-stat-card__icon ec-stat-card__icon--blue"><Mail size={20}/></span><h2>Correo electrónico</h2><p>soporte@explorachiapas.com</p></article><article className="ec-card"><span className="ec-stat-card__icon ec-stat-card__icon--orange"><Phone size={20}/></span><h2>Atención telefónica</h2><p>Lunes a viernes, de 9:00 a 18:00 horas.</p></article></section>

        <form className="ec-card ec-card__body ec-form-grid" onSubmit={submit}>
          <div className="ec-field ec-field--full"><label>Asunto</label><input className="ec-input" minLength={3} maxLength={120} required value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Ej. Problema al actualizar mi negocio" /></div>
          <div className="ec-field ec-field--full"><label>Descripción</label><textarea className="ec-textarea" minLength={10} maxLength={1000} required value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe el problema y los pasos para reproducirlo." /></div>
          <button className="ec-button ec-button--primary" type="submit" disabled={isSending}><Send size={16}/>{isSending ? 'Enviando…' : 'Enviar solicitud'}</button>
        </form>

        <section className="ec-card"><div className="ec-card__header"><h2><BookOpen size={17}/> Preguntas frecuentes</h2></div><div className="ec-card__body support-faq">{['¿Cómo actualizo los horarios y servicios de mi negocio?','¿Cómo creo una promoción?','¿Por qué mi perfil aparece en revisión?','¿Cómo respondo una reseña?'].map((question)=><details key={question}><summary>{question}<CircleHelp size={15}/></summary><p>Accede al módulo correspondiente desde el menú lateral. Los cambios se guardan mediante la API y los negocios nuevos requieren aprobación administrativa.</p></details>)}</div></section>
      </div>
    </PanelShell>
  );
}
