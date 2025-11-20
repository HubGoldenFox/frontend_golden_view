'use client'

import { menuAdmin, menuTenantGestor } from '@/data/menuItems'
import { useAuthTenant } from '@/hooks/useAuthTenant'
import { usePathname } from 'next/navigation'
import Header from './Header'
import Sidebar from './Sidebar'

import { getInitialReports } from '@/lib/mockData'

const PUBLIC_ROUTES = ['/login', '/recuperar-senha', '/cadastro']

export default function Layout({ children }: { children: React.ReactNode }) {
  // 🔄 Usar o hook unificado mantendo SEUS nomes exatos
  const { auth, tenant, isAdminMode, isLoading } = useAuthTenant()

  const pathname = usePathname()

  const domain = tenant?.slug || ''
  const papel = auth?.sessao?.papel.toLowerCase()

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // 🔄 Layout completo para usuários autenticados
  const menuItems = isAdminMode
    ? menuAdmin('admin')
    : menuTenantGestor(domain, getInitialReports(tenant?.slug || ''))

  return (
    <div className="flex h-screen bg-muted text-foreground">
      <Sidebar menuItems={menuItems} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header navItems={[]} />
        <main className="flex-1 overflow-y-auto mt-[-22px] p-4 md:p-2 bg-gradient-primary from-primary-50 to-background">
          {children}
        </main>
      </div>
    </div>
  )
}
