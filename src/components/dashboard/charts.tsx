'use client'

import { useEffect, useState } from 'react'

// Componente LineChart
export function LineChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted)
    return (
      <div className="h-[300px] flex items-center justify-center">
        Carregando gráfico...
      </div>
    )

  return (
    <div className="h-[300px] w-full">
      {/* Simulação de um gráfico de linha */}
      <div className="h-full w-full bg-linear-to-r from-blue-50 to-blue-100 rounded-md relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-[60%] flex items-end">
          <div className="w-1/6 h-[30%] bg-blue-500 opacity-70 mx-1"></div>
          <div className="w-1/6 h-[45%] bg-blue-500 opacity-70 mx-1"></div>
          <div className="w-1/6 h-[60%] bg-blue-500 opacity-70 mx-1"></div>
          <div className="w-1/6 h-[40%] bg-blue-500 opacity-70 mx-1"></div>
          <div className="w-1/6 h-[70%] bg-blue-500 opacity-70 mx-1"></div>
          <div className="w-1/6 h-[80%] bg-blue-500 opacity-70 mx-1"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[60%] flex items-end">
          <div className="w-1/6 h-[20%] bg-green-500 opacity-70 mx-1"></div>
          <div className="w-1/6 h-[35%] bg-green-500 opacity-70 mx-1"></div>
          <div className="w-1/6 h-[50%] bg-green-500 opacity-70 mx-1"></div>
          <div className="w-1/6 h-[60%] bg-green-500 opacity-70 mx-1"></div>
          <div className="w-1/6 h-[55%] bg-green-500 opacity-70 mx-1"></div>
          <div className="w-1/6 h-[65%] bg-green-500 opacity-70 mx-1"></div>
        </div>
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
            <span className="text-xs">Score Geral</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            <span className="text-xs">Taxa de Conversão</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente BarChart
export function BarChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted)
    return (
      <div className="h-[300px] flex items-center justify-center">
        Carregando gráfico...
      </div>
    )

  return (
    <div className="h-[300px] w-full">
      {/* Simulação de um gráfico de barras */}
      <div className="h-full w-full bg-linear-to-r from-blue-50 to-blue-100 rounded-md relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-[80%] flex items-end justify-around px-4">
          <div className="flex flex-col items-center">
            <div className="w-16 h-[75%] bg-blue-500 opacity-70 rounded-t-md"></div>
            <span className="text-xs mt-2">Cordialidade</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-[60%] bg-blue-500 opacity-70 rounded-t-md"></div>
            <span className="text-xs mt-2">Conhecimento</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-[85%] bg-blue-500 opacity-70 rounded-t-md"></div>
            <span className="text-xs mt-2">Identificação</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-[50%] bg-blue-500 opacity-70 rounded-t-md"></div>
            <span className="text-xs mt-2">Resolução</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-[70%] bg-blue-500 opacity-70 rounded-t-md"></div>
            <span className="text-xs mt-2">Fechamento</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente PieChart
export function PieChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted)
    return (
      <div className="h-[300px] flex items-center justify-center">
        Carregando gráfico...
      </div>
    )

  return (
    <div className="h-[300px] w-full flex items-center justify-center">
      {/* Simulação de um gráfico de pizza */}
      <div className="relative w-48 h-48">
        <div className="absolute inset-0 rounded-full border-8 border-blue-500"></div>
        <div
          className="absolute inset-0 rounded-full border-8 border-green-500"
          style={{ clipPath: 'polygon(50% 50%, 100% 50%, 100% 0, 50% 0)' }}
        ></div>
        <div
          className="absolute inset-0 rounded-full border-8 border-yellow-500"
          style={{ clipPath: 'polygon(50% 50%, 50% 0, 0 0, 0 50%)' }}
        ></div>
        <div
          className="absolute inset-0 rounded-full border-8 border-red-500"
          style={{ clipPath: 'polygon(50% 50%, 0 50%, 0 100%, 50% 100%)' }}
        ></div>
        <div
          className="absolute inset-0 rounded-full border-8 border-purple-500"
          style={{
            clipPath: 'polygon(50% 50%, 50% 100%, 100% 100%, 100% 50%)',
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold">7.8</span>
        </div>
      </div>
      <div className="ml-8 space-y-2">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-xs">Cordialidade (25%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-xs">Conhecimento (20%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
          <span className="text-xs">Identificação (20%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-xs">Resolução (15%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
          <span className="text-xs">Fechamento (20%)</span>
        </div>
      </div>
    </div>
  )
}
