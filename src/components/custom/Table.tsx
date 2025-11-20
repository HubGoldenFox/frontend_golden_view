'use client'

import { Meta } from '@/client'
import { Button, ButtonProps } from '@/components/custom/Button'
import { ConfirmationDialog } from '@/components/custom/ConfimationModal'
import { convertToCSV, generatePDF } from '@/utils/export-utils'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Download,
  Eye,
  EyeOff,
  MoreHorizontal,
  Search,
  Settings2,
} from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'

export interface ActionButton extends ButtonProps {
  label: string
  onClick: () => void
  icon?: React.ReactNode
}

interface ActionMenuProps {
  index: number
  item: any
  actions: Array<{
    icon: React.ReactNode
    label: string
    onClick: (item: any) => void
    variant?:
      | 'default'
      | 'destructive'
      | 'outline'
      | 'secondary'
      | 'ghost'
      | 'link'
      | 'view'
      | 'edit'
      | 'delete'
      | 'copy'
      | 'download'
  }>
  setOpenActionMenu: (index: number | null) => void
  triggerRect: DOMRect | null
}

export interface TableAction<T> {
  label: string
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'view'
    | 'edit'
    | 'delete'
    | 'copy'
    | 'download'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  icon: React.ReactNode
  onClick: (item: T) => void
}

export type FetchDataCallback = (params: TableFetchParams) => void
type ExportFormat = 'csv' | 'json' | 'pdf' | 'xlsx'
// Tipos para os callbacks da API
export interface TableFetchParams {
  page: number
  itemsPerPage: number
  sortField: string | null
  sortDirection: 'asc' | 'desc'
  searchTerm: string
}

export interface TableResponse<T> {
  data: T[]
  meta: Meta
}

export interface ColumnConfig<T> {
  header: string
  accessor: keyof T
  sortable?: boolean
  searchable?: boolean
  visible?: boolean
  cell?: (props: { row: T; value: any }) => React.ReactNode
}

export interface SortConfig {
  key: string | null
  direction: 'asc' | 'desc'
}

export interface TableProps<T> {
  data: T[]
  meta?: Meta
  columns: ColumnConfig<T>[]
  title?: string
  actions?: TableAction<T>[]
  onFetchData?: (params: TableFetchParams) => void
  defaultSort?: SortConfig
  initialItemsPerPage?: number
  className?: string
  totalCount?: number
  isLoading?: boolean
  onSelectionChange?: (selectedItems: T[]) => void
  onDeleteSelected?: (selectedItems: T[]) => void
  buttons?: ActionButton[] | null
  onExportData?: (params: {
    format: ExportFormat
    scope: 'current' | 'all'
    columns: string[]
    fileName: string
  }) => void
}

const ActionMenu = ({
  index,
  item,
  actions,
  setOpenActionMenu,
  triggerRect,
}: ActionMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  // Calcula a posição do menu
  useEffect(() => {
    if (triggerRect) {
      const spaceBelow = window.innerHeight - triggerRect.bottom
      const spaceAbove = triggerRect.top
      const menuHeight = actions.length * 40 + 16

      const shouldOpenUp = spaceBelow < menuHeight && spaceAbove > spaceBelow

      setPosition({
        top: shouldOpenUp ? triggerRect.top - menuHeight : triggerRect.bottom,
        left: Math.max(0, triggerRect.right - 192), // Prevenir valores negativos
      })
    }
  }, [triggerRect, actions.length])

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenActionMenu(null)
      }
    }

    // Pequeno delay para evitar fechar imediatamente ao abrir
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
    }, 100)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setOpenActionMenu])

  return (
    <div
      ref={menuRef}
      className="fixed z-9999 w-48 rounded-lg shadow-xl bg-card border border-border"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="p-1 flex flex-col">
        {actions.map((action, actionIndex) => (
          <Button
            key={actionIndex}
            onClick={(e) => {
              e.stopPropagation()
              action.onClick(item)
              setOpenActionMenu(null)
            }}
            className="flex w-full justify-start p-2"
            variant={action.variant || 'default'}
          >
            <span className="mr-2 shrink-0">{action.icon}</span>
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

// Componente Modal de Exportação
const ExportModal = <T extends Record<string, any>>({
  isOpen,
  onClose,
  onExport,
  visibleColumns,
  currentCount,
  totalCount,
  defaultFileName = `export-${new Date().toISOString().split('T')[0]}`,
}: {
  isOpen: boolean
  onClose: () => void
  onExport: (params: {
    format: ExportFormat
    scope: 'current' | 'all'
    columns: string[]
    fileName: string
  }) => void
  visibleColumns: ColumnConfig<T>[]
  currentCount: number
  totalCount: number
  defaultFileName?: string
}) => {
  const [exportScope, setExportScope] = useState<'current' | 'all'>('current')
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv')
  const [fileName, setFileName] = useState(defaultFileName)
  const [selectedColumns, setSelectedColumns] = useState<Set<string>>(
    new Set(
      visibleColumns
        .filter((col) => col.visible)
        .map((col) => col.accessor as string)
    )
  )

  const handleExport = () => {
    onExport({
      format: exportFormat,
      scope: exportScope,
      columns: Array.from(selectedColumns),
      fileName: fileName,
    })
    onClose()
  }

  const toggleColumnSelection = (accessor: string) => {
    const newSelected = new Set(selectedColumns)
    if (newSelected.has(accessor)) {
      newSelected.delete(accessor)
    } else {
      newSelected.add(accessor)
    }
    setSelectedColumns(newSelected)
  }

  const selectVisibleColumns = () => {
    setSelectedColumns(
      new Set(
        visibleColumns
          .filter((col) => col.visible)
          .map((col) => col.accessor as string)
      )
    )
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={handleOverlayClick}
      />

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-card text-card-foreground rounded-xl shadow-2xl w-full max-w-2xl min-w-[500px] max-h-[90vh] overflow-hidden flex flex-col border border-border transform transition-all duration-300 scale-100">
          {/* Cabeçalho do Modal */}
          <div className="p-6 border-b border-border bg-linear-to-r from-card to-card/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  Exportar Dados
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Selecione as opções de exportação
                </p>
              </div>
            </div>
          </div>

          {/* Conteúdo do Modal com Scroll */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {/* Seção de Colunas */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-foreground">
                  Colunas para Exportação
                </h4>
                <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {selectedColumns.size} de{' '}
                  {visibleColumns.filter((col) => col.visible).length}{' '}
                  selecionadas
                </span>
              </div>

              <div className="mb-4">
                <label className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    checked={
                      selectedColumns.size ===
                      visibleColumns.filter((col) => col.visible).length
                    }
                    onChange={selectVisibleColumns}
                    className="rounded border-border text-primary focus:ring-primary mr-3 transition-colors"
                  />
                  Selecionar apenas colunas visíveis
                </label>
              </div>

              <div className="border border-border rounded-lg p-4 max-h-48 overflow-y-auto bg-muted/30">
                <div>
                  {visibleColumns
                    .filter((col) => col.visible)
                    .map((column) => (
                      <label
                        key={column.accessor as string}
                        className="flex items-center p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedColumns.has(
                            column.accessor as string
                          )}
                          onChange={() =>
                            toggleColumnSelection(column.accessor as string)
                          }
                          className="rounded border-border text-primary focus:ring-primary mr-3 transition-colors"
                        />
                        <span className="text-sm font-medium text-foreground">
                          {column.header}
                        </span>
                      </label>
                    ))}
                </div>
              </div>
            </div>

            {/* Escopo da Exportação */}
            <div className="mb-6 pt-4 border-t border-border">
              <h4 className="font-semibold text-foreground mb-4">
                Escopo da Exportação
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center p-4 border-2 border-border rounded-xl hover:border-primary/50 hover:bg-accent transition-all cursor-pointer">
                  <input
                    type="radio"
                    name="exportScope"
                    value="current"
                    checked={exportScope === 'current'}
                    onChange={() => setExportScope('current')}
                    className="text-primary focus:ring-primary mr-4 transition-colors"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-foreground block">
                      Consulta Atual
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {currentCount} itens
                    </span>
                  </div>
                </label>
                <label className="flex items-center p-4 border-2 border-border rounded-xl hover:border-primary/50 hover:bg-accent transition-all cursor-pointer">
                  <input
                    type="radio"
                    name="exportScope"
                    value="all"
                    checked={exportScope === 'all'}
                    onChange={() => setExportScope('all')}
                    className="text-primary focus:ring-primary mr-4 transition-colors"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-foreground block">
                      Todos os Dados
                    </span>
                    <span className="text-xs text-muted-foreground mt-1">
                      {totalCount} itens
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Formato */}
            <div className="mb-6 pt-4 border-t border-border">
              <h4 className="font-semibold text-foreground mb-4">
                Formato de Exportação
              </h4>
              <div className="grid grid-cols-4 gap-3">
                {[
                  {
                    value: 'csv' as ExportFormat,
                    label: 'CSV',
                    desc: 'CSV',
                    color: 'blue',
                    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                  },
                  {
                    value: 'json' as ExportFormat,
                    label: 'JSON',
                    desc: 'JSON',
                    color: 'green',
                    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                  },
                  {
                    value: 'pdf' as ExportFormat,
                    label: 'PDF',
                    desc: 'PDF',
                    color: 'red',
                    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                  },
                  {
                    value: 'xlsx' as ExportFormat,
                    label: 'Excel',
                    desc: 'XLSX',
                    color: 'green',
                    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
                  },
                ].map((format) => (
                  <label
                    key={format.value}
                    className={`
                    relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 h-full
                    ${
                      exportFormat === format.value
                        ? `border-primary bg-primary/5 shadow-md`
                        : `border-border hover:border-primary/50 hover:bg-accent`
                    }
                  `}
                  >
                    <input
                      type="radio"
                      name="exportFormat"
                      value={format.value}
                      checked={exportFormat === format.value}
                      onChange={() => setExportFormat(format.value)}
                      className="absolute opacity-0"
                    />
                    <div
                      className={`w-10 h-10 bg-${format.color}-100 dark:bg-${format.color}-900/20 rounded-full flex items-center justify-center mb-2`}
                    >
                      <svg
                        className={`w-5 h-5 text-${format.color}-600 dark:text-${format.color}-400`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={format.icon}
                        />
                      </svg>
                    </div>
                    <span className="font-semibold text-foreground text-sm text-center">
                      {format.label}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                      {format.desc}
                    </p>
                  </label>
                ))}
              </div>
            </div>

            {/* Nome do Arquivo */}
            <div className="pt-4 border-t border-border">
              <h4 className="font-semibold text-foreground mb-3">
                Nome do Arquivo
              </h4>
              <div className="relative">
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full px-4 py-3 border border-input rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-background transition-all duration-200 pr-20"
                  placeholder="digite_o_nome_do_arquivo"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground font-medium">
                  .{exportFormat}
                </span>
              </div>
            </div>
          </div>

          {/* Botões (fixos na parte inferior) */}
          <div className="p-6 border-t border-border bg-muted/30">
            <div className="flex justify-end gap-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="min-w-[100px] border-border hover:bg-accent px-6"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleExport}
                variant="outline"
                className="min-w-[120px] bg-primary hover:bg-primary/90 shadow-lg px-6"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Exportar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const DataTable = <T extends Record<string, any>>({
  data: initialData,
  meta: externalMeta,
  columns,
  title = 'Lista de Dados',
  actions = [],
  onFetchData,
  defaultSort = { key: null, direction: 'desc' },
  initialItemsPerPage = 10,
  className = '',
  isLoading = false,
  onSelectionChange,
  onDeleteSelected,
  buttons,
  onExportData,
}: TableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>(defaultSort)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage)
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState<ColumnConfig<T>[]>([])
  const [isMultiDeleteDialogOpen, setIsMultiDeleteDialogOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Set<string | number>>(
    new Set()
  )
  const [itemsToDelete, setItemsToDelete] = useState<T[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [openActionMenu, setOpenActionMenu] = useState<number | null>(null)
  const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null)
  const [exportLoading, setExportLoading] = useState(false)

  // Referência para o dropdown de colunas (fecha ao clicar fora)
  // const columnMenuRef = useClickOutside(() => {
  //   if (isColumnMenuOpen) {
  //     setIsColumnMenuOpen(false);
  //   }
  // });

  // useEffect para fechar ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openActionMenu !== null) {
        const menuElement = document.getElementById(
          `action-menu-${openActionMenu}`
        )
        const buttonElement = document.getElementById(
          `action-button-${openActionMenu}`
        )

        if (menuElement && buttonElement) {
          if (
            !menuElement.contains(event.target as Node) &&
            !buttonElement.contains(event.target as Node)
          ) {
            setOpenActionMenu(null)
          }
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openActionMenu])

  // Efeito para sincronizar os estados de seleção
  useEffect(() => {
    const totalItems = initialData.length
    const selectedCount = selectedItems.size

    // Calcular estados do checkbox
    if (selectedCount === 0) {
      setSelectAll(false)
      setIndeterminate(false)
    } else if (selectedCount === totalItems && totalItems > 0) {
      setSelectAll(true)
      setIndeterminate(false)
    } else {
      setSelectAll(false)
      setIndeterminate(true)
    }

    // Notificar mudanças na seleção
    if (onSelectionChange) {
      const selectedData = initialData.filter((item) =>
        selectedItems.has(item.id || JSON.stringify(item))
      )
      onSelectionChange(selectedData)
    }
  }, [selectedItems, initialData, onSelectionChange])

  // Inicializar colunas visíveis
  useEffect(() => {
    const initialVisibleColumns = columns.map((col) => ({
      ...col,
      visible: col.visible !== undefined ? col.visible : true,
    }))
    setVisibleColumns(initialVisibleColumns)
  }, [columns])

  // Função para disparar a busca quando parâmetros mudarem
  const triggerFetch = useCallback(
    (page: number, sort: SortConfig, search: string, perPage: number) => {
      if (onFetchData) {
        onFetchData({
          page,
          itemsPerPage: perPage,
          sortField: sort.key,
          sortDirection: sort.direction,
          searchTerm: search.length > 1 ? `lk:${search}` : '',
        })
      }
    },
    [onFetchData]
  )

  // Disparar busca quando parâmetros mudarem
  useEffect(() => {
    triggerFetch(currentPage, sortConfig, searchTerm, itemsPerPage)
  }, [currentPage, sortConfig, searchTerm, itemsPerPage, triggerFetch])

  // Função para abrir o menu
  const handleOpenMenu = (index: number, event: React.MouseEvent) => {
    event.stopPropagation()
    setOpenActionMenu(index)
    setTriggerRect(event.currentTarget.getBoundingClientRect())
  }

  const handleExportWithAllData = async (params: {
    format: ExportFormat
    scope: 'current' | 'all'
    columns: string[]
    fileName: string
  }) => {
    if (onExportData) {
      onExportData(params)
      return
    }

    setExportLoading(true)

    try {
      let dataToExport: T[] = initialData

      // Se for para exportar todos os dados, buscar da API
      if (params.scope === 'all' && onFetchData) {
        // Fazer uma requisição especial para todos os dados
        const allDataParams: TableFetchParams = {
          page: 1,
          itemsPerPage: 10000,
          sortField: sortConfig.key,
          sortDirection: sortConfig.direction,
          searchTerm: searchTerm,
        }

        // TODO: implementar exportação de todos os dados max 1000 por vez
        // Você precisaria de uma função especial no seu hook para buscar todos os dados
        console.log('Buscar todos os dados para exportação:', allDataParams)
        // dataToExport = await fetchAllData(allDataParams);

        // Por enquanto, usa os dados atuais com um aviso
        console.warn('Exportação de todos os dados não totalmente implementada')
      }

      const selectedColumns = params.columns

      switch (params.format) {
        case 'csv':
          exportToCSV(dataToExport, selectedColumns, params.fileName)
          break
        case 'json':
          exportToJSON(dataToExport, selectedColumns, params.fileName)
          break
        case 'pdf':
          exportToPDF(dataToExport, selectedColumns, params.fileName)
          break
        case 'xlsx':
          exportToXLSX(dataToExport, selectedColumns, params.fileName)
          break
        default:
          exportToCSV(dataToExport, selectedColumns, params.fileName)
      }
    } catch (error) {
      // toast.error('Erro ao exportar dados');
    } finally {
      setExportLoading(false)
    }
  }

  // Função auxiliar para exportar para CSV
  const exportToCSV = (data: T[], columns: string[], fileName: string) => {
    // Usar os dados reais da tabela (initialData) em vez de array vazio
    const dataToExport = data.length > 0 ? data : initialData

    const headers = visibleColumns
      .filter((col) => columns.includes(col.accessor as string))
      .map((col) => col.header)

    // Verificar se há dados para exportar
    if (dataToExport.length === 0) {
      // toast.error('Nenhum dado disponível para exportação');
      return
    }

    const csvContent = [
      headers.join(','),
      ...dataToExport.map((item) =>
        columns
          .map((accessor) => {
            const value = item[accessor as keyof T]
            // Tratar valores null/undefined e strings com vírgulas/aspas
            const stringValue = value == null ? '' : String(value)
            return `"${stringValue.replace(/"/g, '""')}"`
          })
          .join(',')
      ),
    ].join('\n')

    downloadFile(csvContent, `${fileName}.csv`, 'text/csv;charset=utf-8;')
  }

  // Função auxiliar para exportar para JSON
  const exportToJSON = (data: T[], columns: string[], fileName: string) => {
    const dataToExport = data.length > 0 ? data : initialData

    if (dataToExport.length === 0) {
      // toast.error('Nenhum dado disponível para exportação');
      return
    }

    const jsonContent = dataToExport.map((item) => {
      const exportedItem: any = {}
      columns.forEach((accessor) => {
        exportedItem[accessor] = item[accessor as keyof T]
      })
      return exportedItem
    })

    downloadFile(
      JSON.stringify(jsonContent, null, 2),
      `${fileName}.json`,
      'application/json'
    )
  }

  // Adicione as funções de exportação (implementações básicas)
  const exportToPDF = (data: T[], columns: string[], fileName: string) => {
    const dataToExport = data.length > 0 ? data : initialData

    if (dataToExport.length === 0) return

    generatePDF(dataToExport, columns, fileName, title)
  }

  const exportToXLSX = (data: T[], columns: string[], fileName: string) => {
    const dataToExport = data.length > 0 ? data : initialData

    if (dataToExport.length === 0) {
      // toast.error('Nenhum dado disponível para exportação');
      return
    }

    const excelContent = convertToCSV(dataToExport, columns)

    downloadFile(
      excelContent,
      `${fileName}.xlsx`,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
  }

  // Função auxiliar para download
  const downloadFile = (
    content: string,
    fileName: string,
    contentType: string
  ) => {
    const blob = new Blob([content], { type: contentType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Função para lidar com a ordenação
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'

    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }

    const newSortConfig = { key, direction }
    setSortConfig(newSortConfig)
    setCurrentPage(1) // Sempre volta para primeira página ao ordenar
  }

  // Função para lidar com busca
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1)
  }

  // Função para mudar itens por página
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Volta para primeira página ao mudar items por página
  }

  // Função para renderizar o ícone de ordenação
  const renderSortIcon = (columnKey: string) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="h-4 w-4 ml-2 text-muted-foreground" />
    }

    return (
      <>
        {sortConfig.direction === 'asc' ? (
          <ArrowUp className="h-4 w-4 ml-2 text-muted-foreground" />
        ) : (
          <ArrowDown className="h-4 w-4 ml-2 text-muted-foreground" />
        )}
      </>
    )
  }

  // Toggle visibilidade de coluna
  const toggleColumnVisibility = (accessor: keyof T) => {
    setVisibleColumns((prev) =>
      prev.map((col) =>
        col.accessor === accessor ? { ...col, visible: !col.visible } : col
      )
    )
  }

  // Selecionar todas as colunas
  const selectAllColumns = () => {
    setVisibleColumns((prev) => prev.map((col) => ({ ...col, visible: true })))
  }

  // Desselecionar todas as colunas
  const deselectAllColumns = () => {
    setVisibleColumns((prev) => prev.map((col) => ({ ...col, visible: false })))
  }

  // Restaurar configuração padrão
  const restoreDefaultColumns = () => {
    const defaultVisibleColumns = columns.map((col) => ({
      ...col,
      visible: col.visible !== undefined ? col.visible : true,
    }))
    setVisibleColumns(defaultVisibleColumns)
  }

  // Use metadados para paginação
  const paginationMeta = {
    totalItems: externalMeta?.total_query || 0,
    totalPages: externalMeta?.total_pages || 1,
    hasNext: externalMeta?.has_next || false,
    hasPrev: externalMeta?.has_prev || false,
    currentPage: externalMeta?.current_page || currentPage,
    itemsPerPage: externalMeta?.items_per_page || itemsPerPage,
  }

  // Loading state
  const loading = isLoading

  return (
    <div
      className={`bg-card text-card-foreground rounded-lg shadow border border-border ${className}`}
    >
      {/* Barra de ações para itens selecionados */}
      {selectedItems.size > 0 && (
        <div className="bg-primary/10 border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-primary font-medium">
              {selectedItems.size}{' '}
              {selectedItems.size === 1
                ? 'item selecionado'
                : 'itens selecionados'}
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Button onClick={() => setSelectedItems(new Set())}>
              Limpar Seleção
            </Button>
            {onDeleteSelected && (
              <Button
                onClick={() => {
                  const selectedData = initialData.filter((item) =>
                    selectedItems.has(item.id || JSON.stringify(item))
                  )

                  setItemsToDelete(selectedData)
                  setIsMultiDeleteDialogOpen(true)
                }}
                variant="destructive"
              >
                Excluir ({selectedItems.size})
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Cabeçalho com título e controles */}
      <div className="p-4 border-b border-border">
        {/* Título em linha separada */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          {buttons && buttons.length > 0 && (
            <div className="flex gap-2">
              {buttons &&
                buttons.map((action, index) => (
                  <Button
                    key={index}
                    onClick={() => {
                      action.onClick()
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2"
                    disabled={isLoading}
                    variant="outline"
                  >
                    {action.icon && <span className="mr-2">{action.icon}</span>}
                    {action.label}
                  </Button>
                ))}
            </div>
          )}
        </div>

        {/* Container da barra de busca e botões */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          {/* Barra de busca - Ocupa todo o espaço disponível */}
          <div className="flex-1 min-w-0">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar registros..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-input rounded-lg outline-none bg-background"
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Container dos botões - não cresce, apenas ocupa o espaço necessário */}
          <div className="flex flex-wrap gap-3 flex-none justify-start sm:justify-end">
            {/* Botão de Exportar */}
            <Button
              onClick={() => setIsExportModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2"
              disabled={isLoading}
              variant="outline"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Exportar</span>
            </Button>

            {/* Botão de colunas */}
            <div className="relative">
              <Button
                onClick={() => setIsColumnMenuOpen(!isColumnMenuOpen)}
                className="inline-flex items-center gap-2 px-4 py-2"
                disabled={isLoading}
                variant="outline"
              >
                <Settings2 size={16} />
                <span className="hidden sm:inline">
                  Colunas ({visibleColumns.filter((col) => col.visible).length}/
                  {visibleColumns.length})
                </span>
                <span className="sm:hidden">
                  ({visibleColumns.filter((col) => col.visible).length}/
                  {visibleColumns.length})
                </span>
              </Button>

              {isColumnMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-10">
                  <div className="p-3 border-b border-border">
                    <div className="flex flex-col justify-between mb-2">
                      <h3 className="font-medium">Colunas</h3>
                      <div className="flex flex-row gap-2">
                        <Button
                          onClick={selectAllColumns}
                          variant="ghost"
                          className="p-2 mr-2 h-auto w-auto"
                        >
                          <span className="mr-2">
                            <Eye size={16} />
                          </span>
                          Todas
                        </Button>
                        <Button
                          onClick={deselectAllColumns}
                          variant="ghost"
                          className="px-2 mr-2 h-auto w-auto"
                        >
                          <span className="mr-2">
                            <EyeOff size={16} />
                          </span>
                          Nenhuma
                        </Button>
                      </div>
                    </div>
                    <Button
                      onClick={restoreDefaultColumns}
                      className="h-auto w-full"
                      variant="outline"
                    >
                      Restaurar Padrão
                    </Button>
                  </div>
                  <div
                    className="max-h-60 overflow-y-auto
                    [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-muted [&::-webkit-scrollbar-track]:rounded
                    [&::-webkit-scrollbar-thumb]:bg-muted-foreground [&::-webkit-scrollbar-thumb]:rounded
                    [&::-webkit-scrollbar-thumb:hover]:bg-primary"
                  >
                    {visibleColumns.map((column) => (
                      <label
                        key={column.accessor as string}
                        className="flex items-center px-3 py-2 hover:bg-accent cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={column.visible}
                          onChange={() =>
                            toggleColumnVisibility(column.accessor)
                          }
                          className="rounded text-primary focus:ring-primary mr-2"
                        />
                        <span className="text-md">{column.header}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 border border-border rounded-lg">
          {/* Tabela */}
          <div className="overflow-x-auto relative">
            {isLoading && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="w-full p-4">
                  {/* Tabela skeleton */}
                  <div className="border border-border rounded-lg overflow-hidden">
                    {/* Cabeçalho da tabela */}
                    <div className="bg-muted p-4 grid grid-cols-12 gap-4">
                      <div className="col-span-1 h-6 bg-muted-foreground/20 rounded animate-pulse"></div>
                      {visibleColumns
                        .filter((col) => col.visible)
                        .map((_, index) => (
                          <div
                            key={index}
                            className="h-6 bg-muted-foreground/20 rounded animate-pulse"
                            style={{
                              animationDelay: `${index * 0.1}s`,
                            }}
                          ></div>
                        ))}
                      {actions.length > 0 && (
                        <div className="col-span-1 h-6 bg-muted-foreground/20 rounded animate-pulse"></div>
                      )}
                    </div>

                    {/* Linhas da tabela */}
                    <div className="divide-y divide-border">
                      {Array.from({ length: itemsPerPage }).map(
                        (_, rowIndex) => (
                          <div
                            key={rowIndex}
                            className="grid grid-cols-12 gap-4 p-4 items-center"
                          >
                            {/* Checkbox */}
                            <div className="col-span-1">
                              <div className="h-5 w-5 bg-muted rounded animate-pulse"></div>
                            </div>

                            {/* Colunas */}
                            {visibleColumns
                              .filter((col) => col.visible)
                              .map((_, colIndex) => (
                                <div
                                  key={colIndex}
                                  className="h-4 bg-muted rounded animate-pulse"
                                  style={{
                                    width: `${Math.random() * 40 + 60}%`,
                                    animationDelay: `${(rowIndex + colIndex) * 0.05}s`,
                                  }}
                                ></div>
                              ))}

                            {/* Ações */}
                            {actions.length > 0 && (
                              <div className="col-span-1 flex gap-2">
                                <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
                                <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <table className="min-w-full border-separate border-spacing-0">
              <thead className="bg-muted">
                <tr>
                  {/* Checkbox para selecionar todos */}
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider w-16 rounded-tl-lg">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      ref={(input) => {
                        if (input) {
                          input.indeterminate = indeterminate
                        }
                      }}
                      onChange={() => {
                        if (selectAll || indeterminate) {
                          setSelectedItems(new Set())
                        } else {
                          const newSelected = new Set<string | number>()
                          initialData.forEach((item) => {
                            const identifier = item.id || JSON.stringify(item)
                            newSelected.add(identifier)
                          })
                          setSelectedItems(newSelected)
                        }
                      }}
                      className="h-4 w-4 rounded text-primary focus:ring-primary"
                    />
                  </th>

                  {visibleColumns
                    .filter((col) => col.visible)
                    .map((column) => (
                      <th
                        key={column.accessor as string}
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          column.sortable
                            ? 'cursor-pointer hover:bg-accent'
                            : ''
                        }`}
                        onClick={() =>
                          column.sortable &&
                          handleSort(column.accessor as string)
                        }
                      >
                        <div className="flex items-center">
                          {column.header}
                          {column.sortable &&
                            renderSortIcon(column.accessor as string)}
                        </div>
                      </th>
                    ))}

                  {/* Coluna de Ações (se houver ações) */}
                  {actions.length > 0 && (
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider w-20 rounded-tr-lg">
                      Ações
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {initialData.map((item, index) => {
                  const identifier = item.id || JSON.stringify(item)
                  const isSelected = selectedItems.has(identifier)

                  return (
                    <tr
                      key={index}
                      className={`hover:bg-accent/50 ${isSelected ? 'bg-primary/10' : ''}`}
                    >
                      {/* Checkbox para selecionar item */}
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            const newSelected = new Set(selectedItems)
                            if (newSelected.has(identifier)) {
                              newSelected.delete(identifier)
                            } else {
                              newSelected.add(identifier)
                            }
                            setSelectedItems(newSelected)
                          }}
                          className="h-4 w-4 rounded text-primary focus:ring-primary"
                        />
                      </td>

                      {visibleColumns
                        .filter((col) => col.visible)
                        .map((column) => (
                          <td
                            key={column.accessor as string}
                            className="px-6 py-4 whitespace-nowrap text-sm"
                          >
                            {/* Renderização condicional: cell personalizado ou valor padrão */}
                            {column.cell
                              ? column.cell({
                                  row: item,
                                  value: item[column.accessor],
                                })
                              : item[column.accessor]}
                          </td>
                        ))}

                      {/* Coluna de Ações (se houver ações) */}
                      {actions.length > 0 && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          {actions.length <= 3 ? (
                            <div className="flex items-center space-x-2">
                              {actions.map((action, actionIndex) => (
                                <Button
                                  key={actionIndex}
                                  onClick={() => action.onClick(item)}
                                  className="inline-flex items-center"
                                  title={action.label}
                                  variant={action.variant || 'default'}
                                  size={action.size || 'sm'}
                                >
                                  {action.icon}
                                  <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                    {action.label}
                                  </span>
                                </Button>
                              ))}
                            </div>
                          ) : (
                            <div className="relative inline-block text-left">
                              <div>
                                <Button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    const rect =
                                      e.currentTarget.getBoundingClientRect()
                                    setTriggerRect(rect)
                                    setOpenActionMenu(
                                      openActionMenu === index ? null : index
                                    )
                                  }}
                                  variant="ghost"
                                  className="flex items-center focus:outline-none p-2"
                                  id={`action-button-${index}`}
                                >
                                  <span className="sr-only">
                                    Abrir menu de ações
                                  </span>
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </div>

                              {openActionMenu === index && triggerRect && (
                                <ActionMenu
                                  index={index}
                                  item={item}
                                  actions={actions}
                                  setOpenActionMenu={setOpenActionMenu}
                                  triggerRect={triggerRect}
                                />
                              )}
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {initialData.length === 0 && !isLoading && (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm
                  ? 'Nenhum resultado encontrado para sua busca.'
                  : 'Nenhum dado disponível.'}
              </div>
            )}
          </div>

          {/* Paginação */}
          {paginationMeta.totalItems > 0 && (
            <div className="px-4 py-3 border-t border-border flex flex-col sm:flex-row items-center justify-between">
              <div className="mr-4">
                <p className="text-sm text-muted-foreground">
                  Mostrando{' '}
                  <span className="font-medium">
                    {(paginationMeta.currentPage - 1) *
                      paginationMeta.itemsPerPage +
                      1}
                  </span>{' '}
                  a{' '}
                  <span className="font-medium">
                    {Math.min(
                      paginationMeta.currentPage * paginationMeta.itemsPerPage,
                      paginationMeta.totalItems
                    )}
                  </span>{' '}
                  de{' '}
                  <span className="font-medium">
                    {paginationMeta.totalItems}
                  </span>{' '}
                  resultados
                </p>
              </div>

              <div className="flex items-center mb-4 sm:mb-0">
                <span className="text-sm text-muted-foreground mr-3">
                  Items por página:
                </span>
                <div className="relative">
                  <select
                    value={itemsPerPage}
                    onChange={(e) =>
                      handleItemsPerPageChange(Number(e.target.value))
                    }
                    className="appearance-none border border-border rounded-md pl-3 pr-8 py-1.5 text-sm bg-background focus:ring-2 focus:ring-ring focus:border-primary outline-none cursor-pointer"
                    disabled={isLoading}
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col sm:flex-row items-center justify-between sm:justify-end space-y-2 sm:space-y-0 sm:space-x-6">
                <nav className="relative z-0 inline-flex space-x-2">
                  {/* Botões de paginação */}
                  <Button
                    onClick={() => setCurrentPage(1)}
                    disabled={
                      paginationMeta.currentPage === 1 ||
                      isLoading ||
                      !paginationMeta.hasPrev
                    }
                    variant="outline"
                    title="Primeira página"
                  >
                    <span className="sr-only">Primeira página</span>
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>

                  <Button
                    onClick={() =>
                      setCurrentPage(paginationMeta.currentPage - 1)
                    }
                    disabled={
                      paginationMeta.currentPage === 1 ||
                      isLoading ||
                      !paginationMeta.hasPrev
                    }
                    variant="outline"
                    title="Página anterior"
                  >
                    <span className="sr-only">Página anterior</span>
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>

                  <div className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-foreground">
                    Página {paginationMeta.currentPage} de{' '}
                    {paginationMeta.totalPages}
                  </div>

                  <Button
                    onClick={() =>
                      setCurrentPage(paginationMeta.currentPage + 1)
                    }
                    disabled={
                      paginationMeta.currentPage ===
                        paginationMeta.totalPages ||
                      isLoading ||
                      !paginationMeta.hasNext
                    }
                    variant="outline"
                    title="Próxima página"
                  >
                    <span className="sr-only">Próxima página</span>
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>

                  <Button
                    onClick={() => setCurrentPage(paginationMeta.totalPages)}
                    disabled={
                      paginationMeta.currentPage ===
                        paginationMeta.totalPages ||
                      isLoading ||
                      !paginationMeta.hasNext
                    }
                    variant="outline"
                    title="Última página"
                  >
                    <span className="sr-only">Última página</span>
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Button>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Exportação */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExportWithAllData}
        visibleColumns={visibleColumns}
        currentCount={initialData.length}
        totalCount={externalMeta?.total_items || 0}
      />

      {/* Modal de Exclusão */}
      <ConfirmationDialog
        open={isMultiDeleteDialogOpen}
        onOpenChange={setIsMultiDeleteDialogOpen}
        title={`Excluir ${itemsToDelete.length} itens`}
        description={`Tem certeza que deseja excluir ${itemsToDelete.length} item(ns) selecionado(s)? Esta ação não pode ser desfeita.`}
        onConfirm={async () => {
          if (onDeleteSelected) {
            onDeleteSelected(itemsToDelete)
          }
          setSelectedItems(new Set())
          setItemsToDelete([])
        }}
        variant="destructive"
        confirmText="Excluir"
      />
    </div>
  )
}
