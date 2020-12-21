const state_default = {
  expenditure_items: [],
  expenditure_item_action: {
    action : 0,
    data   : {}
  }
}

// initial state
const state = Object.assign({}, state_default)

export default {
  namespaced: true,
  state: state,
  getters: {
    getExpenditureItems(state) {
      return state.expenditure_items
    },
    getExpenditureItemAction(state) {
      return state.expenditure_item_action
    }
  },
  mutations: {
    resetState(state){
      Object.assign(state, state_default)
    },
    setExpenditureItems(state, expenditure_items) {
      state.expenditure_items = expenditure_items
    },
    setExpenditureItemAction(state, expenditure_item_action) {
      state.expenditure_item_action = expenditure_item_action
    }
  }
}