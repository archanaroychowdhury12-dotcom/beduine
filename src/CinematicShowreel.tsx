import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, VolumeX, Camera, Sun, Moon, Sunrise, 
  MapPin, RotateCcw, Play, Pause, ChevronRight, 
  Compass, Sliders, Eye, Sparkles, SlidersHorizontal,
  Flame, HelpCircle, AlertCircle
} from 'lucide-react';

/* ---------- Enhanced Sound Synthesizer via Native Web Audio API ---------- */
class AmbientSoundscapeSynth {
  private ctx: AudioContext | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  private masterVolume: number = 0.45;
  
  // Node tracking for sub-oscillators to allow proper cleanup
  private soundNodes: Array<AudioNode | AudioScheduledSourceNode> = [];
  private oscillationInterval: any = null;
  private subInterval1: any = null;
  private subInterval2: any = null;

  start(type: 'wind' | 'waves' | 'chimes', volume: number) {
    this.stop();
    this.masterVolume = volume;
    
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    this.ctx = new AudioContextClass();
    
    // Main Gain Node
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);
    
    // Master Filter
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(400, this.ctx.currentTime);
    this.filterNode.Q.setValueAtTime(2.0, this.ctx.currentTime);
    this.filterNode.connect(this.gainNode);
    
    // Synthesize White Noise Buffer for ambient beds
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    noiseSource.connect(this.filterNode);
    noiseSource.start(0);
    this.soundNodes.push(noiseSource);
    
    // Fade in main gain
    this.gainNode.gain.linearRampToValueAtTime(this.masterVolume, this.ctx.currentTime + 1.5);
    
    if (type === 'wind') {
      // --- KASHMIR ALPINE WIND + GUSTY HOWLS ---
      this.filterNode.type = 'bandpass';
      this.filterNode.Q.setValueAtTime(7.0, this.ctx.currentTime);
      
      let phase = 0;
      this.oscillationInterval = setInterval(() => {
        if (!this.ctx || !this.filterNode || !this.gainNode) return;
        phase += 0.06;
        
        // Dynamic base frequency sweeps (200Hz to 600Hz)
        const baseFreq = 360 + Math.sin(phase) * 150 + Math.sin(phase * 0.35) * 80;
        this.filterNode.frequency.setValueAtTime(baseFreq, this.ctx.currentTime);
        
        // Simulating howls (higher pitch sweeps on random peaks)
        if (Math.sin(phase * 2.1) > 0.82) {
          const howlFreq = baseFreq + 350 * Math.sin(phase * 2.1);
          this.filterNode.frequency.exponentialRampToValueAtTime(howlFreq, this.ctx.currentTime + 0.1);
        }
        
        // Wind gusts amplitude scaling
        const gustVolume = this.masterVolume * (0.6 + Math.sin(phase) * 0.4);
        this.gainNode.gain.setValueAtTime(gustVolume, this.ctx.currentTime);
      }, 70);
      
    } else if (type === 'waves') {
      // --- KERALA RAIN OR SUNDARBANS CRICKETS + WAVES ---
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(200, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(1.0, this.ctx.currentTime);
      
      let phase = 0;
      // 1. Wave ocean swells
      this.oscillationInterval = setInterval(() => {
        if (!this.ctx || !this.gainNode || !this.filterNode) return;
        phase += 0.02; // Slow rhythmic breathing swell
        const swell = Math.sin(phase);
        
        const swellVolume = this.masterVolume * (0.35 + (swell + 1) * 0.35);
        this.gainNode.gain.linearRampToValueAtTime(swellVolume, this.ctx.currentTime + 0.2);
        
        const sweepFreq = 160 + (swell + 1) * 120;
        this.filterNode.frequency.setValueAtTime(sweepFreq, this.ctx.currentTime);
      }, 120);
      
    } else if (type === 'chimes') {
      // --- DARJEELING WIND CHIMES + LOW TOY TRAIN RUMBLE ---
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(1200, this.ctx.currentTime);
      
      // 1. Chime Bell Trigger
      const playChimeNode = () => {
        if (!this.ctx || !this.gainNode) return;
        const now = this.ctx.currentTime;
        
        const frequencies = [392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; // Pentatonic bells
        const chimeFreq = frequencies[Math.floor(Math.random() * frequencies.length)];
        
        const chimeOsc = this.ctx.createOscillator();
        const overtoneOsc = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        const overtoneGain = this.ctx.createGain();
        
        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(chimeFreq, now);
        
        overtoneOsc.type = 'sine';
        overtoneOsc.frequency.setValueAtTime(chimeFreq * 2.016, now); // Metallic ring detuning
        
        chimeGain.gain.setValueAtTime(0, now);
        chimeGain.gain.linearRampToValueAtTime(this.masterVolume * 0.38, now + 0.03);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);
        
        overtoneGain.gain.setValueAtTime(0, now);
        overtoneGain.gain.linearRampToValueAtTime(this.masterVolume * 0.15, now + 0.03);
        overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
        
        chimeOsc.connect(chimeGain);
        overtoneOsc.connect(overtoneGain);
        chimeGain.connect(this.gainNode!);
        overtoneGain.connect(this.gainNode!);
        
        chimeOsc.start(now);
        overtoneOsc.start(now);
        
        chimeOsc.stop(now + 3.6);
        overtoneOsc.stop(now + 2.0);
      };
      
      playChimeNode();
      this.oscillationInterval = setInterval(playChimeNode, 2600);
      
      // 2. Toy Train low frequency rumble synth overlay
      try {
        const trainOsc = this.ctx.createOscillator();
        const trainGain = this.ctx.createGain();
        trainOsc.type = 'triangle';
        trainOsc.frequency.setValueAtTime(36, this.ctx.currentTime); // Deep hum
        
        // Track wheel clicks via LFO modulation
        const modOsc = this.ctx.createOscillator();
        modOsc.type = 'sawtooth';
        modOsc.frequency.setValueAtTime(3.8, this.ctx.currentTime); // Rhythmic click rate
        
        const modGain = this.ctx.createGain();
        modGain.gain.setValueAtTime(0.012, this.ctx.currentTime);
        
        modOsc.connect(modGain);
        modGain.connect(trainGain.gain);
        
        trainGain.gain.setValueAtTime(this.masterVolume * 0.18, this.ctx.currentTime);
        trainOsc.connect(trainGain);
        trainGain.connect(this.gainNode!);
        
        trainOsc.start(0);
        modOsc.start(0);
        
        this.soundNodes.push(trainOsc, modOsc, trainGain, modGain);
      } catch (e) {
        console.error("Train rumble synthesis error:", e);
      }
    }
  }

  // Set secondary overlays triggered periodically (crickets for Sundarbans, rain clicks for Kerala)
  triggerSubOverlays(type: 'sundarbans' | 'kerala') {
    this.stopSubOverlays();
    if (!this.ctx || !this.gainNode) return;

    if (type === 'sundarbans') {
      // --- SUNDARBANS CRICKETS IN MANGROVES ---
      const playCricketChirp = () => {
        if (!this.ctx || !this.gainNode) return;
        const now = this.ctx.currentTime;
        
        const chirpOsc = this.ctx.createOscillator();
        const chirpGain = this.ctx.createGain();
        chirpOsc.type = 'sine';
        chirpOsc.frequency.setValueAtTime(3400 + Math.random() * 200, now);
        
        // High frequency vibration pulse sequence
        chirpGain.gain.setValueAtTime(0, now);
        for (let i = 0; i < 7; i++) {
          const t = now + i * 0.07;
          chirpGain.gain.setValueAtTime(this.masterVolume * 0.045, t);
          chirpGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);
        }
        
        chirpOsc.connect(chirpGain);
        chirpGain.connect(this.gainNode);
        chirpOsc.start(now);
        chirpOsc.stop(now + 0.6);
      };
      
      playCricketChirp();
      this.subInterval1 = setInterval(playCricketChirp, 3300);
      
    } else if (type === 'kerala') {
      // --- KERALA RAIN PATTER CLICKS ---
      const playRaindrops = () => {
        if (!this.ctx || !this.gainNode) return;
        const now = this.ctx.currentTime;
        
        // Synthesize 12 individual drop taps
        for (let i = 0; i < 12; i++) {
          const dropTime = now + Math.random() * 1.8;
          const dropOsc = this.ctx.createOscillator();
          const dropGain = this.ctx.createGain();
          
          dropOsc.type = 'triangle';
          // Filter resonance frequency mimicking rain hitting hollow bamboo/leaves
          dropOsc.frequency.setValueAtTime(1000 + Math.random() * 700, dropTime);
          
          dropGain.gain.setValueAtTime(this.masterVolume * 0.024, dropTime);
          dropGain.gain.exponentialRampToValueAtTime(0.0001, dropTime + 0.025);
          
          dropOsc.connect(dropGain);
          dropGain.connect(this.gainNode);
          
          dropOsc.start(dropTime);
          dropOsc.stop(dropTime + 0.03);
        }
      };
      
      playRaindrops();
      this.subInterval2 = setInterval(playRaindrops, 1600);
    }
  }

  setVolume(volume: number) {
    this.masterVolume = volume;
    if (this.ctx && this.gainNode) {
      this.gainNode.gain.linearRampToValueAtTime(volume, this.ctx.currentTime + 0.08);
    }
  }

  stopSubOverlays() {
    if (this.subInterval1) { clearInterval(this.subInterval1); this.subInterval1 = null; }
    if (this.subInterval2) { clearInterval(this.subInterval2); this.subInterval2 = null; }
  }

  stop() {
    this.stopSubOverlays();
    if (this.oscillationInterval) {
      clearInterval(this.oscillationInterval);
      this.oscillationInterval = null;
    }
    
    // Stop all sub oscillator nodes
    this.soundNodes.forEach((node) => {
      try {
        if ('stop' in node) (node as any).stop();
      } catch(e) {}
    });
    this.soundNodes = [];

    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (e) {
        console.error("Audio Context close error:", e);
      }
      this.ctx = null;
      this.gainNode = null;
      this.filterNode = null;
    }
  }
}

/* ---------- Data Config ---------- */
const CINEMATIC_DESTINATIONS = [
  {
    id: 'kashmir',
    name: 'Kashmir',
    title: 'Misty Valleys & Shikara Ripples',
    tagline: 'PEAK OF PARADISE',
    image: '/images/kashmir_dal_lake_1779521728036.png',
    soundType: 'wind' as const,
    subOverlay: null,
    cameraSetup: 'CAM A // SENSOR 01 // KASHMIR RIDGE',
    focalLength: '50mm f/1.2 L Cinema',
    iso: '100',
    shutter: '1/320s',
    journal: 'Misty morning on Dal Lake. The soft ripple of shikara oars in the freezing water. Distant snow peaks silhouetted against a pale golden sky. The smell of fresh pine and burning saffron floats through the houseboats. Absolute stillness.',
    details: ['Dal Lake Houseboats', 'Gulmarg Cable Car', 'Pahalgam Pine Trails'],
    accentColor: '#00d9ff', // cyan
    glowClass: 'shadow-[0_0_25px_rgba(0,217,255,0.15)] border-cyan/45'
  },
  {
    id: 'darjeeling',
    name: 'Darjeeling',
    title: 'Sunrise over Majestic Kanchenjunga',
    tagline: 'HIMALAYAN TEA TRAILS',
    image: '/images/darjeeling_tea_1779521805614.png',
    soundType: 'chimes' as const,
    subOverlay: null,
    cameraSetup: 'CAM B // SENSOR 02 // TIGER HILL OBS',
    focalLength: '85mm f/1.4 Prime Art',
    iso: '200',
    shutter: '1/500s',
    journal: 'Sunrise over Kanchenjunga, painting the peaks in dramatic shades of liquid gold and copper. The crisp mountain air carries the sweet, green aroma of freshly plucked tea leaves. Far below, the toy train whistle echoes in the mist.',
    details: ['Tiger Hill Sunrise', 'Himalayan Toy Train', 'Happy Valley Tea Estate'],
    accentColor: '#fbbf24', // amber/gold
    glowClass: 'shadow-[0_0_25px_rgba(251,191,36,0.15)] border-amber-400/45'
  },
  {
    id: 'sundarbans',
    name: 'Sundarbans',
    title: 'Silent Waterways of Mangrove Forests',
    tagline: 'TIGER TERRITORY DELTA',
    image: '/images/sundarbans_mangrove_1779521789593.png',
    soundType: 'waves' as const,
    subOverlay: 'sundarbans' as const,
    cameraSetup: 'CAM C // SENSOR 03 // DELTA WATERWAY',
    focalLength: '200mm f/2.8 IS Master',
    iso: '400',
    shutter: '1/1250s',
    journal: 'Deep silence in the world’s largest mangrove delta. Waterways like narrow veins wind through the dense forest. A sudden rustle in the breathing roots. A heartbeat skips as the eyes search the shade for the gold and black stripes.',
    details: ['Sundarban Boat Safari', 'Dobanki Canopy Walk', 'Tiger Watchtower Trek'],
    accentColor: '#34d399', // emerald
    glowClass: 'shadow-[0_0_25px_rgba(52,211,153,0.15)] border-emerald-400/45'
  },
  {
    id: 'dubai',
    name: 'Dubai',
    title: 'Golden Dunes & Futuristic Spires',
    tagline: 'DESERT OASIS METROPOLIS',
    image: '/images/dubai_skyline_1779539448313.png',
    soundType: 'wind' as const,
    subOverlay: null,
    cameraSetup: 'CAM D // SENSOR 04 // DUBAI MARINA',
    focalLength: '24mm f/1.8 Ultra Wide',
    iso: '320',
    shutter: '1/80s',
    journal: 'Crimson dunes stretching into the horizon, meeting a towering city of glass and light. As dusk transitions to midnight, the skyline lights up like an ocean of neon stars. The warm desert wind brushes past the futuristic spires.',
    details: ['Burj Khalifa Deck', 'Desert Safari Sunset', 'Marina Luxury Cruise'],
    accentColor: '#f43f5e', // rose
    glowClass: 'shadow-[0_0_25px_rgba(244,63,94,0.15)] border-rose-500/45'
  },
  {
    id: 'kerala',
    name: 'Kerala',
    title: 'Emerald Palms & Houseboat Solitude',
    tagline: 'GOD\'S OWN HOUSEBOATS',
    image: '/images/kerala_houseboat_1779521772928.png',
    soundType: 'waves' as const,
    subOverlay: 'kerala' as const,
    cameraSetup: 'CAM E // SENSOR 05 // ALLEPPEY DOCK',
    focalLength: '35mm f/1.4 Cine Prime',
    iso: '160',
    shutter: '1/200s',
    journal: 'Drifting down the quiet palm-fringed backwaters. The gentle patter of warm rain on the woven bamboo roof of our houseboat. Local life unfolds on narrow strips of land. Spices, coconut trees, and time moving at a crawl.',
    details: ['Alleppey Backwaters', 'Munnar Tea Slopes', 'Kovalam Beach Shore'],
    accentColor: '#a78bfa', // violet
    glowClass: 'shadow-[0_0_25px_rgba(167,139,250,0.15)] border-violet-400/45'
  }
];

export default function CinematicShowreel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [grading, setGrading] = useState<'natural' | 'dawn' | 'golden' | 'midnight'>('natural');
  const [exposure, setExposure] = useState(100); 
  const [saturation, setSaturation] = useState(100); 
  const [widescreen, setWidescreen] = useState(true);
  
  // Custom Slider Overlays for Cinematic Feel
  const [grainOpacity, setGrainOpacity] = useState(15); // film grain density (0% to 50%)
  const [vignetteStrength, setVignetteStrength] = useState(45); // lens vignette falloff (0% to 100%)
  
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [timecode, setTimecode] = useState("00:12:00:00");
  const [isHovered, setIsHovered] = useState(false);
  const [batteryValue, setBatteryValue] = useState(98);

  const activeDest = CINEMATIC_DESTINATIONS[activeIndex];
  const synthRef = useRef<AmbientSoundscapeSynth | null>(null);

  // Initialize Synth
  useEffect(() => {
    synthRef.current = new AmbientSoundscapeSynth();
    return () => {
      synthRef.current?.stop();
    };
  }, []);

  // Update soundscape when active index or sound toggle triggers
  useEffect(() => {
    if (isPlayingSound && synthRef.current) {
      synthRef.current.start(activeDest.soundType, volume);
      if (activeDest.subOverlay) {
        synthRef.current.triggerSubOverlays(activeDest.subOverlay);
      }
    } else {
      synthRef.current?.stop();
    }
  }, [activeIndex, isPlayingSound]);

  // Adjust volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    synthRef.current?.setVolume(vol);
  };

  // Toggle sound
  const toggleSound = () => {
    setIsPlayingSound(!isPlayingSound);
  };

  // Reset controls
  const handleResetFilters = () => {
    setGrading('natural');
    setExposure(100);
    setSaturation(100);
    setGrainOpacity(15);
    setVignetteStrength(45);
  };

  // Live timecode frame increment
  useEffect(() => {
    let frame = 0;
    let sec = 0;
    let min = 12;
    let hr = 0;
    const interval = setInterval(() => {
      frame += 4;
      if (frame >= 60) {
        frame = 0;
        sec += 1;
        if (sec >= 60) {
          sec = 0;
          min += 1;
          if (min >= 60) {
            min = 0;
            hr += 1;
          }
        }
      }
      const p = (n: number) => String(n).padStart(2, '0');
      setTimecode(`${p(hr)}:${p(min)}:${p(sec)}:${p(frame)}`);
    }, 66);

    return () => clearInterval(interval);
  }, []);

  // Slow battery simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryValue((prev) => (prev > 1 ? prev - 1 : 99));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Compute CSS filter structure
  const filterString = useMemo(() => {
    let style = "";
    if (grading === 'dawn') {
      style += "sepia(0.22) saturate(1.15) hue-rotate(-15deg) contrast(0.95) ";
    } else if (grading === 'golden') {
      style += "sepia(0.4) saturate(1.7) contrast(1.08) brightness(0.93) ";
    } else if (grading === 'midnight') {
      style += "contrast(1.22) brightness(0.35) saturate(0.65) hue-rotate(180deg) ";
    }
    
    style += `brightness(${exposure / 100}) saturate(${saturation / 100})`;
    return style;
  }, [grading, exposure, saturation]);

  // Accent color variables for theme adaptive layouts
  const accentColor = activeDest.accentColor;

  return (
    <section id="cinematic-showreel" className="relative py-16 lg:py-24 bg-slate-950 text-white overflow-hidden border-y border-slate-900">
      
      {/* Dynamic CSS Styling Injector for unique modular keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes dust-drift {
          0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.35; }
          90% { opacity: 0.35; }
          100% { transform: translate(120px, -120px) rotate(180deg); opacity: 0; }
        }
        @keyframes scratch-flash-1 {
          0%, 100% { opacity: 0; left: 20%; }
          4% { opacity: 0.25; left: 24%; }
          5% { opacity: 0; }
          45% { opacity: 0; }
          46% { opacity: 0.2; left: 74%; }
          47% { opacity: 0; }
        }
        @keyframes scratch-flash-2 {
          0%, 100% { opacity: 0; left: 45%; }
          18% { opacity: 0.3; left: 42%; }
          19% { opacity: 0; }
          75% { opacity: 0; }
          76% { opacity: 0.15; left: 18%; }
          77% { opacity: 0; }
        }
        .dust-spec {
          position: absolute;
          width: 3px;
          height: 3px;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          pointer-events: none;
          z-index: 15;
          animation: dust-drift 6s linear infinite;
        }
        .scratch-line-1 {
          position: absolute;
          top: 0; bottom: 0; width: 1px;
          background: rgba(255, 255, 255, 0.15);
          pointer-events: none;
          z-index: 15;
          animation: scratch-flash-1 8s steps(1) infinite;
        }
        .scratch-line-2 {
          position: absolute;
          top: 0; bottom: 0; width: 1px;
          background: rgba(255, 255, 255, 0.12);
          pointer-events: none;
          z-index: 15;
          animation: scratch-flash-2 12s steps(1) infinite;
        }
        .vignette-shadow {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 14;
          mix-blend-mode: multiply;
          transition: background 0.3s ease;
        }
        .film-noise-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 13;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='noise'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></svg>");
          mix-blend-mode: overlay;
          will-change: opacity;
        }
      `}} />

      {/* Global Backdrop atmospheric gradient glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(13,148,136,0.1),transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-cyan-500/5 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-amber-500/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] text-cyan-400 font-black uppercase mb-3">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              // IMMERSIVE EXPERIENTIAL SHOWREEL v2
            </div>
            <h2 className="font-display text-4xl lg:text-6xl font-black tracking-tight uppercase leading-none">
              Explore Destinations <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-400 to-amber-300 bg-clip-text text-transparent">Cinematic Mode</span>
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
              Step into our experiential dashboard. Adjust real-time sliders for **lens vignetting** and **film grain**, preset grading filters, or interact with realistic synthesized wind, coastal swells, rain patterns, and train chimes.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleResetFilters}
              className="px-4 py-2.5 rounded-full border border-slate-800 bg-slate-900/30 text-xs font-mono font-bold tracking-wider text-slate-300 hover:text-white hover:border-slate-700 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Grading
            </button>
            <button 
              onClick={() => setWidescreen(!widescreen)}
              className={`px-4.5 py-2.5 rounded-full border text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 flex items-center gap-2 select-none shrink-0 ${
                widescreen 
                  ? 'border-cyan-400/50 bg-cyan-400/10 text-cyan' 
                  : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-white'
              }`}
            >
              <Camera className="w-4 h-4" />
              Widescreen: {widescreen ? '2.39:1 CINEMA' : '16:9 FLAT'}
            </button>
          </div>
        </div>

        {/* Main Workspace Interface */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Vertical Film Strip Select (3 cols) */}
          <div className="lg:col-span-3 flex lg:flex-col gap-4 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-none snap-x snap-mandatory">
            <div className="hidden lg:block text-[10px] font-mono font-black tracking-widest text-slate-500 uppercase mb-2">// 35MM REELS STRIP</div>
            
            {CINEMATIC_DESTINATIONS.map((dest, idx) => {
              const isActive = activeIndex === idx;
              return (
                <button
                  key={dest.id}
                  onClick={() => {
                    setActiveIndex(idx);
                    if (document.startViewTransition) {
                      document.startViewTransition(() => {});
                    }
                  }}
                  className={`relative flex-shrink-0 w-[240px] lg:w-full p-4 rounded-2xl text-left border transition-all duration-500 overflow-hidden flex items-center gap-4 snap-center select-none group cursor-pointer ${
                    isActive 
                      ? 'bg-slate-900/20 shadow-2xl' 
                      : 'border-slate-850 bg-slate-950/40 hover:border-slate-800 hover:bg-slate-900/10'
                  }`}
                  style={{
                    borderColor: isActive ? accentColor : undefined
                  }}
                >
                  {/* Glowing active notch indicator */}
                  {isActive && (
                    <div className="absolute top-0 bottom-0 left-0 w-1 rounded-r-md" style={{ backgroundColor: accentColor }} />
                  )}

                  {/* Left numbering */}
                  <div className="font-mono text-xs font-black" style={{ color: isActive ? accentColor : '#475569' }}>
                    0{idx + 1}
                  </div>

                  {/* Thumbnail container */}
                  <div className="w-12 h-16 rounded-lg overflow-hidden shrink-0 bg-slate-900 relative border border-slate-800/80">
                    <img 
                      src={dest.image} 
                      alt={dest.name} 
                      className={`w-full h-full object-cover transition-transform duration-700 ${isActive ? 'scale-115' : 'group-hover:scale-105'}`}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/15" />
                  </div>

                  {/* Text details */}
                  <div className="min-w-0">
                    <div className="text-[9px] font-mono tracking-widest font-extrabold text-slate-500 uppercase">{dest.tagline}</div>
                    <div className="text-sm font-bold text-white mt-0.5 truncate">{dest.name}</div>
                    <div className="text-[9px] text-slate-400 truncate mt-1 flex items-center gap-1 font-mono">
                      <MapPin className="w-3 h-3 shrink-0" style={{ color: accentColor }} />
                      {dest.soundType === 'wind' ? 'Alpine hum' : dest.soundType === 'waves' ? 'Coastal swells' : 'Resonant bells'}
                    </div>
                  </div>

                  {/* Dynamic background atmospheric scanline pulse */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none opacity-40" />
                  )}
                </button>
              );
            })}
          </div>

          {/* RIGHT COLUMN: Cinematic Theater Viewport & Panel (9 cols) */}
          <div className="lg:col-span-9 flex flex-col gap-6 w-full">
            
            {/* 1. Viewport Layer (with Film noise, scratches, vignette filters) */}
            <div 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className={`relative w-full aspect-video rounded-3xl overflow-hidden border bg-black shadow-2xl transition-all duration-500 group ${activeDest.glowClass}`}
            >
              
              {/* Dynamic Widescreen Letterbox top/bottom bars */}
              <div className={`absolute inset-x-0 top-0 bg-slate-950 z-20 pointer-events-none transition-all duration-500 ${widescreen ? 'h-[10%]' : 'h-0'}`} />
              <div className={`absolute inset-x-0 bottom-0 bg-slate-950 z-20 pointer-events-none transition-all duration-500 ${widescreen ? 'h-[10%]' : 'h-0'}`} />

              {/* [NEW FILM EFFECT OVERLAYS] */}
              {/* Adjustable Film Grain layer */}
              <div className="film-noise-overlay" style={{ opacity: grainOpacity / 100 }} />
              
              {/* Dynamic Lens Vignette shadow overlay */}
              <div 
                className="vignette-shadow" 
                style={{ 
                  background: `radial-gradient(circle at center, transparent ${80 - vignetteStrength * 0.4}%, rgba(2, 6, 23, ${vignetteStrength / 100}) 100%)` 
                }} 
              />

              {/* Floating dust specifications (simulating 35mm projector particles) */}
              <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
                <div className="dust-spec" style={{ top: '15%', left: '10%', animationDelay: '0s', animationDuration: '7s' }} />
                <div className="dust-spec" style={{ top: '65%', left: '80%', animationDelay: '1.5s', animationDuration: '9s', width: '2px', height: '2px' }} />
                <div className="dust-spec" style={{ top: '40%', left: '30%', animationDelay: '3.2s', animationDuration: '8s' }} />
                <div className="dust-spec" style={{ top: '75%', left: '15%', animationDelay: '0.8s', animationDuration: '6s', width: '4px', height: '4px' }} />
                <div className="dust-spec" style={{ top: '25%', left: '60%', animationDelay: '2.5s', animationDuration: '10s' }} />
                
                {/* Randomly flashing vertical scratch lines */}
                <div className="scratch-line-1" />
                <div className="scratch-line-2" />
              </div>

              {/* Ken Burns zooming photography backdrop */}
              <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-slate-950">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeDest.id}
                    src={activeDest.image}
                    alt={activeDest.name}
                    initial={{ scale: 1.15, opacity: 0.25, filter: 'blur(12px)' }}
                    animate={{ 
                      scale: isHovered ? 1.025 : 1.055, 
                      opacity: 1, 
                      filter: 'blur(0px)' 
                    }}
                    exit={{ scale: 1.15, opacity: 0.25, filter: 'blur(12px)' }}
                    transition={{ 
                      duration: 1.2, 
                      ease: [0.16, 1, 0.3, 1],
                      scale: { duration: 18, ease: 'easeOut', repeat: Infinity, repeatType: 'reverse' }
                    }}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ filter: filterString }}
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/20 z-[1]" />
              </div>

              {/* HUD Focus Grid Overlays */}
              <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                <svg className="w-16 h-16 opacity-35 text-white/90" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.1">
                  <circle cx="50" cy="50" r="45" strokeDasharray="3, 3" />
                  <line x1="50" y1="42" x2="50" y2="58" />
                  <line x1="42" y1="50" x2="58" y2="50" />
                </svg>
                <div className="absolute top-8 left-8 w-4 h-4 border-t border-l border-white/25" />
                <div className="absolute top-8 right-8 w-4 h-4 border-t border-r border-white/25" />
                <div className="absolute bottom-8 left-8 w-4 h-4 border-b border-l border-white/25" />
                <div className="absolute bottom-8 right-8 w-4 h-4 border-b border-r border-white/25" />
              </div>

              {/* Technical timecode metrics & battery specs */}
              <div className="absolute inset-0 z-10 p-6 flex flex-col justify-between pointer-events-none text-white/90 text-[10px] font-mono tracking-widest">
                <div className="flex items-start justify-between w-full">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-90" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600" />
                      </span>
                      <span className="font-extrabold text-[10.5px] text-white">LIVE REC // 1080p 60fps</span>
                    </div>
                    <div className="text-white/50">{activeDest.cameraSetup}</div>
                  </div>
                  <div className="text-right flex flex-col gap-0.5 text-white/85">
                    <div>LENS: {activeDest.focalLength}</div>
                    <div className="text-white/50">ISO {activeDest.iso} // S {activeDest.shutter}</div>
                  </div>
                </div>

                <div className="flex items-end justify-between w-full">
                  <div className="flex items-center gap-4 text-white/60">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-2.5 rounded border border-white/40 p-0.5 flex items-center">
                        <div className="h-full bg-emerald-400 rounded-sm" style={{ width: `${batteryValue}%` }} />
                      </div>
                      <span className="font-bold">{batteryValue}%</span>
                    </div>
                    <div>CAM SENSOR DIRECT</div>
                  </div>
                  <div className="text-right text-[11px] font-bold text-white bg-slate-950/80 px-2.5 py-1 rounded border border-white/10 backdrop-blur-md">
                    {timecode}
                  </div>
                </div>
              </div>

              {/* TRANSFUSING EXPLORER LOG (Translucent Diary Card) */}
              <div className="absolute bottom-10 left-6 z-20 max-w-xs sm:max-w-md pointer-events-auto">
                <motion.div 
                  key={activeDest.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="glass p-4 sm:p-5 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-lg flex gap-3 relative overflow-hidden"
                >
                  <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center bg-white/5 border border-white/10" style={{ color: accentColor }}>
                    <Compass className="w-5 h-5 animate-spin-slow" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-black">{activeDest.tagline}</div>
                    <h4 className="font-display font-black text-white text-sm sm:text-base mt-0.5">{activeDest.title}</h4>
                    <p className="font-serif italic text-xs leading-relaxed text-slate-300 mt-2 tracking-wide pl-2 border-l" style={{ borderLeftColor: accentColor }}>
                      "{activeDest.journal}"
                    </p>
                  </div>
                </motion.div>
              </div>

            </div>

            {/* 2. Control adjustments & Audio Panel */}
            <div className="grid md:grid-cols-12 gap-6">
              
              {/* Synthesized Soundscape controller (5 cols) */}
              <div className="md:col-span-5 glass p-5 rounded-3xl border border-slate-800/80 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" style={{ color: accentColor }} />
                    <span className="font-display font-bold text-xs uppercase tracking-wider text-slate-200">Soundscape Generator</span>
                  </div>
                  <div className="text-[8px] font-mono text-slate-500 font-bold uppercase">Dynamic Synthesis</div>
                </div>

                <div className="flex items-center gap-4 py-2 px-3.5 rounded-2xl bg-slate-950/80 border border-slate-900/60">
                  <button 
                    onClick={toggleSound}
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg cursor-pointer transition-all duration-300 hover:scale-105"
                    style={{
                      background: isPlayingSound ? `linear-gradient(135deg, ${accentColor} 0%, rgba(15, 23, 42, 0.9) 100%)` : 'rgba(15, 23, 42, 0.6)',
                      border: `1px solid ${isPlayingSound ? accentColor : 'rgba(255,255,255,0.06)'}`,
                      color: isPlayingSound ? '#ffffff' : accentColor,
                      boxShadow: isPlayingSound ? `0 8px 20px -4px ${accentColor}40` : undefined
                    }}
                    title={isPlayingSound ? 'Mute' : 'Play Soundscape'}
                  >
                    {isPlayingSound ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">
                      {isPlayingSound ? `Synthesizing soundbed...` : `Audio engine standby`}
                    </div>
                    <div className="text-[9.5px] text-slate-400 truncate mt-0.5 font-mono">
                      {activeDest.soundType === 'wind' 
                        ? 'Lowpass hum + gust sweeps' 
                        : activeDest.soundType === 'waves' 
                          ? `Slow LFO ocean swells` 
                          : 'Chord-frequencies bell chime'}
                      {activeDest.subOverlay && isPlayingSound && (
                        <span className="block text-[8px] text-cyan-400 font-black tracking-tighter uppercase mt-0.5">
                          + Overlay: {activeDest.subOverlay === 'kerala' ? 'Tropical rain clicks' : 'Mangrove cricket pulses'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Theme-adaptive bouncing audio visualizer */}
                <div className="h-6 flex items-center gap-1.5 justify-center rounded-xl bg-slate-950/40 p-2 overflow-hidden">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={isPlayingSound ? {
                        height: [4, 15 + Math.random() * 8, 4],
                      } : { height: 4 }}
                      transition={isPlayingSound ? {
                        repeat: Infinity,
                        duration: 0.5 + i * 0.04,
                        ease: 'easeInOut'
                      } : {}}
                      className="w-1 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    />
                  ))}
                </div>

                {/* Volume bar */}
                <div className="flex items-center gap-3">
                  {volume === 0 ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4" style={{ color: accentColor }} />}
                  <input
                    type="range"
                    min="0"
                    max="0.8"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="flex-1 accent-cyan h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    style={{ ['--thumb-color' as any]: accentColor }}
                  />
                  <span className="text-[10px] font-mono text-slate-400 w-8 text-right font-bold">
                    {Math.round(volume * 125)}%
                  </span>
                </div>
              </div>

              {/* Adjustments Panel (7 cols) */}
              <div className="md:col-span-7 glass p-5 rounded-3xl border border-slate-800/80 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                    <span className="font-display font-bold text-xs uppercase tracking-wider text-slate-200">Director Filter Suite</span>
                  </div>
                  <div className="text-[8px] font-mono text-slate-500 font-bold uppercase">Image Grading</div>
                </div>

                {/* Preset Grade Selectors */}
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'natural', label: 'Natural', icon: Eye, color: 'hover:border-slate-450 hover:text-white' },
                    { id: 'dawn', label: 'Dawn', icon: Sunrise, color: 'hover:border-rose-400 hover:text-rose-300 text-rose-300' },
                    { id: 'golden', label: 'Golden Hour', icon: Sun, color: 'hover:border-amber-400 hover:text-amber-300 text-amber-300' },
                    { id: 'midnight', label: 'Midnight', icon: Moon, color: 'hover:border-indigo-400 hover:text-indigo-300 text-indigo-300' }
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setGrading(preset.id as any)}
                      className={`py-2 rounded-xl text-[10px] font-bold tracking-wider uppercase border transition-all duration-300 flex flex-col items-center justify-center gap-1 select-none cursor-pointer ${
                        grading === preset.id
                          ? 'border-amber-400 bg-amber-400/15 text-amber-300 shadow-md'
                          : 'border-slate-850 bg-slate-950/50 text-slate-400 ' + preset.color
                      }`}
                    >
                      <preset.icon className="w-4 h-4" />
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Adjustments Fine-Tuning Sliders */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-2">
                  
                  {/* Saturation */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-450 font-bold uppercase">
                      <span>Saturation</span>
                      <span className="text-slate-300 font-black">{saturation}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={saturation}
                      onChange={(e) => setSaturation(parseInt(e.target.value))}
                      className="accent-amber-400 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Exposure */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-450 font-bold uppercase">
                      <span>Exposure</span>
                      <span className="text-slate-300 font-black">{exposure}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={exposure}
                      onChange={(e) => setExposure(parseInt(e.target.value))}
                      className="accent-amber-400 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Vignette Strength */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-450 font-bold uppercase">
                      <span>Lens Vignette</span>
                      <span className="text-slate-300 font-black">{vignetteStrength}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={vignetteStrength}
                      onChange={(e) => setVignetteStrength(parseInt(e.target.value))}
                      className="accent-amber-400 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Film Grain Opacity */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-450 font-bold uppercase">
                      <span>Film Grain</span>
                      <span className="text-slate-300 font-black">{grainOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={grainOpacity}
                      onChange={(e) => setGrainOpacity(parseInt(e.target.value))}
                      className="accent-amber-400 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                </div>

                {/* Details Footer */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 gap-4">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {activeDest.details.map((det) => (
                      <span key={det} className="px-2.5 py-1 rounded-full bg-slate-950/70 border border-slate-900 font-bold text-[9px] text-slate-400">// {det}</span>
                    ))}
                  </div>
                  <a href="#plans" className="hover:text-white font-bold transition-all flex items-center gap-0.5 text-[11px] shrink-0 uppercase tracking-widest font-mono" style={{ color: accentColor }}>
                    Plan Route <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
