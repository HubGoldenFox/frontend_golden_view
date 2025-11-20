import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

export function TopPerformers() {
  const performers = [
    {
      id: 1,
      name: 'Juliana Costa',
      avatar:
        '/default-avatar.png?height=40&width=40&query=woman with long hair',
      score: 9.1,
      improvement: '+1.2',
      calls: 45,
    },
    {
      id: 2,
      name: 'Carlos Silva',
      avatar: '/thoughtful-man.png',
      score: 8.5,
      improvement: '+0.8',
      calls: 38,
    },
    {
      id: 3,
      name: 'Fernanda Lima',
      avatar:
        '/default-avatar.png?height=40&width=40&query=woman with curly hair',
      score: 8.3,
      improvement: '+0.5',
      calls: 42,
    },
    {
      id: 4,
      name: 'Ricardo Gomes',
      avatar: '/default-avatar.png?height=40&width=40&query=man with glasses',
      score: 8.0,
      improvement: '+1.5',
      calls: 30,
    },
  ]

  return (
    <div className="space-y-6">
      {performers.map((performer) => (
        <div key={performer.id} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={performer.avatar || '/default-avatar.png'}
                  alt={performer.name}
                />
                <AvatarFallback>
                  {performer.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{performer.name}</p>
                <p className="text-xs text-gray-500">
                  {performer.calls} chamadas
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                {performer.improvement}
              </Badge>
              <span className="font-bold">{performer.score.toFixed(1)}</span>
            </div>
          </div>
          <Progress value={performer.score * 10} className="h-2" />
        </div>
      ))}
    </div>
  )
}
