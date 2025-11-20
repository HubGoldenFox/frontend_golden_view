'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AlertTriangle, CheckCircle, Info, Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface ConfirmationDialogProps {
  title: string
  description: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void> | void
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'destructive' | 'warning' | 'success'
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
      console.error('Erro ao executar ação:', error)
    } finally {
      setLoading(false)
      onOpenChange(false)
    }
  }

  const getIcon = () => {
    switch (variant) {
      case 'destructive':
        return <Trash2 className="h-10 w-10 text-red-500 dark:text-red-400" />
      case 'warning':
        return (
          <AlertTriangle className="h-10 w-10 text-amber-500 dark:text-amber-400" />
        )
      case 'success':
        return (
          <CheckCircle className="h-10 w-10 text-green-500 dark:text-green-400" />
        )
      default:
        return <Info className="h-10 w-10 text-blue-500 dark:text-blue-400" />
    }
  }

  const getIconContainerStyle = () => {
    switch (variant) {
      case 'destructive':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      case 'warning':
        return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
    }
  }

  const getConfirmButtonStyle = () => {
    switch (variant) {
      case 'destructive':
        return 'bg-red-600 hover:bg-red-700 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-800'
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 dark:bg-amber-700 dark:hover:bg-amber-800'
      case 'success':
        return 'bg-green-600 hover:bg-green-700 focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-800'
      default:
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-800'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] border-0 shadow-xl dark:border dark:border-gray-800">
        <DialogHeader className="flex flex-col items-center gap-2 text-center">
          <div
            className={`rounded-full p-4 border ${getIconContainerStyle()} mb-2`}
          >
            {getIcon()}
          </div>
          <DialogTitle className="text-xl text-gray-900 dark:text-white">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 text-center text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          {description}
        </div>
        <DialogFooter className="flex flex-row justify-center gap-3 sm:justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            className={`text-white ${getConfirmButtonStyle()} focus:ring-2 focus:ring-offset-2 transition-colors`}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
