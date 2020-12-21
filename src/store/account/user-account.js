import UserAccountApi from '../../api/account/user-account-api'
import { FORM_ACTIONS } from '../../config/constant'

const state_default = {
  user_accounts: {},
  user_account_action: {}
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getUserAccounts(state){
    return state.user_accounts
  },
  getUserAccountAction(state) {
    return state.user_account_action
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setUserAccounts(state, user_accounts){  
    state.user_accounts = user_accounts
  },
  setUserAccountAction(state, user_account_action){
    state.user_account_action = user_account_action
  }
}

// actions
const actions = {
  async getUserAccountsDataAsync({commit}, filter){
    try {
      let user_account_api = new UserAccountApi()
      let result = await user_account_api.getSalonUserAccountsAsync(filter)
      commit('setUserAccounts', result)
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  async setUserAccountActionDataAsync({commit}, user_account_action){
    try{
      if(user_account_action.action == FORM_ACTIONS.EDIT){
        let user_account_api = new UserAccountApi()
        let result = await user_account_api.getSalonUserAccountAsync(user_account_action)
        commit('setUserAccountAction', result)
      }else{
        commit('setUserAccountAction', user_account_action)
      }
    }catch(e){
      return this.http.loadError(e)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}