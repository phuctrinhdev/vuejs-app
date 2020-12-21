import BackgroundApi  from '../../api/background/background-api' 

const state_default = {
  notices: [], 
  count_notices: 0,
  notices_show: [],
  token_booking:'',
  notices_in_bookable_waiting: {}, 
}


// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getNotices: (state) => {
    return state.notices
  },
  getCountNotices: (state) => {
    return state.count_notices
  },
  getTokenBooking: (state) => {
    return state.token_booking
  },
  getNoticesInBookableWaiting: (state) => {
    return state.notices_in_bookable_waiting
  }
}

// mutations
const mutations = {
  resetState(state){  
    state.notices=[]
    state.count_notices= 0
    state.notices_show= [ ]
    // Object.assign(state, state_default)  
  }, 
  updateCountNotices: (state) => { 
    state.count_notices = state.notices.length
  },
  setNoticesInBookableWaiting: (state, notices) => { 
    state.notices_in_bookable_waiting = notices
  },
  addNotices: (state, notice) => {   
    state.notices.unshift(notice) 
    state.count_notices = state.notices.length
    return state.notices
  },
  addNoticesMore: (state) => {
    return state.notices = state.notices.unshift(state.notices_more)
  },
  deleteNotice: (state, notice) => {
    state.notices.splice(state.notices.indexOf(notice), 1) 
    state.count_notices = state.notices.length
  },
  setTokenBooking: (state, token) => {
    state.token_booking = token
  }
}

// actions
const actions = { 
  setNoticesInBookableWaitingData: ({commit}, notice) => {
    commit('setNoticesInBookableWaiting', notice)
  },
  resetState: ({commit}) => {
    commit('resetState')
  },
  resetStateNotices: ({commit}) => {
    commit('resetState')
  },
  addNotices: ({commit}, notice) => {
    commit('addNotices', notice) 
  },
  deleteNotices: ({commit}, notice) => {
    commit('deleteNotice', notice)
  },

  addNoticesToView: ({commit}) => {
    commit('addNoticesMore')
  },
  deleteNoticesFromView: ({commit}) => {
    commit('deleteNotice')
  },
  async getTokenBookingData({commit}, filter){ 
    let background_api = new BackgroundApi()
    let result = await background_api.getTokenBookingAsync(filter) 
    if(result.is_ok) {
      commit('setTokenBooking', result.data) 
      return result.data
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
