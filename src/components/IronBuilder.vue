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
        <label>{{ comboSet ? 'Default Model' : 'Model' }}</label>
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

      <!-- 3b. COMBO SET -->
      <div class="field">
        <label class="checkbox-label inline">
          <input type="checkbox" v-model="comboSet" />
          <span>Combo set (mix head models across clubs)</span>
        </label>
      </div>

      <div class="field" v-if="comboSet && selectedMakeUp.length">
        <label>Per-Club Heads</label>
        <div class="per-club-list">
          <div v-for="club in orderedMakeUp" :key="club" class="per-club-row">
            <span class="club-num">{{ club }}</span>
            <select :value="perClubHeads[club]?.sku || ''" @change="setClubHead(club, $event.target.value)">
              <option value="">Default ({{ selectedHead?.excel_name || '—' }})</option>
              <option v-for="h in heads" :key="h.sku" :value="h.sku">{{ h.excel_name }}</option>
            </select>
          </div>
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
      <BuildSummary :build="build" :makeUp="orderedMakeUp" :notes="notes" />
      <button class="add-btn" :disabled="!canAdd" @click="addToCart">
        {{ canAdd ? 'Add to Order' : 'Complete selections to add' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useIronBuilder } from '../composables/useIronBuilder'
import { useOrder } from '../composables/useOrder'
import ImagePanel from './ImagePanel.vue'
import BuildSummary from './BuildSummary.vue'

const emit = defineEmits(['added'])
const { addItem } = useOrder()

const {
  dex, selectedHead, shaftType, selectedShaft, selectedFlex,
  selectedGrip, selectedGripSize, selectedLie, selectedLength, selectedWraps,
  comboSet, perClubHeads,
  heads, shafts, grips,
  availableFlexes, availableGripSizes,
  configOptions,
  headImage, shaftImage, gripImage,
  build,
} = useIronBuilder()

const notes = ref('')

const makeUpOptions = ['3', '4', '5', '6', '7', '8', '9', 'PW', 'GW', 'SW']
const selectedMakeUp = ref(['5', '6', '7', '8', '9', 'PW', 'GW', 'SW'])
const orderedMakeUp = computed(() => makeUpOptions.filter(c => selectedMakeUp.value.includes(c)))

const canAdd = computed(() =>
  !!build.value.head && !!build.value.shaft && !!build.value.grip && orderedMakeUp.value.length > 0
)

function addToCart() {
  if (!canAdd.value) return
  addItem(build.value, { makeUp: orderedMakeUp.value, notes: notes.value })
  emit('added')
}

function setClubHead(club, sku) {
  if (!sku) {
    const { [club]: _, ...rest } = perClubHeads.value
    perClubHeads.value = rest
  } else {
    const head = heads.value.find(h => h.sku === sku)
    perClubHeads.value = { ...perClubHeads.value, [club]: head }
  }
}

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
.field select, .field textarea, .field input[type="text"] {
  background: #2a2a2a; border: 1px solid #444; border-radius: 6px;
  padding: 0.6rem 0.8rem; color: #f0f0f0; font-size: 0.9rem;
  font-family: inherit; cursor: pointer;
}
.field input[type="text"] { cursor: text; }
.field textarea { resize: vertical; cursor: text; }
.field select:focus, .field textarea:focus, .field input[type="text"]:focus { outline: none; border-color: #e31837; }
.per-club-list { display: flex; flex-direction: column; gap: 0.4rem; }
.per-club-row { display: grid; grid-template-columns: 40px 1fr; align-items: center; gap: 0.6rem; }
.per-club-row .club-num { color: #aaa; font-size: 0.85rem; font-weight: 600; }
.per-club-row select {
  background: #2a2a2a; border: 1px solid #444; border-radius: 6px;
  padding: 0.4rem 0.6rem; color: #f0f0f0; font-size: 0.85rem; font-family: inherit; width: 100%;
}
.checkbox-label.inline { background: none; border: none; padding: 0.3rem 0; color: #aaa; cursor: pointer; }
.checkbox-label.inline input { display: inline-block; margin-right: 0.4rem; }
.checkbox-label.inline:has(input:checked) { background: none; color: #e31837; }
.add-btn {
  margin-top: 0.5rem; padding: 0.8rem 1rem; background: #e31837; color: #fff;
  border: none; border-radius: 6px; font-family: inherit; font-size: 0.9rem;
  letter-spacing: 0.1em; cursor: pointer; font-weight: 600;
}
.add-btn:disabled { background: #333; color: #666; cursor: not-allowed; }
.add-btn:not(:disabled):hover { background: #c41530; }
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
