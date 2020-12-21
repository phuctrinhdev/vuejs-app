import _                     from 'lodash'
import i18n                  from '../../translate/translate.js'
import store                 from '../../store/store'
import { sales_options }     from '../options/sales-options'
import { common_options }    from '../options/common-options'

import { formatMoney, convertTimeStampToUtcDate, convertDateToTimeStamp }   from '../../helpers/common'
import moment from 'moment'

export default class SalesUtils {

  static getDiscountCardsToApply(sales_goods_type){
    let tmp_sales_action_helper = store.getters['sales/getSalesActionHelper']
    let tmp_discount_cards_to_apply = tmp_sales_action_helper.client_prepaid_cards_all

    if(sales_goods_type == sales_options.sales_goods_type.service){
      tmp_discount_cards_to_apply = _.filter(tmp_discount_cards_to_apply, c => c.discount_for_client && c.discount_for_service > 0)
      tmp_discount_cards_to_apply = _.sortBy(tmp_discount_cards_to_apply, ['discount_for_service'])
    }
    if(sales_goods_type == sales_options.sales_goods_type.product){
      tmp_discount_cards_to_apply = _.filter(tmp_discount_cards_to_apply, c => c.discount_for_client && c.discount_for_product > 0)
      tmp_discount_cards_to_apply = _.sortBy(tmp_discount_cards_to_apply, ['discount_for_product'])
    }
    tmp_discount_cards_to_apply = tmp_discount_cards_to_apply.reverse()
    return tmp_discount_cards_to_apply
  }

  static updateStaffsAmountOfSalesItem(staffs, sales_item_amount){
    let split_sales_type        = this.getSplitSalesTypeOfSalesItem(staffs)
    let tmp_staff_amount        = Math.floor(sales_item_amount / staffs.length)
    let tmp_staff_amount_remain = sales_item_amount % staffs.length

    if(split_sales_type == sales_options.split_sales_type.even){
      staffs.map(s => s.amount = tmp_staff_amount)
      if(tmp_staff_amount_remain > 0){
        _.last(staffs).amount += tmp_staff_amount_remain
      }
    }
    if(split_sales_type == sales_options.split_sales_type.user_input){
      let tmp_sales_item_amount_old = staffs.reduce((total, item) => total + item.amount,0)
      for(let i in staffs){
        let staff = staffs[i]
        let tmp_percent_old = staff.amount / tmp_sales_item_amount_old
        staff.amount = Math.floor(sales_item_amount * tmp_percent_old)
        if(i == staffs.length - 1){
          let tmp_sales_item_amount = staffs.reduce((total, item) => total + item.amount,0)
          tmp_staff_amount_remain = sales_item_amount - tmp_sales_item_amount
          staff.amount += tmp_staff_amount_remain
        }
      }
    }
    return staffs
  }

  static getSplitSalesTypeOfSalesItem(staffs){
    let split_sales_type        = sales_options.split_sales_type.even
    let split_sales_total       = staffs.reduce((sum, staff) => sum + staff.amount, 0)
    let tmp_staff_amount        = Math.floor(split_sales_total / staffs.length)
    let tmp_staff_amount_remain = split_sales_total % staffs.length
    let tmp_staff_amount_last   = tmp_staff_amount + tmp_staff_amount_remain

    for(let i in staffs){
      let tmp_staff = staffs[i]
      tmp_staff.amount = Number(tmp_staff.amount)
      if((i > 0 && tmp_staff.amount != tmp_staff_amount)
      && (i == staffs.length - 1 && tmp_staff.amount != tmp_staff_amount_last)){
        split_sales_type = sales_options.split_sales_type.user_input
      }
    }
    return split_sales_type
  }

  static calculateRefundLoyaltyPoints(items, payments, points_setup, decimal = 0){
    let tmp_loyalty_points = 0
    let tmp_items          = _.cloneDeep(items)
    let tmp_payments       = _.cloneDeep(payments)
    
    if(tmp_payments.length > 0 && tmp_items.length > 0){
      for(let payment of tmp_payments){
        if(payment.payment_amount <= 0) break
        for(let tmp_item of tmp_items){
          let point_setup = _.find(points_setup.loyalty_points_setups,x=>x.goods_type == tmp_item.goods_type && x.is_apply == true)
          if (point_setup !== undefined){
            let points_setup_item = _.find(point_setup.loyalty_points_setup_items, x=>x.payment_method_setup_id == payment.payment_method_id)
            if (points_setup_item !== undefined){
              if(tmp_item.amount > 0 && payment.payment_amount > 0){
                let tmp_amount = tmp_item.amount
                let tmp_payment_amount = payment.payment_amount
                payment.payment_amount = tmp_payment_amount - tmp_amount
                if(tmp_amount == 0) continue
                if(payment.payment_amount >= 0){
                  tmp_loyalty_points += tmp_amount * points_setup_item.percentage / 100                  
                }else{
                  tmp_loyalty_points += tmp_payment_amount * points_setup_item.percentage / 100
                }
              }
            } 
          }
        }
      }
    }
    
    // round
    let factor = Math.pow(10, decimal)
    tmp_loyalty_points = Math.round(tmp_loyalty_points * factor) / factor
    return tmp_loyalty_points
  }

  static isExpiredCard(expiry_date_ts){
    let is_expired_card = false
    let today_ts = convertDateToTimeStamp(new Date())
    if(expiry_date_ts != -1 && today_ts > expiry_date_ts)
      is_expired_card = true
    return is_expired_card
  }

  static formatNoLimitNumber(value,decimal_count){
    let text = ''
    if (typeof value != 'number') return text
    if (value < sales_options.NOT_LIMIT) return text
    text = value == sales_options.NOT_LIMIT ? i18n.t('general.no-limit') : formatMoney(value,decimal_count)
    return text
  }

  /**
   * This function will be apply for Sales Prepaid Card and Sales Prepaid Service
   * If value is nolimit(-1) then return 'No Limit' text
   * otherwise return a utc date.
   */
  static formatNoLimitDateTs(value){
    let text = ''
    if(typeof value !== 'number') return text
    if(value < sales_options.NOT_LIMIT) return text
    text = value == sales_options.NOT_LIMIT ? i18n.t('general.no-limit') : 
      moment(convertTimeStampToUtcDate(value)).format(common_options.standard_date_format.ymd)
    return text
  }

  static formatOutstandingHistoryType(value){
    let text = ''
    let outstanding_history_type = _.find(sales_options.outstanding_history_type,t=>t.value == value)
    if (outstanding_history_type != undefined){
      text = i18n.t(outstanding_history_type.text)
    }
    return text
  }

  static formatStaffsOnSalesTable(sales_items,is_view_all){
    let sales_items_staffs = sales_items.map(i => i.staffs)
    let tmp_sales_items_staffs = []
    for(let sales_item_staffs of sales_items_staffs){
      let tmp_sales_item_staffs = sales_item_staffs.map(s => s.staff_name)
      let tmp_sales_item_staffs_view = ''
      if(tmp_sales_item_staffs.length > 1){
        if(is_view_all){
          tmp_sales_item_staffs_view = tmp_sales_item_staffs.join(', ')
        } else {
          tmp_sales_item_staffs_view = tmp_sales_item_staffs[0] + '+'
        }
      } else {
        tmp_sales_item_staffs_view = tmp_sales_item_staffs
      }
      if(tmp_sales_item_staffs_view.length > 0)
        tmp_sales_items_staffs.push(tmp_sales_item_staffs_view)
    }
    return tmp_sales_items_staffs.join('<br>')
  }

  static isStaffsCompact(sales_items){
    let is_compact = false
    let staffs_text = this.formatStaffsOnSalesTable(sales_items, false)
    
    if(staffs_text.indexOf('+') > -1)
      is_compact = true
    return is_compact
  }

  static formatItemAmountOnSalesTable(sales_items){
    let tmp = ''
    for(let i in sales_items){
      if(i < 10){
        let item = sales_items[i]
        tmp += `<span>${formatMoney(item.amount,0)}<br></span>`
      }
      else {
        tmp += '<span>...</span>'
        break
      }
    }
    return tmp
  }
}