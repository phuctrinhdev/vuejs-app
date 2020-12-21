import ViewModel      from '../../view-model'
import { options }    from '../../../helpers/options'
import { emptyValue } from '../../../helpers/common'

export default class MessageSetupClientViewModel extends ViewModel {
  
  constructor() {
    super()
    this.fields = {
      id               : 0,
      shop_id          : 0,
      country_code     : null,
      send_time        : null,
      status           : null,
      send_days_before : 0,
      message_type     : options.messages_enums.message_type.sms,
      contents         : null,
      mms_max_bytes    : null,

      // Command
      image_base64 : '',
      image_url    : '',

      // Response
      image_path : '',
      image_name : '',

      is_delete_file : false
    }
  }

  mapFieldsFromApi(data) {
    if(!data) return
    
    this.fields.id               = data.messageSetupClientId
    this.fields.shop_id          = data.shopId
    this.fields.country_code     = data.countryCode
    this.fields.send_time        = data.sendTime
    this.fields.status           = data.status
    this.fields.send_days_before = data.sendDaysBefore
    this.fields.message_type     = data.messageType
    this.fields.image_path       = data.imagePath
    this.fields.image_name       = data.imageName
    this.fields.contents         = data.contents
  }

  mapFieldsToApi() {
    return {
      messageSetupClientId : this.fields.id,
      countryCode          : this.fields.country_code,
      shopId               : this.fields.shop_id,
      sendDaysBefore       : this.fields.send_days_before,
      sendTime             : this.fields.send_time,
      messageType          : this.fields.message_type,
      status               : this.fields.status,
      contents             : this.fields.contents,
      mmsMaxBytes          : this.fields.mms_max_bytes,
      imageUrl             : this.fields.image_url,
      imageBase64          : this.fields.image_base64,
      IsDeleteFile         : this.fields.is_delete_file
    }
  }

  mapDeleteFieldsToApi() {
    return {
      messageSetupClientId : this.fields.id,
      shopId               : this.fields.shop_id
    }
  }

  getValidationRules() {
    let validations = {
      message_type: {
        rules: {
          customRule: {
            process(model) {
              if(model.message_type == options.messages_enums.message_type.mms){
                if(emptyValue(model.image_url) && emptyValue(model.image_base64)) {
                  this.message = 'validate_messages.mms-image'
                  return false
                }
                else return true
              } else { // SMS, LMS
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
