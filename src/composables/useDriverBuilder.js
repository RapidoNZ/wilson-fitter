import { ref, computed, watch } from 'vue'
import { useCatalog } from './useCatalog'

export function useDriverBuilder() {
  const { getDriverHeads, getDriverShafts, getHeadImage, getDriverShaftImage, driverConfig } = useCatalog()

  const selectedDex = ref('RH')
  const selectedHead = ref(null)
  const selectedShaftModel = ref(null)
  const selectedSubmodel = ref(null)
  const selectedFlex = ref(null)
  const selectedLoft = ref(null)
  const selectedAdapter = ref('STD')
  const selectedWeight = ref('NEUTRAL')

  const heads = computed(() => getDriverHeads())
  const shaftModels = computed(() => getDriverShafts())

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
  }))

  return {
    selectedDex, selectedHead, selectedShaftModel, selectedSubmodel,
    selectedFlex, selectedLoft, selectedAdapter, selectedWeight,
    heads, shaftModels, submodels,
    driverConfig,
    headImage, shaftImage,
    build,
  }
}
