// shared/types/NavItem.ts
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  icon: LucideIcon;
  path: string;
  isDanger?: boolean; // para "Cerrar Sesión" en rojo
}

export interface NavSection {
  title?: string; // ej. "GESTIÓN TURÍSTICA", opcional
  items: NavItem[];
}

export interface NavConfig {
  main: NavSection[];      // opciones del medio
  bottom: NavItem[];       // Configuración / Cerrar sesión, Support / Logout
}