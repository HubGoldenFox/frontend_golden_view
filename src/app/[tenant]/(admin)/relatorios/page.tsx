'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/custom/Card'
import { useAuth } from '@/contexts/AuthContext'
import { useData } from '@/contexts/DataContext'
import { cn } from '@/lib/utils'
import { ReportIntegrationType, UserRole } from '@/types/mockData'
import {
  BarChart4,
  CheckCircle,
  Code,
  ExternalLink,
  Link as LinkIcon,
  Plus,
} from 'lucide-react'
import React, { useState } from 'react'

export default function Reports() {
  const { reports, companies, addReport, assignReportToCompany } = useData()
  const { user } = useAuth()
  const [view, setView] = useState<'list' | 'create' | 'assign'>('list')

  // Create Form State
  const [newReport, setNewReport] = useState({
    title: '',
    description: '',
    category: '',
    status: 'active' as const,
    type: 'powerbi' as ReportIntegrationType,
    contentUrl: '',
    embedCode: '',
  })

  // Assign State
  const [selectedCompany, setSelectedCompany] = useState('')
  const [selectedReports, setSelectedReports] = useState<string[]>([])

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (newReport.type === 'powerbi' && !newReport.contentUrl) {
      alert('Por favor, insira a URL do relatório Power BI.')
      return
    }

    addReport({
      title: newReport.title,
      description: newReport.description,
      category: newReport.category,
      status: newReport.status,
      type: newReport.type,
      contentUrl:
        newReport.type === 'powerbi' ? newReport.contentUrl : undefined,
      embedCode: newReport.type === 'custom' ? newReport.embedCode : undefined,
    })

    setView('list')
    setNewReport({
      title: '',
      description: '',
      category: '',
      status: 'active',
      type: 'powerbi',
      contentUrl: '',
      embedCode: '',
    })
  }

  const handleAssign = () => {
    if (!selectedCompany) return
    selectedReports.forEach((rId) =>
      assignReportToCompany(rId, selectedCompany)
    )
    setView('list')
    setSelectedReports([])
    setSelectedCompany('')
  }

  return (
    <div className="space-y-6 animate-fade-in py-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Gestão de Relatórios
          </h1>
          <p className="text-muted-foreground">
            Conecte seus dashboards do Power BI e distribua para as empresas.
          </p>
        </div>

        {user?.papeis?.nome === UserRole.ADMIN && (
          <div className="flex gap-2">
            <button
              onClick={() => setView('assign')}
              className="flex items-center gap-2 px-4 py-2 bg-background border border-input text-foreground rounded-lg hover:bg-secondary text-sm font-medium transition-colors"
            >
              <LinkIcon className="w-4 h-4" />
              Vincular
            </button>
            <button
              onClick={() => setView('create')}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm font-medium shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Novo Relatório
            </button>
          </div>
        )}
      </div>

      {/* CREATE FORM */}
      {view === 'create' && (
        <Card className="animate-slide-up border-primary/20 shadow-md">
          <CardHeader className="bg-muted/20 border-b border-border">
            <CardTitle className="flex items-center gap-2">
              <BarChart4 className="w-5 h-5 text-primary" />
              Configurar Novo Relatório
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleCreate} className="space-y-6">
              {/* 1. Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Informações Básicas
                  </h3>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Título do Relatório
                    </label>
                    <input
                      required
                      placeholder="Ex: DRE Gerencial 2024"
                      className="w-full px-3 py-2.5 border border-input bg-background rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      value={newReport.title}
                      onChange={(e) =>
                        setNewReport({ ...newReport, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Categoria (Menu)
                    </label>
                    <input
                      required
                      placeholder="Ex: Financeiro, Vendas, Operacional..."
                      className="w-full px-3 py-2.5 border border-input bg-background rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      value={newReport.category}
                      onChange={(e) =>
                        setNewReport({ ...newReport, category: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Descrição (Opcional)
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2.5 border border-input bg-background rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      value={newReport.description}
                      onChange={(e) =>
                        setNewReport({
                          ...newReport,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* 2. Power BI Integration */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Fonte de Dados
                  </h3>

                  <div className="flex gap-4 mb-4">
                    <button
                      type="button"
                      onClick={() =>
                        setNewReport({ ...newReport, type: 'powerbi' })
                      }
                      className={cn(
                        'flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all',
                        newReport.type === 'powerbi'
                          ? 'border-yellow-500/50 bg-yellow-500/5 text-yellow-700 dark:text-yellow-400'
                          : 'border-border bg-background hover:bg-secondary/50 text-muted-foreground'
                      )}
                    >
                      <BarChart4 className="w-8 h-8" />
                      <span className="font-bold text-sm">Power BI</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setNewReport({ ...newReport, type: 'custom' })
                      }
                      className={cn(
                        'flex-1 flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all',
                        newReport.type === 'custom'
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border bg-background hover:bg-secondary/50 text-muted-foreground'
                      )}
                    >
                      <Code className="w-8 h-8" />
                      <span className="font-bold text-sm">Custom HTML</span>
                    </button>
                  </div>

                  {newReport.type === 'powerbi' ? (
                    <div className="animate-in fade-in slide-in-from-bottom-2">
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        URL do Relatório (Embed URL)
                      </label>
                      <div className="relative">
                        <input
                          required
                          placeholder="https://app.powerbi.com/view?r=..."
                          className="w-full pl-10 pr-3 py-2.5 border border-input bg-background rounded-lg focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 outline-none font-mono text-sm"
                          value={newReport.contentUrl}
                          onChange={(e) =>
                            setNewReport({
                              ...newReport,
                              contentUrl: e.target.value,
                            })
                          }
                        />
                        <div className="absolute left-3 top-2.5 text-muted-foreground">
                          <LinkIcon className="w-5 h-5" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" />
                        No Power BI: Arquivo &gt; Incorporar relatório &gt; Site
                        ou Portal / Publicar na Web.
                      </p>

                      {newReport.contentUrl && (
                        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                          <p className="text-xs font-medium text-yellow-700 dark:text-yellow-400 mb-2">
                            Preview da Integração:
                          </p>
                          <div className="aspect-video bg-white rounded border border-border overflow-hidden relative">
                            <iframe
                              src={newReport.contentUrl}
                              className="absolute inset-0 w-full h-full"
                              frameBorder="0"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-2">
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Código Embed (HTML)
                      </label>
                      <textarea
                        required
                        className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none font-mono text-sm"
                        rows={8}
                        placeholder="<iframe>...</iframe>"
                        value={newReport.embedCode}
                        onChange={(e) =>
                          setNewReport({
                            ...newReport,
                            embedCode: e.target.value,
                          })
                        }
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setView('list')}
                  className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm font-medium shadow-lg shadow-primary/20 transition-all"
                >
                  Salvar Relatório
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* ASSIGN TO COMPANY */}
      {view === 'assign' && (
        <Card className="animate-slide-up">
          <CardHeader>
            <CardTitle>Vincular Relatórios a Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                1. Selecione a Empresa
              </label>
              <select
                className="w-full max-w-md px-3 py-2 border border-input bg-background rounded-lg focus:ring-2 focus:ring-primary outline-none"
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
              >
                <option value="">Selecione...</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                2. Selecione os Relatórios
              </label>
              <div className="border border-border rounded-lg max-h-60 overflow-y-auto p-2">
                {reports.map((report) => (
                  <label
                    key={report.id}
                    className="flex items-center p-2 hover:bg-secondary rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="rounded text-primary focus:ring-primary mr-3"
                      checked={selectedReports.includes(report.id)}
                      onChange={(e) => {
                        if (e.target.checked)
                          setSelectedReports([...selectedReports, report.id])
                        else
                          setSelectedReports(
                            selectedReports.filter((id) => id !== report.id)
                          )
                      }}
                    />
                    <span className="text-sm text-foreground">
                      {report.title}
                    </span>
                    <span className="ml-auto text-xs flex items-center gap-2">
                      {report.type === 'powerbi' ? (
                        <span className="text-yellow-600 bg-yellow-100 px-1.5 py-0.5 rounded font-bold">
                          PBI
                        </span>
                      ) : (
                        <span className="text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                          HTML
                        </span>
                      )}
                      <span className="text-muted-foreground">
                        {report.category}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setView('list')}
                className="px-4 py-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAssign}
                disabled={!selectedCompany || selectedReports.length === 0}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                Vincular Selecionados
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* LIST VIEW */}
      {view === 'list' && (
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/30 text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-6 py-3 font-medium">Título</th>
                  <th className="px-6 py-3 font-medium">Tipo</th>
                  <th className="px-6 py-3 font-medium">Categoria</th>
                  <th className="px-6 py-3 font-medium">Empresas Vinculadas</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {reports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-muted/10 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'p-2 rounded-lg',
                            report.type === 'powerbi'
                              ? 'bg-yellow-500/10 text-yellow-600'
                              : 'bg-primary/10 text-primary'
                          )}
                        >
                          {report.type === 'powerbi' ? (
                            <BarChart4 className="w-4 h-4" />
                          ) : (
                            <Code className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {report.title}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {report.description.substring(0, 30)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {report.type === 'powerbi' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-500/20">
                          Power BI
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                          Custom
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                        {report.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {report.companyIds.length > 0 ? (
                          report.companyIds.slice(0, 3).map((cid) => (
                            <div
                              key={cid}
                              className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-bold text-primary"
                              title="Company ID"
                            >
                              C
                            </div>
                          ))
                        ) : (
                          <span className="text-muted-foreground italic text-xs">
                            Nenhuma
                          </span>
                        )}
                        {report.companyIds.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-xs font-bold text-muted-foreground">
                            +{report.companyIds.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-success bg-success/10 px-2 py-1 rounded text-xs font-medium border border-success/20">
                        <CheckCircle className="w-3 h-3" /> Ativo
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
