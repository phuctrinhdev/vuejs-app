import PrepaidServiceHistoryAPI    from '../../api/sales/prepaid-services-history-api.js' 

const state_default = {
  prepaid_service_histories_filter : {
    client_id  : 0,
    page_size  : 0,
    page_number: 1,
    shop_id    : 0
  },
  prepaid_service_histories : {
    items: [],
    pagination: {}
  }
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getPrepaidServiceHistories(state) {
    return state.prepaid_service_histories
  },
  getPrepaidServiceHistoriesFilter(state){
    return state.prepaid_service_histories_filter
  }
}

// mutations
const mutations = {
  resetState(state) {
    Object.assign(state, state_default)
  },
  setPrepaidServiceHistoriesFilter(state,filter){
    state.prepaid_service_histories_filter = filter
  },
  setPrepaidServiceHistories(state, prepaid_service_histories) {
    state.prepaid_service_histories = prepaid_service_histories
  }
}

// actions
const actions = {
  setPrepaidServiceHistoriesData({ commit }, prepaid_service_histories) {
    commit('setPrepaidServiceHistories', prepaid_service_histories)
  },
  // Async
  async loadSalesPrepaidServiceHistoriesAsyncData({commit},filter){
    let api = new PrepaidServiceHistoryAPI()
    let response = await api.getPrepaidServiceHistoriesAsync(filter)
    if(response.is_ok){
      commit('setPrepaidServiceHistories', response.data)
    }
    return response
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}