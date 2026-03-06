import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAtom } from "jotai"
import { authAtomWithStorage } from "../atoms/authAtom"

function SacLogoLarge({ size = 72 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 100 110" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="SAC Logo">
            <path d="M50 4 L90 22 L90 60 Q90 85 50 106 Q10 85 10 60 L10 22 Z" fill="url(#shieldGradL)" stroke="url(#borderGradL)" strokeWidth="2" />
            <defs>
                <linearGradient id="shieldGradL" x1="0" y1="0" x2="100" y2="110" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="60%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
                <linearGradient id="borderGradL" x1="0" y1="0" x2="100" y2="110" gradientUnits="userSpaceOnUse">
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

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [, setIsAuthenticated] = useAtom(authAtomWithStorage)
    const navigate = useNavigate()

    const submitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        await new Promise(r => setTimeout(r, 400))
        if (username === 'srk@123' && password === 'admin@123') {
            setIsAuthenticated(true)
            navigate('/')
        } else {
            setError('Invalid username or password')
        }
        setLoading(false)
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--background)',
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Ambient orbs */}
            <div aria-hidden style={{
                position: 'absolute', top: '-15%', left: '50%', transform: 'translateX(-50%)',
                width: 700, height: 500,
                background: 'radial-gradient(ellipse, rgba(245,158,11,0.06) 0%, transparent 65%)',
                filter: 'blur(60px)', pointerEvents: 'none',
            }} />
            <div aria-hidden style={{
                position: 'absolute', bottom: '-10%', right: '-10%',
                width: 450, height: 450,
                background: 'radial-gradient(ellipse, rgba(124,58,237,0.05) 0%, transparent 65%)',
                filter: 'blur(80px)', pointerEvents: 'none',
            }} />

            {/* Login Card */}
            <div className="card-glass animate-fade-in" style={{ width: '100%', maxWidth: 420, position: 'relative' }}>

                {/* Card header */}
                <div style={{
                    padding: '2rem 2rem 1.5rem',
                    borderBottom: '1px solid var(--border)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
                    background: 'radial-gradient(ellipse at top, rgba(245,158,11,0.04) 0%, transparent 60%)',
                }}>
                    <SacLogoLarge size={72} />
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{
                            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem',
                            color: 'var(--foreground)', letterSpacing: '-0.025em', margin: 0,
                        }}>
                            <span style={{ color: 'var(--accent)' }}>SAC</span> Log Book
                        </h1>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--muted-foreground)', marginTop: '0.3rem' }}>
                            VIIT(A) · Student Activity Council
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div style={{ padding: '1.75rem 2rem 2rem' }}>
                    {error && (
                        <div style={{
                            marginBottom: '1.25rem', padding: '0.75rem 1rem',
                            background: 'rgba(245, 158, 11, 0.08)',
                            border: '1px solid rgba(245, 158, 11, 0.25)',
                            borderRadius: '0.5rem',
                            color: '#fbbf24',
                            fontSize: '0.875rem',
                            fontFamily: 'var(--font-body)',
                            textAlign: 'center',
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={submitHandler} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label className="label-dark" htmlFor="login-username">Username</label>
                            <input
                                id="login-username"
                                className="input-dark"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                type="text"
                                placeholder="Enter your username"
                                autoComplete="username"
                                required
                            />
                        </div>

                        <div>
                            <label className="label-dark" htmlFor="login-password">Password</label>
                            <input
                                id="login-password"
                                className="input-dark"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                type="password"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                            />
                        </div>

                        <button
                            id="btn-login"
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%', marginTop: '0.5rem' }}
                            disabled={loading}
                        >
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
                                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                                    </svg>
                                    Authenticating…
                                </span>
                            ) : 'Sign In to Dashboard'}
                        </button>
                    </form>

                    {/* Temp credentials hint */}
                    <div style={{
                        marginTop: '1.5rem', padding: '0.75rem',
                        background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                        borderRadius: '0.5rem', textAlign: 'center',
                    }}>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                            Demo · <span style={{ color: 'var(--foreground)' }}>srk@123</span> / <span style={{ color: 'var(--foreground)' }}>admin@123</span>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
    )
}

export default Login