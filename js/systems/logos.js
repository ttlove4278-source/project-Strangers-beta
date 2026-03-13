const LogosSystem = {
  spend(char, amount) {
    char.logos = Math.max(0, char.logos - amount);
    return char.logos >= 0;
  },

  recover(char, amount) {
    char.logos = Math.min(char.maxLogos, char.logos + amount);
  },

  canUse(char, cost) {
    return char.logos >= cost;
  },

  sleepRecover(char) {
    this.recover(char, 4);
  },

  silenceRecover(char) {
    this.recover(char, 1);
  },

  debateReturn(char, spent) {
    this.recover(char, spent * 0.3);
  },

  contradictionBoost(char) {
    this.recover(char, char.maxLogos * 0.5);
    CrystalSystem.increase(char, 5);
  }
};
