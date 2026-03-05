import { Outlet, Link, useLocation, Navigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { authAtomWithStorage } from '../atoms/authAtom'
import { AnimatePresence, motion } from 'framer-motion'

function Layout() {
    const [isAuthenticated, setIsAuthenticated] = useAtom(authAtomWithStorage)
    const location = useLocation()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    const navigation = [
        { name: 'Dashboard', href: '/' },
        { name: 'Events Log', href: '/events' },
        { name: 'Members Log', href: '/members' },
    ]

    const handleLogout = () => {
        setIsAuthenticated(false)
    }

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 flex overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col hidden md:flex">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        SAC Log Book
                    </h2>
                    <p className="text-xs text-gray-400 mt-1">Event Management System</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-sm'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center">
                    <h2 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                        SAC LOG
                    </h2>
                    <div className="flex items-center gap-3">
                        <Link to="/" className="text-sm text-gray-300">Home</Link>
                        <button onClick={handleLogout} className="text-sm text-red-400">Logout</button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-950 flex flex-col">
                    <div className="max-w-6xl mx-auto w-full flex-1">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                className="h-full"
                            >
                                <Outlet />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Layout
