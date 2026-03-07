import { useState, useEffect, useRef } from 'react'
import { useAtomValue } from 'jotai'
import { eventsAtom, sacMemAtom } from '../atoms/userAtom'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false)
    const [query, setQuery] = useState('')
    const events = useAtomValue(eventsAtom)
    const members = useAtomValue(sacMemAtom)
    const navigate = useNavigate()
    const inputRef = useRef(null)

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setIsOpen(prev => !prev)
            }
            if (e.key === 'Escape') {
                setIsOpen(false)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    const filteredResults = query.trim() === '' ? [] : [
        ...events.filter(e => e.event_title.toLowerCase().includes(query.toLowerCase())).map(e => ({ ...e, type: 'event', label: e.event_title, sub: `Event · ${e.date}`, url: `/details/${e.id}` })),
        ...members.filter(m => m.name.toLowerCase().includes(query.toLowerCase())).map(m => ({ ...m, type: 'member', label: m.name, sub: `Member · ${m.post}`, url: `/members` })),
        { type: 'action', label: 'Go to Dashboard', sub: 'Navigation', url: '/' },
        { type: 'action', label: 'Go to Events', sub: 'Navigation', url: '/events' },
        { type: 'action', label: 'Go to Members', sub: 'Navigation', url: '/members' },
        { type: 'action', label: 'Go to Resources', sub: 'Navigation', url: '/resources' },
    ].filter(item => item.label.toLowerCase().includes(query.toLowerCase())).slice(0, 8)

    const handleSelect = (url) => {
        navigate(url)
        setIsOpen(false)
        setQuery('')
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    style={{
                        position: 'fixed', inset: 0, zIndex: 9999,
                        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                        paddingTop: '15vh', background: 'rgba(0,0,0,0.4)',
                        backdropFilter: 'blur(4px)'
                    }}
                    onClick={() => setIsOpen(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            width: '100%', maxWidth: '600px',
                            background: 'rgba(18,18,26,0.98)',
                            border: '1px solid var(--border-hover)',
                            borderRadius: '12px',
                            boxShadow: '0 25px 50px rgba(0,0,0,0.5), var(--glow-md)',
                            overflow: 'hidden'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <svg width="20" height="20" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                            </svg>
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search for events, members, or pages..."
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                style={{
                                    width: '100%', background: 'none', border: 'none',
                                    color: 'var(--foreground)', fontSize: '1rem', outline: 'none',
                                    fontFamily: 'var(--font-body)'
                                }}
                            />
                            <div style={{
                                padding: '0.25rem 0.5rem', borderRadius: '4px',
                                background: 'rgba(255,255,255,0.05)', color: 'var(--muted-foreground)',
                                fontSize: '0.7rem', fontWeight: 600, border: '1px solid var(--border)'
                            }}>
                                ESC
                            </div>
                        </div>

                        <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '0.5rem' }}>
                            {filteredResults.length > 0 ? (
                                filteredResults.map((item, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSelect(item.url)}
                                        style={{
                                            width: '100%', display: 'flex', alignItems: 'center', gap: '1rem',
                                            padding: '0.75rem 1rem', borderRadius: '8px', border: 'none',
                                            background: 'transparent', textAlign: 'left', cursor: 'pointer',
                                            transition: 'background 200ms'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '6px',
                                            background: item.type === 'event' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            {item.type === 'event' && <span style={{ fontSize: '1rem' }}>📅</span>}
                                            {item.type === 'member' && <span style={{ fontSize: '1rem' }}>👤</span>}
                                            {item.type === 'action' && <span style={{ fontSize: '1rem' }}>⚡</span>}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 500, color: 'var(--foreground)' }}>{item.label}</p>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{item.sub}</p>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
                                    {query ? 'No results found.' : 'Type something to search...'}
                                </p>
                            )}
                        </div>

                        <div style={{
                            padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.2)',
                            borderTop: '1px solid var(--border)', display: 'flex', gap: '1rem'
                        }}>
                            <span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <kbd style={{ padding: '0.1rem 0.3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '3px' }}>↵</kbd> Select
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <kbd style={{ padding: '0.1rem 0.3rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '3px' }}>↑↓</kbd> Navigate
                            </span>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

export default CommandPalette
