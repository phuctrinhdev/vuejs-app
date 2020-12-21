import ViewModel from '../view-model.js'

export default class LoyaltyPointsSetupsViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = {
      loyalty_points_setups: [],
      shop_id: 0
    }
  }
  mapFieldsFromApi(api_data){
    let tmp_setups = []
    for(let setup of api_data){ // api_data = loyaltyPointsSetups
      tmp_setups.push(this.mapLoyaltyPointsSetupFromApi(setup))
    }

    this.fields.loyalty_points_setups   = tmp_setups,
    this.fields.shop_id                 = api_data.shopId
  }
  mapFieldsToApi(){
    let tmp_setups = []
    for(let setup of this.fields.loyalty_points_setups){
      tmp_setups.push(this.mapLoyaltyPointsSetupToApi(setup))
    }

    return {
      loyaltyPointsSetups : tmp_setups,
      shopId              : this.fields.shop_id
    }
  }
  mapLoyaltyPointsSetupFromApi(loyalty_points_setup){
    let tmp_items = []
    for(let item of loyalty_points_setup.loyaltyPointsSetupItems){
      tmp_items.push(this.mapLoyaltyPointsSetupItemFromApi(item))
    }
    return {
      goods_type                : loyalty_points_setup.goodsType,
      is_apply                  : loyalty_points_setup.isApply,
      loyalty_points_setup_items: tmp_items
    }
  }
  mapLoyaltyPointsSetupToApi(loyalty_points_setup){
    let tmp_items = []
    for(let item of loyalty_points_setup.loyalty_points_setup_items){
      tmp_items.push(this.mapLoyaltyPointsSetupItemToApi(item))
    }
    return {
      goodsType                : loyalty_points_setup.goods_type,
      isApply                  : loyalty_points_setup.is_apply,
      loyaltyPointsSetupItems  : tmp_items
    }
  }
  mapLoyaltyPointsSetupItemFromApi(loyalty_points_setup_item){
    return {
      payment_method_setup_id: loyalty_points_setup_item.paymentMethodSetupId,
      percentage             : loyalty_points_setup_item.percentage,
      order_no               : loyalty_points_setup_item.orderNo,
      payment_method_name    : loyalty_points_setup_item.paymentMethodName
    }
  }
  mapLoyaltyPointsSetupItemToApi(loyalty_points_setup_item){
    return {
      paymentMethodSetupId: loyalty_points_setup_item.payment_method_setup_id,
      percentage          : loyalty_points_setup_item.percentage,
      orderNo             : loyalty_points_setup_item.order_no,
      paymentMethodName   : loyalty_points_setup_item.payment_method_name
    }
  }
  getValidations(){
    let validations = {
      //
    }
    return validations
  }
  isValid(){
    return super.isValid(this.getValidations())
  }
}