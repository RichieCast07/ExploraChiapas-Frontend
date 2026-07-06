// shared/components/layout/DashboardLayout.tsx
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { adminNavConfig } from '../../shared/config/navigation/adminNavConfig';
import { negocioNavConfig } from '../../shared/config/navigation/negocioNavConfig';

type Role = 'sistema_administrador' | 'negocio_turistico';

interface DashboardLayoutProps {
  role: Role;
}

export function DashboardLayout({ role }: DashboardLayoutProps) {
  const navConfig = role === 'sistema_administrador' ? adminNavConfig : negocioNavConfig;

  const handleLogout = () => {
    console.log('Logout (mock, sin Auth conectado aún)');
  };

  return (
    <div className="flex">
      <Sidebar config={navConfig} onLogout={handleLogout} />
      <main className="flex-1 bg-white min-h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}