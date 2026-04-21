import { ref, computed, watch } from 'vue'
import { useCatalog } from './useCatalog'

export function useWedgeBuilder() {
  const { getWedgeHeads, getIronShafts, getGrips, getHeadImage, getShaftImage, getGripImage, configOptions, wedgeConfig } = useCatalog()

  const dex = ref('rh')
  const selectedHead = ref(null)
  const selectedLoft = ref('56')
  const selectedBounce = ref('10')
  const selectedGrind = ref('STD')
  const shaftType = ref('steel')
  const selectedShaft = ref(null)
  const selectedFlex = ref('S')
  const selectedGrip = ref(null)
  const selectedGripSize = ref('STANDARD')
  const selectedLie = ref('STANDARD')
  const selectedLength = ref('STD')
  const selectedWraps = ref('0 WRAPS')

  const heads = computed(() => getWedgeHeads(dex.value))
  const shafts = computed(() => getIronShafts(shaftType.value))
  const grips = computed(() => getGrips())

  const availableFlexes = computed(() => {
    if (!selectedShaft.value?.flexes) return ['L', 'A', 'R', 'S', 'X']
    return Object.keys(selectedShaft.value.flexes)
  })

  watch(dex, () => { selectedHead.value = null })
  watch(shaftType, () => { selectedShaft.value = null })

  const headSku = computed(() => selectedHead.value?.sku || null)
  const shaftSku = computed(() => {
    if (!selectedShaft.value?.flexes || !selectedFlex.value) return null
    return selectedShaft.value.flexes[selectedFlex.value] || null
  })
  const gripSku = computed(() => {
    if (!selectedGrip.value?.sizes || !selectedGripSize.value) return null
    return selectedGrip.value.sizes[selectedGripSize.value.toLowerCase()] || null
  })

  const headImage = computed(() => selectedHead.value ? getHeadImage(selectedHead.value.app_name, 'wedge') : null)
  const shaftImage = computed(() => selectedShaft.value ? getShaftImage(selectedShaft.value.app_name) : null)
  const gripImage = computed(() => selectedGrip.value ? getGripImage(selectedGrip.value.app_name) : null)

  const build = computed(() => ({
    type: 'Wedge',
    dexterity: dex.value.toUpperCase(),
    head: selectedHead.value?.excel_name || selectedHead.value?.app_name,
    headSku: headSku.value,
    loft: selectedLoft.value,
    bounce: selectedBounce.value,
    grind: selectedGrind.value,
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
    dex, selectedHead, selectedLoft, selectedBounce, selectedGrind,
    shaftType, selectedShaft, selectedFlex,
    selectedGrip, selectedGripSize, selectedLie, selectedLength, selectedWraps,
    heads, shafts, grips,
    availableFlexes,
    configOptions, wedgeConfig,
    headImage, shaftImage, gripImage,
    build,
  }
}
