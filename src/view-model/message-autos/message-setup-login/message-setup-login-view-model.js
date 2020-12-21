import ViewModel   from '../../view-model'
import { options } from '../../../helpers/options'

export default class MessageSetupLoginViewModel extends ViewModel {
  
  constructor() {
    super()
    this.fields = {
      id             : 0,
      shop_id        : 0,
      country_code   : null,
      receiver_phone : null,
      status         : options.common_status.inactive
    }
  }

  mapFieldsFromApi(data, shop_id) {
    if(!data) return
    
    this.fields.id             = data.id
    this.fields.shop_id        = shop_id
    this.fields.country_code   = data.countryCode
    this.fields.receiver_phone = data.receiverPhone
    this.fields.status         = data.status
  }

  mapFieldsToApi() {
    return {
      shopId        : this.fields.shop_id,
      countryCode   : this.fields.country_code,
      receiverPhone : this.fields.receiver_phone,
      status        : this.fields.status,
    }
  }

  getValidationRules() {
    let validations = {
      receiver_phone: {
        rules: {
          require: '',
          mobilePhone: {
            country: this.fields.country_code
          },
        }
      },
    }
    return validations
  }

  isValid() {
    return super.isValid(this.getValidationRules())
  }
}
