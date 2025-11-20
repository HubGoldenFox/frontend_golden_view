'use client'

import { Edit, Eye, Plus, Shield, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { ConfirmationDialog } from '@/components/custom/ConfimationModal'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PermissionModal } from './components/PermissaoAcesso'

import {
  ActionButton,
  ColumnConfig,
  DataTable,
  TableAction,
  TableFetchParams,
} from '@/components/custom/Table'

import { DynamicForm } from '@/components/custom/Form'
import { Modal } from '@/components/custom/Modal'
import { useToast } from '@/contexts/ToastContext'

import { useHook as usePapeis } from '@/hooks/usePapeis'

import {
  GetPapeis as GetItems,
  PatchPapeis as PatchItems,
  PostPapeis as PostItems,
  LerPapeisData as QueryParams,
} from '@/client'
import { FormField } from '@/types/form'
import { getChangedPropertiesSimple } from '@/utils/objectDiff'

type typeForm = 'create' | 'update' | 'view'

export default function UsuariosPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<GetItems | null>(null)
  const [permissionsModalOpen, setPermissionsModalOpen] = useState(false)

  const [selectedFormMode, setSelectedFormMode] = useState<typeForm>('create')

  const { data, isLoading, error, fetchData, create, update, remove } =
    usePapeis()
  const { toast } = useToast()

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
  }

  const handlePermissions = (item: GetItems) => {
    setSelectedItem(item)
    setPermissionsModalOpen(true)
  }

  const handleSubmitForm = async (Item: PostItems | PatchItems) => {
    setSubmitting(true)

    try {
      if (selectedFormMode === 'create') {
        await create(Item as PostItems)
        toast.success('Item criado com sucesso!')
      } else {
        const changes = getChangedPropertiesSimple(
          selectedItem as GetItems,
          Item as Partial<GetItems>
        )
        if (Object.keys(changes).length === 0) {
          toast.info('Nenhuma alteração detectada.')
          setIsFormOpen(false)
          return
        }

        if (selectedItem?.id) {
          await update(selectedItem.id, Item)
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
      // toast.error('Erro ao salvar item. Tente novamente.')
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
      nome: params.searchTerm || undefined,
      sort_field: params.sortField as any,
      sort_op: params.sortDirection === 'asc' ? 'ASC' : 'DESC',
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

  const FormFields: FormField[] = [
    {
      name: 'nome',
      label: 'Papel',
      type: 'text',
      required: true,
      placeholder: 'Ex: Gerente',
      colSpan: 2,
      validation: {
        minLength: 3,
        maxLength: 100,
      },
    },
    {
      name: 'descricao',
      label: 'Descrição',
      type: 'text',
      placeholder: 'Ex: Gerente De Vendas',
      colSpan: 2,
      validation: {
        minLength: 3,
        maxLength: 100,
      },
    },
    {
      name: 'ativo',
      label: 'Status',
      type: 'checkbox',
      required: false,
      defaultValue: true,
      colSpan: 1,
    },
  ]

  const actions: TableAction<GetItems>[] = [
    {
      label: 'Permissões',
      icon: <Shield className="h-4 w-4" />,
      variant: 'edit',
      onClick: handlePermissions,
    },
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
      header: 'Papel',
      accessor: 'nome',
      sortable: true,
      searchable: true,
    },
    {
      header: 'Descrição',
      accessor: 'descricao',
      sortable: true,
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">
          {row.descricao?.slice(0, 50) + '...' || '-'}
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
      label: 'Novo',
      onClick: handleNewItem,
      icon: <Plus className="h-4 w-4 mr-2" />,
    },
  ]

  useEffect(() => {
    fetchData({
      limit: 10,
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
        isLoading={false}
        initialItemsPerPage={data?.meta?.items_per_page || 10}
        className="shadow-lg"
        buttons={tableButtons}
        onDeleteSelected={handleDeleteMultiple}
        title="Lista de Perfis"
      />

      {/* Modal do Formulário */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
        {selectedFormMode === 'create' ? (
          <DynamicForm
            title="Criar Perfil"
            fields={FormFields}
            onSubmit={handleSubmitForm}
            onCancel={handleCancelForm}
            mode="create"
          />
        ) : selectedFormMode === 'update' ? (
          <DynamicForm
            title="Editar Perfil"
            fields={FormFields}
            initialData={selectedItem || undefined}
            onSubmit={handleSubmitForm}
            onCancel={handleCancelForm}
            mode="edit"
          />
        ) : (
          <DynamicForm
            title="Detralhes da Perfil"
            fields={FormFields}
            initialData={selectedItem || undefined}
            onSubmit={handleSubmitForm}
            onCancel={handleCancelForm}
            mode="view"
          />
        )}
      </Modal>

      <PermissionModal
        data={selectedItem}
        isOpen={permissionsModalOpen}
        onClose={() => setPermissionsModalOpen(false)}
      />

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

      {/* Mensagem de erro global */}
      {error && !isFormOpen && (
        <Alert variant="destructive">
          <AlertDescription>
            {error.message || 'Ocorreu um erro inesperado'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
