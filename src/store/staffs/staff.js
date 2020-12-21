import StaffApi from '../../api/staffs/staff-api'
import { FORM_ACTIONS } from '../../config/constant'
import _ from 'lodash'

const state_default = {
  staffs: {},
  staff_action: {
    action: 0,
    data: {}
  },
  staff_options: [],
  workinghour_setup_action: {
    data:{}
  },
  workinghour_action: {
    action: 0,
    data: {},
    shopId: 0,
    staff_id: 0
  },
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getStaffs(state){
    return state.staffs
  },
  getStaffAction(state){
    return state.staff_action
  },
  getStaffOptions(state){
    return state.staff_options
  },
  getStaffWorkingHourSetupAction(state){
    return state.workinghour_setup_action
  },
  getStaffWorkingHourAction(state){
    return state.workinghour_action
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setStaffs(state, staffs){
    state.staffs = staffs
  },
  setStaffAction(state, staff_action){
    state.staff_action = staff_action
  },
  setStaffOptions(state, staff_options){
    state.staff_options = staff_options
  },
  setStaffWorkingHourSetupAction(state, workinghour_setup_action){
    state.workinghour_setup_action = workinghour_setup_action
  },
  setStaffWorkingHourAction(state, workinghour_action){
    state.workinghour_action = workinghour_action
  },
  updateStaff(state, staff){
    for(let key in state.staffs.data.items){
      if(state.staffs.data.items[key].id == staff.id){
        state.staffs.data.items[key] = Object.assign(state.staffs.data.items[key], staff)
      }
    }
  },
  addWorkingHours(state, working_hours_add){
    state.workinghour_setup_action.data.working_hours.push(working_hours_add)
  },

  updateWorkingHours(state, working_hours_edit){
    for(let key in state.workinghour_setup_action.data.working_hours){
      if(state.workinghour_setup_action.data.working_hours[key].id == working_hours_edit.id){
        state.workinghour_setup_action.data.working_hours[key] = Object.assign(state.workinghour_setup_action.data.working_hours[key], working_hours_edit)
      }
    }
  },
  deleteWorkingHours(state, working_hours_delete){
    let index = _.findIndex(state.workinghour_setup_action.data.working_hours, [ 'id', working_hours_delete.id ])
    state.workinghour_setup_action.data.working_hours.splice(index, 1)
  }
}

// actions
const actions = {
  async getStaffAllAsync({commit}, filter){
    try {
      let staff_api = new StaffApi()
      let result = await staff_api.getStaffAllAsync(filter)
      
      commit('setStaffs', result)
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  async setStaffActionDataAsync({commit}, staff_action){
    try{
      if(staff_action.action == FORM_ACTIONS.EDIT){
        let staff_api = new StaffApi()
        let result = await staff_api.getStaffAsync(staff_action)
        commit('setStaffAction', result)
      }else{
        commit('setStaffAction', staff_action)
      }
    }catch(e){
      return this.http.loadError(e)
    }
  },
  setStaffWorkingHourSetupActionData({commit}, workinghour_action){
    commit('setStaffWorkingHourSetupAction', workinghour_action)
  },
  async setStaffWorkingHourActionDataAsync({commit}, workinghour_action){
    try{
      if(workinghour_action.action == FORM_ACTIONS.EDIT){
        let staff_api = new StaffApi()
        let result = await staff_api.getWorkingHourAsync(workinghour_action)
        commit('setStaffWorkingHourAction', result)
      }else{
        commit('setStaffWorkingHourAction', workinghour_action)
      }
    }catch(e){
      return this.http.loadError(e)
    }
  },
  updateStaffData({commit}, staff){
    commit('updateStaff', staff)
  },
  async addWorkingHoursDataAsync({commit}, workinghour_action){
    try {
      let staff_api = new StaffApi()
      let result = await staff_api.addWorkingHourAsync(workinghour_action)
      
      if(result.is_ok) {
        commit('addWorkingHours', result.data)

      }
      
      else commit('alert/setAlerts', result.error_messages, { root:true })
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  async updateWorkingHoursDataAsync({commit}, workinghour_action){
    try {
      let staff_api = new StaffApi()
      let result = await staff_api.updateWorkingHourAsync(workinghour_action)
      if(result.is_ok) commit('updateWorkingHours', result.data)
      else commit('alert/setAlerts', result.error_messages, { root:true })
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  async deleteWorkingHoursDataAsync({commit}, workinghour_action){
    try {
      let staff_api = new StaffApi()
      let result = await staff_api.deleteWorkingHourAsync(workinghour_action)
      if(result.is_ok) commit('deleteWorkingHours', result.data)
      else commit('alert/setAlerts', result.error_messages, { root:true })
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
