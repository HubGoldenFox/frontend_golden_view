// hooks/useAuthTenant.ts
'use client'

import { configureAPI } from '@/config/axiosConfig'
import { useAuth } from '@/contexts/AuthContext'
import { useTenant } from '@/contexts/TenantContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const useAuthTenant = () => {
  const auth = useAuth()
  const { tenant, isAdminMode, isLoading } = useTenant()
  const router = useRouter()

  // 🔹 Configura API quando ambos estiverem disponíveis
  useEffect(() => {
    if (auth.token) {
      configureAPI({
        token: auth.token,
        tenantId: tenant?.id || null,
      })
    }
  }, [auth.token, tenant?.id])

  // 🔹 Login específico para tenant (passa tenant.id no header)
  const loginWithTenant = async (email: string, senha: string) => {
    if (!tenant?.id) {
      throw new Error('Tenant não identificado para login')
    }

    return await auth.login(email, senha, tenant.id)
  }

  // 🔹 Login para admin (sem tenant)
  const loginAsAdmin = async (email: string, senha: string) => {
    return await auth.login(email, senha, null)
  }

  // 🔹 Logout corrigido com acesso ao tenant
  const logout = () => {
    localStorage.removeItem('sessao')
    auth.clear()

    configureAPI({ token: null, tenantId: null })

    // 🔹 Redireciona para o login correto baseado no tenant atual
    if (tenant?.slug) {
      router.push(`/${tenant.slug}/login`)
    } else if (tenant?.dominio) {
      router.push(`/${tenant.dominio}/login`)
    } else {
      router.push('/login')
    }
  }

  return {
    auth,
    tenant,
    logout,
    loginWithTenant,
    loginAsAdmin,
    isAdminMode,
    isLoading: auth.isLoading || isLoading,
  }
}
