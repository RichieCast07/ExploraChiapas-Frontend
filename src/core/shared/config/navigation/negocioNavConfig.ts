// shared/config/navigation/negocioNavConfig.ts
import {
  Home,
  LayoutDashboard,
  Tag,
  Star,
  Store,
  User,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import { NavConfig } from '../types/NavItem';

export const negocioNavConfig: NavConfig = {
  main: [
    {
      items: [
        { label: 'Inicio', icon: Home, path: '/negocio/inicio' },
        { label: 'Dashboard', icon: LayoutDashboard, path: '/negocio/dashboard' },
        { label: 'Promociones', icon: Tag, path: '/negocio/promociones' },
        { label: 'Reseñas', icon: Star, path: '/negocio/reseñas' },
        { label: 'Registrar Negocio', icon: Store, path: '/negocio/registrar' },
        { label: 'Perfil', icon: User, path: '/negocio/perfil' },
      ],
    },
  ],
  bottom: [
    { label: 'Support', icon: HelpCircle, path: '/negocio/soporte' },
    { label: 'Logout', icon: LogOut, path: '/logout', isDanger: true },
  ],
};