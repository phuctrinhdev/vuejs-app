const state_default = {
  alerts: [],
  options: { 
    confirm: false,
    title:'',
    cancel_title:''
  },
  is_loading: false
}


// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getAlerts: (state) => {
    return state.alerts
  },
  getOptions: (state) => {
    return state.options
  },
  getIsLoading: (state) => {
    return state.is_loading
  },
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setAlerts(state, alerts){
    state.alerts = alerts
  },
  setIsLoading(state, is_loading){
    state.is_loading = is_loading
  },
  setOptions(state, options){
    state.options = options
  }
}

// actions
const actions = {
  setAlertsData({commit}, alerts){
    commit('setAlerts', alerts)
  },
  setOptionsData({commit}, options){
    commit('setOptions', options)
  },
  setIsLoadingData({commit}, is_loading){
    commit('setIsLoading', is_loading)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
