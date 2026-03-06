import { useState } from "react"
import { useAtom, useAtomValue } from "jotai"
import { sacMemAtom, eventsAtom } from "../atoms/userAtom"
import MemberForm from '../components/MemberForm'
import ExportMenu from '../components/ExportMenu'
import { exportMembersCSV, exportMembersPDF } from '../utils/exportUtils'

function Members() {
  const [members] = useAtom(sacMemAtom)
  const allEvents = useAtomValue(eventsAtom)
  const [selectedMember, setSelectedMember] = useState(null)

  const getMemberEvents = (memberName) => {
    const memberEvents = allEvents.filter(event => {
      const coords = event.coordinators || []
      return coords.some(coord =>
        (typeof coord === 'string' ? coord : coord.name) === memberName
      )
    })
    return {
      upcoming: memberEvents.filter(e => !e.is_complete),
      past: memberEvents.filter(e => e.is_complete),
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>

      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2rem',
            color: 'var(--foreground)', letterSpacing: '-0.025em', margin: 0,
          }}>
            Members <span style={{ color: 'var(--accent)' }}>Directory</span>
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', marginTop: '0.375rem', fontSize: '0.9375rem' }}>
            Manage and register SAC team members.
          </p>
        </div>
        <ExportMenu
          label="Members"
          onExportCSV={() => exportMembersCSV(members)}
          onExportPDF={() => exportMembersPDF(members)}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', alignItems: 'start' }}
        className="members-grid">

        
        <div className="panel">
          <div className="panel-header">
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.0625rem', color: 'var(--foreground)', margin: 0 }}>
              Add Member
            </h2>
          </div>
          <div className="panel-body">
            <MemberForm />
          </div>
        </div>

       
        <div className="panel" style={{ minHeight: 480 }}>
          <div className="panel-header">
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.0625rem', color: 'var(--foreground)', margin: 0 }}>
              Directory
            </h2>
            <span className="badge-amber">{members.length} Total</span>
          </div>
          <div className="panel-body">
            {members.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.875rem' }}>
                {members.map((member, i) => (
                  <MemberCard key={i} member={member} onClick={() => setSelectedMember(member)} />
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 280 }}>
                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="var(--muted-foreground)" strokeWidth="1.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', marginTop: '0.875rem', fontSize: '0.9375rem' }}>
                  No members registered yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      
      {selectedMember && (() => {
        const events = getMemberEvents(selectedMember.name)
        return (
          <div
            style={{
              position: 'fixed', inset: 0, zIndex: 60,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1.25rem',
              background: 'rgba(0,0,0,0.65)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
            }}
            onClick={() => setSelectedMember(null)}
          >
            <div
              style={{
                background: 'rgba(18,18,26,0.96)',
                border: '1px solid var(--border-hover)',
                borderRadius: '1rem',
                width: '100%', maxWidth: 640, maxHeight: '85vh',
                overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5), var(--glow-sm)',
              }}
              onClick={e => e.stopPropagation()}
            >
              
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid var(--border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                background: 'rgba(10,10,15,0.5)',
                flexShrink: 0,
              }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.375rem', color: 'var(--foreground)', margin: 0, letterSpacing: '-0.02em' }}>
                    {selectedMember.name}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginTop: '0.375rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--accent)', fontWeight: 600 }}>{selectedMember.post}</span>
                    <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--muted-foreground)', display: 'inline-block' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>
                      {selectedMember.branch || 'Unspecified'} · {selectedMember.year || 'N/A'} Year
                    </span>
                  </div>
                </div>
                <button
                  id="btn-close-modal"
                  onClick={() => setSelectedMember(null)}
                  className="btn-ghost"
                  style={{ padding: '0.375rem', borderRadius: '0.5rem', color: 'var(--muted-foreground)' }}
                  aria-label="Close"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="4" y1="4" x2="14" y2="14" /><line x1="14" y1="4" x2="4" y2="14" />
                  </svg>
                </button>
              </div>

             
              <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

                
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.875rem' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block', boxShadow: 'var(--glow-sm)' }} />
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.0625rem', color: 'var(--foreground)', margin: 0 }}>Upcoming Events</h3>
                    <span className="badge-amber">{events.upcoming.length}</span>
                  </div>
                  {events.upcoming.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {events.upcoming.map(event => (
                        <div key={event.id} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '0.75rem 1rem',
                          background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.12)',
                          borderRadius: '0.625rem',
                        }}>
                          <div>
                            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>{event.event_title}</p>
                            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted-foreground)', margin: '2px 0 0' }}>{event.club_name}</p>
                          </div>
                          <span className="badge-amber" style={{ fontSize: '0.7rem', whiteSpace: 'nowrap' }}>{event.date}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      padding: '1.25rem', textAlign: 'center',
                      border: '1px dashed var(--border)', borderRadius: '0.625rem',
                    }}>
                      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', margin: 0, fontSize: '0.875rem' }}>No upcoming events scheduled.</p>
                    </div>
                  )}
                </div>

               
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.875rem' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.0625rem', color: 'var(--foreground)', margin: 0 }}>Past Events</h3>
                    <span className="badge-success">{events.past.length}</span>
                  </div>
                  {events.past.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {events.past.map(event => (
                        <div key={event.id} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '0.75rem 1rem',
                          background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                          borderRadius: '0.625rem',
                        }}>
                          <div>
                            <p style={{ fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--muted-foreground)', margin: 0 }}>{event.event_title}</p>
                            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'rgba(113,113,122,0.6)', margin: '2px 0 0' }}>{event.club_name}</p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted-foreground)', whiteSpace: 'nowrap' }}>{event.date}</span>
                            <span className="badge-success" style={{ padding: '0.25rem', borderRadius: '50%' }}>
                              <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <polyline points="1 5 4 8 9 2" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      padding: '1.25rem', textAlign: 'center',
                      border: '1px dashed var(--border)', borderRadius: '0.625rem',
                    }}>
                      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', margin: 0, fontSize: '0.875rem' }}>No past events recorded.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      <style>{`
                @media (max-width: 768px) {
                    .members-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
    </div>
  )
}

function MemberCard({ member, onClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      id={`member-card-${member.name?.toLowerCase().replace(/\s+/g, '-')}`}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => e.key === 'Enter' && onClick()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? 'rgba(245,158,11,0.30)' : 'var(--border)'}`,
        background: hovered ? 'rgba(245,158,11,0.04)' : 'rgba(26,26,36,0.40)',
        borderRadius: '0.75rem',
        padding: '1.125rem',
        cursor: 'pointer',
        transition: 'all 250ms ease-out',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? 'var(--glow-sm)' : 'none',
        outline: 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.875rem' }}>
        <div>
          <h3 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem',
            color: hovered ? 'var(--accent)' : 'var(--foreground)',
            margin: 0, transition: 'color 200ms',
          }}>{member.name}</h3>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#10b981', margin: '2px 0 0', fontWeight: 500 }}>{member.post}</p>
        </div>
        <span className="badge-muted" style={{ fontSize: '0.7rem', whiteSpace: 'nowrap' }}>{member.year || 'N/A'}Y</span>
      </div>

      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="var(--muted-foreground)" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--foreground)' }}>{member.branch || 'Unspecified'}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="var(--muted-foreground)" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--foreground)' }}>{member.phone || 'No phone'}</span>
        </div>
      </div>
    </div>
  )
}

export default Members