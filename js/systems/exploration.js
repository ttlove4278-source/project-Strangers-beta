const Exploration = {
  scene: null,
  currentLocation: null,
  availableLocations: [],
  events: {},
  mapOpen: false,

  async start(data) {
    this.scene = document.getElementById('scene-exploration');
    this.scene.innerHTML = '';
    this.currentLocation = data.location;
    this.availableLocations = data.availableLocations || [];
    this.events = data.events || {};

    HUD.show();
    HUD.update();

    await this.renderLocation(this.currentLocation);
    this.scene.classList.add('active');
    this.scene.style.opacity = '1';
  },

  async renderLocation(locId) {
    let loc = SCENES[locId];
    if (!loc) return;

    this.currentLocation = locId;
    GameState.visitedScenes[locId] = true;

    this.scene.innerHTML = '';

    let bg = document.createElement('div');
    bg.className = 'exp-bg';

    let sky = document.createElement('div');
    sky.className = 'exp-sky';
    let timeClass = GameState.time || loc.time || 'day';
    sky.classList.add(timeClass);
    bg.appendChild(sky);

    let ground = document.createElement('div');
    ground.className = 'exp-ground';
    ground.style.background = `linear-gradient(to bottom, ${loc.ground}, ${this.darken(loc.ground)})`;
    bg.appendChild(ground);
    this.scene.appendChild(bg);

    let sceneContent = document.createElement('div');
    sceneContent.className = 'exp-scene';

    if (loc.elements) {
      loc.elements.forEach(el => {
        if (el.type === 'vending') {
          let v = document.createElement('div');
          v.className = 'exp-vending';
          v.style.left = el.x + '%';
          v.style.top = el.y + '%';
          v.innerHTML = `<div class="exp-vending-body"></div><div class="exp-vending-glow"></div>`;
          v.addEventListener('click', () => this.interact(el));
          sceneContent.appendChild(v);
        } else {
          let e = document.createElement('div');
          e.className = 'exp-elem' + (el.interact ? ' interact' : '');
          e.style.left = el.x + '%';
          e.style.top = el.y + '%';
          e.style.width = (el.w || 10) + '%';
          e.style.height = (el.h || 10) + '%';
          e.style.background = el.color || 'rgba(255,255,255,0.05)';
          e.style.borderRadius = '2px';
          if (el.interact) {
            e.addEventListener('click', () => this.interact(el));
          }
          sceneContent.appendChild(e);
        }
      });
    }

    this.scene.appendChild(sceneContent);

    let locName = document.createElement('div');
    locName.className = 'exp-loc-name show';
    locName.innerHTML = `${loc.name}<span class="exp-loc-sub">${loc.nameEn}</span>`;
    this.scene.appendChild(locName);

    let nav = document.createElement('div');
    nav.className = 'exp-nav';

    let mapBtn = document.createElement('button');
    mapBtn.className = 'exp-nav-btn';
    mapBtn.textContent = '地图';
    mapBtn.addEventListener('click', () => this.toggleMap());
    nav.appendChild(mapBtn);

    if (this.events[locId]) {
      let evtBtn = document.createElement('button');
      evtBtn.className = 'exp-nav-btn';
      evtBtn.style.borderColor = 'var(--accent-heat)';
      evtBtn.style.color = 'var(--accent-heat)';
      evtBtn.textContent = '调查';
      evtBtn.addEventListener('click', () => this.triggerEvent(locId));
      nav.appendChild(evtBtn);
    }

    let nextBtn = document.createElement('button');
    nextBtn.className = 'exp-nav-btn';
    nextBtn.textContent = '推进时间';
    nextBtn.addEventListener('click', () => this.endExploration());
    nav.appendChild(nextBtn);

    this.scene.appendChild(nav);

    let actions = document.createElement('div');
    actions.className = 'exp-actions active';
    actions.id = 'exp-actions';

    if (loc.desc) {
      let descBtn = document.createElement('button');
      descBtn.className = 'exp-act-btn';
      descBtn.textContent = '环顾四周';
      descBtn.addEventListener('click', () => this.showDesc(loc.desc));
      actions.appendChild(descBtn);
    }

    this.scene.appendChild(actions);
  },

  darken(hex) {
    let r = parseInt(hex.slice(1,3),16);
    let g = parseInt(hex.slice(3,5),16);
    let b = parseInt(hex.slice(5,7),16);
    return `rgb(${Math.max(0,r-20)},${Math.max(0,g-20)},${Math.max(0,b-20)})`;
  },

  interact(el) {
    if (!el.desc) return;
    AudioManager.playClick();
    this.showDesc(el.desc);
  },

  showDesc(desc) {
    let existing = this.scene.querySelector('.exp-desc-popup');
    if (existing) existing.remove();

    let popup = document.createElement('div');
    popup.className = 'exp-desc-popup';
    popup.style.cssText = `position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);max-width:400px;padding:20px 28px;background:rgba(10,10,12,0.95);border:1px solid rgba(240,237,228,0.06);font-family:var(--font-serif);font-size:13px;line-height:2;letter-spacing:1px;color:var(--text-secondary);text-align:center;z-index:20;cursor:pointer`;
    popup.textContent = desc;
    popup.addEventListener('click', () => popup.remove());
    this.scene.appendChild(popup);
  },

  toggleMap() {
    if (this.mapOpen) {
      let m = this.scene.querySelector('.exp-map');
      if (m) m.remove();
      this.mapOpen = false;
      return;
    }

    this.mapOpen = true;
    let map = document.createElement('div');
    map.className = 'exp-map active';

    let inner = document.createElement('div');
    inner.className = 'exp-map-inner';

    let positions = {
      teibou: {x:70,y:80}, library: {x:40,y:40}, school_gate: {x:20,y:20},
      convenience: {x:80,y:50}, station_square: {x:50,y:60}, old_port: {x:60,y:70},
      bridge_under: {x:75,y:75}, cemetery: {x:15,y:50}, shrine: {x:30,y:70}
    };

    this.availableLocations.forEach(locId => {
      let loc = SCENES[locId];
      let pos = positions[locId];
      if (!loc || !pos) return;

      let node = document.createElement('div');
      node.className = 'exp-map-node';
      if (locId === this.currentLocation) node.classList.add('current');
      node.style.left = pos.x + '%';
      node.style.top = pos.y + '%';
      node.textContent = loc.name;

      if (this.events[locId]) {
        node.style.borderColor = 'rgba(232,93,58,0.4)';
      }

      node.addEventListener('click', () => {
        if (locId === this.currentLocation) return;
        if (GameState.ap <= 0) {
          this.showDesc('行动点不足。');
          return;
        }
        AudioManager.playSelect();
        GameState.useAp(1);
        HUD.update();
        this.mapOpen = false;
        map.remove();
        this.renderLocation(locId);
      });
      inner.appendChild(node);
    });

    let close = document.createElement('div');
    close.className = 'exp-map-close';
    close.textContent = '✕ 关闭';
    close.addEventListener('click', () => {
      this.mapOpen = false;
      map.remove();
    });

    map.appendChild(inner);
    map.appendChild(close);
    this.scene.appendChild(map);
  },

  async triggerEvent(locId) {
    let evtId = this.events[locId];
    if (!evtId) return;

    AudioManager.playSelect();
    GameState.useAp(1);
    HUD.update();

    delete this.events[locId];

    this.scene.classList.remove('active');
    this.scene.innerHTML = '';

    Game.jumpToSequence(evtId);
  },

  endExploration() {
    AudioManager.playClick();
    this.scene.classList.remove('active');
    this.scene.innerHTML = '';

    let seq = GameState.getSequence();
    if (seq && seq.next) {
      Game.jumpToSequence(seq.next);
    } else {
      Game.advanceSequence();
    }
  }
};
