'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/custom/Card'
import { useAuth } from '@/contexts/AuthContext'
import { useData } from '@/contexts/DataContext'
import { useAuthTenant } from '@/hooks/useAuthTenant'
import { cn } from '@/lib/utils'
import { UserRole } from '@/types/mockData'
import {
  ArrowUpRight,
  BarChart4,
  Building2,
  Code,
  Files,
  TrendingUp,
  Users,
} from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const { companies, reports, users, groups } = useData()
  const { user } = useAuth()
  const { tenant } = useAuthTenant()

  const isSuperAdmin = user?.papeis?.nome === UserRole.ADMIN

  const stats = [
    {
      label: 'Total de Empresas',
      value: companies.length,
      icon: Building2,
      color: 'text-info',
      bg: 'bg-info/10',
      show: isSuperAdmin,
    },
    {
      label: 'Relatórios Ativos',
      value: reports.length,
      icon: Files,
      color: 'text-primary',
      bg: 'bg-primary/10',
      show: true,
    },
    {
      label: 'Usuários Totais',
      value: users.length,
      icon: Users,
      color: 'text-success',
      bg: 'bg-success/10',
      show: isSuperAdmin,
    },
    {
      label: 'Equipes Ativas',
      value: groups.length,
      icon: TrendingUp,
      color: 'text-warning',
      bg: 'bg-warning/10',
      show: true,
    },
  ].filter((s) => s.show)

  return (
    <div className="space-y-8 animate-fade-in py-4 md:p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Visão geral do sistema e métricas principais.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="hover:shadow-md hover:border-primary/30 transition-all"
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  stat.bg
                )}
              >
                <stat.icon className={cn('w-6 h-6', stat.color)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between border-b-0 pb-2">
            <CardTitle>Empresas Recentes</CardTitle>
            {isSuperAdmin && (
              <Link
                href={`/${tenant?.slug}/empresas`}
                className="text-sm text-primary hover:text-primary/80 font-medium flex items-center transition-colors"
              >
                Ver todas <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            )}
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-4">
              {companies.slice(0, 5).map((company) => (
                <Link
                  href={
                    isSuperAdmin
                      ? `/${tenant?.slug}/empresas/${company.id}`
                      : '#'
                  }
                  key={company.id}
                  className={cn(
                    'flex items-center justify-between p-3 bg-muted/30 rounded-lg transition-colors',
                    isSuperAdmin ? 'hover:bg-muted/50 block' : 'cursor-default'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full border border-border flex items-center justify-center font-bold text-white shadow-sm"
                      style={{
                        backgroundColor:
                          company.themeColor || 'hsl(var(--color-primary))',
                      }}
                    >
                      {company.logoUrl ? (
                        <img
                          src={company.logoUrl}
                          alt={company.name}
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        company.name.substring(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {company.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        CNPJ: {company.cnpj || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      company.status === 'active'
                        ? 'bg-success/10 text-success'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {company.status}
                  </span>
                </Link>
              ))}
              {companies.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-4">
                  Nenhuma empresa encontrada.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="h-full flex flex-col">
          <CardHeader className="border-b-0 pb-2 flex flex-row items-center justify-between">
            <CardTitle>Relatórios Recentes</CardTitle>
            <Link
              href={`/${tenant?.slug}/relatorios`}
              className="text-sm text-primary hover:text-primary/80 font-medium flex items-center transition-colors"
            >
              Gerenciar <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="space-y-3">
              {reports.slice(0, 5).map((report) => (
                <Link
                  href={`/${tenant?.slug}/relatorios/${report.id}`}
                  key={report.id}
                  className="flex items-start gap-4 p-3 border border-border/40 hover:border-primary/30 hover:bg-muted/10 transition-all rounded-lg group"
                >
                  <div
                    className={cn(
                      'p-2.5 rounded-lg transition-colors',
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
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {report.title}
                      </h4>
                      {report.type === 'powerbi' && (
                        <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 rounded font-bold">
                          PBI
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {report.description}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded border border-border">
                        {report.category}
                      </span>
                    </div>
                  </div>
                  <div className="self-center opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
              {reports.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-4">
                  Nenhum relatório encontrado.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
