<template>
  <div class="builder">
    <div class="form-panel">
      <h2>CUSTOM WEDGE BUILDER</h2>

      <div class="field">
        <label>Customer / Order #</label>
        <input v-model="customer" type="text" placeholder="Customer name or order #" />
      </div>

      <div class="field">
        <label>Dexterity</label>
        <div class="toggle">
          <button :class="{ active: dex === 'rh' }" @click="dex = 'rh'">RH</button>
          <button :class="{ active: dex === 'lh' }" @click="dex = 'lh'">LH</button>
        </div>
      </div>

      <div class="field">
        <label>Model</label>
        <select v-model="selectedHead">
          <option :value="null" disabled>Select model...</option>
          <option v-for="h in heads" :key="h.sku" :value="h">{{ h.excel_name }}</option>
        </select>
      </div>

      <div class="field">
        <label>Loft</label>
        <div class="toggle">
          <button v-for="l in wedgeConfig.lofts" :key="l"
            :class="{ active: selectedLoft === l }" @click="selectedLoft = l">{{ l }}°</button>
        </div>
      </div>

      <div class="field">
        <label>Bounce</label>
        <div class="toggle">
          <button v-for="b in wedgeConfig.bounces" :key="b"
            :class="{ active: selectedBounce === b }" @click="selectedBounce = b">{{ b }}°</button>
        </div>
      </div>

      <div class="field">
        <label>Grind</label>
        <div class="toggle">
          <button v-for="g in wedgeConfig.grinds" :key="g"
            :class="{ active: selectedGrind === g }" @click="selectedGrind = g">{{ g }}</button>
        </div>
      </div>

      <div class="field">
        <label>Shaft Flex</label>
        <div class="toggle">
          <button v-for="f in allFlexes" :key="f"
            :class="{ active: selectedFlex === f }" @click="selectedFlex = f">{{ f }}</button>
        </div>
      </div>

      <div class="field">
        <label>Shaft Model</label>
        <div class="toggle shaft-type-toggle">
          <button :class="{ active: shaftType === 'steel' }" @click="shaftType = 'steel'">Steel</button>
          <button :class="{ active: shaftType === 'graphite' }" @click="shaftType = 'graphite'">Graphite</button>
        </div>
        <select v-model="selectedShaft">
          <option :value="null" disabled>Select shaft...</option>
          <option v-for="s in shafts" :key="s.app_name" :value="s">
            {{ s.excel_name || s.app_name }}{{ s.flexes ? '' : ' (no SKU)' }}
          </option>
        </select>
      </div>

      <div class="field">
        <label>Grip Size</label>
        <select v-model="selectedGripSize">
          <option v-for="s in gripSizeOptions" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>

      <div class="field">
        <label>Grip Model</label>
        <select v-model="selectedGrip">
          <option :value="null" disabled>Select grip...</option>
          <option v-for="g in grips" :key="g.app_name" :value="g">
            {{ g.excel_name || g.app_name }}
          </option>
        </select>
      </div>

      <div class="field">
        <label>Lie Angle</label>
        <select v-model="selectedLie">
          <option v-for="l in lieOptions" :key="l" :value="l">{{ l }}</option>
        </select>
      </div>

      <div class="field">
        <label>Length</label>
        <select v-model="selectedLength">
          <option v-for="l in configOptions.length_adjustments" :key="l" :value="l">{{ l }}</option>
        </select>
      </div>

      <div class="field">
        <label>Tapes</label>
        <select v-model="selectedWraps">
          <option v-for="w in configOptions.grip_wraps" :key="w" :value="w">{{ w }}</option>
        </select>
      </div>

      <div class="field">
        <label>Notes</label>
        <textarea v-model="notes" placeholder="Free text notes..." rows="3"></textarea>
      </div>
    </div>

    <div class="right-panel">
      <ImagePanel :items="imageItems" />
      <BuildSummary :build="build" :notes="notes" :customer="customer" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useWedgeBuilder } from '../composables/useWedgeBuilder'
import ImagePanel from './ImagePanel.vue'
import BuildSummary from './BuildSummary.vue'

const {
  dex, selectedHead, selectedLoft, selectedBounce, selectedGrind,
  shaftType, selectedShaft, selectedFlex,
  selectedGrip, selectedGripSize, selectedLie, selectedLength, selectedWraps,
  heads, shafts, grips,
  configOptions, wedgeConfig,
  headImage, shaftImage, gripImage,
  build,
} = useWedgeBuilder()

const notes = ref('')
const customer = ref('')

const allFlexes = ['L', 'A', 'R', 'S', 'X']
const gripSizeOptions = ['UNDERSIZE', 'STANDARD', 'MIDSIZE', 'OVERSIZE']
const lieOptions = ['2 FLAT', '1 FLAT', 'STANDARD', '1 UPRIGHT', '2 UPRIGHT']

const imageItems = computed(() => [
  { label: 'Head', src: headImage.value },
  { label: 'Shaft', src: shaftImage.value },
  { label: 'Grip', src: gripImage.value },
])
</script>

<style scoped>
.builder { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
h2 { font-size: 1rem; letter-spacing: 0.2em; margin-bottom: 1.5rem; color: #e31837; }
.form-panel { display: flex; flex-direction: column; gap: 1rem; }
.right-panel { display: flex; flex-direction: column; gap: 1rem; }
.field { display: flex; flex-direction: column; gap: 0.3rem; }
.field label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #888; }
.field select, .field textarea, .field input[type="text"] {
  background: #2a2a2a; border: 1px solid #444; border-radius: 6px;
  padding: 0.6rem 0.8rem; color: #f0f0f0; font-size: 0.9rem;
  font-family: inherit; cursor: pointer;
}
.field input[type="text"] { cursor: text; }
.field textarea { resize: vertical; cursor: text; }
.field select:focus, .field textarea:focus, .field input[type="text"]:focus { outline: none; border-color: #e31837; }
.toggle { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.toggle button {
  background: #2a2a2a; border: 1px solid #444; border-radius: 6px;
  padding: 0.5rem 1.2rem; color: #aaa; cursor: pointer; font-family: inherit;
  font-size: 0.85rem; transition: all 0.15s;
}
.toggle button.active { background: #e31837; border-color: #e31837; color: #fff; }
.shaft-type-toggle { margin-bottom: 0.4rem; }
.shaft-type-toggle button { padding: 0.35rem 0.8rem; font-size: 0.75rem; }
@media (max-width: 768px) {
  .builder { grid-template-columns: 1fr; }
}
</style>
