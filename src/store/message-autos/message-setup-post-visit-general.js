import MessageSetupPostVisitApi from '../../api/message-autos/message-setup-post-visit-api'
import { FORM_ACTIONS } from '../../config/constant'

const state_default = {
  message_setup_post_visit_general_action: {}
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getMessageSetupPostVisitGeneralAction(state){
    return state.message_setup_post_visit_general_action
  },
}

// mutations
const mutations = {
  resetState(state) {
    Object.assign(state, state_default)
  },
  setMessageSetupPostVisitGeneralAction(state, message_setup_post_visit_general_action){
    state.message_setup_post_visit_general_action = message_setup_post_visit_general_action
  }
}

// actions
const actions = {
  async setMessageSetupPostVisitGeneralActionDataAsync({commit}, message_setup_post_visit_general_action){
    try{
      if(message_setup_post_visit_general_action.action == FORM_ACTIONS.EDIT){
        let message_setup_post_visit_api = new MessageSetupPostVisitApi()
        let result = await message_setup_post_visit_api.getMessageSetupPostVisitGeneralAsync(message_setup_post_visit_general_action)
        commit('setMessageSetupPostVisitGeneralAction', result)
      }else{
        commit('setMessageSetupPostVisitGeneralAction', message_setup_post_visit_general_action)
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