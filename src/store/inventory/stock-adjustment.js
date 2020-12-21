const state_default = {
  stock_adjustment_action : {
    action: [],
    data  : {},
    options: {}
  },
}

// initial state
const state = Object.assign({}, state_default)

export default {
  namespaced: true,
  state: state,
  getters: {
    getStockAdjustmentAction(state){
      return state.stock_adjustment_action
    },
  },
  mutations: {
    resetState(state){
      Object.assign(state, state_default)
    },
    setStockAdjustmentAction(state, stock_adjustment_action){
      state.stock_adjustment_action = stock_adjustment_action
    }
  }
}