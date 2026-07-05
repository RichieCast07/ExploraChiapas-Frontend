// RoutesComponent.tsx
import { Routes, Route } from 'react-router-dom';
import LoginPage from './features/Auth/presentation/pages/Login/Login';
import RegisterPage from './features/Auth/presentation/pages/Register/Register';
import { NegocioHomePage } from './features/NegocioTuristico/Home/presentation/pages/NegocioHomePage';
import { PromocionesPage } from './features/NegocioTuristico/Promociones/presentation/pages/PromocionesPage';
import { FormularioPromociones } from './features/NegocioTuristico/Promociones/presentation/pages/FormularioPromociones';
import { ReseñasPage } from './features/NegocioTuristico/Reseñas/presentation/pages/Reseñas';

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      <Route path="/negocio/inicio" element={<NegocioHomePage />} />
      <Route path="/negocio/promociones" element={<PromocionesPage />} />
      <Route path="/negocio/promociones/nueva" element={<FormularioPromociones />} />
      <Route path="/negocio/resenas" element={<ReseñasPage />} />
    </Routes>
  );
};

export default RoutesComponent;