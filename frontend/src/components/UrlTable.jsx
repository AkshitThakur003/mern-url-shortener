import { useState } from 'react'
import axios from '@/utils/axios'
import toast from 'react-hot-toast'
import { Copy, Check, Trash2, Power } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const UrlTable = ({ urls, loading, onUpdate }) => {
  const [copyingId, setCopyingId] = useState(null)

  const handleCopy = async (shortUrl, id) => {
    setCopyingId(id)
    try {
      await navigator.clipboard.writeText(shortUrl)
      toast.success('Copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy')
    } finally {
      setCopyingId(null)
    }
  }

  const handleToggleDisable = async (url) => {
    try {
      await axios.patch(`/api/urls/${url.id}`, {
        disabled: !url.disabled,
      })
      toast.success(`URL ${url.disabled ? 'enabled' : 'disabled'} successfully`)
      if (onUpdate) {
        onUpdate()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update URL')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) {
      return
    }

    try {
      await axios.delete(`/api/urls/${id}`)
      toast.success('URL deleted successfully')
      if (onUpdate) {
        onUpdate()
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete URL')
    }
  }

  const getStatusBadge = (url) => {
    if (url.disabled) {
      return <Badge variant="secondary">Disabled</Badge>
    }
    if (url.isExpired) {
      return <Badge variant="destructive">Expired</Badge>
    }
    return <Badge>Active</Badge>
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!urls || urls.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Links</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No links created yet. Create your first short link above!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Your Links</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mobile View - Card Layout */}
        <div className="block md:hidden space-y-3">
          {urls.map((url) => (
            <div
              key={url.id}
              className="p-4 border rounded-lg hover:bg-accent/50 transition-colors space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-primary break-all">
                      {url.shortUrl}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(url.shortUrl, url.id)}
                      disabled={copyingId === url.id}
                      className="h-7 w-7 shrink-0"
                      title="Copy to clipboard"
                    >
                      {copyingId === url.id ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mb-2" title={url.originalUrl}>
                    {url.originalUrl}
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-medium">
                      {url.clicks} clicks
                    </span>
                    {getStatusBadge(url)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleDisable(url)}
                  className="h-8 flex-1 text-xs"
                >
                  <Power className="h-3.5 w-3.5 mr-1.5" />
                  {url.disabled ? 'Enable' : 'Disable'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(url.id)}
                  className="h-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View - Table Layout */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Short Link
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Original URL
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {urls.map((url) => (
                <tr key={url.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-primary break-all">
                        {url.shortUrl}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy(url.shortUrl, url.id)}
                        disabled={copyingId === url.id}
                        className="h-8 w-8 shrink-0"
                        title="Copy to clipboard"
                      >
                        {copyingId === url.id ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-sm max-w-md truncate" title={url.originalUrl}>
                      {url.originalUrl}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium">
                      {url.clicks}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(url)}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleDisable(url)}
                        className="h-8"
                      >
                        <Power className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">{url.disabled ? 'Enable' : 'Disable'}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(url.id)}
                        className="h-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

export default UrlTable

