'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/custom/Card'
import { useData } from '@/contexts/DataContext'
import { useAuthTenant } from '@/hooks/useAuthTenant'
import { cn, formatDate } from '@/lib/utils'
import { UserRole } from '@/types/mockData'
import {
  ArrowLeft,
  BarChart4,
  Building2,
  Check,
  Code,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Layers,
  Palette,
  Plus,
  Settings as SettingsIcon,
  Shield,
  Trash2,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'

type Tab = 'overview' | 'users' | 'groups' | 'reports' | 'settings'

export default function CompanyDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useRouter()
  const {
    companies,
    users,
    reports,
    groups,
    addUser,
    updateUser,
    deleteUser,
    assignReportToCompany,
    updateCompany,
    addGroup,
    deleteGroup,
    toggleReportGroup,
  } = useData()
  const { tenant } = useAuthTenant()

  const [activeTab, setActiveTab] = useState<Tab>('groups')

  // Forms State
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    groupIds: [] as string[],
  })

  const [isAddingGroup, setIsAddingGroup] = useState(false)
  const [newGroup, setNewGroup] = useState({ name: '', description: '' })

  const [isLinkingReport, setIsLinkingReport] = useState(false)
  const [reportToLink, setReportToLink] = useState('')

  // Logic for Groups Management
  const [selectedGroupForEdit, setSelectedGroupForEdit] = useState<
    string | null
  >(null)

  const company = companies.find((c) => c.id === id)

  if (!company) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Empresa não encontrada.
      </div>
    )
  }

  // Settings State
  const [settingsForm, setSettingsForm] = useState({
    name: company.name,
    cnpj: company.cnpj || '',
    logoUrl: company.logoUrl || '',
    themeColor: company.themeColor || '#4f46e5',
  })

  // Filtered Data
  const companyUsers = users.filter((u) => u.companyId === company.id)
  const companyReports = reports.filter((r) =>
    r.companyIds.includes(company.id)
  )
  const companyGroups = groups.filter((g) => g.companyId === company.id)
  const availableReports = reports.filter(
    (r) => !r.companyIds.includes(company.id)
  )

  // --- Handlers ---

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault()
    addUser({
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      role: UserRole.USER, // Default to User, can be changed to Admin
      companyId: company.id,
      groupIds: newUser.groupIds,
    })
    setIsAddingUser(false)
    setNewUser({ name: '', email: '', password: '', groupIds: [] })
  }

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault()
    addGroup({
      name: newGroup.name,
      description: newGroup.description,
      companyId: company.id,
    })
    setIsAddingGroup(false)
    setNewGroup({ name: '', description: '' })
  }

  const handleLinkReport = () => {
    if (reportToLink) {
      assignReportToCompany(reportToLink, company.id)
      setIsLinkingReport(false)
      setReportToLink('')
    }
  }

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault()
    updateCompany(company.id, settingsForm)
    alert('Configurações atualizadas com sucesso!')
  }

  // Toggle User in Group (Add/Remove groupId from User)
  const toggleUserInGroup = (userId: string, groupId: string) => {
    const user = users.find((u) => u.id === userId)
    if (!user) return

    const hasGroup = user.groupIds.includes(groupId)
    const newGroupIds = hasGroup
      ? user.groupIds.filter((id) => id !== groupId)
      : [...user.groupIds, groupId]

    updateUser(userId, { groupIds: newGroupIds })
  }

  return (
    <div className="space-y-6 animate-fade-in py-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          href={`/${tenant?.slug}/empresas`}
          className="flex items-center text-muted-foreground hover:text-foreground text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Voltar para Empresas
        </Link>

        <div className="flex items-center gap-4">
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={company.name}
              className="w-16 h-16 rounded-2xl object-cover border border-border bg-background"
            />
          ) : (
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-md"
              style={{
                backgroundColor:
                  company.themeColor || 'hsl(var(--color-primary))',
              }}
            >
              <Building2 className="w-8 h-8" />
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              {company.name}
            </h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
              <span>CNPJ: {company.cnpj || 'N/A'}</span>
              <span className="w-1 h-1 bg-border rounded-full" />
              <span className="text-success bg-success/10 px-2 py-0.5 rounded-full text-xs font-medium uppercase border border-success/20">
                {company.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border overflow-x-auto">
        <nav className="-mb-px flex gap-6">
          {[
            { id: 'overview', label: 'Visão Geral' },
            { id: 'groups', label: 'Grupos & Permissões' },
            { id: 'users', label: 'Usuários' },
            { id: 'reports', label: 'Relatórios da Empresa' },
            { id: 'settings', label: 'Configurações' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={cn(
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px] animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-lg">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Usuários
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {companyUsers.length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-lg">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Relatórios Vinculados
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {companyReports.length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-primary/10 text-primary rounded-lg">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Grupos de Acesso
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {companyGroups.length}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* --- GROUPS MANAGEMENT (Core Feature) --- */}
        {activeTab === 'groups' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Grupos de Acesso
                </h3>
                <p className="text-sm text-muted-foreground">
                  Crie grupos para organizar quem vê quais relatórios.
                </p>
              </div>
              <button
                onClick={() => setIsAddingGroup(true)}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" /> Novo Grupo
              </button>
            </div>

            {isAddingGroup && (
              <Card className="bg-muted/30 border-primary/20 animate-slide-up">
                <CardContent className="p-4">
                  <form
                    onSubmit={handleAddGroup}
                    className="flex flex-col md:flex-row gap-4 items-end"
                  >
                    <div className="flex-1 w-full">
                      <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">
                        Nome do Grupo
                      </label>
                      <input
                        required
                        className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary outline-none"
                        value={newGroup.name}
                        onChange={(e) =>
                          setNewGroup({ ...newGroup, name: e.target.value })
                        }
                        placeholder="Ex: Diretoria, Vendas..."
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">
                        Descrição
                      </label>
                      <input
                        className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary outline-none"
                        value={newGroup.description}
                        onChange={(e) =>
                          setNewGroup({
                            ...newGroup,
                            description: e.target.value,
                          })
                        }
                        placeholder="Ex: Acesso total ao financeiro"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingGroup(false)}
                        className="px-4 py-2 border border-border rounded-md hover:bg-secondary"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                      >
                        Criar
                      </button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {companyGroups.map((group) => {
                const memberCount = users.filter((u) =>
                  u.groupIds.includes(group.id)
                ).length
                const reportCount = reports.filter((r) =>
                  r.groupIds.includes(group.id)
                ).length
                const isEditing = selectedGroupForEdit === group.id

                return (
                  <Card
                    key={group.id}
                    className={cn(
                      'transition-all duration-300',
                      isEditing
                        ? 'col-span-full border-primary shadow-lg'
                        : 'hover:border-primary/30'
                    )}
                  >
                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                      <div>
                        <CardTitle className="text-base">
                          {group.name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-1">
                          {group.description || 'Sem descrição'}
                        </p>
                      </div>
                      {!isEditing && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedGroupForEdit(group.id)}
                            className="text-xs bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-1.5 rounded-md font-medium transition-colors"
                          >
                            Gerenciar Acessos
                          </button>
                          <button
                            onClick={() => deleteGroup(group.id)}
                            className="text-muted-foreground hover:text-destructive p-1.5 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </CardHeader>

                    {!isEditing && (
                      <CardContent className="pt-0">
                        <div className="flex gap-4 mt-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="w-4 h-4" /> {memberCount} Membros
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileText className="w-4 h-4" /> {reportCount}{' '}
                            Relatórios
                          </div>
                        </div>
                      </CardContent>
                    )}

                    {/* --- EXPANDED EDIT MODE --- */}
                    {isEditing && (
                      <CardContent className="border-t border-border bg-muted/5 p-0">
                        <div className="flex flex-col md:flex-row h-[500px]">
                          {/* Left: Members */}
                          <div className="flex-1 border-r border-border flex flex-col">
                            <div className="p-4 border-b border-border bg-muted/20 font-semibold text-sm flex justify-between items-center">
                              <span className="flex items-center gap-2">
                                <Users className="w-4 h-4" /> Membros do Grupo
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {memberCount} selecionados
                              </span>
                            </div>
                            <div className="overflow-y-auto p-2 space-y-1 flex-1">
                              {companyUsers.length === 0 && (
                                <p className="p-4 text-center text-sm text-muted-foreground">
                                  Sem usuários nesta empresa.
                                </p>
                              )}
                              {companyUsers.map((u) => {
                                const inGroup = u.groupIds.includes(group.id)
                                return (
                                  <label
                                    key={u.id}
                                    className={cn(
                                      'flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors text-sm',
                                      inGroup
                                        ? 'bg-primary/10'
                                        : 'hover:bg-secondary'
                                    )}
                                  >
                                    <input
                                      type="checkbox"
                                      className="rounded border-gray-300 text-primary focus:ring-primary w-4 h-4"
                                      checked={inGroup}
                                      onChange={() =>
                                        toggleUserInGroup(u.id, group.id)
                                      }
                                    />
                                    <div className="flex-1">
                                      <p
                                        className={cn(
                                          'font-medium',
                                          inGroup
                                            ? 'text-primary'
                                            : 'text-foreground'
                                        )}
                                      >
                                        {u.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {u.email}
                                      </p>
                                    </div>
                                    {inGroup && (
                                      <Check className="w-4 h-4 text-primary" />
                                    )}
                                  </label>
                                )
                              })}
                            </div>
                          </div>

                          {/* Right: Reports */}
                          <div className="flex-1 flex flex-col">
                            <div className="p-4 border-b border-border bg-muted/20 font-semibold text-sm flex justify-between items-center">
                              <span className="flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Relatórios
                                Acessíveis
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {reportCount} selecionados
                              </span>
                            </div>
                            <div className="overflow-y-auto p-2 space-y-1 flex-1">
                              {companyReports.length === 0 && (
                                <p className="p-4 text-center text-sm text-muted-foreground">
                                  Nenhum relatório vinculado à empresa.
                                </p>
                              )}
                              {companyReports.map((r) => {
                                const hasAccess = r.groupIds.includes(group.id)
                                return (
                                  <label
                                    key={r.id}
                                    className={cn(
                                      'flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors text-sm',
                                      hasAccess
                                        ? 'bg-success/10'
                                        : 'hover:bg-secondary'
                                    )}
                                  >
                                    <input
                                      type="checkbox"
                                      className="rounded border-gray-300 text-success focus:ring-success w-4 h-4"
                                      checked={hasAccess}
                                      onChange={() =>
                                        toggleReportGroup(r.id, group.id)
                                      }
                                    />
                                    <div className="p-1.5 rounded-md bg-background border border-border text-muted-foreground">
                                      {r.type === 'powerbi' ? (
                                        <BarChart4 className="w-3 h-3" />
                                      ) : (
                                        <Code className="w-3 h-3" />
                                      )}
                                    </div>
                                    <div className="flex-1">
                                      <p
                                        className={cn(
                                          'font-medium',
                                          hasAccess
                                            ? 'text-success-dark'
                                            : 'text-foreground'
                                        )}
                                      >
                                        {r.title}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {r.category}
                                      </p>
                                    </div>
                                    {hasAccess && (
                                      <Shield className="w-4 h-4 text-success" />
                                    )}
                                  </label>
                                )
                              })}
                            </div>
                            <div className="p-4 border-t border-border bg-background flex justify-end">
                              <button
                                onClick={() => setSelectedGroupForEdit(null)}
                                className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90"
                              >
                                Concluir Edição
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
              {companyGroups.length === 0 && (
                <div className="col-span-full py-12 flex flex-col items-center justify-center text-muted-foreground border border-dashed border-border rounded-xl">
                  <Layers className="w-10 h-10 mb-2 opacity-20" />
                  <p>Nenhum grupo criado ainda.</p>
                  <p className="text-xs mt-1">
                    Crie grupos (ex: Diretoria, Vendas) para segregar o acesso
                    aos relatórios.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- USERS TAB --- */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-foreground">
                Usuários da Empresa
              </h3>
              <button
                onClick={() => setIsAddingUser(!isAddingUser)}
                className="flex items-center gap-2 text-sm bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" /> Adicionar Usuário
              </button>
            </div>

            {isAddingUser && (
              <Card className="mb-6 border-primary/30 bg-primary/5 animate-slide-up">
                <CardContent className="p-4">
                  <form onSubmit={handleAddUser} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          Nome
                        </label>
                        <input
                          required
                          className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary outline-none"
                          value={newUser.name}
                          onChange={(e) =>
                            setNewUser({ ...newUser, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          Email (Login)
                        </label>
                        <input
                          required
                          type="email"
                          className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary outline-none"
                          value={newUser.email}
                          onChange={(e) =>
                            setNewUser({ ...newUser, email: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1">
                          Senha Inicial
                        </label>
                        <input
                          required
                          type="text"
                          className="w-full px-3 py-2 border border-input rounded-md bg-background focus:ring-2 focus:ring-primary outline-none"
                          value={newUser.password}
                          onChange={(e) =>
                            setNewUser({ ...newUser, password: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    {/* Multi-select Groups for New User */}
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-2">
                        Atribuir Grupos Iniciais
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {companyGroups.map((g) => (
                          <label
                            key={g.id}
                            className={cn(
                              'flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs cursor-pointer transition-all',
                              newUser.groupIds.includes(g.id)
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-background border-border text-foreground hover:border-primary/50'
                            )}
                          >
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={newUser.groupIds.includes(g.id)}
                              onChange={(e) => {
                                if (e.target.checked)
                                  setNewUser({
                                    ...newUser,
                                    groupIds: [...newUser.groupIds, g.id],
                                  })
                                else
                                  setNewUser({
                                    ...newUser,
                                    groupIds: newUser.groupIds.filter(
                                      (id) => id !== g.id
                                    ),
                                  })
                              }}
                            />
                            {g.name}
                            {newUser.groupIds.includes(g.id) && (
                              <Check className="w-3 h-3" />
                            )}
                          </label>
                        ))}
                        {companyGroups.length === 0 && (
                          <span className="text-xs text-muted-foreground italic">
                            Crie grupos primeiro na aba Grupos.
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
                      >
                        Salvar Usuário
                      </button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-3 font-medium">Nome</th>
                    <th className="px-4 py-3 font-medium">Email / Login</th>
                    <th className="px-4 py-3 font-medium">Grupos</th>
                    <th className="px-4 py-3 font-medium">Função</th>
                    <th className="px-4 py-3 text-right font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {companyUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {user.name}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {user.email}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {user.groupIds.length > 0 ? (
                            user.groupIds.map((gid) => {
                              const g = groups.find((grp) => grp.id === gid)
                              return g ? (
                                <span
                                  key={gid}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-secondary text-secondary-foreground border border-border"
                                >
                                  {g.name}
                                </span>
                              ) : null
                            })
                          ) : (
                            <span className="text-muted-foreground text-xs italic">
                              Sem grupos
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            'text-xs px-2 py-1 rounded-full font-medium',
                            user.role === UserRole.COMPANY_ADMIN
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-700'
                          )}
                        >
                          {user.role === UserRole.COMPANY_ADMIN
                            ? 'Admin'
                            : 'Usuário'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="text-destructive/80 hover:text-destructive p-1 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {companyUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-8 text-center text-muted-foreground"
                      >
                        Nenhum usuário cadastrado para esta empresa.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- REPORTS TAB --- */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-foreground">
                Relatórios Vinculados
              </h3>
              <button
                onClick={() => setIsLinkingReport(!isLinkingReport)}
                className="flex items-center gap-2 text-sm border border-border bg-background text-foreground px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <Plus className="w-4 h-4" /> Vincular Relatório Existente
              </button>
            </div>

            {isLinkingReport && (
              <div className="p-4 bg-muted/30 border border-border rounded-lg flex gap-2 items-center animate-slide-up">
                <select
                  className="flex-1 border-input rounded-md px-3 py-2 text-sm bg-background outline-none focus:ring-2 focus:ring-primary"
                  value={reportToLink}
                  onChange={(e) => setReportToLink(e.target.value)}
                >
                  <option value="">Selecione um relatório...</option>
                  {availableReports.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} ({r.category})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleLinkReport}
                  disabled={!reportToLink}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm disabled:opacity-50 hover:bg-primary/90"
                >
                  Vincular
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              {companyReports.map((report) => {
                // Show which groups have access
                const accessGroups = groups.filter((g) =>
                  report.groupIds.includes(g.id)
                )

                return (
                  <div
                    key={report.id}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-primary/30 transition-colors gap-4 group"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={cn(
                          'p-2.5 rounded-lg shrink-0',
                          report.type === 'powerbi'
                            ? 'bg-yellow-500/10 text-yellow-600'
                            : 'bg-blue-500/10 text-blue-600'
                        )}
                      >
                        {report.type === 'powerbi' ? (
                          <BarChart4 className="w-5 h-5" />
                        ) : (
                          <Code className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground">
                            {report.title}
                          </p>
                          {report.type === 'powerbi' && (
                            <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 rounded font-bold">
                              PBI
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {report.category} • {formatDate(report.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      <span className="text-xs text-muted-foreground mr-2">
                        Acesso:
                      </span>
                      <div className="flex gap-1 flex-wrap max-w-[200px] justify-end">
                        {accessGroups.length > 0 ? (
                          accessGroups.map((g) => (
                            <span
                              key={g.id}
                              className="text-[10px] bg-secondary px-2 py-0.5 rounded border border-border font-medium truncate max-w-[100px]"
                            >
                              {g.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] bg-warning/10 text-warning px-2 py-0.5 rounded border border-warning/20 font-bold">
                            Apenas Admins
                          </span>
                        )}
                      </div>

                      <div className="h-4 w-px bg-border mx-2 hidden md:block" />

                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            navigate.push(
                              `/${tenant?.slug}/relatorios/${report.id}`
                            )
                          }
                          className="flex items-center gap-1 text-xs bg-primary/5 text-primary hover:bg-primary/10 px-3 py-1.5 rounded font-medium transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" /> Abrir
                        </button>
                        <button
                          onClick={() => setActiveTab('groups')}
                          className="text-xs text-muted-foreground hover:text-foreground px-2 py-1.5"
                        >
                          Permissões
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
              {companyReports.length === 0 && (
                <p className="text-muted-foreground text-sm italic p-4 text-center border border-dashed border-border rounded-lg">
                  Nenhum relatório vinculado a esta empresa ainda.
                </p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" /> Configurações da Empresa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleUpdateSettings}
                className="space-y-5 max-w-lg"
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Nome da Empresa
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
                    value={settingsForm.name}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    CNPJ
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
                    value={settingsForm.cnpj}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, cnpj: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1 items-center gap-1">
                      <ImageIcon className="w-4 h-4" /> URL do Logo
                    </label>
                    <input
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary outline-none"
                      placeholder="https://..."
                      value={settingsForm.logoUrl}
                      onChange={(e) =>
                        setSettingsForm({
                          ...settingsForm,
                          logoUrl: e.target.value,
                        })
                      }
                    />
                    {settingsForm.logoUrl && (
                      <img
                        src={settingsForm.logoUrl}
                        className="mt-2 h-10 object-contain bg-background p-1 border border-border rounded"
                        alt="Preview"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1 items-center gap-1">
                      <Palette className="w-4 h-4" /> Cor do Tema
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        className="w-10 h-10 rounded cursor-pointer border border-border p-0"
                        value={settingsForm.themeColor}
                        onChange={(e) =>
                          setSettingsForm({
                            ...settingsForm,
                            themeColor: e.target.value,
                          })
                        }
                      />
                      <span className="text-sm text-muted-foreground uppercase">
                        {settingsForm.themeColor}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
