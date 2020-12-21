const state_default = {
  stock_safety_action: {
    action: 0,
    data: {}
  },
  stock_decrease_action: {
    action: 0,
    data: {}
  },
  stock_history_view_product_code: 0
}

// initial state
const state = Object.assign({}, state_default)

export default {
  namespaced: true,
  state: state,
  getters: {
    getStockSafetyAction(state){
      return state.stock_safety_action
    },
    getStockDecreaseAction(state){
      return state.stock_decrease_action
    },
    getStockHistoryViewProductCode(state){
      return state.stock_history_view_product_code
    }
  },
  mutations: {
    resetState(state){
      Object.assign(state, state_default)
    },
    setStockSafetyAction(state, stock_safety_action){
      state.stock_safety_action = stock_safety_action
    },
    setStockDecreaseAction(state, stock_decrease_action){
      state.stock_decrease_action = stock_decrease_action
    },
    setStockHistoryViewProductCode(state, stock_history_view_product_code){
      state.stock_history_view_product_code = stock_history_view_product_code
    },
  }
}