import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export function PerformanceMetrics() {
  const metrics = [
    {
      title: 'Cordialidade e Empatia',
      score: 8.5,
      description: 'Capacidade de estabelecer conexão com o cliente',
      improvement: '+0.7',
    },
    {
      title: 'Conhecimento Técnico',
      score: 7.2,
      description: 'Domínio das informações sobre produtos e serviços',
      improvement: '+0.3',
    },
    {
      title: 'Identificação de Necessidades',
      score: 8.9,
      description: 'Habilidade em entender as demandas do cliente',
      improvement: '+1.2',
    },
    {
      title: 'Resolução de Objeções',
      score: 6.8,
      description: 'Capacidade de superar resistências do cliente',
      improvement: '+0.5',
    },
    {
      title: 'Assertividade no Fechamento',
      score: 7.5,
      description: 'Eficácia em concluir a venda',
      improvement: '+0.8',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <span className="text-2xl font-bold">
                {metric.score.toFixed(1)}
              </span>
            </div>
            <CardDescription>{metric.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <Progress value={metric.score * 10} className="h-2" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-green-600 font-medium">
                {metric.improvement}
              </span>
              <span className="text-gray-500 ml-2">
                em relação ao mês anterior
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
