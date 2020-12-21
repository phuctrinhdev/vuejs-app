import ViewModel from '../view-model.js'  
export default class PerformingResourceViewModel extends ViewModel {
  constructor(){
    super()
    this.fields = {
      id: 0,
      shop_id: 0,
      service_id: 0,
      is_available_for_all_resources: true,
      available_booking_resource_setups_ids: [],
      not_available_booking_resource_setups_ids: [],
    }
  }
  mapFieldFromApi(api_data){
    this.fields.id                                        = api_data.performingResourceId
    this.fields.shop_id                                   = api_data.shopId
    this.fields.service_id                                = api_data.serviceId
    this.fields.is_available_for_all_resources            = api_data.isAvailableForAllResources
    this.fields.not_available_booking_resource_setups_ids = api_data.notAvailableBookingResourceSetupsIds
    
    if(this.fields.id <= 0) 
      this.fields.is_available_for_all_resources = true
  }
  mapFieldToApi(){
    return {
      performingResourceId                : this.fields.id,
      shopId                              : this.fields.shop_id,
      serviceId                           : this.fields.service_id,
      isAvailableForAllResources          : this.fields.is_available_for_all_resources,
      notAvailableBookingResourceSetupsIds: this.fields.not_available_booking_resource_setups_ids
    }
  }
  getValidations(){
    let validations = {}
    return validations
  }
  isValid(){
    return super.isValid(this.getValidations())
  }
}