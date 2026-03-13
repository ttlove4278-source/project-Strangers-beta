const Menu = {
  scene: null,
  selected: 0,
  items: [
    {name:'推石头', en:'NEW GAME', action:'new'},
    {name:'继续推', en:'CONTINUE', action:'continue'},
    {name:'档案室', en:'ARCHIVES', action:'archive'},
    {name:'设定', en:'SETTINGS', action:'settings'}
  ],

  async show() {
    this.scene = document.getElementById('scene-menu');
    this.scene.innerHTML = '';

    let bg = document.createElement('div');
    bg.className = 'menu-bg';
    for (let i = 0; i < 8; i++) {
      let l = document.createElement('div');
      l.className = 'menu-bg-line';
      l.style.left = (10 + i * 12) + '%';
      bg.appendChild(l);
    }
    this.scene.appendChild(bg);

    let ta = document.createElement('div');
    ta.className = 'menu-title-area';
    ta.innerHTML = `
      <div class="menu-title">世纪末异乡人</div>
      <div class="menu-line"></div>
      <div class="menu-subtitle">STRANGER AT THE END OF THE CENTURY</div>
    `;
    this.scene.appendChild(ta);

    let mi = document.createElement('div');
    mi.className = 'menu-items';
    this.items.forEach((item, idx) => {
      let d = document.createElement('div');
      d.className = 'menu-item';
      d.dataset.idx = idx;
      if (item.action === 'continue' && !SaveManager.hasSave('auto')) {
        d.style.opacity = '0.2';
        d.style.pointerEvents = 'none';
      }
      d.innerHTML = `<div class="menu-item-dot"></div>${item.name}<span class="menu-item-en">${item.en}</span>`;
      d.addEventListener('click', () => this.select(idx));
      d.addEventListener('mouseenter', () => {
        AudioManager.playClick();
        this.highlight(idx);
      });
      mi.appendChild(d);
    });
    this.scene.appendChild(mi);

    let ft = document.createElement('div');
    ft.className = 'menu-footer';
    ft.innerHTML = `<span>1999.7.13</span><span class="menu-temp">37.5℃</span><span>☀</span>`;
    this.scene.appendChild(ft);

    this.scene.classList.add('active');
    await Anim.fadeIn(this.scene, 600);

    this.bindKeys();
  },

  highlight(idx) {
    let items = this.scene.querySelectorAll('.menu-item');
    items.forEach(i => i.classList.remove('sel'));
    if (items[idx]) items[idx].classList.add('sel');
    this.selected = idx;
  },

  async select(idx) {
    AudioManager.playSelect();
    let item = this.items[idx];

    if (item.action === 'new') {
      this.unbindKeys();
      await Anim.fadeOut(this.scene, 600);
      this.scene.classList.remove('active');
      GameState.init();
      Game.startChapter();
    } else if (item.action === 'continue') {
      let data = SaveManager.load('auto');
      if (data) {
        this.unbindKeys();
        SaveManager.applySave(data);
        await Anim.fadeOut(this.scene, 600);
        this.scene.classList.remove('active');
        Game.processSequence();
      }
    } else if (item.action === 'archive') {
      this.unbindKeys();
      await Anim.fadeOut(this.scene, 400);
      this.scene.classList.remove('active');
      Archive.show(() => {
        this.show();
      });
    }
  },

  _keyHandler: null,
  bindKeys() {
    this._keyHandler = (e) => {
      if (e.key === 'ArrowUp') {
        this.selected = (this.selected - 1 + this.items.length) % this.items.length;
        this.highlight(this.selected);
        AudioManager.playClick();
      } else if (e.key === 'ArrowDown') {
        this.selected = (this.selected + 1) % this.items.length;
        this.highlight(this.selected);
        AudioManager.playClick();
      } else if (e.key === 'Enter' || e.key === ' ') {
        this.select(this.selected);
      }
    };
    document.addEventListener('keydown', this._keyHandler);
  },

  unbindKeys() {
    if (this._keyHandler) document.removeEventListener('keydown', this._keyHandler);
  }
};
