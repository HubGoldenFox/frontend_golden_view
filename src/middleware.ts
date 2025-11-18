import { NextRequest, NextResponse } from 'next/server'

const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000'

function extractSubdomain(req: NextRequest): string | null {
  const host = req.headers.get('host') || ''
  const hostname = host.split(':')[0]

  // Dev: localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') return null

  // Produção: subdominio.dominio.com
  const root = rootDomain.split(':')[0]
  if (hostname === root || hostname === `www.${root}`) return null

  const parts = hostname.split('.')
  if (parts.length < 3) return null

  // Ex: tenant.minhaapp.com → retorna tenant
  return parts[0]
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const subdomain = extractSubdomain(req)

  // Caso tenha subdomínio (tenant)
  if (subdomain) {
    // Se o usuário acessa o domínio puro (ex: tenant.dominio.com/),
    // reescreve para a rota /[tenant] local (multi-tenancy)
    if (pathname === '/') {
      return NextResponse.rewrite(new URL(`/${subdomain}`, req.url))
    }

    // Caso contrário, mantém o caminho normal
    return NextResponse.next()
  }

  // Domínio raiz (sem subdomínio) → segue normal
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|[\\w-]+\\.\\w+).*)'],
}
