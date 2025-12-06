import { useSelector } from 'react-redux'
import { Link2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import DarkModeToggle from './DarkModeToggle'

const Navbar = ({ setSidebarOpen }) => {
  const { user } = useSelector((state) => state.auth)

  return (
    <nav className="bg-card shadow-sm border-b border-border fixed w-full top-0 z-50 backdrop-blur-none">
      <div className="px-4 sm:px-6 lg:px-8 bg-card">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <Link to="/dashboard" className="ml-4 lg:ml-0 flex items-center space-x-2">
              <Link2 className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Linkly
              </h1>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user?.name}
            </span>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

