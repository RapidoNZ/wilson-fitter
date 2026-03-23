<template>
  <div class="summary" v-if="hasSelections">
    <h3>BUILD SUMMARY</h3>
    <div class="grid">
      <template v-for="(value, key) in displayItems" :key="key">
        <span class="key">{{ key }}</span>
        <span class="value" :class="{ sku: key.includes('SKU') }">{{ value || '—' }}</span>
      </template>
    </div>
    <div class="notes-display" v-if="notes">
      <span class="key">Notes</span>
      <span class="value">{{ notes }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  build: Object,
  makeUp: { type: Array, default: () => [] },
  notes: { type: String, default: '' },
})

const hasSelections = computed(() => {
  if (!props.build) return false
  return props.build.head || props.build.shaft || props.build.shaftModel
})

const displayItems = computed(() => {
  const b = props.build
  if (!b) return {}

  if (b.type === 'Iron') {
    return {
      'Dexterity': b.dexterity,
      'Model': b.head,
      'Head SKU': b.headSku,
      'Make Up': props.makeUp.length ? props.makeUp.join(', ') : '—',
      'Shaft Flex': b.flex,
      'Shaft Model': `${b.shaft || ''}`.trim(),
      'Shaft Type': b.shaftType?.charAt(0).toUpperCase() + b.shaftType?.slice(1),
      'Shaft SKU': b.shaftSku,
      'Grip Size': b.gripSize,
      'Grip Model': b.grip,
      'Grip SKU': b.gripSku,
      'Lie Angle': b.lie,
      'Length': b.length,
      'Tapes': b.wraps,
    }
  }

  return {
    'Head': b.head,
    'Shaft': `${b.shaftModel || ''} ${b.shaftSubmodel || ''}`.trim(),
    'Flex': b.flex,
    'Loft': b.loft ? `${b.loft}°` : null,
    'Adapter': b.adapterSetting,
    'Weight': b.weightConfig,
  }
})
</script>

<style scoped>
.summary {
  background: #1e1e1e; border: 1px solid #333; border-radius: 10px;
  padding: 1.5rem; margin-top: 1.5rem;
}
h3 { font-size: 0.85rem; letter-spacing: 0.2em; color: #e31837; margin-bottom: 1rem; }
.grid { display: grid; grid-template-columns: 120px 1fr; gap: 0.4rem 1rem; }
.key { color: #777; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
.value { color: #eee; font-size: 0.9rem; }
.value.sku { font-family: monospace; color: #e31837; font-size: 0.8rem; }
.notes-display { margin-top: 0.8rem; display: flex; flex-direction: column; gap: 0.2rem; }
</style>
