import Validator                     from '../../../view-model/validator.js'
import UpdatePrepaidServiceViewModel from '../../../view-model/sales/prepaid-service/update-prepaid-service-view-model.js'
import SalesUtils                    from '../../../helpers/utils/sales-utils.js'
import i18n                          from '../../../translate/translate'
import { sales_options }             from '../../../helpers/options/sales-options.js'
import { options }                            from '../../../helpers/options'
import { formatMoney,convertDateToTimeStamp } from '../../../helpers/common.js'
import _                                      from 'lodash'
import moment                                 from 'moment'

export default class PrepaidServicesActionViewData{
  constructor(prepaid_service_action){
    // intial 
    this._validator         = new Validator()
    this._current_remaining = { text : '', value : 0 }
    this._new_remaining     = { text : '', value : 0 }
    this._current_expiry    = { text : null, value: 0 }
    this._new_expiry        = { text : null, value: 0 }
    this._is_remaining_no_limit     = false
    this._is_expiry_date_no_limit   = false
    this._id                        = prepaid_service_action.data.id
    this._updating_type             = sales_options.prepaid_service_history_type_enum.quantity_edit

    // Reset value
    this.setDefaultValue(prepaid_service_action)   
  }

  // Remaining
  get current_remaining(){
    return this._current_remaining.text
  }
  set current_remaining(value){
    if(value == sales_options.NOT_LIMIT){
      this._is_remaining_no_limit = true
      this._current_remaining    = {
        text  : i18n.t('general.no-limit'),
        value : Number(sales_options.NOT_LIMIT)
      }
    }else{
      this._is_remaining_no_limit = false
      this._current_remaining    = {
        text : formatMoney(value,0),
        value : Number(value)
      }
    }
  }

  // New Remaining
  get new_remaining(){
    return this._new_remaining.text
  }
  set new_remaining(value){
    if(Number(value) == sales_options.NOT_LIMIT){
      this._new_remaining = {text :i18n.t('general.no-limit'), value : sales_options.NOT_LIMIT}
      this._is_remaining_no_limit = true
      return
    }
    if(value.toString().length == 0){
      this._new_remaining = {text : '', value : 0}
      return 
    }
    let tmp_val = value.toString().replace(/,/g,'')
    if(Number(tmp_val) <= Number.MAX_SAFE_INTEGER){
      this._new_remaining = {
        text : formatMoney(tmp_val,0),
        value : Number(tmp_val)
      }
    }
  }

  // Current Expiry
  get current_expiry(){
    return this._current_expiry.text
  }
  set current_expiry(value){
    this._is_expiry_date_no_limit = value == sales_options.NOT_LIMIT ? true : false
    this._current_expiry = {
      text  : SalesUtils.formatNoLimitDateTs(value),
      value : Number(value)
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
    if(this._is_expiry_date_no_limit || Number(value) == sales_options.NOT_LIMIT){
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

  // Remaning No Limit
  get is_remaining_no_limit(){
    return this._is_remaining_no_limit
  }
  set is_remaining_no_limit(value){
    this._is_remaining_no_limit = value
    this.new_remaining = value == true ? sales_options.NOT_LIMIT : ''
  }

  // Expiry Date No Limit
  get is_expiry_date_no_limit(){
    return this._is_expiry_date_no_limit
  }
  set is_expiry_date_no_limit(value){
    this._is_expiry_date_no_limit = value
    this.new_expiry = value == true ? sales_options.NOT_LIMIT : null
  }

  // Updating Type
  get updating_type(){
    return this._updating_type
  }
  set updating_type(value){
    this._updating_type = value
  }

  // Set default value when changing tabs
  setDefaultValue(prepaid_service_action){
    this.current_remaining = prepaid_service_action.data.quantity
    this.current_expiry    = prepaid_service_action.data.expiry_date_ts
    this.new_remaining     = this._is_remaining_no_limit   == true ? sales_options.NOT_LIMIT : ''
    this.new_expiry        = this._is_expiry_date_no_limit == true ? sales_options.NOT_LIMIT : null
    if(this._updating_type == sales_options.prepaid_service_history_type_enum.quantity_edit){
      this._new_expiry    = this._current_expiry
    }else{
      this._new_remaining = this._current_remaining
    }
  }

  mapToUpdatePrepaidServiceVm(shop,client,user){
    let model = new UpdatePrepaidServiceViewModel()
    model.setFields({
      id                          : this._id,
      prepaid_service_history_type: this._updating_type,
      quantity                    : this._new_remaining.value,
      expiry_date_ts              : this._new_expiry.value,

      // Client
      client_id       : client.id,
      family_id       : client.family_id,
      client_name     : client.client_name,

      // User
      created_by_id   : user.user_id,
      created_by_name : user.user_name,
      session_token   : user.session_token,

      // Shop Information
      shop_location   : shop.shop_location,
      shop_id         : shop.shop_id
    }) 
    return model
  }

  isValid(){
    /** 
     * Validation rules shows below:
     * - New Remaining is required
     * - New Remaining must be different than Remaining
     * - New Remianing value is must equal or smaller than 9999.
     * - New Expiry Date is required
     * - New Expiry Date must be different than Expiry Date
     * - Only 1 of 2 allowed for NoLimit
     * */ 
    let messages        = []
    let max_value       = 9999
    let new_remaining_text = i18n.t('sales-prepaid-service-tab.new-remaining')
    let new_expiry_text    = i18n.t('sales-prepaid-service-tab.new-expiry-date')
    let require_message    = i18n.t('validate_messages.require')
    if (this._updating_type == sales_options.prepaid_service_history_type_enum.quantity_edit){
      if(this._new_remaining.text != '' && this._new_remaining.text.length != 0){
        if(this._new_remaining.value > max_value){
          let max_value_message = i18n.t('validate_messages.maxValue')
          max_value_message = max_value_message.replace('{field}',`<span>${new_remaining_text}</span>`)
          max_value_message = max_value_message.replace('{max_value}',max_value)
          messages.push(max_value_message)
        }else if(this._new_remaining.value == this._current_remaining.value){
          messages.push(i18n.t('sales-prepaid-service-tab.new-remaining-different-current-remaining'))
        }
      }else{
        require_message = require_message.replace('{field}',`<span>${new_remaining_text}</span>`)
        messages.push(require_message)
      }
    }else{
      if(this._new_expiry.text == null){
        require_message = require_message.replace('{field}',`<span>${new_expiry_text}</span>`)
        messages.push(require_message)
      }else if(this._new_expiry.value == this._current_expiry.value){
        messages.push(i18n.t('sales-prepaid-service-tab.new-expiry-different-current-expiry'))
      }
    }
    if(this._is_expiry_date_no_limit && this._is_remaining_no_limit){
      messages.push(i18n.t('sales-prepaid-service-tab.no-limit-error-message'))
    }
    return messages
  }
}