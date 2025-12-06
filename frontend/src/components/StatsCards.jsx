import { Link2, MousePointerClick, CheckCircle2, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const StatsCards = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-4 sm:p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-muted rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) {
    return null
  }

  const cards = [
    {
      title: 'Total Links',
      value: stats.totalUrls || 0,
      icon: Link2,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Total Clicks',
      value: stats.totalClicks || 0,
      icon: MousePointerClick,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Active Links',
      value: stats.activeCount || 0,
      icon: CheckCircle2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Expired Links',
      value: stats.expiredCount || 0,
      icon: Clock,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title} className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                    {card.title}
                  </p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold mt-1 sm:mt-2">
                    {card.value.toLocaleString()}
                  </p>
                </div>
                <div className={`${card.bgColor} ${card.color} rounded-full p-2 sm:p-3 shrink-0 ml-2`}>
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

export default StatsCards

