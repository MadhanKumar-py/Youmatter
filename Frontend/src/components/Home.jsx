import Button from "./Button"
import calmImage from '../assets/calming_illustration.jpeg'
import { createContext, useEffect, useState } from "react"
import { useNavigate, useLocation } from 'react-router-dom'
import QuickCheckInPreview from "./check/QuickCheckInPreview"
import { HelpBanner } from "./HelpModal"
import { useAuth } from "./auth/AuthContext"

// Custom styles for the magical button
const buttonStyles = `
  @keyframes magical-float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    25% { transform: translateY(-5px) rotate(1deg); }
    50% { transform: translateY(-3px) rotate(-1deg); }
    75% { transform: translateY(-7px) rotate(0.5deg); }
  }
  
  @keyframes sparkle-dance {
    0%, 100% { transform: scale(0) rotate(0deg); opacity: 0; }
    25% { transform: scale(1) rotate(90deg); opacity: 1; }
    50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
    75% { transform: scale(0.8) rotate(270deg); opacity: 1; }
  }
  
  @keyframes rainbow-shift {
    0% { filter: hue-rotate(0deg); }
    25% { filter: hue-rotate(90deg); }
    50% { filter: hue-rotate(180deg); }
    75% { filter: hue-rotate(270deg); }
    100% { filter: hue-rotate(360deg); }
  }
  
  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.5), 0 0 40px rgba(147, 51, 234, 0.3), 0 0 60px rgba(59, 130, 246, 0.2); }
    50% { box-shadow: 0 0 30px rgba(236, 72, 153, 0.8), 0 0 60px rgba(147, 51, 234, 0.6), 0 0 90px rgba(59, 130, 246, 0.4); }
  }
  
  .magical-button {
    animation: magical-float 4s ease-in-out infinite;
  }
  
  .magical-button:hover {
    animation: magical-float 1s ease-in-out infinite, rainbow-shift 2s linear infinite, glow-pulse 1.5s ease-in-out infinite;
  }
  
  .sparkle-element {
    animation: sparkle-dance 2s ease-in-out infinite;
  }
`


export const moodContext = createContext()

function Home() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const [breathingActive, setBreathingActive] = useState(false)
  const [phase, setPhase] = useState('idle')
  const [circle, setCircle] = useState(100)
  const [duration, setDuration] = useState(0)
  const [showPasscodeModal, setShowPasscodeModal] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [passcodeError, setPasscodeError] = useState('')

  const phaseList = ['Breathe in', 'hold', 'Breathe out'];
  const circleSize = [150, 150, 80]
  const time = [4000, 2000, 6000]

  // Scroll to section if hash is present
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash)
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 100)
      }
    }
  }, [location])

  const sleep = (ms) => new Promise((reslove) => setTimeout(reslove, ms))
  useEffect(() => {
    if (!breathingActive) return;
    let cancelled = false;
    const start = async () => {
      while (!cancelled) {
        for (let i = 0; i < phaseList.length; i++) {
          setDuration(time[i])
          // console.log(time[i],duration)
          setPhase(phaseList[i])
          setCircle(circleSize[i])
          await sleep(time[i])
          if (cancelled) return;
        }
      }
    }
    start()
    return () => {
      cancelled = true;
    };
  }, [breathingActive])

  // Check-In

  const [selectMood, setSelectMood] = useState(null)
  const [showWarning, setShowWarning] = useState(false)
  const mood = [["😀 Joyful", "#DFFFE2", "Hold onto what's working"],
  ["🙂 Calm", "#E8FFE9", "A balanced moment — appreciate it"],
  ["😐 Neutral", "#F3FFF2", "Neutral is okay — nothing to fix."],
  ["🙁 Low", "#FFF1E6", "You're allowed to feel this way"],
  ["😟 Stressed", "#FFE6E6", "You're allowed to feel this way"]]
  // console.log(selectMood)

  // -----------------CALMING TOOLS---------------------------

  // Passcode handling functions
  const handleClickMeButton = () => {
    setShowPasscodeModal(true)
    setPasscode('')
    setPasscodeError('')
  }

  const handlePasscodeSubmit = (e) => {
    e.preventDefault()
    if (passcode === '626') {
      setShowPasscodeModal(false)
      setPasscode('')
      setPasscodeError('')
      navigate('/friend')
    } else {
      setPasscodeError('Passcode is wrong')
      setPasscode('')
    }
  }

  const handlePasscodeClose = () => {
    setShowPasscodeModal(false)
    setPasscode('')
    setPasscodeError('')
  }

  const handlePasscodeChange = (e) => {
    const value = e.target.value.replace(/\D/g, '') // Only allow numbers
    if (value.length <= 3) { // Limit to 3 digits
      setPasscode(value)
      setPasscodeError('') // Clear error when user starts typing
    }
  }

  return (
    <>
      {/* Inject custom styles */}
      <style dangerouslySetInnerHTML={{ __html: buttonStyles }} />
      
      <HelpBanner />
      {/* Added responsive classes for grid layout and margin/padding adjustments */}
      <div className="grid grid-cols-1 md:grid-cols-2 mb-20 mt-8 md:mt-12 gap-8 px-4 md:px-0">
        <div className="p-5 pt-10 md:pt-20">
          <div className="my-5 flex flex-col mx-auto md:mx-10 max-w-lg">
            {/* Adjusted font size for responsiveness */}
            <h1 className="text-3xl sm:text-4xl md:text-[40px] font-semibold text-green-800 ">You're not alone right<br />now.</h1>
            <p className="my-4 text-sm sm:text-base">Small steps can make a big difference. Start with a 60-second check-in.</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <Button text="Need Urgent Support" class="btn btn-error rounded-lg bg-emergencyButton border-none hover:bg-[#C54949] text-white" click={() => document.getElementById('my_modal_5').showModal()} />
              {isAuthenticated ? (
                <Button
                  text="Quick Check-in — 60s"
                  class='btn border-primarySoftGreen rounded-lg text-darkGreen hover:bg-lighterGreen hover:border-darkGreen'
                  click={() => navigate('/quickcheckin')}
                />
              ) : (
                <Button
                  text="Login for Quick Check-in"
                  class='btn border-primarySoftGreen rounded-lg text-darkGreen hover:bg-lighterGreen hover:border-darkGreen'
                  click={() => document.getElementById('login_modal').showModal()}
                />
              )}
            </div>
          </div>
        </div>
        <div className="">
          <div className="flex flex-col gap-2 items-center mx-4 md:mx-15 [box-shadow:inset_0_6px_10px_rgba(0,0,0,0.06)] bg-green-100/20 rounded-lg p-4">
            <div className="w-40 h-40 mt-4 rounded-md overflow-hidden">
              <img src={calmImage} alt="" />
            </div>
            <div className="relative flex w-full items-center justify-center h-40">
              <div style={{ height: `${circle}px`, width: `${circle}px`, transition: `all ${duration}ms` }} className="bg-lighterGreen/20 rounded-full"></div>
              <h2 className="absolute text-darkGreen font-semibold p-5 rounded-full text-sm">{phase}</h2>

            </div>
            <div className="flex gap-3">
              <Button text="Start" class="text-sm font-semibold  hover:text-darkGreen border border-transparent rounded-md hover:border hover:border-green-600 px-2 py-1" click={() => setBreathingActive(true)} />
              <Button text="Stop" class=" text-sm font-semibold  hover:text-red-500 border border-transparent rounded-md hover:border hover:border-red-600 px-2 py-1" click={() => {
                setBreathingActive(false)
                setPhase('idle')
                setCircle(100)
              }} />
            </div>
            <p className="text-[13px] text-gray-600 w-full md:w-8/12 overflow-auto text-center mt-1 pb-4">Follow the circle. In 4s • Hold 2s • Out 6s — repeat untill you feel calmer.</p>

          </div>
        </div>
      </div>
      <QuickCheckInPreview />

      {/* ---------------------CHECKIN--------------------------- */}
      <div id='checkInSection' className="my-10 md:my-20 px-4">
        {/* Check-in Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-darkGreen mb-3">
            Daily Check-In
          </h2>
          <p className="text-gray-600 text-base max-w-2xl mx-auto leading-relaxed">
            Take a moment to pause and reflect on your current emotional state. 
            Regular check-ins help you stay connected with your feelings and track your well-being journey.
          </p>
        </div>

        {/* Adjusted width for responsiveness */}
        <div className="flex flex-col items-center gap-7 shadow-md border border-lighterGreen/40 rounded-xl bg-green-50/60 w-full md:w-10/12 lg:w-6/12 mx-auto py-10">
          {/* Adjusted font size for responsiveness */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-green-800/70 font-semibold text-center px-2">How are you feeling today?</h1>
          <div className="flex flex-wrap justify-center my-2 gap-4">
            {mood.map(([emojis, color, quotes], index) => (
              <Button style={{ transform: emojis === selectMood?.emojis ? 'scale(1.3)' : 'scale(1)' }} key={index} text={emojis.split(' ')[0]} class={`text-[32px] sm:text-[40px] transition-all duration-300 ${emojis !== selectMood?.emojis ? "hover:scale-110" : ""}`} click={() => setSelectMood({ 'emojis': emojis, 'color': color, 'quotes': quotes })} />
            ))}
          </div>
          <div className="text-center"> {/* Added text-center here for the warning message alignment */}
            {isAuthenticated ? (
              <Button
                text="Let's check in"
                class="border px-3 py-2 bg-offWhite hover:bg-primarySoftGreen hover:text-white border-lighterGreen rounded-lg font-bold tracking-wide text-darkGreen"
                click={() => {
                  if (selectMood) {
                    navigate("/checkIn", { state: { selectMood } });
                  } else {
                    setShowWarning(true)
                  }
                }}
              />
            ) : (
              <Button
                text="Login to Check In"
                class="border px-3 py-2 bg-offWhite hover:bg-primarySoftGreen hover:text-white border-lighterGreen rounded-lg font-bold tracking-wide text-darkGreen"
                click={() => document.getElementById('login_modal').showModal()}
              />
            )}
            {showWarning && isAuthenticated && <p className="text-sm text-red-500/60 font-semibold tracking-wide mt-2">Choose Your Mood </p>}
          </div>
          <p className="text-[13px] text-gray-600 w-full md:w-8/12 overflow-auto text-center -mt-2 px-2">
            {isAuthenticated
              ? "This just helps us guide your check-in."
              : "Please login to start tracking your mood and well-being."
            }
          </p>
        </div>
      </div>

      {/* ------------------------CALMING TOOLS-------------------------- */}
      <div className="my-10 md:my-20 px-4 bg-linear-to-br from-blue-50/30 to-green-50/30 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-darkGreen mb-4">
              Find Your Calm
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              When life feels overwhelming, remember that peace is always within reach. Take a moment to breathe, 
              ground yourself, and reconnect with your inner calm through these gentle techniques.
            </p>
            <p className="text-gray-500 text-base max-w-2xl mx-auto mt-3">
              Small moments of mindfulness can create lasting change in how you feel and respond to stress.
            </p>
          </div>



          {/* Quick Calming Tips */}
          <div className="mt-12 bg-white/60 backdrop-blur-sm border border-lighterGreen/50 rounded-xl p-8">
            <h3 className="text-2xl font-semibold text-darkGreen mb-6 text-center">
              Quick Calming Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">💨</span>
                </div>
                <h4 className="font-semibold text-darkGreen mb-2">Deep Breathing</h4>
                <p className="text-sm text-gray-600">Take 5 deep breaths, inhaling for 4 counts, holding for 4, exhaling for 6</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">🚶</span>
                </div>
                <h4 className="font-semibold text-darkGreen mb-2">Take a Walk</h4>
                <p className="text-sm text-gray-600">A short 5-minute walk can help clear your mind and reduce stress</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">💧</span>
                </div>
                <h4 className="font-semibold text-darkGreen mb-2">Stay Hydrated</h4>
                <p className="text-sm text-gray-600">Drink a glass of water mindfully, focusing on the sensation</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">📱</span>
                </div>
                <h4 className="font-semibold text-darkGreen mb-2">Digital Detox</h4>
                <p className="text-sm text-gray-600">Take a 10-minute break from screens and social media</p>
              </div>
            </div>
          </div>

          {/* Explore All Tools Button */}
          <div className="text-center mt-8">
            <p className="text-gray-600 text-lg my-10 max-w-2xl mx-auto">
              Discover tools and techniques to help you relax, reduce stress, and find inner peace
            </p>
            <Button
              text="Explore All Calming Tools"
              class="px-8 py-3 bg-linear-to-r from-darkGreen to-green-600 text-white rounded-lg hover:from-green-600 hover:to-darkGreen transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              click={() => navigate('/calming')}
            />
          </div>
        </div>
      </div>

      {/* --------------------Psychartist---------------------------- */}
      <div className="my-10 md:my-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-darkGreen mb-4">
              Connect with Mental Health Professionals
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Sometimes we need more than self-care tools. Our network of verified mental health professionals 
              is here to provide personalized support when you're ready to take the next step in your wellness journey.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left side - Information */}
            <div className="space-y-6">
              <div className="bg-white border border-lighterGreen rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🧠</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-darkGreen mb-2">Verified Professionals</h3>
                    <p className="text-gray-600 text-sm">
                      All our psychartists are licensed mental health professionals with verified credentials and years of experience.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-lighterGreen rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-darkGreen mb-2">Personalized Support</h3>
                    <p className="text-gray-600 text-sm">
                      Find specialists in anxiety, depression, trauma, relationships, and more. Each professional offers their unique approach to healing.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-lighterGreen rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-darkGreen mb-2">Safe & Confidential</h3>
                    <p className="text-gray-600 text-sm">
                      Your privacy and comfort are our priority. All interactions follow professional ethical guidelines and confidentiality standards.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Call to Action */}
            <div className="bg-linear-to-br from-purple-50 to-blue-50 border border-purple-200/50 rounded-xl p-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">👥</span>
                </div>
                <h3 className="text-2xl font-semibold text-darkGreen mb-4">
                  Ready to Connect?
                </h3>
                <p className="text-gray-600 mb-6">
                  Browse our directory of qualified mental health professionals and find someone who feels right for your journey.
                </p>
                
                {isAuthenticated ? (
                  <Button
                    text="Browse Psychartists"
                    class="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    click={() => navigate('/psychartists')}
                  />
                ) : (
                  <div className="space-y-3">
                    <Button
                      text="Login to Browse Psychartists"
                      class="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      click={() => document.getElementById('login_modal').showModal()}
                    />
                    <p className="text-sm text-gray-500">
                      Sign in to access our directory of mental health professionals
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Professional Network CTA */}
          <div className="mt-12 bg-linear-to-r from-green-50 to-teal-50 border border-green-200/50 rounded-xl p-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-darkGreen mb-3">
                Are you a mental health professional?
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Join our network of compassionate professionals helping people on their wellness journey. 
                Make a meaningful impact while growing your practice.
              </p>
              {isAuthenticated ? (
                <Button
                  text="Join Our Network"
                  class="px-6 py-2 border border-darkGreen text-darkGreen rounded-lg hover:bg-lighterGreen font-semibold"
                  click={() => document.getElementById('psychartist_modal').showModal()}
                />
              ) : (
                <Button
                  text="Login to Join Our Network"
                  class="px-6 py-2 border border-darkGreen text-darkGreen rounded-lg hover:bg-lighterGreen font-semibold"
                  click={() => document.getElementById('login_modal').showModal()}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Special Friend Button - Super Attractive with Amazing Effects */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50" style={{ pointerEvents: 'none' }}>
        <div className="relative group magical-button" style={{ pointerEvents: 'auto' }}>
          {/* Multi-layered animated background glow */}
          <div className="absolute -inset-2 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-full blur-md opacity-60 group-hover:opacity-90 animate-pulse group-hover:animate-ping transition duration-1000 group-hover:duration-300 pointer-events-none"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-full blur-sm opacity-40 group-hover:opacity-70 animate-pulse transition duration-800 pointer-events-none" style={{animationDelay: '0.5s'}}></div>
          
          {/* Floating sparkles with custom animation */}
          <div className="absolute -top-3 -left-3 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full sparkle-element opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 pointer-events-none"></div>
          <div className="absolute -top-2 -right-4 w-3 h-3 bg-gradient-to-r from-pink-400 to-red-400 rounded-full sparkle-element opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200 pointer-events-none" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute -bottom-3 -left-4 w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full sparkle-element opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300 pointer-events-none" style={{animationDelay: '1s'}}></div>
          <div className="absolute -bottom-2 -right-3 w-4 h-4 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full sparkle-element opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150 pointer-events-none" style={{animationDelay: '0.3s'}}></div>
          <div className="absolute top-0 left-0 w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full sparkle-element opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-400 pointer-events-none" style={{animationDelay: '1.5s'}}></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full sparkle-element opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-250 pointer-events-none" style={{animationDelay: '0.8s'}}></div>
          
          {/* Main button with enhanced effects */}
          <button
            onClick={handleClickMeButton}
            type="button"
            className="relative px-6 py-3 sm:px-10 sm:py-5 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white rounded-full shadow-2xl transform transition-all duration-500 ease-out
                     hover:scale-105 hover:rotate-2 hover:shadow-3xl
                     active:scale-100 active:rotate-1
                     group-hover:from-pink-400 group-hover:via-purple-400 group-hover:to-indigo-400
                     font-bold text-lg sm:text-xl tracking-wider
                     border-2 sm:border-4 border-white/40 hover:border-white/80
                     backdrop-blur-sm
                     hover:animate-none
                     overflow-hidden
                     cursor-pointer
                     z-10"
            style={{ pointerEvents: 'auto' }}
          >
            {/* Animated inner glow layers */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-yellow-200/20 to-white/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-45 from-transparent via-white/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)'}}></div>
            
            {/* Button text with enhanced gradient and effects */}
            <span className="relative z-20 bg-gradient-to-r from-white via-yellow-100 to-white bg-clip-text text-transparent font-black drop-shadow-2xl text-shadow-lg pointer-events-none">
              ✨ Click Me ✨
            </span>
            
            {/* Multiple ripple effects */}
            <div className="absolute inset-0 rounded-full bg-white/10 scale-0 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out pointer-events-none"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-300/20 to-purple-300/20 scale-0 group-hover:scale-125 opacity-0 group-hover:opacity-100 transition-all duration-900 ease-out delay-100 pointer-events-none"></div>
          </button>
          
          {/* Enhanced orbiting elements */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2">
              <div className="absolute -top-2 left-1/2 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-spin origin-bottom shadow-lg" style={{animationDuration: '2s'}}></div>
              <div className="absolute top-1/2 -right-2 w-2 h-2 bg-gradient-to-r from-pink-400 to-red-400 rounded-full animate-spin origin-left shadow-lg" style={{animationDuration: '3s', animationDirection: 'reverse'}}></div>
              <div className="absolute -bottom-2 left-1/2 w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-spin origin-top shadow-lg" style={{animationDuration: '2.5s'}}></div>
              <div className="absolute top-1/2 -left-2 w-2 h-2 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full animate-spin origin-right shadow-lg" style={{animationDuration: '3.5s', animationDirection: 'reverse'}}></div>
            </div>
          </div>
          
          {/* Enhanced tooltip with animation */}
          <div className="absolute bottom-full right-0 mb-4 px-4 py-2 bg-gradient-to-r from-black/90 to-gray-800/90 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-500 whitespace-nowrap backdrop-blur-md shadow-2xl border border-white/20 transform group-hover:scale-105 pointer-events-none">
            <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent font-semibold">
              Something awaits... 🎁✨
            </span>
            <div className="absolute top-full right-6 w-0 h-0 border-l-4 border-r-4 border-t-6 border-transparent border-t-black/90"></div>
          </div>
          
          {/* Ambient light effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-blue-400/20 blur-xl scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse pointer-events-none"></div>
        </div>
      </div>

      {/* Passcode Modal */}
      {showPasscodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-2xl">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-darkGreen mb-2">
                🔒 Enter Passcode
              </h3>
              <p className="text-gray-600 text-sm">
                Please enter the passcode to view this page
              </p>
            </div>
            
            <form onSubmit={handlePasscodeSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={passcode}
                  onChange={handlePasscodeChange}
                  placeholder="Enter 3-digit passcode"
                  className="w-full px-4 py-3 text-center text-2xl font-mono border-2 border-gray-300 rounded-lg focus:outline-none focus:border-pink-500 transition-colors"
                  maxLength="3"
                  autoFocus
                />
              </div>
              
              {passcodeError && (
                <div className="text-red-500 text-sm text-center font-semibold">
                  {passcodeError}
                </div>
              )}
              
              <div className="flex gap-3 pt-2">
                <Button 
                  text="Submit" 
                  class="flex-1 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-semibold transition-colors"
                  type="submit"
                />
                <Button 
                  text="Cancel" 
                  class="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
                  click={handlePasscodeClose}
                  type="button"
                />
              </div>
            </form>
          </div>
        </div>
      )}

    </>
  )
}

export default Home;
