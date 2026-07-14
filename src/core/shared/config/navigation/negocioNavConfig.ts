import {
  CircleHelp,
  House,
  LayoutDashboard,
  LogOut,
  Star,
  Store,
  Tag,
  UserRound,
} from 'lucide-react';
import { NavConfig } from '../types/NavItem';

export const negocioNavConfig: NavConfig = {
  main: [
    {
      items: [
        { label: 'Inicio', icon: House, path: '/negocio/inicio' },
        { label: 'Dashboard', icon: LayoutDashboard, path: '/negocio/dashboard' },
        { label: 'Promociones', icon: Tag, path: '/negocio/promociones' },
        { label: 'Reseñas', icon: Star, path: '/negocio/resenas' },
        { label: 'Registrar Negocio', icon: Store, path: '/negocio/registrar' },
        { label: 'Perfil', icon: UserRound, path: '/negocio/perfil' },
      ],
    },
  ],
  bottom: [
    { label: 'Soporte', icon: CircleHelp, path: '/negocio/soporte' },
    { label: 'Cerrar sesión', icon: LogOut, path: '/logout', isDanger: true },
  ],
};
