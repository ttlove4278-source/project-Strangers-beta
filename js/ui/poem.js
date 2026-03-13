const PoemUI = {
  scene: null,
  skipped: false,

  async show(poemId) {
    let poem = POEMS[poemId];
    if (!poem) return;

    this.scene = document.getElementById('scene-poem');
    this.scene.innerHTML = '';
    this.skipped = false;

    let wrap = document.createElement('div');
    wrap.className = 'poem-wrap';

    let container = document.createElement('div');
    container.className = 'poem-vert-container';

    let lineEls = [];
    let realLines = poem.lines.filter(l => l !== '');
    realLines.forEach((line, idx) => {
      let el = document.createElement('div');
      el.className = 'poem-line';
      if (poem.accent && poem.accent.includes(poem.lines.indexOf(line))) {
        el.classList.add('accent');
        if (poem.color) el.style.color = `var(${poem.color})`;
      }
      el.textContent = line;
      container.appendChild(el);
      lineEls.push(el);
    });

    wrap.appendChild(container);

    let chMark = document.createElement('div');
    chMark.className = 'poem-chapter';
    chMark.innerHTML = `${poem.title}　${poem.subtitle}<br>${poem.epigraph}`;
    wrap.appendChild(chMark);

    let skip = document.createElement('div');
    skip.className = 'poem-skip';
    skip.textContent = 'SKIP ▸';
    skip.addEventListener('click', () => { this.skipped = true; });
    wrap.appendChild(skip);

    this.scene.appendChild(wrap);
    this.scene.classList.add('active');
    this.scene.style.opacity = '1';

    await Anim.wait(600);

    for (let i = 0; i < lineEls.length; i++) {
      if (this.skipped) break;
      lineEls[i].classList.add('show');
      AudioManager.playTone(200 + i * 30, 0.3, 'sine', 0.03);
      await Anim.wait(500);
    }

    if (!this.skipped) {
      await Anim.wait(800);
      chMark.classList.add('show');
      await Anim.wait(2000);
    }

    for (let el of lineEls) {
      el.classList.add('out');
    }
    chMark.style.transition = 'opacity 0.8s';
    chMark.style.opacity = '0';
    await Anim.wait(1200);

    await Anim.fadeOut(this.scene, 600);
    this.scene.classList.remove('active');
    this.scene.innerHTML = '';
  }
};
