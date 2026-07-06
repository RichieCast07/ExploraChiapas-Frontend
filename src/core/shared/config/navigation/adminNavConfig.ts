// shared/config/navigation/adminNavConfig.ts
import {
  LayoutDashboard,
  Users,
  Compass,
  Briefcase,
  Calendar,
  Ban,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import { NavConfig } from '../types/NavItem';

export const adminNavConfig: NavConfig = {
  main: [
    {
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { label: 'Gestión de Usuarios', icon: Users, path: '/admin/usuarios' },
      ],
    },
    {
      title: 'GESTIÓN TURÍSTICA',
      items: [
        { label: 'Destinos', icon: Compass, path: '/admin/destinos' },
        { label: 'Negocios', icon: Briefcase, path: '/admin/negocios' },
      ],
    },
    {
      title: 'OPERACIONES',
      items: [
        { label: 'Gestión de Eventos', icon: Calendar, path: '/admin/eventos' },
        { label: 'Moderación', icon: Ban, path: '/admin/moderacion' },
        { label: 'Comentarios Reseñas', icon: BarChart3, path: '/admin/resenas' },
        { label: 'Analítica e Inteligencia Turística', icon: BarChart3, path: '/admin/analitica' },
      ],
    },
  ],
  bottom: [
    { label: 'Configuración', icon: Settings, path: '/admin/configuracion' },
    { label: 'Cerrar Sesión', icon: LogOut, path: '/logout', isDanger: true },
  ],
};