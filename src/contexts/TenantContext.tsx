'use client'

import { ThemeGeneral } from '@//types/theme'
import api, { configureAPI } from '@/config/axiosConfig'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

export interface TenantData {
  id: string
  nome: string
  nome_fantasia: string
  slug: string
  dominio: string
  subdominio: string
  configuracao: ThemeGeneral
  ativo: boolean
}

interface TenantContextProps {
  tenant: TenantData | null
  isLoading: boolean
  error: string | null
  refetchTenant: () => Promise<void>
  isAdminMode: boolean
  setIsAdminMode: (isAdmin: boolean) => void
  setTenant: (data: TenantData | null) => void
}

const TenantContext = createContext<TenantContextProps>({
  tenant: null,
  isLoading: true,
  error: null,
  refetchTenant: async () => {},
  isAdminMode: false,
  setIsAdminMode: () => {},
  setTenant: () => {},
})

interface TenantProviderProps {
  tenantSlug?: string | null
  initialData?: TenantData | null
  children: ReactNode
}

export const TenantProvider = ({
  tenantSlug,
  initialData,
  children,
}: TenantProviderProps) => {
  const [tenant, setTenant] = useState<TenantData | null>(initialData || null)
  const [isLoading, setIsLoading] = useState(!initialData)
  const [error, setError] = useState<string | null>(null)
  // Admin mode agora é um state que pode ser controlado
  const [isAdminMode, setIsAdminMode] = useState<boolean>(
    tenantSlug === 'admin' || !tenantSlug
  )

  // Função para detectar se é um link/domínio
  const isLink = useCallback((text: string): boolean => {
    const cleanText = text.trim().toLowerCase()
    if (/^(https?:\/\/|www\.)/.test(cleanText)) {
      return true
    }
    const domainPattern = /^[a-z0-9]+([\-.]{1}[a-z0-9]+)*\.[a-z]{2,}$/
    return domainPattern.test(cleanText)
  }, [])

  // Busca tenant pelo slug
  const fetchTenantBySlug = useCallback(
    async (slug: string): Promise<TenantData | null> => {
      try {
        const response = await api.get('/tenants', {
          params: {
            all: false,
            slug: slug,
          },
        })
        const tenantData = response.data.data[0]
        return tenantData
      } catch (err) {
        return null
      }
    },
    [isLink]
  )

  // Função principal para buscar tenant
  const refetchTenant = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const tenantData = await fetchTenantBySlug(tenantSlug || 'admin')
      if (tenantData) {
        setTenant(tenantData)
        configureAPI({ tenantId: tenantData.id })
      } else {
        setTenant(null)
        setError('Tenant não encontrado')
      }
    } catch (err) {
      setTenant(null)
      setError('Erro ao carregar tenant')
    } finally {
      setIsLoading(false)
    }
  }, [tenantSlug, fetchTenantBySlug])

  useEffect(() => {
    // Se já tem initialData do server, não precisa buscar
    if (initialData) {
      configureAPI({ tenantId: initialData.id })
      return
    }

    // Se tenantSlug é undefined, aguarda definição
    if (tenantSlug === undefined) {
      setIsLoading(false)
      return
    }

    // Busca novo tenant apenas se não tem initialData
    void refetchTenant()
  }, [tenantSlug, refetchTenant, initialData])

  // Atualiza o isAdminMode quando o tenantSlug mudar
  useEffect(() => {
    setIsAdminMode(tenantSlug === 'admin' || !tenantSlug)
  }, [tenantSlug])

  return (
    <TenantContext.Provider
      value={{
        tenant,
        isLoading,
        error,
        refetchTenant,
        isAdminMode,
        setIsAdminMode,
        setTenant: (data) => {
          setTenant(data)
          if (data) {
            configureAPI({ tenantId: data.id })
          } else {
            configureAPI({ tenantId: null })
          }
        },
      }}
    >
      {children}
    </TenantContext.Provider>
  )
}

export const useTenant = () => {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenant deve ser usado dentro de um TenantProvider')
  }
  return context
}
