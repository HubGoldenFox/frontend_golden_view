'use client'

import { useAuthTenant } from '@/hooks/useAuthTenant'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Admin = () => {
  const router = useRouter()
  const { tenant } = useAuthTenant()

  const path = tenant?.slug || ''

  useEffect(() => {
    if (path) {
      router.push(`/${path}/login`)
    } else {
      router.push(`/admin/login`)
    }
  }, [path])

  return <></>
}

export default Admin
