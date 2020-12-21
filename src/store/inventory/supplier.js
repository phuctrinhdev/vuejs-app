const state_default = {
  suppliers : {
    items     : [],
    pagination: {}
  },
  supplier_action : {
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
    getSuppliers(state) {
      return state.suppliers
    },
    getSupplierAction(state) {
      return state.supplier_action
    }
  },
  mutations: {
    resetState(state){
      Object.assign(state, state_default)
    },
    setSuppliers(state, suppliers) {
      state.suppliers = suppliers
    },
    setSupplierAction(state, supplier_action) {
      state.supplier_action = supplier_action
    },
    updateSupplier(state, supplier) {
      for (let i in state.suppliers.items) {
        if (state.suppliers.items[i].supplier_id == supplier.supplier_id) {
          state.suppliers.items[i] = Object.assign(state.suppliers.items[i], supplier)
        }
      }
    }
  }
}
