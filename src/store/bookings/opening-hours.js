import OpeningHoursApi from '../../api/bookings/opening-hours-api'
import _ from 'lodash'

const state_default = {
  opening_hours: {
    data:{}
  },
  opening_hours_action: {
    action: 0,
    data: {}
  }
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getOpeningHours(state){
    return state.opening_hours
  },
  getOpeningHoursAction(state) {
    return state.opening_hours_action
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setOpeningHours(state, opening_hours){
    state.opening_hours = Object.assign(state.opening_hours, opening_hours)
  },
  setOpeningHoursAction(state, opening_hours_action){
    state.opening_hours_action = opening_hours_action
  },
  addOpeningHours(state, opening_hours_add){
    state.opening_hours.data.opening_hours.push(opening_hours_add)
  },
  updateOpeningHours(state, opening_hours_edit){
    for(let key in state.opening_hours.data.opening_hours){
      if(state.opening_hours.data.opening_hours[key].id == opening_hours_edit.id){
        state.opening_hours.data.opening_hours[key] = Object.assign(state.opening_hours.data.opening_hours[key], opening_hours_edit)
      }
    }
  },
  deleteOpeningHours(state, opening_hours_delete){
    let index = _.findIndex(state.opening_hours.data.opening_hours, [ 'id', opening_hours_delete.id ])
    state.opening_hours.data.opening_hours.splice(index, 1)
  }
}

// actions
const actions = {
  async getOpeningHoursDataAsync({commit}, filter){
    try {
      let opening_hours_api = new OpeningHoursApi()
      let result = await opening_hours_api.getOpeningHoursAsync(filter)
      commit('setOpeningHours', result)
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  setOpeningHoursActionData({commit}, opening_hours_action){
    commit('setOpeningHoursAction', opening_hours_action)
  },

  async addOpeningHoursDataAsync({commit}, opening_hours){
    try {
      let opening_hours_api = new OpeningHoursApi()
      let result = await opening_hours_api.addOpeningHourAsync(opening_hours)
      
      if(result.is_ok) {
        commit('addOpeningHours', result.data)
      }
      else {
        commit('alert/setAlerts', result.error_messages, { root:true })
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  async updateOpeningHoursDataAsync({commit}, opening_hours){
    try {
      let opening_hours_api = new OpeningHoursApi()
      let result = await opening_hours_api.updateOpeningHourAsync(opening_hours)

      if(result.is_ok) commit('updateOpeningHours', result.data)
      else commit('alert/setAlerts', result.error_messages, { root:true })
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  async deleteOpeningHoursDataAsync({commit}, opening_hours){
    try {
      let opening_hours_api = new OpeningHoursApi()
      let result = await opening_hours_api.deleteOpeningHourAsync(opening_hours)

      if(result.is_ok) commit('deleteOpeningHours', result.data)
      else commit('alert/setAlerts', result.error_messages, { root:true })
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
