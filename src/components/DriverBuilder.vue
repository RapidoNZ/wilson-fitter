<template>
  <div class="builder">
    <div class="form-panel">
      <h2>DRIVER BUILDER</h2>

      <div class="field">
        <label>Dexterity</label>
        <div class="toggle-wrap">
          <button :class="{ active: selectedDex === 'RH' }" @click="selectedDex = 'RH'">RH</button>
          <button :class="{ active: selectedDex === 'LH' }" @click="selectedDex = 'LH'">LH</button>
        </div>
      </div>

      <div class="field">
        <label>Head</label>
        <select v-model="selectedHead">
          <option :value="null" disabled>Select head...</option>
          <option v-for="h in heads" :key="h.app_name" :value="h">{{ h.app_name }}</option>
        </select>
      </div>

      <div class="field">
        <label>Shaft</label>
        <select v-model="selectedShaftModel">
          <option :value="null" disabled>Select shaft...</option>
          <option v-for="s in shaftModels" :key="s.app_name" :value="s">{{ s.app_name }}</option>
        </select>
      </div>

      <div class="field" v-if="submodels.length">
        <label>Submodel</label>
        <select v-model="selectedSubmodel">
          <option :value="null" disabled>Select submodel...</option>
          <option v-for="sm in submodels" :key="sm" :value="sm">{{ sm }}</option>
        </select>
      </div>

      <div class="field">
        <label>Flex</label>
        <select v-model="selectedFlex">
          <option :value="null" disabled>Select flex...</option>
          <option v-for="f in driverConfig.shaft_flex_options" :key="f" :value="f">{{ f }}</option>
        </select>
      </div>

      <div class="field">
        <label>Loft</label>
        <select v-model="selectedLoft">
          <option :value="null" disabled>Select loft...</option>
          <option v-for="l in driverConfig.loft_options" :key="l" :value="l">{{ l }}°</option>
        </select>
      </div>

      <div class="field">
        <label>Adapter Setting</label>
        <div class="toggle-wrap">
          <button v-for="a in driverConfig.adapter_settings" :key="a"
            :class="{ active: selectedAdapter === a }" @click="selectedAdapter = a">{{ a }}</button>
        </div>
      </div>

      <div class="field">
        <label>Weight Config</label>
        <div class="toggle-wrap">
          <button v-for="w in driverConfig.weight_configs" :key="w"
            :class="{ active: selectedWeight === w }" @click="selectedWeight = w">{{ w }}</button>
        </div>
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
        <label>Notes</label>
        <textarea v-model="notes" placeholder="Free text notes..." rows="3"></textarea>
      </div>
    </div>

    <div class="right-panel">
      <ImagePanel :items="imageItems" />
      <BuildSummary :build="build" :notes="notes" />
      <button class="add-btn" :disabled="!canAdd" @click="addToCart">
        {{ canAdd ? 'Add to Order' : 'Complete selections to add' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDriverBuilder } from '../composables/useDriverBuilder'
import { useOrder } from '../composables/useOrder'
import ImagePanel from './ImagePanel.vue'
import BuildSummary from './BuildSummary.vue'

const emit = defineEmits(['added'])
const { addItem } = useOrder()

const {
  selectedDex, selectedHead, selectedShaftModel, selectedSubmodel,
  selectedFlex, selectedLoft, selectedAdapter, selectedWeight,
  selectedGrip, selectedGripSize,
  heads, shaftModels, submodels, grips,
  driverConfig,
  headImage, shaftImage, gripImage,
  build,
} = useDriverBuilder()

const notes = ref('')
const gripSizeOptions = ['UNDERSIZE', 'STANDARD', 'MIDSIZE', 'OVERSIZE']

const imageItems = computed(() => [
  { label: 'Head', src: headImage.value },
  { label: 'Shaft', src: shaftImage.value },
  { label: 'Grip', src: gripImage.value },
])

const canAdd = computed(() =>
  !!build.value.head && !!build.value.shaftModel && !!build.value.flex && !!build.value.loft && !!build.value.grip
)

function addToCart() {
  if (!canAdd.value) return
  addItem(build.value, { notes: notes.value })
  emit('added')
}
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
.toggle-wrap { display: flex; gap: 0.4rem; flex-wrap: wrap; }
.toggle-wrap button {
  background: #2a2a2a; border: 1px solid #444; border-radius: 6px;
  padding: 0.5rem 1rem; color: #aaa; cursor: pointer; font-family: inherit;
  font-size: 0.8rem; transition: all 0.15s;
}
.toggle-wrap button.active { background: #e31837; border-color: #e31837; color: #fff; }
.add-btn {
  margin-top: 0.5rem; padding: 0.8rem 1rem; background: #e31837; color: #fff;
  border: none; border-radius: 6px; font-family: inherit; font-size: 0.9rem;
  letter-spacing: 0.1em; cursor: pointer; font-weight: 600;
}
.add-btn:disabled { background: #333; color: #666; cursor: not-allowed; }
.add-btn:not(:disabled):hover { background: #c41530; }
@media (max-width: 768px) {
  .builder { grid-template-columns: 1fr; }
}
</style>
