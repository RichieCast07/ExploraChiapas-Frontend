import { User } from '../models/User';

export interface IAuthRepository {
  login(email: string, password: string): Promise<User>;
}

export class AuthRepository implements IAuthRepository {
  async login(email: string, password: string): Promise<User> {
    // Mock — reemplazar con llamada real al backend
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email === 'admin@explorachiapas.com' && password === 'admin123') {
      return {
        id: '1',
        name: 'Administrador',
        email,
        role: 'admin',
        token: 'mock-jwt-token-admin',
      };
    }

    if (email === 'negocio@explorachiapas.com' && password === 'negocio123') {
      return {
        id: '2',
        name: 'Negocio Turístico',
        email,
        role: 'negocio',
        token: 'mock-jwt-token-negocio',
      };
    }

    throw new Error('Credenciales incorrectas');
  }
}