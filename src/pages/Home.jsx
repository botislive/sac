import { Link } from "react-router-dom"

function Home() {
  return (
            <>
                <div><Link to="/landingPage">Home</Link></div>
                <div><Link to="/events" >Events</Link></div>
                <div><Link to="/members">Members</Link></div>
            </>
  )
}

export default Home