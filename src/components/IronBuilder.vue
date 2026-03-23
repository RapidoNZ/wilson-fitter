<template>
  <div class="builder">
    <div class="form-panel">
      <h2>CUSTOM IRON SET BUILDER</h2>

      <!-- 1. DEXTERITY -->
      <div class="field">
        <label>Dexterity</label>
        <div class="toggle">
          <button :class="{ active: dex === 'rh' }" @click="dex = 'rh'">RH</button>
          <button :class="{ active: dex === 'lh' }" @click="dex = 'lh'">LH</button>
        </div>
      </div>

      <!-- 2. MODEL -->
      <div class="field">
        <label>Model</label>
        <select v-model="selectedHead">
          <option :value="null" disabled>Select model...</option>
          <option v-for="h in heads" :key="h.sku" :value="h">{{ h.excel_name }}{{ h.rh_only ? ' (RH only)' : '' }}</option>
        </select>
      </div>

      <!-- 3. MAKE UP (tick boxes) -->
      <div class="field">
        <label>Make Up</label>
        <div class="checkboxes">
          <label v-for="club in makeUpOptions" :key="club" class="checkbox-label">
            <input type="checkbox" :value="club" v-model="selectedMakeUp" />
            <span>{{ club }}</span>
          </label>
        </div>
      </div>

      <!-- 4. SHAFT FLEX -->
      <div class="field">
        <label>Shaft Flex</label>
        <div class="toggle">
          <button v-for="f in allFlexes" :key="f"
            :class="{ active: selectedFlex === f }" @click="selectedFlex = f">{{ f }}</button>
        </div>
      </div>

      <!-- 5. SHAFT MODEL -->
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

      <!-- 6. GRIP SIZE -->
      <div class="field">
        <label>Grip Size</label>
        <select v-model="selectedGripSize">
          <option v-for="s in gripSizeOptions" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>

      <!-- 7. GRIP MODEL -->
      <div class="field">
        <label>Grip Model</label>
        <select v-model="selectedGrip">
          <option :value="null" disabled>Select grip...</option>
          <option v-for="g in grips" :key="g.app_name" :value="g">
            {{ g.excel_name || g.app_name }}
          </option>
        </select>
      </div>

      <!-- 8. LIE ANGLE -->
      <div class="field">
        <label>Lie Angle</label>
        <select v-model="selectedLie">
          <option v-for="l in lieOptions" :key="l" :value="l">{{ l }}</option>
        </select>
      </div>

      <!-- 9. LENGTH -->
      <div class="field">
        <label>Length</label>
        <select v-model="selectedLength">
          <option v-for="l in configOptions.length_adjustments" :key="l" :value="l">{{ l }}</option>
        </select>
      </div>

      <!-- 10. TAPES -->
      <div class="field">
        <label>Tapes</label>
        <select v-model="selectedWraps">
          <option v-for="w in configOptions.grip_wraps" :key="w" :value="w">{{ w }}</option>
        </select>
      </div>

      <!-- 11. NOTES -->
      <div class="field">
        <label>Notes</label>
        <textarea v-model="notes" placeholder="Free text notes..." rows="3"></textarea>
      </div>
    </div>

    <div class="right-panel">
      <ImagePanel :items="imageItems" />
      <BuildSummary :build="build" :makeUp="selectedMakeUp" :notes="notes" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useIronBuilder } from '../composables/useIronBuilder'
import ImagePanel from './ImagePanel.vue'
import BuildSummary from './BuildSummary.vue'

const {
  dex, selectedHead, shaftType, selectedShaft, selectedFlex,
  selectedGrip, selectedGripSize, selectedLie, selectedLength, selectedWraps,
  heads, shafts, grips,
  availableFlexes, availableGripSizes, availableLies,
  configOptions,
  headImage, shaftImage, gripImage,
  build,
} = useIronBuilder()

const notes = ref('')

const makeUpOptions = ['3', '4', '5', '6', '7', '8', '9', 'PW', 'GW', 'SW']
const selectedMakeUp = ref(['5', '6', '7', '8', '9', 'PW', 'GW', 'SW'])

const allFlexes = ['L', 'A', 'R', 'S', 'X']

const gripSizeOptions = ['UNDERSIZE', 'STANDARD', 'MIDSIZE', 'OVERSIZE']

const lieOptions = ['2 FLAT', '1 FLAT', 'STANDARD', '1 UPRIGHT', '2 UPRIGHT']

// Override defaults to match PDF spec
if (!selectedLie.value || selectedLie.value === 'STD') selectedLie.value = 'STANDARD'
if (!selectedWraps.value) selectedWraps.value = '0 WRAPS'
if (!selectedGripSize.value) selectedGripSize.value = 'STANDARD'

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
.field select, .field textarea {
  background: #2a2a2a; border: 1px solid #444; border-radius: 6px;
  padding: 0.6rem 0.8rem; color: #f0f0f0; font-size: 0.9rem;
  font-family: inherit; cursor: pointer;
}
.field textarea { resize: vertical; cursor: text; }
.field select:focus, .field textarea:focus { outline: none; border-color: #e31837; }
.toggle { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.toggle button {
  background: #2a2a2a; border: 1px solid #444; border-radius: 6px;
  padding: 0.5rem 1.2rem; color: #aaa; cursor: pointer; font-family: inherit;
  font-size: 0.85rem; transition: all 0.15s;
}
.toggle button.active { background: #e31837; border-color: #e31837; color: #fff; }
.shaft-type-toggle { margin-bottom: 0.4rem; }
.shaft-type-toggle button { padding: 0.35rem 0.8rem; font-size: 0.75rem; }
.checkboxes { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.checkbox-label {
  display: flex; align-items: center; gap: 0.3rem;
  background: #2a2a2a; border: 1px solid #444; border-radius: 6px;
  padding: 0.4rem 0.7rem; cursor: pointer; transition: all 0.15s;
  font-size: 0.85rem; color: #aaa;
}
.checkbox-label:has(input:checked) { background: #e31837; border-color: #e31837; color: #fff; }
.checkbox-label input { display: none; }
@media (max-width: 768px) {
  .builder { grid-template-columns: 1fr; }
}
</style>
