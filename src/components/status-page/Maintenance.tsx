// components/status-page/Maintenance.tsx
'use client'

import { Construction } from 'lucide-react'
import { ReactNode } from 'react'

interface MaintenanceProps {
  return_date: string
  title?: ReactNode
  message?: ReactNode
  children?: ReactNode
}

export default function Maintenance({
  return_date,
  title = 'Estamos melhorando sua experiência',
  message = 'Nosso site está passando por atualizações importantes. Volte em breve para conferir as novidades!',
  children,
}: MaintenanceProps) {
  const returnDate = new Date(return_date)
  const formattedDate = returnDate.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
  const formattedTime = returnDate.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4 text-center">
      <div className="max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center rounded-full bg-yellow-100 px-6 py-3 text-lg font-medium text-yellow-800 mb-8">
          <Construction className="h-6 w-6 mr-2" />
          EM MANUTENÇÃO
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
          {title}
        </h1>

        <p className="text-xl text-gray-600 mb-10">{message}</p>

        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Retornaremos em Breve
          </h2>

          <p className="text-lg text-gray-600 mt-4">
            Previsão: {formattedDate} às {formattedTime}
          </p>
        </div>

        {children && <div className="mt-8">{children}</div>}

        <div className="mt-12 text-gray-500">
          <p>
            {new Date().getFullYear()} Golden View 360. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
