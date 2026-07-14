import { Navigate, Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from './core/shared/components/ProtectedRoute';
import { getToken, getUserRole } from './core/shared/utils/auth';
import LoginPage from './features/Auth/presentation/pages/Login/Login';
import { BusinessDashboardPage } from './features/NegocioTuristico/Dashboard/presentation/pages/BusinessDashboardPage';
import { NegocioHomePage } from './features/NegocioTuristico/Home/presentation/pages/NegocioHomePage';
import { BusinessProfilePage } from './features/NegocioTuristico/Perfil/presentation/pages/BusinessProfilePage';
import { NuevaPromocionPage } from './features/NegocioTuristico/Promociones/presentation/pages/FormularioPromociones';
import { PromocionesPage } from './features/NegocioTuristico/Promociones/presentation/pages/PromocionesPage';
import { RegistroNegocio } from './features/NegocioTuristico/RegistroNegocio/presentation/pages/RegistroNegocio';
import { BusinessReviewsPage } from './features/NegocioTuristico/Resenas/presentation/pages/BusinessReviewsPage';
import { BusinessSupportPage } from './features/NegocioTuristico/Soporte/presentation/pages/BusinessSupportPage';
import { AdminAnalyticsPage } from './features/SistemaAdministrador/Analitica/presentation/pages/AdminAnalyticsPage';
import { AdminIntelligenceProPage } from './features/SistemaAdministrador/Analitica/presentation/pages/AdminIntelligenceProPage';
import { Eventos } from './features/SistemaAdministrador/Eventos/presentation/pages/Eventos';
import { HomeEventos } from './features/SistemaAdministrador/Eventos/presentation/pages/HomeEventos';
import {
  AdminCategoriesPage,
  AdminDestinationsPage,
  AdminReviewsPage,
  AdminSettingsPage,
} from './features/SistemaAdministrador/General/presentation/pages/AdminGeneralPages';
import { AdminHomePage } from './features/SistemaAdministrador/Home/presentation/pages/AdminHome';
import { AdminModerationPage } from './features/SistemaAdministrador/Moderacion/presentation/pages/AdminModerationPage';
import { BusinessRequestsPage } from './features/SistemaAdministrador/Negocios/presentation/pages/BusinessRequestsPage';
import { AdminProfilePage } from './features/SistemaAdministrador/Perfil/presentation/pages/AdminProfilePage';
import { AdminUsersPage } from './features/SistemaAdministrador/Usuarios/presentation/pages/AdminUsersPage';

function RootRedirect() {
  if (!getToken()) return <Navigate to="/login" replace />;
  const role = getUserRole();
  if (role === 'admin_plataforma') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'admin_negocio') return <Navigate to="/negocio/inicio" replace />;
  return <Navigate to="/login" replace />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={['admin_plataforma']}>{children}</ProtectedRoute>;
}

function BusinessRoute({ children }: { children: React.ReactNode }) {
  return <ProtectedRoute allowedRoles={['admin_negocio']}>{children}</ProtectedRoute>;
}

export default function RoutesComponent() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<Navigate to="/login" replace />} />

      <Route path="/admin/dashboard" element={<AdminRoute><AdminHomePage /></AdminRoute>} />
      <Route path="/admin/usuarios" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
      <Route path="/admin/destinos" element={<AdminRoute><AdminDestinationsPage /></AdminRoute>} />
      <Route path="/admin/negocios" element={<AdminRoute><BusinessRequestsPage /></AdminRoute>} />
      <Route path="/admin/negocios/solicitudes" element={<AdminRoute><BusinessRequestsPage /></AdminRoute>} />
      <Route path="/admin/categorias" element={<AdminRoute><AdminCategoriesPage /></AdminRoute>} />
      <Route path="/admin/eventos" element={<AdminRoute><HomeEventos /></AdminRoute>} />
      <Route path="/admin/eventos/nuevo" element={<AdminRoute><Eventos /></AdminRoute>} />
      <Route path="/admin/moderacion" element={<AdminRoute><AdminModerationPage /></AdminRoute>} />
      <Route path="/admin/resenas" element={<AdminRoute><AdminReviewsPage /></AdminRoute>} />
      <Route path="/admin/analitica" element={<AdminRoute><AdminAnalyticsPage /></AdminRoute>} />
      <Route path="/admin/analitica/pro" element={<AdminRoute><AdminIntelligenceProPage /></AdminRoute>} />
      <Route path="/admin/perfil" element={<AdminRoute><AdminProfilePage /></AdminRoute>} />
      <Route path="/admin/configuracion" element={<AdminRoute><AdminSettingsPage /></AdminRoute>} />

      <Route path="/negocio/inicio" element={<BusinessRoute><NegocioHomePage /></BusinessRoute>} />
      <Route path="/negocio/dashboard" element={<BusinessRoute><BusinessDashboardPage /></BusinessRoute>} />
      <Route path="/negocio/promociones" element={<BusinessRoute><PromocionesPage /></BusinessRoute>} />
      <Route path="/negocio/promociones/nueva" element={<BusinessRoute><NuevaPromocionPage /></BusinessRoute>} />
      <Route path="/negocio/resenas" element={<BusinessRoute><BusinessReviewsPage /></BusinessRoute>} />
      <Route path="/negocio/registrar" element={<BusinessRoute><RegistroNegocio /></BusinessRoute>} />
      <Route path="/negocio/perfil" element={<BusinessRoute><BusinessProfilePage /></BusinessRoute>} />
      <Route path="/negocio/soporte" element={<BusinessRoute><BusinessSupportPage /></BusinessRoute>} />

      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}
