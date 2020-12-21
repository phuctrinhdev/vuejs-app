import PrepaidCardsHistoryAPI    from '../../api/sales/prepaid-cards-history-api.js' 

const state_default = {
  prepaid_card_histories_filter : {
    client_id  : 0,
    page_size  : 0,
    page_number: 1,
    shop_id    : 0
  },
  prepaid_card_histories : {
    items: [],
    pagination: {}
  }
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getPrepaidCardHistories(state) {
    return state.prepaid_card_histories
  },
  getPrepaidCardHistoriesFilter(state){
    return state.prepaid_card_histories_filter
  }
}

// mutations
const mutations = {
  resetState(state) {
    Object.assign(state, state_default)
  },
  setPrepaidCardHistoriesFilter(state,filter){
    state.prepaid_card_histories_filter = filter
  },
  setPrepaidCardHistories(state, prepaid_card_histories) {
    state.prepaid_card_histories = prepaid_card_histories
  }
}

// actions
const actions = {
  setPrepaidCardHistoriesData({ commit }, prepaid_card_histories) {
    commit('setPrepaidCardHistories', prepaid_card_histories)
  },
  // Async
  async loadSalesPrepaidCardHistoriesAsyncData({commit},filter){
    let api = new PrepaidCardsHistoryAPI()
    let response = await api.getPrepaidCardsHistoriesAsync(filter)
    if(response.is_ok){
      commit('setPrepaidCardHistories', response.data)
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