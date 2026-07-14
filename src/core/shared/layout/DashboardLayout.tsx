// shared/components/layout/DashboardLayout.tsx
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { adminNavConfig } from '../../shared/config/navigation/adminNavConfig';
import { negocioNavConfig } from '../../shared/config/navigation/negocioNavConfig';
import { logout } from '../utils/auth';

type Role = 'sistema_administrador' | 'negocio_turistico';

interface DashboardLayoutProps {
  role: Role;
}

export function DashboardLayout({ role }: DashboardLayoutProps) {
  const navConfig = role === 'sistema_administrador' ? adminNavConfig : negocioNavConfig;

  return (
    <div className="flex">
      <Sidebar config={navConfig} onLogout={logout} />
      <main className="flex-1 bg-white min-h-screen overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}