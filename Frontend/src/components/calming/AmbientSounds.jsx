import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../Button';

function AmbientSounds() {
  const navigate = useNavigate();
  const [playing, setPlaying] = useState(null);
  const [volume, setVolume] = useState(50);
  const audioContextRef = useRef(null);
  const sourceNodeRef = useRef(null);
  const gainNodeRef = useRef(null);

  const sounds = [
    { id: 'rain', name: 'Rain', icon: '🌧️' },
    { id: 'ocean', name: 'Ocean Waves', icon: '🌊' },
    { id: 'forest', name: 'Forest Wind', icon: '🌲' },
    { id: 'white', name: 'White Noise', icon: '🔊' },
  ];

  useEffect(() => {
    return () => {
      stopAll();
    };
  }, []);

  const initAudioContext = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = volume / 100;
    }

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
  };

  const createWhiteNoise = () => {
    const bufferSize = audioContextRef.current.sampleRate * 2;
    const buffer = audioContextRef.current.createBuffer(1, bufferSize, audioContextRef.current.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(gainNodeRef.current);
    
    return source;
  };

  const createRainSound = () => {
    const source = createWhiteNoise();
    
    // Add filter for rain-like sound
    const filter = audioContextRef.current.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1500;
    filter.Q.value = 0.5;
    
    source.disconnect();
    source.connect(filter);
    filter.connect(gainNodeRef.current);
    
    return source;
  };

  const createOceanSound = () => {
    const source = createWhiteNoise();
    
    // Add low-pass filter for ocean waves
    const filter = audioContextRef.current.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 500;
    filter.Q.value = 1;
    
    source.disconnect();
    source.connect(filter);
    filter.connect(gainNodeRef.current);
    
    return source;
  };

  const createForestSound = () => {
    const source = createWhiteNoise();
    
    // Add gentle filtering for wind-like sound
    const highpass = audioContextRef.current.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 200;
    
    const lowpass = audioContextRef.current.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 1000;
    lowpass.Q.value = 0.3;
    
    source.disconnect();
    source.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(gainNodeRef.current);
    
    return source;
  };

  const handlePlay = async (sound) => {
    if (playing === sound.id) {
      stopAll();
      return;
    }

    try {
      await initAudioContext();
      stopAll();

      let source;
      
      switch (sound.id) {
        case 'white':
          source = createWhiteNoise();
          break;
        case 'rain':
          source = createRainSound();
          break;
        case 'ocean':
          source = createOceanSound();
          break;
        case 'forest':
          source = createForestSound();
          break;
        default:
          source = createWhiteNoise();
      }

      source.start();
      sourceNodeRef.current = source;
      setPlaying(sound.id);

    } catch (error) {
      console.error('Audio play failed:', error);
      alert(`Cannot play ${sound.name}. Please try again.`);
      setPlaying(null);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume / 100;
    }
  };

  const stopAll = () => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
      } catch (e) {
        // Source might already be stopped
      }
      sourceNodeRef.current = null;
    }
    setPlaying(null);
  };

  return (
    <div className="min-h-screen bg-green-50/30 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white border border-lighterGreen rounded-xl p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-darkGreen">
              Ambient Sounds
            </h1>
            <Button
              text="← Back"
              class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
              click={() => {
                stopAll();
                navigate('/calming');
              }}
            />
          </div>

          <p className="text-gray-600 text-center mb-8">
            Choose a calming sound to help you relax and focus
          </p>

          {/* Sound Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {sounds.map((sound) => (
              <div
                key={sound.id}
                onClick={() => handlePlay(sound)}
                className={`cursor-pointer border-2 rounded-lg p-4 text-center transition-all ${
                  playing === sound.id
                    ? 'border-darkGreen bg-lighterGreen/20'
                    : 'border-gray-200 hover:border-lighterGreen'
                }`}
              >
                <div className="text-4xl mb-2">{sound.icon}</div>
                <p className="text-sm font-semibold text-darkGreen">{sound.name}</p>
                {playing === sound.id && (
                  <p className="text-xs text-green-600 mt-1">Playing...</p>
                )}
              </div>
            ))}
          </div>

          {/* Volume Control */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Volume</label>
              <span className="text-sm text-gray-600">{volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Stop Button */}
          {playing && (
            <div className="text-center">
              <Button
                text="Stop All"
                class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                click={stopAll}
              />
            </div>
          )}

          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-700 text-center">
              💡 Tip: Use headphones for the best experience. Click any sound to start/stop playback.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AmbientSounds;