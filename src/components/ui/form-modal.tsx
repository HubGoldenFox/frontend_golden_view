'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type React from 'react'

interface FormModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  title: string
  children: React.ReactNode
  isSaving?: boolean
  isValid?: boolean
}

export function FormModal({
  isOpen,
  onClose,
  onSave,
  title,
  children,
  isSaving = false,
  isValid = true,
}: FormModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">{children}</div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={onSave}
            disabled={isSaving || !isValid}
          >
            {isSaving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
