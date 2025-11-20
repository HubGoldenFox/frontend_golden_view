// app/page.tsx
'use client'

import Loading from '@/components/custom/Loading'
import { useThemeCustomization } from '@/hooks/useThemeCustomization'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { loading } = useThemeCustomization()
  const router = useRouter()

  // Redirecionamento
  useEffect(() => {
    if (!loading) {
      router.push(`/admin/login`)
    }
  }, [router, loading])

  return <div>{loading && <Loading />}</div>
}
