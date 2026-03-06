import { Link } from "react-router-dom"
import { useAtom } from "jotai"
import { eventsAtom, sacMemAtom } from "../atoms/userAtom"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const AMBER_PALETTE = ['#F59E0B', '#D97706', '#B45309', '#92400E', '#FBBF24', '#FCD34D', '#FDE68A']

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(18,18,26,0.95)', border: '1px solid rgba(245,158,11,0.20)',
        borderRadius: '0.5rem', padding: '0.625rem 0.875rem',
        boxShadow: '0 0 20px rgba(245,158,11,0.10)',
      }}>
        <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--foreground)', margin: 0, fontSize: '0.875rem' }}>
          {payload[0].name}
        </p>
        <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent)', margin: '2px 0 0', fontSize: '0.8125rem' }}>
          {payload[0].value} event{payload[0].value !== 1 ? 's' : ''}
        </p>
      </div>
    )
  }
  return null
}

function Home() {
  const [events] = useAtom(eventsAtom)
  const [members] = useAtom(sacMemAtom)

  const stats = [
    { label: 'Total Events', value: events.length || 0, icon: '📅' },
    { label: 'Upcoming', value: events.filter(e => !e.is_complete).length || 0, icon: '⏳' },
    { label: 'Completed', value: events.filter(e => e.is_complete).length || 0, icon: '✅' },
    { label: 'Active Members', value: members.length || 0, icon: '👥' },
  ]

  const clubDistribution = events.reduce((acc, event) => {
    acc[event.club_name] = (acc[event.club_name] || 0) + 1
    return acc
  }, {})

  const pieData = Object.entries(clubDistribution).map(([name, value]) => ({ name, value }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

      {/* Page header */}
      <div>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2rem',
          color: 'var(--foreground)', letterSpacing: '-0.025em', margin: 0,
        }}>
          Dashboard <span style={{ color: 'var(--accent)' }}>Overview</span>
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', marginTop: '0.375rem', fontSize: '0.9375rem' }}>
          Welcome back — here's what's happening with VIIT(A) SAC.
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{stat.icon}</div>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted-foreground)', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>
              {stat.label}
            </p>
            <p style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2.5rem',
              color: 'var(--accent)', letterSpacing: '-0.03em', margin: '0.25rem 0 0',
              lineHeight: 1,
            }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Chart + Quick panels row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }} className="lg-grid-cols-2">

        {/* Events by Club chart */}
        <div className="panel" style={{ gridColumn: pieData.length === 0 ? '1 / -1' : undefined }}>
          <div className="panel-header">
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.0625rem', color: 'var(--foreground)', margin: 0, letterSpacing: '-0.01em' }}>
              Events by Club
            </h2>
            <span className="badge-amber">{pieData.length} clubs</span>
          </div>
          <div className="panel-body" style={{ padding: '1.25rem 1.5rem' }}>
            {pieData.length > 0 ? (
              <div style={{ height: 230, minHeight: 230, minWidth: 0 }}>
                <ResponsiveContainer width="100%" height={230} minWidth={0} minHeight={230}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%" cy="50%"
                      innerRadius={58} outerRadius={88}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={AMBER_PALETTE[index % AMBER_PALETTE.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)', fontSize: '0.9375rem' }}>No events data yet.</p>
              </div>
            )}
            {/* Legend */}
            {pieData.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', marginTop: '0.75rem' }}>
                {pieData.map((entry, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: AMBER_PALETTE[i % AMBER_PALETTE.length], display: 'inline-block', flexShrink: 0 }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{entry.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column — members + upcoming events stacked */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Recent Members */}
          <div className="panel">
            <div className="panel-header">
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.0625rem', color: 'var(--foreground)', margin: 0, letterSpacing: '-0.01em' }}>
                Recent Members
              </h2>
              <Link
                to="/members"
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--accent)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                View All →
              </Link>
            </div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {members.slice(0, 3).map((member, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.625rem 0.875rem',
                  background: 'rgba(255,255,255,0.030)', border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                }}>
                  <div>
                    <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--foreground)', margin: 0, fontSize: '0.9375rem' }}>{member.name}</p>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted-foreground)', margin: '1px 0 0' }}>{member.post}</p>
                  </div>
                  <span className="badge-muted">{member.branch || 'N/A'}</span>
                </div>
              ))}
              {members.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', padding: '1rem 0' }}>No members yet.</p>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="panel">
            <div className="panel-header">
              <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.0625rem', color: 'var(--foreground)', margin: 0, letterSpacing: '-0.01em' }}>
                Upcoming Events
              </h2>
              <Link
                to="/events"
                style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--accent)', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                View All →
              </Link>
            </div>
            <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {events.filter(e => !e.is_complete).slice(0, 3).map((event, i) => (
                <div key={i} style={{
                  padding: '0.625rem 0.875rem',
                  background: 'rgba(255,255,255,0.030)', border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--foreground)', margin: 0, fontSize: '0.9375rem' }}>{event.event_title}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                    <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--muted-foreground)', margin: 0 }}>{event.club_name}</p>
                    <span className="badge-amber" style={{ fontSize: '0.7rem' }}>{event.date}</span>
                  </div>
                </div>
              ))}
              {events.filter(e => !e.is_complete).length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--muted-foreground)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', padding: '1rem 0' }}>No upcoming events.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
