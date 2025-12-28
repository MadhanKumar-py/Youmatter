import Button from "./Button"
import calmImage from '../assets/calming_illustration.jpeg'
import { createContext, useEffect, useState } from "react"
import { useNavigate, useLocation } from 'react-router-dom'
import QuickCheckInPreview from "./check/QuickCheckInPreview"
import { HelpBanner } from "./HelpModal"
import { useAuth } from "./auth/AuthContext"

export const moodContext = createContext()

function Home() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated } = useAuth()
  const [breathingActive, setBreathingActive] = useState(false)
  const [phase, setPhase] = useState('idle')
  const [circle, setCircle] = useState(100)
  const [duration, setDuration] = useState(0)

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

  return (
    <>
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

    </>
  )
}

export default Home
