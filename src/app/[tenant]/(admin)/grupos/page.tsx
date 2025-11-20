'use client'

import { Card, CardContent, CardHeader } from '@/components/custom/Card'
import { useAuth } from '@/contexts/AuthContext'
import { useData } from '@/contexts/DataContext'
import { UserRole } from '@/types/mockData'
import { Briefcase, Layers, Plus, Trash2 } from 'lucide-react'
import React, { useState } from 'react'

// This file was formerly Teams.tsx, now acts as Groups.tsx
export default function GroupsPage() {
  const { groups, companies, users, addGroup, deleteGroup } = useData()
  const { user } = useAuth()
  const [isCreating, setIsCreating] = useState(false)

  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    companyId: '',
  })

  // Filter groups based on logged user role
  const displayGroups =
    user?.papeis?.nome === UserRole.ADMIN
      ? groups
      : groups.filter((t) => t.companyId === 'c1')

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    const companyIdToUse =
      user?.papeis?.nome === UserRole.COMPANY_ADMIN ? null : newGroup.companyId

    if (companyIdToUse) {
      addGroup({
        name: newGroup.name,
        description: newGroup.description,
        companyId: companyIdToUse,
      })
      setIsCreating(false)
      setNewGroup({ name: '', description: '', companyId: '' })
    }
  }

  const getCompanyName = (id: string) =>
    companies.find((c) => c.id === id)?.name || 'N/A'
  const getGroupMemberCount = (groupId: string) =>
    users.filter((u) => u.groupIds.includes(groupId)).length

  return (
    <div className="space-y-6 animate-fade-in py-4 md:p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Gestão de Grupos Globais
          </h1>
          <p className="text-muted-foreground">
            Visualize todos os grupos de acesso do sistema.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Novo Grupo
        </button>
      </div>

      {isCreating && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <form
              onSubmit={handleCreate}
              className="flex flex-col md:flex-row gap-4 items-end"
            >
              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Nome do Grupo
                </label>
                <input
                  required
                  className="w-full px-3 py-2 border border-input rounded-md bg-background outline-none focus:ring-2 focus:ring-primary"
                  value={newGroup.name}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, name: e.target.value })
                  }
                  placeholder="Ex: Financeiro"
                />
              </div>
              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Descrição
                </label>
                <input
                  className="w-full px-3 py-2 border border-input rounded-md bg-background outline-none focus:ring-2 focus:ring-primary"
                  value={newGroup.description}
                  onChange={(e) =>
                    setNewGroup({ ...newGroup, description: e.target.value })
                  }
                  placeholder="Ex: Acesso a relatórios X"
                />
              </div>

              {user?.papeis?.nome === UserRole.ADMIN && (
                <div className="flex-1 w-full">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">
                    Empresa
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-input rounded-md bg-background outline-none focus:ring-2 focus:ring-primary"
                    value={newGroup.companyId}
                    onChange={(e) =>
                      setNewGroup({ ...newGroup, companyId: e.target.value })
                    }
                  >
                    <option value="">Selecione...</option>
                    {companies.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 border border-border rounded-md text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
                >
                  Criar
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayGroups.map((group) => (
          <Card
            key={group.id}
            className="group hover:border-primary/30 transition-colors"
          >
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <button
                onClick={() => deleteGroup(group.id)}
                className="text-muted-foreground hover:text-destructive transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-bold text-foreground">
                {group.name}
              </h3>
              <p className="text-xs text-muted-foreground mb-2">
                {group.description}
              </p>

              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Briefcase className="w-3 h-3" />
                {getCompanyName(group.companyId)}
              </div>

              <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Membros</span>
                <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md font-medium text-xs border border-border">
                  {getGroupMemberCount(group.id)} usuários
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
        {displayGroups.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-card rounded-xl border border-dashed border-border">
            <Layers className="w-10 h-10 mx-auto mb-2 opacity-20" />
            <p>Nenhum grupo encontrado.</p>
          </div>
        )}
      </div>
    </div>
  )
}
