import { filteredEventsAtom,statusFilterAtom } from "../atoms/userAtom"
import { useAtom } from "jotai"
import { useEffect, useState } from "react"

function EventDetails() {
  const [filter,setFilter]=useState("all")
  const [,statusFilter]=useAtom(statusFilterAtom)
  const [filteredEvents] = useAtom(filteredEventsAtom)
  console.log(filteredEvents)
  
  useEffect(()=>{
           statusFilter(filter)
  },[filter])

  return (
    <div>
        <div>
            <h1>Event Details</h1>
        </div>

<div>
    {filteredEvents.map((event) => (
        <div key={event.event_title} style={{ border: '1px solid #ddd', padding: '10px', margin: '10px 0', borderRadius: '8px' }}>
            <p><strong>Club Name:</strong> {event.club_name}</p>
            <p><strong>Event Title:</strong> {event.event_title}</p>
<div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '5px' }}>
    {event.coordinators && event.coordinators.map((coordinator) => (
        <span 
            key={coordinator.name} 
            style={{ 
                background: "#007bff", 
                color: "white", 
                padding: "4px 12px", 
                borderRadius: "15px", 
                fontSize: "12px",
                display: "inline-block",
                lineHeight: "1" // Ensures the height matches the text
            }}
        >
            {/* CHECK THIS LINE: Ensure it is .name and not the whole object */}
            {coordinator} 
        </span>
    ))}
</div>
            <p><strong>Event Date:</strong> {event.date}</p>
        
            <span style={{ 
                color: event.is_complete ? 'green' : 'orange',
                fontSize: '0.8rem',
                fontWeight: 'bold'
            }}>
                {event.is_complete ? "✓ Completed" : "⏳ Upcoming"}
            </span>
        </div>
    ))}
</div>

        <div>
            <button onClick={()=>setFilter("all")}>All</button>
            <button onClick={()=>setFilter("upcoming")}>Upcoming</button>
            <button onClick={()=>setFilter("completed")}>Completed</button>
        </div>
    </div>
  )
}

export default EventDetails