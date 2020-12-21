import TextMessageAPI    from '../../api/messages/text-message-api.js' 

const state_default = {
  client_message_histories_filter : {
    page_size     : 0,
    page_number   : 1,
    country_code  : null,
    shop_id       : 0,
    receiver_key  : '',
    registration_date_from_ts   : 0,
    registration_date_to_ts     : 0,
  },
  client_message_histories : {
    items: [],
    pagination: {}
  }
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getClientMessageHistories(state) {
    return state.client_message_histories
  },
  getClientMessageHistoriesFilter(state){
    return state.client_message_histories_filter
  }
}

// mutations
const mutations = {
  resetState(state) {
    Object.assign(state, state_default)
  },
  setClientMessageHistoriesFilter(state, filter){
    state.client_message_histories_filter = filter
  },
  setClientMessageHistories(state, client_message_histories) {
    state.client_message_histories = client_message_histories
  }
}

// actions
const actions = {
  setClientMessageHistoriesData({ commit }, client_message_histories) {
    commit('setClientMessageHistories', client_message_histories)
  },
  // Async
  async loadClientMessageHistoriesAsyncData({commit}, filter){
    let api = new TextMessageAPI()
    let response = await api.getMessageDetailsByReceiverAsync(filter)
    if(response.is_ok){
      commit('setClientMessageHistories', response.data)
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