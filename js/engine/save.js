const SaveManager = {
  prefix: 'ces_',

  save(slot) {
    let data = {
      chapter: GameState.chapter,
      sequenceIndex: GameState.sequenceIndex,
      date: GameState.date,
      dayOfWeek: GameState.dayOfWeek,
      temp: GameState.temp,
      time: GameState.time,
      ap: GameState.ap,
      flags: GameState.flags,
      player: GameState.player,
      memories: GameState.memories,
      visitedScenes: GameState.visitedScenes,
      choices: GameState.choices,
      playTime: GameState.playTime,
      cycleCount: GameState.cycleCount,
      timestamp: Date.now()
    };
    try {
      localStorage.setItem(this.prefix + 'slot_' + slot, JSON.stringify(data));
      return true;
    } catch(e) {
      return false;
    }
  },

  load(slot) {
    try {
      let raw = localStorage.getItem(this.prefix + 'slot_' + slot);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch(e) {
      return null;
    }
  },

  hasSave(slot) {
    return !!localStorage.getItem(this.prefix + 'slot_' + slot);
  },

  deleteSave(slot) {
    localStorage.removeItem(this.prefix + 'slot_' + slot);
  },

  applySave(data) {
    GameState.chapter = data.chapter;
    GameState.sequenceIndex = data.sequenceIndex;
    GameState.date = data.date;
    GameState.dayOfWeek = data.dayOfWeek;
    GameState.temp = data.temp;
    GameState.time = data.time;
    GameState.ap = data.ap;
    GameState.flags = data.flags || {};
    GameState.player = data.player;
    GameState.memories = data.memories;
    GameState.visitedScenes = data.visitedScenes || {};
    GameState.choices = data.choices || {};
    GameState.playTime = data.playTime || 0;
    GameState.cycleCount = data.cycleCount || 1;
  },

  autoSave() {
    this.save('auto');
  }
};
