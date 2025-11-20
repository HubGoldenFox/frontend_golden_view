'use client'

import { useThemeCustomization } from '@/hooks/useThemeCustomization'
import { useEffect, useRef, useState } from 'react'

interface ThemeToggleProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  className?: string
  showText?: boolean
  align?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
}

const Icons = {
  Sun: () => (
    <svg
      className="w-4 h-4"
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  ),
  Moon: () => (
    <svg
      className="w-4 h-4"
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  Monitor: () => (
    <svg
      className="w-4 h-4"
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  ),
  ChevronDown: () => (
    <svg
      className="w-3 h-3"
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  Check: () => (
    <svg
      className="w-3 h-3"
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
}

export function ThemeToggle({
  variant = 'outline',
  size = 'medium',
  className = '',
  showText = false,
  align = 'bottom-right',
}: ThemeToggleProps) {
  const { themeConfig, saveTheme } = useThemeCustomization()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Obter o tema atual do themeConfig
  const currentTheme = themeConfig?.appearance?.themeMode || 'light'

  const themeOptions = [
    { value: 'light' as const, label: 'Claro', icon: Icons.Sun },
    { value: 'dark' as const, label: 'Escuro', icon: Icons.Moon },
    { value: 'system' as const, label: 'Sistema', icon: Icons.Monitor },
  ]

  const currentThemeOption = themeOptions.find(
    (opt) => opt.value === currentTheme
  )

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        buttonRef.current?.focus()
      }
    }
    if (isOpen) document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const handleThemeSelect = (value: 'light' | 'dark' | 'system') => {
    // Atualizar o tema mantendo as outras configurações
    const updatedTheme = {
      ...themeConfig,
      appearance: {
        ...themeConfig?.appearance,
        borderRadius: themeConfig?.appearance?.borderRadius || 6,
        fontFamily: themeConfig?.appearance?.fontFamily || 'Inter, sans-serif',
        themeMode: value,
      },
    }

    saveTheme(updatedTheme)
    setIsOpen(false)
  }

  const sizeMap = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-3 py-2 text-sm',
    large: 'px-4 py-2 text-base',
  }

  const variantMap = {
    default: 'bg-primary text-primary-foreground border border-primary',
    outline: 'bg-transparent text-foreground border border-border',
    ghost: 'bg-transparent text-foreground border-transparent',
  }

  const dropdownPosition = {
    'bottom-right': 'top-full right-0 mt-1',
    'bottom-left': 'top-full left-0 mt-1',
    'top-right': 'bottom-full right-0 mb-1',
    'top-left': 'bottom-full left-0 mb-1',
  }

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${sizeMap[size]} ${variantMap[variant]} ${className}`}
        aria-label="Alternar tema"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {!showText && (
          <>
            <div className="theme-toggle-sun transition-all dark:scale-0 dark:rotate-90 dark:opacity-0">
              <Icons.Sun />
            </div>
            <div className="absolute transition-all scale-0 rotate-90 opacity-0 dark:scale-100 dark:rotate-0 dark:opacity-100">
              <Icons.Moon />
            </div>
          </>
        )}

        {showText && currentThemeOption && (
          <>
            <currentThemeOption.icon />
            <span>{currentThemeOption.label}</span>
            <Icons.ChevronDown />
          </>
        )}
      </button>

      {isOpen && (
        <div
          role="menu"
          className={`absolute z-50 min-w-40 rounded-md border border-border bg-card p-1 shadow-lg ${dropdownPosition[align]}`}
        >
          {themeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleThemeSelect(option.value)}
              className={`flex w-full items-center justify-between gap-2 rounded px-3 py-2 text-sm transition-colors hover:bg-accent text-foreground ${
                currentTheme === option.value ? 'bg-accent font-semibold' : ''
              }`}
              role="menuitem"
            >
              <span className="flex items-center gap-2">
                <option.icon />
                {option.label}
              </span>
              {currentTheme === option.value && <Icons.Check />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
