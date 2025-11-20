import type { GetPapeis } from '@/client/types.gen'
import { Button } from '@/components/custom/Button'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useToast } from '@/contexts/ToastContext'
import { msgError } from '@/utils/functions'
import { X } from 'lucide-react'

interface DeletePapelDialogProps {
  item: GetPapeis | null
  open: boolean
  onClose: () => void
  onSuccess: () => void
  remove: (id: string) => Promise<void>
  isLoading: boolean
}

export function DeletePapelDialog({
  item,
  open,
  onClose,
  onSuccess,
  remove,
  isLoading,
}: DeletePapelDialogProps) {
  const textDelete = 'Perfil'
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!item?.id) return

    try {
      await remove(item.id)
      toast.success(`${textDelete} excluído com sucesso!`)
      onClose()
      onSuccess()
    } catch (error: unknown) {
      const handleApiError = msgError(error)
      toast.error(
        handleApiError.message || `Erro ao excluir ${textDelete.toLowerCase()}`
      )
    }
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background
            transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring
            focus:ring-offset-2 disabled:pointer-events-none cursor-pointer"
          onClick={() => onClose()}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Fechar</span>
        </button>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir {textDelete}</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este {textDelete.toLowerCase()}? Esta
            ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => onClose()}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            className="cursor-pointer"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
