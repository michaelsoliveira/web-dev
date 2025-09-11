import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Schema de validação com Zod
const authSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Formato de email inválido'),
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha muito longa'),
  rememberMe: z.boolean().default(false),
});

type AuthFormData = z.infer<typeof authSchema>;

interface FormLoginProps {
  onSubmit?: (data: AuthFormData) => Promise<void> | void;
  isLoading?: boolean;
  error?: string | null;
  mode?: 'signin' | 'signup';
  onToggleMode?: () => void;
}

const FormLogin: React.FC<FormLoginProps> = ({ 
  onSubmit, 
  isLoading = false, 
  error = null,
  mode = 'signin',
  onToggleMode
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema as any),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onFormSubmit = async (data: AuthFormData) => {
    try {
      await onSubmit?.(data);
      // Reset form on successful submission if needed
      // reset();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
              {mode === 'signin' ? 'Bem-vindo de volta' : 'Criar conta'}
            </CardTitle>
            <CardDescription className="text-base">
              {mode === 'signin' 
                ? 'Faça login para continuar' 
                : 'Preencha os dados para se cadastrar'
              }
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" className="animate-in fade-in duration-300">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className={`pl-10 h-11 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      disabled={isLoading || isSubmitting}
                    />
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 animate-in fade-in duration-200">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className={`pl-10 pr-10 h-11 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      disabled={isLoading || isSubmitting}
                    />
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={togglePasswordVisibility}
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  disabled={isLoading || isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-slate-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-slate-400" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 animate-in fade-in duration-200">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Controller
                  name="rememberMe"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="rememberMe"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading || isSubmitting}
                    />
                  )}
                />
                <Label 
                  htmlFor="rememberMe" 
                  className="text-sm font-normal cursor-pointer"
                >
                  Lembrar de mim
                </Label>
              </div>
              {mode === 'signin' && (
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-sm text-blue-600 hover:text-blue-500"
                  disabled={isLoading || isSubmitting}
                >
                  Esqueci minha senha
                </Button>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none"
            >
              {isLoading || isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {mode === 'signin' ? 'Entrando...' : 'Criando conta...'}
                </div>
              ) : (
                mode === 'signin' ? 'Entrar' : 'Criar conta'
              )}
            </Button>
          </form>

          {/* Toggle Mode */}
          {onToggleMode && (
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {mode === 'signin' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                <Button 
                  type="button"
                  variant="link"
                  onClick={onToggleMode}
                  className="p-0 ml-1 h-auto text-sm font-medium"
                  disabled={isLoading || isSubmitting}
                >
                  {mode === 'signin' ? 'Cadastre-se' : 'Faça login'}
                </Button>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FormLogin;