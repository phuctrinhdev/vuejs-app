import _ from 'lodash'
import BookingApi  from '../../api/bookings/booking-api'
import { options } from '../../helpers/options'
import { guid }    from '../../helpers/common'
import vue from 'vue'

const state_default = {
  bookings: [], 
  result_waiting_to_bookings: [],
  booking_list: {},
  booking_action: {
    action: 0,
    data: {},
    options:{
      booking_resource_setup_id: 0,
      booking_date: new Date(),
      start_time: '00:00',
    }
  },
  booking_helps: {},
  date_picker: new Date(),
  calendar_view_mode: options.booking.calendar_view_mode.daily,
  calendar_forced_reload_key: guid()
}
// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getBookingCalendar(state){
    return state.bookings
  },
  getDatePicker(state){
    return state.date_picker
  },
  getCalendarViewMode(state){
    return state.calendar_view_mode
  },
  getCalendarForcedReloadKey(state){
    return state.calendar_forced_reload_key
  },

  getWaitingCalendar(state){
    return state.waitings
  },
  getBookingFromWaiting(state){
    return state.result_waiting_to_bookings
  },
  getBookingList(state){
    return state.booking_list
  },
  getBookingAction(state){
    return state.booking_action
  },
  getBookingHelps(state){
    return state.booking_helps
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setBookingCalendar(state, bookings){
    state.bookings = bookings
  },
  setDatePicker(state, date_picker){
    state.date_picker = date_picker
  },
  setCalendarViewMode(state, calendar_view_mode){
    state.calendar_view_mode = calendar_view_mode
  },
  setCalendarForcedReloadKey(state, calendar_forced_reload_key){
    state.calendar_forced_reload_key = calendar_forced_reload_key
  },
  setWaitingCalendar(state, waitings){
    state.waitings = waitings
  },
  setBookingFromWaiting(state, bookings){
    state.result_waiting_to_bookings = bookings
  },
  setBookingList(state, bookings){
    state.booking_list = bookings
  },
  setBookingAction(state, booking_action){
    state.booking_action = booking_action
  },
  setBookingHelps(state, booking_helps){
    state.booking_helps = booking_helps
  },
  updateBookingHelps(state, booking_helps){
    state.booking_helps = Object.assign(state.booking_helps, booking_helps)
  },
  addBooking(state, bookings){
    for(let i in bookings){
      state.bookings.push(bookings[i])
    }
  },
  updateBooking(state, booking){
    for(let i in state.bookings){
      if(state.bookings[i].id == booking.id){
        if(booking.cancel_booking_id > 0) state.bookings[i].status = options.booking.booking_status.canceled
        else {
          let index = _.findIndex(state.bookings, [ 'id', booking.id ])
          state.bookings.splice(index, 1)
          state.bookings.push(booking)
        }
      }
    }
    if(state.booking_list.items){
      let booking_edit = state.booking_list.items.filter(item => item.id == booking.id)
      if(booking_edit.length > 0){
        if(booking.cancel_booking_id > 0) vue.set(booking_edit[0], 'status', options.booking.booking_status.canceled)
        else booking_edit[0] = Object.assign(booking_edit[0], booking)
      }
    }
  },
  updateBookingStatus(state, data){
    for(let i in state.bookings){
      if(state.bookings[i].id == data.id){
        state.bookings[i].status = data.status
      }
    }
  },
  updateBookingConfirmed(state, data){
    for(let i in state.bookings){
      if(state.bookings[i].id == data.id){
        state.bookings[i].confirmed = data.confirmed
      }
    }
  },
  moveBooking(state, moving){
    for(let i in state.bookings){
      if(state.bookings[i].id == moving.booking_id){
        for(let ii in state.bookings[i].booked_items){
          let item = state.bookings[i].booked_items[ii]
          if(item.booked_item_id == moving.booked_item_id){
            item.start_time = moving.start_time
            item.booking_resource_retup_id = moving.changed_booking_resource_id
          }
        }
      }
    }
  }
}

// actions
const actions = {
  setDatePickerData({commit}, date_picker){
    commit('setDatePicker', date_picker)
  },
  setCalendarViewModeData({commit}, calendar_view_mode){
    commit('setCalendarViewMode', calendar_view_mode)
  },
  setCalendarForcedReloadKeyData({commit}, calendar_forced_reload_key){
    commit('setCalendarForcedReloadKey', calendar_forced_reload_key)
  },
  async getBookingCalendarDataAsync({commit}, filter){
    try {
      let booking_api = new BookingApi()
      let result = await booking_api.getBookingsCalendarAsync(filter) 
      if(result.is_ok) {
        commit('setBookingCalendar', result.data.items)
        commit('blocked_time/setBlockedTimeCalendar', result.data.blocked_times, { root:true }) 
      }
      commit('alert/setAlerts', result.error_messages, { root:true })
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  async getBookingListDataAsync({commit}, filter){
    try {
      let booking_api = new BookingApi()
      let result = await booking_api.getBookingListAsync(filter)
      
      if(result.is_ok) {
        commit('setBookingList', result.data)
      }
      commit('alert/setAlerts', result.error_messages, { root:true })
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  setBookingActionData({commit}, booking_action){
    commit('setBookingAction', booking_action)
  },
  setBookingHelpsData({commit}, booking_helps){
    commit('setBookingHelps', booking_helps)
  },
  updateBookingHelpsData({commit}, booking_helps){
    commit('updateBookingHelps', booking_helps)
  },
  updateBookingStatusData({commit}, data){
    commit('updateBookingStatus', data)
  },
  updateBookingConfirmedData({commit}, data){
    commit('updateBookingConfirmed', data)
  },
  async addBookingDataAsync({commit}, booking){
    try {
      let booking_api = new BookingApi()
      let result = await booking_api.addBookingAsync(booking)

      if(result.is_ok) {
        commit('addBooking', result.data.items)
      }
      commit('alert/setAlerts', result.error_messages, { root:true })
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  addBookingNotificationData({commit}, bookings){
    commit('addBooking', bookings)
  },
  async updateBookingDataAsync({commit}, booking){
    try {
      let booking_api = new BookingApi()
      let result = await booking_api.updateBookingAsync(booking)
      if(result.is_ok) {
        if(result.data.bookings.length == 1)
          commit('updateBooking', result.data.booking)
        else {
          let repeated_bookings = []
          for(let i in result.data.bookings){
            let tmp_booking = result.data.bookings[i]
            if(tmp_booking.id == tmp_booking.original_booking_id)
              commit('updateBooking', tmp_booking)
            else
              repeated_bookings.push(tmp_booking)
          }
          commit('addBooking', repeated_bookings)
        }
      }
      commit('alert/setAlerts', result.error_messages, { root:true })
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  updateBookingDataToStoreOnly({commit}, booking){
    commit('updateBooking', booking)
  },
  updateBookingNotificationData({commit}, booking){
    commit('updateBooking', booking)
  },
  async changingWaitingToBookingDataAsync({commit}, booking){
    try {
      let booking_api = new BookingApi()
      booking.status = options.booking.booking_status.completed
      let result = await booking_api.changingWaitingToBookingAsync(booking) 
      if(result.is_ok) {
        if(booking.is_check_bookable_waiting != true){
          commit('setBookingFromWaiting', result.data.items) 
          commit('waiting/removeWaitingsCalendar', booking.waiting_id, { root:true })
          commit('waiting/removeWaitingList', booking.waiting_id, { root:true })
          commit('addBooking', result.data.items)
        }
      }
      commit('alert/setAlerts', result.error_messages, { root:true })
    }
    catch(e){
      return this.http.loadError(e)
    }
  }, 
  async updateBookingInfoHeightData({commit}, data){ 
    commit('setBookingFromWaiting',data)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
