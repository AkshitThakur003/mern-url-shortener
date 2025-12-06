import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Zap, 
  Shield, 
  BarChart3, 
  Link2, 
  ArrowRight, 
  Globe,
  Clock,
  Sparkles,
  TrendingUp
} from 'lucide-react'
import DarkModeToggle from '@/components/DarkModeToggle'

const Landing = () => {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95])

  const bentoFeatures = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Turn that mile-long URL into something shareable in seconds. No waiting, no hassle.',
      gradient: 'from-yellow-400 to-orange-500',
      size: 'col-span-1 md:col-span-2',
    },
    {
      icon: Shield,
      title: 'Your Links, Your Privacy',
      description: 'We take security seriously. Your links are encrypted and protected, always.',
      gradient: 'from-green-400 to-emerald-500',
      size: 'col-span-1',
    },
    {
      icon: BarChart3,
      title: 'See What Works',
      description: 'Know exactly who clicked, when, and where. Real insights, not just numbers.',
      gradient: 'from-blue-400 to-cyan-500',
      size: 'col-span-1 md:col-span-2',
    },
    {
      icon: Clock,
      title: 'Set It & Forget It',
      description: 'Links that expire when you want them to. Perfect for time-sensitive campaigns.',
      gradient: 'from-purple-400 to-pink-500',
      size: 'col-span-1',
    },
    {
      icon: Globe,
      title: 'Works Everywhere',
      description: 'Share your links globally. Fast, reliable, and accessible from anywhere.',
      gradient: 'from-indigo-400 to-blue-500',
      size: 'col-span-1',
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Reach',
      description: 'Track performance and optimize your sharing strategy with detailed analytics.',
      gradient: 'from-red-400 to-rose-500',
      size: 'col-span-1 md:col-span-2',
    },
  ]

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
        duration: 0.6,
        ease: "easeOut",
      },
    },
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-2"
            >
              <div className="relative">
                <Link2 className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <Sparkles className="h-4 w-4 text-indigo-400 dark:text-indigo-500" />
                </motion.div>
              </div>
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                Linkly
              </span>
            </motion.div>
            <div className="flex items-center space-x-4">
              <DarkModeToggle />
              <Link to="/login">
                <Button variant="ghost" className="hidden sm:inline-flex">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="hidden sm:inline-flex bg-indigo-600 hover:bg-indigo-700 text-white">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <motion.div 
          style={{ opacity, scale }}
          className="container mx-auto max-w-6xl"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-gray-900 dark:text-white leading-tight"
            >
              Links that actually
              <br />
              <span className="text-indigo-600 dark:text-indigo-400 relative inline-block">
                make sense
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-3 bg-indigo-200 dark:bg-indigo-900/50 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                />
              </span>
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Stop sharing those ugly, mile-long URLs. Create short, memorable links that people actually want to click. 
              <span className="block mt-2 text-lg">
                It's free, it's fast, and it just works.
              </span>
            </motion.p>
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/signup">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/50">
                    Start shortening for free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-2">
                  Already have an account?
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white">
              Everything you need
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              All the tools to make your links work harder, without the complexity.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {bentoFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={feature.size}
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 bg-card border-2 border-border group overflow-hidden relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    <CardHeader className="relative z-10">
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{ duration: 0.5 }}
                        className={`h-14 w-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg`}
                      >
                        <Icon className="h-7 w-7 text-white" />
                      </motion.div>
                      <CardTitle className="text-xl mb-2 text-gray-900 dark:text-white">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonial Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="inline-block mb-8"
            >
              <div className="text-6xl mb-4">✨</div>
            </motion.div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Loved by creators, marketers, and everyday users
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-12">
              Join thousands who've made their links simpler, smarter, and more shareable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 dark:from-indigo-700 dark:via-purple-700 dark:to-indigo-800 p-8 sm:p-12 md:p-16 text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
            />
            <div className="relative z-10">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4"
              >
                Ready to simplify your links?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
              >
                Get started in seconds. No credit card required. Just you, your links, and a whole lot of simplicity.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Link to="/signup">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="lg"
                      className="text-lg px-8 py-6 bg-white text-indigo-600 hover:bg-gray-100 shadow-xl"
                    >
                      Create your free account
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 sm:mb-0">
              <Link2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Linkly</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center sm:text-right">
              © {new Date().getFullYear()} Linkly. Made with ❤️ for simpler links.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
