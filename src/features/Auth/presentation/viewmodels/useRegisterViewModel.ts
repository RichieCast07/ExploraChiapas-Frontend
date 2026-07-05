// src/features/Auth/viewmodels/useRegisterViewModel.ts
import { useState } from 'react';
import { RegisterUseCase } from '../../domain/RegisterUseCase';

export function useRegisterViewModel() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerUseCase = new RegisterUseCase();

  const validateForm = (): boolean => {
    if (!fullName.trim()) {
      setError('El nombre completo es requerido');
      return false;
    }

    if (!email.trim() || !email.includes('@')) {
      setError('Correo electrónico inválido');
      return false;
    }

    if (!role) {
      setError('Selecciona un rol');
      return false;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return false;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    if (!acceptTerms) {
      setError('Debes aceptar los términos y condiciones');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerUseCase.execute({
        fullName,
        email,
        role,
        password,
      });

      if (result.success) {
        // Redirigir al login o mostrar mensaje de éxito
        window.location.href = '/login?registered=true';
      } else {
        setError(result.message || 'Error al registrar el usuario');
      }
    } catch (err) {
      setError('Ocurrió un error inesperado. Intenta de nuevo.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fullName,
    setFullName,
    email,
    setEmail,
    role,
    setRole,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    acceptTerms,
    setAcceptTerms,
    isLoading,
    error,
    handleRegister,
  };
}