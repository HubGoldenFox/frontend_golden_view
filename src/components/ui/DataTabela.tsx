'use client'

import { FileSpreadsheet, Plus, RefreshCw } from 'lucide-react'
import React, { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface TableColumnDef<T> {
  id: string
  header: string
  accessorKey?: keyof T
  accessorFn?: (row: T) => any
  cell?: (row: T) => React.ReactNode
  sortable?: boolean
  hidden?: boolean
}

interface PaginationProps {
  pageIndex: number
  pageSize: number
  pageCount: number
  totalItems: number
  onPageChange: (pageIndex: number) => void
  onPageSizeChange: (pageSize: number) => void
  pageSizeOptions?: number[]
}

interface DataTabelaProps<T> {
  data: T[]
  columns: TableColumnDef<T>[]
  titulo?: string
  onRowClick?: (row: T) => void
  onRowDelete?: (row: T) => void
  onRowDownload?: (row: T) => void
  onAdd?: () => void
  onRefresh?: () => Promise<void>
  exportFilename?: string
  pagination?: PaginationProps
}

export function DataTabela<T>({
  data = [],
  columns,
  titulo = 'Tabela',
  onRowClick,
  onRowDelete,
  onRowDownload,
  onAdd,
  onRefresh,
  exportFilename = 'dados',
  pagination,
}: DataTabelaProps<T>) {
  const isArray = Array.isArray(data)
  const safeData = isArray ? data : []

  const [globalFilter, setGlobalFilter] = useState('')
  const [sorting, setSorting] = useState<{ id: string; desc: boolean } | null>(
    null
  )

  const pageIndex = pagination?.pageIndex ?? 0
  const pageSize = pagination?.pageSize ?? 10
  const pageCount = pagination?.pageCount ?? 1
  const totalItems = pagination?.totalItems ?? safeData.length
  const pageSizeOptions = pagination?.pageSizeOptions ?? [5, 10, 25]

  const filteredData = useMemo(() => {
    if (!globalFilter) return safeData
    return safeData.filter((row) =>
      columns.some((col) => {
        const value = col.accessorKey
          ? row[col.accessorKey]
          : col.accessorFn?.(row)
        return String(value ?? '')
          .toLowerCase()
          .includes(globalFilter.toLowerCase())
      })
    )
  }, [safeData, globalFilter, columns])

  const sortedData = useMemo(() => {
    if (!sorting) return filteredData
    const col = columns.find((c) => c.id === sorting.id)
    if (!col) return filteredData

    return [...filteredData].sort((a, b) => {
      const aVal = col.accessorKey ? a[col.accessorKey] : col.accessorFn?.(a)
      const bVal = col.accessorKey ? b[col.accessorKey] : col.accessorFn?.(b)

      if (aVal < bVal) return sorting.desc ? 1 : -1
      if (aVal > bVal) return sorting.desc ? -1 : 1
      return 0
    })
  }, [filteredData, sorting, columns])

  const paginatedData = useMemo(() => {
    // Se vier paginação externa, retorna os dados direto
    if (pagination) return sortedData
    // Caso contrário, faz paginação local
    const start = pageIndex * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, pageIndex, pageSize, pagination])

  const totalPages = pagination
    ? pageCount
    : Math.ceil(sortedData.length / pageSize)

  const toggleSort = (columnId: string) => {
    setSorting((prev) =>
      prev?.id === columnId
        ? { id: columnId, desc: !prev.desc }
        : { id: columnId, desc: false }
    )
  }

  const exportToCSV = () => {
    const visibleCols = columns.filter((c) => !c.hidden)
    const header = visibleCols.map((c) => c.header).join(',')
    const rows = sortedData.map((row) =>
      visibleCols
        .map((c) => {
          const value = c.accessorKey ? row[c.accessorKey] : c.accessorFn?.(row)
          return `"${String(value ?? '').replace(/"/g, '""')}"`
        })
        .join(',')
    )
    const csvContent = [header, ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', `${exportFilename}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-800">{titulo}</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Buscar..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
          {onRefresh && (
            <Button variant="outline" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Atualizar
            </Button>
          )}
          {onAdd && (
            <Button onClick={onAdd}>
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          )}
          <Button variant="outline" onClick={exportToCSV}>
            <FileSpreadsheet className="h-4 w-4 mr-1" />
            Exportar
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {columns
              .filter((c) => !c.hidden)
              .map((col) => (
                <TableHead
                  key={col.id}
                  onClick={() => col.sortable && toggleSort(col.id)}
                  className={
                    col.sortable ? 'cursor-pointer hover:underline' : ''
                  }
                >
                  {col.header}
                  {sorting?.id === col.id && (sorting.desc ? ' 🔽' : ' 🔼')}
                </TableHead>
              ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row, idx) => (
              <TableRow
                key={idx}
                className={onRowClick ? 'cursor-pointer hover:bg-blue-50' : ''}
                onClick={() => onRowClick?.(row)}
              >
                {columns
                  .filter((c) => !c.hidden)
                  .map((col) => (
                    <TableCell key={col.id}>
                      {col.cell
                        ? col.cell(row)
                        : String(
                            col.accessorKey
                              ? row[col.accessorKey]
                              : col.accessorFn?.(row)
                          )}
                    </TableCell>
                  ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                Nenhum registro encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-slate-600">
          Página {pageIndex + 1} de {totalPages || 1}
        </span>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() =>
              pagination ? pagination.onPageChange(0) : setPageIndex(0)
            }
            disabled={pageIndex === 0}
          >
            {'<<'}
          </Button>
          <Button
            size="sm"
            onClick={() =>
              pagination
                ? pagination.onPageChange(pageIndex - 1)
                : setPageIndex((p) => Math.max(p - 1, 0))
            }
            disabled={pageIndex === 0}
          >
            {'<'}
          </Button>
          <Button
            size="sm"
            onClick={() =>
              pagination
                ? pagination.onPageChange(pageIndex + 1)
                : setPageIndex((p) => Math.min(p + 1, totalPages - 1))
            }
            disabled={pageIndex >= totalPages - 1}
          >
            {'>'}
          </Button>
          <Button
            size="sm"
            onClick={() =>
              pagination
                ? pagination.onPageChange(totalPages - 1)
                : setPageIndex(totalPages - 1)
            }
            disabled={pageIndex >= totalPages - 1}
          >
            {'>>'}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {pageSize} itens
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {pageSizeOptions.map((size) => (
                <DropdownMenuItem
                  key={size}
                  onClick={() =>
                    pagination
                      ? pagination.onPageSizeChange(size)
                      : setPageSize(size)
                  }
                >
                  {size} itens por página
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
