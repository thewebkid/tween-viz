<script setup>
import { ref } from 'vue';
import { Tween, transitions, easingTypes, ordinalList } from './lib/tweener';
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
  <nav class="nav-bar">
    <router-link to="/graphs">Graphs</router-link>
    <router-link to="/tweener">Tweener</router-link>
  </nav>
  <router-view />
</template>

<style>
body {
  margin: 0;
  padding: 0;
}

#app {
  margin: 0;
  padding: 0;
}

.nav-bar {
  background-color: #333;
  padding: 10px;
  text-align: center;
}

.nav-bar a {
  color: white;
  margin: 0 20px;
  text-decoration: none;
  font-size: 18px;
}

.nav-bar a.router-link-active {
  color: yellow;
  font-weight: bold;
}
</style>
