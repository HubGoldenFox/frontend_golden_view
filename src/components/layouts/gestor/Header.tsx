'use client'

import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAuth } from '@/contexts/AuthContext'
import { useAuthTenant } from '@/hooks/useAuthTenant'
import { cn } from '@/lib/utils'
import { LogOut, Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface MobileMenuProps {
  navItems: {
    path: string
    title: string
    icon: React.ReactNode
  }[]
  logout: () => void
  papel?: string | null
}

function MobileMenu({ navItems, logout, papel }: MobileMenuProps) {
  const pathname = usePathname()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu size={24} />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-64 bg-card text-foreground border-r border-border"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center p-4 border-b border-border">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/default-avatar.png" alt="Usuário" />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
            </div>
            <div className="ml-3">
              <p className="font-medium text-sm">Perfil</p>
              <p className="text-xs text-muted-foreground capitalize">
                {papel || 'Usuário'}
              </p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.path}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-md',
                      'hover:bg-muted hover:text-foreground',
                      pathname === item.path
                        ? 'bg-muted text-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-border">
            <Button
              variant="outline"
              className="w-full justify-start text-error hover:text-error-foreground hover:bg-error/10"
              onClick={logout}
            >
              <LogOut size={18} className="mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface UserDropdownProps {
  logout: () => void
  userRole?: string | null
}

function UserDropdown({ logout, userRole }: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/default-avatar.png" alt="Usuário" />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="capitalize">
          {userRole || 'Usuário'}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href="/profile" className="w-full">
            Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface HeaderProps {
  navItems: {
    path: string
    title: string
    icon: React.ReactNode
  }[]
}

export default function Header({ navItems }: HeaderProps) {
  const { user } = useAuth()
  const { logout } = useAuthTenant()

  function LogoutButton() {
    return (
      <Button
        variant="outline"
        className="w-full justify-start text-muted-foreground hover:text-muted-foreground hover:bg-muted"
        onClick={logout}
      >
        <LogOut size={18} className="mr-2" />
        Sair
      </Button>
    )
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <div className="text-lg font-bold ml-2">
          <MobileMenu
            navItems={navItems}
            logout={logout}
            papel={user?.papeis?.nome}
          />
        </div>

        <div className="hidden lg:block">
          <p className="text-sm text-muted-foreground">
            Bem-vindo: {user?.nome_completo || 'Usuário'}
            {user?.papeis?.nome && (
              <span className="ml-2 px-2 py-1 text-xs bg-muted text-muted-foreground rounded-full capitalize">
                {user?.papeis?.nome}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <ThemeToggle />
          {/* <UserDropdown logout={logout} userRole={user?.papel} /> */}
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
