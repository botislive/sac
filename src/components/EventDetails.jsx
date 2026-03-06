import {
  EventToggleAtom,
  filteredEventsAtom,
  statusFilterAtom,
  EventDeleteAtom,
  EventEditAtom,
  sacMemAtom,
  eventsAtom,
  clubs,
} from "../atoms/userAtom";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { generateCircular } from "../utils/documentUtils";

function EventDetails({ eventId = null }) {
  const [filter, setFilter] = useState("all");
  const [, statusFilter] = useAtom(statusFilterAtom);
  const [filteredEvents] = useAtom(filteredEventsAtom);
  const [members] = useAtom(sacMemAtom);
  const allEvents = useAtomValue(eventsAtom);
  const clubList = useAtomValue(clubs);
  const [, eventToggle] = useAtom(EventToggleAtom);
  const [, eventDelete] = useAtom(EventDeleteAtom);
  const [, eventEdit] = useAtom(EventEditAtom);
  const [editingEventId, setEditingEventId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventSearch, setEventSearch] = useState("");
  const [hoveredCoordinator, setHoveredCoordinator] = useState(null);
  const [editForm, setEditForm] = useState({
    club_name: "",
    department: "",
    event_title: "",
    date: "",
    coordinators: [],
  });

  const isSingleEventView = eventId !== null && eventId !== undefined;
  const selectedEvent = isSingleEventView
    ? allEvents.find((event) => String(event.id) === String(eventId))
    : null;
  const eventsToRender = isSingleEventView ? (selectedEvent ? [selectedEvent] : []) : filteredEvents;
  const availableClubs = Array.from(
    new Set(
      (clubList || [])
        .map((club) => (typeof club === "string" ? club : club?.name))
        .filter(Boolean)
    )
  );

  const normalizeCoordinators = (coordinators = []) =>
    coordinators.map((coord) => (typeof coord === "string" ? coord : coord?.name)).filter(Boolean);

  const toDateInputValue = (value = "") => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const parsedDate = new Date(value);
    if (Number.isNaN(parsedDate.getTime())) return "";
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!isSingleEventView) statusFilter(filter);
  }, [statusFilter, filter, isSingleEventView]);

  const startEdit = (event) => {
    setEditingEventId(event.id);
    setSearchTerm("");
    setEditForm({
      club_name: event.club_name || "",
      department: event.department || "",
      event_title: event.event_title || "",
      date: toDateInputValue(event.date || ""),
      coordinators: normalizeCoordinators(event.coordinators),
    });
  };

  const cancelEdit = () => {
    setEditingEventId(null);
    setSearchTerm("");
    setEditForm({
      club_name: "",
      department: "",
      event_title: "",
      date: "",
      coordinators: [],
    });
  };

  const toggleCoordinator = (memberName) => {
    setEditForm((prev) => {
      const isSelected = prev.coordinators.includes(memberName);
      return {
        ...prev,
        coordinators: isSelected
          ? prev.coordinators.filter((name) => name !== memberName)
          : [...prev.coordinators, memberName],
      };
    });
  };

  const saveEdit = (targetEventId) => {
    eventEdit({
      id: targetEventId,
      club_name: editForm.club_name.trim(),
      department: editForm.department,
      event_title: editForm.event_title.trim(),
      date: editForm.date,
      coordinators: editForm.coordinators,
    });
    cancelEdit();
    toast.success("Event updated successfully");
  };

  const filteredMembers = (members || []).filter(
    (member) => member.name && member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCoordinatorTooltipLines = (coordName) => {
    const member = (members || []).find((item) => item.name === coordName);
    if (!member) return [`Name: ${coordName}`, "Details not available"];
    return [
      `Name: ${coordName}`,
      `Post: ${member.post || "N/A"}`,
      `Phone: ${member.phone || "N/A"}`,
      `Year: ${member.year || "N/A"}`,
      `Branch: ${member.branch || "N/A"}`,
    ];
  };

  const getCoordinatorDetails = (event) =>
    normalizeCoordinators(event.coordinators).map((coordName) => ({
      name: coordName,
      member: (members || []).find((item) => item.name === coordName) || null,
    }));

  const displayedEvents = isSingleEventView
    ? eventsToRender
    : eventsToRender.filter((e) => {
      const q = eventSearch.toLowerCase().trim();
      if (!q) return true;
      return (
        (e.event_title || "").toLowerCase().includes(q) ||
        (e.club_name || "").toLowerCase().includes(q) ||
        (e.department || "").toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-6">
      {isSingleEventView && (
        <div className="mb-4">
          <Link to="/events" className="text-blue-400 hover:text-blue-300 flex items-center gap-2 transition-colors">
            <span>&larr;</span> Back to Events
          </Link>
        </div>
      )}

      {!isSingleEventView && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Status filter tabs */}
          <div className="flex bg-gray-900/50 p-1 rounded-lg w-fit border border-gray-800">
            {["all", "upcoming", "completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all duration-200 ${filter === f
                  ? "bg-gray-800 text-white shadow-sm ring-1 ring-gray-700"
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                  }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative', flex: '1', minWidth: 200 }}>
            <svg
              style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
              width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search events, clubs, departments…"
              value={eventSearch}
              onChange={(e) => setEventSearch(e.target.value)}
              style={{ paddingLeft: '2.25rem', paddingRight: eventSearch ? '2.25rem' : '0.875rem' }}
              className="w-full bg-gray-900/60 border border-gray-700 rounded-lg py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
            {eventSearch && (
              <button
                onClick={() => setEventSearch("")}
                style={{ position: 'absolute', right: '0.625rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '0.125rem', lineHeight: 1 }}
                aria-label="Clear search"
              >
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#6b7280" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Live results count */}
          {eventSearch && (
            <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap' }}>
              {displayedEvents.length} result{displayedEvents.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {displayedEvents.map((event) => (
          <div
            key={event.id}
            style={{
              background: event.is_complete ? 'rgba(26, 26, 36, 0.35)' : 'var(--card)',
              border: `1px solid ${event.is_complete ? 'rgba(255,255,255,0.04)' : 'var(--border)'}`,
              borderRadius: '0.875rem',
              transition: 'all 300ms ease-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = event.is_complete ? 'rgba(255,255,255,0.08)' : 'var(--border-hover)';
              e.currentTarget.style.boxShadow = event.is_complete ? 'none' : 'var(--shadow-lg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = event.is_complete ? 'rgba(255,255,255,0.04)' : 'var(--border)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {editingEventId === event.id ? (
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label className="label-dark">Club Name</label>
                    <select
                      value={editForm.club_name}
                      onChange={(e) => {
                        const selectedClub = e.target.value;
                        const matched = (clubList || []).find(c => (typeof c === 'string' ? c : c?.name) === selectedClub);
                        setEditForm((prev) => ({
                          ...prev,
                          club_name: selectedClub,
                          department: matched?.department || prev.department,
                        }));
                      }}
                      className="select-dark"
                    >
                      <option value="" disabled>-- Select Club --</option>
                      {availableClubs.map((clubName) => (
                        <option key={clubName} value={clubName}>{clubName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label-dark">Department</label>
                    <select
                      value={editForm.department}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, department: e.target.value }))}
                      className="select-dark"
                    >
                      <option value="" disabled>-- Select Department --</option>
                      {[...new Set((clubList || []).map(c => (typeof c === 'string' ? null : c?.department)).filter(Boolean))].map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label-dark">Event Title</label>
                    <input
                      type="text"
                      value={editForm.event_title}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, event_title: e.target.value }))}
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <label className="label-dark">Date</label>
                    <input
                      type="date"
                      value={editForm.date}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, date: e.target.value }))}
                      style={{ colorScheme: 'dark' }}
                      className="input-dark"
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* ── Card Header: Title + Status ── */
              <div style={{ padding: '1.25rem 1.5rem 0 1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    color: event.is_complete ? 'var(--muted-foreground)' : 'var(--foreground)',
                    margin: 0,
                    lineHeight: 1.3,
                    textDecoration: event.is_complete ? 'line-through' : 'none',
                    textDecorationColor: 'rgba(255,255,255,0.15)',
                  }}>{event.event_title}</h3>
                  {event.is_complete && (
                    <span className="badge-success" style={{ fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      ✓ Done
                    </span>
                  )}
                </div>

                {/* ── Metadata Chips ── */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  marginTop: '0.875rem',
                }}>
                  {/* Club chip */}
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.3rem 0.75rem',
                    background: 'rgba(99, 102, 241, 0.08)',
                    border: '1px solid rgba(99, 102, 241, 0.18)',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-body)',
                    color: '#a5b4fc',
                    fontWeight: 500,
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    {event.club_name}
                  </span>

                  {/* Department chip */}
                  {event.department && (
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: '0.3rem 0.75rem',
                      background: 'rgba(168, 85, 247, 0.08)',
                      border: '1px solid rgba(168, 85, 247, 0.18)',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-body)',
                      color: '#c4b5fd',
                      fontWeight: 500,
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                      </svg>
                      {event.department}
                    </span>
                  )}

                  {/* Date chip */}
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.3rem 0.75rem',
                    background: 'var(--accent-muted)',
                    border: '1px solid rgba(245, 158, 11, 0.18)',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--accent)',
                    fontWeight: 500,
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {event.date}
                  </span>
                </div>
              </div>
            )}

            {/* ── Coordinators Section ── */}
            <div style={{
              padding: '1rem 1.5rem',
              ...(editingEventId !== event.id && !isSingleEventView ? {
                borderTop: '1px solid var(--border)',
                marginTop: '1rem',
              } : editingEventId === event.id ? {} : { marginTop: '0.5rem' }),
            }}>
              {editingEventId === event.id ? (
                <div style={{
                  background: 'rgba(10, 10, 15, 0.5)',
                  padding: '1rem',
                  borderRadius: '0.625rem',
                  border: '1px solid var(--border)',
                }}>
                  <label className="label-dark" style={{ marginBottom: '0.5rem' }}>Edit Coordinators</label>
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-dark"
                    style={{ borderRadius: '0.5rem 0.5rem 0 0', height: '38px', fontSize: '0.8125rem' }}
                  />
                  <div style={{
                    border: '1px solid var(--border)',
                    borderTop: 'none',
                    maxHeight: '8rem',
                    overflowY: 'auto',
                    padding: '0.5rem',
                    background: 'rgba(10, 10, 15, 0.6)',
                    borderRadius: '0 0 0.5rem 0.5rem',
                  }}>
                    {filteredMembers.map((member) => (
                      <label key={member.name} style={{
                        display: 'flex', alignItems: 'center', gap: '0.625rem',
                        padding: '0.375rem 0.5rem', borderRadius: '0.375rem', cursor: 'pointer',
                        transition: 'background 150ms',
                      }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <input
                          type="checkbox"
                          checked={editForm.coordinators.includes(member.name)}
                          onChange={() => toggleCoordinator(member.name)}
                        />
                        <span style={{ fontSize: '0.8125rem', color: 'var(--foreground)' }}>
                          {member.name}{' '}
                          <span style={{ fontSize: '0.6875rem', color: 'var(--muted-foreground)' }}>({member.post})</span>
                        </span>
                      </label>
                    ))}
                    {filteredMembers.length === 0 && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', padding: '0.5rem 0', textAlign: 'center' }}>No members found</p>
                    )}
                  </div>
                  <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {editForm.coordinators.map((name) => (
                      <span key={name} className="badge-amber" style={{ gap: '0.375rem' }}>
                        {name}
                        <button type="button" onClick={() => toggleCoordinator(name)}
                          style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0, fontSize: '0.875rem', lineHeight: 1 }}>
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : isSingleEventView ? (
                <div>
                  <h4 style={{
                    fontSize: '0.8125rem', fontWeight: 600, color: 'var(--muted-foreground)',
                    marginBottom: '0.75rem', paddingBottom: '0.5rem',
                    borderBottom: '1px solid var(--border)',
                    fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.05em',
                  }}>Student Coordinators</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
                    {getCoordinatorDetails(event).map(({ name, member }) => (
                      <div key={name} style={{
                        background: 'rgba(10, 10, 15, 0.5)',
                        border: '1px solid var(--border)',
                        borderRadius: '0.625rem',
                        padding: '1rem',
                        display: 'flex', flexDirection: 'column', gap: '0.25rem',
                      }}>
                        <p style={{ color: 'var(--foreground)', fontWeight: 600, fontFamily: 'var(--font-display)', margin: 0 }}>{name}</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.125rem 0.5rem', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                          <span style={{ color: 'var(--muted-foreground)' }}>Post</span>
                          <span style={{ color: '#d4d4d8', textAlign: 'right' }}>{member?.post || "N/A"}</span>
                          <span style={{ color: 'var(--muted-foreground)' }}>Branch/Year</span>
                          <span style={{ color: '#d4d4d8', textAlign: 'right' }}>{member?.branch || "-"} / {member?.year || "-"}</span>
                          <span style={{ color: 'var(--muted-foreground)' }}>Phone</span>
                          <span style={{ color: '#d4d4d8', textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{member?.phone || "N/A"}</span>
                        </div>
                      </div>
                    ))}
                    {getCoordinatorDetails(event).length === 0 && <span style={{ fontSize: '0.8125rem', color: 'var(--muted-foreground)' }}>No coordinators assigned</span>}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: '0.6875rem',
                    color: 'var(--muted-foreground)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontFamily: 'var(--font-body)',
                  }}>Coordinators</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                    {normalizeCoordinators(event.coordinators).map((name) => (
                      <div key={name} style={{ position: 'relative', display: 'inline-block' }}>
                        <span
                          onMouseEnter={() => setHoveredCoordinator(`${event.id}:${name}`)}
                          onMouseLeave={() => setHoveredCoordinator(null)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.25rem 0.625rem',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid var(--border)',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            color: '#d4d4d8',
                            cursor: 'help',
                            transition: 'all 200ms',
                            fontFamily: 'var(--font-body)',
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                            e.currentTarget.style.borderColor = 'var(--border-hover)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                            e.currentTarget.style.borderColor = 'var(--border)';
                          }}
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          {name}
                        </span>

                        {hoveredCoordinator === `${event.id}:${name}` && (
                          <div style={{
                            position: 'absolute',
                            left: '50%',
                            bottom: '100%',
                            marginBottom: '0.625rem',
                            transform: 'translateX(-50%)',
                            width: '12rem',
                            background: 'var(--card-solid)',
                            border: '1px solid var(--border-hover)',
                            padding: '0.75rem',
                            borderRadius: '0.625rem',
                            fontSize: '0.75rem',
                            boxShadow: 'var(--shadow-xl)',
                            zIndex: 30,
                          }}>
                            {getCoordinatorTooltipLines(name).map((line, i) => (
                              <div key={i} style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                ...(i === 0
                                  ? { fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.375rem', paddingBottom: '0.375rem', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-display)' }
                                  : { color: 'var(--muted-foreground)', lineHeight: 1.6 }
                                ),
                              }}>{line}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {normalizeCoordinators(event.coordinators).length === 0 && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', fontStyle: 'italic' }}>None assigned</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ── Card Footer: Action Buttons ── */}
            {!isSingleEventView && (
              <div style={{
                padding: '0.875rem 1.5rem',
                borderTop: '1px solid var(--border)',
                background: 'rgba(10, 10, 15, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                flexWrap: 'wrap',
              }}>
                {/* Left group: primary actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {/* Status toggle */}
                  <button
                    onClick={() => {
                      eventToggle(event.id);
                      toast.success(`Event marked as ${event.is_complete ? 'Incomplete' : 'Complete'}`);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: '0.4375rem 0.875rem',
                      borderRadius: '0.5rem',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      fontFamily: 'var(--font-body)',
                      cursor: 'pointer',
                      transition: 'all 200ms ease-out',
                      border: event.is_complete
                        ? '1px solid rgba(16, 185, 129, 0.25)'
                        : '1px solid var(--border-hover)',
                      background: event.is_complete
                        ? 'rgba(16, 185, 129, 0.1)'
                        : 'transparent',
                      color: event.is_complete
                        ? '#34d399'
                        : 'var(--foreground)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = event.is_complete
                        ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255,255,255,0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = event.is_complete
                        ? 'rgba(16, 185, 129, 0.1)' : 'transparent';
                    }}
                  >
                    {event.is_complete ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                      </svg>
                    )}
                    {event.is_complete ? "Completed" : "Mark Done"}
                  </button>

                  {/* Vertical divider */}
                  <div style={{ width: '1px', height: '1.5rem', background: 'var(--border)', margin: '0 0.25rem' }} />

                  {editingEventId === event.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(event.id)}
                        className="btn-primary"
                        style={{ padding: '0.4375rem 1rem', minHeight: 'unset', fontSize: '0.8125rem' }}
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="btn-ghost"
                        style={{ padding: '0.4375rem 0.875rem', fontSize: '0.8125rem' }}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(event)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          padding: '0.4375rem 0.875rem',
                          background: 'transparent',
                          border: '1px solid rgba(99, 102, 241, 0.25)',
                          borderRadius: '0.5rem',
                          color: '#a5b4fc',
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          fontFamily: 'var(--font-body)',
                          cursor: 'pointer',
                          transition: 'all 200ms',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Edit
                      </button>

                      <Link
                        to={`/details/${event.id}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          padding: '0.4375rem 0.875rem',
                          background: 'transparent',
                          border: '1px solid var(--border)',
                          borderRadius: '0.5rem',
                          color: '#d4d4d8',
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          fontFamily: 'var(--font-body)',
                          textDecoration: 'none',
                          cursor: 'pointer',
                          transition: 'all 200ms',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        Details
                      </Link>

                      <button
                        onClick={async () => {
                          try {
                            await generateCircular(event, members);
                            toast.success("Circular generated successfully");
                          } catch (error) {
                            toast.error("Failed to generate circular");
                          }
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.375rem',
                          padding: '0.4375rem 0.875rem',
                          background: 'transparent',
                          border: '1px solid var(--border)',
                          borderRadius: '0.5rem',
                          color: '#d4d4d8',
                          fontSize: '0.8125rem',
                          fontWeight: 500,
                          fontFamily: 'var(--font-body)',
                          cursor: 'pointer',
                          transition: 'all 200ms',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                        Circular
                      </button>
                    </>
                  )}
                </div>

                {/* Right group: destructive action */}
                {editingEventId !== event.id && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete "${event.event_title}"?`)) {
                        eventDelete(event.id);
                        toast.success("Event deleted successfully");
                      }
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.375rem',
                      padding: '0.4375rem 0.875rem',
                      background: 'rgba(239, 68, 68, 0.06)',
                      border: '1px solid rgba(239, 68, 68, 0.15)',
                      borderRadius: '0.5rem',
                      color: '#f87171',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      fontFamily: 'var(--font-body)',
                      cursor: 'pointer',
                      transition: 'all 200ms',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.06)'; e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.15)'; }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {displayedEvents.length === 0 && (
          <div className="text-center py-12 bg-gray-900/30 border border-gray-800 border-dashed rounded-xl">
            <p className="text-gray-400 text-lg">
              {isSingleEventView
                ? "Event not found."
                : eventSearch
                  ? `No events matching "${eventSearch}".`
                  : "No events match this filter."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetails;
