const Archive = {
  scene: null,
  backCallback: null,
  currentTab: 'characters',

  show(onBack) {
    this.backCallback = onBack;
    this.scene = document.getElementById('scene-archive');
    this.scene.innerHTML = '';

    let side = document.createElement('div');
    side.className = 'arc-side';
    side.innerHTML = `
      <div class="arc-side-title">档案室</div>
      <div class="arc-side-items">
        <div class="arc-side-item on" data-tab="characters">人物档案</div>
        <div class="arc-side-item" data-tab="timeline">时间线</div>
        <div class="arc-side-item" data-tab="glossary">哲学辞典</div>
        <div class="arc-side-item" data-tab="memories">记忆计数器</div>
      </div>
      <div class="arc-back">◁ 返回</div>
    `;

    let content = document.createElement('div');
    content.className = 'arc-content';
    content.id = 'arc-content';

    this.scene.appendChild(side);
    this.scene.appendChild(content);

    side.querySelector('.arc-back').addEventListener('click', () => this.close());
    side.querySelectorAll('.arc-side-item').forEach(item => {
      item.addEventListener('click', () => {
        side.querySelectorAll('.arc-side-item').forEach(i => i.classList.remove('on'));
        item.classList.add('on');
        this.showTab(item.dataset.tab);
      });
    });

    this.scene.classList.add('active');
    this.scene.style.opacity = '1';
    this.showTab('characters');
  },

  showTab(tab) {
    let c = document.getElementById('arc-content');
    if (!c) return;

    if (tab === 'characters') {
      let html = '';
      let chars = ['haku','hikaru','rei','toya','n912','akira','makoto'];
      chars.forEach(id => {
        let ch = CHARACTERS[id];
        let unlocked = id === 'haku' || GameState.hasFlag('met_' + id) || GameState.hasFlag('met_hikaru') && id === 'hikaru';
        if (id === 'haku' || id === 'hikaru') unlocked = true;
        if (unlocked) {
          html += `
            <div class="arc-doc" style="margin-bottom:40px">
              <div class="arc-doc-hd">
                <div class="arc-doc-id">思想源流：${ch.source}</div>
                <div class="arc-doc-title" style="color:${ch.color}">${ch.name}</div>
                <div class="arc-doc-meta">
                  能力名：${ch.ability}<br>
                  签名：${ch.signature}
                </div>
              </div>
              <div class="arc-doc-body">
                <div class="arc-quote">${ch.thesis}</div>
              </div>
            </div>
          `;
        } else {
          html += `<div class="arc-locked">[ ${ch.name} — 未解锁 ]</div>`;
        }
      });
      c.innerHTML = html;
    } else if (tab === 'timeline') {
      c.innerHTML = `
        <div class="arc-doc">
          <div class="arc-doc-hd">
            <div class="arc-doc-title">时间线</div>
          </div>
          <div class="arc-tl">
            <div class="arc-tl-item imp"><div class="arc-tl-date">1994.8.5</div><div class="arc-tl-text">夏目深雪去世（11岁）</div></div>
            <div class="arc-tl-item"><div class="arc-tl-date">1999.4</div><div class="arc-tl-text">厚生省第九课正式成立</div></div>
            <div class="arc-tl-item"><div class="arc-tl-date">1999.6.28</div><div class="arc-tl-text">御厨光觉醒</div></div>
            <div class="arc-tl-item imp"><div class="arc-tl-date">1999.7.13</div><div class="arc-tl-text">夏目珀觉醒——故事开始</div></div>
            ${GameState.hasFlag('met_hikaru') ? '<div class="arc-tl-item"><div class="arc-tl-date">1999.7.14</div><div class="arc-tl-text">图书馆——与御厨光相遇</div></div>' : ''}
            ${GameState.hasFlag('joined_nine') ? '<div class="arc-tl-item"><div class="arc-tl-date">1999.7.16</div><div class="arc-tl-text">成为九课协助者</div></div>' : ''}
            ${GameState.hasFlag('met_akira') ? '<div class="arc-tl-item"><div class="arc-tl-date">1999.7.20</div><div class="arc-tl-text">高架桥下——与藤森明相遇</div></div>' : ''}
          </div>
        </div>
      `;
    } else if (tab === 'glossary') {
      c.innerHTML = `
        <div class="arc-doc">
          <div class="arc-doc-hd"><div class="arc-doc-title">哲学辞典</div></div>
          <div class="arc-doc-body">
            <p><strong style="color:var(--accent-heat)">哲学症</strong><br>人类文明积淀两千年的思想在世纪末达到临界质量引发的文明病。患者会被某种思想"附身"，获得超常能力，同时精神被该思想吞噬。</p>
            <p><strong style="color:var(--accent-pocari)">逻各斯（Logos）</strong><br>论证者使用的能量。本质不是力量，而是"世界暂时接受了你的主张"。密度单位：赫拉克利特（赫）。</p>
            <p><strong style="color:var(--accent-crystal)">理论结晶</strong><br>哲学症终末期患者的肉身崩解后形成的几何形半透明结晶体。内部含有该患者一生对某哲学命题的理解。</p>
            <p><strong style="color:var(--char-haku)">论证者</strong><br>哲学症发病后存活并掌握能力的人。需要命题、论据、代价三要素。</p>
            <p><strong style="color:var(--text-secondary)">命题展开</strong><br>中阶能力。必须大声说出自己的命题才能发动——不发声的主张不存在。</p>
            <p><strong style="color:var(--text-secondary)">辩证反转</strong><br>战斗中承认对方命题的局部正确后，自身能力发生不可逆变化。</p>
            <p><strong style="color:var(--text-secondary)">他者抑制</strong><br>被另一个人真正"看见"时，逻各斯增殖速度降低，结晶化减缓。</p>
          </div>
        </div>
      `;
    } else if (tab === 'memories') {
      c.innerHTML = `
        <div class="arc-doc">
          <div class="arc-doc-hd">
            <div class="arc-doc-title">记忆计数器</div>
            <div class="arc-doc-meta">夏目珀的死亡记录</div>
          </div>
          <div class="arc-doc-body">
            <div style="font-family:var(--font-mono);font-size:48px;color:var(--char-haku);letter-spacing:8px;text-align:center;padding:40px 0">${GameState.memories}</div>
            <p style="text-align:center;color:var(--text-muted);font-size:12px">每一次都记得。每一次都没有忘。</p>
          </div>
        </div>
      `;
    }
  },

  close() {
    this.scene.classList.remove('active');
    this.scene.innerHTML = '';
    if (this.backCallback) this.backCallback();
  }
};
