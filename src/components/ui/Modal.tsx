'use client'

import type React from 'react'

import {
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Info,
  X,
  XCircle,
} from 'lucide-react'
import { useEffect } from 'react'

export type ModalType = 'success' | 'error' | 'warning' | 'info' | 'confirm'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  title: string
  message: string
  type?: ModalType
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
}

const modalStyles = {
  success: {
    icon: CheckCircle,
    iconColor: 'text-emerald-500',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    buttonColor: 'bg-emerald-500 hover:bg-emerald-600',
  },
  error: {
    icon: XCircle,
    iconColor: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    buttonColor: 'bg-red-500 hover:bg-red-600',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    buttonColor: 'bg-amber-500 hover:bg-amber-600',
  },
  info: {
    icon: Info,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    buttonColor: 'bg-blue-500 hover:bg-blue-600',
  },
  confirm: {
    icon: HelpCircle,
    iconColor: 'text-indigo-500',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    buttonColor: 'bg-indigo-500 hover:bg-indigo-600',
  },
}

export function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info',
  confirmText = 'OK',
  cancelText = 'Cancelar',
  showCancel = false,
}: ModalProps) {
  const style = modalStyles[type]
  const IconComponent = style.icon

  // Fechar modal com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    onClose()
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div
        className={`
          relative w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl border-2 
          ${style.borderColor} animate-in zoom-in-95 duration-200
        `}
      >
        {/* Header */}
        <div
          className={`px-6 py-4 ${style.bgColor} rounded-t-2xl border-b ${style.borderColor}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`p-2 rounded-full bg-white/80 ${style.iconColor}`}
              >
                <IconComponent className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/60 transition-colors text-slate-500 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-slate-600 leading-relaxed whitespace-pre-line">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-slate-50/50 rounded-b-2xl border-t border-slate-200">
          <div
            className={`flex gap-3 ${showCancel || type === 'confirm' ? 'justify-end' : 'justify-center'}`}
          >
            {(showCancel || type === 'confirm') && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-medium"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className={`
                px-6 py-2 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl
                ${style.buttonColor}
              `}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
