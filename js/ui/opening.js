const Opening = {
  scene: null,
  skippable: false,
  skipped: false,

  async start() {
    this.scene = document.getElementById('scene-opening');
    this.scene.innerHTML = '';
    this.scene.classList.add('active');
    this.skipped = false;

    let staticEl = document.createElement('div');
    staticEl.className = 'op-static';
    this.scene.appendChild(staticEl);

    let skipHandler = () => {
      if (this.skippable && !this.skipped) {
        this.skipped = true;
      }
    };
    document.addEventListener('click', skipHandler);
    document.addEventListener('keydown', skipHandler);

    staticEl.classList.add('active');
    await Anim.wait(800);
    if (this.skipped) return this.end(skipHandler);

    staticEl.classList.remove('active');
    await Anim.wait(300);

    let date = document.createElement('div');
    date.className = 'op-date';
    date.textContent = '1999.7.13';
    this.scene.appendChild(date);
    await Anim.fadeIn(date, 1200);
    await Anim.wait(1000);
    if (this.skipped) return this.end(skipHandler);
    await Anim.fadeOut(date, 800);

    let line = document.createElement('div');
    line.className = 'op-heat-line';
    this.scene.appendChild(line);
    line.style.transition = 'transform 1s cubic-bezier(0.16,1,0.3,1)';
    await Anim.wait(100);
    line.style.transform = 'scaleX(1)';
    await Anim.wait(1200);
    if (this.skipped) return this.end(skipHandler);

    let quotes = [
      {text:'上帝已死', source:'F.Nietzsche'},
      {text:'他人即地狱', source:'J.P.Sartre'},
      {text:'人是一根会思想的芦苇', source:'B.Pascal'},
      {text:'我们必须想象西西弗是幸福的', source:'A.Camus'}
    ];

    for (let q of quotes) {
      if (this.skipped) break;
      let qEl = document.createElement('div');
      qEl.className = 'op-quote';
      qEl.innerHTML = q.text;
      this.scene.appendChild(qEl);
      await Anim.fadeIn(qEl, 600);
      await Anim.wait(800);
      qEl.classList.add('text-dissolve');
      await Anim.wait(1200);
      qEl.remove();
    }

    if (this.skipped) return this.end(skipHandler);
    this.skippable = true;

    let chars = [
      {name:'夏目 珀', sig:'A.Camus', color:'#C4A35A', x:20},
      {name:'御厨 光', sig:'Plato', color:'#8FB8A0', x:40},
      {name:'高城 黎', sig:'F.Nietzsche', color:'#D4AF37', x:60},
      {name:'久我 冻夜', sig:'I.Kant', color:'#4A5568', x:80}
    ];

    for (let c of chars) {
      if (this.skipped) break;
      let sil = document.createElement('div');
      sil.className = 'op-silhouette';
      sil.style.left = c.x + '%';
      sil.style.top = '25%';
      sil.style.color = c.color;
      sil.innerHTML = `
        <div class="op-sil-body">
          <div class="op-sil-head" style="background:${c.color}"></div>
          <div class="op-sil-torso" style="background:${c.color}"></div>
          <div class="op-sil-legs"><div class="op-sil-leg" style="background:${c.color}"></div><div class="op-sil-leg" style="background:${c.color}"></div></div>
        </div>
        <div class="op-sil-name">${c.name}</div>
        <div class="op-sil-sig">${c.sig}</div>
      `;
      this.scene.appendChild(sil);
      await Anim.fadeIn(sil, 500);
      await Anim.wait(400);
    }

    await Anim.wait(600);
    if (this.skipped) return this.end(skipHandler);

    let allSils = this.scene.querySelectorAll('.op-silhouette');
    allSils.forEach(s => Anim.fadeOut(s, 600));
    await Anim.wait(800);

    let titleWrap = document.createElement('div');
    titleWrap.className = 'op-title-wrap';
    let titleMain = document.createElement('div');
    titleMain.className = 'op-title-main';
    let titleChars = '世纪末异乡人';
    titleChars.split('').forEach(ch => {
      let s = document.createElement('span');
      s.textContent = ch;
      titleMain.appendChild(s);
    });
    let titleLine = document.createElement('div');
    titleLine.className = 'op-title-line';
    let titleSub = document.createElement('div');
    titleSub.className = 'op-title-sub';
    titleSub.textContent = 'STRANGER AT THE END OF THE CENTURY';
    titleWrap.appendChild(titleMain);
    titleWrap.appendChild(titleLine);
    titleWrap.appendChild(titleSub);
    this.scene.appendChild(titleWrap);

    await Anim.fadeIn(titleWrap, 200);
    let spans = titleMain.querySelectorAll('span');
    for (let i = 0; i < spans.length; i++) {
      spans[i].style.transition = `opacity 0.4s ease-out ${i*0.08}s, transform 0.4s cubic-bezier(0.16,1,0.3,1) ${i*0.08}s`;
      spans[i].style.opacity = '1';
      spans[i].style.transform = 'translateY(0)';
    }
    await Anim.wait(800);

    titleLine.style.width = '120px';
    await Anim.wait(500);

    titleSub.style.transition = 'opacity 0.8s ease-out';
    titleSub.style.opacity = '1';
    await Anim.wait(1500);

    Effects.screenFlash(80);
    AudioManager.playTone(180, 0.8, 'sine', 0.1);
    await Anim.wait(1000);

    let press = document.createElement('div');
    press.className = 'op-press';
    press.textContent = 'PRESS ANY KEY';
    this.scene.appendChild(press);
    await Anim.wait(200);
    press.classList.add('visible');

    await new Promise(r => {
      let h = () => {
        document.removeEventListener('click', h);
        document.removeEventListener('keydown', h);
        r();
      };
      document.removeEventListener('click', skipHandler);
      document.removeEventListener('keydown', skipHandler);
      document.addEventListener('click', h);
      document.addEventListener('keydown', h);
    });

    AudioManager.playSelect();
    return this.end(skipHandler);
  },

  async end(handler) {
    document.removeEventListener('click', handler);
    document.removeEventListener('keydown', handler);
    await Anim.fadeOut(this.scene, 600);
    this.scene.classList.remove('active');
    this.scene.innerHTML = '';
  }
};
