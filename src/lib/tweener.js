

export const isNum = v => typeof v === 'number';
const linear = (p) => p;

export const transitions = {

  linear: [linear, linear, linear],
  sine: [
    p => 1 - Math.cos(p * Math.PI * 0.5),
    p => Math.sin(p * Math.PI * 0.5),
    p => 0.5 * (1 - Math.cos(p * Math.PI))
  ],
  quadratic: [
    p => p * p,
    p => {
      const m = p - 1;
      return 1 - m * m;
    },
    p => {
      const m = p - 1, t = p * 2;
      if (t < 1)
        return p * t;
      return 1 - m * m * 2;
    }],
  cubic: [
    p => p * p * p,
    p => {
      const m = p - 1;
      return 1 + m * m * m;
    },
    p => {
      const m = p - 1, t = p * 2;
      if (t < 1) return p * t * t;
      return 1 + m * m * m * 4;
    }],
  quartic: [
    p => p * p * p * p,
    p => {
      const m = p - 1;
      return 1 - m * m * m * m;
    },
    p => {
      const m = p - 1, t = p * 2;
      if (t < 1) return p * t * t * t;
      return 1 - m * m * m * m * 8;
    }
  ],
  quintic: [
    p => p * p * p * p * p,
    p => {
      const m = p - 1;
      return 1 + m * m * m * m * m;
    },
    p => {
      const m = p - 1, t = p * 2;
      if (t < 1) return p * t * t * t * t;
      return 1 + m * m * m * m * m * 16;
    }
  ],
  sextic: [
    p => p * p * p * p * p * p,
    p => {
      const m = p - 1;
      return 1 - m * m * m * m * m * m;
    },
    p => {
      const m = p - 1, t = p * 2;
      if (t < 1) return p * t * t * t * t * t;
      return 1 - m * m * m * m * m * m * 32;
    }],
  septic: [
    p => p * p * p * p * p * p * p,
    p => {
      const m = p - 1;
      return 1 + m * m * m * m * m * m * m;
    },
    p => {
      const m = p - 1, t = p * 2;
      if (t < 1) return p * t * t * t * t * t * t;
      return 1 + m * m * m * m * m * m * m * 64;
    }
  ],
  octic: [
    p => p * p * p * p * p * p * p * p,
    p => {
      const m = p - 1;
      return 1 - m * m * m * m * m * m * m * m;
    },
    p => {
      const m = p - 1, t = p * 2;
      if (t < 1) return p * t * t * t * t * t * t * t;
      return 1 - m * m * m * m * m * m * m * m * 128;
    }
  ],
  circular: [
    p => 1 - Math.sqrt(1 - p * p),
    p => {
      const m = p - 1;
      return Math.sqrt(1 - m * m);
    },
    p => {
      const m = p - 1, t = p * 2;
      if (t < 1) return (1 - Math.sqrt(1 - t * t)) * 0.5; else return (Math.sqrt(1 - 4 * m * m) + 1) * 0.5;
    }],
  exponential: [
    p => (p <= 0) ? 0 : Math.pow(Math.E, -10 * (1 - p)),
    p => 1 - transitions['exponential'][0](1 - p),
    p => {
      const t = p * 2;
      if (t < 1) return 0.5 - 0.5 * transitions['exponential'][1](1 - t);
      return 0.5 + 0.5 * transitions['exponential'][1](t - 1);
    }],
  exponent2: [
    p => (p <= 0) ? 0 : Math.pow(2, 10 * (p - 1)),
    p => {
      if (p >= 1) return 1;
      return 1 - Math.pow(2, -10 * p);
    },
    p => {
      if (p <= 0) return 0;
      if (p >= 1) return 1;
      if (p < 0.5) return Math.pow(2, 10 * (2 * p - 1) - 1);
      else return 1 - Math.pow(2, -10 * (2 * p - 1) - 1);
    }],
  log10: [
    p => 1 - transitions['log10'][1](1 - p),
    p => Math.log10((p * 9) + 1),
    p => {
      const t = p * 2;
      if (t < 1) return 0.5 - 0.5 * transitions['exponential'][1](1 - t);
      return 0.5 + 0.5 * transitions['exponential'][1](t - 1);
    }
  ],
  sqrt: [
    p => 1 - transitions['sqrt'][1](1 - p),
    p => Math.sqrt(p),
    p => {
      const t = p * 2;
      if (t < 1) return 0.5 - 0.5 * transitions['sqrt'][1](1 - t);
      return 0.5 + 0.5 * transitions['sqrt'][1](t - 1);
    }
  ],
  back: [
    p => {
      const k = 1.70158;
      return p * p * (p * (k + 1) - k);
    },
    p => {
      const m = p - 1, k = 1.70158;
      return 1 + m * m * (m * (k + 1) + k);
    },
    p => {
      const m = p - 1, t = p * 2, k = 1.70158 * 1.525;
      if (p < 0.5) return p * t * (t * (k + 1) - k); else return 1 + 2 * m * m * (2 * m * (k + 1) + k);
    }],
  bounce: [
    p => 1 - transitions['bounce'][1](1 - p),
    p => {
      const r = 1 / 2.75; // reciprocal
      const k1 = r; // 36.36%
      const k2 = 2 * r; // 72.72%
      const k3 = 1.5 * r; // 54.54%
      const k4 = 2.5 * r; // 90.90%
      const k5 = 2.25 * r; // 81.81%
      const k6 = 2.625 * r; // 95.45%
      const k0 = 7.5625;
      let t;

      /**/
      if (p < k1) {
        return k0 * p * p;
      } else if (p < k2) {
        t = p - k3;
        return k0 * t * t + 0.75;
      } // 48/64
      else if (p < k4) {
        t = p - k5;
        return k0 * t * t + 0.9375;
      } // 60/64
      else {
        t = p - k6;
        return k0 * t * t + 0.984375;
      } // 63/64
    },
    p => {
      const t = p * 2;
      if (t < 1) return 0.5 - 0.5 * transitions['bounce'][1](1 - t);
      return 0.5 + 0.5 * transitions['bounce'][1](t - 1);
    }],
  elastic: [
    p => {
      const m = p - 1;
      return -Math.pow(2, 10 * m) * Math.sin((m * 40 - 3) * Math.PI / 6);
    },
    p => 1 + (Math.pow(2, 10 * -p) * Math.sin((-p * 40 - 3) * Math.PI / 6)),
    p => {
      const s = 2 * p - 1;                 // remap: [0,0.5] -> [-1,0]
      const k = (80 * s - 9) * Math.PI / 18; // and    [0.5,1] -> [0,+1]
      if (s < 0) return -0.5 * Math.pow(2, 10 * s) * Math.sin(k);
      else return 1 + 0.5 * Math.pow(2, -10 * s) * Math.sin(k);
    }
  ]
};
export const transitionTypes = Object.keys(transitions);
export const transitionNames = Object.keys(transitions);
export const easingTypes = ['in', 'out', 'in-out'];

export const getZoomMult = (from, to) => {
  return Math.pow(to / from, .01);
};

export const getZoom = (from, to, iter, cur) => {
  let mult = getZoomMult(from, to, iter);
  return from * Math.pow(mult, cur);
};

export const ordinalList = length => [...Array(length).keys()].map((_, i) => i);
export class Tween {

  from = 0;
  to = 1;
  easing = 2;
  duration = 3000;
  transition = 'circular';
  zoom = false;
  constructor({ from = 0, to = 1, easing = 2, duration = 3000, transition = 'circular', zoom = false, start = Date.now()}) {
    this.from = from;
    this.delta = to - from;
    this.to = to;
    this.duration = duration;
    this.start = start;
    if (isNum(transition)){
      transition = transitionNames[transition];
    }
    this.transition = transition;
    this.easingName = ['in', 'out', 'in-out'][easing];
    this.easing = easing;
    this.tweener = transitions[transition][easing];
    this.finishVal = to;
    this.zoom = zoom;//logarithmic tween
  }
  get zoomMult(){
    const {from, to} = this;
    return Math.pow(to / from, .01);
  }
  static create(args = {}) {
    return new Tween(args);
  }
  step(p) {
    if (this.paused){
      return this.curVal;
    }
    if (!p){
      p = this.pct();
    }
    if (p > 1) {

      return this.finishVal;
    }

    const b = this.from;
    const c = this.delta;
    const pNow = this.tweener(p);
    let v = b + (pNow * c);

    if (isNaN(v)) {
      debugger;
    }
    return v;
  }
  t() {
    const now = Date.now();
    return now - this.start;
  }
  pct() {
    return this.t() / this.duration;
  }
  pause() {
    if (this.complete || this.paused) {
      return false;
    }
    this.pausedAt = this.pct();
    this.pauseElapsedTime = this.t();
    this.curVal = this.step();
    this.paused = true;
    return true;
  }

  resume() {
    if (!this.paused) {
      //console.log(`can't resume a not-paused or complete tweener`);
      return;
    }
    let now = Date.now();
    this.start = now - this.pauseElapsedTime;
    this.pausedAt = this.pauseElapsedTime = this.paused = null;
  }

  get complete() {
    if (this.pausedAt && this.pausedAt < 1) {
      return false;
    }
    return this.pct() >= 1;
  }

  restart(from, to) {
    if (isNum(from)) {
      this.from = from;
    }
    if (isNum(to)) {
      this.to = to;
      this.finishVal = to;
    }
    this.delta = this.to - this.from;
    if (isNaN(this.delta)) {
      debugger;
    }
    this.paused = false;
    this.start = Date.now();
  }
}

export class PausableTimer {

  constructor(ms, callback) {
    this.start = Date.now();
    this.duration = ms;
    this.callback = callback;
    this.remaining = ms;
    this.timer = setTimeout(() => this.complete(), ms);
    this.paused = false;
  }

  static create(ms, callback) {
    return new PausableTimer(ms, callback);
  }
  static createPromise(ms, instCb){
    return new Promise(res => {
      let timer = new PausableTimer(ms, res);
      if (instCb) {
        instCb(timer);
      }
    });
  }
  complete() {
    if (this.completed){
      return;
    }
    this.completed = true;
    this.callback();
  }

  pause() {
    clearTimeout(this.timer);
    this.paused = true;
    this.elapsed = Date.now() - this.start;
    this.remaining = this.duration - this.elapsed;
  }

  resume() {
    if (!this.paused || this.completed) {
      return;
    }
    this.paused = false;
    this.start = this.remaining - this.elapsed;
    this.timer = setTimeout(() => this.complete(), this.remaining);
  }
}

