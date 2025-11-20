'use client'

import { Button } from '@/components/custom/Button'
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface ConfirmationDialogProps {
  title: string
  description: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void> | void
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive' | 'warning' | 'info'
}

export function ConfirmationDialog({
  title,
  description,
  open,
  onOpenChange,
  onConfirm,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'destructive',
}: ConfirmationDialogProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
    } catch (error) {
      // console.error('Erro ao executar ação:', error)
    } finally {
      setLoading(false)
      onOpenChange(false)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      onOpenChange(false)
    }
  }

  const getIcon = () => {
    switch (variant) {
      case 'destructive':
        return <Trash2 className="h-10 w-10 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-10 w-10 text-amber-500" />
      default:
        return <AlertTriangle className="h-10 w-10 text-blue-500" />
    }
  }

  const getConfirmButtonStyle = () => {
    switch (variant) {
      case 'destructive':
        return 'bg-red-500 hover:bg-red-600 text-white'
      case 'warning':
        return 'bg-amber-500 hover:bg-amber-600 text-white'
      default:
        return 'bg-blue-500 hover:bg-blue-600 text-white'
    }
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 h-full bg-black/80"></div>

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-auto">
          {/* Conteúdo */}
          <div className="p-6">
            {/* Ícone e Título */}
            <div className="flex flex-col items-center gap-2 text-center mb-4">
              <div className="rounded-full bg-gray-100 p-3">{getIcon()}</div>
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            </div>

            {/* Descrição */}
            <div className="py-2 text-center text-gray-600">{description}</div>

            {/* Botões */}
            <div className="flex flex-row justify-center gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                className="px-4 py-2"
              >
                {cancelText}
              </Button>
              <Button
                type="button"
                className={`${getConfirmButtonStyle()} px-4 py-2`}
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
