<template>
  <div class="app">
    <header class="order-header">
      <h1>WILSON CLUB FITTER</h1>
      <div class="order-fields">
        <div class="field">
          <label>Customer</label>
          <input v-model="state.customer" type="text" placeholder="Customer name" />
        </div>
        <div class="field">
          <label>Order #</label>
          <input v-model="state.orderNumber" type="text" placeholder="Order number" />
        </div>
      </div>
    </header>

    <div class="layout">
      <main class="main">
        <ClubTypeSelector v-if="!clubType" v-model="clubType" />
        <div v-else class="builder-wrap">
          <button class="back" @click="clubType = null">&larr; Back to club picker</button>
          <IronBuilder v-if="clubType === 'iron'" @added="clubType = null" />
          <DriverBuilder v-if="clubType === 'driver'" @added="clubType = null" />
          <WedgeBuilder v-if="clubType === 'wedge'" @added="clubType = null" />
        </div>
      </main>
      <CartPanel class="cart-col" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ClubTypeSelector from './components/ClubTypeSelector.vue'
import IronBuilder from './components/IronBuilder.vue'
import DriverBuilder from './components/DriverBuilder.vue'
import WedgeBuilder from './components/WedgeBuilder.vue'
import CartPanel from './components/CartPanel.vue'
import { useOrder } from './composables/useOrder'

const { state } = useOrder()
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
.app { max-width: 1400px; margin: 0 auto; padding: 1.5rem 1.5rem 3rem; }

.order-header {
  display: flex; flex-wrap: wrap; gap: 1.5rem; align-items: flex-end;
  padding-bottom: 1.2rem; margin-bottom: 1.5rem; border-bottom: 1px solid #2a2a2a;
}
.order-header h1 {
  font-size: 1.3rem; letter-spacing: 0.3em; flex: 1; min-width: 240px;
}
.order-fields { display: flex; gap: 1rem; flex-wrap: wrap; }
.order-fields .field { display: flex; flex-direction: column; gap: 0.25rem; }
.order-fields label {
  font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: #888;
}
.order-fields input {
  background: #2a2a2a; border: 1px solid #444; border-radius: 6px;
  padding: 0.5rem 0.7rem; color: #f0f0f0; font-size: 0.85rem;
  font-family: inherit; min-width: 200px;
}
.order-fields input:focus { outline: none; border-color: #e31837; }

.layout {
  display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 2rem;
}
.main { min-width: 0; }
.back {
  background: none; border: none; color: #888; cursor: pointer;
  font-size: 0.85rem; margin-bottom: 1.2rem; font-family: inherit;
  padding: 0.3rem 0;
}
.back:hover { color: #e31837; }

@media (max-width: 960px) {
  .layout { grid-template-columns: 1fr; }
  .cart-col { position: static !important; max-height: none !important; }
}
</style>
