<template>
  <div class="app">
    <ClubTypeSelector v-model="clubType" />
    <div class="content" v-if="clubType">
      <button class="back" @click="clubType = null">&larr; Back</button>
      <IronBuilder v-if="clubType === 'iron'" />
      <DriverBuilder v-if="clubType === 'driver'" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ClubTypeSelector from './components/ClubTypeSelector.vue'
import IronBuilder from './components/IronBuilder.vue'
import DriverBuilder from './components/DriverBuilder.vue'

const clubType = ref(null)
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  background: #141414;
  color: #f0f0f0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
}
.app { max-width: 1100px; margin: 0 auto; padding: 2rem 1.5rem; }
.content { margin-top: 1rem; }
.back {
  background: none; border: none; color: #888; cursor: pointer;
  font-size: 0.85rem; margin-bottom: 1.5rem; font-family: inherit;
  padding: 0.3rem 0;
}
.back:hover { color: #e31837; }
</style>
