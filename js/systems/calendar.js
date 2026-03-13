const Calendar = {
  scene: null,

  async show(data) {
    GameState.setDate(data.date, data.dayOfWeek, data.temp);
    GameState.restoreAp();
    LogosSystem.sleepRecover(GameState.player);

    let layer = document.getElementById('transition-layer');
    layer.style.transition = 'opacity 0.5s';
    layer.style.opacity = '1';
    await Anim.wait(600);

    layer.innerHTML = `
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center">
        <div style="font-family:var(--font-mono);font-size:11px;color:var(--text-muted);letter-spacing:4px;margin-bottom:12px">${data.dayOfWeek}</div>
        <div style="font-family:var(--font-serif);font-size:36px;color:var(--text-primary);letter-spacing:8px">${data.date}</div>
        <div style="font-family:var(--font-mono);font-size:12px;color:var(--accent-heat);letter-spacing:3px;margin-top:8px">${data.temp}℃</div>
        <div style="font-family:var(--font-serif);font-size:13px;color:var(--text-secondary);letter-spacing:2px;margin-top:20px;max-width:300px;line-height:1.8">${data.desc || ''}</div>
      </div>
    `;
    layer.style.pointerEvents = 'auto';
    await Anim.wait(2500);

    await new Promise(r => {
      let h = () => {
        document.removeEventListener('click', h);
        document.removeEventListener('keydown', h);
        r();
      };
      document.addEventListener('click', h);
      document.addEventListener('keydown', h);
    });

    layer.style.opacity = '0';
    layer.style.pointerEvents = 'none';
    await Anim.wait(600);
    layer.innerHTML = '';

    HUD.show();
    HUD.update();
  }
};
