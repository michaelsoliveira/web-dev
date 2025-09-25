'use client'; // Se usando App Router

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormLogin from '@/features/auth/form-login';

interface AuthFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const router = useRouter();

  const handleAuth = async (data: AuthFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (mode === 'signin') {
        const result = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          setError('Email ou senha incorretos');
        } else {
          router.push('/dashboard');
        }
      } else {
        // Lógica de cadastro
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
          }),
        });

        if (response.ok) {
          setMode('signin');
          setError(null);
        } else {
          const error = await response.json();
          setError(error.message || 'Erro ao criar conta');
        }
      }
    } catch (err) {
      setError('Erro interno do servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormLogin
      onSubmit={handleAuth}
      isLoading={isLoading}
      error={error}
      mode={mode}
      onToggleMode={() => {
        setMode(mode === 'signin' ? 'signup' : 'signin');
        setError(null);
      }}
    />
  );
}