import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function RecentCalls() {
  const calls = [
    {
      id: 1,
      seller: {
        name: 'Carlos Silva',
        avatar: '/thoughtful-man.png',
      },
      date: 'Hoje, 14:32',
      duration: '12:45',
      score: 8.5,
      status: 'success',
    },
    {
      id: 2,
      seller: {
        name: 'Ana Oliveira',
        avatar:
          '/default-avatar.png?height=40&width=40&query=woman with glasses',
      },
      date: 'Hoje, 11:15',
      duration: '08:22',
      score: 7.2,
      status: 'success',
    },
    {
      id: 3,
      seller: {
        name: 'Marcos Santos',
        avatar: '/default-avatar.png?height=40&width=40&query=man with beard',
      },
      date: 'Ontem, 16:48',
      duration: '15:30',
      score: 6.8,
      status: 'warning',
    },
    {
      id: 4,
      seller: {
        name: 'Juliana Costa',
        avatar:
          '/default-avatar.png?height=40&width=40&query=woman with long hair',
      },
      date: 'Ontem, 10:05',
      duration: '05:12',
      score: 9.1,
      status: 'success',
    },
    {
      id: 5,
      seller: {
        name: 'Roberto Almeida',
        avatar:
          '/default-avatar.png?height=40&width=40&query=older man with glasses',
      },
      date: '22/05/2023',
      duration: '11:37',
      score: 5.4,
      status: 'error',
    },
  ]

  return (
    <div className="space-y-4">
      {calls.map((call) => (
        <div
          key={call.id}
          className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
        >
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage
                src={call.seller.avatar || '/default-avatar.png'}
                alt={call.seller.name}
              />
              <AvatarFallback>
                {call.seller.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{call.seller.name}</p>
              <p className="text-sm text-gray-500">
                {call.date} • {call.duration}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Badge
              variant={
                call.status === 'success'
                  ? 'default'
                  : call.status === 'warning'
                    ? 'outline'
                    : 'destructive'
              }
            >
              {call.score.toFixed(1)}
            </Badge>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/admin/atendimentos/${call.id}`}>Detalhes</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
