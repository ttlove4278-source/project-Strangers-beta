const CrystalSystem = {
  increase(char, amount) {
    char.crystal = Math.min(100, char.crystal + amount);
    if (char.crystal >= 100) this.triggerCrystallization(char);
  },

  decrease(char, amount) {
    char.crystal = Math.max(0, char.crystal - amount);
  },

  triggerCrystallization(char) {
    char.crystal = 100;
    char.crystallized = true;
  },

  otherInhibit(char, amount) {
    this.decrease(char, amount || 2);
  },

  checkStatus(char) {
    if (char.crystal >= 80) return 'critical';
    if (char.crystal >= 50) return 'danger';
    if (char.crystal >= 30) return 'warning';
    return 'stable';
  }
};
