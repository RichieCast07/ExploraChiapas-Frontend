// RoutesComponent.tsx
import { Routes, Route } from 'react-router-dom';
import LoginPage from './features/Auth/presentation/pages/Login/Login';
import RegisterPage from './features/Auth/presentation/pages/Register/Register';
import { NegocioHomePage } from './features/NegocioTuristico/Home/presentation/pages/NegocioHomePage';
import { PromocionesPage } from './features/NegocioTuristico/Promociones/presentation/pages/PromocionesPage';
import { RegistroNegocio } from './features/NegocioTuristico/RegistroNegocio/presentation/pages/RegistroNegocio';
import { Eventos } from './features/SistemaAdministrador/Eventos/presentation/pages/Eventos';
import { HomeEventos } from './features/SistemaAdministrador/Eventos/presentation/pages/HomeEventos';

const RoutesComponent = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />

      <Route path="/negocio/inicio" element={<NegocioHomePage />} />
      <Route path="/negocio/promociones" element={<PromocionesPage />} />
      <Route path="/negocio/registrar" element={<RegistroNegocio />} />

      <Route path="/administrador/eventos" element={<HomeEventos />} />
      <Route path="/administrador/eventos/nuevo" element={<Eventos />} />
    </Routes>
  );
};

export default RoutesComponent;