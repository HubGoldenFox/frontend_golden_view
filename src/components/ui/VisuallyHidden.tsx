'use client'

import React from 'react'

interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * O elemento HTML a ser renderizado
   * @default 'span'
   */
  asChild?: boolean
  /**
   * Conteúdo a ser escondido visualmente
   */
  children: React.ReactNode
}

/**
 * VisuallyHidden - Esconde conteúdo visualmente mas mantém acessível para leitores de tela
 *
 * Equivalente ao VisuallyHidden do Radix UI
 * Usado para melhorar a acessibilidade sem afetar o layout visual
 */
export function VisuallyHidden({
  children,
  asChild = false,
  className = '',
  ...props
}: VisuallyHiddenProps) {
  const visuallyHiddenStyles = {
    position: 'absolute' as const,
    border: 0,
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap' as const,
    wordWrap: 'normal' as const,
  }

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...props,
      style: {
        ...visuallyHiddenStyles,
        ...children.props.style,
      },
      className: `${className} ${children.props.className || ''}`.trim(),
    })
  }

  return (
    <span
      {...props}
      style={{
        ...visuallyHiddenStyles,
        ...props.style,
      }}
      className={className}
    >
      {children}
    </span>
  )
}

// Componente alternativo usando classes CSS (mais performático)
export function VisuallyHiddenCSS({
  children,
  className = '',
  ...props
}: Omit<VisuallyHiddenProps, 'asChild'>) {
  return (
    <span {...props} className={`sr-only ${className}`.trim()}>
      {children}
    </span>
  )
}

export default VisuallyHidden
