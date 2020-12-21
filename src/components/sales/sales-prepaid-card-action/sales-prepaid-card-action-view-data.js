import i18n                                   from '../../../translate/translate'
import Validator                              from '../../../view-model/validator.js'
import UpdatePrepaidCardViewModel             from '../../../view-model/sales/prepaid-card/update-prepaid-card-view-model.js'
import SalesUtils                             from '../../../helpers/utils/sales-utils.js'
import { sales_options }                      from '../../../helpers/options/sales-options.js'
import { options }                            from '../../../helpers/options'
import {
  formatMoney,
  convertDateToTimeStamp
}                                             from '../../../helpers/common.js'
import _                                      from 'lodash'
import moment                                 from 'moment'

export default class PrepaidCardActionViewData{

  constructor(prepaid_card_action){
    
    // intial 
    this._validator       = new Validator()
    this._is_no_limit     = false

    this._current_expiry  = { text : null, value: 0 }
    this._new_expiry      = { text : null, value: 0 }
    this._new_balance     = { text : ''  , value: 0 }
    this._current_balance = { text : ''  , value: 0 }
    this._updating_type   = sales_options.prepaid_card_history_type_enum.balance_edited
    this._id              = prepaid_card_action.data.id

    if(prepaid_card_action.data.prepaid_card_type ==
      options.prepaid_card_type.discount_card){
      this._updating_type = sales_options.
        prepaid_card_history_type_enum.
        expiry_date_edited
    }
    this.setDefaultValue(prepaid_card_action)
  }

  // Current Balance
  get current_balance(){
    return this._current_balance.text
  }
  set current_balance(val){
    let tmp_val = val.toString().replace(/,/g,'')
    this._current_balance = {
      text  : formatMoney(tmp_val,0),
      value : Number(tmp_val)
    }
  }

  // New Balance
  get new_balance(){
    return this._new_balance.text
  }
  set new_balance(val){
    let tmp_val = val.toString().replace(/,/g,'')
    if(Number(tmp_val) <= Number.MAX_SAFE_INTEGER){
      this._new_balance = {
        text  : formatMoney(tmp_val,0),
        value : Number(tmp_val)
      }
    }
  }

  // Current Expiry
  get current_expiry(){
    return this._current_expiry.text
  }
  set current_expiry(date_time_ts){
    this.is_no_limit = date_time_ts == sales_options.NOT_LIMIT ? true : false
    this._current_expiry = {
      text  : SalesUtils.formatNoLimitDateTs(date_time_ts),
      value : Number(date_time_ts)
    }
  }

  // New Expiry
  get new_expiry(){
    return this._new_expiry.text
  }
  set new_expiry(value){
    if(value == null){
      this._new_expiry  = { text : null, value: 0 }
      return
    }
    if(this._is_no_limit){
      this._new_expiry = {text  : i18n.t('general.no-limit'),value : sales_options.NOT_LIMIT }
    }else{
      let end_of_day_utc_ts = typeof value === 'string' ? new Date(_.cloneDeep(value)) : _.cloneDeep(value)
      end_of_day_utc_ts = moment(end_of_day_utc_ts).add(1, 'days').format(options.standard_date_format.ymd)
      end_of_day_utc_ts = convertDateToTimeStamp(end_of_day_utc_ts, false, false) - 1
      this._new_expiry  = {
        text  : value,
        value : end_of_day_utc_ts
      }
    }
  }

  // No Limit
  get is_no_limit(){
    return this._is_no_limit
  }
  set is_no_limit(val){
    this._is_no_limit = val
    if(val){
      this.new_expiry = sales_options.NOT_LIMIT
    }else{
      this.new_expiry = null
    }
  }

  // Updating Type
  get updating_type(){
    return this._updating_type
  }
  set updating_type(value){
    this._updating_type = value
  }

  // Set default value when changing tabs
  setDefaultValue(prepaid_card_action){
    this.current_balance = prepaid_card_action.data.balance
    this.current_expiry  = prepaid_card_action.data.expiry_date_ts
    if(this._updating_type == sales_options.prepaid_card_history_type_enum.balance_edited){
      this._new_expiry  = this._current_expiry
      this._new_balance = { text : '' , value: 0 }
    }else{
      this._new_balance = this._current_balance
    }
  }

  mapToUpdatePrepaidCardViewModel(shop_data,client_info,user_info){
    let update_prepaid_card_vm = new UpdatePrepaidCardViewModel()
    update_prepaid_card_vm.setFields({
      id                        : this._id,
      balance                   : this._new_balance.value,
      expiry_date_ts            : this._new_expiry.value,
      prepaid_card_history_type : this._updating_type,

      // Client
      client_id       : client_info.id,
      family_id       : client_info.family_id,
      client_name     : client_info.client_name,

      // User
      created_by_id   : user_info.user_id,
      create_by_name  : user_info.user_name,
      session_token   : user_info.session_token,

      // Shop Information
      shop_location   : shop_data.shop_location,
      shop_id         : shop_data.shop_id
    })
    return update_prepaid_card_vm
  }

  isValid(){
    let messages        = []
    let max_value       = 99999999999
    let new_balance     = i18n.t('sales-prepaid-card-tab.new-balance')
    let current_expiry  = i18n.t('sales-prepaid-card-tab.current-expiry-date')
    let current_balance = i18n.t('sales-prepaid-card-tab.current-balance')
    let new_expiry      = i18n.t('sales-prepaid-card-tab.new-expiry-date')
    let require_message = i18n.t('validate_messages.require')
    let new_old_current = i18n.t('sales-prepaid-card-tab.new-diferrent-current')

    if(this._updating_type == sales_options.prepaid_card_history_type_enum.balance_edited){
      if(this._new_balance.text != '' && this._new_balance.text.length != 0){
        if(this._new_balance.value > max_value){
          let max_value_message = i18n.t('validate_messages.maxValue')
          max_value_message = max_value_message.replace('{field}',`<span>${new_balance}</span>`)
          max_value_message = max_value_message.replace('{max_value}',max_value)
          messages.push(max_value_message)
        }else if(this._new_balance.value == this._current_balance.value){
          new_old_current = new_old_current.replace('{new}',new_balance)
          new_old_current = new_old_current.replace('{current}',current_balance)
          messages.push(new_old_current)
        }
      }else{
        require_message = require_message.replace('{field}',`<span>${new_balance}</span>`)
        messages.push(require_message)
      }
    }else{
      if(this._new_expiry.text == null){
        require_message = require_message.replace('{field}',`<span>${new_expiry}</span>`)
        messages.push(require_message)
      }else if(this._new_expiry.value == this._current_expiry.value){
        new_old_current = new_old_current.replace('{new}',new_expiry)
        new_old_current = new_old_current.replace('{current}',current_expiry)
        messages.push(new_old_current)
      }
    }
    return messages
  }
}
