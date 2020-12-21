// import                         _ from 'lodash'
import SalesPrepaidCardViewModel from '../../view-model/sales/prepaid-card/prepaid-card-view-model'
import PrepaidCardsAPI           from '../../api/sales/prepaid-cards-api.js'

const state_default = {
  prepaid_cards_filter : {
    client_id            : 0,
    include_expired_card : false,
    include_family_card  : false,
    prepaid_card_type    : 0,
    page_size            : 0,
    page_number          : 1,
    shop_id              : 0
  },
  prepaid_cards        : {
    items: [],
    pagination: {}
  },
  prepaid_card_action  : {
    action: 0,
    data  : new SalesPrepaidCardViewModel().fields
  }
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getSalesPrepaidCards(state) {
    return state.prepaid_cards
  },
  getSalesPrepaidCardAction(state) {
    return state.prepaid_card_action
  },
  getSalesPrepaidCardsFilter(state){
    return state.prepaid_cards_filter
  }
}

// mutations
const mutations = {
  resetState(state) {
    Object.assign(state, state_default)
  },
  setSalesPrepaidCardsFilter(state,filter){
    state.prepaid_cards_filter = filter
  },
  setSalesPrepaidCards(state, prepaid_cards) {
    state.prepaid_cards = prepaid_cards
  },
  setSalesPrepaidCardAction(state, prepaid_card_action) {
    state.prepaid_card_action = prepaid_card_action
  },
  updateSalesPrepaidCard(state, prepaid_card) {
    for (let i in state.prepaid_cards.items) {
      if (state.prepaid_cards.items[i].id == prepaid_card.id) {
        state.prepaid_cards.items[i] = Object.assign(state.prepaid_cards.items[i], prepaid_card)
      }
    }
  },
}

// actions
const actions = {
  setSalesPrepaidCardActionData({ commit }, prepaid_card_action) {
    commit('setSalesPrepaidCardAction', prepaid_card_action)
  },
  updateSalesPrepaidCardData({ commit }, prepaid_card) {
    commit('updateSalesPrepaidCard', prepaid_card)
  },
  
  // Async
  async loadSalesPrepaidCardsAsyncData({commit},filter){
    let prepaid_card_api = new PrepaidCardsAPI()
    let response = await prepaid_card_api.getPrepaidCardsAsync(filter)
    if(response.is_ok){
      commit('setSalesPrepaidCards', response.data)
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