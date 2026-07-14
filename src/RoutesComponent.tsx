import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/Auth/presentation/pages/Login/Login';
import RegisterPage from './features/Auth/presentation/pages/Register/Register';
import { NegocioHomePage } from './features/NegocioTuristico/Home/presentation/pages/NegocioHomePage';
import { PromocionesPage } from './features/NegocioTuristico/Promociones/presentation/pages/PromocionesPage';
import { NuevaPromocionPage } from './features/NegocioTuristico/Promociones/presentation/pages/FormularioPromociones';
import { AdminHomePage } from './features/SistemaAdministrador/Home/presentation/pages/AdminHome';
import { ReseñasPage } from './features/NegocioTuristico/Reseñas/presentation/pages/Reseñas';
import { SuscripcionExito } from './features/NegocioTuristico/Suscripcion/presentation/pages/SuscripcionExito';
import { SuscripcionCancelado } from './features/NegocioTuristico/Suscripcion/presentation/pages/SuscripcionCancelado';
import { ProtectedRoute } from './core/shared/components/ProtectedRoute';

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

      <Route
        path="/negocio/promociones/nueva"
        element={
          <ProtectedRoute
            allowedRoles={["admin_negocio"]}
          >
            <NuevaPromocionPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute
            allowedRoles={["admin_plataforma"]}
          >
            <AdminHomePage />
          </ProtectedRoute>
        }
      />

      <Route path="/negocio/inicio" element={<ProtectedRoute><NegocioHomePage /></ProtectedRoute>} />
      <Route path="/negocio/promociones" element={<ProtectedRoute><PromocionesPage /></ProtectedRoute>} />
      <Route path="/negocio/promociones/nueva" element={<ProtectedRoute><NuevaPromocionPage /></ProtectedRoute>} />
      <Route path="/negocio/reseñas" element={<ProtectedRoute><ReseñasPage /></ProtectedRoute>} />
      <Route path="/negocio/suscripcion/exito" element={<SuscripcionExito />} />
      <Route path="/negocio/suscripcion/cancelado" element={<SuscripcionCancelado />} />

      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminHomePage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default RoutesComponent;
