import { FORM_ACTIONS } from '../../config/constant'
import ClientApi        from '../../api/clients/client-api'
import ClientViewModel from '../../view-model/clients/client-view-model'

const state_default = {
  clients            : {},
  client_action      : {},
  client_information : {},
  booking_client     : new ClientViewModel().fields,
}


// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getClients(state){
    return state.clients
  },
  getClientInformation(state) {
    return state.client_information
  },
  getClientAction(state) {
    return state.client_action
  },
  getBookingClient(state){
    return state.booking_client
  },
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setClients(state, clients){
    state.clients = clients
  },
  updateClient(state, client_edit){ 
    for(let key in state.clients.data.items){
      if(state.clients.data.items[key].id == client_edit.id){
        state.clients.data.items[key] = Object.assign(state.clients.data.items[key], client_edit)
      }
    }
  },
  setClientInformation(state, client_information){
    state.client_information = client_information
  },
  updateClientInformation(state, client_information){ 
    state.client_information.data = Object.assign(state.client_information.data, client_information)
  },
  updateClientNote(state, client_note){
    state.client_information.data = Object.assign(state.client_information.data, client_note)

    // for(let key in state.clients.data.items){
    //   if(state.clients.data.items[key].id == client_note.id){
    //     state.clients.data.items[key] = Object.assign(state.clients.data.items[key], client_note)
    //   }
    // }
  },
  updateClientPoint(state, client_point){
    state.client_information.data = Object.assign(state.client_information.data, client_point)
  },
  updateClientFamilyPoint(state, client_family_point){
    state.client_information.data = Object.assign(state.client_information.data, client_family_point)
  },
  updateClientAvatarToClientInformation(state, avatar){
    state.client_information.data.avatar =  Object.assign({}, avatar)
  },
  setClientAction(state, client_action){
    state.client_action = client_action
  },
  updateClientInformationFromEmptyValue(state, client){
    if(!client.mobile_number) client.mobile_number = ''
    if(!client.phone_number) client.phone_number = ''
  },
  updateSalesClientAccountToClientInformation(state, sales_client_account){
    state.client_information.data.family_id             = sales_client_account.family_id
    state.client_information.data.total_sales           = sales_client_account.total_sales
    state.client_information.data.loyalty_points        = sales_client_account.loyalty_points
    state.client_information.data.family_point          = sales_client_account.family_loyalty_points
    state.client_information.data.balance               = sales_client_account.balance
    state.client_information.data.family_balance        = sales_client_account.family_balance
    state.client_information.data.outstanding           = sales_client_account.outstanding
  },
  setBookingClient(state, client){
    state.booking_client = client
  },
}

// actions
const actions = {
  updateClientData({commit}, client){
    commit('updateClient', client)
  },
  updateClientInformationData({commit}, client_information){
    commit('updateClientInformation', client_information)
  },
  updateClientNoteData({commit}, client_note){
    commit('updateClientNote', client_note)
  },
  updateClientPointData({commit}, client_point){
    commit('updateClientPoint', client_point)
  },
  updateClientFamilyPointData({commit}, client_family_point){
    commit('updateClientFamilyPoint', client_family_point)
  },

  // async methods
  async getClientsDataAsync({commit}, filter){
    try {
      let client_api = new ClientApi()
      let result = await client_api.getClientsAsync(filter)
      commit('setClients', result)
    }
    catch(e){
      return this.http.loadError(e)
    }
  },

  async getClientInformationDataAsync({commit}, client_information){
    try {
      let client_api = new ClientApi()
      let result = await client_api.getClientAsync(client_information)
      commit('setClientInformation', result)
    }
    catch(e){
      return this.http.loadError(e)
    }
  },
  
  async setClientActionDataAsync({commit}, client_action){
    try{
      if(client_action.action == FORM_ACTIONS.EDIT){
        let client_api = new ClientApi()
        let result = await client_api.getClientAsync(client_action)
        commit('setClientAction', result)
      }else{
        commit('setClientAction', client_action)
      }
    }catch(e){
      return this.http.loadError(e)
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}