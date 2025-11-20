'use client'

import { Card } from '@/components/custom/Card'
import { useData } from '@/contexts/DataContext'
import { cn } from '@/lib/utils'
import { UserRole } from '@/types/mockData'
import { Briefcase, Plus, Search, Trash2, User as UserIcon } from 'lucide-react'
import React, { useState } from 'react'

export default function UsersPage() {
  const { users, companies, groups, addUser, deleteUser } = useData()
  const [isCreating, setIsCreating] = useState(false)
  const [search, setSearch] = useState('')

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'mypassword',
    role: UserRole.USER,
    companyId: '',
    groupIds: [] as string[],
  })

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  // Filter groups based on selected company
  const availableGroups = groups.filter(
    (g) => g.companyId === formData.companyId
  )

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    addUser(formData)
    setIsCreating(false)
    setFormData({
      name: '',
      email: '',
      password: 'mypassword',
      role: UserRole.USER,
      companyId: '',
      groupIds: [],
    })
  }

  const getCompanyName = (id?: string) => {
    if (!id) return '-'
    return companies.find((c) => c.id === id)?.name || 'Desconhecida'
  }

  return (
    <div className="space-y-6 animate-fade-in py-4 md:p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Gestão de Usuários
          </h1>
          <p className="text-muted-foreground">
            Administre todos os usuários do sistema.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Novo Usuário
        </button>
      </div>

      {isCreating && (
        <Card className="p-6 bg-muted/30 border-primary/30 animate-slide-up">
          <h3 className="text-lg font-bold mb-4 text-foreground">
            Cadastrar Usuário
          </h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Nome Completo
                </label>
                <input
                  required
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary outline-none"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Email
                </label>
                <input
                  required
                  type="email"
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary outline-none"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Senha Inicial
                </label>
                <input
                  required
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary outline-none"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Função
                </label>
                <select
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary outline-none"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      role: e.target.value as UserRole,
                    })
                  }
                >
                  <option value={UserRole.USER}>
                    Usuário (Membro de Grupo)
                  </option>
                  <option value={UserRole.COMPANY_ADMIN}>
                    Administrador da Empresa
                  </option>
                  <option value={UserRole.ADMIN}>Super Admin</option>
                </select>
              </div>

              {formData.role !== UserRole.ADMIN && (
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Vincular a Empresa
                    </label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary outline-none"
                      value={formData.companyId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          companyId: e.target.value,
                          groupIds: [],
                        })
                      }
                    >
                      <option value="">Selecione a empresa...</option>
                      {companies.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Groups Selection */}
                  {formData.companyId && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Grupos de Acesso
                      </label>
                      <div className="flex flex-wrap gap-2 border border-input p-3 rounded-lg bg-background">
                        {availableGroups.map((g) => (
                          <label
                            key={g.id}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border cursor-pointer hover:bg-secondary text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={formData.groupIds.includes(g.id)}
                              onChange={(e) => {
                                if (e.target.checked)
                                  setFormData({
                                    ...formData,
                                    groupIds: [...formData.groupIds, g.id],
                                  })
                                else
                                  setFormData({
                                    ...formData,
                                    groupIds: formData.groupIds.filter(
                                      (id) => id !== g.id
                                    ),
                                  })
                              }}
                              className="rounded text-primary focus:ring-primary"
                            />
                            {g.name}
                          </label>
                        ))}
                        {availableGroups.length === 0 && (
                          <p className="text-sm text-muted-foreground italic">
                            Esta empresa não possui grupos.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border border-border rounded-md text-foreground hover:bg-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Salvar
              </button>
            </div>
          </form>
        </Card>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex items-center gap-4 bg-muted/10">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <input
              className="w-full pl-9 pr-4 py-2 border border-input rounded-lg text-sm bg-background focus:ring-2 focus:ring-primary outline-none"
              placeholder="Buscar por nome ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground font-medium">
              <tr>
                <th className="px-6 py-3">Usuário</th>
                <th className="px-6 py-3">Função</th>
                <th className="px-6 py-3">Empresa & Grupos</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground border border-border">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium',
                        user.role === UserRole.ADMIN
                          ? 'bg-purple-100 text-purple-700'
                          : user.role === UserRole.COMPANY_ADMIN
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                      )}
                    >
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {user.role !== UserRole.ADMIN ? (
                        <>
                          <div className="flex items-center gap-1 text-foreground font-medium">
                            <Briefcase className="w-3 h-3 text-muted-foreground" />
                            {getCompanyName(user.companyId)}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {user.groupIds.map((gid) => {
                              const g = groups.find((gr) => gr.id === gid)
                              return g ? (
                                <span
                                  key={gid}
                                  className="text-[10px] bg-secondary px-1.5 py-0.5 rounded border border-border text-muted-foreground"
                                >
                                  {g.name}
                                </span>
                              ) : null
                            })}
                          </div>
                        </>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
