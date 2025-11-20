'use client'

import Logo from '@/components/Logo'
import { useToast } from '@/contexts/ToastContext'
import { useAuthTenant } from '@/hooks/useAuthTenant'
import { useThemeCustomization } from '@/hooks/useThemeCustomization'
import { useRouter } from 'next/navigation'
import { useEffect, useState, type ReactElement } from 'react'

type Login = {
  setControl: (control: number) => void
}

const LoginPage = ({ setControl }: Login): ReactElement => {
  const router = useRouter()
  const {
    tenant,
    isLoading: tenantLoading,
    isAdminMode,
    loginWithTenant,
    loginAsAdmin,
    auth,
  } = useAuthTenant()
  const { toast } = useToast()

  const { loading, loadTheme } = useThemeCustomization()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [focusedField, setFocusedField] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<{ username?: string; password?: string }>(
    {}
  )

  // 🔹 Carrega tema quando tenant estiver pronto
  useEffect(() => {
    if (!tenantLoading && tenant) {
      loadTheme()
    }
  }, [tenantLoading, tenant, loadTheme])

  //🔹 Redirecionamento quando autenticado
  // useEffect(() => {
  //   console.log(tenant)

  //   const tenantId = localStorage.getItem('tenant-id')
  //   if (
  //     tenantId &&
  //     tenant &&
  //     tenantId === tenant.id &&
  //     tenant?.ativo === true
  //   ) {
  //     if (auth.token && auth.isAuthenticated && !loading && !tenantLoading) {
  //       const basePath =
  //         !isAdminMode && tenant
  //           ? tenant.subdominio
  //             ? `/${tenant.subdominio}`
  //             : tenant.dominio
  //               ? `/${tenant.dominio}`
  //               : '/'
  //           : '/'

  //       const userRole = auth?.sessao?.papel?.toLowerCase()

  //       const roleRoutes = {
  //         admin: `${basePath}/admin/dashboard`,
  //         gestor: `${basePath}/admin/dashboard`,
  //         atendente: `${basePath}/attendant`,
  //       }

  //       if (userRole && roleRoutes[userRole as keyof typeof roleRoutes]) {
  //         router.push(roleRoutes[userRole as keyof typeof roleRoutes])
  //       } else {
  //         setError({ password: 'Sem permissão para acessar a aplicação' })
  //       }
  //     }
  //   } else if (tenant && tenant?.slug === 'admin' && tenant?.ativo === true) {
  //     router.push(`${tenant?.slug}/admin/dashboard`)
  //   }
  // }, [auth, loading, tenantLoading, tenant, isAdminMode, router])

  const validateForm = () => {
    const newErrors: typeof error = {}
    if (!username) newErrors.username = 'Nome de usuário é obrigatório'
    if (!password) newErrors.password = 'Senha é obrigatória'
    setError(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setError({})

    try {
      if (tenant?.slug === 'admin' || isAdminMode) {
        await loginAsAdmin(username, password)
      } else {
        await loginWithTenant(username, password)
      }
      router.push(`/${tenant?.slug}/admin/dashboard`)
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.detail[0]?.msg ||
        err?.response?.data?.detail ||
        err?.message ||
        'Credenciais inválidas. Verifique seu usuário e senha.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // 🔹 Loading melhorado
  if (tenantLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary relative overflow-hidden p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="absolute inset-0 bg-repeat opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%234F4F4F' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-center mb-6 animate-fade-in">
          <Logo size="4xl" />
        </div>

        <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border shadow-lg overflow-hidden animate-slide-up">
          <div className="px-8 pt-8 pb-6 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Bem-vindo de volta
            </h2>
            <p className="text-sm text-muted-foreground">
              {isAdminMode
                ? 'Login Administrativo'
                : `Acessar ${tenant?.nome_fantasia || 'Sistema'}`}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
            {/* Usuário */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">
                Login
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField('')}
                placeholder="Digite seu Login"
                className={`w-full px-4 py-3 rounded-xl border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                  focusedField === 'username' ? 'shadow-md' : ''
                }`}
              />
              {error.username && (
                <span className="text-sm text-error">{error.username}</span>
              )}
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground block">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                  placeholder="Digite sua senha"
                  className={`w-full px-4 py-3 pr-12 rounded-xl border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                    focusedField === 'password' ? 'shadow-md' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground text-sm hover:text-foreground"
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              {error.password && (
                <span className="text-sm text-error">{error.password}</span>
              )}
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-medium text-primary-foreground bg-primary hover:bg-primary/90 shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Entrando...</span>
                </div>
              ) : (
                'Entrar no Sistema'
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                className="text-sm font-medium text-foreground hover:underline"
                onClick={() => setControl(1)}
              >
                Esqueci minha senha
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

export default LoginPage
