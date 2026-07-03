// features/Auth/presentation/viewmodels/useLoginViewModel.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useLoginViewModel() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true);

    // Simula un pequeño delay, como si fuera una petición real
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsLoading(false);

    // Por ahora, sin validar nada, solo redirige al Home
    navigate('/admin/dashboard');
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