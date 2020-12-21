import BookingCalendarSetupApi from '../../api/bookings/booking-calendar-setting-api'

const state_default = {
  calendar_setup: {}
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getBookingCalendarSetup(state){
    return state.calendar_setup
  },
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setBookingCalendarSetup(state, calendar_setup){
    state.calendar_setup = calendar_setup
  },
}

// actions
const actions = {
  async getCalendarSetupDataAsync({commit}, filter){
    try {
      let booking_calendar_setup_api = new BookingCalendarSetupApi(filter)
      let result = await booking_calendar_setup_api.getBookingCalendarSettingAsync(filter) 
      commit('setBookingCalendarSetup', result)
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
