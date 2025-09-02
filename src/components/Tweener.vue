<template>
  <div class="d-flex">
    <div class="me-5">
      <h4 class="mb-4" @click="computeCss">Roll a composite tween</h4>
      <div class="d-flex">
        <div>
          <label>Transition</label>
          <b-dropdown size="sm">
            <template #button-content>
              <span>{{transitions[selectedTransition]}}</span>
            </template>
            <b-dropdown-item
                v-for="(trans, i) in transitions" :key="trans"
                @click="selectedTransition = i">{{trans}}</b-dropdown-item>
          </b-dropdown>

        </div>
        <div class="ms-2 me-2">
          <label>Easing</label>
          <b-dropdown size="sm">
            <template #button-content>
              <span>{{easings[selectedEasing]}}</span>
            </template>
            <b-dropdown-item
                v-for="(easing, i) in easings" :key="easing"
                @click="selectedEasing = i">{{easing}}</b-dropdown-item>
          </b-dropdown>
        </div>
        <div>
          <label>Duration</label>
          <b-form-input
              type="number" size="sm"
              :min=".1" :max="10" :step=".1"
              v-model.number="selectedDuration" />
        </div>
      </div>
      <div class="d-flex">
        <div>
          <div v-for="(tween, i) in tweens" :key="tween.prop" class="mt-3">
            <div class="d-flex">

              <b-form-checkbox :checked="tween.include" @input="toggleInclude(tween, $event)">{{tween.label}}</b-form-checkbox>
              <b-dropdown
                  v-if="tween.include"
                  :text="isNum(tween.transition) ? transitions[tween.transition] : 'inherit'">
                <b-dropdown-item @click="tween.transition = null"><em>[inherit]</em></b-dropdown-item>
                <b-dropdown-item
                    v-for="(trans, i) in transitions" :key="trans+tween.prop"
                    @click="tween.transition = i">{{trans}}</b-dropdown-item>
              </b-dropdown>
              <b-dropdown
                  v-if="tween.include"
                  :text="isNum(tween.easing) ? easings[tween.easing] : 'inherit'">
                <b-dropdown-item @click="tween.easing = null"><em>[inherit]</em></b-dropdown-item>
                <b-dropdown-item
                    v-for="(easing, i) in easings" :key="easing+tween.prop"
                    @click="tween.easing = i">{{easing}}</b-dropdown-item>
              </b-dropdown>
            </div>
            <div class="d-flex">
              <div>
                <label>start</label>
                <b-form-input v-if="!tween.isColor"
                    type="number" size="sm"
                    v-model.number="tween.start"
                    :min="tween.min" :max="tween.end != null ? tween.end : tween.max"
                    :step="tween.prop === 'opacity' ? 0.01 : 1"
                    @change="computeCss(tween)" />
                <input type="color" v-else :value="tween.min.hex" @input="tween.min = createColor($event); computeCss(tween)" />
              </div>
              <div class="ms-2">
                <label>end</label>
                <b-form-input v-if="!tween.isColor"
                    type="number" size="sm"
                    v-model.number="tween.end"
                    :min="tween.start != null ? tween.start : tween.min" :max="tween.max"
                    :step="tween.prop === 'opacity' ? 0.01 : 1" @change="computeCss(tween)"
                />
                <input type="color" v-else :value="tween.max.hex" @input="tween.max = createColor($event); computeCss(tween)" />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
    <div class="canvas" @click="setEndCoordAndGo">
      <div class="tweenie" :style="css"></div>
    </div>
  </div>

</template>

<script>
import {tweenables} from '@/lib/tweenable.js';
import {BDropdown, BDropdownItem, BFormCheckbox, BFormInput} from 'bootstrap-vue-next';
import {transitionNames} from '@/lib/tweener.js';
import {Color} from 'modern-color';

export default {
  name: "tween-any",
  components: {BDropdownItem, BDropdown, BFormCheckbox, BFormInput},
  data: () => {
    return {
      selection: {},
      tweens: tweenables,
      selectedTransition:15,
      selectedEasing:1,
      selectedDuration:5,
      css:{}
    };
  },
  computed:{
    isNum(){
      return v=>typeof v === 'number' && !isNaN(v);
    },
    transitions(){
      return transitionNames;
    },
    easings(){
      return ['in','out', 'in->out']
    },
    tweenables(){
      return this.tweens.filter(tw=>tw.include);
    }
  },
  methods: {
    createColor(e){
      return Color.parse(e.target.value)
    },
    toggleInclude(tween, checked) {
      tween.include = checked;
    },
    computeCss(){
      this.css = Object.assign({}, ...this.tweenables.map(t=> t.cssVal));
    },
    step(){
      if (this.tweenables.some(tw =>tw.tween?.complete)) {
        this.tweens.forEach(tw => tw.tween = null);

        return console.log(this.tweenables.filter(tw =>tw.tween?.complete));
      }
      this.computeCss();

      requestAnimationFrame(()=>{
        this.$nextTick(()=>{
          this.step();
        });
      });
    },
    go(){
      const {selectedEasing, selectedTransition, selectedDuration} = this;
      console.log({selectedEasing, selectedTransition, selectedDuration})
      this.tweenables.forEach((tween, index) => {
        tween.run({transition:this.selectedTransition, easing: this.selectedEasing, duration: this.selectedDuration * 1000})
      });
      console.log(this.tweenables)
      this.step();
    },
    setEndCoordAndGo(event){
      const {offsetX, offsetY} = event;
      this.tweens.find(tw => tw.label === 'X').end = offsetX;
      this.tweens.find(tw => tw.label === 'Y').end = offsetY;

      this.go();
    }
  },
  created() {
    this.tweens.forEach((tween, index) => {
      this.$watch(() => this.tweens[index].include, (newVal) => {
        if (newVal) {
          tween.enable();
        } else {
          tween.disable();
          tween.start = null;
          tween.end = null;
        }
      });

      /*this.$watch(() => this.tweens[index].start, (newVal) => {
        if (newVal == null || isNaN(newVal)) return;
        if (!tween.include) {
          tween.enable();
        }
        let clamped = Math.max(tween.min, Math.min(newVal, tween.max));
        if (tween.end != null && clamped > tween.end) {
          clamped = tween.end;
        }
        if (clamped !== newVal) {
          this.$nextTick(() => {
            this.tweens[index].start = clamped;
          });
        }
      });

      this.$watch(() => this.tweens[index].end, (newVal) => {
        if (newVal == null || isNaN(newVal)) return;
        if (!tween.include) {
          tween.enable();
        }
        let clamped = Math.max(tween.start != null ? tween.start : tween.min, Math.min(newVal, tween.max));
        if (tween.start != null && clamped < tween.start) {
          clamped = tween.start;
        }
        if (clamped !== newVal) {
          this.$nextTick(() => {
            this.tweens[index].end = clamped;
          });
        }
      });*/
    });
  },
  mounted() {
    this.tweens.forEach((tween) => {
      if (['width','height'].includes(tween.prop)) {//x,y
        tween.enable();
        tween.start = 50;
        tween.end = 100;
      }
    });
    const tX =this.tweens.find(tw=>tw.label === 'X')
    tX.start = tX.end = 100;
    tX.enable();
    const tY = this.tweens.find(tw=>tw.label === 'Y');
    tY.start = tY.end = 100;
    tY.enable();
    this.computeCss()
  }
}
</script>

<style lang="scss">

*{
  color: #fff;
}
em{
  color:#555;
}
input[type="color"]{
  display:block;
  height: 30px;
  width: 30px;
  border: 1px solid #fff;
  border-radius: 3px;
  padding: 0;
  margin: 0 60px 0 0;
  cursor: pointer;
  &:focus{
    outline: none;
  }
}
.canvas{
  height:1000px;
  width:1000px;
  background: #000;
  margin-top: 10px;
  position: relative;
  .tweenie{
    position: absolute;
    background: #fff;
  }
}
</style>
