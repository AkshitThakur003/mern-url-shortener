import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { User, Mail, Calendar, Shield, Link2, MousePointerClick, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import axios from '@/utils/axios'

const Profile = () => {
  const { user } = useSelector((state) => state.auth)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/urls/stats')
        setStats(response.data.data.aggregated)
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

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

  const getInitials = (name) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6 max-w-6xl mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-2">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-indigo-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
          Profile Settings
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Manage your account information and view your statistics
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Profile Card */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your personal account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 pb-6 border-b">
                <div className="relative">
                  <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-lg">
                    {getInitials(user?.name)}
                  </div>
                  <div className="absolute bottom-0 right-0 h-6 w-6 sm:h-7 sm:w-7 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                    <div className="h-3 w-3 sm:h-4 sm:w-4 bg-background rounded-full"></div>
                  </div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-xl sm:text-2xl font-bold mb-1">{user?.name}</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">{user?.email}</p>
                  <Badge className="mt-2" variant="secondary">
                    Active Account
                  </Badge>
                </div>
              </div>

              {/* Account Details */}
              <div className="space-y-4 sm:space-y-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground block mb-1">
                        Full Name
                      </label>
                      <p className="text-sm sm:text-base font-medium break-words">
                        {user?.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground block mb-1">
                        Email Address
                      </label>
                      <p className="text-sm sm:text-base font-medium break-all">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-xs sm:text-sm font-medium text-muted-foreground block mb-1">
                        Account Status
                      </label>
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Verified</Badge>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          Your account is secure
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Sidebar */}
        <motion.div variants={itemVariants} className="space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Your Statistics</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Quick overview of your account</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                      <div className="h-8 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : stats ? (
                <div className="space-y-4 sm:space-y-6">
                  <div className="p-3 sm:p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <Link2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                      <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                        Total Links
                      </span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {stats.totalUrls?.toLocaleString() || 0}
                    </p>
                  </div>

                  <div className="p-3 sm:p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <MousePointerClick className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
                      <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                        Total Clicks
                      </span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                      {stats.totalClicks?.toLocaleString() || 0}
                    </p>
                  </div>

                  <div className="p-3 sm:p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                        Active Links
                      </span>
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                      {stats.activeCount?.toLocaleString() || 0}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No statistics available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Account Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Member Since</p>
                  <p className="font-medium">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                        })
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Profile

