import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';

function GroundingExercise() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(30);
  const [userInputs, setUserInputs] = useState(['', '', '', '', '']);

  const steps = [
    { number: 5, sense: 'things you can SEE', icon: '👁️', color: 'text-blue-600' },
    { number: 4, sense: 'things you can TOUCH', icon: '✋', color: 'text-green-600' },
    { number: 3, sense: 'things you can HEAR', icon: '👂', color: 'text-purple-600' },
    { number: 2, sense: 'things you can SMELL', icon: '👃', color: 'text-pink-600' },
    { number: 1, sense: 'thing you can TASTE', icon: '👅', color: 'text-orange-600' },
  ];

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  const handleStart = () => {
    setIsActive(true);
    setCurrentStep(0);
    setTimer(30);
    setUserInputs(['', '', '', '', '']);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setTimer(30);
    } else {
      setIsActive(false);
      alert('Great job! You completed the grounding exercise. 🌟');
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleInputChange = (value) => {
    const newInputs = [...userInputs];
    newInputs[currentStep] = value;
    setUserInputs(newInputs);
  };

  return (
    <div className="min-h-screen bg-green-50/30 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-lighterGreen rounded-xl p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-darkGreen">
              5-4-3-2-1 Grounding
            </h1>
            <Button
              text="← Back"
              class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
              click={() => navigate('/calming')}
            />
          </div>

          {!isActive ? (
            <div className="text-center py-10">
              <p className="text-gray-600 mb-6">
                This exercise helps you stay present by focusing on your senses.
                Take your time with each step.
              </p>
              <div className="mb-8 space-y-2">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-center justify-center gap-2">
                    <span className="text-2xl">{step.icon}</span>
                    <span className={`font-semibold ${step.color}`}>{step.number}</span>
                    <span className="text-gray-700">{step.sense}</span>
                  </div>
                ))}
              </div>
              <Button
                text="Start Exercise"
                class="px-6 py-3 bg-darkGreen text-white rounded-lg hover:bg-neutralGray text-lg"
                click={handleStart}
              />
            </div>
          ) : (
            <div>
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    Step {currentStep + 1} of {steps.length}
                  </span>
                  <span className="text-sm font-semibold text-darkGreen">
                    {timer}s
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                    className="h-full bg-darkGreen rounded-full transition-all"
                  />
                </div>
              </div>

              {/* Current Step */}
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">{steps[currentStep].icon}</div>
                <h2 className={`text-3xl font-bold mb-2 ${steps[currentStep].color}`}>
                  {steps[currentStep].number}
                </h2>
                <p className="text-xl text-gray-700 mb-6">
                  Name {steps[currentStep].sense}
                </p>

                <textarea
                  value={userInputs[currentStep]}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder="Type what you notice... (optional)"
                  className="w-full h-32 border border-lighterGreen rounded-lg p-4 focus:outline-darkGreen/60 resize-none"
                />
              </div>

              {/* Controls */}
              <div className="flex gap-3 justify-center">
                <Button
                  text="Skip"
                  class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                  click={handleSkip}
                />
                <Button
                  text={currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                  class="px-6 py-2 bg-darkGreen text-white rounded-lg hover:bg-neutralGray"
                  click={handleNext}
                />
              </div>
            </div>
          )}

          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-700 text-center">
              💡 Tip: Take your time. There's no rush. Focus on what you can perceive right now.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroundingExercise;
