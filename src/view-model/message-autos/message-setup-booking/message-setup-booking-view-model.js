import ViewModel      from '../../view-model'
import { options }    from '../../../helpers/options'
import { emptyValue } from '../../../helpers/common'

export default class MessageSetupBookingViewModel extends ViewModel {
  
  constructor() {
    super()
    this.fields = {
      id               : 0,
      shop_id          : 0,
      country_code     : null,
      setup_type       : null,
      send_time        : null,
      status           : null,
      send_days_before : 0,
      message_type     : options.messages_enums.message_type.sms,
      contents         : null,
    }
  }

  mapFieldsFromApi(data) {
    if(!data) return
    
    this.fields.id               = data.messageSetupBookingId
    this.fields.shop_id          = data.shopId
    this.fields.country_code     = data.countryCode
    this.fields.setup_type       = data.setupType
    this.fields.send_time        = data.sendTime
    this.fields.status           = data.status
    this.fields.send_days_before = data.sendDaysBefore
    this.fields.message_type     = data.messageType
    this.fields.contents         = data.contents
  }

  mapFieldsToApi() {
    return {
      messageSetupBookingId : this.fields.id,
      countryCode          : this.fields.country_code,
      shopId               : this.fields.shop_id,
      setupType            : this.fields.setup_type,
      sendDaysBefore       : this.fields.send_days_before,
      sendTime             : this.fields.send_time,
      messageType          : this.fields.message_type,
      status               : this.fields.status,
      contents             : this.fields.contents,
    }
  }

  mapDeleteFieldsToApi() {
    return {
      messageSetupBookingId : this.fields.id,
      shopId                : this.fields.shop_id,
    }
  }

  getValidationRules() {
    let validations = {
      message_type: {
        rules: {
          customRule: {
            process(model) {              
              { // SMS, LMS
                if(emptyValue(model.contents)) {
                  this.message = 'validate_messages.sms-lms-require'
                  return false
                }
                else return true
              }
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
