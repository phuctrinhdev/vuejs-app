import _ from 'lodash'
import { sales_options }  from '../../helpers/options/sales-options'
import SalesViewModel     from '../../view-model/sales/sales/sales-view-model'
import SalesItemViewModel from '../../view-model/sales/sales-item/sales-item-view-model'
import SalesApi           from '../../api/sales/sales-api.js'

const state_default = {
  client_id_using_sales     : 0,
  client_shop_id_using_sales: 0,
  active_tab_name           : '',
  sales_list: {
    total_amount: 0,
    items       : [],
    pagination  : {}
  },
  sales_action_helper: {
    staff_options                 : [],
    client_prepaid_cards          : [],
    client_prepaid_cards_origin   : [],
    client_prepaid_cards_discount : [],
    client_prepaid_cards_all      : [],
    balance_moves                 : [],
    client_prepaid_services_all   : []
  },
  sales_action: {
    action : 0,
    data   : new SalesViewModel().fields,
    options: {
      sales_goods_type : sales_options.sales_goods_type.service,
      status           : 0
    }
  },
  sales_item_action: {
    action: 0,
    data  : new SalesItemViewModel().fields
  },
  money_calculator_panel_action: {
    action : 0,
    data   : 0,
    options: {}
  }
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getActiveTabName(state){
    return state.active_tab_name
  },
  getClientIdUsingSales(state){
    return state.client_id_using_sales
  },
  getClientShopIdUsingSales(state){
    return state.client_shop_id_using_sales
  },
  getSalesList(state){
    return state.sales_list
  },
  getSalesActionHelper(state){
    return state.sales_action_helper
  },
  getSalesAction(state){
    return state.sales_action
  },
  getSalesItemAction(state){
    return state.sales_item_action
  },
  getMoneyCalculatorPanelAction(state){
    return state.money_calculator_panel_action
  }
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setActiveTabName(state,tab_name){
    state.active_tab_name = tab_name
  },
  setClientIdUsingSales(state, client_id){
    state.client_id_using_sales = client_id
  },
  setClientShopIdUsingSales(state, client_shop_id){
    state.client_shop_id_using_sales = client_shop_id
  },
  setSalesList(state, sales){
    state.sales_list = sales
  },

  // sales action helper
  setSalesActionHelperStaffOptions(state, staff_options){
    state.sales_action_helper.staff_options = staff_options
  },
  setSalesActionHelperClientPrepaidCards(state, client_prepaid_cards){ // deposit
    state.sales_action_helper.client_prepaid_cards = client_prepaid_cards
  },
  setSalesActionHelperClientPrepaidCardsOrigin(state, client_prepaid_cards_origin){
    state.sales_action_helper.client_prepaid_cards_origin = client_prepaid_cards_origin
  },
  setSalesActionHelperClientPrepaidCardsDiscount(state, client_prepaid_cards_discount){
    state.sales_action_helper.client_prepaid_cards_discount = client_prepaid_cards_discount
  },
  setSalesActionHelperClientPrepaidCardsAll(state, client_prepaid_cards_all){
    state.sales_action_helper.client_prepaid_cards_all = client_prepaid_cards_all
  },
  setSalesActionHelperBalanceMoves(state, balance_moves){
    state.sales_action_helper.balance_moves = balance_moves
  },
  setSalesActionHelperClientPrepaidServicesAll(state, client_prepaid_services_all){
    state.sales_action_helper.client_prepaid_services_all = client_prepaid_services_all
  },

  // sales action
  setSalesAction(state, sales_action){
    state.sales_action = Object.assign(state.sales_action, sales_action)
  },
  setSalesActionSalesFields(state, sales){
    state.sales_action.data = sales
  },
  updateSales(state, sales){
    for(let i in state.sales_list.items){
      if(state.sales_list.items[i].sales_number == sales.sales_number){
        state.sales_list.items[i] = Object.assign(state.sales_list.items[i], sales)
      }
    }
  },
  updateSalesNotes(state, item){
    for(let sales_brief of state.sales_list.items){
      if(sales_brief.sales_number == item.sales_number || sales_brief.ref_id == item.refund_id){
        sales_brief.notes = item.notes
      }
    }
  },
  deleteSales(){ // state, sales_delete
    // for(let i of state.sales_list.items){
    //   let tmp_sales = state.sales_list.items[i]
    //   console.log('sales_delete', sales_delete, tmp_sales)
    //   if(tmp_sales.sales_number == sales_delete.sales_number){
    //     state.sales_list.splice(i, 1)
    //   }
    // }
  },

  // sales-item action
  setSalesItemActionItemFields(state, sales_item){
    state.sales_item_action.data = sales_item
  },
  updateSalesActionSalesItem(state, sales_item_updated){
    for(let sales_item of state.sales_action.data.sales_items){
      if(sales_item.key == sales_item_updated.key){
        sales_item = Object.assign(sales_item, sales_item_updated)
      }
    }
  },

  // sales-item client prepaid card

  

  // sales-item client prepaid service
  addItemToClientPrepaidServicesAll(state, client_prepaid_service){
    state.sales_action_helper.client_prepaid_services_all.unshift(client_prepaid_service)    
  },
  deleteItemFromClientPrepaidServicesAll(state, client_prepaid_service_id){
    state.sales_action_helper.client_prepaid_services_all = _.filter(state.sales_action_helper.client_prepaid_services_all, ps => ps.id != client_prepaid_service_id)
  },
  updateItemQuantityToClientPrepaidServicesAll(state, client_prepaid_service_changed_quantity){
    for(let client_prepaid_service of state.sales_action_helper.client_prepaid_services_all){
      if(client_prepaid_service.id == client_prepaid_service_changed_quantity.id){
        client_prepaid_service.quantity = client_prepaid_service_changed_quantity.new_quantity
      }
    }
  },

  // Utils
  setSalesActionShowedGoodsType(state, sales_goods_type){
    state.sales_action.options.sales_goods_type = sales_goods_type
  },
  setMoneyCalculatorPanelAction(state, money_calculator_panel_action){
    state.money_calculator_panel_action = money_calculator_panel_action
  }
}

// actions
const actions = {
  updateSalesData({commit}, sales){
    commit('updateSales', sales)
  },

  async loadClientSalesHistoryAsync({commit},filter){
    try{
      let sales_api = new SalesApi()
      let response  = await sales_api.getSalesHistoryByClientAsync(filter)
      if (response.is_ok){
        commit('setSalesList', response.data)
      }
      return response
    }catch(e){
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