'use client'
// TODO: REescrever usando dinamic form
import { GetPapel, PatchPapel, PostPapel } from '@/client/types.gen'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/contexts/ToastContext'
import { getDifferences, msgError } from '@/utils/functions'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const PapelFormSchema = z.object({
  nome: z.string().min(2, {
    message: 'O nome deve ter pelo menos 2 caracteres',
  }),
  descricao: z.string().optional(),
  ativo: z.boolean(),
})

type PapelFormValues = z.infer<typeof PapelFormSchema>

interface PapelFormProps {
  defaultValues?: GetPapel
  open: boolean
  onClose: () => void
  onSuccess: () => void
  create: (data: PostPapel) => Promise<void>
  update: (id: string, data: PatchPapel) => Promise<void>
  isLoading: boolean
}

export function PapelForm({
  defaultValues,
  open,
  onClose,
  onSuccess,
  create,
  update,
  isLoading,
}: PapelFormProps) {
  const { toast } = useToast()

  const form = useForm<PapelFormValues>({
    resolver: zodResolver(PapelFormSchema),
    defaultValues: {
      nome: defaultValues?.nome || '',
      descricao: defaultValues?.descricao || '',
      ativo: defaultValues?.ativo || true,
    },
  })

  const handleSubmit = async (data: PostPapel) => {
    try {
      if (defaultValues) {
        // Modo edição
        const sendData = getDifferences(defaultValues, data)

        await update(defaultValues.id ?? '', sendData as PatchPapel)
        toast.success('Perfil atualizado com sucesso')
      } else {
        // Modo criação
        await create(data)
        toast.success('Perfil criado com sucesso')
      }

      onClose()
      onSuccess()
    } catch (err) {
      const dataMessage = msgError(err)
      toast.error(dataMessage.message)
    }
  }

  React.useEffect(() => {
    if (defaultValues) {
      form.reset({
        nome: defaultValues?.nome || '',
        descricao: defaultValues?.descricao || '',
        ativo: defaultValues?.ativo || true,
      })
    } else {
      form.reset({
        nome: '',
        descricao: '',
        ativo: true,
      })
    }
  }, [defaultValues, form])

  return (
    <>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" />

          <div className="relative z-50 w-full max-w-md bg-white rounded-lg shadow-lg p-6">
            {/* Botão de fechar no canto superior direito */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
              aria-label="Fechar modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2 className="text-xl font-semibold text-black text-center mb-8">
              {defaultValues ? 'Editar Perfil' : 'Cadastrar Novo Perfil'}
            </h2>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="descricao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ativo"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormLabel>Ativo</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                    onClick={onClose}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? defaultValues
                        ? 'Atualizando...'
                        : 'Salvando...'
                      : defaultValues
                        ? 'Atualizar'
                        : 'Salvar'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
    </>
  )
}
