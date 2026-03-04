import { useParams } from "react-router-dom"

function Details() {
  const {event_id} = useParams()
  console.log(event_id)
  
  return (
    <div>Details of event {event_id}</div>
  )
}

export default Details