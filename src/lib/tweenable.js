import {Tween} from '@/lib/tweener.js';

class Tweenable {
  prop = null;
  min = null;
  max = null;
  start=null;
  end = null;
  label = null;
  tween = null;
  include = false;
  transition=null;
  easing = null;
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
  run({transition, easing, duration}){
    const {start,end} = this;
    if (this.transition !== null){
      transition = this.transition;
    }
    if (this.easing !== null){
      easing = this.easing;
    }
    this.tween = Tween.create({transition, easing, duration, from:start, to:end});
  }
  disable(){
    this.include = false;
  }
  enable(){
    this.include = true;
    this.start = this.start ?? this.min;
    this.end = this.end ?? this.max;
  }
  get cssVal(){
    if (!this.include) {
      return {};
    }
    const v = this.tween ? this.tween.step() : this.start ?? this.min;
    if (this.prop === 'rotate') {
      return {transform: `rotate(${v}deg)`}
    }
    if (this.prop === 'opacity') {
      return {opacity: v}
    }
    if (this.prop === 'borderRadius') {
      return {borderRadius: `${v}%`}
    }
    return {[this.prop]: `${v}px`}
  }

}

const canvasSize = 1000;
export const tweenables = [
  Tweenable.create({prop: 'top', min:0, max:canvasSize, label:'Y' }),
  Tweenable.create({prop: 'left', min:0, max:canvasSize, label:'X' }),
  Tweenable.create({prop: 'width', min:5, max:canvasSize/2, label:'Width' }),
  Tweenable.create({prop: 'height', min:5, max:canvasSize/2, label:'Height' }),
  Tweenable.create({prop: 'borderRadius', min:0, max:50, label:'Radius(%)' }),
  Tweenable.create({prop: 'opacity', min:0, max:1, label:'Opacity' }),
  Tweenable.create({prop: 'rotate', min:0, max:360 * 6, label:'Rotate' })
];
