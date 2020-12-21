import ViewModel from '../../view-model'

export default class OutstandingDeleteViewModel extends ViewModel {
  constructor(){
    super()

    this.fields = {
      outstanding_payment_id: 0,
      client_id             : 0,
      client_name           : '',
      family_id             : 0,
      phone_number          : '',
      mobile_number         : '',

      created_by_id         : 0,
      created_by_name       : '',
      session_token         : '',
      shop_location         : '',
      shop_id               : 0
    }
  }
  mapFieldsFromApi(api_data){
    this.fields.outstanding_payment_id= api_data.outstandingPaymentId
    this.fields.client_id             = api_data.clientId
    this.fields.client_name           = api_data.clientName
    this.fields.family_id             = api_data.familyId
    this.fields.phone_number          = api_data.phoneNumber
    this.fields.mobile_number         = api_data.mobileNumber

    this.fields.created_by_id         = api_data.createdById
    this.fields.created_by_name       = api_data.createdByName
    this.fields.session_token         = api_data.sessionToken
    this.fields.shop_location         = api_data.shopLocation
    this.fields.shop_id               = api_data.shopId
  }
  mapFieldsToApi(){
    return {
      outstandingPaymentId: this.fields.outstanding_payment_id,
      clientId            : this.fields.client_id,
      clientName          : this.fields.client_name,
      familyId            : this.fields.family_id,
      phoneNumber         : this.fields.phone_number,
      mobileNumber        : this.fields.mobile_number,
      
      createdById         : this.fields.created_by_id,
      createdByName       : this.fields.created_by_name,
      sessionToken        : this.fields.session_token,
      shopLocation        : this.fields.shop_location,
      shopId              : this.fields.shop_id
    }
  }
}