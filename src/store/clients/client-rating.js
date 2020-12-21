import ClientRatingApi from '../../api/clients/client-rating-api'

const state_default = {
  client_ratings: {},
  client_rating_action: {
    action: 0,
    data: {}
  }
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getClientRating(state){ 
    return state.client_ratings
  },
  getClientRatingAction(state) {
    return state.client_rating_action
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setClientRating(state, client_ratings){  
    state.client_ratings = client_ratings
  },
  updateClientRating(state, client_rating_edit){ 
    for(let key in state.client_ratings.data.items){
      if(state.client_ratings.data.items[key].id == client_rating_edit.id){
        state.client_ratings.data.items[key] = Object.assign(state.client_ratings.data.items[key], client_rating_edit)
      }
    }
  },
  setClientRatingAction(state, client_rating_action){
    state.client_rating_action = client_rating_action
  },
}

// actions
const actions = {
  async getClientRatingDataAsync({commit}, filter){    
    try {
      let _api = new ClientRatingApi()      
      let result = await _api.getClientRatingAsync(filter)
      commit('setClientRating', result)
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  updateClientRatingData({commit}, client_rating){
    commit('updateClientRating', client_rating)
  },
  setClientRatingActionData({commit}, client_rating_action){
    commit('setClientRatingAction', client_rating_action)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
