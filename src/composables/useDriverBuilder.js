import { ref, computed, watch } from 'vue'
import { useCatalog } from './useCatalog'

export function useDriverBuilder() {
  const { getDriverHeads, getDriverShafts, getGrips, getHeadImage, getDriverShaftImage, getGripImage, driverConfig } = useCatalog()

  const selectedDex = ref('RH')
  const selectedHead = ref(null)
  const selectedShaftModel = ref(null)
  const selectedSubmodel = ref(null)
  const selectedFlex = ref(null)
  const selectedLoft = ref(null)
  const selectedAdapter = ref('STD')
  const selectedWeight = ref('NEUTRAL')
  const selectedGrip = ref(null)
  const selectedGripSize = ref('STANDARD')

  const heads = computed(() => getDriverHeads())
  const shaftModels = computed(() => getDriverShafts())
  const grips = computed(() => getGrips())

  const submodels = computed(() => {
    if (!selectedShaftModel.value) return []
    return selectedShaftModel.value.submodels || []
  })

  watch(selectedShaftModel, () => { selectedSubmodel.value = null })

  const headImage = computed(() => {
    if (!selectedHead.value) return null
    return getHeadImage(selectedHead.value.app_name, 'driver')
  })

  const shaftImage = computed(() => {
    if (!selectedShaftModel.value || !selectedSubmodel.value) return null
    return getDriverShaftImage(selectedShaftModel.value.app_name, selectedSubmodel.value)
  })

  const gripImage = computed(() => {
    if (!selectedGrip.value) return null
    return getGripImage(selectedGrip.value.app_name)
  })

  const gripSku = computed(() => {
    if (!selectedGrip.value?.sizes || !selectedGripSize.value) return null
    return selectedGrip.value.sizes[selectedGripSize.value.toLowerCase()] || null
  })

  const build = computed(() => ({
    type: 'Driver',
    dexterity: selectedDex.value,
    head: selectedHead.value?.app_name,
    shaftModel: selectedShaftModel.value?.app_name,
    shaftSubmodel: selectedSubmodel.value,
    flex: selectedFlex.value,
    loft: selectedLoft.value,
    adapterSetting: selectedAdapter.value,
    weightConfig: selectedWeight.value,
    grip: selectedGrip.value?.excel_name || selectedGrip.value?.app_name,
    gripSize: selectedGripSize.value,
    gripSku: gripSku.value,
  }))

  return {
    selectedDex, selectedHead, selectedShaftModel, selectedSubmodel,
    selectedFlex, selectedLoft, selectedAdapter, selectedWeight,
    selectedGrip, selectedGripSize,
    heads, shaftModels, submodels, grips,
    driverConfig,
    headImage, shaftImage, gripImage,
    build,
  }
}
