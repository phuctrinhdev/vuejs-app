const state_default = {
  receivings : {
    items      : [], // Type is List<ReceivingViewModel>
    pagination : {}
  },
  receiving_action : {
    action : 0,
    data   : {} // Type is ReceivingViewModel
  },
  receiving_item_action : {
    action : 0,
    data   : {} // Type is ReceivingItemViewModel
  }
}

// initial state
const state = Object.assign({}, state_default)

export default {
  namespaced: true,
  state: state,
  getters: {
    getReceivings(state){
      return state.receivings
    },
    getReceivingAction(state){
      return state.receiving_action
    },
    getReceivingItemAction(state){
      return state.receiving_item_action
    },
    getTotalAmountOfReceivings(state){
      let total_amount = 0
      if(state.receivings.items.length > 0){
        for (let i in state.receivings.items){
          total_amount += state.receivings.items[i].amount
        }
      }
      return total_amount
    }
  },
  mutations: {
    resetState(state){
      Object.assign(state, state_default)
    },
    // ---- Receiving
    setReceivings(state, receivings){
      state.receivings = receivings
    },
    updateReceiving(state, receiving){
      for (let i in state.receivings.items) {
        if (state.receivings.items[i].receiving_id == receiving.receiving_id) {
          state.receivings.items[i] = Object.assign(state.receivings.items[i], receiving)
        }
      }
    },
    // ---- ReceivingAction
    updateReceivingAction(state,receiving){
      if(state.receiving_action.data.receiving_id == receiving.receiving_id){
        state.receiving_action.data = Object.assign(state.receiving_action.data,receiving)
      }
    },
    setReceivingAction(state, receiving_action){
      state.receiving_action = receiving_action
    },
    // ---- ReceivingItemAction
    setReceivingItemAction(state, receiving_item_action){
      state.receiving_item_action = receiving_item_action
    }
  }
}
