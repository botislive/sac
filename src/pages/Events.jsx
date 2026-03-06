import EventForm from "../components/EventForm"
import EventDetails from "../components/EventDetails"
import EventCalendar from "../components/EventCalendar"

function Events() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Page header */}
            <div>
                <h1 style={{
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2rem',
                    color: 'var(--foreground)', letterSpacing: '-0.025em', margin: 0,
                }}>
                    Events <span style={{ color: 'var(--accent)' }}>Log</span>
                </h1>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', marginTop: '0.375rem', fontSize: '0.9375rem' }}>
                    Manage, view, and schedule all SAC events.
                </p>
            </div>

            {/* Top row: form + entries */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', alignItems: 'start' }}
                className="events-top-grid">

                {/* Add Event panel */}
                <div className="panel">
                    <div className="panel-header">
                        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.0625rem', color: 'var(--foreground)', margin: 0 }}>
                            Add New Event
                        </h2>
                    </div>
                    <div className="panel-body">
                        <EventForm />
                    </div>
                </div>

                {/* Event Entries panel */}
                <div className="panel" style={{ minHeight: 480 }}>
                    <div className="panel-header">
                        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.0625rem', color: 'var(--foreground)', margin: 0 }}>
                            Event Entries
                        </h2>
                    </div>
                    <div className="panel-body">
                        <EventDetails />
                    </div>
                </div>
            </div>

            {/* Calendar panel — full width */}
            <div className="panel">
                <div className="panel-header">
                    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.0625rem', color: 'var(--foreground)', margin: 0 }}>
                        Calendar View
                    </h2>
                    <span className="badge-muted" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                        All Events
                    </span>
                </div>
                <div className="panel-body" style={{ overflowX: 'auto' }}>
                    <EventCalendar />
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .events-top-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    )
}

export default Events