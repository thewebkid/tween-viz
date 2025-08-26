<script setup>
import { ref } from 'vue';
import { Tween, transitions, easingTypes, ordinalList } from './lib/tweener';
import { Color } from 'modern-color';
const transitionNames = Object.keys(transitions);
const hueIncr = 360/transitionNames.length;
const colors = ref(
  transitionNames.map((t,i) => [
    Color.parse({h: i*hueIncr, s: 100, l: 50}).lighten(0.25),  
    Color.parse({h: i*hueIncr, s: 100, l: 50}),    
    Color.parse({h: i*hueIncr, s: 100, l: 50}).darken(0.25),
  ])
);
// Generate data for each transition and easing combination
const graphs = ref(transitionNames.map(transition => {
  return easingTypes.map((_easing, easingIndex) => {
    const tw = Tween.create({transition, easing: easingIndex, to: 100, duration: 100});
    return ordinalList(100).map(i => tw.step(i/100));
  });
}));
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
    <div v-for="(transitionGraphs, transitionIndex) in graphs" :key="transitionIndex" class="transition-row">
      <!-- Transition name label -->
      <div class="transition-label">{{ transitionNames[transitionIndex] }}</div>
      
      <!-- Graphs for each easing type -->
      <div v-for="(graphData, easingIndex) in transitionGraphs" :key="easingIndex" class="graph">
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
}

#app {
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
.easing-table {
  font-family: monospace;
  background-color: #005;
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
