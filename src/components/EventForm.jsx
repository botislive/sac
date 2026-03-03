import React from 'react'

function EventForm() {
    const clubs=[{
           name:"Radhakrishnan Literary vlub",
           faculty:"Mrs.Hima Bindu Madam",
           manager:"Yellapu Tushar",
           coordinatiors: ["name1","name2"],
    },{
        name: "Lata Mangeshkar Dance Club",
        faculty: "Mrs.Sravanthi",
        manager: "Likitha",
        coordinatiors: ["name1","name2"],
    }]

  return (
    <div>
        <div>
            <h1>This is the event form component !</h1>
        </div>
        <div>
            <form>
                <select name="club_name" id="club_name">
                    {clubs.map((club)=>(
                    <option value={club.name}>{club.name}</option>
                    ))}
                </select><br />
                <label htmlFor="event_title">Event title</label>
                 <input placeholder='Enter the event name' type="text" id='event_title'/><br/>

                 <input type="date"/><br />

                 <button type='submit'>Submit</button>
            </form>
            
        </div>
    </div>
  )
}

export default EventForm