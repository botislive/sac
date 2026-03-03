import {EventToggleAtom, filteredEventsAtom,statusFilterAtom,EventDeleteAtom, EventEditAtom, sacMemAtom } from "../atoms/userAtom"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"


function EventDetails() {
  const [filter,setFilter]=useState("all")
  const [,statusFilter]=useAtom(statusFilterAtom)
  const [filteredEvents] = useAtom(filteredEventsAtom)
  const [members] = useAtom(sacMemAtom)
  const [,eventToggle] = useAtom(EventToggleAtom)
  const [,eventDelete] = useAtom(EventDeleteAtom)
  const [,eventEdit] = useAtom(EventEditAtom)
  const [editingEventId, setEditingEventId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [editForm, setEditForm] = useState({
    club_name: "",
    event_title: "",
    date: "",
    coordinators: [],
  })

  const normalizeCoordinators = (coordinators = []) => coordinators
    .map((coord) => (typeof coord === "string" ? coord : coord?.name))
    .filter(Boolean)

  const toDateInputValue = (value = "") => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value
    const parsedDate = new Date(value)
    if (Number.isNaN(parsedDate.getTime())) return ""
    const year = parsedDate.getFullYear()
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0")
    const day = String(parsedDate.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  console.log(filteredEvents)
  
  useEffect(()=>{
           statusFilter(filter)
  },[filter])



  const startEdit = (event) => {
    setEditingEventId(event.id)
    setSearchTerm("")
    setEditForm({
      club_name: event.club_name || "",
      event_title: event.event_title || "",
      date: toDateInputValue(event.date || ""),
      coordinators: normalizeCoordinators(event.coordinators),
    })
  }

  const cancelEdit = () => {
    setEditingEventId(null)
    setSearchTerm("")
    setEditForm({
      club_name: "",
      event_title: "",
      date: "",
      coordinators: [],
    })
  }

  const toggleCoordinator = (memberName) => {
    setEditForm((prev) => {
      const isSelected = prev.coordinators.includes(memberName)
      return {
        ...prev,
        coordinators: isSelected
          ? prev.coordinators.filter((name) => name !== memberName)
          : [...prev.coordinators, memberName],
      }
    })
  }

  const saveEdit = (eventId) => {
    eventEdit({
      id: eventId,
      club_name: editForm.club_name.trim(),
      event_title: editForm.event_title.trim(),
      date: editForm.date,
      coordinators: editForm.coordinators,
    })
    cancelEdit()
  }

  const filteredMembers = (members || []).filter((member) =>
    member.name && member.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Event Details</h1>

    
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={() => setFilter("all")} style={{ fontWeight: filter === "all" ? "bold" : "normal" }}>All</button>
        <button onClick={() => setFilter("upcoming")} style={{ fontWeight: filter === "upcoming" ? "bold" : "normal" }}>Upcoming</button>
        <button onClick={() => setFilter("completed")} style={{ fontWeight: filter === "completed" ? "bold" : "normal" }}>Completed</button>
      </div>

      <div>
        {filteredEvents.map((event) => (
          <div key={event.id} style={{ border: '1px solid #ddd', padding: '15px', margin: '15px 0', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            {editingEventId === event.id ? (
              <>
                <p>
                  <strong>Club Name:</strong>{" "}
                  <input
                    type="text"
                    value={editForm.club_name}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, club_name: e.target.value }))}
                    style={{ marginLeft: "8px", padding: "4px 8px" }}
                  />
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
                <p><strong>Club Name:</strong> {event.club_name}</p>
                <p><strong>Event Title:</strong> {event.event_title}</p>
                <p><strong>Event Date:</strong> {event.date}</p>
              </>
            )}

            
            <div style={{ margin: '10px 0' }}>
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
                    <div style={{ border: "1px solid #ccc", maxHeight: "140px", overflowY: "auto", padding: "10px", borderRadius: "5px", background: "#f9f9f9" }}>
                      {filteredMembers.map((member) => (
                        <div key={member.name} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
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
                      {filteredMembers.length === 0 && <p style={{ fontSize: "12px", color: "gray" }}>No members found</p>}
                    </div>
                    <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "5px" }}>
                      {editForm.coordinators.map((name) => (
                        <span key={name} style={{ background: "#007bff", color: "white", padding: "2px 10px", borderRadius: "12px", fontSize: "12px" }}>
                          {name}
                        </span>
                      ))}
                      {editForm.coordinators.length === 0 && <span style={{ color: '#888' }}>None</span>}
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px' }}>
                      {normalizeCoordinators(event.coordinators).map((name) => (
                          <span key={name} style={{ background: "#007bff", color: "white", padding: "2px 10px", borderRadius: "12px", fontSize: "12px" }}>
                              {name}
                          </span>
                      ))}
                      {normalizeCoordinators(event.coordinators).length === 0 && <span style={{ color: '#888' }}>None</span>}
                  </div>
                )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
              
              <button 
                onClick={() => eventToggle(event.id)}
                style={{
                  backgroundColor: event.is_complete ? '#28a745' : '#6c757d',
                  color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px'
                }}
              >
                {event.is_complete ? "✓ Completed" : "Mark Complete"}
              </button>

              {editingEventId === event.id ? (
                <>
                  <button
                    onClick={() => saveEdit(event.id)}
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#6c757d',
                      border: '1px solid #6c757d',
                      padding: '6px 12px',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => startEdit(event)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#007bff',
                    border: '1px solid #007bff',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Edit
                </button>
              )}

          
              <button 
                onClick={() => {
                  if(window.confirm(`Delete "${event.event_title}"?`)) {
                    eventDelete(event.id);
                  }
                }}
                style={{
                  backgroundColor: 'transparent',
                  color: '#dc3545',
                  border: '1px solid #dc3545',
                  padding: '6px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Delete
              </button>

              
              <span style={{ marginLeft: 'auto', color: event.is_complete ? 'green' : 'orange', fontWeight: 'bold', fontSize: '14px' }}>
                {event.is_complete ? "Done" : "Pending"}
              </span>
            </div>
          </div>
        ))}
        {filteredEvents.length === 0 && <p style={{ textAlign: 'center', color: '#666' }}>No events to show.</p>}
      </div>
    </div>
  )
}

export default EventDetails
