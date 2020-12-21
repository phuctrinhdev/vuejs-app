import TextMessageApi from '../../api/messages/text-message-api'

const state_default = {
  message_master: {},
  message_masters: {},
  message_details: {},
  image: {},
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getMessageMaster(state){
    return state.message_master
  },
  getMessageMasters(state){
    return state.message_masters
  },
  getMessageDetails(state){
    return state.message_details
  },
  getImage(state){
    return state.image
  }
}

// mutations
const mutations = {
  resetState(state) {
    Object.assign(state, state_default)
  },
  setMessageMaster(state, message_master){
    state.message_master = message_master
  },
  setMessageMasters(state, message_masters){  
    state.message_masters = message_masters
  },
  setMessageDetails(state, message_details){  
    state.message_details = message_details
  },
  setImage(state, image){  
    state.image = image
  }
}

// actions
const actions = {
  async getMessageMastersDataAsync({commit}, filter){
    try {
      let text_message_api = new TextMessageApi()
      let result = await text_message_api.getMessageMastersByShopAsync(filter)
      commit('setMessageMasters', result)
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  async getMessageDetailsDataAsync({commit}, filter){
    try {
      let text_message_api = new TextMessageApi()
      let result = await text_message_api.getMessageDetailsByMasterAsync(filter)
      commit('setMessageDetails', result)
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  setMessageMasterData({commit}, message_master){
    commit('setMessageMaster', message_master)
  },
  setImageData({commit}, image){
    commit('setImage', image)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}