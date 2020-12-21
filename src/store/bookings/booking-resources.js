import BookingResourcesApi from '../../api/bookings/booking-resources-api'

const state_default = {
  booking_resources: {},
  booking_resources_action: {
    action: 0,
    data: {}
  }
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getBookingResources(state){
    return state.booking_resources
  },
  getBookingResourcesAction(state) {
    return state.booking_resources_action
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setBookingResources(state, booking_resources){
    state.booking_resources = booking_resources
  },
  setBookingResourcesAction(state, booking_resources_action){
    state.booking_resources_action = booking_resources_action
  },
  updateBookingResources(state, booking_resources_edit){
    for(let key in state.booking_resources.data.items){
      if(state.booking_resources.data.items[key].id == booking_resources_edit.id){
        state.booking_resources.data.items[key] = Object.assign(state.booking_resources.data.items[key], booking_resources_edit)
      }
    }
  },
}

// actions
const actions = {
  async getBookingResourcesDataAsync({commit}, filter){
    try {
      let booking_resources_api = new BookingResourcesApi()
      let result = await booking_resources_api.getBookingResourcesAsync(filter) 
      commit('setBookingResources', result)
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  setBookingResourcesData({commit}, booking_resources){
    commit('setBookingResources', booking_resources)
  },
  setBookingResourcesActionData({commit}, booking_resources_action){
    commit('setBookingResourcesAction', booking_resources_action)
  },
  updateBookingResourcesData({commit}, booking_resources){
    commit('updateBookingResources', booking_resources)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
