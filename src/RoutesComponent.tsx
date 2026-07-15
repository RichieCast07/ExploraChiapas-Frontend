import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/Auth/presentation/pages/Login/Login';
import RegisterPage from './features/Auth/presentation/pages/Register/Register';
import { ProtectedRoute } from './core/shared/components/ProtectedRoute';

import { NegocioHomePage } from './features/NegocioTuristico/Home/presentation/pages/NegocioHomePage';
import { NegocioDashboardPage } from './features/NegocioTuristico/Dashboard/presentation/pages/NegocioDashboardPage';
import { PromocionesPage } from './features/NegocioTuristico/Promociones/presentation/pages/PromocionesPage';
import { NuevaPromocionPage } from './features/NegocioTuristico/Promociones/presentation/pages/FormularioPromociones';
import { ReseñasPage } from './features/NegocioTuristico/Reseñas/presentation/pages/Reseñas';
import { RegistroNegocio } from './features/NegocioTuristico/RegistroNegocio/presentation/pages/RegistroNegocio';
import { NegocioPerfilPage } from './features/NegocioTuristico/Perfil/presentation/pages/NegocioPerfilPage';
import { SuscripcionExito } from './features/NegocioTuristico/Suscripcion/presentation/pages/SuscripcionExito';
import { SuscripcionCancelado } from './features/NegocioTuristico/Suscripcion/presentation/pages/SuscripcionCancelado';

import { AdminHomePage } from './features/SistemaAdministrador/Home/presentation/pages/AdminHome';
import { AdminUsersPage } from './features/SistemaAdministrador/Usuarios/presentation/pages/AdminUsersPage';
import { AdminDestinosPage } from './features/SistemaAdministrador/Destinos/presentation/pages/AdminDestinosPage';
import { AdminNegociosPage } from './features/SistemaAdministrador/Negocios/presentation/pages/AdminNegociosPage';
import { HomeEventos } from './features/SistemaAdministrador/Eventos/presentation/pages/HomeEventos';
import { Eventos } from './features/SistemaAdministrador/Eventos/presentation/pages/Eventos';
import { AdminModeracionPage } from './features/SistemaAdministrador/Moderacion/presentation/pages/AdminModeracionPage';
import { AdminResenasPage } from './features/SistemaAdministrador/Resenas/presentation/pages/AdminResenasPage';
import { AdminAnaliticaPage } from './features/SistemaAdministrador/Analitica/presentation/pages/AdminAnaliticaPage';
import { AdminConfiguracionPage } from './features/SistemaAdministrador/Configuracion/presentation/pages/AdminConfiguracionPage';

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      {/* admin_negocio */}
      <Route path="/negocio/inicio" element={<ProtectedRoute allowedRoles={['admin_negocio']}><NegocioHomePage /></ProtectedRoute>} />
      <Route path="/negocio/dashboard" element={<ProtectedRoute allowedRoles={['admin_negocio']}><NegocioDashboardPage /></ProtectedRoute>} />
      <Route path="/negocio/promociones" element={<ProtectedRoute allowedRoles={['admin_negocio']}><PromocionesPage /></ProtectedRoute>} />
      <Route path="/negocio/promociones/nueva" element={<ProtectedRoute allowedRoles={['admin_negocio']}><NuevaPromocionPage /></ProtectedRoute>} />
      <Route path="/negocio/reseñas" element={<ProtectedRoute allowedRoles={['admin_negocio']}><ReseñasPage /></ProtectedRoute>} />
      <Route path="/negocio/registrar" element={<ProtectedRoute allowedRoles={['admin_negocio']}><RegistroNegocio /></ProtectedRoute>} />
      <Route path="/negocio/perfil" element={<ProtectedRoute allowedRoles={['admin_negocio']}><NegocioPerfilPage /></ProtectedRoute>} />
      <Route path="/negocio/suscripcion/exito" element={<SuscripcionExito />} />
      <Route path="/negocio/suscripcion/cancelado" element={<SuscripcionCancelado />} />

      {/* admin_plataforma */}
      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin_plataforma']}><AdminHomePage /></ProtectedRoute>} />
      <Route path="/admin/usuarios" element={<ProtectedRoute allowedRoles={['admin_plataforma']}><AdminUsersPage /></ProtectedRoute>} />
      <Route path="/admin/destinos" element={<ProtectedRoute allowedRoles={['admin_plataforma']}><AdminDestinosPage /></ProtectedRoute>} />
      <Route path="/admin/negocios" element={<ProtectedRoute allowedRoles={['admin_plataforma']}><AdminNegociosPage /></ProtectedRoute>} />
      <Route path="/admin/eventos" element={<ProtectedRoute allowedRoles={['admin_plataforma']}><HomeEventos /></ProtectedRoute>} />
      <Route path="/admin/eventos/nuevo" element={<ProtectedRoute allowedRoles={['admin_plataforma']}><Eventos /></ProtectedRoute>} />
      <Route path="/admin/moderacion" element={<ProtectedRoute allowedRoles={['admin_plataforma']}><AdminModeracionPage /></ProtectedRoute>} />
      <Route path="/admin/resenas" element={<ProtectedRoute allowedRoles={['admin_plataforma']}><AdminResenasPage /></ProtectedRoute>} />
      <Route path="/admin/analitica" element={<ProtectedRoute allowedRoles={['admin_plataforma']}><AdminAnaliticaPage /></ProtectedRoute>} />
      <Route path="/admin/configuracion" element={<ProtectedRoute allowedRoles={['admin_plataforma']}><AdminConfiguracionPage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default RoutesComponent;
