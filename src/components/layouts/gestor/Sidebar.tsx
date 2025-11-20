'use client'

import Logo from '@/components/Logo'
import { useAuthTenant } from '@/hooks/useAuthTenant'
import { cn } from '@/lib/utils'
import { User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Interfaces
interface MenuItem {
  id: string
  path: string
  title: string
  icon: React.ReactNode
  enabled?: boolean
}

interface MenuGroup {
  title: string
  itens: MenuItem[]
}

type MenuEntry = MenuItem | MenuGroup

interface SidebarProps {
  menuItems: MenuEntry[]
  user?: {
    name: string
    email: string
    role?: string
    avatar?: string
  }
}

interface MenuGroupProps {
  group: MenuGroup
  pathname: string
}

function MenuGroup({ group, pathname }: MenuGroupProps) {
  return (
    <div>
      {/* Título do grupo - alinhado normalmente à esquerda */}
      <div className="px-3 py-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {group.title}
        </h3>
      </div>

      {/* Itens do grupo */}
      <ul className="space-y-1">
        {group.itens
          ?.filter((item) => item.enabled !== false)
          .map((item) => (
            <MenuItem key={item.id} item={item} pathname={pathname} />
          ))}
      </ul>
    </div>
  )
}

interface MenuItemProps {
  item: MenuItem
  pathname: string
}

function MenuItem({ item, pathname }: MenuItemProps) {
  return (
    <Link
      href={item.path}
      className={cn(
        'flex items-center px-3 py-2 text-sm font-medium rounded-md',
        'hover:bg-muted hover:text-foreground transition-colors',
        pathname === item.path
          ? 'bg-muted text-foreground'
          : 'text-muted-foreground'
      )}
    >
      {item.icon && <span className="mr-3">{item.icon}</span>}
      <span>{item.title}</span>
    </Link>
  )
}

interface SidebarFooterProps {
  user?: {
    name: string
    email: string
    role?: string
    avatar?: string
  }
}

function SidebarFooter({ user }: SidebarFooterProps) {
  return (
    <div className="p-4 border-t border-border">
      <div className="flex items-center">
        <div className="shrink-0">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                className="rounded-full"
                width={32}
                height={32}
              />
            ) : (
              <User size={18} className="text-muted-foreground" />
            )}
          </div>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-foreground">
            {user?.name || 'Usuário'}
          </p>
          <p className="text-xs text-muted-foreground">{user?.email || ''}</p>
          {user?.role && (
            <p className="text-xs text-muted-foreground capitalize">
              {user.role}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper function para verificar se é um grupo
function isMenuGroup(entry: MenuEntry): entry is MenuGroup {
  return 'itens' in entry && 'title' in entry
}

// Helper function para verificar se é um item
function isMenuItem(entry: MenuEntry): entry is MenuItem {
  return 'path' in entry && 'id' in entry
}

export default function Sidebar({ menuItems }: SidebarProps) {
  const pathname = usePathname()
  const { tenant } = useAuthTenant()

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-card text-foreground border-r border-border h-screen">
      {/* Logo */}
      <div className="flex items-center justify-center px-6 py-4 border-b border-border">
        <Link
          href={`/${tenant?.slug}/dashboard`}
          className="flex items-center justify-center"
        >
          <div className="w-20 h-20 flex items-center justify-center overflow-hidden rounded">
            <Logo size="lg" />
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-4">
          {menuItems
            .filter((entry) => {
              // Filtrar itens desabilitados
              if (isMenuItem(entry)) {
                return entry.enabled !== false
              }
              // Grupos são sempre exibidos, mas podem ter itens filtrados internamente
              return true
            })
            .map((entry, index) => (
              <li key={isMenuItem(entry) ? entry.id : `group-${index}`}>
                {isMenuGroup(entry) ? (
                  <MenuGroup group={entry} pathname={pathname} />
                ) : (
                  <MenuItem item={entry} pathname={pathname} />
                )}
              </li>
            ))}
        </ul>
      </nav>

      {/* Footer */}
      {/* <SidebarFooter user={user} /> */}
    </aside>
  )
}
