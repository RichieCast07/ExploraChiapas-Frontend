import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginUseCase } from '../../domain/LoginUseCase';
import { AuthRepository } from '../../data/repository/AuthRepository';
import { BASE_URL } from '../../../../core/shared/config/api';

export function useLoginViewModel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Ingresa tu correo y contraseña');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const loginUseCase = new LoginUseCase(new AuthRepository());
      const user = await loginUseCase.execute(email, password);

      localStorage.setItem('token', user.token);
      localStorage.setItem('user_name', user.name);

      const probe = await fetch(`${BASE_URL}/stats/system`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      if (probe.status === 200) {
        navigate('/admin/dashboard');
      } else {
        navigate('/negocio/inicio');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    rememberMe, setRememberMe,
    isLoading,
    error,
    handleLogin,
  };
}