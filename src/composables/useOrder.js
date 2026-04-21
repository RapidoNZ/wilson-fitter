import { reactive, computed } from 'vue'

const state = reactive({
  customer: '',
  orderNumber: '',
  items: [],
})

let nextId = 1

function snapshotIronBuild(build, makeUp) {
  const clubs = (makeUp || []).map(c => {
    const head = build.resolveClubHead?.(c)
    return {
      club: c,
      head: head?.excel_name || head?.app_name || null,
      head_sku: build.resolveClubSku?.(c) || null,
    }
  })
  return {
    type: 'Iron',
    dexterity: build.dexterity,
    model: build.head,
    head_sku: build.headSku,
    combo_set: !!build.comboSet,
    make_up: makeUp || [],
    clubs,
    shaft: build.shaft,
    shaft_type: build.shaftType,
    flex: build.flex,
    shaft_sku: build.shaftSku,
    grip: build.grip,
    grip_size: build.gripSize,
    grip_sku: build.gripSku,
    lie: build.lie,
    length: build.length,
    tapes: build.wraps,
  }
}

function snapshotDriverBuild(build) {
  return {
    type: 'Driver',
    dexterity: build.dexterity,
    head: build.head,
    shaft_model: build.shaftModel,
    shaft_submodel: build.shaftSubmodel,
    flex: build.flex,
    loft: build.loft,
    adapter_setting: build.adapterSetting,
    weight_config: build.weightConfig,
    grip: build.grip,
    grip_size: build.gripSize,
    grip_sku: build.gripSku,
  }
}

function snapshotWedgeBuild(build) {
  return {
    type: 'Wedge',
    dexterity: build.dexterity,
    model: build.head,
    head_sku: build.headSku,
    loft: build.loft,
    bounce: build.bounce,
    grind: build.grind,
    shaft: build.shaft,
    shaft_type: build.shaftType,
    flex: build.flex,
    shaft_sku: build.shaftSku,
    grip: build.grip,
    grip_size: build.gripSize,
    grip_sku: build.gripSku,
    lie: build.lie,
    length: build.length,
    tapes: build.wraps,
  }
}

export function useOrder() {
  const addItem = (build, extras = {}) => {
    let data
    if (build.type === 'Iron') data = snapshotIronBuild(build, extras.makeUp)
    else if (build.type === 'Driver') data = snapshotDriverBuild(build)
    else if (build.type === 'Wedge') data = snapshotWedgeBuild(build)
    else return

    data.notes = extras.notes || ''
    state.items.push({ id: nextId++, ...data })
  }

  const removeItem = (id) => {
    state.items = state.items.filter(i => i.id !== id)
  }

  const clearOrder = () => {
    state.items = []
  }

  const orderJson = computed(() => ({
    customer: state.customer,
    order_number: state.orderNumber,
    items: state.items.map(({ id, ...rest }) => rest),
  }))

  const itemCount = computed(() => state.items.length)

  return {
    state,
    addItem,
    removeItem,
    clearOrder,
    orderJson,
    itemCount,
  }
}
