const state_default = {
  products_with_stock: {
    items       : [],
    pagination  : {}
  },
  stock_internal_uses: {
    total_amount: 0,
    items       : [],
    pagination  : {}
  },
  stock_internal_use_action: {
    action: 0,
    data  : {}
  }
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getProductsWithStock(state){
    return state.products_with_stock
  },
  getStockInternalUses(state){
    return state.stock_internal_uses
  },
  getStockInternalUseAction(state){
    return state.stock_internal_use_action
  },
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setProductsWithStock(state, products_with_stock){
    state.products_with_stock = products_with_stock
  },
  setStockInternalUses(state, stock_internal_uses){
    state.stock_internal_uses = stock_internal_uses
  },
  setStockInternalUseAction(state, stock_internal_use_action){
    state.stock_internal_use_action = stock_internal_use_action
  },
}

// actions
const actions = {
  // 
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}