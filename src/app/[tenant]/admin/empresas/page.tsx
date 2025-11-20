'use client'

import { useToast } from '@/contexts/ToastContext'
import { Edit, Eye, Mail, Phone, Plus, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { ConfirmationDialog } from '@/components/ui/confirmation-dialog'

import {
  ActionButton,
  ColumnConfig,
  DataTable,
  TableAction,
  TableFetchParams,
} from '@/components/custom/Table'

import { DynamicForm } from '@/components/custom/Form'
import { Modal } from '@/components/custom/Modal'

import { useHook as useEmpresas } from '@/hooks/useEmpresas'

import {
  GetEmpresas as GetItems,
  PatchEmpresas as PatchItems,
  PostEmpresas as PostItems,
  LerEmpresasData as QueryParams,
} from '@/client/types.gen'
import { FormField } from '@/types/form'
import { msgError } from '@/utils/functions'
import { masks } from '@/utils/masks'
import { getChangedPropertiesSimple } from '@/utils/objectDiff'

type typeForm = 'create' | 'update' | 'view'

export default function EmpresasPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<GetItems | null>(null)

  const [selectedFormMode, setSelectedFormMode] = useState<typeForm>('create')

  const { data, fetchData, create, update, remove } = useEmpresas()

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
      console.log(err)
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
      nome_fantasia: params.searchTerm || undefined,
      sort_field: (params.sortField as any) || 'criado_em',
      sort_op: params.sortDirection === 'asc' ? 'ASC' : 'DESC',
    }
  }

  const fetchDataAdapted = useCallback(
    async (tableParams: TableFetchParams) => {
      const query = adaptTableParamsToQuery(tableParams)
      return fetchData(query)
    },
    [fetchData]
  )

  const handleDeleteMultiple = async (items: GetItems[]) => {
    try {
      const deletePromises = items.map((item) => remove(item.id || ''))

      await Promise.all(deletePromises)

      await fetchData({
        limit: data?.meta?.items_per_page || 10,
        offset: 0,
        sort_op: 'DESC',
        sort_field: 'criado_em',
      })

      toast.success(`${items.length} itens excluídos com sucesso!`)
    } catch (error) {
      // console.error(error)
    }
  }

  const FormFields: FormField[] = [
    {
      name: 'nome',
      label: 'Nome da Empresa',
      type: 'text',
      required: true,
      placeholder: 'Ex: Gestor AI',
      colSpan: 1,
      validation: {
        minLength: 1,
        maxLength: 200,
      },
    },
    {
      name: 'nome_fantasia',
      label: 'Nome Fantasia',
      type: 'text',
      required: false,
      placeholder: 'Ex: Gestor AI',
      colSpan: 1,
      validation: {
        minLength: 1,
        maxLength: 100,
      },
    },
    {
      name: 'usuario_admin',
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
      name: 'senha_admin',
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
      name: 'dominio',
      label: 'Domínio',
      type: 'text',
      required: false,
      placeholder: 'Ex: GestorAI.com',
      colSpan: 2,
      validation: {
        rules: [
          {
            type: 'pattern',
            value:
              /^(?!-)[a-zA-Z0-9-]{1,63}(?<!-)(\.[a-zA-Z0-9-]{1,63}(?<!-))+$/,
            message:
              'Domínio deve conter apenas letras, números e hífens (não pode começar/terminar com hífen)',
          },
        ],
        minLength: 1,
        maxLength: 200,
      },
    },
    {
      name: 'subdominio',
      label: 'Subdomínio',
      type: 'text',
      required: false,
      placeholder: 'Ex: GestorAI',
      colSpan: 2,
      validation: {
        rules: [
          {
            type: 'pattern',
            value: /^(?!-)[a-zA-Z0-9-]{0,61}[a-zA-Z0-9]$|^$/,
            message:
              'Subdomínio deve ter até 63 caracteres, apenas letras, números e hífens (não no início/fim)',
          },
        ],
        minLength: 1,
        maxLength: 63,
      },
    },
    {
      name: 'cnpj',
      label: 'CNPJ',
      type: 'cnpj',
      required: false,
      placeholder: 'Ex: 12.345.678/0001-95',
      colSpan: 1,
    },
    {
      name: 'segmento',
      label: 'Segmento',
      type: 'text',
      required: false,
      placeholder: 'Ex: Vendas',
      colSpan: 1,
      validation: {
        minLength: 1,
        maxLength: 100,
      },
    },
    {
      name: 'email',
      label: 'E-mail',
      type: 'email',
      required: true,
      placeholder: 'Ex: email@empresa.com',
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
      placeholder: 'Ex: (65) 3765-4321',
      colSpan: 1,
    },
    {
      name: 'celular',
      label: 'Celular',
      type: 'phone',
      required: false,
      placeholder: 'Ex: (65) 98765-4321',
      colSpan: 1,
    },
    {
      name: 'cep',
      label: 'Cep',
      type: 'cep',
      required: false,
      placeholder: 'Ex: 12345-678',
      colSpan: 1,
      validation: {
        minLength: 1,
        maxLength: 200,
      },
    },
    {
      name: 'endereco',
      label: 'Rua',
      type: 'text',
      required: false,
      placeholder: 'Ex: Rua Padre Casemiro',
      colSpan: 1,
      validation: {
        minLength: 1,
        maxLength: 200,
      },
    },
    {
      name: 'numero',
      label: 'Nº',
      type: 'text',
      required: false,
      placeholder: 'Ex: 767',
      colSpan: 1,
      validation: {
        minLength: 1,
        maxLength: 200,
      },
    },
    {
      name: 'complemento',
      label: 'Complemento',
      type: 'text',
      required: false,
      placeholder: '',
      colSpan: 1,
      validation: {
        minLength: 1,
        maxLength: 200,
      },
    },
    {
      name: 'bairro',
      label: 'Bairro',
      type: 'text',
      required: false,
      placeholder: 'Ex: Centro',
      colSpan: 1,
      validation: {
        minLength: 1,
        maxLength: 200,
      },
    },
    {
      name: 'cidade',
      label: 'Cidade',
      type: 'text',
      required: false,
      placeholder: 'Ex: Cáceres',
      colSpan: 1,
      validation: {
        minLength: 1,
        maxLength: 200,
      },
    },
    {
      name: 'estado',
      label: 'Estado',
      type: 'text',
      required: false,
      placeholder: 'Ex: MT',
      colSpan: 1,
      validation: {
        minLength: 1,
        maxLength: 200,
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
      header: 'Nome da Empresa',
      accessor: 'nome',
      sortable: true,
      visible: true,
    },
    {
      header: 'Nome Fantasia',
      accessor: 'nome_fantasia',
      sortable: true,
      visible: true,
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
      header: 'CNPJ',
      accessor: 'cnpj',
      sortable: true,
      visible: false,
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
      visible: false,
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
        className="shadow-lg border border-border bg-card"
        buttons={tableButtons}
        onDeleteSelected={handleDeleteMultiple}
        title="Lista de Empresas"
      />

      {/* Modal do Formulário */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
        <div className="bg-card text-card-foreground rounded-lg">
          {selectedFormMode === 'create' ? (
            <DynamicForm
              title="Criar Empresa"
              fields={FormFields}
              onSubmit={handleSubmitForm}
              onCancel={handleCancelForm}
              loading={submitting}
              mode="create"
            />
          ) : selectedFormMode === 'update' ? (
            <DynamicForm
              title="Editar Empresa"
              fields={FormFields}
              initialData={selectedItem || undefined}
              onSubmit={handleSubmitForm}
              onCancel={handleCancelForm}
              loading={submitting}
              mode="edit"
            />
          ) : (
            <DynamicForm
              title="Detalhes da Empresa"
              fields={FormFields}
              initialData={selectedItem || undefined}
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
