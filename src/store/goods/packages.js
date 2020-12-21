import PackageApi from '../../api/goods/package-api'

const state_default = {
  packages: {},
  package_action: {
    action: 0,
    data: {}
  }
}


// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getPackage(state){ 
    return state.packages
  },
  getPackageAction(state) {
    return state.package_action
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setPackage(state, packages){  
    state.packages = packages
  },
  updatePackage(state, package_edit){ 
    for(let key in state.packages.data.items){
      if(state.packages.data.items[key].id == package_edit.id){
        state.packages.data.items[key] = Object.assign(state.packages.data.items[key], package_edit)
      }
    }
  },
  setPackageAction(state, package_action){
    state.package_action = package_action
  },
}

// actions
const actions = {
  async getPackageDataAsync({commit}, filter){
    try {
      let package_api = new PackageApi()
      let result = await package_api.getPackagesAsync(filter)
      
      commit('setPackage', result)
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  updatePackageData({commit}, package_data){
    commit('updatePackage', package_data)
  },
  setPackageActionData({commit}, package_action){
    commit('setPackageAction', package_action)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
