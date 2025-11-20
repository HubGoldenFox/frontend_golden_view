// app/page.tsx
'use client'

import Loading from '@/components/custom/Loading'
import { useTenant } from '@/contexts/TenantContext'
import { useThemeCustomization } from '@/hooks/useThemeCustomization'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { isLoading, tenant } = useTenant()
  const { loading } = useThemeCustomization()
  const router = useRouter()

  // Redirecionamento
  useEffect(() => {
    if (!isLoading && !loading) {
      if (tenant) {
        const path = tenant.subdominio || tenant.dominio
        router.push(`${path}/login`)
      } else {
        router.push(`/admin/login`)
      }
    }
  }, [router, isLoading, loading, tenant])

  return <div>{(isLoading || loading) && <Loading />}</div>
}
