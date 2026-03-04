import { useParams } from "react-router-dom";
import EventDetails from "../components/EventDetails";

function Details() {
  const { event_id } = useParams();
  return <EventDetails eventId={event_id} />;
}

export default Details;
