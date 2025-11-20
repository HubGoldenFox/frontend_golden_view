import type React from 'react'
import { Header } from './header'
/**
 * Props do componente Layout
 */
interface LayoutProps {
  children: React.ReactNode
}

/**
 * Layout global da aplicação
 *
 * Estrutura básica que inclui:
 * - Header com navegação e seletor de tema
 * - Área principal de conteúdo
 * - Estrutura responsiva
 *
 * @param children - Conteúdo da página
 */
export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Header />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-primary from-primary-50 to-background dark:from-primary-900 dark:to-background">
        {children}
      </main>
    </>
  )
}
