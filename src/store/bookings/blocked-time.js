import BlockedTimeApi from '../../api/bookings/blocked-time-api'
import _ from 'lodash'

const state_default = {
  blocked_times: [],
  blocked_time_action: {
    action: 0,
    data: {},
    options:{
      booking_resource_setup_id: 0,
      booking_date: new Date(),
      booking_date_ts_miliseconds: 0,
      cross_date: false,
      start_time: '00:00'
    }
  }
}


// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getBlockedTimeCalendar(state){
    return state.blocked_times
  },
  getBlockedTimeAction(state){
    return state.blocked_time_action
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setBlockedTimeCalendar(state, blocked_times){
    state.blocked_times = blocked_times
  },
  setBlockedTimeAction(state, blocked_time_action){
    state.blocked_time_action = blocked_time_action
  },
  addBlockedTime(state, blocked_time){
    state.blocked_times.push(blocked_time)
  },
  updateBlockedTime(state, blocked_time){
    for(let i in state.blocked_times){
      let item = state.blocked_times[i]
      if(item.blocked_time_id == blocked_time.blocked_time_id){
        item = Object.assign(item, blocked_time)
      }
    }
  },
  deleteBlockedTime(state, blocked_time){
    let index_of_deleted_blocked = _.findIndex(state.blocked_times, ['blocked_time_id', blocked_time.blocked_time_id])
    state.blocked_times.indexOf(blocked_time)
    state.blocked_times.splice(index_of_deleted_blocked, 1)
  }
}

// actions
const actions = {
  setBlockedTimeActionData({commit}, blocked_time_action){
    commit('setBlockedTimeAction', blocked_time_action)
  },
  async addBlockedTimeDataAsync({commit}, blocked_time){
    try {
      let blocked_time_api = new BlockedTimeApi()
      let result = await blocked_time_api.addBlockedTimeAsync(blocked_time)
      
      if(result.is_ok) {
        commit('addBlockedTime', result.data)
      }
      else {
        commit('alert/setAlerts', result.error_messages, { root:true })
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  async updateBlockedTimeDataToStoreOnly({commit}, blocked_time){
    commit('updateBlockedTime', blocked_time)
  },
  async updateBlockedTimeDataAsync({commit}, blocked_time){
    try {
      let blocked_time_api = new BlockedTimeApi()
      let result = await blocked_time_api.updateBlockedTimeAsync(blocked_time)
      
      if(result.is_ok) {
        commit('updateBlockedTime', result.data)
      }
      else {
        commit('alert/setAlerts', result.error_messages, { root:true })
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  async deleteBlockedTimeDataAsync({commit}, blocked_time){
    try {
      let blocked_time_api = new BlockedTimeApi()
      let result = await blocked_time_api.deleteBlockedTimeAsync(blocked_time)
      
      if(result.is_ok) {
        commit('deleteBlockedTime', result.data)
      }
      else {
        commit('alert/setAlerts', result.error_messages, { root:true })
      }
    }
    catch(e){
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