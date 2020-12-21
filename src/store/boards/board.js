import BoardApi         from '../../api/boards/board-api'
import { BOARDS_ENUMS } from '../../config/constant'

const state_default = {
  boards: {},
  page_filter: {
    search_type : BOARDS_ENUMS.SEARCH_BOARD_TYPE.TITLE,
    contents    : null,
    page_number : 1
  },
  board_action: {
    id     : null,
    action : null
  }
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getBoards(state){
    return state.boards
  },
  getPageFilter(state) {
    return state.page_filter
  },
  getBoardAction(state) {
    return state.board_action
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setBoards(state, boards){  
    state.boards = boards
  },
  setPageFilter(state, page_filter){
    if(!isNaN(page_filter)){
      state.page_filter.page_number = page_filter
    }
    else
      state.page_filter = page_filter
  },
  setBoardAction(state, board_action){  
    state.board_action = board_action
  },
}

// actions
const actions = {
  async getBoardsDataAsync({commit}, filter){
    try {
      let board_api = new BoardApi()
      let result = await board_api.getBoardsAsync(filter)
      commit('setBoards', result)
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  async setPageFilterData({commit}, page_filter){
    commit('setPageFilter', page_filter)
  },
  async setBoardActionData({commit}, board_action){
    commit('setBoardAction', board_action)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}