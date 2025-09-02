<script setup>
import { ref } from 'vue';
import { Tween, transitions, easingTypes, ordinalList } from '../lib/tweener';
import { Color } from 'modern-color';
const transitionNames = Object.keys(transitions);
const hueIncr = 360 / transitionNames.length;
const colors = ref(
  transitionNames.map((t,i) => [
    Color.parse({h: i * hueIncr, s: 100, l: 50}).lighten(0.25),
    Color.parse({h: i * hueIncr, s: 100, l: 50}),
    Color.parse({h: i * hueIncr, s: 100, l: 50}).darken(0.25),
  ])
);
// Generate data for each transition and easing combination
const graphs = ref(transitionNames.map(transition => {
  return easingTypes.map((_easing, easingIndex) => {
    const tw = Tween.create({transition, easing: easingIndex, to: 100, duration: 100});
    return ordinalList(100).map(i => tw.step(i/100));
  });
}));
const animateGraph = (transitionIndex, easingIndex, event) => {
  const graph = event.currentTarget;
  const transition = transitionNames[transitionIndex];
  const ball = document.createElement('div');
  ball.style.position = 'absolute';
  ball.style.width = '12px';
  ball.style.height = '12px';
  ball.style.borderRadius = '50%';
  ball.style.backgroundColor = colors.value[transitionIndex][easingIndex].css;
  ball.style.boxShadow = '0 0 4px #fff';
  ball.style.display = 'none';
  ball.style.transform = 'translate(-50%, -50%)';
  ball.style.zIndex = '101';
  graph.appendChild(ball);
  const tween = Tween.create({
    transition,
    easing: easingIndex,
    from: 0,
    to: 100,
    duration: 3000
  });
  ball.style.display = 'block';
  ball.style.left = '0px';
  ball.style.top = '0px';
  const animate = () => {
    if (tween.complete) {
      ball.style.display = 'none';
      graph.removeChild(ball);
      return;
    }
    const pct = tween.pct();
    const x = pct * 198;
    const y = tween.step() * 2;
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;
    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
};
</script>

<template>
  <div class="easing-table">
    <!-- Header row with easing labels -->
    <div class="header-row">
      <div class="transition-label-header"></div>
      <div v-for="easing in easingTypes" :key="easing" class="easing-header">
        {{ easing }}
      </div>
    </div>

    <!-- Data rows -->
    <div
      v-for="(transitionGraphs, transitionIndex) in graphs"
      :key="transitionIndex" class="transition-row"
      >
      <!-- Transition name label -->
      <div class="transition-label">
        {{ transitionNames[transitionIndex] }}<br/>hue:{{ colors[transitionIndex][1].hsl.h }}
      </div>

      <!-- Graphs for each easing type -->
      <div v-for="(graphData, easingIndex) in transitionGraphs" :key="easingIndex" class="graph" @click="animateGraph(transitionIndex, easingIndex, $event)">
        <span
          v-for="(value, index) in graphData"
          :key="index"
          class="graph-point"
          :style="{
            left: (index * 2) + 'px',
            top: (value * 2) + 'px',
            backgroundColor: colors[transitionIndex][easingIndex].css
          }"
        ></span>
      </div>
    </div>
  </div>

</template>

<style>
/* Global styles to remove body padding/margin */
body {
  margin: 0;
  padding: 0;
  background-color: #005;
}

#app {
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
.easing-table {
  font-family: monospace;

  padding: 20px;
  color: white;
  min-height: 100vh;
  width: 100vw;
  box-sizing: border-box;
}

.header-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.transition-label-header {
  width: 120px;
  margin-right: 16px;
  font-size:22px;
}

.easing-header {
  width: 200px;
  margin-right: 16px;
  text-align: center;
  font-weight: bold;
  font-size: 22px;
}

.transition-row {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.transition-label {
  width: 180px;
  margin-right: 16px;
  font-weight: bold;
  text-align: right;
  font-size: 22px;
}

.graph {
  position: relative;
  display: inline-block;
  width: 200px;
  height: 200px;
  background-color: black;
  margin-right: 28px;
  margin-bottom: 12px;

  box-shadow: 0 0 0 12px #111;
}

.graph-point {
  position: absolute;
  display: inline-block;
  z-index: 100;
  width: 4px;
  height: 4px;
  transform: translate(-1px, -1px);
  background-color: green;
}
</style>
