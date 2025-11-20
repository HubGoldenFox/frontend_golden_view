'use client'

import Logo from '@/components/Logo'
import { sendEmail } from '@/services/authService'
import { useAuthTenant } from '@/hooks/useAuthTenant'
import { useToast } from '@/contexts/ToastContext'
import React, { ReactElement, useState } from 'react'

interface Props {
  token: string
  setToken: (token: string) => void
  setControl: (value: number) => void
}

const ForgotPassword: React.FC<Props> = ({
  setToken,
  setControl,
}): ReactElement => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState('')
  const { addToast } = useToast()

  const { tenant } = useAuthTenant()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      setError('Email é obrigatório')
      return
    }
    try {
      setIsLoading(true)
      setError(null)

      const response = await sendEmail(email, tenant?.id)
      if (response?.token) {
        setToken(response.token)
        setEmail('')
        setControl(2)
        addToast(
          'Email enviado com sucesso! Verifique sua caixa de entrada.',
          'success'
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setEmail('')
    setControl(0)
  }

  return (
    <div className="min-h-screen bg-gradient-primary from-secondary-100 via-(--color-background) to-secondary-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Padrão de fundo em SVG */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-0 left-0 w-full h-full bg-repeat opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='currentColor'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="w-full max-w-md z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <Logo size="4xl" />
          </div>
        </div>

        {/* Card principal */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border overflow-hidden animate-slide-up">
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded flex items-center justify-center bg-primary/10 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Esqueci minha senha
            </h2>
            <p className="text-muted-foreground text-sm">
              Digite seu email para receber as instruções de recuperação
            </p>
          </div>

          <form onSubmit={onSubmit} className="px-8 pb-8 space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-muted-foreground block"
              >
                Email de recuperação
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`transition-colors ${focusedField === 'email' ? 'text-primary' : 'text-muted-foreground'}`}
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Digite seu email cadastrado"
                  className="w-full pl-12 pr-4 py-3 bg-input border border-border text-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                />
              </div>
            </div>

            {error && (
              <div className="text-sm text-error bg-error-foreground/10 p-3 rounded-lg border border-error">
                {error}
              </div>
            )}

            <div className="text-sm text-info bg-info-foreground/10 p-3 rounded-lg border border-info">
              Enviaremos um código de verificação para o email informado.
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 py-3 px-4 rounded-xl border border-border bg-muted text-muted-foreground hover:bg-accent transition-colors flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Voltar
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-medium transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded animate-spin" />
                    <span>Enviando...</span>
                  </div>
                ) : (
                  'Enviar Código'
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

export default ForgotPassword
