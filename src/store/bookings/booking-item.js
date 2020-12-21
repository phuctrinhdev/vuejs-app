import BookingItemApi from '../../api/bookings/booking-item-api'

const state_default = {
  booking_items: {},
  booking_items_action: {
    action: 0,
    data: {},
    options:{
      booking_resource_setup_id: 0,
      booking_date: new Date(),
      booking_date_ts_miliseconds: 0,
      cross_date: false,
      start_time: '00:00:00'
    }
  }
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getBookingItems(state){
    return state.booking_items
  },
  getBookingItemAction(state) {
    return state.booking_items_action
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setBookingItems(state, booking_items){
    state.booking_items = booking_items
  },
  setBookingItemAction(state, booking_items_action){
    state.booking_items_action = booking_items_action
  },
  updateBookingItems(state, booking_items_edit){
    for(let key in state.booking_items.data.items){
      if(state.booking_items.data.items[key].id == booking_items_edit.id){
        state.booking_items.data.items[key] = Object.assign(state.booking_items.data.items[key], booking_items_edit)
      }
    }
  },
}

// actions
const actions = {
  async getBookingItemsDataAsync({commit}, filter){
    try {
      let booking_items_api = new BookingItemApi()
      let result = await booking_items_api.getBookingItemsAsync(filter)
      commit('setBookingItems', result)
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  setBookingitemActionData({commit}, booking_items_action){
    commit('setBookingItemAction', booking_items_action)
  },
  updateBookingItemData({commit}, booking_items){
    commit('updateBookingItem', booking_items)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
