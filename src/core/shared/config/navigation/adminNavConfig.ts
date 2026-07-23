import {
  Ban,
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  Compass,
  LayoutDashboard,
  LogOut,
  MapPin,
  Users,
} from 'lucide-react';

import type {
  NavConfig,
} from '../types/NavItem';

export const adminNavConfig: NavConfig = {
  main: [
    {
      items: [
        {
          label: 'Dashboard',
          icon: LayoutDashboard,
          path: '/admin/dashboard',
        },

        {
          label: 'Gestión de Usuarios',
          icon: Users,
          path: '/admin/usuarios',
        },
      ],
    },

    {
      title: 'GESTIÓN TURÍSTICA',

      items: [
        {
          label: 'Destinos',
          icon: Compass,
          path: '/admin/destinos',
        },

        {
          label: 'Recomendaciones',
          icon: MapPin,
          path: '/admin/recomendaciones',
        },

        {
          label: 'Negocios',
          icon: BriefcaseBusiness,
          path: '/admin/negocios',
        },
      ],
    },

    {
      title: 'OPERACIONES',

      items: [
        {
          label: 'Gestión de Eventos',
          icon: CalendarDays,
          path: '/admin/eventos',
        },

        {
          label: 'Alertas y Moderación',
          icon: Ban,
          path: '/admin/moderacion',
        },

        {
          label:
            'Analítica e Inteligencia Turística',

          icon: BarChart3,
          path: '/admin/analitica',
        },
      ],
    },
  ],

  bottom: [
    {
      label: 'Cerrar Sesión',
      icon: LogOut,
      path: '/logout',
      isDanger: true,
    },
  ],
};
