import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

import Header from './components/Header'
import Home from './components/Home'
import CheckIn from './components/check/CheckIn'
import CheckInHis from './components/check/CheckInHis'
import CheckInContextProvider from './components/check/CheckInContextProvider'
import CheckInUpdate from './components/check/CheckInUpdate'
import QuickCheckIn from "./components/check/QuickCheckIn";
import HelpModal from './components/HelpModal'
import JournalList from './components/journal/JournalList'
import JournalCreate from './components/journal/JournalCreate'
import JournalView from './components/journal/JournalView'
import JournalEdit from './components/journal/JournalEdit'
import CalmingTools from './components/calming/CalmingTools'
import BreathingExercise from './components/calming/BreathingExercise'
import AmbientSounds from './components/calming/AmbientSounds'
import GroundingExercise from './components/calming/GroundingExercise'
import { AuthProvider } from './components/auth/AuthContext'
import LoginModal from './components/auth/LoginModal'
import RegisterModal from './components/auth/RegisterModal'
import PsychartistModal from './components/auth/PsychartistModal'
import Profile from './components/auth/Profile'
import PsychartistList from './components/psychartist/PsychartistList'
import PsychartistProfile from './components/psychartist/PsychartistProfile'
import Footer from './components/Footer'
import PrivatePage from './components/PrivatePage'

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <CheckInContextProvider>
            <HelpModal />
            <LoginModal />
            <RegisterModal />
            <PsychartistModal />
            <Header />
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkIn" element={<CheckIn />} />
            <Route path='/checkInHistory' element={<CheckInHis />} />
            <Route path='/checkInUpdate' element={<CheckInUpdate />} />
            <Route path="/quickcheckin" element={<QuickCheckIn />} />
            <Route path="/journal" element={<JournalList />} />
            <Route path="/journal/new" element={<JournalCreate />} />
            <Route path="/journal/:id" element={<JournalView />} />
            <Route path="/journal/edit/:id" element={<JournalEdit />} />
            <Route path="/calming" element={<CalmingTools />} />
            <Route path="/calming/breathing" element={<BreathingExercise />} />
            <Route path="/calming/ambient" element={<AmbientSounds />} />
            <Route path="/calming/grounding" element={<GroundingExercise />} />
            <Route path="/psychartists" element={<PsychartistList />} />
            <Route path="/psychartist/:id" element={<PsychartistProfile />} />
          </Routes>
          <Footer />
        </CheckInContextProvider>
      </AuthProvider>
    </BrowserRouter>
    </>
  )
}

export default App
