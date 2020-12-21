import SecurityInfoViewModel from  '../../security-info-view-model'
export default class OutstandingBaseViewModel extends SecurityInfoViewModel{
  constructor(){
    super()
    this.fields.client_id                       = 0
    this.fields.client_name                     = ''
    this.fields.family_id                       = 0
    this.fields.phone_number                    = ''
    this.fields.mobile_number                   = ''
  }

  setClientInformation(client){
    this.fields.client_id     = client.client_id
    this.fields.family_id     = client.family_id
    this.fields.client_name   = client.client_name
    this.fields.phone_number  = client.phone_number
    this.fields.mobile_number = client.mobile_number  
  }
  setUserInformation(user){
    this.fields.created_by_id   = user.user_id
    this.fields.created_by_name = user.user_name
    this.fields.session_token   = user.session_token
  }
  setShopInformation(shop){
    this.fields.shop_id       = shop.shop_id
    this.fields.shop_location = shop.shop_location
  }
}