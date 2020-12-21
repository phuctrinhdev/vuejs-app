import ServiceApi from '../../api/goods/service-api'
import PrepaidServiceApi from '../../api/goods/prepaid-service-api'

const state_default = {
  services: {},
  service_not_prepaids: {},
  service_action: {
    action: 0,
    data: {}
  } 
}


// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getService(state){
    return state.services
  },
  getServiceNotPrepaid(state){
    return state.service_not_prepaids
  },
  getServiceAction(state) {
    return state.service_action
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setService(state, services){  
    state.services = services
  },
  setServiceNotPrepaid(state, service_not_prepaids){  
    state.service_not_prepaids = service_not_prepaids
  },
  updateService(state, service_edit){ 
    for(let key in state.services.data.items){
      if(state.services.data.items[key].id == service_edit.id){
        state.services.data.items[key] = Object.assign(state.services.data.items[key], service_edit)
      }
    }
  },
  setServiceAction(state, service_action){
    state.service_action = service_action
  },
}

// actions
const actions = {  
  async getServicesDataAsync({commit}, filter){
    let service_api = new ServiceApi()
    let prepaid_service_api = new PrepaidServiceApi()
    try {
      let result = await service_api.getServicesAsync(filter)
      let result_prepaid_service = await prepaid_service_api.getPrepaidServiceAsync(filter)   
      
      if(result.is_ok && result_prepaid_service.is_ok) {
        Array.prototype.push.apply(result.data.items, result_prepaid_service.data.items)
      }
      else if(result.is_ok && !result_prepaid_service.is_ok) result = result_prepaid_service
      commit('setService', result)
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  async getServicesNotPrepaidDataAsync({commit}, filter){
    let service_api = new ServiceApi() 
    try {
      let result = await service_api.getServicesAsync(filter)  
      commit('setServiceNotPrepaid', result)
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  updateServiceData({commit}, service){
    commit('updateService', service)
  },
  setServiceActionData({commit}, service_action){
    commit('setServiceAction', service_action)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
