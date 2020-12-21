import { options } from '../../helpers/options'

const state_default = {
  expenditure_history: {
    total_amount: 0,
    items: [],
    pagination: {}
  },
  expenditure_history_add: {
    action : options.form_actions.add,
    data   : {}
  },
  expenditure_history_edit: {
    action : options.form_actions.edit,
    data   : []
  }
}

// initial state
const state = Object.assign({}, state_default)

export default {
  namespaced: true,
  state: state,
  getters: {
    getExpenditureHistory(state) {
      return state.expenditure_history
    },
    getExpenditureHistoryAdd(state) {
      return state.expenditure_history_add
    },
    getExpenditureHistoryEdit(state) {
      return state.expenditure_history_edit
    }
  },
  mutations: {
    resetState(state){
      Object.assign(state, state_default)
    },
    setExpenditureHistory(state, expenditure_history) {
      state.expenditure_history = expenditure_history
    },
    setExpenditureHistoryAdd(state, expenditure_history_add) {
      state.expenditure_history_add = expenditure_history_add
    },
    setExpenditureHistoryEdit(state, expenditure_history_edit) {
      state.expenditure_history_edit = expenditure_history_edit
    }
  }
}