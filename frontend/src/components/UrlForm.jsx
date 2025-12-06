import { useState } from 'react'
import axios from '@/utils/axios'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const UrlForm = ({ onUrlCreated }) => {
  const [formData, setFormData] = useState({
    originalUrl: '',
    shortCode: '',
    expiresAt: '',
    generateQR: false,
    fetchPreview: false,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        originalUrl: formData.originalUrl,
        generateQR: formData.generateQR,
        fetchPreview: formData.fetchPreview,
      }

      if (formData.shortCode.trim()) {
        payload.shortCode = formData.shortCode.trim()
      }

      if (formData.expiresAt) {
        // Convert datetime-local format to ISO string
        const date = new Date(formData.expiresAt)
        payload.expiresAt = date.toISOString()
      }

      const response = await axios.post('/api/urls', payload)
      
      toast.success('Short URL created successfully!')
      
      // Show QR code if generated
      if (response.data.data.url.qrCode) {
        // You can display QR code in a modal or toast
        toast.success('QR code generated!', {
          icon: '📱',
        })
      }
      
      setFormData({ originalUrl: '', shortCode: '', expiresAt: '', generateQR: false, fetchPreview: false })
      
      if (onUrlCreated) {
        onUrlCreated(response.data.data.url)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create short URL'
      const errors = error.response?.data?.errors
      
      if (errors && Array.isArray(errors)) {
        errors.forEach((err) => {
          toast.error(err.message || errorMessage)
        })
      } else {
        toast.error(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Short Link</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="originalUrl"
              className="text-sm font-medium text-foreground"
            >
              Long URL <span className="text-destructive">*</span>
            </label>
            <input
              type="url"
              id="originalUrl"
              name="originalUrl"
              value={formData.originalUrl}
              onChange={handleChange}
              required
              placeholder="https://example.com/very/long/url"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="shortCode"
              className="text-sm font-medium text-foreground"
            >
              Custom Alias (Optional)
            </label>
            <input
              type="text"
              id="shortCode"
              name="shortCode"
              value={formData.shortCode}
              onChange={handleChange}
              placeholder="my-custom-link"
              pattern="[a-z0-9-_]+"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <p className="text-xs text-muted-foreground">
              Only lowercase letters, numbers, hyphens, and underscores (3-20 characters)
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="expiresAt"
              className="text-sm font-medium text-foreground"
            >
              Expiry Date (Optional)
            </label>
            <input
              type="datetime-local"
              id="expiresAt"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleChange}
              min={today}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="generateQR"
                name="generateQR"
                checked={formData.generateQR}
                onChange={(e) => setFormData({ ...formData, generateQR: e.target.checked })}
                className="h-4 w-4 rounded border-input bg-background accent-primary cursor-pointer"
              />
              <label htmlFor="generateQR" className="text-sm font-medium cursor-pointer text-foreground">
                Generate QR Code
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="fetchPreview"
                name="fetchPreview"
                checked={formData.fetchPreview}
                onChange={(e) => setFormData({ ...formData, fetchPreview: e.target.checked })}
                className="h-4 w-4 rounded border-input bg-background accent-primary cursor-pointer"
              />
              <label htmlFor="fetchPreview" className="text-sm font-medium cursor-pointer">
                Fetch Link Preview
              </label>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Creating...' : 'Create Short Link'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default UrlForm

