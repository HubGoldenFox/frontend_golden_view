// Função para converter dados para CSV
export function convertToCSV<T>(data: T[], columns: string[]): string {
  const headers = columns.join(',')
  const rows = data.map((item) =>
    columns
      .map((col) => {
        const value = (item as any)[col]
        // Escapar aspas e vírgulas
        if (
          typeof value === 'string' &&
          (value.includes(',') || value.includes('"'))
        ) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value || ''
      })
      .join(',')
  )

  return [headers, ...rows].join('\n')
}

// Função para baixar arquivo
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string
) {
  const blob = new Blob([content], { type: mimeType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// Função para gerar Excel (usando uma biblioteca simples)
export function convertToExcel<T>(
  data: T[],
  columns: string[],
  filename: string
) {
  // Para uma implementação completa, você usaria uma biblioteca como 'xlsx'
  // Por simplicidade, vamos usar CSV com extensão .xlsx
  const csvContent = convertToCSV(data, columns)
  downloadFile(csvContent, `${filename}.csv`, 'text/csv')
}

// Função para gerar PDF
export function generatePDF<T>(
  data: T[],
  columns: string[],
  filename: string,
  title: string
) {
  // Criar HTML para impressão
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .header { margin-bottom: 20px; }
        .footer { margin-top: 20px; font-size: 12px; color: #666; }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
        <p>Total de registros: ${data.length}</p>
        <p>Colunas exportadas: ${columns.length}</p>
      </div>
      
      <table>
        <thead>
          <tr>
            ${columns.map((col) => `<th>${col}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data
            .map(
              (item) => `
            <tr>
              ${columns.map((col) => `<td>${(item as any)[col] || ''}</td>`).join('')}
            </tr>
          `
            )
            .join('')}
        </tbody>
      </table>
      
      <div class="footer">
        <p>Documento gerado automaticamente pelo sistema</p>
        <p>Apenas colunas visíveis foram incluídas na exportação</p>
      </div>
    </body>
    </html>
  `

  // Abrir em nova janela para impressão
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()

    // Aguardar carregamento e imprimir
    printWindow.onload = () => {
      printWindow.print()
      // Opcional: fechar janela após impressão
      // printWindow.onafterprint = () => printWindow.close()
    }
  }
}

// Função para formatar dados para exportação considerando apenas colunas visíveis
export function formatDataForExport<T>(
  data: T[],
  allColumns: { key: string; label: string }[],
  visibleColumns: string[]
): any[] {
  // Filtrar apenas as colunas visíveis
  const columnsToExport = allColumns.filter((col) =>
    visibleColumns.includes(col.key)
  )

  return data.map((item) => {
    const formattedItem: any = {}
    columnsToExport.forEach((col) => {
      const value = (item as any)[col.key]

      // Formatação especial para diferentes tipos
      if (value instanceof Date) {
        formattedItem[col.label] = value.toLocaleString('pt-BR')
      } else if (typeof value === 'boolean') {
        formattedItem[col.label] = value ? 'Sim' : 'Não'
      } else if (typeof value === 'number') {
        formattedItem[col.label] = value.toLocaleString('pt-BR')
      } else {
        formattedItem[col.label] = value || ''
      }
    })
    return formattedItem
  })
}

// Função para obter colunas de exportação baseadas nas colunas visíveis
export function getExportColumns<T>(
  allColumns: { key: string; label: string }[],
  visibleColumns: string[]
): { key: string; label: string }[] {
  return allColumns.filter((col) => visibleColumns.includes(col.key))
}

// Função para processar dados em lotes (para exportações grandes)
export async function processDataInBatches<T>(
  data: T[],
  batchSize = 1000,
  processor: (batch: T[]) => Promise<any[]>
): Promise<any[]> {
  const results: any[] = []

  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize)
    const processedBatch = await processor(batch)
    results.push(...processedBatch)

    // Pequena pausa para não sobrecarregar o sistema
    if (i + batchSize < data.length) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  return results
}
