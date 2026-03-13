const GameState = {
  currentScene: 'opening',
  chapter: 1,
  sequenceIndex: 0,
  date: '1999.7.13',
  dayOfWeek: '火曜日',
  temp: 37.5,
  time: 'evening',
  ap: 3,
  maxAp: 3,
  flags: {},
  player: null,
  party: [],
  inventory: [],
  memories: 327,
  logosBonus: 0,
  crystalBonus: 0,
  visitedScenes: {},
  dialogueHistory: [],
  battleCount: 0,
  choices: {},
  currentSequence: null,
  isPaused: false,
  isTransitioning: false,
  playTime: 0,
  cycleCount: 1,

  init() {
    this.player = JSON.parse(JSON.stringify(CHARACTERS.haku));
    this.party = [this.player];
    this.flags = {};
    this.visitedScenes = {};
    this.dialogueHistory = [];
    this.choices = {};
    this.sequenceIndex = 0;
    this.playTime = 0;
  },

  setFlag(f) {
    this.flags[f] = true;
  },

  hasFlag(f) {
    return !!this.flags[f];
  },

  addMemory() {
    this.memories++;
    this.player.deathCount = this.memories;
  },

  useAp(n) {
    this.ap = Math.max(0, this.ap - n);
  },

  restoreAp() {
    this.ap = this.maxAp;
  },

  setDate(d, dow, t) {
    this.date = d;
    if (dow) this.dayOfWeek = dow;
    if (t) this.temp = t;
  },

  addLogos(n) {
    this.player.logos = Math.min(this.player.maxLogos, this.player.logos + n);
  },

  spendLogos(n) {
    this.player.logos = Math.max(0, this.player.logos - n);
    return this.player.logos >= 0;
  },

  addCrystal(n) {
    this.player.crystal = Math.min(100, this.player.crystal + n);
  },

  getSequence() {
    if (!CHAPTER1.sequences[this.sequenceIndex]) return null;
    return CHAPTER1.sequences[this.sequenceIndex];
  },

  nextSequence() {
    this.sequenceIndex++;
    return this.getSequence();
  },

  findSequence(id) {
    for (let i = 0; i < CHAPTER1.sequences.length; i++) {
      if (CHAPTER1.sequences[i].id === id) return i;
    }
    return -1;
  },

  jumpTo(id) {
    let idx = this.findSequence(id);
    if (idx >= 0) {
      this.sequenceIndex = idx;
      return CHAPTER1.sequences[idx];
    }
    return null;
  }
};
