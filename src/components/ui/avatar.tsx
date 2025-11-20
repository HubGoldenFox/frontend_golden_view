import Image from 'next/image'
import type React from 'react'

interface AvatarProps {
  className?: string
  children: React.ReactNode
}

interface AvatarImageProps {
  src: string
  alt: string
  className?: string
}

interface AvatarFallbackProps {
  className?: string
  children: React.ReactNode
}

/**
 * Componente Avatar principal
 * Container para imagem de perfil ou fallback
 */
export const Avatar: React.FC<AvatarProps> = ({ className = '', children }) => {
  const baseClasses =
    'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full'
  const finalClasses = `${baseClasses} ${className}`.trim()
  return <div className={finalClasses}>{children}</div>
}

/**
 * Imagem do avatar usando Next.js Image
 */
export const AvatarImage: React.FC<AvatarImageProps> = ({
  className = '',
  src,
  alt,
}) => {
  const baseClasses = 'object-cover'
  const finalClasses = `${baseClasses} ${className}`.trim()

  return (
    <Image
      src={src || '/default-avatar.png'}
      alt={alt}
      fill
      className={finalClasses}
      sizes="40px" // ou "2.5rem"
      priority // opcional, dependendo do uso
    />
  )
}

/**
 * Fallback do avatar (quando não há imagem)
 */
export const AvatarFallback: React.FC<AvatarFallbackProps> = ({
  className = '',
  children,
}) => {
  const baseClasses =
    'flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground'
  const finalClasses = `${baseClasses} ${className}`.trim()
  return <div className={finalClasses}>{children}</div>
}
