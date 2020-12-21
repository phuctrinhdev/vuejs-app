import _ from 'lodash'
import SalesTypeViewModel     from '../../view-model/sales/sales-type-view-model'

const state_default = {
  sales_types: {
    items: [],
    pagination: {}
  },
  sales_type_action: {
    action: 0,
    data: new SalesTypeViewModel().fields
  }
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getSalesTypes(state){
    return state.sales_types
  },
  getSalesTypeAction(state){
    return state.sales_type_action
  },
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setSalesTypes(state, sales_types){
    state.sales_types = sales_types
  },
  setSalesTypeAction(state, sales_type_action){
    state.sales_type_action = sales_type_action
  },
  updateSalesType(state, sales_type){
    for(let i in state.sales_types.items){
      if(state.sales_types.items[i].id == sales_type.id){
        state.sales_types.items[i] = Object.assign(state.sales_types.items[i], sales_type)
      }
    }
  },
  deleteSalesType(state, sales_type){
    let index = _.findIndex(state.sales_types.items, ['id', sales_type.id])
    state.sales_types.items.splice(index, 1)
  },
}

// actions
const actions = {
  setSalesTypesData({commit}, sales_types){
    commit('setSalesTypes', sales_types)
  },
  setSalesTypeActionData({commit}, sales_type_action){
    commit('setSalesTypeAction', sales_type_action)
  },
  updateSalesTypeData({commit}, sales_type){
    commit('updateSalesType', sales_type)
  },
  deleteSalesTypeData({commit}, sales_type){
    commit('deleteSalesType', sales_type)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}