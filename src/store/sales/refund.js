import _                  from 'lodash'
import { sales_options }   from '../../helpers/options/sales-options'
import RefundViewModel     from '../../view-model/sales/refund/refund-view-model'
import RefundItemViewModel from '../../view-model/sales/refund-item/refund-item-view-model'

const state_default = {
  client_id_using_refund: 0,
  refunds: [],
  refund_action_helper: {
    staff_options: [],
    client_prepaid_cards_all: [],
    client_prepaid_cards: [],
    client_prepaid_services: []
  },
  refund_action: {
    action: 0,
    data: new RefundViewModel().fields,
    options: {
      sales_goods_type: sales_options.sales_goods_type.service
    }
  },
  refund_item_action: {
    action: 0,
    data: new RefundItemViewModel().fields
  },
}

// initial state
const state = Object.assign({}, state_default)

// getters
const getters = {
  getClientIdUsingRefund(state){
    return state.client_id_using_refund
  },
  getRefunds(state){
    return state.refunds
  },
  getRefundActionHelper(state){
    return state.refund_action_helper
  },
  getRefundAction(state){
    return state.refund_action
  },
  getRefundItemAction(state){
    return state.refund_item_action
  },
}

// mutations
const mutations = {
  resetState(state){
    Object.assign(state, state_default)
  },
  setClientIdUsingRefund(state, client_id){
    state.client_id_using_refund = client_id
  },
  setRefunds(state, refunds){
    state.refunds = refunds
  },

  // sales action helper
  setRefundActionHelperStaffOptions(state, staff_options){
    state.refund_action_helper.staff_options = staff_options
  },
  setRefundActionHelperClientPrepaidCardsAll(state, client_prepaid_cards_all){
    state.refund_action_helper.client_prepaid_cards_all = client_prepaid_cards_all
  },
  setRefundActionHelperClientPrepaidCards(state, client_prepaid_cards){
    state.refund_action_helper.client_prepaid_cards = client_prepaid_cards
  },
  setRefundActionHelperClientPrepaidServices(state, client_prepaid_services){
    state.refund_action_helper.client_prepaid_services = client_prepaid_services
  },

  // refund action
  setRefundAction(state, refund_action){
    state.refund_action = refund_action
  },
  setRefundActionRefundFields(state, refund){
    state.refund_action.data = refund
  },
  updateRefund(state, refund){
    for(let i in state.refunds){
      if(state.refunds[i].refund_id == refund.refund_id){
        state.refunds[i] = Object.assign(state.refunds[i], refund)
      }
    }
  },
  deleteRefund(state, refund){
    let index = _.findIndex(state.refunds, [ 'refund_id', refund.refund_id ])
    state.refunds.splice(index, 1)
  },

  // refund-item action
  setRefundItemActionItemFields(state, refund_item){
    state.refund_item_action.data = refund_item
  },
  updateRefundActionRefundItem(state, refund_item_updated){
    for(let sales_item of state.refund_action.data.sales_items){
      if(sales_item.key == refund_item_updated.key){
        sales_item = Object.assign(sales_item, refund_item_updated)
      }
    }
  },

  // Utils
  setRefundActionShowedGoodsType(state, sales_goods_type){
    state.refund_action.options.sales_goods_type = sales_goods_type
  },
}

// actions
const actions = {
  setRefundsData({commit}, refunds){
    commit('setRefunds', refunds)
  },
  updateRefundData({commit}, refund){
    commit('updateRefund', refund)
  },
  deleteRefundData({commit}, refund){
    commit('deleteRefund', refund)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}