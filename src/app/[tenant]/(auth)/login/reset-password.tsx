'use client'

import Logo from '@/components/Logo'
import { useToast } from '@/contexts/ToastContext'
import { useAuthTenant } from '@/hooks/useAuthTenant'
import { sendNewPassword } from '@/services/authService'
import { getErrorMessage } from '@/utils/handlers'
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react'
import React, { useState } from 'react'

interface Props {
  token: string
  setToken: (token: string) => void
  setControl: (value: number) => void
}

const ResetPassword: React.FC<Props> = ({ token, setControl }) => {
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)
  const { addToast, toast } = useToast()
  const { tenant } = useAuthTenant()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!password) return setError('Senha é obrigatória')
    if (password.length < 6)
      return setError('A senha deve ter pelo menos 6 caracteres')
    if (password !== repeatPassword) return setError('As senhas não coincidem')

    try {
      setIsLoading(true)
      await sendNewPassword(password, token, tenant?.id)
      setPassword('')
      setRepeatPassword('')
      addToast('Senha redefinida com sucesso!', 'success')
      setControl(0)
    } catch (err) {
      const message = getErrorMessage(err)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setPassword('')
    setRepeatPassword('')
    setError(null)
    setControl(0)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleRepeatPasswordVisibility = () => {
    setShowRepeatPassword(!showRepeatPassword)
  }

  return (
    <div className="min-h-screen bg-gradient-primary from-secondary-100 via-(--color-background) to-secondary-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-0 left-0 w-full h-full bg-repeat opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%232b4229' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <Logo size="4xl" />
          </div>
        </div>

        <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border overflow-hidden animate-slide-up">
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary/10">
                <Lock className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Redefinir Senha
            </h2>
            <p className="text-muted-foreground text-sm">
              Digite sua nova senha para acessar o sistema
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-muted-foreground"
              >
                Nova Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
                  <Lock
                    size={20}
                    className={
                      focusedField === 'password'
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }
                  />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Digite sua nova senha"
                  className="w-full pl-12 pr-12 py-3 bg-input border border-border text-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label
                htmlFor="repeatPassword"
                className="text-sm font-medium text-muted-foreground"
              >
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
                  <Lock
                    size={20}
                    className={
                      focusedField === 'repeatPassword'
                        ? 'text-primary'
                        : 'text-muted-foreground'
                    }
                  />
                </div>
                <input
                  id="repeatPassword"
                  type={showRepeatPassword ? 'text' : 'password'}
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  onFocus={() => setFocusedField('repeatPassword')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Confirme sua nova senha"
                  className="w-full pl-12 pr-12 py-3 bg-input border border-border text-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                />
                <button
                  type="button"
                  onClick={toggleRepeatPasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showRepeatPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-error bg-error/10 p-3 rounded-lg border border-error">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 py-3 px-4 rounded-xl border border-border bg-muted text-muted-foreground font-medium hover:bg-muted-foreground/10 transition-colors flex items-center justify-center"
              >
                <ArrowLeft size={16} className="mr-2" />
                Voltar
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 px-4 rounded-xl text-white bg-primary font-medium transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Salvando...</span>
                  </div>
                ) : (
                  'Redefinir Senha'
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center mt-6 text-xs text-muted-foreground animate-fade-in-delay">
          <p>
            &copy; {new Date().getFullYear()} Golden View. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
