'use client'

import { useToast } from '@/contexts/ToastContext'
import { Edit, Eye, Mail, Phone, Plus, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { ConfirmationDialog } from '@/components/custom/ConfimationModal'
import { api } from '@/config/axiosConfig'
import { useAuthTenant } from '@/hooks/useAuthTenant'

import {
  ActionButton,
  ColumnConfig,
  DataTable,
  TableAction,
  TableFetchParams,
} from '@/components/custom/Table'

import { DynamicForm } from '@/components/custom/Form'
import { Modal } from '@/components/custom/Modal'

import { useHook as usePapeis } from '@/hooks/usePapeis'
import { useHook as useUsuarios } from '@/hooks/useUsuarios'

import {
  GetUsuarios as GetItems,
  PatchUsuarios as PatchItems,
  PostUsuarios as PostItems,
  LerUsuariosData as QueryParams,
} from '@/client/types.gen'
import { FormField } from '@/types/form'
import { msgError } from '@/utils/functions'
import { masks } from '@/utils/masks'
import { getChangedPropertiesSimple } from '@/utils/objectDiff'

type typeForm = 'create' | 'update' | 'view' | 'link'

export default function UsuariosPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<GetItems | null>(null)
  const [isFormLinkOpen, setIsFormLinkOpen] = useState(false)
  const [selectedFormMode, setSelectedFormMode] = useState<typeForm>('create')
  const [link, setLink] = useState<string | null>(null)

  const { data, isLoading, error, fetchData, create, update, remove } =
    useUsuarios()

  const { toast } = useToast()
  const { tenant } = useAuthTenant()

  const {
    data: papeis,
    isLoading: isLoadingPapeis,
    fetchData: fetchPapeis,
  } = usePapeis()

  const handleNewItem = () => {
    setSelectedItem(null)
    setSelectedFormMode('create')
    setIsFormOpen(true)
  }

  const handleView = (item: GetItems) => {
    setSelectedFormMode('view')
    setSelectedItem(item)
    setIsFormOpen(true)
  }

  const handleEdit = (item: GetItems) => {
    setSelectedFormMode('update')
    setSelectedItem(item)
    setIsFormOpen(true)
  }

  const handleDelete = (item: GetItems) => {
    setSelectedItem(item)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (selectedItem?.id) {
      await remove(selectedItem.id)
      fetchData({
        limit: data?.meta?.items_per_page || 10,
        offset: 0,
        sort_op: 'DESC',
        sort_field: 'criado_em',
      })
    }
    setIsDeleteDialogOpen(false)
  }

  const handleCancelForm = () => {
    setSelectedItem(null)
    setIsFormOpen(false)

    fetchPapeis({
      limit: 10,
      offset: 0,
      sort_op: 'DESC',
      sort_field: 'criado_em',
    })
  }

  const handleSubmitForm = async (item: PostItems | PatchItems) => {
    setSubmitting(true)

    try {
      if (selectedFormMode === 'create') {
        await create(item as PostItems)
        toast.success('Item criado com sucesso!')
      } else {
        const changes = getChangedPropertiesSimple(
          selectedItem as GetItems,
          item as Partial<GetItems>
        )
        if (Object.keys(changes).length === 0) {
          toast.info('Nenhuma alteração detectada.')
          setIsFormOpen(false)
          return
        }

        if (selectedItem?.id) {
          await update(selectedItem.id, item)
          toast.success('Item atualizado com sucesso!')
        }
      }

      setIsFormOpen(false)
      fetchData({
        limit: data?.meta?.items_per_page || 10,
        offset: 0,
        sort_op: 'DESC',
        sort_field: 'criado_em',
      })
    } catch (err) {
      const { message } = msgError(err)
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const adaptTableParamsToQuery = (
    params: TableFetchParams
  ): QueryParams['query'] => {
    return {
      limit: params.itemsPerPage,
      offset: (params.page - 1) * params.itemsPerPage,
      nome_completo: params.searchTerm || undefined,
      sort_field: (params.sortField as any) || 'criado_em',
      sort_op: params.sortDirection === 'asc' ? 'ASC' : 'DESC',
      expand: ['papeis'],
    }
  }

  // No seu componente pai
  const fetchDataAdapted = useCallback(
    async (tableParams: TableFetchParams) => {
      const query = adaptTableParamsToQuery(tableParams)
      return fetchData(query)
    },
    [fetchData]
  )

  const handleLink = () => {
    setSelectedFormMode('link')
    setIsFormLinkOpen(true)
  }

  const handleGenerateLink = async (
    papelID: string | number | null,
    expireTime: number
  ) => {
    if (papelID) {
      const response = await api.get('/usuarios/link-cadastro', {
        params: {
          papel_id: papelID,
          token_expiration: expireTime,
        },
      })

      if (response && response.data && response.data.token) {
        if (tenant && tenant.subdominio) {
          const url = `${process.env.NEXT_PUBLIC_ROOT_DOMAIN}/${tenant?.subdominio}/registro?t=${response.data.token}`
          // const url = `http://localhost:3000/${tenant?.subdominio}/registro?t=${response.data.token}`
          setLink(url)
        } else if (tenant && tenant.dominio) {
          const url = `${tenant?.dominio}/registro?t=${response.data.token}`
          setLink(url)
        }
      }
    }
  }

  const handleDeleteMultiple = async (items: GetItems[]) => {
    try {
      // Cria um array de promises de exclusão
      const deletePromises = items.map((item) => remove(item.id || ''))

      // Executa todas as requisições em paralelo
      await Promise.all(deletePromises)

      // Atualiza os dados após todas as exclusões
      await fetchData({
        limit: data?.meta?.items_per_page || 10,
        offset: 0,
        sort_op: 'DESC',
        sort_field: 'criado_em',
      })

      toast.success(`${items.length} itens excluídos com sucesso!`)
    } catch (error) {
      // toast.error('Erro ao excluir itens')
    }
  }

  const getUsuarioFormFields = (mode: typeForm): FormField[] => {
    const baseFields: FormField[] = [
      {
        name: 'nome_completo',
        label: 'Nome Completo',
        type: 'text',
        required: true,
        placeholder: 'Ex: João da Silva',
        colSpan: 2,
        validation: {
          minLength: 3,
          maxLength: 100,
        },
      },
      {
        name: 'nome_usuario',
        label: 'Login',
        type: 'text',
        required: true,
        placeholder: 'Ex: joao.silva',
        colSpan: 1,
        validation: {
          minLength: 3,
          maxLength: 20,
        },
      },
      {
        name: 'email',
        label: 'E-mail',
        type: 'email',
        required: true,
        placeholder: 'Ex: joao@empresa.com',
        colSpan: 1,
        validation: {
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        },
      },
      {
        name: 'telefone',
        label: 'Telefone',
        type: 'phone',
        required: false,
        placeholder: 'Ex: (11) 98765-4321',
        colSpan: 1,
      },
      {
        name: 'papel_id',
        label: 'Perfil',
        type: 'select',
        placeholder: 'Selecione um perfil',
        options: papeis?.data?.map((item) => ({
          value: item.id || '',
          label: item.nome || '',
        })),
        loading: isLoadingPapeis,
        required: true,
        selectConfig: {
          searchable: true,
          asyncSearch: true,
          onSearch: (searchTerm: string) => {
            fetchPapeis({
              limit: 10,
              offset: 0,
              nome: `lk:${searchTerm}`,
              sort_op: 'DESC',
              sort_field: 'criado_em',
            })
          },
          minSearchLength: 2,
          noOptionsMessage: 'Nenhum perfil encontrado',
        },
        colSpan: 1,
      },
      {
        name: 'ativo',
        label: 'Status',
        type: 'checkbox',
        required: false,
        defaultValue: true,
        colSpan: 2,
      },
    ]

    // Campos de senha apenas para criação
    const passwordFields: FormField[] =
      mode === 'create'
        ? [
            {
              name: 'senha',
              label: 'Senha',
              type: 'password',
              required: true,
              placeholder: 'Digite sua senha',
              validation: {
                rules: [
                  {
                    type: 'required',
                    message: 'Senha é obrigatória',
                  },
                  {
                    type: 'minLength',
                    value: 8,
                    message: 'Senha deve ter pelo menos 8 caracteres',
                  },
                  {
                    type: 'pattern',
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message:
                      'Senha deve conter letras maiúsculas, minúsculas e números',
                  },
                ],
              },
              colSpan: 1,
            },
            {
              name: 'confirmPassword',
              label: 'Confirmar Senha',
              type: 'password',
              required: true,
              placeholder: 'Confirme sua senha',
              validation: {
                rules: [
                  {
                    type: 'required',
                    message: 'Confirmação de senha é obrigatória',
                  },
                  {
                    type: 'custom',
                    message: 'As senhas não coincidem',
                    validator: (value, formData) => value === formData?.senha,
                  },
                ],
              },
              colSpan: 1,
            },
          ]
        : []

    return [...baseFields, ...passwordFields]
  }

  // Uso no componente
  const FormFields = getUsuarioFormFields(selectedFormMode)

  const actions: TableAction<GetItems>[] = [
    {
      label: 'Detalhes',
      icon: <Eye className="h-4 w-4" />,
      variant: 'view',
      onClick: handleView,
    },
    {
      label: 'Editar',
      icon: <Edit className="h-4 w-4" />,
      variant: 'edit',
      onClick: handleEdit,
    },
    {
      label: 'Excluir',
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'delete',
      onClick: handleDelete,
    },
  ]

  const columns: ColumnConfig<GetItems>[] = [
    {
      header: 'Usuário',
      accessor: 'nome_usuario',
      sortable: true,
      searchable: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
            {row.nome_usuario?.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <div className="font-medium flex items-center gap-2">
              {row.nome_usuario}
            </div>
            <div className="text-xs text-muted-foreground">
              {row.nome_completo || 'Sem nome completo'}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: 'Contato',
      accessor: 'email',
      sortable: true,
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-blue-500" />
            <span>{row.email}</span>
          </div>
          {row.telefone && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              {masks.phone(row.telefone)}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'ativo',
      sortable: true,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${row.ativo ? 'bg-green-500' : 'bg-red-500'}`}
          />
          <span className="text-sm">{row.ativo ? 'Ativo' : 'Inativo'}</span>
        </div>
      ),
    },
    {
      header: 'Criação',
      accessor: 'criado_em',
      sortable: true,
      cell: ({ row }) => (
        <div className="text-xs text-muted-foreground">
          {new Date(row.criado_em || '').toLocaleDateString('pt-BR')}
        </div>
      ),
    },
    {
      header: 'Atualização',
      accessor: 'atualizado_em',
      sortable: true,
      visible: false,
      cell: ({ row }) =>
        row.atualizado_em ? (
          <div className="text-xs text-muted-foreground">
            {new Date(row.atualizado_em || '').toLocaleDateString('pt-BR')}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Nunca</span>
        ),
    },
  ]

  const tableButtons: ActionButton[] = [
    {
      label: 'Link',
      onClick: handleLink,
      icon: <Plus className="h-4 w-4 mr-2" />,
    },
    {
      label: 'Novo',
      onClick: handleNewItem,
      icon: <Plus className="h-4 w-4 mr-2" />,
    },
  ]

  useEffect(() => {
    fetchPapeis({
      limit: 100,
      offset: 0,
      sort_op: 'DESC',
      sort_field: 'criado_em',
    })
  }, [])

  return (
    <div className="mx-auto py-6 space-y-6">
      {/* Tabela */}
      <DataTable
        data={data?.data || []}
        meta={data?.meta || {}}
        actions={actions}
        columns={columns}
        onFetchData={fetchDataAdapted}
        isLoading={isLoading}
        initialItemsPerPage={data?.meta?.items_per_page || 10}
        className="shadow-lg"
        buttons={tableButtons}
        onDeleteSelected={handleDeleteMultiple}
        title="Lista de Usuários"
      />

      {/* Modal do Formulário */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
        <div className="bg-card text-card-foreground rounded-lg">
          {selectedFormMode === 'create' ? (
            <DynamicForm
              title="Criar Usuário"
              fields={FormFields}
              loading={submitting}
              onSubmit={handleSubmitForm}
              onCancel={handleCancelForm}
              mode="create"
            />
          ) : selectedFormMode === 'update' ? (
            <DynamicForm
              title="Editar Usuário"
              fields={FormFields}
              initialData={selectedItem || undefined}
              loading={submitting}
              onSubmit={handleSubmitForm}
              onCancel={handleCancelForm}
              mode="edit"
            />
          ) : (
            <DynamicForm
              title="Detalhes do Usuário"
              fields={FormFields}
              initialData={selectedItem || undefined}
              loading={submitting}
              onSubmit={handleSubmitForm}
              onCancel={handleCancelForm}
              mode="view"
            />
          )}
        </div>
      </Modal>

      {/* Modal de Exclusão */}
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Excluir item"
        description="Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita."
        onConfirm={handleDeleteConfirm}
        variant="destructive"
        confirmText="Excluir"
      />
    </div>
  )
}
