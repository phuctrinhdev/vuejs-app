import ClientAccountViewModel from '../../view-model/sales/outstanding/client-account-view-model.js'
import SalesClientAccountApi  from '../../api/sales/sales-client-account-api'


const state_default = {
  sales_client_account : new ClientAccountViewModel().getFields(),
  client_accounts : {
    items      : [],
    pagination : {}
  },
  client_account_action : {
    action : 0,
    data   : new ClientAccountViewModel().getFields()
  }
}
const state = Object.assign({},state_default)

export default { 
  namespaced: true,
  state: state,

  getters : {
    getSalesClientAccount(state){
      return state.sales_client_account
    },
    getClientAccounts(state){
      return state.client_accounts
    },
    getClientAccountAction(state){
      return state.client_account_action
    }
  },

  mutations : {
    resetState(state){
      Object.assign(state,state_default)
    },
    setSalesClientAccount(state, sales_client_account){
      state.sales_client_account = sales_client_account
    },
    updateSalesClientAccountChangePoint(state, new_points){
      state.sales_client_account.loyalty_points = new_points
    },
    setClientAccounts(state,client_accounts){
      state.client_accounts = client_accounts
    },
    setClientAccountAction(state,client_account_action){
      state.client_account_action = client_account_action
    },
    updateClientAccount(state,client_account){
      for(let i in state.client_accounts.items){
        if(state.client_accounts.items[i] == client_account.id){
          state.client_accounts.items[i] = Object.assign(state.client_accounts.items[i],client_account)
        }
      }
    },
    updateOutstandingByClientId(state,client_info){
      for(let i in state.client_accounts.items){
        if(state.client_accounts.items[i].client_id == client_info.client_id){
          state.client_accounts.items[i].outstanding = client_info.outstanding
        }
      }     
    }
  },

  actions : {
    async setSalesClientAccountDataAsync(context, query){
      let _sales_client_account_api = new SalesClientAccountApi()
      let response = await _sales_client_account_api.getClientAccountAsync(query)
      if(response.is_ok){
        context.commit('setSalesClientAccount', response.data)
        context.commit('client/updateSalesClientAccountToClientInformation', response.data, { root:true })
      }
      return response
    }
  }
}