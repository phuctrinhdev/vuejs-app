import ClientManagementApi from '../../api/clients/client-management-api'

const state_default = {
  clients: {
    is_ok: false,
    error_messages: [],
    data: {
      items: [],
      pagination: {
        page_number: 1,
        page_size  : 10,
        total_items: 0,
        total_pages: 1,
      },
      total_client_ids: []
    }
  }
}
// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getClients(state){
    return state.clients
  },
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setClientsByFilter(state, clients){
    state.clients = clients
  }
}

// actions
const actions = {
  async getClientsByFilterAsync({commit}, filter){
    try {
      let client_management_api = new ClientManagementApi()
      let response = await client_management_api.getClientsByFilterAsync(filter)
      if(response.is_ok) commit('setClientsByFilter', response)
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
