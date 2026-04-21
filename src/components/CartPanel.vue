<template>
  <aside class="cart">
    <div class="cart-header">
      <h3>ORDER</h3>
      <span class="count">{{ itemCount }} {{ itemCount === 1 ? 'item' : 'items' }}</span>
    </div>

    <div v-if="!itemCount" class="empty">
      No clubs added yet.<br />Pick a club type to start.
    </div>

    <ul v-else class="items">
      <li v-for="item in state.items" :key="item.id" class="item">
        <div class="item-head">
          <span class="type">{{ item.type }}</span>
          <span class="title">{{ itemTitle(item) }}</span>
          <button class="remove" @click="removeItem(item.id)" title="Remove">×</button>
        </div>
        <dl class="item-details">
          <template v-for="(val, key) in itemDetails(item)" :key="key">
            <dt>{{ key }}</dt>
            <dd :class="{ sku: key.toLowerCase().includes('sku') }">{{ val || '—' }}</dd>
          </template>
        </dl>
        <div v-if="item.clubs?.length && item.combo_set" class="combo">
          <div class="combo-label">Per-Club Heads</div>
          <div v-for="c in item.clubs" :key="c.club" class="combo-row">
            <span>{{ c.club }}</span>
            <span>{{ c.head || '—' }}</span>
            <span class="sku">{{ c.head_sku || '—' }}</span>
          </div>
        </div>
      </li>
    </ul>

    <div class="actions">
      <button class="primary" :disabled="!itemCount" @click="exportJson">Export Order JSON</button>
      <button class="secondary" :disabled="!itemCount" @click="clearOrder">Clear Order</button>
    </div>
  </aside>
</template>

<script setup>
import { useOrder } from '../composables/useOrder'

const { state, itemCount, removeItem, clearOrder, orderJson } = useOrder()

function itemTitle(item) {
  if (item.type === 'Iron') return `${item.dexterity} ${item.model}${item.combo_set ? ' (combo)' : ''}`
  if (item.type === 'Driver') return `${item.dexterity} ${item.head || ''}`
  if (item.type === 'Wedge') return `${item.dexterity} ${item.model} ${item.loft || ''}°`
  return ''
}

function itemDetails(item) {
  if (item.type === 'Iron') {
    return {
      'Make Up': item.make_up?.join(', ') || '—',
      'Head SKU': item.combo_set ? '(per-club)' : item.head_sku,
      'Shaft': `${item.shaft || ''} ${item.flex || ''}`.trim(),
      'Shaft SKU': item.shaft_sku,
      'Grip': `${item.grip || ''} ${item.grip_size || ''}`.trim(),
      'Grip SKU': item.grip_sku,
      'Lie / Length': `${item.lie || ''} / ${item.length || ''}`,
      'Tapes': item.tapes,
    }
  }
  if (item.type === 'Driver') {
    return {
      'Shaft': `${item.shaft_model || ''} ${item.shaft_submodel || ''}`.trim(),
      'Flex': item.flex,
      'Loft': item.loft ? `${item.loft}°` : null,
      'Adapter': item.adapter_setting,
      'Weight': item.weight_config,
      'Grip': `${item.grip || ''} ${item.grip_size || ''}`.trim(),
      'Grip SKU': item.grip_sku,
    }
  }
  if (item.type === 'Wedge') {
    return {
      'Loft / Bounce': `${item.loft || ''}° / ${item.bounce || ''}°`,
      'Grind': item.grind,
      'Head SKU': item.head_sku,
      'Shaft': `${item.shaft || ''} ${item.flex || ''}`.trim(),
      'Shaft SKU': item.shaft_sku,
      'Grip': `${item.grip || ''} ${item.grip_size || ''}`.trim(),
      'Grip SKU': item.grip_sku,
      'Lie / Length': `${item.lie || ''} / ${item.length || ''}`,
    }
  }
  return {}
}

function exportJson() {
  const blob = new Blob([JSON.stringify(orderJson.value, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const name = state.orderNumber?.trim() || state.customer?.trim() || 'wilson-order'
  a.href = url
  a.download = `${name.replace(/[^a-z0-9_-]+/gi, '_')}.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.cart {
  background: #1e1e1e; border: 1px solid #333; border-radius: 10px;
  padding: 1.2rem; display: flex; flex-direction: column; gap: 1rem;
  position: sticky; top: 1rem; max-height: calc(100vh - 2rem); overflow: auto;
}
.cart-header { display: flex; justify-content: space-between; align-items: baseline; }
h3 { font-size: 0.85rem; letter-spacing: 0.2em; color: #e31837; }
.count { color: #888; font-size: 0.75rem; }
.empty { color: #666; font-size: 0.85rem; text-align: center; padding: 1.5rem 0; line-height: 1.5; }
.items { list-style: none; display: flex; flex-direction: column; gap: 0.8rem; }
.item { background: #252525; border: 1px solid #333; border-radius: 8px; padding: 0.8rem; }
.item-head { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
.item-head .type { font-size: 0.65rem; letter-spacing: 0.15em; color: #e31837; background: #2a1a1d; padding: 0.15rem 0.4rem; border-radius: 4px; }
.item-head .title { flex: 1; font-size: 0.9rem; color: #eee; font-weight: 500; }
.remove { background: none; border: 1px solid #444; color: #888; width: 22px; height: 22px; border-radius: 4px; cursor: pointer; font-size: 1rem; line-height: 1; padding: 0; }
.remove:hover { border-color: #e31837; color: #e31837; }
.item-details { display: grid; grid-template-columns: auto 1fr; gap: 0.2rem 0.6rem; font-size: 0.75rem; }
.item-details dt { color: #777; }
.item-details dd { color: #ddd; }
.item-details dd.sku { font-family: monospace; color: #e31837; font-size: 0.7rem; }
.combo { margin-top: 0.6rem; padding-top: 0.6rem; border-top: 1px solid #333; }
.combo-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin-bottom: 0.3rem; }
.combo-row { display: grid; grid-template-columns: 30px 1fr auto; gap: 0.4rem; font-size: 0.72rem; color: #ccc; padding: 0.1rem 0; }
.combo-row .sku { font-family: monospace; color: #e31837; }
.actions { display: flex; flex-direction: column; gap: 0.5rem; margin-top: auto; padding-top: 0.5rem; border-top: 1px solid #333; }
.actions button {
  padding: 0.6rem 1rem; border-radius: 6px; font-family: inherit; font-size: 0.85rem;
  cursor: pointer; border: none; letter-spacing: 0.05em;
}
.actions button:disabled { opacity: 0.4; cursor: not-allowed; }
.primary { background: #e31837; color: #fff; }
.primary:not(:disabled):hover { background: #c41530; }
.secondary { background: transparent; color: #888; border: 1px solid #444 !important; }
.secondary:not(:disabled):hover { color: #e31837; border-color: #e31837 !important; }
</style>
