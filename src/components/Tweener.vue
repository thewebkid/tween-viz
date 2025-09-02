<template>
  <div>tweens</div>
  <div class="d-flex"></div>
</template>

<script>
import {tweenables} from '@/lib/tweenable.js';

export default {
  name: "tween-any",
  data: () => {
    return {
      selection: {}
    };
  },
  computed:{
    tweenable() {
      return tweenables;
    }
  }
}
</script>

<style scoped>
*{
  color: #fff;
}
</style>
