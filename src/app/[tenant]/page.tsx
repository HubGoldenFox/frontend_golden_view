'use client'

import { useAuthTenant } from '@/hooks/useAuthTenant'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Admin = () => {
  const router = useRouter()
  const { tenant } = useAuthTenant()

  const path = tenant?.subdominio || ''

  useEffect(() => {
    if (path) {
      router.push(`/${path}/admin/dashboard`)
    } else {
      router.push(`/${path}/login`)
    }
  }, [path])

  return <></>
}

export default Admin
