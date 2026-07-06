import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/Auth/presentation/pages/Login/Login';
import RegisterPage from './features/Auth/presentation/pages/Register/Register';
import { NegocioHomePage } from './features/NegocioTuristico/Home/presentation/pages/NegocioHomePage';
import { PromocionesPage } from './features/NegocioTuristico/Promociones/presentation/pages/PromocionesPage';
import { NuevaPromocionPage } from './features/NegocioTuristico/Promociones/presentation/pages/FormularioPromociones';
import { AdminHomePage } from './features/SistemaAdministrador/Home/presentation/pages/AdminHome';
import { ProtectedRoute } from './core/shared/components/ProtectedRoute';

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      <Route path="/negocio/inicio" element={<ProtectedRoute><NegocioHomePage /></ProtectedRoute>} />
      <Route path="/negocio/promociones" element={<ProtectedRoute><PromocionesPage /></ProtectedRoute>} />
      <Route path="/negocio/promociones/nueva" element={<ProtectedRoute><NuevaPromocionPage /></ProtectedRoute>} />

      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminHomePage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default RoutesComponent;