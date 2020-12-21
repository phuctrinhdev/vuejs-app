import _ from 'lodash'
import PaymentMethodViewModel from '../../view-model/sales/payment-method-view-model'

const state_default = {
  payment_methods: {
    items: [],
    pagination: {}
  },
  payment_method_action: {
    action: 0,
    data: new PaymentMethodViewModel().getFields()
  }
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getPaymentMethods(state){
    return state.payment_methods
  },
  getPaymentMethodAction(state){
    return state.payment_method_action
  },
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setPaymentMethods(state, payment_methods){
    state.payment_methods = payment_methods
  },
  setPaymentMethodAction(state, payment_method_action){
    state.payment_method_action = payment_method_action
  },
  updatePaymentMethod(state, payment_method){
    for(let i in state.payment_methods.items){
      if(state.payment_methods.items[i].id == payment_method.id){
        state.payment_methods.items[i] = Object.assign(state.payment_methods.items[i], payment_method)
      }
    }
  },
  deletePaymentMethod(state, payment_method){
    let index = _.findIndex(state.payment_methods.items, ['id', payment_method.id])
    state.payment_methods.items.splice(index, 1)
  },
}

// actions
const actions = {
  setPaymentMethodsData({commit}, payment_methods){
    commit('setPaymentMethods', payment_methods)
  },
  setPaymentMethodActionData({commit}, payment_method_action){
    commit('setPaymentMethodAction', payment_method_action)
  },
  updatePaymentMethodData({commit}, payment_method){
    commit('updatePaymentMethod', payment_method)
  },
  deletePaymentMethodData({commit}, payment_method){
    commit('deletePaymentMethod', payment_method)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}