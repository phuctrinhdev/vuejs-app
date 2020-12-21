import CampaignManagementApi from '../../api/campaigns/campaign-management-api'
import { FORM_ACTIONS } from '../../config/constant'
// import CampaignApi from '../../api/campaigns/campaign-api'
import CampaignViewModel from '../../view-model/campaigns/campaign-view-model'

const state_default = {
  campaigns: {
  },
  campaign_action: {
    action: FORM_ACTIONS.VIEW,
    data: new CampaignViewModel().fields
  }
}

// inittial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getCampaigns(state){
    return state.campaigns
  },
  getCampaignAction(state) {
    return state.campaign_action
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setCampaignAction(state, campaign_action) {
    state.campaign_action = campaign_action
  },
  setCampaigns(state, campaigns){
    state.campaigns = campaigns
  },
  updateCampaign(state, campaign_edit){
    for(let key in state.campaigns.data.items){
      if(state.campaigns.data.items[key].id == campaign_edit.id){
        state.campaigns.data.items[key] = Object.assign(state.campaigns.data.items[key], campaign_edit)
      }
    }
  }
}

// actions
const actions = {
  async getCampaignsDataAsync({commit}){
    try {
      let campaign_api = new CampaignManagementApi()
      let response = await campaign_api.getCampaignsDataAsync()
      if(response.is_ok) commit('setCampaigns', response)
    } catch (error) {
      return this.http.loadError(error)
    }
  },
  setCampaignActionData({commit}, campaign_action){
    commit('setCampaignAction', campaign_action)
  },
  updateCampaignsData({commit}, campaign){
    commit('updateCampaign', campaign)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}