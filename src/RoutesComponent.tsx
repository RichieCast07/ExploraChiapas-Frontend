import { Navigate, Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from './core/shared/components/ProtectedRoute';

import LoginPage from './features/Auth/presentation/pages/Login/Login';
import RegisterPage from './features/Auth/presentation/pages/Register/Register';

import { NegocioDashboardPage } from './features/NegocioTuristico/Dashboard/presentation/pages/NegocioDashboardPage';
import { NegocioHomePage } from './features/NegocioTuristico/Home/presentation/pages/NegocioHomePage';
import { BusinessProfilePage } from './features/NegocioTuristico/Perfil/presentation/pages/BusinessProfilePage';
import { NegocioPerfilPage } from './features/NegocioTuristico/Perfil/presentation/pages/NegocioPerfilPage';
import { NuevaPromocionPage } from './features/NegocioTuristico/Promociones/presentation/pages/FormularioPromociones';
import { PromocionesPage } from './features/NegocioTuristico/Promociones/presentation/pages/PromocionesPage';
import { RegistroNegocio } from './features/NegocioTuristico/RegistroNegocio/presentation/pages/RegistroNegocio';
import { ReseñasPage } from './features/NegocioTuristico/Reseñas/presentation/pages/Reseñas';
import { SuscripcionCancelado } from './features/NegocioTuristico/Suscripcion/presentation/pages/SuscripcionCancelado';
import { SuscripcionExito } from './features/NegocioTuristico/Suscripcion/presentation/pages/SuscripcionExito';
import { SuscripcionPage } from './features/NegocioTuristico/Suscripcion/presentation/pages/SuscripcionPage';

import { AdminAnaliticaPage } from './features/SistemaAdministrador/Analitica/presentation/pages/AdminAnaliticaPage';
import { AdminDestinosPage } from './features/SistemaAdministrador/Destinos/presentation/pages/AdminDestinosPage';
import { Eventos } from './features/SistemaAdministrador/Eventos/presentation/pages/Eventos';
import { HomeEventos } from './features/SistemaAdministrador/Eventos/presentation/pages/HomeEventos';
import { AdminHomePage } from './features/SistemaAdministrador/Home/presentation/pages/AdminHome';
import { AdminModeracionPage } from './features/SistemaAdministrador/Moderacion/presentation/pages/AdminModeracionPage';
import { AdminNegociosPage } from './features/SistemaAdministrador/Negocios/presentation/pages/AdminNegociosPage';
import { AdminUsersPage } from './features/SistemaAdministrador/Usuarios/presentation/pages/AdminUsersPage';

export default function RoutesComponent() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      {/* admin_negocio */}
      <Route
        path="/negocio/inicio"
        element={
          <ProtectedRoute allowedRoles={['admin_negocio']}>
            <NegocioHomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/negocio/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin_negocio']}>
            <NegocioDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/negocio/promociones"
        element={
          <ProtectedRoute allowedRoles={['admin_negocio']}>
            <PromocionesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/negocio/promociones/nueva"
        element={
          <ProtectedRoute allowedRoles={['admin_negocio']}>
            <NuevaPromocionPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/negocio/resenas"
        element={
          <ProtectedRoute allowedRoles={['admin_negocio']}>
            <ReseñasPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/negocio/reseñas"
        element={<Navigate to="/negocio/resenas" replace />}
      />

      <Route
        path="/negocio/registrar"
        element={
          <ProtectedRoute allowedRoles={['admin_negocio']}>
            <RegistroNegocio />
          </ProtectedRoute>
        }
      />

      <Route
        path="/negocio/perfil"
        element={
          <ProtectedRoute allowedRoles={['admin_negocio']}>
            <BusinessProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/negocio/cuenta"
        element={
          <ProtectedRoute allowedRoles={['admin_negocio']}>
            <NegocioPerfilPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/negocio/suscripcion"
        element={
          <ProtectedRoute allowedRoles={['admin_negocio']}>
            <SuscripcionPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/negocio/suscripcion/exito"
        element={<SuscripcionExito />}
      />

      <Route
        path="/negocio/suscripcion/cancelado"
        element={<SuscripcionCancelado />}
      />

      {/* admin_plataforma */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin_plataforma']}>
            <AdminHomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/usuarios"
        element={
          <ProtectedRoute allowedRoles={['admin_plataforma']}>
            <AdminUsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/destinos"
        element={
          <ProtectedRoute allowedRoles={['admin_plataforma']}>
            <AdminDestinosPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/negocios"
        element={
          <ProtectedRoute allowedRoles={['admin_plataforma']}>
            <AdminNegociosPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/eventos"
        element={
          <ProtectedRoute allowedRoles={['admin_plataforma']}>
            <HomeEventos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/eventos/nuevo"
        element={
          <ProtectedRoute allowedRoles={['admin_plataforma']}>
            <Eventos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/moderacion"
        element={
          <ProtectedRoute allowedRoles={['admin_plataforma']}>
            <AdminModeracionPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/analitica"
        element={
          <ProtectedRoute allowedRoles={['admin_plataforma']}>
            <AdminAnaliticaPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
