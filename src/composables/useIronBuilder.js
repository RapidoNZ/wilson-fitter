import { ref, computed, watch } from 'vue'
import { useCatalog } from './useCatalog'

export function useIronBuilder() {
  const { getIronHeads, getIronShafts, getGrips, getHeadImage, getShaftImage, getGripImage, configOptions } = useCatalog()

  const dex = ref('rh')
  const selectedHead = ref(null)
  const shaftType = ref('steel')
  const selectedShaft = ref(null)
  const selectedFlex = ref('R')
  const selectedGrip = ref(null)
  const selectedGripSize = ref('STANDARD')
  const selectedLie = ref('STANDARD')
  const selectedLength = ref('STD')
  const selectedWraps = ref('0 WRAPS')
  const comboSet = ref(false)
  const perClubHeads = ref({})

  const heads = computed(() => getIronHeads(dex.value))
  const shafts = computed(() => getIronShafts(shaftType.value))
  const grips = computed(() => getGrips())

  const availableFlexes = computed(() => {
    if (!selectedShaft.value?.flexes) return ['L', 'A', 'R', 'S', 'X']
    return Object.keys(selectedShaft.value.flexes)
  })

  const availableGripSizes = computed(() => {
    if (!selectedGrip.value?.sizes) return []
    return Object.keys(selectedGrip.value.sizes)
  })

  // Reset cascading selections
  watch(dex, () => { selectedHead.value = null; perClubHeads.value = {} })
  watch(shaftType, () => { selectedShaft.value = null })
  watch(selectedShaft, () => {
    // Keep flex if available in new shaft, otherwise reset
    if (selectedShaft.value?.flexes && selectedFlex.value) {
      if (!selectedShaft.value.flexes[selectedFlex.value]) {
        selectedFlex.value = Object.keys(selectedShaft.value.flexes)[0] || null
      }
    }
  })

  // Use upright SKU if lie is upright and head has one
  const headSku = computed(() => {
    if (!selectedHead.value) return null
    const lie = selectedLie.value
    if ((lie === '1 UPRIGHT' || lie === '2 UPRIGHT') && selectedHead.value.sku_upright) {
      return selectedHead.value.sku_upright
    }
    return selectedHead.value.sku || null
  })
  const shaftSku = computed(() => {
    if (!selectedShaft.value?.flexes || !selectedFlex.value) return null
    return selectedShaft.value.flexes[selectedFlex.value] || null
  })
  const gripSku = computed(() => {
    if (!selectedGrip.value?.sizes || !selectedGripSize.value) return null
    // Map grip size to the sizes object key (lowercase)
    const sizeKey = selectedGripSize.value.toLowerCase()
    return selectedGrip.value.sizes[sizeKey] || null
  })

  const headImage = computed(() => {
    if (!selectedHead.value) return null
    return getHeadImage(selectedHead.value.app_name, 'iron')
  })
  const shaftImage = computed(() => {
    if (!selectedShaft.value) return null
    return getShaftImage(selectedShaft.value.app_name)
  })
  const gripImage = computed(() => {
    if (!selectedGrip.value) return null
    return getGripImage(selectedGrip.value.app_name)
  })

  // Per-club head resolution for combo sets
  const resolveClubHead = (club) => {
    const override = perClubHeads.value[club]
    return override || selectedHead.value
  }
  const resolveClubSku = (club) => {
    const head = resolveClubHead(club)
    if (!head) return null
    const lie = selectedLie.value
    if ((lie === '1 UPRIGHT' || lie === '2 UPRIGHT') && head.sku_upright) return head.sku_upright
    return head.sku || null
  }

  const build = computed(() => ({
    type: 'Iron',
    dexterity: dex.value.toUpperCase(),
    head: selectedHead.value?.excel_name || selectedHead.value?.app_name,
    headSku: headSku.value,
    comboSet: comboSet.value,
    resolveClubHead,
    resolveClubSku,
    shaft: selectedShaft.value?.excel_name || selectedShaft.value?.app_name,
    shaftType: shaftType.value,
    flex: selectedFlex.value,
    shaftSku: shaftSku.value,
    grip: selectedGrip.value?.excel_name || selectedGrip.value?.app_name,
    gripSize: selectedGripSize.value,
    gripSku: gripSku.value,
    lie: selectedLie.value,
    length: selectedLength.value,
    wraps: selectedWraps.value,
  }))

  return {
    dex, selectedHead, shaftType, selectedShaft, selectedFlex,
    selectedGrip, selectedGripSize, selectedLie, selectedLength, selectedWraps,
    comboSet, perClubHeads,
    heads, shafts, grips,
    availableFlexes, availableGripSizes,
    configOptions,
    headImage, shaftImage, gripImage,
    build,
  }
}
