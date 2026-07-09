export type UserType =
  | "admin_plataforma"
  | "admin_negocio"
  | "turista_nacional"
  | "turista_extranjero"
  | "habitante_local";

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  userTypeId: string;
  userType: UserType;
  registeredAt: string;
  isPremium: boolean;
  active: boolean;
}

export interface User extends ApiUser {
  token: string;
}