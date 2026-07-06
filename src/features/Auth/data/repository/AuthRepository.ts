import { User } from '../models/User';
import { BASE_URL } from '../../../../core/shared/config/api';

export interface IAuthRepository {
  login(email: string, password: string): Promise<User>;
}

export class AuthRepository implements IAuthRepository {
  async login(email: string, password: string): Promise<User> {
    const response = await fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const body = await response.json();

    if (!response.ok) {
      throw new Error(body.message ?? 'Credenciales incorrectas');
    }

    const { token, user } = body.data;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    };
  }
}