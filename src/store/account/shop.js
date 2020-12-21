import { FORM_ACTIONS } from '../../config/constant'
import ShopInfoApi from '../../api/account/shop-info-api.js'
import TaxInvoiceInfoApi from '../../api/account/tax-invoice-info-api.js'
import ShopEnvironmentApi from '../../api/account/shop-environment-api'

const state_default = {  
  shop_info_action: {},  
  tax_invoice_info: {},
  monthly_fee_info:{},
  shop_environment: {}
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {  
  getShopInfoAction(state){
    return state.shop_info_action
  },  
  getTaxInvoiceInfo(state){
    return state.tax_invoice_info
  }, 
  getMonthlyFeeInfo(state){
    return state.monthly_fee_info
  }, 
  getShopEnvironment(state){
    return state.shop_environment
  },
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  // shop info
  setShopInfoAction(state, action){
    state.shop_info_action = action
  },

  // tax invoice info
  setTaxInvoiceInfo(state, tax_invoice_info){
    state.tax_invoice_info = tax_invoice_info
  },

  // monthly info
  setMonthlyFeeInfo(state, monthly_fee_info){
    state.monthly_fee_info = monthly_fee_info
  },

  // shop environment
  setShopEnvironment(state, shop_environment){
    state.shop_environment = shop_environment
  },
}

// actions
const actions = {
  async setShopInfoActionDataAsync({commit}, shop_info_action){
    try{
      let shop_api = new ShopInfoApi()
      let result = await shop_api.getShopInfoAsync(shop_info_action)
      commit('setShopInfoAction', result)
    }catch(e){
      return this.http.loadError(e)
    }
  },
  
  // tax inovice info
  async setTaxInvoiceInfoDataAsync({commit}, tax_invoice_info_action){    
    try{
      if(tax_invoice_info_action.action == FORM_ACTIONS.EDIT){
        let tax_invoice_info_api = new TaxInvoiceInfoApi()
        let result = await tax_invoice_info_api.getTaxInvoiceInfoAsync(tax_invoice_info_action)
        commit('setTaxInvoiceInfo', result)
      }else{
        commit('setTaxInvoiceInfo', tax_invoice_info_action)
      }
    }catch(e){
      return this.http.loadError(e)
    }
  },

  // tax inovice info
  async setMonthlyFeeInfoDataAsync({commit}, query){    
    try{
      let shop_api = new ShopInfoApi()
      let result = await shop_api.getShopMonthlyFeeAsync(query)
      commit('setMonthlyFeeInfo', result)
    }catch(e){
      return this.http.loadError(e)
    }
  },

  // shop environment
  async setShopEnvironmentDataAsync({commit}, data){
    try{
      let shop_environment_api = new ShopEnvironmentApi()
      let result = await shop_environment_api.getShopEnvironmentAsync(data)
      commit('setShopEnvironment', result)
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
