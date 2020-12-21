import BookingApi from '../../api/bookings/booking-api'
import CancelBookingActionData from '../../view-model/actions/bookings/cancel-booking-action-data'
const state_default = {
  booking_cancel_action: {
    action: 0,
    data: new CancelBookingActionData()
  }
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getBookingCancelAction(state){
    return state.booking_cancel_action
  },
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setBookingCancelAction(state, booking_cancel_action){
    state.booking_cancel_action = booking_cancel_action
  },
  setBookingCancelType(state, booking_cancel_type){
    state.booking_cancel_action.data.option = booking_cancel_type
  },
}

// actions
const actions = {
  setBookingCancelActionData({commit}, booking_cancel_action){
    commit('setBookingCancelAction', booking_cancel_action)
  },

  setBookingCancelTypeData({commit}, booking_cancel_type){
    commit('setBookingCancelType', booking_cancel_type)
  },
  async addBookingCancelDataAsync({commit}, booking){
    try {
      let booking_api = new BookingApi()
      let result = await booking_api.cancelBookingAsync(booking)

      if(result.is_ok) {
        for(let i in result.data.cancel_bookings){
          commit('booking/updateBooking', result.data.cancel_bookings[i], { root:true })
        }
        return result.data
      }
      commit('alert/setAlerts', result.error_messages, { root:true })
      return result.data
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  addBookingCancelNotificationData({commit}, bookings_cancelled){
    for(let i in bookings_cancelled){
      commit('booking/updateBooking', bookings_cancelled[i], { root:true })
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
