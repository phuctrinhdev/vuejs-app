import ViewModel      from '../../view-model'

export default class MessageSetupPostVisitGeneralViewModel extends ViewModel {
  
  constructor() {
    super()
    this.fields = {
      id           : 0,
      shop_id      : 0,
      country_code : null,
      send_time    : null,
      check_future_booking : false
    }
  }

  mapFieldsFromApi(data) {
    if(!data) return
    
    this.fields.id           = data.messageSetupPostVisitGeneralId
    this.fields.shop_id      = data.shopId
    this.fields.country_code = data.countryCode
    this.fields.send_time    = data.sendTime
    this.fields.check_future_booking = data.checkFutureBooking
  }

  mapFieldsToApi() {
    return {
      messageSetupPostVisitGeneralId : this.fields.id,
      countryCode : this.fields.country_code,
      shopId      : this.fields.shop_id,
      sendTime    : this.fields.send_time,
      checkFutureBooking : this.fields.check_future_booking
    }
  }

  getValidationRules() {
    let validations = {
    }
    return validations
  }

  isValid() {
    return super.isValid(this.getValidationRules())
  }
}
