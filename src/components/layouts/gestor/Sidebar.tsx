'use client'

import Logo from '@/components/Logo'
import { useAuthTenant } from '@/hooks/useAuthTenant'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface MenuItem {
  id: string
  path: string
  title: string
  icon: React.ReactNode
  enabled?: boolean
  children?: MenuItem[]
}

interface SidebarProps {
  menuItems: MenuItem[]
  user?: {
    name: string
    email: string
    role?: string
    avatar?: string
  }
}

interface MenuGroupProps {
  item: MenuItem
  openGroups: string[]
  toggleGroup: (groupId: string) => void
  pathname: string
}

function MenuGroup({
  item,
  openGroups,
  toggleGroup,
  pathname,
}: MenuGroupProps) {
  return (
    <div>
      <button
        onClick={() => toggleGroup(item.id)}
        className={cn(
          'flex items-center w-full px-3 py-2 text-sm font-medium rounded-md',
          'hover:bg-muted hover:text-foreground',
          pathname.startsWith(item.path)
            ? 'bg-muted text-foreground'
            : 'text-muted-foreground'
        )}
      >
        {item.icon}
        <span className="ml-3 flex-1">{item.title}</span>
        {openGroups.includes(item.id) ? (
          <ChevronDown size={16} />
        ) : (
          <ChevronRight size={16} />
        )}
      </button>

      {openGroups.includes(item.id) && (
        <ul className="mt-1 pl-8 space-y-1">
          {item.children?.map((child) => (
            <MenuItem key={child.id} item={child} pathname={pathname} />
          ))}
        </ul>
      )}
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
        'hover:bg-muted hover:text-foreground',
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

export default function Sidebar({ menuItems, user }: SidebarProps) {
  const pathname = usePathname()
  const [openGroups, setOpenGroups] = useState<string[]>([])

  const { tenant } = useAuthTenant()

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    )
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-card text-foreground border-r border-border h-screen">
      {/* Logo */}

      <div className="flex items-center justify-center px-6 py-4 border-b border-border">
        <Link
          href={`/${tenant?.slug}/admin/dashboard`}
          className="flex items-center justify-center"
        >
          <div className="w-20 h-20 flex items-center justify-center overflow-hidden rounded">
            <Logo size="lg" />
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {menuItems
            .filter((item) => item.enabled !== false)
            .map((item) => (
              <li key={item.id}>
                {item.children ? (
                  <MenuGroup
                    item={item}
                    openGroups={openGroups}
                    toggleGroup={toggleGroup}
                    pathname={pathname}
                  />
                ) : (
                  <MenuItem item={item} pathname={pathname} />
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
