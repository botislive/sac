import { useAtomValue } from "jotai"
import { eventsAtom, sacMemAtom } from "../atoms/userAtom"
import { useState } from "react"
import { generateCircular } from "../utils/documentUtils"
import { toast } from "sonner"

function Resources() {
    const events = useAtomValue(eventsAtom)
    const members = useAtomValue(sacMemAtom)
    const [selectedEventId, setSelectedEventId] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)

    const handleGenerate = async () => {
        if (!selectedEventId) {
            toast.error("Please select an event first")
            return
        }

        const event = events.find(e => e.id === selectedEventId)
        if (!event) return

        setIsGenerating(true)
        try {
            await generateCircular(event, members)
            toast.success("Circular generated successfully!")
        } catch (error) {
            console.error(error)
            toast.error("Failed to generate circular. Ensure template is in public folder.")
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h1 style={{
                    fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2rem',
                    color: 'var(--foreground)', letterSpacing: '-0.025em', margin: 0,
                }}>
                    Resource <span style={{ color: 'var(--accent)' }}>Hub</span>
                </h1>
                <p style={{ fontFamily: 'var(--font-body)', color: 'var(--muted-foreground)', marginTop: '0.375rem', fontSize: '0.9375rem' }}>
                    Access templates and automate document generation.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="resources-grid">
                {/* Auto-fill Panel */}
                <div className="panel">
                    <div className="panel-header">
                        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.0625rem', color: 'var(--foreground)', margin: 0 }}>
                            Circular Generator
                        </h2>
                    </div>
                    <div className="panel-body">
                        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                            Select an event to automatically generate a formatted Word document (.docx) based on the official SAC template.
                        </p>

                        <div style={{ marginBottom: '1.25rem' }}>
                            <label className="label-dark">Select Event</label>
                            <select
                                className="select-dark"
                                value={selectedEventId}
                                onChange={(e) => setSelectedEventId(e.target.value)}
                            >
                                <option value="">Choose an event...</option>
                                {events.map(event => (
                                    <option key={event.id} value={event.id}>
                                        {event.event_title} ({event.date})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            className="btn-primary"
                            style={{ width: '100%' }}
                            onClick={handleGenerate}
                            disabled={isGenerating || !selectedEventId}
                        >
                            {isGenerating ? "Processing..." : "Generate Circular (.docx)"}
                        </button>
                    </div>
                </div>

                {/* Templates & Automation Panel */}
                <div className="panel">
                    <div className="panel-header">
                        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.0625rem', color: 'var(--foreground)', margin: 0 }}>
                            Automated Templates
                        </h2>
                    </div>
                    <div className="panel-body">
                        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
                            Dynamic documents pre-filled with the selected event's information.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                            {[
                                {
                                    name: "Permission Letter",
                                    type: "PDF",
                                    desc: "Formal request to principal",
                                    action: async () => {
                                        const event = events.find(e => e.id === selectedEventId);
                                        if (!event) return toast.error("Select an event first");
                                        await (await import('../utils/documentUtils')).generatePermissionLetter(event, members);
                                        toast.success("Permission letter generated!");
                                    }
                                },
                                {
                                    name: "Budget Proposal",
                                    type: "PDF",
                                    desc: "Estimated event expenses",
                                    action: async () => {
                                        const event = events.find(e => e.id === selectedEventId);
                                        if (!event) return toast.error("Select an event first");
                                        await (await import('../utils/documentUtils')).generateBudgetReport(event);
                                        toast.success("Budget report generated!");
                                    }
                                },
                                {
                                    name: "Event Circular",
                                    type: "DOCX",
                                    desc: "Official announcement format",
                                    action: handleGenerate
                                },
                            ].map((item, i) => (
                                <div key={i} style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '0.75rem 1rem',
                                    background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                                    borderRadius: '0.625rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '6px',
                                            background: 'var(--accent-muted)', color: 'var(--accent)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.7rem', fontWeight: 700
                                        }}>
                                            {item.type}
                                        </div>
                                        <div>
                                            <p style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 500, color: 'var(--foreground)' }}>{item.name}</p>
                                            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>{item.desc}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={item.action}
                                        className="btn-ghost"
                                        style={{ padding: '0.375rem', height: 'auto', minHeight: 'unset' }}
                                        title={`Generate ${item.name}`}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                            <line x1="12" y1="11" x2="12" y2="17"></line>
                                            <polyline points="9 14 12 17 15 14"></polyline>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .resources-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    )
}

export default Resources
