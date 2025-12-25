import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';

function BreathingExercise() {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState('idle');
  const [circle, setCircle] = useState(100);
  const [duration, setDuration] = useState(0);
  const [cycles, setCycles] = useState(0);

  const phaseList = ['Breathe in', 'Hold', 'Breathe out'];
  const circleSize = [180, 180, 80];
  const time = [4000, 2000, 6000]; // 4s in, 2s hold, 6s out

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    if (!isActive) return;
    
    let cancelled = false;
    const start = async () => {
      while (!cancelled && isActive) {
        for (let i = 0; i < phaseList.length; i++) {
          if (cancelled) return;
          setDuration(time[i]);
          setPhase(phaseList[i]);
          setCircle(circleSize[i]);
          await sleep(time[i]);
        }
        setCycles(prev => prev + 1);
      }
    };
    
    start();
    
    return () => {
      cancelled = true;
    };
  }, [isActive]);

  const handleStart = () => {
    setIsActive(true);
    setCycles(0);
  };

  const handleStop = () => {
    setIsActive(false);
    setPhase('idle');
    setCircle(100);
  };

  return (
    <div className="min-h-screen bg-green-50/30 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-lighterGreen rounded-xl p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-darkGreen">
              Breathing Exercise
            </h1>
            <Button
              text="← Back"
              class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
              click={() => navigate('/calming')}
            />
          </div>

          <p className="text-gray-600 text-center mb-8">
            Follow the circle. Breathe in for 4 seconds, hold for 2, breathe out for 6.
          </p>

          {/* Breathing Circle */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative flex items-center justify-center h-64 w-full">
              <div
                style={{
                  height: `${circle}px`,
                  width: `${circle}px`,
                  transition: `all ${duration}ms ease-in-out`,
                }}
                className="bg-lighterGreen/30 rounded-full flex items-center justify-center"
              />
              <h2 className="absolute text-darkGreen font-semibold text-2xl">
                {phase}
              </h2>
            </div>

            {cycles > 0 && (
              <p className="text-sm text-gray-500 mt-4">
                Completed {cycles} cycle{cycles !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-3 justify-center">
            {!isActive ? (
              <Button
                text="Start"
                class="px-6 py-3 bg-darkGreen text-white rounded-lg hover:bg-neutralGray text-lg"
                click={handleStart}
              />
            ) : (
              <Button
                text="Stop"
                class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 text-lg"
                click={handleStop}
              />
            )}
          </div>

          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-700 text-center">
              💡 Tip: Find a comfortable position and focus on the circle. Let your breath flow naturally with the rhythm.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BreathingExercise;
