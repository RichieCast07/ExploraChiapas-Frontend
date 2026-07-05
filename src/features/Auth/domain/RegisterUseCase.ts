// src/features/Auth/domain/RegisterUseCase.ts

const BASE_URL = 'https://explora-chiapas.onrender.com/v1/api';

export interface RegisterParams {
  fullName: string;
  email: string;
  userType: 'turista_nacional' | 'turista_extranjero' | 'habitante_local';
  password: string;
}

export interface RegisterResult {
  success: boolean;
  message?: string;
  userId?: string;
}

export class RegisterUseCase {
  async execute(params: RegisterParams): Promise<RegisterResult> {
    try {
      const response = await fetch(`${BASE_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: params.fullName,
          email: params.email,
          password: params.password,
          phone: null,
          userType: params.userType,
        }),
      });

      const body = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: body.message ?? 'Error al registrar el usuario',
        };
      }

      return {
        success: true,
        message: 'Usuario registrado exitosamente',
        userId: body.data?.id,
      };
    } catch {
      return {
        success: false,
        message: 'Error de conexión con el servidor',
      };
    }
  }
}