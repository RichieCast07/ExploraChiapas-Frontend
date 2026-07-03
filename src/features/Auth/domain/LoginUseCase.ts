import { User } from '../data/models/User';
import { IAuthRepository } from '../data/repository/AuthRepository';

export class LoginUseCase {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(email: string, password: string): Promise<User> {
    if (!email || !password) {
      throw new Error('El correo y la contraseña son requeridos');
    }
    return this.repository.login(email, password);
  }
}