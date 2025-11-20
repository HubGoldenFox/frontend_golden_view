'use client'

import Logo from '@/components/Logo'
import { useToast } from '@/contexts/ToastContext'
import { useAuthTenant } from '@/hooks/useAuthTenant'
import { sendCode } from '@/services/authService'
import { getErrorMessage } from '@/utils/handlers'
import { useState } from 'react'

interface Props {
  token: string
  setToken: (token: string) => void
  setControl: (value: number) => void
}

const VerifyCode: React.FC<Props> = ({ token, setToken, setControl }) => {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState('')
  const { toast } = useToast()
  const { tenant } = useAuthTenant()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return setError('Código é obrigatório')

    try {
      setIsLoading(true)
      setError(null)
      const response = await sendCode(code, token, tenant?.id)
      if (response?.token) {
        setToken(response.token)
        setCode('')
        setControl(3)
      } else {
        setError('Código inválido')
      }
    } catch (err) {
      const message = getErrorMessage(err)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setCode('')
    setError(null)
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

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <Logo size="4xl" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl shadow-xl border border-border overflow-hidden animate-slide-up">
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary/10">
                <ShieldIcon />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Verificar Código
            </h2>
            <p className="text-muted-foreground text-sm">
              Digite o código de verificação enviado para seu email
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground block">
                Código de Verificação
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none z-10">
                  <ShieldIcon small active={focusedField === 'code'} />
                </div>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onFocus={() => setFocusedField('code')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Digite o código de 6 dígitos"
                  maxLength={6}
                  className="w-full pl-12 py-3 text-center tracking-widest text-lg font-mono bg-input border border-border text-foreground rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-sm text-error bg-error/10 p-3 rounded-lg border border-error">
                {error}
              </div>
            )}

            {/* Info */}
            <div className="text-sm text-primary bg-primary/10 p-3 rounded-lg border border-primary/30">
              Não recebeu o código? Verifique sua caixa de spam ou aguarde
              alguns minutos.
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 py-3 px-4 rounded-xl border border-border bg-muted text-muted-foreground hover:bg-muted-foreground/10 flex items-center justify-center transition-colors"
              >
                <BackIcon className="mr-2" />
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
                    <span>Verificando...</span>
                  </div>
                ) : (
                  'Verificar Código'
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center mt-6 text-xs text-muted-foreground animate-fade-in-delay">
          <p>
            &copy; {new Date().getFullYear()} GestorIA 360. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </div>
  )
}

export default VerifyCode

// 🔒 Ícones
const ShieldIcon = ({
  active = true,
  small = false,
}: {
  active?: boolean
  small?: boolean
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={small ? 20 : 32}
    height={small ? 20 : 32}
    viewBox="0 0 24 24"
    fill="none"
    stroke={active ? 'var(--color-primary)' : 'var(--color-muted-foreground)'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="transition-colors duration-200"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
)

const BackIcon = ({ className = '' }: { className?: string }) => (
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
    className={className}
  >
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
)
