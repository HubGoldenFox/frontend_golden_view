'use client'

import { Card, CardContent } from '@/components/custom/Card'
import { useData } from '@/contexts/DataContext'
import {
  AlertTriangle,
  ArrowLeft,
  BarChart4,
  Code,
  FileText,
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

export default function ReportViewer() {
  const { id } = useParams<{ id: string }>()
  const navigate = useRouter()
  const { reports } = useData()

  const report = reports.find((r) => r.id === id)

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-muted-foreground animate-in fade-in">
        <FileText className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-lg font-medium">Relatório não encontrado</p>
        <button
          onClick={() => navigate.back()}
          className="mt-4 text-sm text-primary hover:underline"
        >
          Voltar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4 h-[calc(100vh-100px)] flex flex-col animate-fade-in py-4 md:p-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate.back()}
          className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          title="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-secondary text-muted-foreground text-xs font-bold uppercase tracking-wide border border-border">
              {report.category}
            </span>
            {report.type === 'powerbi' ? (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 text-xs font-bold border border-yellow-500/20">
                <BarChart4 className="w-3 h-3" /> Power BI
              </span>
            ) : (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-400 text-xs font-bold border border-blue-500/20">
                <Code className="w-3 h-3" /> Custom
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground">{report.title}</h1>
        </div>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden bg-card shadow-md border border-border">
        <CardContent className="flex-1 p-0 bg-muted/10 relative">
          {report.type === 'powerbi' && report.contentUrl ? (
            <iframe
              src={report.contentUrl}
              className="w-full h-full absolute inset-0 border-0"
              allowFullScreen={true}
              title={report.title}
            />
          ) : report.embedCode ? (
            <div className="w-full h-full overflow-auto p-4">
              <div dangerouslySetInnerHTML={{ __html: report.embedCode }} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
              <AlertTriangle className="w-12 h-12 mb-4 text-warning opacity-80" />
              <h3 className="text-lg font-medium text-foreground">
                Conteúdo não configurado
              </h3>
              <p className="max-w-md mt-2">
                Este relatório ainda não possui conteúdo embarcado. Entre em
                contato com o administrador para configurar o embed.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
