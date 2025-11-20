'use client'

import { Rocket } from 'lucide-react'
import { ReactNode, useEffect, useMemo, useState } from 'react'

interface ComingSoonProps {
  launch_date?: string
  product_name?: string
  title?: ReactNode
  message?: ReactNode
  badgeText?: string
  badgeIcon?: ReactNode
  variant?: 'full' | 'compact'
  theme?: {
    primaryColor?: string
    secondaryColor?: string
  }
  showCountdown?: boolean
  showLaunchDate?: boolean
  children?: ReactNode
}

export function ComingSoon({
  launch_date,
  product_name = 'nosso serviço',
  title = `Algo incrível está chegando!`,
  message = `Estamos preparando ${product_name} com muito cuidado. Fique atento para o lançamento!`,
  badgeText = 'EM BREVE',
  variant = 'full',
  badgeIcon = <Rocket className="h-6 w-6 mr-2" />,
  theme = {
    primaryColor: 'var(--color-primary)',
    secondaryColor: 'var(--color-primary-50)',
  },
  showCountdown = true,
  showLaunchDate = true,
  children,
}: ComingSoonProps) {
  const [isLaunched, setIsLaunched] = useState(false)

  const timeLeft = null

  const launchDate = useMemo(() => {
    return launch_date ? new Date(launch_date) : null
  }, [launch_date])

  const formattedDate = launchDate?.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
  const formattedTime = launchDate?.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  useEffect(() => {
    if (launchDate) {
      const now = new Date()
      setIsLaunched(now >= launchDate)
    }
  }, [launchDate, timeLeft])

  const shouldShowCountdown =
    showCountdown && launch_date && timeLeft && !isLaunched
  const shouldShowDefaultMessage = !isLaunched || !launch_date

  // ✅ Se o conteúdo estiver liberado, renderiza apenas os children
  if (isLaunched && launch_date) {
    return <>{children}</>
  }

  // ✅ Caso contrário, mostra a tela de "Coming Soon"
  return (
    <div
      className={`${
        variant === 'full'
          ? 'min-h-screen bg-gradient-primary from-primary-50 to-background'
          : 'bg-background rounded-md border shadow-sm p-4'
      } flex flex-col items-center justify-center text-center`}
    >
      <div className="max-w-2xl mx-auto">
        {shouldShowDefaultMessage && (
          <>
            <div className="inline-flex items-center justify-center rounded-full px-6 py-3 text-lg font-medium mb-8 bg-primary text-primary-foreground">
              {badgeIcon}
              {badgeText}
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 text-foreground">
              {title}
            </h1>

            <p className="text-xl text-muted-foreground mb-10">{message}</p>
          </>
        )}

        <div className="mt-12 text-muted-foreground">
          <p>
            {new Date().getFullYear()} GestorIA 360. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
