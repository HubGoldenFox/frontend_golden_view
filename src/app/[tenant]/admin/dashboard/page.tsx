import { BarChart, LineChart, PieChart } from '@/components/dashboard/charts'
import { PerformanceMetrics } from '@/components/dashboard/performance-metrics'
import { RecentCalls } from '@/components/dashboard/recent-calls'
import { TopPerformers } from '@/components/dashboard/top-performers'
import { ComingSoon } from '@/components/status-page/ComingSoon'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function DashboardPage() {
  return (
    // TODO: Relatorios Dashboard
    <ComingSoon>
      <div className="flex flex-col gap-5 mt-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="analytics">Análise Detalhada</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Chamadas
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M2 12h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,248</div>
                  <p className="text-xs text-muted-foreground">
                    +12.5% em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Taxa de Conversão
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34" />
                    <path d="M14 3v4a2 2 0 0 0 2 2h4" />
                    <path d="M5 3v4a2 2 0 0 0 2 2h4" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">32.5%</div>
                  <p className="text-xs text-muted-foreground">
                    +7.2% em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Score Médio
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7.8</div>
                  <p className="text-xs text-muted-foreground">
                    +0.5 em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Vendedores Ativos
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">
                    +2 novos vendedores este mês
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Desempenho Mensal</CardTitle>
                  <CardDescription>
                    Evolução das métricas de desempenho nos últimos 6 meses
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <LineChart />
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Distribuição por Métricas</CardTitle>
                  <CardDescription>
                    Distribuição das pontuações por categoria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PieChart />
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Chamadas Recentes</CardTitle>
                  <CardDescription>
                    Últimas chamadas analisadas pela plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentCalls />
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Top Performers</CardTitle>
                  <CardDescription>
                    Vendedores com melhor desempenho no período
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TopPerformers />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Análise Detalhada de Desempenho</CardTitle>
                <CardDescription>
                  Métricas detalhadas por categoria de avaliação
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <BarChart />
              </CardContent>
            </Card>

            <PerformanceMetrics />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios</CardTitle>
                <CardDescription>
                  Gerencie e exporte relatórios de desempenho
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Funcionalidade em desenvolvimento. Em breve você poderá gerar
                  e exportar relatórios personalizados.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ComingSoon>
  )
}
