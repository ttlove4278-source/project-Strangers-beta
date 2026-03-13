const BattleSystem = {
  scene: null,
  player: null,
  enemy: null,
  turn: 'player',
  rewindsUsed: 0,
  maxRewinds: 3,
  battleOver: false,
  savedState: null,

  async start(data) {
    this.scene = document.getElementById('scene-battle');
    this.scene.innerHTML = '';
    this.player = JSON.parse(JSON.stringify(GameState.player));
    this.enemy = JSON.parse(JSON.stringify(ENEMIES[data.enemy]));
    this.turn = 'player';
    this.rewindsUsed = 0;
    this.maxRewinds = data.maxRewinds || 3;
    this.battleOver = false;
    this.savedState = null;

    HUD.hide();

    let introSeq = GameState.findSequence(data.id.replace('battle_','') + '_battle_intro');
    if (introSeq < 0) introSeq = GameState.findSequence('ch1_bentham_battle_intro');

    this.render();
    this.scene.classList.add('active');
    this.scene.style.opacity = '1';

    if (this.enemy.intro) {
      await this.showBattleMsg(this.enemy.intro.join('\n'), 3000);
    }

    this.saveState();
    this.playerTurn();
  },

  render() {
    this.scene.innerHTML = `
      <div class="btl-bg"></div>
      <div class="btl-heat"></div>
      <div class="btl-arena">
        <div class="btl-char" id="btl-player">
          <div class="btl-status">
            <div class="btl-name" style="color:${this.player.color}">${this.player.name}</div>
            <div class="btl-hp-bar"><div class="btl-hp-fill" id="btl-player-hp" style="width:${(this.player.hp/this.player.maxHp)*100}%"></div></div>
          </div>
          <div class="btl-portrait">
            <div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-end">
              <div style="width:22px;height:22px;border-radius:50%;background:${this.player.color}"></div>
              <div style="width:28px;height:52px;background:${this.player.color};clip-path:polygon(20% 0%,80% 0%,100% 100%,0% 100%);margin-top:4px"></div>
              <div style="display:flex;gap:3px;margin-top:2px;width:32px;height:60px"><div style="flex:1;background:${this.player.color};clip-path:polygon(15% 0%,85% 0%,70% 100%,30% 100%)"></div><div style="flex:1;background:${this.player.color};clip-path:polygon(15% 0%,85% 0%,70% 100%,30% 100%)"></div></div>
            </div>
          </div>
        </div>
        <div class="btl-vs">VS</div>
        <div class="btl-char" id="btl-enemy">
          <div class="btl-status">
            <div class="btl-name" style="color:${this.enemy.color}">${this.enemy.name}</div>
            <div class="btl-hp-bar"><div class="btl-hp-fill" id="btl-enemy-hp" style="width:${(this.enemy.hp/this.enemy.maxHp)*100}%"></div></div>
          </div>
          <div class="btl-portrait">
            <div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-end">
              <div style="width:22px;height:22px;border-radius:50%;background:${this.enemy.color}"></div>
              <div style="width:28px;height:52px;background:${this.enemy.color};clip-path:polygon(20% 0%,80% 0%,100% 100%,0% 100%);margin-top:4px"></div>
              <div style="display:flex;gap:3px;margin-top:2px;width:32px;height:60px"><div style="flex:1;background:${this.enemy.color};clip-path:polygon(15% 0%,85% 0%,70% 100%,30% 100%)"></div><div style="flex:1;background:${this.enemy.color};clip-path:polygon(15% 0%,85% 0%,70% 100%,30% 100%)"></div></div>
            </div>
          </div>
        </div>
      </div>
      <div class="btl-msg" id="btl-msg"></div>
      <div class="btl-thesis" id="btl-thesis">
        <div class="btl-thesis-text" id="btl-thesis-text"></div>
        <div class="btl-thesis-sig" id="btl-thesis-sig"></div>
      </div>
      <div class="btl-rewind" id="btl-rewind">
        <div class="btl-rewind-num" id="btl-rewind-num"></div>
        <div class="btl-rewind-txt">——回到三秒前</div>
      </div>
      <div class="btl-talk" id="btl-talk"></div>
      <div class="btl-result" id="btl-result"></div>
      <div class="btl-cmd-area">
        <div class="btl-info">
          <span>逻各斯: <span class="btl-logos-val" id="btl-logos">${this.player.logos.toFixed(1)}赫</span></span>
          <span>结晶化: <span class="btl-crystal-val" id="btl-crystal">${this.player.crystal}%</span></span>
          <span>记忆: <span class="btl-memory-val" id="btl-memory">第${GameState.memories}次</span></span>
        </div>
        <div class="btl-cmds" id="btl-cmds"></div>
      </div>
    `;

    this.renderCommands();
  },

  renderCommands() {
    let cmds = document.getElementById('btl-cmds');
    if (!cmds) return;
    cmds.innerHTML = '';

    let skills = this.player.skills.map(id => SKILLS[id]).filter(Boolean);

    skills.forEach(skill => {
      let canUse = skill.cost <= 0 || this.player.logos >= skill.cost;
      let btn = document.createElement('div');
      btn.className = 'btl-cmd' + (canUse ? '' : ' off');
      btn.innerHTML = `
        <div class="btl-cmd-name">${skill.name}</div>
        <div class="btl-cmd-sub">${skill.sub}</div>
        ${skill.cost > 0 ? `<div class="btl-cmd-cost">${skill.cost}赫</div>` : ''}
      `;
      btn.addEventListener('click', () => {
        if (!canUse || this.battleOver || this.turn !== 'player') return;
        this.executeSkill(skill);
      });
      cmds.appendChild(btn);
    });
  },

  saveState() {
    this.savedState = {
      playerHp: this.player.hp,
      playerLogos: this.player.logos,
      enemyHp: this.enemy.hp,
      enemyLogos: this.enemy.logos
    };
  },

  async executeSkill(skill) {
    this.turn = 'none';

    if (skill.type === 'talk') {
      await this.openTalk();
      return;
    }

    if (skill.type === 'silence') {
      await this.showBattleMsg('…………\n（什么都没有说。逻各斯回复了1赫。）', 1500);
      LogosSystem.silenceRecover(this.player);
      this.updateUI();
      await this.enemyTurn();
      return;
    }

    if (skill.type === 'quote') {
      LogosSystem.spend(this.player, skill.cost);
      AudioManager.playDamage();
      await this.showBattleMsg(skill.desc, 1200);
      await this.dealDamage(this.enemy, skill.power);
      this.updateUI();
      if (this.checkEnd()) return;
      await this.enemyTurn();
      return;
    }

    if (skill.type === 'thesis') {
      LogosSystem.spend(this.player, skill.cost);
      await this.thesisDeclaration(skill);
      await this.dealDamage(this.enemy, skill.power);
      this.updateUI();
      if (this.checkEnd()) return;
      await this.enemyTurn();
      return;
    }
  },

  async thesisDeclaration(skill) {
    let overlay = document.getElementById('btl-thesis');
    let textEl = document.getElementById('btl-thesis-text');
    let sigEl = document.getElementById('btl-thesis-sig');

    textEl.textContent = skill.declaration;
    sigEl.textContent = this.player.signature;

    Effects.screenFlash(80);
    AudioManager.playThesis();

    overlay.classList.add('active');
    await Anim.shake(this.scene);
    await Anim.wait(2000);
    overlay.classList.remove('active');
  },

  async dealDamage(target, amount) {
    let resolve = target === this.enemy ? this.player.stats.resolve : (this.enemy.stats?.resolve || 5);
    let dmg = Math.floor(amount * (0.8 + Math.random() * 0.4) * (resolve / 7));
    target.hp = Math.max(0, target.hp - dmg);

    let targetEl = target === this.enemy ? 'btl-enemy' : 'btl-player';
    let el = document.getElementById(targetEl);
    if (el) {
      let numEl = document.createElement('div');
      numEl.className = 'btl-dmg';
      numEl.textContent = dmg;
      numEl.style.left = '50%';
      numEl.style.top = '20%';
      el.appendChild(numEl);
      setTimeout(() => numEl.remove(), 1000);
    }

    AudioManager.playDamage();
    this.updateHP();
  },

  async enemyTurn() {
    if (this.battleOver) return;
    this.turn = 'enemy';
    await Anim.wait(800);

    let skills = this.enemy.skills;
    let skill = skills[Math.floor(Math.random() * skills.length)];

    await this.showBattleMsg(skill.msg, 1200);

    let dmg = Math.floor(skill.power * (0.8 + Math.random() * 0.4));
    this.player.hp = Math.max(0, this.player.hp - dmg);

    let el = document.getElementById('btl-player');
    if (el) {
      let numEl = document.createElement('div');
      numEl.className = 'btl-dmg';
      numEl.textContent = dmg;
      numEl.style.left = '50%';
      numEl.style.top = '20%';
      el.appendChild(numEl);
      setTimeout(() => numEl.remove(), 1000);
    }

    AudioManager.playDamage();
    await Anim.shake(this.scene);
    this.updateHP();
    this.updateUI();

    if (this.player.hp <= 0) {
      await this.playerDeath();
      return;
    }

    this.turn = 'player';
    this.saveState();
    this.renderCommands();
  },

  async playerDeath() {
    if (this.rewindsUsed < this.maxRewinds) {
      await this.rewind();
    } else {
      await this.showResult(false);
    }
  },

  async rewind() {
    this.rewindsUsed++;
    GameState.addMemory();

    let overlay = document.getElementById('btl-rewind');
    let numEl = document.getElementById('btl-rewind-num');

    AudioManager.playRewind();
    await Anim.vhsRewind(this.scene);

    numEl.textContent = `第 ${GameState.memories} 次`;
    overlay.classList.add('active');
    await Anim.wait(2000);
    overlay.classList.remove('active');

    CrystalSystem.increase(this.player, 2);

    if (this.savedState) {
      this.player.hp = this.savedState.playerHp;
      this.player.logos = this.savedState.playerLogos;
      this.enemy.hp = this.savedState.enemyHp;
      this.enemy.logos = this.savedState.enemyLogos;
    }

    this.updateHP();
    this.updateUI();
    this.turn = 'player';
    this.renderCommands();
  },

  async openTalk() {
    let overlay = document.getElementById('btl-talk');
    overlay.innerHTML = '';

    if (!this.enemy.talkOptions) {
      await this.showBattleMsg('对方没有回应。', 1000);
      this.turn = 'player';
      return;
    }

    this.enemy.talkOptions.forEach(opt => {
      let btn = document.createElement('div');
      btn.className = 'btl-talk-opt';
      btn.textContent = opt.text;
      btn.addEventListener('click', () => {
        AudioManager.playSelect();
        overlay.classList.remove('active');
        this.processTalk(opt);
      });
      overlay.appendChild(btn);
    });

    overlay.classList.add('active');
  },

  async processTalk(opt) {
    await this.showBattleMsg(opt.response, 2500);

    if (opt.effect === 'dmg') {
      await this.dealDamage(this.enemy, opt.value || 20);
    } else if (opt.effect === 'stun') {
      await this.showBattleMsg('（对方动摇了。这回合不会攻击。）', 1500);
      this.updateUI();
      this.turn = 'player';
      this.renderCommands();
      return;
    } else if (opt.effect === 'crystal_up') {
      CrystalSystem.increase(this.player, opt.value || 3);
      await this.showBattleMsg('（共感的代价——结晶化进度上升了。）', 1500);
    } else if (opt.effect === 'reveal') {
      await this.showBattleMsg('（你看到了他的过去。一个想让世界公平的人。）', 2000);
    } else if (opt.effect === 'wait') {
      await Anim.wait(2000);
    }

    this.updateUI();

    if (opt.type === 'question' && opt.effect === 'stun') {
      this.enemy.hp = Math.floor(this.enemy.hp * 0.5);
      this.updateHP();
      if (this.enemy.hp <= 10) {
        await this.showResult(true, true);
        return;
      }
    }

    if (this.checkEnd()) return;
    await this.enemyTurn();
  },

  checkEnd() {
    if (this.enemy.hp <= 0) {
      this.showResult(true, false);
      return true;
    }
    return false;
  },

  async showBattleMsg(text, duration) {
    let msg = document.getElementById('btl-msg');
    msg.textContent = text;
    msg.classList.add('show');
    await Anim.wait(duration || 1500);
    msg.classList.remove('show');
    await Anim.wait(200);
  },

  updateHP() {
    let ph = document.getElementById('btl-player-hp');
    let eh = document.getElementById('btl-enemy-hp');
    if (ph) {
      let p = (this.player.hp / this.player.maxHp) * 100;
      ph.style.width = p + '%';
      if (p < 30) ph.classList.add('low');
    }
    if (eh) {
      eh.style.width = (this.enemy.hp / this.enemy.maxHp) * 100 + '%';
    }
  },

  updateUI() {
    let logos = document.getElementById('btl-logos');
    let crystal = document.getElementById('btl-crystal');
    let memory = document.getElementById('btl-memory');
    if (logos) logos.textContent = this.player.logos.toFixed(1) + '赫';
    if (crystal) crystal.textContent = this.player.crystal + '%';
    if (memory) memory.textContent = '第' + GameState.memories + '次';
    this.renderCommands();
  },

  async showResult(won, talkWin) {
    this.battleOver = true;
    let overlay = document.getElementById('btl-result');

    let title = won ? '论证终结' : '意识中断';
    let detail = '';

    if (won && talkWin) {
      detail = this.enemy.talkDefeatMsg || '对方停止了战斗。';
    } else if (won) {
      detail = this.enemy.defeatMsg || '战斗结束了。';
    } else {
      detail = '你的意识沉入了黑暗。';
    }

    detail += `\n\n逻各斯消耗: ${(GameState.player.logos - this.player.logos).toFixed(1)}赫`;
    detail += `\n倒带次数: ${this.rewindsUsed}`;
    detail += `\n结晶化: ${this.player.crystal}%`;

    overlay.innerHTML = `
      <div class="btl-result-title">${title}</div>
      <div class="btl-result-detail">${detail}</div>
      <div class="btl-result-btn" id="btl-result-btn">继续</div>
    `;

    overlay.classList.add('active');

    await new Promise(r => {
      document.getElementById('btl-result-btn').addEventListener('click', r);
    });

    GameState.player.hp = this.player.hp;
    GameState.player.logos = this.player.logos;
    GameState.player.crystal = this.player.crystal;
    GameState.battleCount++;

    overlay.classList.remove('active');
    await Anim.fadeOut(this.scene, 600);
    this.scene.classList.remove('active');
    this.scene.innerHTML = '';

    HUD.show();
    HUD.update();

    let seq = GameState.getSequence();
    if (seq && seq.next) {
      Game.jumpToSequence(seq.next);
    } else {
      Game.advanceSequence();
    }
  }
};
