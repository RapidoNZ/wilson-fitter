<template>
  <div class="selector">
    <h1>WILSON CLUB FITTER</h1>
    <p class="subtitle">Select your club type to begin</p>
    <div class="cards">
      <button class="card" :class="{ active: modelValue === 'driver' }" @click="$emit('update:modelValue', 'driver')">
        <span class="card-title">DRIVER</span>
        <span class="card-desc">Custom driver fitting</span>
      </button>
      <button class="card" :class="{ active: modelValue === 'iron' }" @click="$emit('update:modelValue', 'iron')">
        <span class="card-title">IRONS</span>
        <span class="card-desc">Custom iron set fitting</span>
      </button>
      <button class="card" :class="{ active: modelValue === 'wedge' }" @click="$emit('update:modelValue', 'wedge')">
        <span class="card-title">WEDGES</span>
        <span class="card-desc">Custom wedge fitting</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>

<style scoped>
.selector { text-align: center; padding: 2rem 0; }
h1 { font-size: 2rem; letter-spacing: 0.3em; margin-bottom: 0.5rem; }
.subtitle { color: #888; margin-bottom: 2rem; }
.cards { display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap; }
.card {
  background: #2a2a2a; border: 2px solid #3a3a3a; border-radius: 12px;
  padding: 2.5rem 3.5rem; cursor: pointer; transition: all 0.2s;
  display: flex; flex-direction: column; gap: 0.5rem; color: #f0f0f0;
  font-family: inherit;
}
.card:hover { border-color: #e31837; transform: translateY(-2px); }
.card.active { border-color: #e31837; background: #2a1a1d; }
.card-title { font-size: 1.5rem; font-weight: 700; letter-spacing: 0.15em; }
.card-desc { font-size: 0.85rem; color: #888; }
</style>
