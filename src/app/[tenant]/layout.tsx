// app/[tenant]/layout.tsx
import { TenantProvider } from '@/contexts/TenantContext'
import { Metadata } from 'next'
import { headers } from 'next/headers'

interface TenantLayoutProps {
  children: React.ReactNode
  params: Promise<{ tenant: string }>
}

async function fetchTenantDataServer(
  slug: string,
  type: 'subdomain' | 'custom-domain' | 'slug'
) {
  // Define o parâmetro correto baseado no tipo
  const paramName = type === 'custom-domain' ? 'dominio' : 'subdominio'

  try {
    const response = await fetch(
      `${process.env.API_URL}/empresas/tenant?${paramName}=${slug}`,
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
  const headersList = await headers()
  const tenantType = headersList.get('x-tenant-type') as
    | 'subdomain'
    | 'custom-domain'
    | 'slug'
  const tenant = (await params).tenant
  const tenantData = await fetchTenantDataServer(tenant, tenantType)

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
  const headersList = await headers()
  const tenantType = headersList.get('x-tenant-type') as
    | 'subdomain'
    | 'custom-domain'
    | 'slug'
  const { tenant } = await params
  const tenantData = await fetchTenantDataServer(tenant, tenantType)

  return (
    <TenantProvider tenantSlug={tenant} initialData={tenantData}>
      {children}
    </TenantProvider>
  )
}
