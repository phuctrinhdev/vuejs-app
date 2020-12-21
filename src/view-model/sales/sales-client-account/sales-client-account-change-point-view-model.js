import ViewModel from '../../view-model.js'

export default class SalesClientAccountChangePointViewModel extends ViewModel {
  constructor(){
    super()

    this.fields = {
      client_id               : 0,
      client_name             : '',
      client_mobile_number    : '',
      client_phone_number     : '',
      loyalty_points          : 0,
      updated_by_id           : 0,
      updated_by_name         : '',
      shop_id                 : 0
    }
  }
  mapFieldsFromApi(api_data){
    this.fields.client_id               = api_data.clientId
    this.fields.client_name             = api_data.clientName
    this.fields.client_mobile_number    = api_data.clientMobileNumber
    this.fields.client_phone_number     = api_data.clientPhoneNumber
    this.fields.loyalty_points          = api_data.loyaltyPoints
    this.fields.updated_by_id           = api_data.updatedById
    this.fields.updated_by_name         = api_data.updatedByName
    this.fields.shop_id                 = api_data.shopId
  }
  mapFieldsToApi(){
    return {
      clientId          : this.fields.client_id,
      clientName        : this.fields.client_name,
      clientMobileNumber: this.fields.client_mobile_number,
      clientPhoneNumber : this.fields.client_phone_number,
      loyaltyPoints     : this.fields.loyalty_points,
      updatedById       : this.fields.updated_by_id,
      updatedByName     : this.fields.updated_by_name,
      shopId            : this.fields.shop_id,
    }
  }
}