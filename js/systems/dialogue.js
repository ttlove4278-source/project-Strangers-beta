const DialogueSystem = {
  scene: null,
  lines: [],
  lineIndex: 0,
  typing: false,
  choices: null,
  choiceCallback: null,
  onComplete: null,

  async start(data) {
    this.scene = document.getElementById('scene-dialogue');
    this.scene.innerHTML = '';
    this.lines = data.lines;
    this.lineIndex = 0;
    this.choices = data.choices || null;

    let bgColor = this.getBgColor(data.time || GameState.time);
    let bg = document.createElement('div');
    bg.className = 'dlg-bg';
    bg.style.background = bgColor;
    this.scene.appendChild(bg);

    let chars = document.createElement('div');
    chars.className = 'dlg-chars';
    chars.id = 'dlg-chars';
    this.scene.appendChild(chars);

    if (data.speakers) {
      data.speakers.filter(s => s !== 'narrator' && s !== 'enemy').forEach(id => {
        let ch = CHARACTERS[id];
        if (!ch) return;
        let el = document.createElement('div');
        el.className = 'dlg-char silent';
        el.id = 'dlg-char-' + id;
        el.innerHTML = `
          <div class="dlg-char-img">
            <div class="dlg-char-body">
              <div class="dlg-head" style="background:${ch.color}"></div>
              <div class="dlg-torso" style="background:${ch.color}"></div>
              <div class="dlg-legs"><div class="dlg-leg" style="background:${ch.color}"></div><div class="dlg-leg" style="background:${ch.color}"></div></div>
            </div>
          </div>
          <div class="dlg-char-name" style="color:${ch.color}">${ch.nameShort}</div>
        `;
        chars.appendChild(el);
      });
    }

    let boxArea = document.createElement('div');
    boxArea.className = 'dlg-box-area';
    boxArea.innerHTML = `
      <div class="dlg-nameplate" id="dlg-nameplate">
        <div class="dlg-name-line"></div>
        <div class="dlg-speaker" id="dlg-speaker"></div>
      </div>
      <div class="dlg-box">
        <div class="dlg-text" id="dlg-text"></div>
        <div class="dlg-indicator" id="dlg-indicator"></div>
      </div>
    `;
    this.scene.appendChild(boxArea);

    let choicesEl = document.createElement('div');
    choicesEl.className = 'dlg-choices';
    choicesEl.id = 'dlg-choices';
    this.scene.appendChild(choicesEl);

    this.scene.classList.add('active');
    this.scene.style.opacity = '1';

    this.bindInput();
    await this.showLine();
  },

  getBgColor(time) {
    if (time === 'evening') return 'linear-gradient(to bottom, #1a1a2e, #2a1a1a 60%, #3a2a1a)';
    if (time === 'night') return 'linear-gradient(to bottom, #050510, #0a0a1c, #0c0c14)';
    return 'linear-gradient(to bottom, #2a3040, #3a3a38 60%, #4a4a3a)';
  },

  async showLine() {
    if (this.lineIndex >= this.lines.length) {
      if (this.choices) {
        this.showChoices();
        return;
      }
      this.end();
      return;
    }

    let line = this.lines[this.lineIndex];

    if (line.tag === 'choice') {
      this.showChoices();
      return;
    }

    let nameplate = document.getElementById('dlg-nameplate');
    let speakerEl = document.getElementById('dlg-speaker');
    let textEl = document.getElementById('dlg-text');
    let indicator = document.getElementById('dlg-indicator');

    indicator.classList.remove('show');

    let allChars = this.scene.querySelectorAll('.dlg-char');
    allChars.forEach(c => {
      c.classList.remove('speaking');
      c.classList.add('silent');
    });

    if (line.speaker === 'narrator') {
      nameplate.style.opacity = '0';
      textEl.className = 'dlg-text';
      if (line.tag === 'em') textEl.style.color = 'var(--accent-heat)';
      else textEl.style.color = '';
    } else if (line.speaker === 'enemy') {
      speakerEl.textContent = '???';
      speakerEl.style.color = 'var(--accent-heat)';
      nameplate.style.opacity = '1';
      textEl.className = 'dlg-text';
      textEl.style.color = '';
    } else {
      let ch = CHARACTERS[line.speaker];
      if (ch) {
        speakerEl.textContent = ch.name;
        speakerEl.style.color = ch.color;
        let charEl = document.getElementById('dlg-char-' + line.speaker);
        if (charEl) {
          charEl.classList.remove('silent');
          charEl.classList.add('speaking');
        }
      }
      nameplate.style.opacity = '1';
      textEl.className = 'dlg-text';
      if (line.tag === 'th') {
        textEl.style.color = 'var(--accent-pocari)';
        textEl.style.fontStyle = 'italic';
      } else if (line.tag === 'wh') {
        textEl.style.color = 'var(--text-muted)';
        textEl.style.fontSize = '13px';
      } else if (line.tag === 'em') {
        textEl.style.color = 'var(--accent-heat)';
        textEl.style.fontStyle = '';
      } else {
        textEl.style.color = '';
        textEl.style.fontStyle = '';
        textEl.style.fontSize = '';
      }
    }

    if (line.text === '') {
      textEl.innerHTML = '';
      this.lineIndex++;
      await Anim.wait(300);
      this.showLine();
      return;
    }

    this.typing = true;
    let speed = line.speaker === 'narrator' ? 35 : 30;
    await Anim.typeText(textEl, line.text, speed);
    this.typing = false;

    indicator.classList.add('show');

    GameState.dialogueHistory.push({speaker: line.speaker, text: line.text});
  },

  showChoices() {
    let el = document.getElementById('dlg-choices');
    el.innerHTML = '';

    if (!this.choices) return;

    this.choices.forEach((ch, idx) => {
      let btn = document.createElement('div');
      btn.className = 'dlg-choice';
      btn.textContent = ch.text;
      btn.addEventListener('click', () => {
        AudioManager.playSelect();
        el.classList.remove('active');
        if (ch.flags) ch.flags.forEach(f => GameState.setFlag(f));
        GameState.choices[this.lines[0]?.speaker + '_' + idx] = ch.text;
        if (ch.next) {
          this.cleanup();
          Game.jumpToSequence(ch.next);
        }
      });
      el.appendChild(btn);
    });

    el.classList.add('active');
  },

  advance() {
    if (this.typing) {
      Anim.skipType(document.getElementById('dlg-text'));
      this.typing = false;
      document.getElementById('dlg-indicator').classList.add('show');
      return;
    }
    this.lineIndex++;
    AudioManager.playClick();
    this.showLine();
  },

  _inputHandler: null,
  bindInput() {
    this._inputHandler = (e) => {
      if (e.type === 'click' || e.key === 'Enter' || e.key === ' ') {
        let choices = document.getElementById('dlg-choices');
        if (choices && choices.classList.contains('active')) return;
        this.advance();
      }
    };
    document.addEventListener('click', this._inputHandler);
    document.addEventListener('keydown', this._inputHandler);
  },

  unbindInput() {
    if (this._inputHandler) {
      document.removeEventListener('click', this._inputHandler);
      document.removeEventListener('keydown', this._inputHandler);
    }
  },

  cleanup() {
    this.unbindInput();
    this.scene.classList.remove('active');
    this.scene.innerHTML = '';
    this.choices = null;
  },

  end() {
    this.cleanup();
    let seq = GameState.getSequence();
    if (seq && seq.flags) seq.flags.forEach(f => GameState.setFlag(f));
    if (seq && seq.next) {
      Game.jumpToSequence(seq.next);
    } else {
      Game.advanceSequence();
    }
  }
};
