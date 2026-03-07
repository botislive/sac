import { useState } from "react"
import { setEventsAtom, sacMemAtom, clubs } from "../atoms/userAtom"
import { useAtom, useAtomValue } from "jotai"
import { toast } from "sonner"

function EventForm() {
    const [members] = useAtom(sacMemAtom)
    const [, setEvents] = useAtom(setEventsAtom)
    const clubList = useAtomValue(clubs)

    const [club_name, setClub_name] = useState("")
    const [department, setDepartment] = useState("")
    const [event_title, setEvent_title] = useState("")
    const [event_date, setEvent_date] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCoordinators, setSelectedCoordinators] = useState([])

    const allDepartments = [...new Set((clubList || []).map(c => c.department).filter(Boolean))]

    const filteredMembers = (members || []).filter(m =>
        m.name && m.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const toggleCoordinator = (member) => {
        const isSelected = selectedCoordinators.some(s => s.name === member.name)
        setSelectedCoordinators(isSelected
            ? selectedCoordinators.filter(s => s.name !== member.name)
            : [...selectedCoordinators, member]
        )
    }

    const handleClubChange = (e) => {
        const selected = e.target.value
        setClub_name(selected)
        const matchedClub = (clubList || []).find(c => c.name === selected)
        setDepartment(matchedClub?.department || "")
    }

    const handlesubmit = (e) => {
        e.preventDefault()
        setEvents({ club_name, department, event_title, event_date, coordinators: selectedCoordinators })
        toast.success("Event added successfully!")
        setClub_name("")
        setDepartment("")
        setEvent_title("")
        setEvent_date("")
        setSelectedCoordinators([])
        setSearchTerm("")
    }

    return (
        <form onSubmit={handlesubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>

            <div>
                <label className="label-dark" htmlFor="event-club">Select Club</label>
                <div style={{ position: 'relative' }}>
                    <select
                        id="event-club"
                        className="select-dark"
                        value={club_name}
                        onChange={handleClubChange}
                        required
                    >
                        <option value="" disabled>— Choose a Club —</option>
                        {(clubList || []).map(club => <option key={club.name} value={club.name}>{club.name}</option>)}
                    </select>
                    <svg style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="14" height="14" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round"><polyline points="4 6 8 10 12 6" /></svg>
                </div>
            </div>

            <div>
                <label className="label-dark" htmlFor="event-department">Department</label>
                <div style={{ position: 'relative' }}>
                    <select
                        id="event-department"
                        className="select-dark"
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                        required
                    >
                        <option value="" disabled>— Select Department —</option>
                        {allDepartments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                    <svg style={{ position: 'absolute', right: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="14" height="14" fill="none" stroke="var(--muted-foreground)" strokeWidth="2" strokeLinecap="round"><polyline points="4 6 8 10 12 6" /></svg>
                </div>
                {club_name && department && (
                    <p style={{ marginTop: '0.35rem', fontSize: '0.75rem', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)' }}>
                        Auto-filled from club · you can override
                    </p>
                )}
            </div>

            <div>
                <label className="label-dark" htmlFor="event-title">Event Title</label>
                <input
                    id="event-title"
                    className="input-dark"
                    value={event_title}
                    onChange={e => setEvent_title(e.target.value)}
                    placeholder="Enter the event name"
                    type="text"
                    required
                />
            </div>

            <div>
                <label className="label-dark" htmlFor="event-date">Event Date</label>
                <input
                    id="event-date"
                    className="input-dark"
                    value={event_date}
                    onChange={e => setEvent_date(e.target.value)}
                    type="date"
                    required
                    style={{ colorScheme: 'dark' }}
                />
            </div>

        
            <div>
                <label className="label-dark">Coordinators</label>

               
                {selectedCoordinators.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginBottom: '0.625rem' }}>
                        {selectedCoordinators.map(m => (
                            <span key={m.name} className="badge-amber" style={{ gap: '0.375rem' }}>
                                {m.name}
                                <button
                                    type="button"
                                    onClick={() => toggleCoordinator(m)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', padding: 0, lineHeight: 1, fontSize: '1rem' }}
                                    aria-label={`Remove ${m.name}`}
                                >×</button>
                            </span>
                        ))}
                    </div>
                )}

               
                <input
                    type="text"
                    placeholder="Search members…"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="input-dark"
                    style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
                />

               
                <div style={{
                    border: '1px solid var(--border)', borderTop: 'none',
                    borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem',
                    maxHeight: 160, overflowY: 'auto',
                    background: 'rgba(10,10,15,0.80)',
                    backdropFilter: 'blur(8px)',
                    padding: '0.375rem',
                }}>
                    {filteredMembers.map(member => {
                        const isSelected = selectedCoordinators.some(s => s.name === member.name)
                        return (
                            <label
                                key={member.name}
                                htmlFor={`coord-${member.name}`}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.625rem',
                                    padding: '0.5rem 0.625rem',
                                    borderRadius: '0.375rem',
                                    cursor: 'pointer',
                                    background: isSelected ? 'rgba(245,158,11,0.08)' : 'transparent',
                                    transition: 'background 150ms',
                                }}
                                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                                onMouseLeave={e => { e.currentTarget.style.background = isSelected ? 'rgba(245,158,11,0.08)' : 'transparent' }}
                            >
                                <input
                                    type="checkbox"
                                    id={`coord-${member.name}`}
                                    checked={isSelected}
                                    onChange={() => toggleCoordinator(member)}
                                    style={{ accentColor: 'var(--accent)', width: 14, height: 14, flexShrink: 0 }}
                                />
                                <div>
                                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 500, color: isSelected ? 'var(--accent)' : 'var(--foreground)' }}>{member.name}</span>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted-foreground)', display: 'block' }}>{member.post}</span>
                                </div>
                            </label>
                        )
                    })}
                    {filteredMembers.length === 0 && (
                        <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--muted-foreground)', padding: '0.75rem', margin: 0 }}>
                            No members found
                        </p>
                    )}
                </div>
            </div>

            <button id="btn-submit-event" type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.25rem' }}>
                Submit Event
            </button>
        </form>
    )
}

export default EventForm
