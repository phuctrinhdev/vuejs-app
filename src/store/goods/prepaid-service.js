import PrepaidServiceApi from '../../api/goods/prepaid-service-api'

const state_default = {
  prepaid_services: {},
  prepaid_service_action: {
    action: 0,
    data: {}
  }
}


// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getPrepaidServices(state){
    return state.prepaid_services
  },
  getPrepaidServiceAction(state) { 
    return state.prepaid_service_action
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setPrepaidServices(state, prepaid_services){
    state.prepaid_services = prepaid_services
  },
  setPrepaidServiceAction(state, prepaid_service_action){
    state.prepaid_service_action = prepaid_service_action
  },
  updatePrepaidService(state, prepaid_service){
    for(let key in state.prepaid_services.data.items){
      if(state.prepaid_services.data.items[key].id == prepaid_service.id){
        state.prepaid_services.data.items[key] = Object.assign(state.prepaid_services.data.items[key], prepaid_service)
      }
    }
  },
}

// actions
const actions = {
  async getPrepaidServicesDataAsync({commit}, filter){
    try {
      let prepaid_service_api = new PrepaidServiceApi()
      let result = await prepaid_service_api.getPrepaidServiceAsync(filter)
      commit('setPrepaidServices', result)
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  setPrepaidServiceActionData({commit}, prepaid_service_action){
    commit('setPrepaidServiceAction', prepaid_service_action)
  },
  updatePrepaidServiceData({commit}, prepaid_service){
    commit('updateProductCategory', prepaid_service)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
