import PrepaidCardApi from '../../api/goods/prepaid-card-api'

const state_default = {
  prepaid_cards: {},
  prepaid_card_action: {
    action: 0,
    data: {}
  }
}


// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getPrepaidCards(state){
    return state.prepaid_cards
  },
  getPrepaidCardAction(state) {
    return state.prepaid_card_action
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setPrepaidCards(state, prepaid_cards){  
    state.prepaid_cards = prepaid_cards
  },
  updatePrepaidCard(state, prepaid_card_edit){ 
    for(let key in state.prepaid_cards.data.items){
      if(state.prepaid_cards.data.items[key].id == prepaid_card_edit.id){
        state.prepaid_cards.data.items[key] = Object.assign(state.prepaid_cards.data.items[key], prepaid_card_edit)
      }
    }
  },
  setPrepaidCardAction(state, prepaid_card_action){
    state.prepaid_card_action = prepaid_card_action
  },
}

// actions
const actions = {
  async getPrepaidCardsDataAsync({commit}, filter){
    try {
      let prepaid_card_api = new PrepaidCardApi()
      let result = await prepaid_card_api.getPrepaidCardsAsync(filter)
      commit('setPrepaidCards', result)
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  updatePrepaidCardsData({commit}, prepaid_card){
    commit('updatePrepaidCard', prepaid_card)
  },
  setPrepaidCardActionData({commit}, prepaid_card_action){
    commit('setPrepaidCardAction', prepaid_card_action)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}