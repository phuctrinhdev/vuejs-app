import BookingOnlineSetupApi from '../../api/bookings/booking-online-booking-setting-api'

const state_default = {
  booking_online_setup: {}
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getBookingOnlineSetup(state){
    return state.booking_online_setup
  },
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setBookingOnlineSetup(state, booking_online_setup){
    state.booking_online_setup = booking_online_setup
  },
}

// actions
const actions = {
  async getBookingOnlineSetupDataAsync({commit}, filter){
    try {
      let booking_online_setup_api = new BookingOnlineSetupApi(filter)
      let result = await booking_online_setup_api.getBookingOnlineBookingSettingAsync(filter) 
      commit('setBookingOnlineSetup', result)
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
