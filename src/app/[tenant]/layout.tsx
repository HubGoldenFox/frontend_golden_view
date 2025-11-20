// app/[tenant]/layout.tsx
import { DynamicFavicon } from '@/components/layouts/DynamicFavicon'
import { TenantProvider } from '@/contexts/TenantContext'
import { Metadata } from 'next'

interface TenantLayoutProps {
  children: React.ReactNode
  params: Promise<{ tenant: string }>
}

async function fetchTenantDataServer(slug: string) {
  try {
    const response = await fetch(
      `${process.env.API_URL}/empresas/tenant?subdominio=${slug}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API_TOKEN}`,
        },
        next: { revalidate: 60 },
      }
    )

    if (!response.ok) return null
    const data = await response.json()
    return data.data[0] || null
  } catch (error) {
    return null
  }
}

export async function generateMetadata({
  params,
}: TenantLayoutProps): Promise<Metadata> {
  const tenant = (await params).tenant
  const tenantData = await fetchTenantDataServer(tenant)

  return {
    title: tenantData?.configuracao?.title,
    icons: {
      icon: tenantData?.configuracao?.faviconBase64,
      apple: tenantData?.configuracao?.faviconBase64,
    },
  }
}

export default async function TenantLayout({
  children,
  params,
}: TenantLayoutProps) {
  const { tenant } = await params
  const tenantData = await fetchTenantDataServer(tenant)

  return (
    <TenantProvider tenantSlug={tenant} initialData={tenantData}>
      <DynamicFavicon />
      {children}
    </TenantProvider>
  )
}
