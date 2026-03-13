const Game = {
  started: false,
  playTimer: null,

  async init() {
    AudioManager.init();
    await Opening.start();
    AudioManager.resume();
    AudioManager.startCicada();
    await Menu.show();
  },

  startChapter() {
    GameState.sequenceIndex = 0;
    this.startPlayTimer();
    this.processSequence();
  },

  startPlayTimer() {
    if (this.playTimer) clearInterval(this.playTimer);
    this.playTimer = setInterval(() => {
      GameState.playTime++;
    }, 1000);
  },

  async processSequence() {
    let seq = GameState.getSequence();
    if (!seq) {
      this.endGame();
      return;
    }

    GameState.currentSequence = seq;
    SaveManager.autoSave();

    switch (seq.type) {
      case 'poem':
        await PoemUI.show(seq.poem);
        this.advanceSequence();
        break;

      case 'dialogue':
        if (seq.location) {
          let loc = SCENES[seq.location];
          if (loc) GameState.time = seq.time || loc.time || 'day';
        }
        await DialogueSystem.start(seq);
        break;

      case 'calendar':
        await Calendar.show(seq);
        this.advanceSequence();
        break;

      case 'exploration':
        GameState.time = seq.time || 'day';
        await Exploration.start(seq);
        break;

      case 'battle':
        await BattleSystem.start(seq);
        break;

      case 'end_chapter':
        this.endChapter();
        break;

      default:
        this.advanceSequence();
    }
  },

  advanceSequence() {
    GameState.nextSequence();
    this.processSequence();
  },

  jumpToSequence(id) {
    let seq = GameState.jumpTo(id);
    if (seq) {
      this.processSequence();
    } else {
      this.advanceSequence();
    }
  },

  async endChapter() {
    HUD.hide();
    SaveManager.autoSave();

    let layer = document.getElementById('transition-layer');
    layer.style.transition = 'opacity 1s';
    layer.style.opacity = '1';
    layer.style.pointerEvents = 'auto';

    await Anim.wait(1500);

    layer.innerHTML = `
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center">
        <div style="font-family:var(--font-serif);font-size:20px;color:var(--text-primary);letter-spacing:8px;margin-bottom:20px">第一卷 完</div>
        <div style="font-family:var(--font-serif);font-size:14px;color:var(--text-secondary);letter-spacing:4px;margin-bottom:8px">世纪末的异乡人</div>
        <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);letter-spacing:3px;margin-bottom:30px">THE STRANGER AT THE END OF THE CENTURY</div>
        <div style="width:40px;height:1px;background:var(--accent-heat);margin:0 auto 30px"></div>
        <div style="font-family:var(--font-mono);font-size:10px;color:var(--text-muted);letter-spacing:2px;line-height:2.2">
          游戏时间: ${Math.floor(GameState.playTime/60)}分${GameState.playTime%60}秒<br>
          死亡次数: ${GameState.memories}<br>
          结晶化: ${GameState.player.crystal}%<br>
          战斗次数: ${GameState.battleCount}
        </div>
        <div style="margin-top:40px;font-family:var(--font-serif);font-size:12px;color:var(--text-muted);letter-spacing:3px;cursor:pointer" id="end-back">返回标题</div>
      </div>
    `;

    document.getElementById('end-back').addEventListener('click', async () => {
      layer.style.opacity = '0';
      layer.style.pointerEvents = 'none';
      await Anim.wait(1000);
      layer.innerHTML = '';
      Menu.show();
    });
  },

  endGame() {
    this.endChapter();
  }
};

window.addEventListener('load', () => {
  Game.init();
});
