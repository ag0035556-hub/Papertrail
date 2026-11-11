import { SoundEffectType } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.8;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Plays a designated sound effect matching journalistic events.
   */
  public playSoundEffect(type: SoundEffectType) {
    if (this.isMuted || type === 'none') return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      switch (type) {
        case 'paper-shuffle':
          this.playPaperShuffle();
          break;
        case 'marker-squeak':
          this.playMarkerSqueak();
          break;
        case 'typewriter':
          this.playTypewriterClick();
          break;
        case 'camera':
          this.playCameraShutter();
          break;
      }
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }

  /**
   * Realistic paper rustle / newspaper shuffle using filtered noise bursts
   */
  public playPaperShuffle() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.28; // ~280ms
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Create textured pinkish crackle noise simulating fibrous paper sliding
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      let sample = b0 + b1 + b2 + white * 0.5362;
      // occasional crisp paper fiber snap
      if (Math.random() < 0.02) {
        sample += (Math.random() - 0.5) * 2.2;
      }
      data[i] = sample * 0.15;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;

    // Bandpass filter to capture thin paper frequency range (800Hz - 4500Hz)
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400 + Math.random() * 600, now);
    filter.Q.setValueAtTime(1.8, now);

    const gain = this.ctx.createGain();
    const peak = 0.35 * this.volume;
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.exponentialRampToValueAtTime(peak, now + 0.04);
    gain.gain.linearRampToValueAtTime(peak * 0.6, now + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    source.start(now);
    source.stop(now + 0.28);
  }

  /**
   * Felt-tip chisel highlighter squeak against rough paper
   */
  public playMarkerSqueak() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    const startFreq = 2200 + Math.random() * 400;
    const endFreq = 1600 + Math.random() * 300;

    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.16);

    // Filter to soften the harshness of sawtooth into marker felt
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, now);

    const peak = 0.18 * this.volume;
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(peak, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  }

  /**
   * Vintage mechanical typewriter key strike
   */
  public playTypewriterClick() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Metallic hit oscillator
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);

    oscGain.gain.setValueAtTime(0.25 * this.volume, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);

    // Mechanical snap noise
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.06);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3 * this.volume, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    noise.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(now);
    noise.stop(now + 0.06);
  }

  /**
   * Vintage press camera shutter click
   */
  public playCameraShutter() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.08);

    gain.gain.setValueAtTime(0.3 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }
}

export const soundEngine = new SoundEngine();
