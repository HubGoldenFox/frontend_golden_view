// components/logo.tsx
import { useAuthTenant } from '@/hooks/useAuthTenant'
import Image from 'next/image'
import { forwardRef } from 'react'

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  className?: string
  withIcon?: boolean
}

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
}

const iconSizeClasses = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-7 w-7',
  '2xl': 'h-8 w-8',
  '3xl': 'h-9 w-9',
  '4xl': 'h-10 w-10',
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ size = 'md', className = '', withIcon = false }, ref) => {
    const { isAdminMode, tenant } = useAuthTenant()

    return (
      <div
        ref={ref}
        aria-label="Logo GestorIA360"
        className={`flex items-center font-bold tracking-tight ${sizeClasses[size]} ${className}`}
      >
        {!isAdminMode &&
        tenant &&
        tenant?.configuracao &&
        tenant?.configuracao?.logoBase64 ? (
          <>
            <Image
              src={tenant?.configuracao?.logoBase64 ?? ''}
              alt={'logo da aplicação'}
              width={180}
              height={180}
            />
          </>
        ) : (
          <>
            {withIcon && (
              <svg
                className={`mr-2 ${iconSizeClasses[size]}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 10H5a1 1 0 000 2h4a1 1 0 100-2zm1-6a1 1 0 011 1v4a1 1 0 11-2 0V5a1 1 0 011-1z" />
              </svg>
            )}
            <span className="text-foreground">Gestor</span>
            <span className="text-primary">AI</span>
            <span className="text-muted-foreground">360</span>
          </>
        )}
      </div>
    )
  }
)

Logo.displayName = 'Logo'
export default Logo
