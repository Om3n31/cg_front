<template>
    <div class="context-menu" v-show="show" :style="style" ref="context" tabindex="0" @blur="close" @onclick="open">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">

import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';

const left = ref(0);
const top = ref(0);
const show = ref(true);

const contextRef = ref<HTMLElement | null>(null);

const style = computed(() => ({
  top: `${top.value}px`,
  left: `${left.value}px`,
}));

const close = () => {
  show.value = false;
  left.value = 0;
  top.value = 0;
};

const open = (evt: MouseEvent) => {
  left.value = evt.pageX || evt.clientX;
  top.value = evt.pageY || evt.clientY;

  nextTick(() => {
    if (contextRef.value) {
      contextRef.value.focus();
    }
  });

  show.value = true;
};

defineExpose({
  open,
  close
});

onMounted(() => {
  // Add any additional setup code here.
});

onBeforeUnmount(() => {
  // Add any cleanup code here.
});
</script>

<style scoped>
.context-menu {
  position: fixed;
  background: white;
  z-index: 999;
  outline: none;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  cursor: pointer;
}
</style>
 