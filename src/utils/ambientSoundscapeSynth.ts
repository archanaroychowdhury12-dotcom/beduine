export type SoundscapeType = 'wind' | 'waves' | 'chimes';
export type SubOverlayType = 'sundarbans' | 'kerala';

type TimerId = number;

const CHIME_FREQUENCIES = [392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];

export class AmbientSoundscapeSynth {
  private ctx: AudioContext | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private gainNode: GainNode | null = null;
  private masterVolume = 0.45;
  private activeNodes: AudioNode[] = [];
  private activeSources: AudioScheduledSourceNode[] = [];
  private oscillationTimer: TimerId | null = null;
  private subTimer1: TimerId | null = null;
  private subTimer2: TimerId | null = null;

  start(type: SoundscapeType, volume: number) {
    this.stop();
    this.masterVolume = volume;

    const ctx = this.ensureContext();
    if (!ctx) return;

    const gainNode = this.trackNode(ctx.createGain());
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.connect(ctx.destination);
    this.gainNode = gainNode;

    const filterNode = this.trackNode(ctx.createBiquadFilter());
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(400, ctx.currentTime);
    filterNode.Q.setValueAtTime(2.0, ctx.currentTime);
    filterNode.connect(gainNode);
    this.filterNode = filterNode;

    this.startNoiseBed(ctx, filterNode);
    gainNode.gain.linearRampToValueAtTime(this.masterVolume, ctx.currentTime + 1.2);

    if (type === 'wind') {
      this.startWindBed();
    } else if (type === 'waves') {
      this.startWaveBed();
    } else {
      this.startChimeBed();
    }
  }

  triggerSubOverlays(type: SubOverlayType) {
    this.stopSubOverlays();
    if (!this.ctx || !this.gainNode) return;

    if (type === 'sundarbans') {
      const playCricketChirp = () => {
        if (!this.ctx || !this.gainNode) return;
        const now = this.ctx.currentTime;
        const chirpOsc = this.trackSource(this.ctx.createOscillator());
        const chirpGain = this.trackNode(this.ctx.createGain());

        chirpOsc.type = 'sine';
        chirpOsc.frequency.setValueAtTime(3400 + Math.random() * 180, now);
        chirpGain.gain.setValueAtTime(0, now);

        for (let i = 0; i < 5; i += 1) {
          const t = now + i * 0.08;
          chirpGain.gain.setValueAtTime(this.masterVolume * 0.035, t);
          chirpGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);
        }

        chirpOsc.connect(chirpGain);
        chirpGain.connect(this.gainNode);
        chirpOsc.start(now);
        chirpOsc.stop(now + 0.5);
      };

      playCricketChirp();
      this.subTimer1 = window.setInterval(playCricketChirp, 4200);
      return;
    }

    const playRaindrops = () => {
      if (!this.ctx || !this.gainNode) return;
      const now = this.ctx.currentTime;

      for (let i = 0; i < 8; i += 1) {
        const dropTime = now + Math.random() * 1.8;
        const dropOsc = this.trackSource(this.ctx.createOscillator());
        const dropGain = this.trackNode(this.ctx.createGain());

        dropOsc.type = 'triangle';
        dropOsc.frequency.setValueAtTime(1000 + Math.random() * 650, dropTime);
        dropGain.gain.setValueAtTime(this.masterVolume * 0.02, dropTime);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, dropTime + 0.025);

        dropOsc.connect(dropGain);
        dropGain.connect(this.gainNode);
        dropOsc.start(dropTime);
        dropOsc.stop(dropTime + 0.03);
      }
    };

    playRaindrops();
    this.subTimer2 = window.setInterval(playRaindrops, 2400);
  }

  setVolume(volume: number) {
    this.masterVolume = volume;
    if (!this.ctx || !this.gainNode) return;

    const now = this.ctx.currentTime;
    this.gainNode.gain.cancelScheduledValues(now);
    this.gainNode.gain.setTargetAtTime(volume, now, 0.05);
  }

  suspend() {
    if (this.ctx?.state === 'running') {
      void this.ctx.suspend();
    }
  }

  resume() {
    if (this.ctx?.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  stop() {
    this.stopSubOverlays();
    this.clearOscillationTimer();

    for (const source of this.activeSources) {
      try {
        source.stop();
      } catch {
        // Already stopped or scheduled in the past.
      }
    }

    for (const node of this.activeNodes) {
      try {
        node.disconnect();
      } catch {
        // Already disconnected.
      }
    }

    this.activeSources = [];
    this.activeNodes = [];
    this.gainNode = null;
    this.filterNode = null;
  }

  dispose() {
    this.stop();
    if (!this.ctx) return;

    void this.ctx.close();
    this.ctx = null;
  }

  private ensureContext() {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return null;
      this.ctx = new AudioContextClass();
    }

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }

    return this.ctx;
  }

  private startNoiseBed(ctx: AudioContext, destination: AudioNode) {
    const bufferSize = ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i += 1) {
      output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.trackSource(ctx.createBufferSource());
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;
    noiseSource.connect(destination);
    noiseSource.start(0);
  }

  private startWindBed() {
    if (!this.ctx || !this.filterNode || !this.gainNode) return;

    this.filterNode.type = 'bandpass';
    this.filterNode.Q.setValueAtTime(6.0, this.ctx.currentTime);

    let phase = 0;
    this.oscillationTimer = window.setInterval(() => {
      if (!this.ctx || !this.filterNode || !this.gainNode) return;

      phase += 0.1;
      const now = this.ctx.currentTime;
      const baseFreq = 350 + Math.sin(phase) * 140 + Math.sin(phase * 0.35) * 70;
      const gustVolume = this.masterVolume * (0.55 + Math.sin(phase) * 0.35);

      this.filterNode.frequency.setTargetAtTime(baseFreq, now, 0.08);
      this.gainNode.gain.setTargetAtTime(gustVolume, now, 0.1);
    }, 180);
  }

  private startWaveBed() {
    if (!this.ctx || !this.filterNode || !this.gainNode) return;

    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(200, this.ctx.currentTime);
    this.filterNode.Q.setValueAtTime(1.0, this.ctx.currentTime);

    let phase = 0;
    this.oscillationTimer = window.setInterval(() => {
      if (!this.ctx || !this.gainNode || !this.filterNode) return;

      phase += 0.035;
      const now = this.ctx.currentTime;
      const swell = Math.sin(phase);
      const swellVolume = this.masterVolume * (0.35 + (swell + 1) * 0.32);
      const sweepFreq = 160 + (swell + 1) * 120;

      this.gainNode.gain.setTargetAtTime(swellVolume, now, 0.18);
      this.filterNode.frequency.setTargetAtTime(sweepFreq, now, 0.16);
    }, 260);
  }

  private startChimeBed() {
    if (!this.ctx || !this.filterNode || !this.gainNode) return;

    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(1200, this.ctx.currentTime);

    this.playChimeNode();
    this.oscillationTimer = window.setInterval(() => this.playChimeNode(), 3200);
    this.startTrainRumble();
  }

  private playChimeNode() {
    if (!this.ctx || !this.gainNode) return;

    const now = this.ctx.currentTime;
    const chimeFreq = CHIME_FREQUENCIES[Math.floor(Math.random() * CHIME_FREQUENCIES.length)];
    const chimeOsc = this.trackSource(this.ctx.createOscillator());
    const overtoneOsc = this.trackSource(this.ctx.createOscillator());
    const chimeGain = this.trackNode(this.ctx.createGain());
    const overtoneGain = this.trackNode(this.ctx.createGain());

    chimeOsc.type = 'sine';
    chimeOsc.frequency.setValueAtTime(chimeFreq, now);
    overtoneOsc.type = 'sine';
    overtoneOsc.frequency.setValueAtTime(chimeFreq * 2.016, now);

    chimeGain.gain.setValueAtTime(0, now);
    chimeGain.gain.linearRampToValueAtTime(this.masterVolume * 0.3, now + 0.03);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.1);

    overtoneGain.gain.setValueAtTime(0, now);
    overtoneGain.gain.linearRampToValueAtTime(this.masterVolume * 0.12, now + 0.03);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

    chimeOsc.connect(chimeGain);
    overtoneOsc.connect(overtoneGain);
    chimeGain.connect(this.gainNode);
    overtoneGain.connect(this.gainNode);

    chimeOsc.start(now);
    overtoneOsc.start(now);
    chimeOsc.stop(now + 3.2);
    overtoneOsc.stop(now + 1.8);
  }

  private startTrainRumble() {
    if (!this.ctx || !this.gainNode) return;

    const trainOsc = this.trackSource(this.ctx.createOscillator());
    const trainGain = this.trackNode(this.ctx.createGain());
    const modOsc = this.trackSource(this.ctx.createOscillator());
    const modGain = this.trackNode(this.ctx.createGain());

    trainOsc.type = 'triangle';
    trainOsc.frequency.setValueAtTime(36, this.ctx.currentTime);
    modOsc.type = 'sawtooth';
    modOsc.frequency.setValueAtTime(3.4, this.ctx.currentTime);
    modGain.gain.setValueAtTime(0.009, this.ctx.currentTime);
    trainGain.gain.setValueAtTime(this.masterVolume * 0.14, this.ctx.currentTime);

    modOsc.connect(modGain);
    modGain.connect(trainGain.gain);
    trainOsc.connect(trainGain);
    trainGain.connect(this.gainNode);
    trainOsc.start(0);
    modOsc.start(0);
  }

  private stopSubOverlays() {
    if (this.subTimer1) {
      window.clearInterval(this.subTimer1);
      this.subTimer1 = null;
    }

    if (this.subTimer2) {
      window.clearInterval(this.subTimer2);
      this.subTimer2 = null;
    }
  }

  private clearOscillationTimer() {
    if (!this.oscillationTimer) return;

    window.clearInterval(this.oscillationTimer);
    this.oscillationTimer = null;
  }

  private trackNode<T extends AudioNode>(node: T) {
    this.activeNodes.push(node);
    return node;
  }

  private trackSource<T extends AudioScheduledSourceNode>(source: T) {
    this.activeSources.push(source);
    this.trackNode(source);
    return source;
  }
}
