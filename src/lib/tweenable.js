class Tweenable {
  prop = null;
  min = null;
  max = null;
  label = null;
  tween = null;
  constructor({prop, min, max, label}) {
    this.prop = prop;
    this.min = min;
    this.max = max;
    this.label = label;
    this.tween = null;
  }
  static create(args) {
    return new Tweenable(args);
  }
}

const canvasSize = 1000;
export const tweenables = [
  Tweenable.create({prop: 'top', min:0, max:canvasSize, label:'X' }),
  Tweenable.create({prop: 'left', min:0, max:canvasSize, label:'Y' }),
  Tweenable.create({prop: 'width', min:5, max:canvasSize/2, label:'Width' }),
  Tweenable.create({prop: 'height', min:5, max:canvasSize/2, label:'Height' }),
  Tweenable.create({prop: 'borderRadius', min:0, max:300, label:'Radius' }),
  Tweenable.create({prop: 'opacity', min:0, max:1, label:'Opacity' }),
  Tweenable.create({prop: 'rotate', min:0, max:360 * 3, label:'Rotate' })
];
