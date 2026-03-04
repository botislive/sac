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
  const [hoveredCoordinator, setHoveredCoordinator] = useState(null);
  const [editForm, setEditForm] = useState({
    club_name: "",
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
      event_title: editForm.event_title.trim(),
      date: editForm.date,
      coordinators: editForm.coordinators,
    });
    cancelEdit();
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

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>{isSingleEventView ? "Event Detail Page" : "Event Details"}</h1>

      {isSingleEventView && (
        <div style={{ marginBottom: "16px" }}>
          <Link to="/events" style={{ color: "#007bff", textDecoration: "none" }}>
            ← Back to Events
          </Link>
        </div>
      )}

      {!isSingleEventView && (
        <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
          <button onClick={() => setFilter("all")} style={{ fontWeight: filter === "all" ? "bold" : "normal" }}>
            All
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            style={{ fontWeight: filter === "upcoming" ? "bold" : "normal" }}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter("completed")}
            style={{ fontWeight: filter === "completed" ? "bold" : "normal" }}
          >
            Completed
          </button>
        </div>
      )}

      <div>
        {eventsToRender.map((event) => (
          <div
            key={event.id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              margin: "15px 0",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            {editingEventId === event.id ? (
              <>
                <p>
                  <strong>Club Name:</strong>{" "}
                  <select
                    value={editForm.club_name}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, club_name: e.target.value }))}
                    style={{ marginLeft: "8px", padding: "4px 8px" }}
                  >
                    <option value="" disabled>
                      -- Select Club --
                    </option>
                    {availableClubs.map((clubName) => (
                      <option key={clubName} value={clubName}>
                        {clubName}
                      </option>
                    ))}
                  </select>
                </p>
                <p>
                  <strong>Event Title:</strong>{" "}
                  <input
                    type="text"
                    value={editForm.event_title}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, event_title: e.target.value }))}
                    style={{ marginLeft: "8px", padding: "4px 8px" }}
                  />
                </p>
                <p>
                  <strong>Event Date:</strong>{" "}
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, date: e.target.value }))}
                    style={{ marginLeft: "8px", padding: "4px 8px" }}
                  />
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>Club Name:</strong> {event.club_name}
                </p>
                <p>
                  <strong>Event Title:</strong> {event.event_title}
                </p>
                <p>
                  <strong>Event Date:</strong> {event.date}
                </p>
                <p>
                  <strong>Status:</strong> {event.is_complete ? "Done" : "Pending"}
                </p>
              </>
            )}

            <div style={{ margin: "10px 0" }}>
              <strong>Coordinators:</strong>
              {editingEventId === event.id ? (
                <div style={{ marginTop: "5px" }}>
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginBottom: "10px", width: "100%", padding: "6px 8px" }}
                  />
                  <div
                    style={{
                      border: "1px solid #ccc",
                      maxHeight: "140px",
                      overflowY: "auto",
                      padding: "10px",
                      borderRadius: "5px",
                      background: "#f9f9f9",
                    }}
                  >
                    {filteredMembers.map((member) => (
                      <div
                        key={member.name}
                        style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}
                      >
                        <input
                          type="checkbox"
                          id={`edit-coord-${event.id}-${member.name}`}
                          checked={editForm.coordinators.includes(member.name)}
                          onChange={() => toggleCoordinator(member.name)}
                        />
                        <label htmlFor={`edit-coord-${event.id}-${member.name}`} style={{ cursor: "pointer" }}>
                          {member.name} <span style={{ fontSize: "11px", color: "#666" }}>({member.post})</span>
                        </label>
                      </div>
                    ))}
                    {filteredMembers.length === 0 && (
                      <p style={{ fontSize: "12px", color: "gray" }}>No members found</p>
                    )}
                  </div>
                  <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    {editForm.coordinators.map((name) => (
                      <span
                        key={name}
                        style={{
                          background: "#007bff",
                          color: "white",
                          padding: "2px 10px",
                          borderRadius: "12px",
                          fontSize: "12px",
                        }}
                      >
                        {name}
                      </span>
                    ))}
                    {editForm.coordinators.length === 0 && <span style={{ color: "#888" }}>None</span>}
                  </div>
                </div>
              ) : isSingleEventView ? (
                <div style={{ marginTop: "8px", display: "grid", gap: "8px" }}>
                  {getCoordinatorDetails(event).map(({ name, member }) => (
                    <div
                      key={name}
                      style={{ border: "1px solid #e5e7eb", borderRadius: "6px", padding: "10px", background: "#fafafa" }}
                    >
                      <p>
                        <strong>Name:</strong> {name}
                      </p>
                      <p>
                        <strong>Post:</strong> {member?.post || "N/A"}
                      </p>
                      <p>
                        <strong>Phone:</strong> {member?.phone || "N/A"}
                      </p>
                      <p>
                        <strong>Year:</strong> {member?.year || "N/A"}
                      </p>
                      <p>
                        <strong>Branch:</strong> {member?.branch || "N/A"}
                      </p>
                    </div>
                  ))}
                  {getCoordinatorDetails(event).length === 0 && <span style={{ color: "#888" }}>None</span>}
                </div>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "5px" }}>
                  {normalizeCoordinators(event.coordinators).map((name) => (
                    <div key={name} style={{ position: "relative", display: "inline-block" }}>
                      <span
                        onMouseEnter={() => setHoveredCoordinator(`${event.id}:${name}`)}
                        onMouseLeave={() => setHoveredCoordinator(null)}
                        onFocus={() => setHoveredCoordinator(`${event.id}:${name}`)}
                        onBlur={() => setHoveredCoordinator(null)}
                        tabIndex={0}
                        style={{
                          background: "#007bff",
                          color: "white",
                          padding: "2px 10px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          cursor: "help",
                          outline: "none",
                        }}
                      >
                        {name}
                      </span>

                      {hoveredCoordinator === `${event.id}:${name}` && (
                        <div
                          style={{
                            position: "absolute",
                            left: "50%",
                            top: "-8px",
                            transform: "translate(-50%, -100%)",
                            minWidth: "190px",
                            background: "#111827",
                            color: "#fff",
                            padding: "8px 10px",
                            borderRadius: "6px",
                            fontSize: "12px",
                            lineHeight: 1.4,
                            boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
                            zIndex: 20,
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {getCoordinatorTooltipLines(name).map((line) => (
                            <div key={line}>{line}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {normalizeCoordinators(event.coordinators).length === 0 && (
                    <span style={{ color: "#888" }}>None</span>
                  )}
                </div>
              )}
            </div>

            {!isSingleEventView && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginTop: "15px",
                  borderTop: "1px solid #eee",
                  paddingTop: "10px",
                }}
              >
                <button
                  onClick={() => eventToggle(event.id)}
                  style={{
                    backgroundColor: event.is_complete ? "#28a745" : "#6c757d",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  {event.is_complete ? "✓ Completed" : "Mark Complete"}
                </button>

                {editingEventId === event.id ? (
                  <>
                    <button
                      onClick={() => saveEdit(event.id)}
                      style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      style={{
                        backgroundColor: "transparent",
                        color: "#6c757d",
                        border: "1px solid #6c757d",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "14px",
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => startEdit(event)}
                    style={{
                      backgroundColor: "transparent",
                      color: "#007bff",
                      border: "1px solid #007bff",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Edit
                  </button>
                )}

                <Link
                  to={`/details/${event.id}`}
                  style={{
                    backgroundColor: "transparent",
                    color: "#111827",
                    border: "1px solid #111827",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    textDecoration: "none",
                  }}
                >
                  View Details
                </Link>

                <button
                  onClick={() => {
                    if (window.confirm(`Delete "${event.event_title}"?`)) {
                      eventDelete(event.id);
                    }
                  }}
                  style={{
                    backgroundColor: "transparent",
                    color: "#dc3545",
                    border: "1px solid #dc3545",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                  }}
                >
                  Delete
                </button>

                <span
                  style={{
                    marginLeft: "auto",
                    color: event.is_complete ? "green" : "orange",
                    fontWeight: "bold",
                    fontSize: "14px",
                  }}
                >
                  {event.is_complete ? "Done" : "Pending"}
                </span>
              </div>
            )}
          </div>
        ))}

        {eventsToRender.length === 0 && (
          <p style={{ textAlign: "center", color: "#666" }}>
            {isSingleEventView ? "Event not found." : "No events to show."}
          </p>
        )}
      </div>
    </div>
  );
}

export default EventDetails;
