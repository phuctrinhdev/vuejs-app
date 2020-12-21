import ViewModel             from '../../view-model'
import { options }           from '../../../helpers/options'
import { checkNullAndEmpty } from '../../../helpers/common'

export default class MessageSetupSalesViewModel extends ViewModel {
  
  constructor() {
    super()
    this.fields = {
      id               : 0,
      shop_id          : 0,
      country_code     : null,
      send_time        : '00:00',
      status           : options.common_status.inactive,
      send_days_before : 0,
      message_type     : options.messages_enums.message_type.sms,
      contents         : null,
      limit            : null,
      setup_type       : options.messages_enums.setup_automatic_messaging_type.balance_add
    }
  }

  mapFieldsFromApi(data) {
    if(!data) return
    
    this.fields.id               = data.messageSetupSalesId
    this.fields.shop_id          = data.shopId
    this.fields.country_code     = data.countryCode
    this.fields.send_time        = data.sendTime
    this.fields.status           = data.status
    this.fields.send_days_before = data.sendDaysBefore
    this.fields.message_type     = data.messageType
    this.fields.contents         = data.contents
    this.fields.limit            = data.limit
    this.fields.setup_type       = data.setupType
  }

  mapFieldsToApi() {
    return {
      messageSetupSalesId  : this.fields.id,
      countryCode          : this.fields.country_code,
      shopId               : this.fields.shop_id,
      sendDaysBefore       : this.fields.send_days_before,
      sendTime             : this.fields.send_time,
      messageType          : this.fields.message_type,
      status               : this.fields.status,
      contents             : this.fields.contents,
      limit                : this.fields.limit,
      setupType            : this.fields.setup_type
    }
  }

  mapDeleteFieldsToApi() {
    return {
      messageSetupSalesId : this.fields.id,
      shopId              : this.fields.shop_id,
    }
  }

  getValidationRules() {
    let validations = {
      send_days_before: {
        rules: {
          minValue: {
            min_value: 0
          },
          maxValue: {
            max_value: 90
          },
          numbers: ''
        }
      },
      limit: {
        rules: {
          maxLength: {
            max_value: 12
          },
          numbers: ''
        }
      },
      status: {
        label : 'messages.contents',
        rules: {
          customRule: {
            process(model) {
              if(model.status == options.common_status.active && checkNullAndEmpty(model.contents)){
                this.message = 'validate_messages.require'
                return false
              }
              else return true
            }
          }
        }
      }
    }
    return validations
  }

  isValid() {
    return super.isValid(this.getValidationRules())
  }
}
