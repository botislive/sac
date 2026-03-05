import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter,Routes,Route} from 'react-router-dom'
import Home from './pages/Home.jsx'
import LandingPage from './pages/LandingPage.jsx'
import Events from './pages/Events.jsx'
import Members from './pages/Members.jsx'
import Details from './pages/Details.jsx'
import Login from './pages/Login.jsx'

createRoot(document.getElementById('root')).render(
    <>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home/>}/>
                <Route path='/landingPage' element={<LandingPage/>}/>
                <Route path='/events' element={<Events/>}/>
                <Route path='/members' element={<Members/>}/>
                <Route path='/details/:event_id' element={<Details/>}/>
                <Route path='/login' element={<Login/>}/>
            </Routes>
        </BrowserRouter>
    </>
)
