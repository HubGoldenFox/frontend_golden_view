// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:3000'

function extractTenant(req: NextRequest): {
  tenant: string
  type: 'subdomain' | 'custom-domain' | 'slug' | 'admin'
} | null {
  const host = req.headers.get('host') || ''
  const hostname = host.split(':')[0]
  const { pathname } = req.nextUrl

  // Remove porta do domínio principal
  const mainDomain = APP_DOMAIN.split(':')[0]

  // 🔥 DESENVOLVIMENTO: Permite testar subdomínios locais
  if (process.env.NODE_ENV === 'development') {
    // Subdomínio local: tenant1.localhost:3000
    if (hostname.includes('.localhost') || hostname.includes('.127.0.0.1')) {
      const subdomain = hostname.split('.')[0]
      if (subdomain && subdomain !== 'www') {
        return { tenant: subdomain, type: 'subdomain' }
      }
    }

    // Slug path: localhost:3000/tenant1
    const pathParts = pathname.split('/').filter(Boolean)
    if (pathParts.length >= 1) {
      const potentialTenant = pathParts[0]
      if (isValidTenantSlug(potentialTenant)) {
        return { tenant: potentialTenant, type: 'slug' }
      }
    }

    // Se for localhost puro, considera como admin
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return { tenant: 'admin', type: 'admin' }
    }
  }

  // 🚀 PRODUÇÃO

  // 1. Custom Domain (qualquer domínio que NÃO seja o principal)
  if (hostname !== mainDomain && hostname !== `www.${mainDomain}`) {
    return { tenant: hostname, type: 'custom-domain' }
  }

  // 2. Subdomain (empresa1.minhaempresa.com)
  if (hostname.includes(`.${mainDomain}`) && hostname !== mainDomain) {
    const subdomain = hostname.replace(`.${mainDomain}`, '')
    if (subdomain && subdomain !== 'www') {
      return { tenant: subdomain, type: 'subdomain' }
    }
  }

  // 3. Slug Path (minhaempresa.com/empresa1)
  const pathParts = pathname.split('/').filter(Boolean)
  if (pathParts.length >= 1) {
    const potentialTenant = pathParts[0]
    if (isValidTenantSlug(potentialTenant)) {
      return { tenant: potentialTenant, type: 'slug' }
    }
  }

  // 4. Domínio principal sem tenant → admin
  return { tenant: 'admin', type: 'admin' }
}

function isValidTenantSlug(slug: string): boolean {
  const reserved = ['api', '_next', 'favicon.ico', 'sitemap.xml']
  return !reserved.includes(slug) && !slug.includes('.') && slug.length >= 2
}

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  // 🔥 CRÍTICO: Ignora arquivos estáticos e APIs
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  const tenantInfo = extractTenant(req)

  if (tenantInfo) {
    if (tenantInfo.type === 'slug') {
      // Já está no formato /tenant/path → não faz rewrite
      return NextResponse.next()
    }

    let newPath: string

    if (tenantInfo.type === 'admin' && pathname === '/') {
      // Admin na raiz → /admin/login
      newPath = `/admin/login${search}`
    } else {
      // Admin, custom-domain ou subdomain → adiciona tenant ao path
      newPath = `/${tenantInfo.tenant}${pathname}${search}`
    }

    const response = NextResponse.rewrite(new URL(newPath, req.url))
    response.headers.set('x-tenant-type', tenantInfo.type)
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\..*).*)'],
}
