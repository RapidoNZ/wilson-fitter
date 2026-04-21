<template>
  <div class="summary" v-if="hasSelections">
    <h3>BUILD PREVIEW</h3>
    <div class="grid">
      <template v-for="(value, key) in displayItems" :key="key">
        <span class="key">{{ key }}</span>
        <span class="value" :class="{ sku: key.includes('SKU') }">{{ value || '—' }}</span>
      </template>
    </div>
    <div v-if="comboRows.length" class="combo-block">
      <h4>PER-CLUB HEADS</h4>
      <div class="grid">
        <template v-for="row in comboRows" :key="row.club">
          <span class="key">{{ row.club }}</span>
          <span class="value">{{ row.name }} <span class="sku">{{ row.sku || '—' }}</span></span>
        </template>
      </div>
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
      'Model': b.comboSet ? `${b.head} (default)` : b.head,
      'Head SKU': b.comboSet ? '(see per-club)' : b.headSku,
      'Make Up': props.makeUp.length ? props.makeUp.join(', ') : '—',
      'Combo Set': b.comboSet ? 'Yes' : 'No',
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

  if (b.type === 'Wedge') {
    return {
      'Dexterity': b.dexterity,
      'Model': b.head,
      'Head SKU': b.headSku,
      'Loft': b.loft ? `${b.loft}°` : null,
      'Bounce': b.bounce ? `${b.bounce}°` : null,
      'Grind': b.grind,
      'Shaft Flex': b.flex,
      'Shaft Model': b.shaft,
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
    'Dexterity': b.dexterity,
    'Head': b.head,
    'Shaft': `${b.shaftModel || ''} ${b.shaftSubmodel || ''}`.trim(),
    'Flex': b.flex,
    'Loft': b.loft ? `${b.loft}°` : null,
    'Adapter': b.adapterSetting,
    'Weight': b.weightConfig,
    'Grip Size': b.gripSize,
    'Grip Model': b.grip,
    'Grip SKU': b.gripSku,
  }
})

const comboRows = computed(() => {
  const b = props.build
  if (!b || b.type !== 'Iron' || !b.comboSet || typeof b.resolveClubHead !== 'function') return []
  return props.makeUp.map(club => {
    const head = b.resolveClubHead(club)
    return {
      club,
      name: head?.excel_name || head?.app_name || '—',
      sku: b.resolveClubSku(club),
    }
  })
})
</script>

<style scoped>
.summary {
  background: #1e1e1e; border: 1px solid #333; border-radius: 10px;
  padding: 1.5rem; margin-top: 1.5rem;
}
h3 { font-size: 0.85rem; letter-spacing: 0.2em; color: #e31837; margin-bottom: 1rem; }
h4 { font-size: 0.75rem; letter-spacing: 0.2em; color: #e31837; margin: 1rem 0 0.6rem; }
.grid { display: grid; grid-template-columns: 120px 1fr; gap: 0.4rem 1rem; }
.key { color: #777; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
.value { color: #eee; font-size: 0.9rem; }
.value.sku { font-family: monospace; color: #e31837; font-size: 0.8rem; }
.value .sku { font-family: monospace; color: #e31837; font-size: 0.75rem; margin-left: 0.4rem; }
.notes-display { margin-top: 0.8rem; display: flex; flex-direction: column; gap: 0.2rem; }
.combo-block { margin-top: 0.6rem; padding-top: 0.6rem; border-top: 1px solid #333; }
</style>
