const Anim = {
  queue: [],
  running: false,

  wait(ms) {
    return new Promise(r => setTimeout(r, ms));
  },

  fadeIn(el, ms) {
    return new Promise(r => {
      el.style.transition = `opacity ${ms||400}ms ease-out`;
      el.style.opacity = '0';
      requestAnimationFrame(() => {
        el.style.opacity = '1';
        setTimeout(r, ms||400);
      });
    });
  },

  fadeOut(el, ms) {
    return new Promise(r => {
      el.style.transition = `opacity ${ms||400}ms ease-in`;
      el.style.opacity = '0';
      setTimeout(r, ms||400);
    });
  },

  typeText(el, text, speed) {
    return new Promise(r => {
      el.innerHTML = '';
      let chars = text.split('');
      let spans = chars.map(c => {
        let s = document.createElement('span');
        s.className = 'ch';
        s.textContent = c;
        el.appendChild(s);
        return s;
      });
      let i = 0;
      let spd = speed || 40;
      let iv = setInterval(() => {
        if (i < spans.length) {
          spans[i].classList.add('v');
          i++;
        } else {
          clearInterval(iv);
          r();
        }
      }, spd);
      el._typeInterval = iv;
      el._typeResolve = r;
      el._typeSpans = spans;
      el._typeIndex = () => i;
    });
  },

  skipType(el) {
    if (el._typeInterval) {
      clearInterval(el._typeInterval);
      if (el._typeSpans) el._typeSpans.forEach(s => s.classList.add('v'));
      if (el._typeResolve) el._typeResolve();
      el._typeInterval = null;
    }
  },

  flash(el, duration) {
    return new Promise(r => {
      el.style.opacity = '1';
      setTimeout(() => {
        el.style.opacity = '0';
        setTimeout(r, 100);
      }, duration || 100);
    });
  },

  shake(el) {
    return new Promise(r => {
      el.classList.add('screen-shake');
      setTimeout(() => {
        el.classList.remove('screen-shake');
        r();
      }, 500);
    });
  },

  glitch(el) {
    return new Promise(r => {
      el.classList.add('glitch');
      setTimeout(() => {
        el.classList.remove('glitch');
        r();
      }, 300);
    });
  },

  vhsRewind(el) {
    return new Promise(r => {
      el.classList.add('vhs-rewind');
      setTimeout(() => {
        el.classList.remove('vhs-rewind');
        r();
      }, 1500);
    });
  },

  colorInvert(el) {
    return new Promise(r => {
      el.classList.add('color-invert');
      setTimeout(() => {
        el.classList.remove('color-invert');
        r();
      }, 150);
    });
  },

  transition(type, duration) {
    let layer = document.getElementById('transition-layer');
    return new Promise(r => {
      layer.style.transition = `opacity ${(duration||600)/2}ms`;
      layer.style.opacity = '1';
      layer.style.pointerEvents = 'auto';
      setTimeout(() => {
        layer.style.opacity = '0';
        setTimeout(() => {
          layer.style.pointerEvents = 'none';
          r();
        }, (duration||600)/2);
      }, (duration||600)/2);
    });
  },

  countUp(el, from, to, duration) {
    return new Promise(r => {
      let start = performance.now();
      let update = (now) => {
        let p = Math.min(1, (now - start) / duration);
        let val = Math.floor(from + (to - from) * p);
        el.textContent = val;
        if (p < 1) requestAnimationFrame(update);
        else r();
      };
      requestAnimationFrame(update);
    });
  }
};
