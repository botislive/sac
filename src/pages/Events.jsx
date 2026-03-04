import EventForm from "../components/EventForm"
import EventDetails from "../components/EventDetails"
import EventCalendar from "../components/EventCalendar"

function Events() {
  return (
    <div>
        <div>
            <h1>Events Page</h1>
        </div>
               <br />
        <div>
            <EventForm/>
        </div>
               <br />
        <div>
            <EventDetails/>
        </div>
               <br />
        <div>
            <EventCalendar/>
        </div>
    </div>
  )
}

export default Events