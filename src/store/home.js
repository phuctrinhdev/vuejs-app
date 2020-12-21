import SalesApi from '../api/sales/sales-api'

const state_default = {
  sales_today_data: {
    service: 0,
    product: 0,
    prepaid_card: 0,
    prepaid_service: 0
  },
  booking_today_data: {
    total: 0,
    canceles: 0,
    no_show: 0,
    upcoming_booking: 0
  },
  client_today_data: {
    new: 0,
    repeat: 0,
    unregistered_client: 0
  },
  system_notice_data: [
    'Notice for server updates',
    'New functions added',
    'New year holidays'
  ],
  headquarter_notice_data: [
    { title: 'New service added' },
    { title: 'Notice for technology seminar' },
    { title: 'New year holidays' },
  ],
  salon_qna_data: [
    'Happy new year greetings',
    'New functions added',
    'New year holidays'
  ]
}


// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getSalesToday: (state) => {
    return state.sales_today_data
  },
  getBookingToday: (state) => {
    return state.booking_today_data
  },
  getClientToday: (state) => {
    return state.client_today_data
  },
  getSystemNotice: (state) => {
    return state.system_notice_data
  },
  getHeadquarterNotice: (state) => {
    return state.headquarter_notice_data
  },
  getSalonQnA: (state) => {
    return state.salon_qna_data
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setBoardOfSalesTodayData(state, data){
    state.sales_today_data   = data.sales_today_data
    state.booking_today_data = data.booking_today_data
    state.client_today_data  = data.client_today_data
  }
}

// actions
const actions = {
  async getBoardOfSalesTodayAsync({commit}, data){
    try {
      let sales_api = new SalesApi()
      let response = await sales_api.getBoardOfSalesTodayAsync(data)
      if(response.is_ok) commit('setBoardOfSalesTodayData', response.data)
      return response
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
