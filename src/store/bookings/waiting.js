import vue from 'vue' 
import { options }    from '../../helpers/options'
import { PAGINATION } from '../../config/constant'
import WaitingApi     from '../../api/bookings/waiting-api' 

const state_default = {
  waitings_calendar: [],
  waiting_list: { 
    items:[],
    pagination:{}
  },
  waiting_action: {
    action: 0,
    data: {}
  } 
} 
// initial state
const state = Object.assign({}, state_default) 
// getters
const getters = { 
  getWaitingsCalendar(state){
    return state.waitings_calendar
  },
  getWaitingList(state){
    return state.waiting_list
  },
  getWaitingAction(state){
    return state.waiting_action
  },  
} 
// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  }, 
  setWaitingsCalendar(state, waitings){
    state.waitings_calendar = waitings 
  },
  setWaitingList(state, waitings){
    state.waiting_list = waitings 
  },
  addWaitingsCalendar(state, waiting){ 
    if(waiting.status == options.waiting_status.new_waiting){
      if(state.waitings_calendar.length < PAGINATION.SMALL){
        let data = state.waitings_calendar.filter(w => w.id == waiting.id)
        if(data.length > 0){ 
          vue.set(state.waitings_calendar, state.waitings_calendar.indexOf(data[0]), waiting)
        }
        else{
          state.waitings_calendar.push(waiting) 
        }
      }
    }
  },
  updateWaitingListWhenChange(state, waiting){ 
    let exist = false
    state.waiting_action.data = waiting

    for(let i in state.waiting_list.items){
      if(state.waiting_list.items[i].id == waiting.id){ 
        if(waiting.status != options.waiting_status.new_waiting){
          state.waiting_list.items.splice(i, 1)
        }
        else{
          vue.set(state.waiting_list.items, i, waiting)
        }
        exist = true
        break
      }
    }
    if(!exist){
      state.waiting_list.items.unshift(waiting)
    }
    state.waiting_list.pagination.total_items = state.waiting_list.items.length
    state.waiting_list.pagination.total_page  = Math.ceil(state.waiting_list.pagination.total_items / state.waiting_list.pagination.page_size )
  },
  removeWaitingsCalendar(state, waiting_id){
    let data = state.waitings_calendar.filter(w => w.id == waiting_id) 

    if(data.length > 0){
      state.waitings_calendar.splice(state.waitings_calendar.indexOf(data[0]), 1)
    }
  },
  removeWaitingList(state, waiting_id){
    let data = state.waiting_list.items.filter(w => w.id == waiting_id) 
    if(data.length > 0){
      state.waiting_list.items.splice(state.waiting_list.items.indexOf(data[0]), 1)  
      state.waiting_list.pagination.total_items =  state.waiting_list.items.length
      state.waiting_list.pagination.total_page = Math.ceil(state.waiting_list.pagination.total_items / state.waiting_list.pagination.page_size )
    } 
  },
  setWaitingAction(state, waiting_action){
    state.waiting_action = waiting_action
  },
} 
// actions
const actions = {
  async getWaitingsCalendarDataAsync({commit}, filter){ 
    try { 
      let waiting_api = new WaitingApi()
      let result = await waiting_api.getWaitingsAsync(filter)

      if(result.is_ok) {
        commit('setWaitingsCalendar', result.data.items)
      }
      commit('alert/setAlerts', result.error_messages, { root:true })
    }
    catch(e){ 
      return this.http.loadError(e)
    }
  },
  setWaitingListData({commit}, waitings){ 
    commit('setWaitingList', waitings)
  },
  setWaitingActionData({commit}, waiting_action){
    commit('setWaitingAction', waiting_action)
  },
  async getWaitingListDataAsync({commit}, filter){ 
    try { 
      let waiting_api = new WaitingApi()
      let result = await waiting_api.getWaitingsAsync(filter)

      if(result.is_ok) {
        commit('setWaitingList', result.data)
      }
      commit('alert/setAlerts', result.error_messages, { root:true })
    }
    catch(e){ 
      return this.http.loadError(e)
    }
  },
  async addWaitingDataAsync({commit}, waiting){
    try {
      let waiting_api = new WaitingApi()
      let result = await waiting_api.addWaitingAsync(waiting)

      if(result.is_ok) { 
        result.data.resource_name = waiting.resource_name
        commit('addWaitingsCalendar', result.data)
      }
      commit('alert/setAlerts', result.error_messages, { root:true })
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  async updateWaitingDataAsync({commit}, waiting){
    let waiting_api = new WaitingApi()
    try {
      let result = await waiting_api.updateWaitingAsync(waiting)

      if(result.is_ok) {
        result.data.resource_name = waiting.resource_name
        
        if(waiting.status == options.waiting_status.new_waiting ){ 
          commit('addWaitingsCalendar', result.data)
        }
        else{
          commit('removeWaitingsCalendar', waiting.id) 
        }
      }
      commit('alert/setAlerts', result.error_messages, { root:true })
    }
    catch(e){
      return waiting_api.loadError(e)
    }
  },
  addWaitingNotificationData({commit}, waiting){
    commit('updateWaitingListWhenChange', waiting)
    if(waiting.status != options.waiting_status.new_waiting){
      commit('removeWaitingsCalendar', waiting.id) 
    }
    else{
      commit('addWaitingsCalendar', waiting) 
    }
  },
  updateWaitingNotificationData({commit}, waiting){
    commit('updateWaitingListWhenChange', waiting)
    if(waiting.status != options.waiting_status.new_waiting){
      commit('removeWaitingsCalendar', waiting.id) 
    }
    else{
      commit('addWaitingsCalendar', waiting) 
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
