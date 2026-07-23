import {
  BadgeCheck,
  Crown,
  House,
  LayoutDashboard,
  LogOut,
  Star,
  Store,
  Tag,
} from 'lucide-react';

import type {
  NavConfig,
} from '../types/NavItem';

export const negocioNavConfig: NavConfig = {
  main: [
    {
      items: [
        {
          label: 'Inicio',
          icon: House,
          path: '/negocio/inicio',
        },
        {
          label: 'Dashboard',
          icon: LayoutDashboard,
          path: '/negocio/dashboard',
        },
        {
          label: 'Promociones',
          icon: Tag,
          path: '/negocio/promociones',
        },
        {
          label: 'Reseñas',
          icon: Star,
          path: '/negocio/resenas',
        },
        {
          label: 'Negocios',
          icon: Store,
          path: '/negocio/negocios',
        },
        {
          label: 'Inteligencia Premium',
          icon: Crown,
          path: '/negocio/inteligencia',
        },
        {
          label: 'Suscripción',
          icon: BadgeCheck,
          path: '/negocio/suscripcion',
        },
      ],
    },
  ],
  bottom: [
    {
      label: 'Cerrar sesión',
      icon: LogOut,
      path: '/logout',
      isDanger: true,
    },
  ],
};
