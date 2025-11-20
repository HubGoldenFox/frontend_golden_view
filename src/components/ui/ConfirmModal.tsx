'use client'

import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react'
import { useEffect } from 'react'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'warning' | 'danger'
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
}: ConfirmModalProps) {
  // Fechar com ESC
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Bloquear scroll do body quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <AlertCircle className="w-6 h-6 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-amber-500" />
      default:
        return <Info className="w-6 h-6 text-blue-500" />
    }
  }

  const getConfirmButtonStyles = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500'
      default:
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
    }
  }

  return (
    <div className="fixed inset-0 z-1000 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-999"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4 z-1000">
        <div className="relative w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all z-1001">
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <div className="flex items-center space-x-3">
              {getIcon()}
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            <p className="text-sm text-gray-600 leading-relaxed">{message}</p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 px-6 pb-6">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${getConfirmButtonStyles()}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
