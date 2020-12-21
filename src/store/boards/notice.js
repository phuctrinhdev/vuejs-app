import NoticeApi from '../../api/boards/notice-api'

const state_default = {
  notices: {}
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getNotices(state){
    return state.notices
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setNotices(state, notices){  
    state.notices = notices
  }
}

// actions
const actions = {
  async getNoticesDataAsync({commit}, filter){
    try {
      let notice_api = new NoticeApi()
      let result = await notice_api.getNoticesAsync(filter)
      commit('setNotices', result)
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