import { useState } from "react";
import { setEventsAtom, sacMemAtom } from "../atoms/userAtom";
import { useAtom } from "jotai";

function EventForm() {
    const [members] = useAtom(sacMemAtom); 
    const [, setEvents] = useAtom(setEventsAtom);
    
    const [club_name, setClub_name] = useState("");
    const [event_title, setEvent_title] = useState("");
    const [event_date, setEvent_date] = useState("");
    
    
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCoordinators, setSelectedCoordinators] = useState([]);

    const clubs = [
        { name: "Radhakrishnan Literary club", faculty: "Mrs.Hima Bindu Madam", manager: "Yellapu Tushar" },
        { name: "Lata Mangeshkar Dance Club", faculty: "Mrs.Sravanthi", manager: "Likitha" }
    ];

    
    const filteredMembers = (members || []).filter(member => 
        member.name && member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    
    const toggleCoordinator = (member) => {
        const isAlreadySelected = selectedCoordinators.some(s => s.name === member.name);
        
        if (isAlreadySelected) {
            setSelectedCoordinators(selectedCoordinators.filter(s => s.name !== member.name));
        } else {
            setSelectedCoordinators([...selectedCoordinators, member]);
        }
    };

    const handlesubmit = (e) => {
        e.preventDefault();
        
        const eventData = { 
            club_name, 
            event_title, 
            event_date, 
            coordinators: selectedCoordinators 
        };
        
        console.log("Submitting Event:", eventData);
        setEvents(eventData);

       
        setClub_name("");
        setEvent_title("");
        setEvent_date("");
        setSelectedCoordinators([]);
        setSearchTerm("");
    };

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h1>Create New Event</h1>
            <form onSubmit={handlesubmit}>
               
                <label><strong>Select Club:</strong></label><br />
                <select value={club_name} onChange={(e) => setClub_name(e.target.value)} required>
                    <option value="" disabled>-- Choose a Club --</option>
                    {clubs.map((club) => (
                        <option key={club.name} value={club.name}>{club.name}</option>
                    ))}
                </select>
                <br /><br />

               
                <label htmlFor="event_title"><strong>Event Title:</strong></label><br />
                <input 
                    id="event_title"
                    value={event_title} 
                    onChange={(e) => setEvent_title(e.target.value)}
                    placeholder='Enter the event name' 
                    type="text" 
                    required 
                />
                <br /><br />

              
                <label><strong>Event Date:</strong></label><br />
                <input 
                    value={event_date} 
                    onChange={(e) => setEvent_date(e.target.value)}
                    type="date" 
                    required 
                />
                <br /><br />

           
                <label><strong>Add Student Coordinators:</strong></label><br />
                <input 
                    type="text" 
                    placeholder="Search by name..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ marginBottom: "10px", width: "100%", padding: "5px" }}
                />

                <div style={{ border: "1px solid #ccc", maxHeight: "150px", overflowY: "auto", padding: "10px", borderRadius: "5px", background: "#f9f9f9" }}>
                    {filteredMembers.map((member) => (
                        <div key={member.name} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                            <input 
                                type="checkbox" 
                                id={`coord-${member.name}`} 
                                checked={selectedCoordinators.some(s => s.name === member.name)}
                                onChange={() => toggleCoordinator(member)}
                            />
                            
                            <label htmlFor={`coord-${member.name}`} style={{ cursor: "pointer" }}>
                                {member.name} <span style={{ fontSize: "11px", color: "#666" }}>({member.post})</span>
                            </label>
                        </div>
                    ))}
                    {filteredMembers.length === 0 && <p style={{ fontSize: "12px", color: "gray" }}>No members found</p>}
                </div>


                <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "5px" }}>
                    {selectedCoordinators.map(member => (
                        <span key={member.name} style={{ background: "#007bff", color: "white", padding: "3px 10px", borderRadius: "15px", fontSize: "12px" }}>
                            {member.name}
                        </span>
                    ))}
                </div>
                <br />

                <button type='submit' style={{ padding: "10px 20px", background: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                    Submit Event
                </button>
            </form>
        </div>
    );
}

export default EventForm;