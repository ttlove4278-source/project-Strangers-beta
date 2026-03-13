const AudioManager = {
  ctx: null,
  masterGain: null,
  cicadaNode: null,
  cicadaGain: null,
  enabled: true,

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.3;
      this.masterGain.connect(this.ctx.destination);
    } catch(e) {
      this.enabled = false;
    }
  },

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  },

  playTone(freq, duration, type, vol) {
    if (!this.enabled || !this.ctx) return;
    let osc = this.ctx.createOscillator();
    let gain = this.ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    gain.gain.value = vol || 0.1;
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  },

  playClick() {
    this.playTone(800, 0.05, 'square', 0.04);
  },

  playSelect() {
    this.playTone(600, 0.08, 'sine', 0.06);
    setTimeout(() => this.playTone(900, 0.08, 'sine', 0.05), 60);
  },

  playThesis() {
    this.playTone(120, 1.5, 'sine', 0.15);
    setTimeout(() => this.playTone(180, 1, 'sine', 0.1), 200);
    setTimeout(() => this.playTone(240, 0.8, 'triangle', 0.08), 500);
  },

  playDamage() {
    if (!this.enabled || !this.ctx) return;
    let bufSize = this.ctx.sampleRate * 0.15;
    let buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    let data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i/bufSize);
    let src = this.ctx.createBufferSource();
    let gain = this.ctx.createGain();
    src.buffer = buf;
    gain.gain.value = 0.08;
    src.connect(gain);
    gain.connect(this.masterGain);
    src.start();
  },

  playRewind() {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => this.playTone(400 - i*60, 0.2, 'sawtooth', 0.06), i*100);
    }
  },

  playHeal() {
    this.playTone(440, 0.3, 'sine', 0.06);
    setTimeout(() => this.playTone(554, 0.3, 'sine', 0.05), 150);
    setTimeout(() => this.playTone(659, 0.4, 'sine', 0.05), 300);
  },

  playCrystal() {
    for (let i = 0; i < 8; i++) {
      setTimeout(() => this.playTone(1200 + Math.random()*800, 0.4, 'sine', 0.03), i*80);
    }
  },

  startCicada() {
    if (!this.enabled || !this.ctx || this.cicadaNode) return;
    let bufSize = this.ctx.sampleRate * 2;
    let buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    let data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      let t = i / this.ctx.sampleRate;
      data[i] = (Math.random() * 0.5 + Math.sin(t * 4000) * 0.3 + Math.sin(t * 6800) * 0.2) * (0.5 + 0.5 * Math.sin(t * 3));
    }
    this.cicadaNode = this.ctx.createBufferSource();
    this.cicadaGain = this.ctx.createGain();
    this.cicadaNode.buffer = buf;
    this.cicadaNode.loop = true;
    this.cicadaGain.gain.value = 0.02;
    this.cicadaNode.connect(this.cicadaGain);
    this.cicadaGain.connect(this.masterGain);
    this.cicadaNode.start();
  },

  stopCicada() {
    if (this.cicadaNode) {
      this.cicadaNode.stop();
      this.cicadaNode = null;
    }
  },

  setCicadaVolume(v) {
    if (this.cicadaGain) this.cicadaGain.gain.value = v;
  }
};
