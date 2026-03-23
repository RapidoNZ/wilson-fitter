<template>
  <div class="image-panel">
    <div class="image-slot" v-for="item in items" :key="item.label">
      <img v-if="item.src" :src="item.src" :alt="item.label" @error="onError($event)" />
      <div v-else class="placeholder">{{ item.label }}</div>
      <span class="label">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, default: () => [] }
  // Each item: { label: 'Head', src: '/images/...' }
})

function onError(e) {
  e.target.style.display = 'none'
  e.target.parentElement.querySelector('.placeholder')?.style?.removeProperty('display')
}
</script>

<style scoped>
.image-panel { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
.image-slot {
  background: #222; border-radius: 10px; padding: 1rem;
  display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
  width: 180px; min-height: 180px; justify-content: center;
}
.image-slot img { max-width: 160px; max-height: 160px; object-fit: contain; }
.placeholder { color: #555; font-size: 0.8rem; text-align: center; }
.label { font-size: 0.75rem; color: #888; text-transform: uppercase; letter-spacing: 0.1em; }
</style>
