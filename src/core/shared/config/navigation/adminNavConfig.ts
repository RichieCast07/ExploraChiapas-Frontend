import {
  BarChart3,
  Ban,
  BriefcaseBusiness,
  CalendarDays,
  Compass,
  FolderTree,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Settings,
  UserRoundCog,
  Users,
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
        { label: 'Negocios', icon: BriefcaseBusiness, path: '/admin/negocios' },
        { label: 'Categorías', icon: FolderTree, path: '/admin/categorias' },
      ],
    },
    {
      title: 'OPERACIONES',
      items: [
        { label: 'Gestión de Eventos', icon: CalendarDays, path: '/admin/eventos' },
        { label: 'Moderación', icon: Ban, path: '/admin/moderacion' },
        { label: 'Comentarios Reseñas', icon: MessageSquareText, path: '/admin/resenas' },
        { label: 'Analítica e Inteligencia Turística', icon: BarChart3, path: '/admin/analitica' },
      ],
    },
  ],
  bottom: [
    { label: 'Perfil', icon: UserRoundCog, path: '/admin/perfil' },
    { label: 'Configuración', icon: Settings, path: '/admin/configuracion' },
    { label: 'Cerrar Sesión', icon: LogOut, path: '/logout', isDanger: true },
  ],
};
