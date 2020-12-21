import ViewModel   from '../../view-model'
import { options } from '../../../helpers/options'

export default class MessageSetupViewModel extends ViewModel {
  
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
      image_path       : null,
      image_name       : null,
      contents         : null,
    }
  }

  // mapFieldsFromApi(data) {
  //   if(!data) return
    
  //   this.fields.id               = data.messageSetupClientId
  //   this.fields.shop_id          = data.shopId
  //   this.fields.country_code     = data.countryCode
  //   this.fields.send_time        = data.sendTime
  //   this.fields.status           = data.status
  //   this.fields.send_days_before = data.sendDaysBefore
  //   this.fields.message_type     = data.messageType
  //   this.fields.image_path       = data.imagePath
  //   this.fields.image_name       = data.imageName
  // }

  // mapFieldsToApi() {
  //   return {
  //     shopId        : this.fields.shop_id,
  //     countryCode   : this.fields.country_code,
  //     receiverPhone : this.fields.receiver_phone,
  //     status        : this.fields.status,
  //   }
  // }

  getValidationRules() {
    let validations = {
    }
    return validations
  }

  isValid() {
    return super.isValid(this.getValidationRules())
  }
}
