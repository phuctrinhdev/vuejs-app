import ClientFamilyApi from '../../api/clients/client-family-api'
import { options } from '../../helpers/options'

const state_default = {
  familyMembers: {},
  family_member_action: {
    action: 0,
    data: {}
  }
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getFamilyMembers(state){ 
    return state.familyMembers
  },
  getFamilyMemberAction(state) {
    return state.family_member_action
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setFamilyMembers(state, familyMembers){  
    state.familyMembers = familyMembers
  },
  updateFamilyMembers(state, familyMember){
    for(let key in state.familyMembers.data.items){
      if(state.familyMembers.data.items[key].family_member_id == familyMember.data.family_member_id){
        state.familyMembers.data.items[key].relationship = familyMember.data.relationship
      }
    }
  },
  setFamilyMemberAction(state, family_member_action){
    state.family_member_action = family_member_action
  },
}

// actions
const actions = {
  async setFamilyMembersDataAsync({commit}, filter){
    try {
      let client_family_api = new ClientFamilyApi()
      let result = await client_family_api.getFamilyMemberListAsync(filter)
      if(result.is_ok){
        commit('setFamilyMembers', result)
      }
      return result
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  updateFamilyMembersData({commit}, familyMembers){
    commit('updateFamilyMembers', familyMembers)
  },
  async setFamilyMemberActionDataAsync({commit}, filter){
    let result = {}
    if(filter.action == options.form_actions.add || filter.action == options.form_actions.create){
      result = {
        data: filter.client,
        action: filter.action
      }
    }
    else{
      let client_family_api = new ClientFamilyApi()
      result = await client_family_api.getFamilyMemberAsync(filter)
    }
    commit('setFamilyMemberAction', result)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
