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

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      <Route path="/negocio/inicio" element={<ProtectedRoute allowedRoles={['admin_negocio']}><NegocioHomePage /></ProtectedRoute>} />
      <Route path="/negocio/promociones" element={<ProtectedRoute allowedRoles={['admin_negocio']}><PromocionesPage /></ProtectedRoute>} />
      <Route path="/negocio/promociones/nueva" element={<ProtectedRoute allowedRoles={['admin_negocio']}><NuevaPromocionPage /></ProtectedRoute>} />
      <Route path="/negocio/reseñas" element={<ProtectedRoute allowedRoles={['admin_negocio']}><ReseñasPage /></ProtectedRoute>} />
      <Route path="/negocio/suscripcion/exito" element={<SuscripcionExito />} />
      <Route path="/negocio/suscripcion/cancelado" element={<SuscripcionCancelado />} />

      <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin_plataforma']}><AdminHomePage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default RoutesComponent;
