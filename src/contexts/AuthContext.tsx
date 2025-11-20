'use client'

import { GetUsuarios as Usuario } from '@/client/types.gen'
import { configureAPI } from '@/config/axiosConfig'
// import { useRouter } from 'next/navigation'
import { apiLogin, LoginResponse } from '@/services/authService'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'

interface Sessao {
  access_token: string
  user: Usuario
  papel: string
}

interface AuthContextProps {
  user: Usuario | null
  token: string | null
  sessao: Sessao | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (
    email: string,
    senha: string,
    tenantId?: string | null
  ) => Promise<LoginResponse | undefined>
  clear: () => void
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  token: null,
  sessao: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => undefined,
  clear: () => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Usuario | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [sessao, setSessao] = useState<Sessao | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 🔹 Restaura sessão do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sessao')
    if (saved) {
      try {
        const sessao = JSON.parse(saved) as Sessao
        setUser(sessao.user)
        setToken(sessao.access_token)
        setSessao(sessao)

        configureAPI({
          token: sessao.access_token,
          tenantId: null,
        })
      } catch {
        localStorage.removeItem('sessao')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (
    email: string,
    senha: string,
    tenantId?: string | null
  ) => {
    setIsLoading(true)
    try {
      const response = await apiLogin(email, senha, tenantId)

      setUser(response.user)
      setToken(response.access_token)
      setSessao(response as Sessao)
      // Salva APENAS dados de autenticação
      localStorage.setItem('sessao', JSON.stringify(response))
      if (tenantId) {
        localStorage.setItem('tenant-id', tenantId)
      } else {
        localStorage.removeItem('tenant-id')
      }

      // Configura APENAS o token inicial
      configureAPI({
        token: response.access_token,
        tenantId: null,
      })

      return response
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const clear = () => {
    setIsLoading(true)
    setUser(null)
    setToken(null)
    localStorage.removeItem('sessao')
    localStorage.removeItem('tenant-id')
    setIsLoading(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        sessao,
        clear,
        isAuthenticated: !!token,
        isLoading,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }

  return context
}
