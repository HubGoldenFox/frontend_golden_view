// components/layouts/DynamicFavicon.tsx
'use client'

import { useTenant } from '@/contexts/TenantContext'
import { useEffect } from 'react'

export function DynamicFavicon() {
  const { tenant } = useTenant()

  useEffect(() => {
    if (tenant?.configuracao?.faviconBase64) {
      const favicon = document.querySelector(
        "link[rel='icon']"
      ) as HTMLLinkElement

      if (
        favicon &&
        !favicon.href.includes(tenant.configuracao.faviconBase64)
      ) {
        favicon.href = tenant.configuracao.faviconBase64
      }
    }
  }, [tenant?.configuracao?.faviconBase64])

  return null
}
