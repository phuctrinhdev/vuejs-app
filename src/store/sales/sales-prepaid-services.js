import PrepaidServiceViewModel from '../../view-model/sales/prepaid-service/prepaid-service-view-model'
import PrepaidServicesAPI      from '../../api/sales/prepaid-services-api.js'

const state_default = {
  prepaid_services_filter : {
    client_id             : 0,
    show_expired          : false,
    include_family_service: false,
    page_size             : 0,
    page_number           : 1,
    shop_id               : 0
  },
  prepaid_services        : {
    items     : [],
    pagination: {}
  },
  prepaid_services_action : {
    action: 0,
    data: new PrepaidServiceViewModel().fields
  }
}

// initial state
const state = Object.assign({}, state_default)

export default {
  namespaced: true,
  state: state,
  getters: {
    getPrepaidServices(state) {
      return state.prepaid_services
    },
    getPrepaidServicesAction(state) {
      return state.prepaid_services_action
    },
    getPrepaidServicesFilter(state){
      return state.prepaid_services_filter
    }
  },
  mutations: {
    resetState(state){
      Object.assign(state, state_default)
    },
    setPrepaidServicesFilter(state,filter){
      state.prepaid_services_filter = filter
    },
    setPrepaidServices(state, prepaid_services) {
      state.prepaid_services = prepaid_services
    },
    setPrepaidServicesAction(state, prepaid_services_action) {
      state.prepaid_services_action = prepaid_services_action
    },
    updatePrepaidService(state, prepaid_service) {
      for (let i in state.prepaid_services.items) {
        if (state.prepaid_services.items[i].id == prepaid_service.id) {
          state.prepaid_services.items[i] = Object.assign(state.prepaid_services.items[i], prepaid_service)
        }
      }
    }
  },
  actions: {
    async loadSalesPrepaidServicesAsyncData(context,filter){
      let api = new PrepaidServicesAPI()
      let response = await api.getPrepaidServicesAsync(filter)
      if(response.is_ok){
        context.commit('setPrepaidServices', response.data)
      }
      return response
    }
  }
}