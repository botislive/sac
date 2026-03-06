import { useState } from 'react'
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { authAtomWithStorage } from '../atoms/authAtom'
import { AnimatePresence, motion } from 'framer-motion'

function SacLogo({ size = 36 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="SAC Logo">
            <path d="M50 4 L90 22 L90 60 Q90 85 50 106 Q10 85 10 60 L10 22 Z" fill="url(#shieldGrad)" stroke="url(#borderGrad)" strokeWidth="2.5" />
            <defs>
                <linearGradient id="shieldGrad" x1="0" y1="0" x2="100" y2="110" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="60%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
                <linearGradient id="borderGrad" x1="0" y1="0" x2="100" y2="110" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#A78BFA" />
                    <stop offset="100%" stopColor="#60A5FA" />
                </linearGradient>
            </defs>
            <text x="50" y="58" textAnchor="middle" fontFamily="'Space Grotesk', sans-serif" fontWeight="700" fontSize="38" fill="white" letterSpacing="-1">SAC</text>
            <rect x="16" y="62" width="68" height="18" rx="3" fill="#2563EB" />
            <text x="50" y="75" textAnchor="middle" fontFamily="'Inter', sans-serif" fontWeight="600" fontSize="9" fill="white" letterSpacing="1">STUDENT ACTIVITY</text>
        </svg>
    )
}

function Layout() {
    const [isAuthenticated, setIsAuthenticated] = useAtom(authAtomWithStorage)
    const location = useLocation()
    const [mobileOpen, setMobileOpen] = useState(false)

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
        setMobileOpen(false)
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>

            {/* Ambient Background Orbs */}
            <div
                aria-hidden="true"
                style={{
                    position: 'fixed', top: '-10%', left: '50%', transform: 'translateX(-50%)',
                    width: 600, height: 400,
                    background: 'radial-gradient(ellipse, rgba(245,158,11,0.04) 0%, transparent 70%)',
                    filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0,
                }}
            />
            <div
                aria-hidden="true"
                style={{
                    position: 'fixed', bottom: '-5%', right: '-10%',
                    width: 500, height: 400,
                    background: 'radial-gradient(ellipse, rgba(124,58,237,0.03) 0%, transparent 70%)',
                    filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0,
                }}
            />

            {/* ── TOP NAVBAR ──────────────────────────────────── */}
            <header
                style={{
                    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
                    height: 64,
                    background: 'rgba(10, 10, 15, 0.85)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    borderBottom: '1px solid var(--border)',
                }}
            >
                <div style={{ maxWidth: '72rem', margin: '0 auto', height: '100%', padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>

                    {/* Logo + Wordmark */}
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', flexShrink: 0 }}>
                        <SacLogo size={38} />
                        <div style={{ lineHeight: 1 }}>
                            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.125rem', color: 'var(--foreground)', letterSpacing: '-0.02em' }}>
                                <span style={{ color: 'var(--accent)' }}>SAC</span> Log Book
                            </span>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--muted-foreground)', letterSpacing: '0.06em', marginTop: 2 }}>
                                VIIT(A) · Student Activity Council
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: 'auto' }}>
                        {navigation.map((item) => {
                            const isActive = location.pathname === item.href
                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`nav-link${isActive ? ' active' : ''}`}
                                    id={`nav-${item.name.toLowerCase().replace(' ', '-')}`}
                                >
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Sign Out — Desktop */}
                    <button
                        id="btn-signout"
                        onClick={handleLogout}
                        className="hidden md:inline-flex btn-ghost"
                        style={{ color: '#f87171', marginLeft: '0.5rem' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        Sign Out
                    </button>

                    {/* Mobile Hamburger */}
                    <button
                        id="btn-mobile-menu"
                        className="md:hidden btn-ghost"
                        onClick={() => setMobileOpen(v => !v)}
                        aria-label="Toggle navigation"
                        style={{ marginLeft: 'auto', padding: '0.5rem', color: 'var(--muted-foreground)' }}
                    >
                        {mobileOpen ? (
                            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <line x1="4" y1="4" x2="20" y2="20" />
                                <line x1="20" y1="4" x2="4" y2="20" />
                            </svg>
                        ) : (
                            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Mobile Drawer */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            style={{
                                position: 'absolute', top: 64, left: 0, right: 0,
                                background: 'rgba(10, 10, 15, 0.95)',
                                backdropFilter: 'blur(12px)',
                                WebkitBackdropFilter: 'blur(12px)',
                                borderBottom: '1px solid var(--border)',
                                padding: '1rem 1.5rem 1.25rem',
                                display: 'flex', flexDirection: 'column', gap: '0.25rem',
                            }}
                        >
                            {navigation.map((item) => {
                                const isActive = location.pathname === item.href
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`nav-link${isActive ? ' active' : ''}`}
                                        style={{ width: '100%', justifyContent: 'flex-start' }}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                )
                            })}
                            <hr className="divider" style={{ margin: '0.5rem 0' }} />
                            <button
                                onClick={handleLogout}
                                className="btn-ghost"
                                style={{ color: '#f87171', justifyContent: 'flex-start', width: '100%' }}
                            >
                                Sign Out
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* ── PAGE CONTENT ──────────────────────────────── */}
            <main style={{ paddingTop: 64, minHeight: '100vh', position: 'relative', zIndex: 1 }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -14 }}
                            transition={{ duration: 0.22, ease: 'easeInOut' }}
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    )
}

export default Layout
