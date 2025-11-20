'use client'

import { Card } from '@/components/custom/Card'
import { useData } from '@/contexts/DataContext'
import { useAuthTenant } from '@/hooks/useAuthTenant'
import { formatDate } from '@/lib/utils'
import { Building2, Files, Plus, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function Companies() {
  const { companies, addCompany, users, reports } = useData()
  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newCnpj, setNewCnpj] = useState('')

  const navigate = useRouter()
  const { tenant } = useAuthTenant()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addCompany({ name: newName, cnpj: newCnpj, status: 'active' })
    setIsCreating(false)
    setNewName('')
    setNewCnpj('')
  }

  return (
    <div className="space-y-6 animate-fade-in py-4 md:p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Empresas</h1>
          <p className="text-muted-foreground">
            Gerencie clientes e acesse detalhes para vincular relatórios.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Nova Empresa
        </button>
      </div>

      {isCreating && (
        <Card className="p-4 bg-muted/30 border-primary/30 animate-slide-up">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-4 items-end"
          >
            <div className="flex-1 w-full">
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                Nome da Empresa
              </label>
              <input
                required
                className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: Tech Solutions"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="text-xs font-semibold text-muted-foreground uppercase">
                CNPJ
              </label>
              <input
                className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                value={newCnpj}
                onChange={(e) => setNewCnpj(e.target.value)}
                placeholder="00.000.000/0000-00"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 bg-background border border-input rounded-md text-foreground hover:bg-secondary transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Salvar
              </button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => {
          const companyUsers = users.filter(
            (u) => u.companyId === company.id
          ).length
          const companyReports = reports.filter((r) =>
            r.companyIds.includes(company.id)
          ).length

          return (
            <Card
              key={company.id}
              onClick={() =>
                navigate.push(`/${tenant?.slug}/admin/empresas/${company.id}`)
              }
              className="hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group relative bg-card"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-secondary rounded-xl group-hover:bg-primary/10 group-hover:text-primary transition-colors text-muted-foreground">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <span className="px-2 py-1 text-xs font-medium bg-success/10 text-success rounded-full border border-success/20">
                    {company.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground tracking-tight">
                  {company.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {company.cnpj || 'CNPJ não informado'}
                </p>

                <div className="mt-4 flex gap-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    <Users className="w-4 h-4" />
                    <span>{companyUsers} usuários</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    <Files className="w-4 h-4" />
                    <span>{companyReports} relatórios</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex justify-between text-sm text-muted-foreground">
                  <span>Criado em</span>
                  <span>{formatDate(company.createdAt)}</span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
