import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from 'react-confetti';
import { API_URL } from '../../config/api';

function Friend() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPartyPopper, setShowPartyPopper] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [audioContext, setAudioContext] = useState(null);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize audio context on first user interaction (required for mobile)
  const initializeAudio = () => {
    if (!audioInitialized) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        setAudioContext(ctx);
        setAudioInitialized(true);
        
        // Resume audio context if it's suspended (common on mobile)
        if (ctx.state === 'suspended') {
          ctx.resume();
        }
      } catch (error) {
        console.log('Audio initialization failed:', error);
      }
    }
  };

  // Function to play paper turning sound
  const playPaperTurnSound = () => {
    if (!audioContext || !audioInitialized) return;
    
    try {
      // Resume context if suspended
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      const masterGain = audioContext.createGain();
      masterGain.connect(audioContext.destination);
      masterGain.gain.setValueAtTime(0.4, audioContext.currentTime);
      
      // Create calendar page flip sound - sharp and crisp
      const createPageFlip = () => {
        // Sharp initial snap sound
        const snapBufferSize = audioContext.sampleRate * 0.08;
        const snapBuffer = audioContext.createBuffer(1, snapBufferSize, audioContext.sampleRate);
        const snapOutput = snapBuffer.getChannelData(0);
        
        // Generate sharp attack with quick decay
        for (let i = 0; i < snapBufferSize; i++) {
          const envelope = Math.exp(-i / (snapBufferSize * 0.15)); // Quick decay
          const noise = (Math.random() * 2 - 1) * envelope;
          // Add sharp transient at the beginning
          const sharpAttack = i < snapBufferSize * 0.1 ? Math.sin(i * 0.5) * 2 : 0;
          snapOutput[i] = (noise + sharpAttack) * envelope;
        }
        
        const snapSource = audioContext.createBufferSource();
        const snapFilter = audioContext.createBiquadFilter();
        const snapGain = audioContext.createGain();
        
        snapSource.buffer = snapBuffer;
        
        // High-pass filter for crisp sound
        snapFilter.type = 'highpass';
        snapFilter.frequency.setValueAtTime(1200, audioContext.currentTime);
        snapFilter.Q.setValueAtTime(2, audioContext.currentTime);
        
        snapSource.connect(snapFilter);
        snapFilter.connect(snapGain);
        snapGain.connect(masterGain);
        
        // Sharp envelope - quick attack and decay
        snapGain.gain.setValueAtTime(0, audioContext.currentTime);
        snapGain.gain.linearRampToValueAtTime(0.8, audioContext.currentTime + 0.01);
        snapGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);
        
        snapSource.start(audioContext.currentTime);
        snapSource.stop(audioContext.currentTime + 0.08);
      };
      
      // Add air displacement sound (whoosh)
      const createAirWhoosh = () => {
        const whooshOsc = audioContext.createOscillator();
        const whooshFilter = audioContext.createBiquadFilter();
        const whooshGain = audioContext.createGain();
        
        whooshOsc.type = 'sawtooth';
        whooshOsc.frequency.setValueAtTime(200, audioContext.currentTime);
        whooshOsc.frequency.exponentialRampToValueAtTime(80, audioContext.currentTime + 0.15);
        
        whooshFilter.type = 'lowpass';
        whooshFilter.frequency.setValueAtTime(600, audioContext.currentTime);
        whooshFilter.Q.setValueAtTime(0.8, audioContext.currentTime);
        
        whooshOsc.connect(whooshFilter);
        whooshFilter.connect(whooshGain);
        whooshGain.connect(masterGain);
        
        whooshGain.gain.setValueAtTime(0, audioContext.currentTime);
        whooshGain.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.03);
        whooshGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
        
        whooshOsc.start(audioContext.currentTime + 0.01);
        whooshOsc.stop(audioContext.currentTime + 0.15);
      };
      
      // Add subtle paper flutter at the end
      const createPaperFlutter = () => {
        const flutterBufferSize = audioContext.sampleRate * 0.12;
        const flutterBuffer = audioContext.createBuffer(1, flutterBufferSize, audioContext.sampleRate);
        const flutterOutput = flutterBuffer.getChannelData(0);
        
        // Generate subtle flutter texture
        for (let i = 0; i < flutterBufferSize; i++) {
          const envelope = Math.exp(-i / (flutterBufferSize * 0.4));
          const flutter = Math.sin(i * 0.02) * (Math.random() * 0.5 + 0.5);
          flutterOutput[i] = flutter * envelope * 0.3;
        }
        
        const flutterSource = audioContext.createBufferSource();
        const flutterFilter = audioContext.createBiquadFilter();
        const flutterGain = audioContext.createGain();
        
        flutterSource.buffer = flutterBuffer;
        
        // Band-pass filter for paper-like frequency
        flutterFilter.type = 'bandpass';
        flutterFilter.frequency.setValueAtTime(1800, audioContext.currentTime + 0.05);
        flutterFilter.Q.setValueAtTime(1.5, audioContext.currentTime + 0.05);
        
        flutterSource.connect(flutterFilter);
        flutterFilter.connect(flutterGain);
        flutterGain.connect(masterGain);
        
        flutterGain.gain.setValueAtTime(0, audioContext.currentTime + 0.05);
        flutterGain.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.08);
        flutterGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.17);
        
        flutterSource.start(audioContext.currentTime + 0.05);
        flutterSource.stop(audioContext.currentTime + 0.17);
      };
      
      // Add a subtle click at the very end (page settling)
      const createSettleClick = () => {
        const clickOsc = audioContext.createOscillator();
        const clickGain = audioContext.createGain();
        
        clickOsc.type = 'square';
        clickOsc.frequency.setValueAtTime(800, audioContext.currentTime + 0.15);
        
        clickOsc.connect(clickGain);
        clickGain.connect(masterGain);
        
        clickGain.gain.setValueAtTime(0, audioContext.currentTime + 0.15);
        clickGain.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.151);
        clickGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.17);
        
        clickOsc.start(audioContext.currentTime + 0.15);
        clickOsc.stop(audioContext.currentTime + 0.17);
      };
      
      // Execute all sound layers
      createPageFlip();      // Sharp initial snap
      createAirWhoosh();     // Air displacement
      createPaperFlutter();  // Subtle paper texture
      createSettleClick();   // Final settling sound
      
    } catch (error) {
      console.log('Paper turn sound failed:', error);
    }
  };

  const steps = [
    {
      title: "Hi Kurinji 👋",
      message: "Hi! How are you doing? I wanted to talk to you about something.",
      emoji: "😊",
      color: "#2980b9",
      cardType: "greeting"
    },
    {
      title: "I Messed Up",
      message: "Look, I know I screwed up. What I did was wrong and I hurt you. That's on me.",
      emoji: "😐",
      color: "#ff6b6b",
      cardType: "torn"
    },
    {
      title: "I'm Really Sorry",
      message: "I can't force you to forgive me. What do you think?",
      emoji: "🙁",
      color: "#96ceb4",
      cardType: "clean"
    },
    {
      title: "I'm Sorry",
      message: "I understand you're still hurt. I don't expect instant forgiveness. I just want you to know that I genuinely regret what happened and i'm Really Sorry,sorry sorry,....",
      emoji: "😔",
      color: "#8e44ad",
      cardType: "sorry"
    },
    {
      title: "Hurray! 🎉",
      message: "Thanks for understanding. I appreciate it.",
      emoji: "🥳",
      color: "#f39c12",
      cardType: "celebration"
    },
    {
      title: "Share Your Thoughts 💭",
      message: " ",
      emoji: "💬",
      color: "#9b59b6",
      cardType: "handshake"
    }
  ];

  // Function to play celebration sound
  const playHappySound = () => {
    if (!audioContext || !audioInitialized) return;
    
    try {
      // Resume context if suspended (important for mobile)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      
      // Create multiple sound layers for rich celebration
      const createCelebrationSound = () => {
        const masterGain = audioContext.createGain();
        masterGain.connect(audioContext.destination);
        masterGain.gain.setValueAtTime(0.8, audioContext.currentTime);
        
        // Layer 1: Main Melody - Triumphant fanfare
        const mainMelody = [
          { freq: 523.25, dur: 0.15, vol: 0.4 }, // C5
          { freq: 659.25, dur: 0.15, vol: 0.4 }, // E5
          { freq:783.99, dur: 0.15, vol: 0.4 }, // G5
          { freq: 1046.50, dur: 0.25, vol: 0.5 }, // C6
          { freq: 1318.51, dur: 0.2, vol: 0.5 }, // E6
          { freq: 1567.98, dur: 0.3, vol: 0.6 }, // G6
          { freq: 2093.00, dur: 0.4, vol: 0.7 }, // C7
        ];
        
        // Layer 2: Harmony - Supporting chords
        const harmony = [
          { freq: 261.63, dur: 0.6, vol: 0.2, delay: 0 }, // C4
          { freq: 329.63, dur: 0.6, vol: 0.2, delay: 0 }, // E4
          { freq: 392.00, dur: 0.6, vol: 0.2, delay: 0 }, // G4
          { freq: 523.25, dur: 0.8, vol: 0.25, delay: 0.4 }, // C5
          { freq: 659.25, dur: 0.8, vol: 0.25, delay: 0.4 }, // E5
          { freq: 783.99, dur: 0.8, vol: 0.25, delay: 0.4 }, // G5
        ];
        
        // Layer 3: Bass line for depth
        const bassLine = [
          { freq: 130.81, dur: 0.3, vol: 0.3, delay: 0 }, // C3
          { freq: 164.81, dur: 0.3, vol: 0.3, delay: 0.3 }, // E3
          { freq: 196.00, dur: 0.3, vol: 0.3, delay: 0.6 }, // G3
          { freq: 261.63, dur: 0.5, vol: 0.35, delay: 0.9 }, // C4
        ];
        
        let currentTime = audioContext.currentTime;
        
        // Play main melody with vibrato and dynamic envelope
        mainMelody.forEach((note, index) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          const vibrato = audioContext.createOscillator();
          const vibratoGain = audioContext.createGain();
          
          // Setup vibrato (frequency modulation)
          vibrato.frequency.setValueAtTime(6, currentTime); // 6Hz vibrato
          vibratoGain.gain.setValueAtTime(8, currentTime); // Vibrato depth
          vibrato.connect(vibratoGain);
          vibratoGain.connect(osc.frequency);
          
          osc.connect(gain);
          gain.connect(masterGain);
          
          osc.type = index < 4 ? 'sawtooth' : 'triangle'; // Change timbre for higher notes
          osc.frequency.setValueAtTime(note.freq, currentTime);
          
          // Dynamic envelope with attack, sustain, release
          gain.gain.setValueAtTime(0, currentTime);
          gain.gain.linearRampToValueAtTime(note.vol, currentTime + 0.03);
          gain.gain.setValueAtTime(note.vol * 0.8, currentTime + note.dur * 0.7);
          gain.gain.exponentialRampToValueAtTime(0.001, currentTime + note.dur);
          
          vibrato.start(currentTime);
          osc.start(currentTime);
          osc.stop(currentTime + note.dur);
          vibrato.stop(currentTime + note.dur);
          
          currentTime += note.dur * 0.85;
        });
        
        // Play harmony chords
        harmony.forEach((chord) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          
          osc.connect(gain);
          gain.connect(masterGain);
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(chord.freq, audioContext.currentTime + chord.delay);
          
          gain.gain.setValueAtTime(0, audioContext.currentTime + chord.delay);
          gain.gain.linearRampToValueAtTime(chord.vol, audioContext.currentTime + chord.delay + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + chord.delay + chord.dur);
          
          osc.start(audioContext.currentTime + chord.delay);
          osc.stop(audioContext.currentTime + chord.delay + chord.dur);
        });
        
        // Play bass line
        bassLine.forEach((bass) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          
          osc.connect(gain);
          gain.connect(masterGain);
          
          osc.type = 'square';
          osc.frequency.setValueAtTime(bass.freq, audioContext.currentTime + bass.delay);
          
          gain.gain.setValueAtTime(0, audioContext.currentTime + bass.delay);
          gain.gain.linearRampToValueAtTime(bass.vol, audioContext.currentTime + bass.delay + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + bass.delay + bass.dur);
          
          osc.start(audioContext.currentTime + bass.delay);
          osc.stop(audioContext.currentTime + bass.delay + bass.dur);
        });
        
        // Layer 4: Sparkle effects with random timing
        setTimeout(() => {
          for (let i = 0; i < 12; i++) {
            const sparkleFreqs = [2093, 2349, 2637, 2960, 3322, 3729]; // High octave notes
            const freq = sparkleFreqs[Math.floor(Math.random() * sparkleFreqs.length)];
            const delay = Math.random() * 0.8;
            
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(masterGain);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, audioContext.currentTime + delay);
            
            gain.gain.setValueAtTime(0, audioContext.currentTime + delay);
            gain.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + delay + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + delay + 0.2);
            
            osc.start(audioContext.currentTime + delay);
            osc.stop(audioContext.currentTime + delay + 0.2);
          }
        }, 300);
        
        // Layer 5: Drum-like percussion using noise
        const createPercussion = (delay, duration, volume) => {
          const bufferSize = audioContext.sampleRate * duration;
          const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
          const output = buffer.getChannelData(0);
          
          // Generate noise and shape it
          for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
          }
          
          const noise = audioContext.createBufferSource();
          const filter = audioContext.createBiquadFilter();
          const gain = audioContext.createGain();
          
          noise.buffer = buffer;
          filter.type = 'highpass';
          filter.frequency.setValueAtTime(200, audioContext.currentTime + delay);
          
          noise.connect(filter);
          filter.connect(gain);
          gain.connect(masterGain);
          
          gain.gain.setValueAtTime(volume, audioContext.currentTime + delay);
          gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + delay + duration);
          
          noise.start(audioContext.currentTime + delay);
        };
        
        // Add percussion hits
        createPercussion(0, 0.1, 0.3);
        createPercussion(0.4, 0.1, 0.25);
        createPercussion(0.8, 0.15, 0.35);
        createPercussion(1.2, 0.2, 0.4);
        
        // Layer 6: Sweep effect for dramatic finish
        setTimeout(() => {
          const sweep = audioContext.createOscillator();
          const sweepGain = audioContext.createGain();
          
          sweep.connect(sweepGain);
          sweepGain.connect(masterGain);
          
          sweep.type = 'sawtooth';
          sweep.frequency.setValueAtTime(100, audioContext.currentTime);
          sweep.frequency.exponentialRampToValueAtTime(2000, audioContext.currentTime + 0.5);
          
          sweepGain.gain.setValueAtTime(0, audioContext.currentTime);
          sweepGain.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1);
          sweepGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
          
          sweep.start(audioContext.currentTime);
          sweep.stop(audioContext.currentTime + 0.5);
        }, 1000);
      };
      
      createCelebrationSound();
      
    } catch (error) {
      console.log('Audio not supported or blocked:', error);
      // Enhanced fallback with multiple beeps
      try {
        const playBeep = (freq, duration, delay) => {
          const audio = new Audio(`data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT`);
          setTimeout(() => audio.play().catch(() => {}), delay);
        };
        
        playBeep(523, 200, 0);
        playBeep(659, 200, 150);
        playBeep(783, 200, 300);
        playBeep(1046, 300, 450);
      } catch (fallbackError) {
        // Silent fallback
      }
    }
  };

  const handleForgive = async () => {
    initializeAudio(); // Initialize audio on user interaction
    setShowPartyPopper(true);
    setShowConfetti(true);
    
    // Send forgiveness count to backend
    try {
      await fetch(`${API_URL}/special/increment-forgiveness/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error saving forgiveness count:', error);
    }
    
    // Play celebration sound
    playHappySound();
    
    // Show party popper first, then transition to celebration card
    setTimeout(() => {
      setCurrentStep(4); // Move to celebration card (now index 4)
    }, 1000);
    
    setTimeout(() => {
      setShowPartyPopper(false);
    }, 3000);
    
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const handleNo = () => {
    initializeAudio(); // Initialize audio on user interaction
    playPaperTurnSound(); // Play paper turn sound
    setCurrentStep(3); // Move to sorry card
  };

  const handleComments = () => {
    initializeAudio(); // Initialize audio on user interaction
    setShowComments(true);
  };

  const handleSubmitComment = async () => {
    if (comment.trim()) {
      try {
        const response = await fetch(`${API_URL}/special/add-comment/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            comment: comment.trim(),
            timestamp: new Date().toISOString()
          })
        });
        
        const data = await response.json();
        
        // Removed alert messages - just silently save
        if (!data.success) {
          console.error('Failed to save comment:', data.error);
        }
      } catch (error) {
        console.error('Error saving comment:', error);
      }
      
      setComment("");
      setShowComments(false);
      playPaperTurnSound(); // Play paper turn sound when going back to start
      setCurrentStep(0); // Go back to start
    }
  };

  const handleCloseComments = () => {
    setShowComments(false);
  };

  const handleContinue = () => {
    initializeAudio(); // Initialize audio on user interaction
    playPaperTurnSound(); // Play paper turn sound
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(0); // Loop back to start
    }
  };

  const nextStep = () => {
    initializeAudio(); // Initialize audio on user interaction
    playPaperTurnSound(); // Play paper turn sound
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    initializeAudio(); // Initialize audio on user interaction
    playPaperTurnSound(); // Play paper turn sound
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div style={styles.container}>
      {/* Comments Popup */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            style={styles.commentsOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.div
              style={styles.commentsModal}
              initial={{ 
                scale: 0.7, 
                y: 100, 
                opacity: 0,
                rotateX: -15 
              }}
              animate={{ 
                scale: 1, 
                y: 0, 
                opacity: 1,
                rotateX: 0 
              }}
              exit={{ 
                scale: 0.8, 
                y: 50, 
                opacity: 0,
                rotateX: 10 
              }}
              transition={{ 
                type: "spring", 
                stiffness: 400, 
                damping: 30,
                duration: 0.4
              }}
            >
              <motion.div 
                style={styles.commentsHeader}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <h3 style={styles.commentsTitle}>💬 Leave a Comment</h3>
                <motion.button 
                  style={styles.closeButton}
                  onClick={handleCloseComments}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  ✕
                </motion.button>
              </motion.div>
              
              <motion.div 
                style={styles.commentsBody}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <p style={styles.commentsLabel}>
                  How do you feel about this apology? Any thoughts?
                </p>
                <motion.textarea
                  style={styles.commentInput}
                  placeholder="Type your comment here..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.2 }}
                  whileFocus={{ 
                    scale: 1.02,
                    boxShadow: "0 0 20px rgba(155, 89, 182, 0.3)"
                  }}
                />
              </motion.div>
              
              <motion.div 
                style={styles.commentsFooter}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25, duration: 0.3 }}
              >
                <motion.button 
                  style={{...styles.modalButton, ...styles.cancelButton}}
                  onClick={handleCloseComments}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  Cancel
                </motion.button>
                <motion.button 
                  style={{...styles.modalButton, ...styles.submitButton}}
                  onClick={handleSubmitComment}
                  disabled={!comment.trim()}
                  whileHover={{ scale: comment.trim() ? 1.05 : 1 }}
                  whileTap={{ scale: comment.trim() ? 0.95 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  Submit
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Party Popper Animation */}
      {showPartyPopper && (
        <motion.div
          style={styles.partyPopperOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Main Party Popper */}
          <motion.div
            style={styles.partyPopper}
            initial={{ scale: 0, rotate: -45 }}
            animate={{ 
              scale: [0, 1.2, 1],
              rotate: [-45, 15, 0]
            }}
            transition={{ 
              duration: 0.8,
              ease: "backOut"
            }}
          >
            🎉
          </motion.div>

          {/* Explosion Effects */}
          <div style={styles.explosionContainer}>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  ...styles.explosionParticle,
                  left: "50%",
                  top: "50%",
                }}
                initial={{ 
                  scale: 0,
                  x: 0,
                  y: 0,
                  opacity: 1
                }}
                animate={{ 
                  scale: [0, 1, 0.5],
                  x: Math.cos(i * 30 * Math.PI / 180) * 150,
                  y: Math.sin(i * 30 * Math.PI / 180) * 150,
                  opacity: [1, 1, 0],
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 1.5,
                  delay: 0.3,
                  ease: "easeOut"
                }}
              >
                {['🎊', '✨', '🌟', '💫', '🎈'][i % 5]}
              </motion.div>
            ))}
          </div>

          {/* Celebration Text */}
          <motion.div
            style={styles.celebrationText}
            initial={{ 
              scale: 0,
              y: 50,
              opacity: 0
            }}
            animate={{ 
              scale: [0, 1.3, 1],
              y: [50, -20, 0],
              opacity: [0, 1, 1]
            }}
            transition={{ 
              duration: 1,
              delay: 0.5,
              ease: "backOut"
            }}
          >
            <motion.h2
              style={styles.celebrationTitle}
              animate={{
                textShadow: [
                  "0 0 10px rgba(243, 156, 18, 0.5)",
                  "0 0 20px rgba(243, 156, 18, 0.8)",
                  "0 0 10px rgba(243, 156, 18, 0.5)"
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity
              }}
            >
              AWESOME! 🎉
            </motion.h2>
            <motion.p
              style={styles.celebrationSubtext}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              Thank you for forgiving me!
            </motion.p>
          </motion.div>

          {/* Floating Hearts */}
          <div style={styles.floatingHearts}>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  ...styles.floatingHeart,
                  left: `${20 + i * 12}%`,
                }}
                initial={{ 
                  y: 100,
                  opacity: 0,
                  scale: 0
                }}
                animate={{ 
                  y: [-100, -200],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0.8],
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 2,
                  delay: 0.8 + i * 0.2,
                  ease: "easeOut"
                }}
              >
                {['✨', '🌟', '💫', '⭐', '🎊', '🎉'][i]}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {showConfetti && (
        <Confetti
          width={windowDimensions.width}
          height={windowDimensions.height}
          recycle={false}
          numberOfPieces={150}
        />
      )}

      {/* Simplified Rain */}
      <div style={styles.rainContainer}>
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              ...styles.raindrop,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: ['-100vh', '100vh'],
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: Math.random() * 2 + 3,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>

      {/* Wall Nails - Simplified */}
      <div style={styles.nailsContainer}>
        <motion.div 
          style={{...styles.nail, left: '30%'}}
          animate={{ 
            rotate: [0, 1, -1, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div style={styles.nailHead} />
          <div style={styles.nailShadow} />
        </motion.div>
        <motion.div 
          style={{...styles.nail, left: '70%'}}
          animate={{ 
            rotate: [0, -1, 1, 0]
          }}
          transition={{ 
            duration: 9, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div style={styles.nailHead} />
          <div style={styles.nailShadow} />
        </motion.div>
      </div>

      {/* Hanging Cards Container */}
      <div style={styles.cardsContainer}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            style={styles.cardWrapper}
            initial={{ 
              y: -50, 
              rotate: currentStep === 1 ? -8 : currentStep === 3 ? -6 : 8,
              opacity: 0 
            }}
            animate={{ 
              y: 0, 
              rotate: currentStep === 1 ? -3 : currentStep === 3 ? -2 : 3,
              opacity: 1 
            }}
            exit={{ 
              y: 50, 
              rotate: currentStep === 1 ? -15 : currentStep === 3 ? -12 : 15,
              opacity: 0 
            }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 15,
              duration: 0.8
            }}
          >
            {/* Hanging String - Simplified */}
            <motion.div
              style={styles.hangingString}
              animate={{
                rotate: [0, 1, -1, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div style={styles.stringHighlight} />
            </motion.div>

            {/* String Attachment Point - Simplified */}
            <motion.div
              style={styles.stringAttachment}
              animate={{
                rotate: [0, 0.5, -0.5, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity
              }}
            />

            {/* Card */}
            <motion.div
              style={{
                ...styles.card,
                ...(steps[currentStep].cardType === 'greeting' ? styles.greetingCard :
                    steps[currentStep].cardType === 'torn' ? styles.tornCard : 
                    steps[currentStep].cardType === 'clean' ? styles.cleanCard : 
                    steps[currentStep].cardType === 'sorry' ? styles.sorryCard :
                    steps[currentStep].cardType === 'celebration' ? styles.celebrationCard :
                    steps[currentStep].cardType === 'handshake' ? styles.handshakeCard : styles.cleanCard),
                background: steps[currentStep].cardType === 'greeting'
                  ? `linear-gradient(135deg, #ffffff 0%, #e3f2fd 30%, #bbdefb 60%, #f8f9fa 100%)`
                  : steps[currentStep].cardType === 'torn' 
                  ? `linear-gradient(135deg, #fff8f0 0%, #ffeaa7 20%, #ffffff 100%)`
                  : steps[currentStep].cardType === 'clean'
                  ? `linear-gradient(135deg, #f0f8ff 0%, #e8f5e8 20%, #ffffff 100%)`
                  : steps[currentStep].cardType === 'sorry'
                  ? `linear-gradient(135deg, #f3e5f5 0%, #e1bee7 30%, #ce93d8 60%, #ffffff 100%)`
                  : steps[currentStep].cardType === 'celebration'
                  ? `linear-gradient(135deg, #fff9e6 0%, #ffe066 30%, #ffcc02 60%, #ffffff 100%)`
                  : steps[currentStep].cardType === 'handshake'
                  ? `linear-gradient(135deg, #f8f0ff 0%, #e6ccff 30%, #d4b3ff 60%, #ffffff 100%)`
                  : `linear-gradient(135deg, #f0f8ff 0%, #e8f5e8 20%, #ffffff 100%)`
              }}
              animate={{
                rotate: currentStep === 4 ? [0, 1, -1, 0] : 
                        currentStep >= 5 ? [0, 0.5, -0.5, 0] : [
                  currentStep === 0 ? 1 : currentStep === 1 ? -2 : currentStep === 3 ? -1 : 2,
                  currentStep === 0 ? 0.5 : currentStep === 1 ? -1 : currentStep === 3 ? -0.5 : 1,
                  currentStep === 0 ? 1 : currentStep === 1 ? -2 : currentStep === 3 ? -1 : 2
                ],
                y: currentStep === 4 ? [0, -2, 1, 0] : 
                   currentStep >= 5 ? [0, -1, 0] : [0, -1, 0],
                scale: currentStep === 4 ? [1, 1.01, 1] : [1]
              }}
              transition={{
                duration: currentStep === 4 ? 4 : currentStep >= 5 ? 6 : 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              drag={false}
            >
              {/* Card Decorative Effects - Simplified */}
              {steps[currentStep].cardType === 'greeting' && (
                <div style={styles.greetingEffects}>
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      style={{
                        ...styles.greetingWave,
                        left: `${30 + i * 20}%`,
                        top: `${40 + i * 5}%`,
                      }}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.4, 0.6, 0.4]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.5
                      }}
                    >
                      👋
                    </motion.div>
                  ))}
                </div>
              )}

              {steps[currentStep].cardType === 'celebration' && (
                <div style={styles.celebrationEffects}>
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      style={{
                        ...styles.celebrationSpark,
                        left: `${25 + i * 15}%`,
                        top: `${20 + (i % 2) * 30}%`,
                      }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                        repeatDelay: 1
                      }}
                    >
                      ✨
                    </motion.div>
                  ))}
                </div>
              )}

              {steps[currentStep].cardType === 'handshake' && (
                <div style={styles.handshakeEffects}>
                  {/* Caring heart behind text - low opacity */}
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: 'clamp(60px, 10vw, 90px)',
                      opacity: 0.08,
                      pointerEvents: 'none',
                      zIndex: 1,
                      color: '#9b59b6',
                    }}
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.06, 0.1, 0.06]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    💖
                  </motion.div>

                  {/* Interactive floating elements */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      style={{
                        position: 'absolute',
                        left: `${15 + i * 12}%`,
                        top: `${20 + (i % 3) * 20}%`,
                        fontSize: '20px',
                        pointerEvents: 'none',
                        zIndex: 3,
                      }}
                      animate={{
                        y: [0, -15, 0],
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.2, 1],
                        opacity: [0.6, 1, 0.6]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.4,
                        ease: "easeInOut"
                      }}
                    >
                      {['💭', '✨', '💫', '🌟', '🎯', '🎈'][i]}
                    </motion.div>
                  ))}
                  
                  {/* Pulsing glow effect */}
                  <motion.div
                    style={{
                      position: 'absolute',
                      top: '-15px',
                      left: '-15px',
                      right: '-15px',
                      bottom: '-15px',
                      background: 'radial-gradient(circle, rgba(155, 89, 182, 0.2), transparent 70%)',
                      borderRadius: '25px',
                      pointerEvents: 'none',
                      zIndex: 2,
                    }}
                    animate={{
                      opacity: [0.3, 0.6, 0.3],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              )}

              {/* Card Content */}
              <motion.div
                style={styles.cardContent}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  style={styles.emojiContainer}
                  animate={{ 
                    scale: currentStep >= 4 ? [1, 1.1, 1] : [1, 1.05, 1]
                  }}
                  transition={{ 
                    duration: currentStep >= 4 ? 3 : 4,
                    repeat: Infinity
                  }}
                >
                  <span style={{
                    ...styles.bigEmoji,
                    fontSize: currentStep >= 4 ? "clamp(60px, 10vw, 80px)" : "clamp(50px, 8vw, 70px)"
                  }}>
                    {steps[currentStep].emoji}
                  </span>
                </motion.div>

                {/* Only show title and message for cards that have content */}
                {(currentStep < 5 && steps[currentStep].title) || (currentStep === 5 && steps[currentStep].message) ? (
                  <>
                    {steps[currentStep].title && (
                      <motion.h1
                        style={{
                          ...styles.title,
                          color: steps[currentStep].color,
                          fontFamily: steps[currentStep].cardType === 'torn' ? "'Creepster', 'Nosifer', 'Butcherman', cursive" : "'Orbitron', 'Exo 2', 'Rajdhani', futuristic, sans-serif"
                        }}
                      >
                        {steps[currentStep].title}
                      </motion.h1>
                    )}

                    {steps[currentStep].message && (
                      <motion.p
                        style={{
                          ...styles.message,
                          fontStyle: steps[currentStep].cardType === 'torn' ? 'italic' : 'normal',
                          color: steps[currentStep].cardType === 'greeting' ? '#1a365d' : '#2c3e50',
                          fontWeight: steps[currentStep].cardType === 'greeting' ? '600' : '500',
                          textShadow: steps[currentStep].cardType === 'greeting' 
                            ? '0 3px 6px rgba(0,0,0,0.2), 0 1px 3px rgba(255,255,255,0.8)' 
                            : steps[currentStep].cardType === 'handshake'
                            ? '0 2px 4px rgba(0,0,0,0.2), 0 1px 2px rgba(155,89,182,0.3)'
                            : '0 2px 4px rgba(0,0,0,0.15)'
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        {steps[currentStep].message}
                      </motion.p>
                    )}
                  </>
                ) : null}

                <div style={{
                  ...styles.buttonContainer,
                  flexDirection: currentStep === 5 ? "column" : "row"
                }}>
                  {currentStep > 0 && currentStep < 4 && currentStep !== 3 && (
                    <motion.button
                      style={{...styles.button, ...styles.prevButton}}
                      whileTap={{ scale: 0.95 }}
                      onClick={prevStep}
                    >
                      ← Back
                    </motion.button>
                  )}

                  {currentStep === 0 || currentStep === 1 ? (
                    <motion.button
                      style={{...styles.button, backgroundColor: steps[currentStep].color}}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextStep}
                    >
                      Continue →
                    </motion.button>
                  ) : currentStep === 2 ? (
                    <>
                      <motion.button
                        style={{...styles.button, ...styles.noButton}}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleNo}
                      >
                        <span style={{marginRight: '8px'}}>✕</span>
                        No
                      </motion.button>
                      <motion.button
                        style={{...styles.button, ...styles.forgiveButton}}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleForgive}
                      >
                        <span style={{marginRight: '8px'}}>✓</span>
                        Forgive
                      </motion.button>
                    </>
                  ) : currentStep === 3 ? (
                    <motion.button
                      style={{...styles.button, ...styles.understandButton}}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        initializeAudio();
                        playPaperTurnSound();
                        setCurrentStep(2);
                      }}
                    >
                      I Understand
                    </motion.button>
                  ) : (
                    <>
                      {currentStep === 5 ? (
                        <>
                          <motion.button
                            style={{...styles.button, ...styles.commentsButton}}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleComments}
                          >
                            💬 Comments
                          </motion.button>
                          <motion.button
                            style={{...styles.button, ...styles.restartButton}}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              initializeAudio();
                              playPaperTurnSound();
                              setCurrentStep(0);
                            }}
                          >
                            🔄 Restart
                          </motion.button>
                        </>
                      ) : (
                        <motion.button
                          style={{...styles.button, ...styles.celebrationButton}}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleContinue}
                        >
                          🎉 Continue
                        </motion.button>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Dots */}
      <motion.div 
        style={styles.progressContainer}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        {steps.map((_, index) => (
          <motion.div
            key={index}
            style={{
              ...styles.progressDot,
              backgroundColor: index <= currentStep ? steps[Math.min(currentStep, steps.length - 1)].color : '#ddd'
            }}
            animate={{
              scale: index === currentStep ? 1.2 : 1
            }}
            onClick={() => {
              initializeAudio();
              playPaperTurnSound();
              setCurrentStep(index);
            }}
          />
        ))}
      </motion.div>

      {/* Bottom Message */}
      <motion.div
        style={styles.bottomMessage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ 
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity
          }}
        >
            “We all make mistakes—putting things right is what counts.”        </motion.div>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    fontFamily: "'Orbitron', 'Exo 2', 'Rajdhani', 'Audiowide', futuristic, sans-serif",
    overflow: "hidden",
    padding: "10px",
  },
  
  rainContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 1,
  },
  
  raindrop: {
    position: "absolute",
    width: "1px",
    height: "15px",
    background: "linear-gradient(to bottom, transparent, rgba(173, 216, 230, 0.4), transparent)",
    borderRadius: "50px",
  },
  
  nailsContainer: {
    position: "absolute",
    top: "12%",
    width: "100%",
    height: "20px",
    zIndex: 5,
  },
  
  nail: {
    position: "absolute",
    width: "12px",
    height: "12px",
    background: "radial-gradient(circle, #8b7355 0%, #5d4e37 100%)",
    borderRadius: "50%",
    boxShadow: "0 3px 6px rgba(0,0,0,0.4), inset 0 1px 3px rgba(255,255,255,0.3)",
    transform: "translateX(-50%)",
  },
  
  nailHead: {
    position: "absolute",
    top: "2px",
    left: "2px",
    width: "8px",
    height: "8px",
    background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), transparent)",
    borderRadius: "50%",
  },
  
  nailShadow: {
    position: "absolute",
    bottom: "-3px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "16px",
    height: "4px",
    background: "radial-gradient(ellipse, rgba(0,0,0,0.3), transparent)",
    borderRadius: "50%",
  },
  
  cardsContainer: {
    position: "relative",
    zIndex: 10,
    width: "100%",
    display: "flex",
    justifyContent: "center",
  },
  
  cardWrapper: {
    position: "relative",
    transformOrigin: "top center",
  },
  
  hangingString: {
    position: "absolute",
    top: "-80px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "3px",
    height: "80px",
    background: "linear-gradient(to bottom, #8b7355 0%, #654321 50%, #4a3728 100%)",
    transformOrigin: "top center",
    zIndex: 8,
    borderRadius: "1px",
    boxShadow: "inset 1px 0 0 rgba(255,255,255,0.2), 1px 0 2px rgba(0,0,0,0.3)",
  },
  
  stringHighlight: {
    position: "absolute",
    top: 0,
    left: "0px",
    width: "1px",
    height: "100%",
    background: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent 50%)",
    borderRadius: "1px",
  },
  
  stringAttachment: {
    position: "absolute",
    top: "-5px",
    left: "50%",
    transform: "translateX(-50%)",
    width: "6px",
    height: "6px",
    background: "radial-gradient(circle, #654321, #4a3728)",
    borderRadius: "50%",
    boxShadow: "0 1px 2px rgba(0,0,0,0.4)",
    zIndex: 9,
  },
  
  card: {
    width: "min(380px, 85vw)",
    minHeight: "min(450px, 65vh)",
    padding: "25px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow: "0 25px 50px rgba(0,0,0,0.4), 0 8px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
    position: "relative",
    transformOrigin: "top center",
    overflow: "hidden",
    cursor: "grab",
    '@media (max-width: 768px)': {
      width: "min(320px, 90vw)",
      minHeight: "min(400px, 60vh)",
      padding: "20px",
    },
    '@media (max-width: 480px)': {
      width: "min(300px, 95vw)",
      minHeight: "min(350px, 55vh)",
      padding: "15px",
    }
  },
  
  tornCard: {
    clipPath: "polygon(0% 0%, 95% 0%, 100% 8%, 98% 15%, 100% 25%, 95% 35%, 100% 45%, 98% 55%, 100% 65%, 95% 75%, 100% 85%, 98% 95%, 95% 100%, 0% 100%)",
    border: "2px solid #d4af37",
  },
  
  cleanCard: {
    border: "1px solid rgba(255,255,255,0.3)",
  },
  
  greetingCard: {
    border: "2px solid #3498db",
    boxShadow: "0 25px 50px rgba(0,0,0,0.4), 0 8px 20px rgba(52, 152, 219, 0.3), inset 0 2px 0 rgba(255,255,255,0.2)",
  },
  
  sorryCard: {
    border: "2px solid #8e44ad",
    boxShadow: "0 25px 50px rgba(0,0,0,0.4), 0 8px 20px rgba(142, 68, 173, 0.3), inset 0 2px 0 rgba(255,255,255,0.2)",
  },
  
  celebrationCard: {
    border: "3px solid #f39c12",
    boxShadow: "0 25px 50px rgba(0,0,0,0.4), 0 8px 20px rgba(243, 156, 18, 0.3), inset 0 2px 0 rgba(255,255,255,0.2)",
  },
  
  handshakeCard: {
    border: "2px solid #9b59b6",
    boxShadow: "0 25px 50px rgba(0,0,0,0.4), 0 8px 20px rgba(155, 89, 182, 0.3), inset 0 2px 0 rgba(255,255,255,0.2)",
  },
  
  tornEffects: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
  },
  
  stain1: {
    position: "absolute",
    top: "20%",
    right: "15%",
    width: "30px",
    height: "30px",
    background: "radial-gradient(circle, rgba(139, 115, 85, 0.2), transparent)",
    borderRadius: "50%",
  },
  
  stain2: {
    position: "absolute",
    bottom: "25%",
    left: "10%",
    width: "20px",
    height: "20px",
    background: "radial-gradient(circle, rgba(160, 82, 45, 0.15), transparent)",
    borderRadius: "50%",
  },
  
  crease: {
    position: "absolute",
    top: "30%",
    left: "20%",
    right: "20%",
    height: "1px",
    background: "linear-gradient(to right, transparent, rgba(139, 115, 85, 0.3), transparent)",
    transform: "rotate(-2deg)",
  },
  
  cleanEffects: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
    overflow: "hidden",
    borderRadius: "15px",
  },
  
  shimmer: {
    position: "absolute",
    top: 0,
    left: "-100px",
    width: "50px",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
    transform: "skewX(-20deg)",
  },
  
  celebrationEffects: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
    overflow: "hidden",
    borderRadius: "15px",
  },
  
  celebrationSpark: {
    position: "absolute",
    fontSize: "16px",
    pointerEvents: "none",
  },
  
  celebrationGlow: {
    position: "absolute",
    top: "-10px",
    left: "-10px",
    right: "-10px",
    bottom: "-10px",
    background: "radial-gradient(circle, rgba(243, 156, 18, 0.2), transparent 70%)",
    borderRadius: "25px",
  },
  
  // Party Popper Styles
  partyPopperOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    pointerEvents: "none",
  },
  
  partyPopper: {
    fontSize: "clamp(80px, 15vw, 120px)",
    filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.3))",
    zIndex: 1001,
  },
  
  explosionContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  },
  
  explosionParticle: {
    position: "absolute",
    fontSize: "clamp(20px, 4vw, 30px)",
    transform: "translate(-50%, -50%)",
    pointerEvents: "none",
  },
  
  celebrationText: {
    position: "absolute",
    top: "60%",
    left: "50%",
    transform: "translateX(-50%)",
    textAlign: "center",
    zIndex: 1001,
  },
  
  celebrationTitle: {
    fontSize: "clamp(32px, 8vw, 48px)",
    fontWeight: "900",
    color: "#f39c12",
    margin: "0",
    textShadow: "0 0 20px rgba(243, 156, 18, 0.8), 0 4px 8px rgba(0,0,0,0.3)",
    fontFamily: "'Orbitron', 'Exo 2', futuristic, sans-serif",
    letterSpacing: "3px",
    textTransform: "uppercase",
    background: "linear-gradient(45deg, #f39c12, #e67e22, #d35400)",
    backgroundSize: "200% 200%",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  
  celebrationSubtext: {
    fontSize: "clamp(16px, 4vw, 20px)",
    color: "white",
    margin: "10px 0 0 0",
    textShadow: "0 3px 6px rgba(0,0,0,0.7), 0 0 15px rgba(255,255,255,0.3)",
    fontFamily: "'Quicksand', 'Comfortaa', stylish, sans-serif",
    fontWeight: "600",
    letterSpacing: "1.2px",
    fontStyle: "italic",
  },
  
  floatingHearts: {
    position: "absolute",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  },
  
  floatingHeart: {
    position: "absolute",
    fontSize: "clamp(20px, 4vw, 28px)",
    bottom: "0%",
  },
  
  // New card effect styles
  greetingEffects: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
  },
  
  greetingWave: {
    position: "absolute",
    fontSize: "20px",
  },
  
  greetingGlow: {
    position: "absolute",
    top: "-10px",
    left: "-10px",
    right: "-10px",
    bottom: "-10px",
    background: "radial-gradient(circle, rgba(52, 152, 219, 0.15), transparent 70%)",
    borderRadius: "25px",
  },
  
  sorryEffects: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
  },
  
  sorryTear: {
    position: "absolute",
    fontSize: "14px",
  },
  
  sorryGlow: {
    position: "absolute",
    top: "-10px",
    left: "-10px",
    right: "-10px",
    bottom: "-10px",
    background: "radial-gradient(circle, rgba(142, 68, 173, 0.15), transparent 70%)",
    borderRadius: "25px",
  },
  
  handshakeEffects: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  
  handshakeHand: {
    position: "absolute",
    top: "40%",
    transform: "translateY(-50%)",
  },
  
  handshakeHeart: {
    position: "absolute",
    top: "30%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    fontSize: "30px",
  },
  
  cardContent: {
    position: "relative",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
    height: "100%",
    justifyContent: "center",
    '@media (max-width: 768px)': {
      gap: "12px",
    },
    '@media (max-width: 480px)': {
      gap: "10px",
    }
  },
  
  emojiContainer: {
    marginBottom: "5px",
    '@media (max-width: 480px)': {
      marginBottom: "3px",
    }
  },
  
  bigEmoji: {
    fontSize: "clamp(40px, 7vw, 60px)",
    display: "block",
    filter: "drop-shadow(2px 2px 4px rgba(0,0,0,0.2))",
  },
  
  title: {
    fontSize: "clamp(20px, 5vw, 28px)",
    fontWeight: "900",
    margin: "0",
    textShadow: "0 4px 8px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.1)",
    fontFamily: "'Orbitron', 'Exo 2', 'Rajdhani', futuristic, sans-serif",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    background: "linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #f39c12)",
    backgroundSize: "300% 300%",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    '@media (max-width: 480px)': {
      letterSpacing: "1px",
    }
  },
  
  message: {
    fontSize: "clamp(14px, 3.5vw, 16px)",
    lineHeight: "1.6",
    color: "#2c3e50",
    margin: "0",
    maxWidth: "min(280px, 85%)",
    fontWeight: "500",
    fontFamily: "'Quicksand', 'Comfortaa', 'Nunito', stylish, sans-serif",
    letterSpacing: "0.8px",
    textShadow: "0 2px 4px rgba(0,0,0,0.15)",
    fontStyle: "italic",
    '@media (max-width: 480px)': {
      letterSpacing: "0.5px",
      lineHeight: "1.5",
    }
  },
  
  buttonContainer: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: "10px",
    flexDirection: "row",
    '@media (max-width: 480px)': {
      gap: "8px",
      marginTop: "8px",
    }
  },
  
  button: {
    padding: "12px 20px",
    fontSize: "clamp(12px, 3vw, 14px)",
    fontWeight: "800",
    borderRadius: "25px",
    border: "none",
    cursor: "pointer",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.4s ease",
    boxShadow: "0 6px 15px rgba(0,0,0,0.3), inset 0 2px 0 rgba(255,255,255,0.2)",
    minWidth: "100px",
    fontFamily: "'Orbitron', 'Exo 2', 'Rajdhani', futuristic, sans-serif",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    textShadow: "0 2px 4px rgba(0,0,0,0.5)",
    position: "relative",
    overflow: "hidden",
    '@media (max-width: 480px)': {
      padding: "10px 16px",
      letterSpacing: "1px",
      minWidth: "80px",
    }
  },
  
  prevButton: {
    backgroundColor: "#7f8c8d",
  },
  
  noButton: {
    background: "linear-gradient(135deg, #e74c3c, #c0392b)",
  },
  
  forgiveButton: {
    background: "linear-gradient(135deg, #27ae60, #2ecc71)",
  },
  
  understandButton: {
    background: "linear-gradient(135deg, #8e44ad, #9b59b6)",
  },
  
  celebrationButton: {
    background: "linear-gradient(135deg, #f39c12, #e67e22)",
  },
  
  commentsButton: {
    background: "linear-gradient(135deg, #9b59b6, #8e44ad)",
  },
  
  restartButton: {
    background: "linear-gradient(135deg, #3498db, #2980b9)",
  },
  
  progressContainer: {
    position: "absolute",
    bottom: "50px",
    display: "flex",
    gap: "10px",
    zIndex: 10,
    '@media (max-width: 768px)': {
      bottom: "35px",
      gap: "8px",
    },
    '@media (max-width: 480px)': {
      bottom: "25px",
      gap: "6px",
    }
  },
  
  progressDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "2px solid rgba(255,255,255,0.8)",
    '@media (max-width: 480px)': {
      width: "8px",
      height: "8px",
    }
  },
  
  bottomMessage: {
    position: "absolute",
    bottom: "15px",
    color: "rgba(255,255,255,0.95)",
    fontSize: "clamp(14px, 3vw, 16px)",
    display: "flex",
    alignItems: "center",
    textShadow: "0 3px 6px rgba(0,0,0,0.5), 0 0 15px rgba(255,255,255,0.2)",
    zIndex: 10,
    textAlign: "center",
    padding: "0 20px",
    fontFamily: "'Quicksand', 'Comfortaa', stylish, sans-serif",
    fontWeight: "600",
    letterSpacing: "1.5px",
    fontStyle: "italic",
  },
  
  // Comments Modal Styles
  commentsOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    padding: "20px",
  },
  
  commentsModal: {
    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
    borderRadius: "15px",
    width: "min(450px, 85vw)",
    maxHeight: "75vh",
    boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.2)",
    overflow: "hidden",
    '@media (max-width: 768px)': {
      width: "min(380px, 90vw)",
      maxHeight: "70vh",
      borderRadius: "12px",
    },
    '@media (max-width: 480px)': {
      width: "min(320px, 95vw)",
      maxHeight: "65vh",
      borderRadius: "10px",
    }
  },
  
  commentsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 20px",
    borderBottom: "1px solid rgba(0,0,0,0.1)",
    background: "linear-gradient(135deg, #9b59b6, #8e44ad)",
    color: "white",
    '@media (max-width: 480px)': {
      padding: "15px 18px",
    }
  },
  
  commentsTitle: {
    margin: 0,
    fontSize: "clamp(18px, 4vw, 22px)",
    fontWeight: "800",
    fontFamily: "'Orbitron', 'Exo 2', futuristic, sans-serif",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
    '@media (max-width: 480px)': {
      letterSpacing: "1px",
    }
  },
  
  closeButton: {
    background: "none",
    border: "none",
    color: "white",
    fontSize: "clamp(18px, 4vw, 20px)",
    cursor: "pointer",
    padding: "5px",
    borderRadius: "50%",
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.3s ease",
    '@media (max-width: 480px)': {
      width: "24px",
      height: "24px",
    }
  },
  
  commentsBody: {
    padding: "20px",
    '@media (max-width: 480px)': {
      padding: "15px",
    }
  },
  
  commentsLabel: {
    margin: "0 0 12px 0",
    color: "#2c3e50",
    fontSize: "clamp(14px, 3.5vw, 17px)",
    lineHeight: "1.6",
    fontFamily: "'Quicksand', 'Comfortaa', stylish, sans-serif",
    fontWeight: "600",
    letterSpacing: "0.6px",
    fontStyle: "italic",
    '@media (max-width: 480px)': {
      letterSpacing: "0.4px",
      margin: "0 0 10px 0",
    }
  },
  
  commentInput: {
    width: "100%",
    padding: "15px",
    border: "3px solid #e0e0e0",
    borderRadius: "12px",
    fontSize: "clamp(14px, 3.5vw, 16px)",
    fontFamily: "'Quicksand', 'Comfortaa', stylish, sans-serif",
    resize: "vertical",
    minHeight: "100px",
    outline: "none",
    transition: "all 0.4s ease",
    boxSizing: "border-box",
    letterSpacing: "0.4px",
    lineHeight: "1.5",
    fontWeight: "500",
    boxShadow: "inset 0 2px 8px rgba(0,0,0,0.1)",
    '@media (max-width: 480px)': {
      padding: "12px",
      borderRadius: "10px",
      minHeight: "80px",
      letterSpacing: "0.3px",
    }
  },
  
  commentsFooter: {
    display: "flex",
    gap: "10px",
    padding: "18px 20px",
    borderTop: "1px solid rgba(0,0,0,0.1)",
    background: "#f8f9fa",
    justifyContent: "flex-end",
    '@media (max-width: 480px)': {
      padding: "15px 15px",
      gap: "8px",
      flexDirection: "column",
    }
  },
  
  modalButton: {
    padding: "12px 20px",
    fontSize: "clamp(14px, 3.5vw, 16px)",
    fontWeight: "700",
    borderRadius: "20px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.4s ease",
    minWidth: "100px",
    fontFamily: "'Orbitron', 'Exo 2', futuristic, sans-serif",
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    textShadow: "0 2px 4px rgba(0,0,0,0.3)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2)",
    '@media (max-width: 480px)': {
      padding: "10px 16px",
      letterSpacing: "1px",
      minWidth: "80px",
      width: "100%",
    }
  },
  
  cancelButton: {
    background: "#6c757d",
    color: "white",
  },
  
  submitButton: {
    background: "linear-gradient(135deg, #9b59b6, #8e44ad)",
    color: "white",
  },
};

export default Friend;
