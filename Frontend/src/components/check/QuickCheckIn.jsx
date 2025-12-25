import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "../Button";
import calmImage from "../../assets/calming_illustration.jpeg";
import { checkInContext } from "./CheckInContextProvider";
import { useAuth } from "../auth/AuthContext";
import { API_URL } from "../../config/api";

export default function QuickCheckin() {
  const navigate = useNavigate();
  const { setCheckInDataList } = useContext(checkInContext);
  const { isAuthenticated } = useAuth();

  // Step management
  const [currentStep, setCurrentStep] = useState(0);
  const [stepTimer, setStepTimer] = useState(0);
  
  // Form data
  const [mood, setMood] = useState("😐");
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState("");
  
  // Breathing state
  const [breathingActive, setBreathingActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [circle, setCircle] = useState(100);
  const [phaseDurationMs, setPhaseDurationMs] = useState(4000);

  const phaseList = ["Breathe in", "Hold", "Breathe out"];
  const phaseDurations = [4, 2, 6];
  const circleSizeByPhase = [150, 150, 80];

  const stepTimerRef = useRef(null);
  const breathingTimerRef = useRef(null);

  const steps = [
    { title: "How are you feeling?", duration: 15 },
    { title: "Rate the intensity (1-10)", duration: 10 },
    { title: "Quick note (optional)", duration: 15 },
    { title: "Breathing exercise", duration: 20 }
  ];

  // Step timer
  useEffect(() => {
    if (currentStep < steps.length) {
      setStepTimer(steps[currentStep].duration);
      stepTimerRef.current = setInterval(() => {
        setStepTimer(prev => {
          if (prev <= 1) {
            clearInterval(stepTimerRef.current);
            if (currentStep < steps.length - 1) {
              setCurrentStep(currentStep + 1);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(stepTimerRef.current);
  }, [currentStep]);

  // Breathing animation
  useEffect(() => {
    if (!breathingActive || currentStep !== 3) return;

    let cancelled = false;
    const startBreathing = async () => {
      while (!cancelled && breathingActive) {
        for (let i = 0; i < phaseList.length; i++) {
          if (cancelled) return;
          setPhaseIndex(i);
          setCircle(circleSizeByPhase[i]);
          setPhaseDurationMs(phaseDurations[i] * 1000);

          await new Promise(resolve => {
            breathingTimerRef.current = setTimeout(resolve, phaseDurations[i] * 1000);
          });
        }
      }
    };

    startBreathing();

    return () => {
      cancelled = true;
      clearTimeout(breathingTimerRef.current);
    };
  }, [breathingActive, currentStep]);

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      document.getElementById('login_modal').showModal();
      return;
    }
    
    try {
      const payload = {
        mood: mood,
        intensity: intensity,
        note: notes || "Quick check-in completed",
        type: "quick"
      };

      console.log("Sending payload:", payload);
      console.log("Posting to URL:", `${API_URL}/checkin/quick/`);
      const response = await axios.post(`${API_URL}/checkin/quick/`, payload);
      console.log("Response status:", response.status);
      console.log("Quick check-in saved:", response.data);
      setCheckInDataList(prevList => [response.data, ...prevList]);
      
      // Show success message and navigate
      const viewHistory = window.confirm("Quick check-in saved! Thanks for taking care of yourself.\n\nWould you like to view your check-in history?");
      if (viewHistory) {
        navigate("/checkInHistory");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error saving quick check-in:", error);
      console.error("Error details:", error.response?.data);
      alert(`Failed to save: ${error.response?.data?.detail || error.message}`);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercent = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-green-50/50">
      <div className="w-full max-w-2xl bg-white/80 rounded-xl p-6 shadow-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-md overflow-hidden">
            <img src={calmImage} alt="calm" className="object-cover w-full h-full" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-green-800">Quick Check-in • 60s</h2>
            <p className="text-sm text-gray-600">Fast mood assessment with breathing exercise</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Step {currentStep + 1}/4: {steps[currentStep].title}</span>
            <span className="text-sm font-semibold">{stepTimer}s</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div style={{ width: `${progressPercent}%` }} className="h-full bg-green-400 transition-all rounded-full"></div>
          </div>
        </div>

        {/* Step 1: Mood Selection */}
        {currentStep === 0 && (
          <div className="text-center space-y-6">
            <h3 className="text-xl font-semibold text-darkGreen">How are you feeling right now?</h3>
            <div className="flex justify-center gap-4 text-4xl">
              {["😄", "🙂", "😐", "🙁", "😟"].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => setMood(emoji)}
                  className={`p-3 rounded-full transition-all ${mood === emoji ? "scale-125" : "hover:scale-110"}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="flex justify-center gap-3">
              <Button text="Next" class="px-4 py-2 bg-lighterGreen hover:bg-darkGreen hover:text-white rounded-md" click={nextStep} />
            </div>
          </div>
        )}

        {/* Step 2: Intensity Rating */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-darkGreen text-center">How intense is this feeling?</h3>
            <div className="space-y-4">
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(parseInt(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-center">
                <span className="text-3xl font-bold text-darkGreen">{intensity}</span>
                <p className="text-sm text-gray-600">1 = Very mild, 10 = Very intense</p>
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <Button text="Back" class="px-4 py-2 border rounded-md" click={prevStep} />
              <Button text="Next" class="px-4 py-2 bg-lighterGreen hover:bg-darkGreen hover:text-white rounded-md" click={nextStep} />
            </div>
          </div>
        )}

        {/* Step 3: Notes */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-darkGreen text-center">Quick note (optional)</h3>
            <textarea
              placeholder="What's on your mind? (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 border border-primarySoftGreen rounded-lg focus:outline-darkGreen/60 h-24 resize-none"
              maxLength={200}
            />
            <div className="flex justify-center gap-3">
              <Button text="Back" class="px-4 py-2 border rounded-md" click={prevStep} />
              <Button text="Next" class="px-4 py-2 bg-lighterGreen hover:bg-darkGreen hover:text-white rounded-md" click={nextStep} />
            </div>
          </div>
        )}

        {/* Step 4: Breathing Exercise */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-darkGreen text-center">Take a moment to breathe</h3>
            <div className="flex flex-col items-center">
              <div className="relative flex items-center justify-center h-48 w-full">
                <div
                  style={{
                    height: `${circle}px`,
                    width: `${circle}px`,
                    transition: `all ${phaseDurationMs}ms ease`,
                  }}
                  className="bg-lighterGreen/30 rounded-full"
                />
                <h4 className="absolute text-darkGreen font-semibold text-lg">{phaseList[phaseIndex]}</h4>
              </div>
              
              <div className="flex gap-3 mt-4">
                <Button 
                  text={breathingActive ? "Stop" : "Start"} 
                  class="px-4 py-2 border rounded-md hover:border-green-600" 
                  click={() => setBreathingActive(!breathingActive)} 
                />
                <Button text="Back" class="px-4 py-2 border rounded-md" click={prevStep} />
                <Button 
                  text="Complete Check-in" 
                  class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700" 
                  click={handleSubmit} 
                />
              </div>
              
              <p className="text-xs text-gray-600 text-center mt-3">
                In 4s • Hold 2s • Out 6s — Follow the circle and breathe naturally
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 text-center">
        <Button text="Exit" class="px-4 py-2 rounded-md border" click={() => navigate("/")} />
      </div>
    </div>
  );
}
