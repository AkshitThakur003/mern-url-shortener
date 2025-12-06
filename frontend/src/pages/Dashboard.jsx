import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from '@/utils/axios'
import { config } from '@/utils/config'
import { Sparkles, TrendingUp, Link2 } from 'lucide-react'
import UrlForm from '@/components/UrlForm'
import UrlTable from '@/components/UrlTable'
import StatsCards from '@/components/StatsCards'
import WeeklyChart from '@/components/WeeklyChart'
import TopUrls from '@/components/TopUrls'

const Dashboard = () => {
  const [urls, setUrls] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [statsLoading, setStatsLoading] = useState(true)

  const getBaseUrl = () => {
    // Use the API base URL but remove /api if present, or use current origin
    const apiUrl = config.API_BASE_URL || ''
    if (apiUrl.includes('/api')) {
      return apiUrl.replace('/api', '')
    }
    // Fallback to window location origin (for same-origin requests)
    return window.location.origin
  }

  const fetchUrls = async () => {
    try {
      const response = await axios.get('/api/urls')
      const baseUrl = getBaseUrl()
      const urlsWithShortUrl = response.data.data.urls.map((url) => ({
        ...url,
        shortUrl: url.shortUrl || `${baseUrl}/${url.shortCode}`,
      }))
      setUrls(urlsWithShortUrl)
    } catch (error) {
      console.error('Failed to fetch URLs:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/urls/stats')
      const baseUrl = getBaseUrl()
      // Add shortUrl to top URLs
      const topUrlsWithShortUrl = response.data.data.topUrls.map((url) => ({
        ...url,
        shortUrl: url.shortUrl || `${baseUrl}/${url.shortCode}`,
      }))
      setStats({
        ...response.data.data.aggregated,
        topUrls: topUrlsWithShortUrl,
        weeklyAnalytics: response.data.data.weeklyAnalytics,
      })
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setStatsLoading(false)
    }
  }

  useEffect(() => {
    fetchUrls()
    fetchStats()
  }, [])

  const handleUrlCreated = () => {
    fetchUrls()
    fetchStats()
  }

  const handleUrlUpdate = () => {
    fetchUrls()
    fetchStats()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-7xl mx-auto"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="space-y-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <Link2 className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600 dark:text-indigo-400" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-400 dark:text-indigo-500" />
            </motion.div>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
            Dashboard
          </h1>
        </div>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your links, track performance, and grow your audience
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants}>
        <StatsCards stats={stats} loading={statsLoading} />
      </motion.div>

      {/* Quick Stats Banner */}
      {stats && !statsLoading && (
        <motion.div
          variants={itemVariants}
          className="hidden sm:block relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 p-4 sm:p-6 text-white"
        >
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm sm:text-base opacity-90 mb-1">Total Performance</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
                  <p className="text-2xl sm:text-3xl font-bold">
                    {stats.totalClicks?.toLocaleString() || 0} Clicks
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm sm:text-base opacity-90 mb-1">Active Links</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {stats.activeCount || 0}
                </p>
              </div>
            </div>
          </div>
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
          />
        </motion.div>
      )}

      {/* URL Form */}
      <motion.div variants={itemVariants}>
        <UrlForm onUrlCreated={handleUrlCreated} />
      </motion.div>

      {/* Charts and Top URLs Row */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6"
      >
        <WeeklyChart data={stats?.weeklyAnalytics} loading={statsLoading} />
        <TopUrls urls={stats?.topUrls} loading={statsLoading} />
      </motion.div>

      {/* URLs Table */}
      <motion.div variants={itemVariants}>
        <UrlTable urls={urls} loading={loading} onUpdate={handleUrlUpdate} />
      </motion.div>
    </motion.div>
  )
}

export default Dashboard
