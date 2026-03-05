import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import LandingPage from './pages/LandingPage.jsx'
import Events from './pages/Events.jsx'
import Members from './pages/Members.jsx'
import Details from './pages/Details.jsx'
import Login from './pages/Login.jsx'
import Layout from './components/Layout.jsx'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Routes>
            <Route path='/login' element={<Login />} />

            {/* Protected Routes wrapped in Layout */}
            <Route element={<Layout />}>
                <Route path='/' element={<Home />} />
                <Route path='/landingPage' element={<LandingPage />} />
                <Route path='/events' element={<Events />} />
                <Route path='/members' element={<Members />} />
                <Route path='/details/:event_id' element={<Details />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </BrowserRouter>
)
