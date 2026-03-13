const HUD = {
  el: null,

  show() {
    this.el = document.getElementById('hud');
    this.update();
    this.el.classList.add('active');
  },

  hide() {
    if (this.el) this.el.classList.remove('active');
  },

  update() {
    if (!this.el) this.el = document.getElementById('hud');
    let p = GameState.player;
    if (!p) return;

    let logosPercent = (p.logos / p.maxLogos) * 100;
    let crystalPercent = p.crystal;

    this.el.innerHTML = `
      <div class="hud-top">
        <div class="hud-top-left">
          <span class="hud-date">${GameState.date} (${GameState.dayOfWeek})</span>
          <span class="hud-temp">${GameState.temp}℃</span>
          <span class="hud-weather">☀</span>
        </div>
        <div class="hud-top-right">
          <span class="hud-cicada">蝉鸣中——</span>
        </div>
      </div>
      <div class="hud-bottom">
        <div class="hud-bottom-left">
          <div class="hud-label">LOGOS</div>
          <div class="hud-bar"><div class="hud-bar-fill logos" style="width:${logosPercent}%"></div></div>
          <div class="hud-value">${p.logos.toFixed(1)} / ${p.maxLogos} 赫</div>
          <div style="margin-top:4px">
            <div class="hud-label">结晶化</div>
            <div class="hud-bar"><div class="hud-bar-fill crystal" style="width:${crystalPercent}%"></div></div>
            <div class="hud-value">${crystalPercent}%</div>
          </div>
        </div>
        <div class="hud-bottom-right">
          <div class="hud-label">行动点</div>
          <div class="hud-ap">${this.renderAp()}</div>
          <div style="margin-top:6px">
            <div class="hud-label">记忆</div>
            <div class="hud-memory">第 ${GameState.memories} 次</div>
          </div>
        </div>
      </div>
    `;
  },

  renderAp() {
    let s = '';
    for (let i = 0; i < GameState.maxAp; i++) {
      s += `<div class="hud-ap-dot ${i < GameState.ap ? 'filled' : ''}"></div>`;
    }
    return s;
  }
};
