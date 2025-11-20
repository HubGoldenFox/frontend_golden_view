'use client'

import { ThemeToggle } from '@/components/theme/ThemeToggle'
import Link from 'next/link'

/**
 * Componente Header da aplicação
 *
 * Agora usa o ThemeToggle completamente independente!
 * Sem dependências de bibliotecas externas.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* Logo/Título */}
        <div className="mr-4 flex">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <div className="h-6 w-6 rounded bg-primary" />
            <span className="hidden font-bold sm:inline-block">Valtair</span>
          </Link>
        </div>

        {/* Navegação principal */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* Seletor de tema - Completamente independente! */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  )
}
