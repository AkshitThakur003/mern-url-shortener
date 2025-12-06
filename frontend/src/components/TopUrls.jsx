import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const TopUrls = ({ urls, loading }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Links by Clicks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!urls || urls.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Links by Clicks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No links with clicks yet
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 5 Links by Clicks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 sm:space-y-3">
          {urls.map((url, index) => (
            <div
              key={url.id}
              className="flex items-center justify-between p-2.5 sm:p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium truncate">
                    {url.shortCode}
                  </p>
                  <p className="text-xs text-muted-foreground truncate hidden sm:block">
                    {url.originalUrl}
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 ml-2 sm:ml-4 text-right">
                <span className="text-base sm:text-lg font-bold text-primary">
                  {url.clicks}
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground ml-1 block sm:inline">
                  clicks
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default TopUrls

