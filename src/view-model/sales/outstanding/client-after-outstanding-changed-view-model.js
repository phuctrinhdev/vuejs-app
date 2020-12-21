import ViewModel from '../../view-model.js'
export default class ClientAfterOutstandingChangedViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      shop_id        : 0,
      client_id      : '',
      loyalty_points : '',
      family_points  : '',
      outstanding    : 0,
      balance        : 0
    }
  }
  
  mapFieldsFromApi(data){
    this.fields.shop_id        = data.shopId
    this.fields.client_id      = data.clientAccount.clientId
    this.fields.outstanding    = data.clientAccount.outstanding
    this.fields.balance        = data.clientPrepaidCard != null ? data.clientPrepaidCard.balance : null
    if(data.clientAccount.familyId != null && data.clientAccount.familyId > 0 && data.familyAccount){
      this.fields.family_points  = data.familyAccount.familyPoints
      this.fields.loyalty_points = null
    }else{
      this.fields.family_points = null
      this.fields.loyalty_points = data.clientAccount.loyaltyPoints
    }
  }

  mapFieldsToClientInfo(){
    return {
      loyalty_points : this.fields.loyalty_points,
      family_points  : this.fields.family_points,
      outstanding    : this.fields.outstanding,
      balance        : this.fields.balance
    }
  }
}