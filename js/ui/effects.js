const Effects = {
  screenFlash(dur) {
    let f = document.getElementById('screen-flash');
    f.style.opacity = '1';
    setTimeout(() => f.style.opacity = '0', dur || 100);
  },

  heatWave(active) {
    let h = document.getElementById('heat-overlay');
    if (active) {
      h.classList.add('active');
      h.innerHTML = `<svg width="100%" height="100%" style="position:absolute;top:0;left:0"><filter id="heat-filter"><feTurbulence type="turbulence" baseFrequency="0.01 0.04" numOctaves="2" seed="${Date.now()}"><animate attributeName="baseFrequency" dur="8s" values="0.01 0.04;0.02 0.06;0.01 0.04" repeatCount="indefinite"/></feTurbulence><feDisplacementMap in="SourceGraphic" scale="4"/></filter><rect width="100%" height="100%" filter="url(#heat-filter)" fill="transparent"/></svg>`;
    } else {
      h.classList.remove('active');
      h.innerHTML = '';
    }
  },

  addParticle(container, x, y, color, size, duration) {
    let p = document.createElement('div');
    p.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${size||4}px;height:${size||4}px;background:${color||'#fff'};pointer-events:none;opacity:1;border-radius:50%;`;
    container.appendChild(p);
    let dx = (Math.random() - 0.5) * 100;
    let dy = -Math.random() * 80 - 20;
    let dur = duration || 1000;
    p.animate([
      {transform:'translate(0,0) scale(1)', opacity:1},
      {transform:`translate(${dx}px,${dy}px) scale(0)`, opacity:0}
    ], {duration:dur, easing:'ease-out'});
    setTimeout(() => p.remove(), dur);
  },

  crystalParticles(container, x, y) {
    for (let i = 0; i < 12; i++) {
      setTimeout(() => {
        this.addParticle(container, x + Math.random()*40-20, y + Math.random()*40-20, '#7B5EA7', 3 + Math.random()*4, 800 + Math.random()*600);
      }, i * 50);
    }
  },

  logosParticles(container, x, y) {
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        this.addParticle(container, x + Math.random()*30-15, y + Math.random()*30-15, '#4A9BC7', 2 + Math.random()*3, 600 + Math.random()*400);
      }, i * 40);
    }
  }
};
