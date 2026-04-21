import catalog from '../data/catalog.json'

const base = import.meta.env.BASE_URL

function resolveImage(dir, appName) {
  const exact = `${appName}_Normal.png`
  return `${base}images/${dir}/${exact}`
}

export function useCatalog() {
  const getIronHeads = (dex) => {
    return catalog.heads.irons[dex.toLowerCase()] || []
  }

  const getDriverHeads = () => catalog.heads.drivers

  const getWedgeHeads = (dex) => {
    return catalog.heads.wedges?.[dex.toLowerCase()] || []
  }

  const getIronShafts = (type) => {
    const withSkus = type === 'steel' ? catalog.shafts.steel : catalog.shafts.graphite
    const appOnly = (catalog.shafts.app_only || []).filter(s => s.type === type)
    return [...withSkus, ...appOnly]
  }

  const getDriverShafts = () => catalog.shafts.driver

  const getGrips = () => {
    const withSkus = catalog.grips.with_skus.map(g => ({ ...g, hasSku: true }))
    const appOnly = catalog.grips.app_only.map(name => ({ app_name: name, hasSku: false }))
    return [...withSkus, ...appOnly]
  }

  const getHeadImage = (appName, clubType) => {
    if (clubType === 'driver') {
      const head = catalog.heads.drivers.find(h => h.app_name === appName)
      if (head?.image) return `${base}images/heads/${head.image}`
    }
    // Iron heads - special cases
    if (appName === 'DYNAPWR Max') return `${base}images/heads/DYNAPWR Max_Normal.png`
    if (appName === 'DYNAPWR Max Iron') return `${base}images/heads/DYNAPWR MAX Iron_Normal.png`
    return resolveImage('heads', appName)
  }

  const getShaftImage = (appName) => {
    return resolveImage('shafts', appName)
  }

  const getDriverShaftImage = (model, submodel) => {
    // Try various naming patterns
    const patterns = [
      `${model}_${submodel}`,
      `${model} ${submodel}`,
      `${model}_${submodel.replace(/ /g, '_')}`,
    ]
    // Use underscore-joined version (matches most files)
    const name = `${model.replace(/ /g, '_')}_${submodel.replace(/ /g, '_')}`
    return resolveImage('shafts', name)
  }

  const getGripImage = (appName) => {
    return resolveImage('grips', appName)
  }

  const configOptions = catalog.config_options
  const driverConfig = catalog.driver_config
  const wedgeConfig = catalog.wedge_config

  return {
    catalog,
    getIronHeads,
    getDriverHeads,
    getWedgeHeads,
    getIronShafts,
    getDriverShafts,
    getGrips,
    getHeadImage,
    getShaftImage,
    getDriverShaftImage,
    getGripImage,
    configOptions,
    driverConfig,
    wedgeConfig,
  }
}
