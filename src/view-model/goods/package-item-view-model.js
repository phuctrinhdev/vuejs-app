import ViewModel from '../view-model.js'  
import { options } from '../../helpers/options.js'

export default class PackageItemViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = {
      id                  : 0, 
      item_type           : 0,
      goods_category_id   : 0,
      goods_category_name : '',
      goods_id            : 0,
      name                : '',
      price               : '',
      validity            : 0,
      validity_type       : options.goods_type.product,

      // prepaid card
      charge_amount       : 0,
      discount_for_client : true,
      discount_for_service: 0,
      discount_for_product: 0,
      
      // prepaid service
      quantity            : 0,
      related_service_id  : 0,
      
      package_id          : 0,
      package_name        : '',
      shop_id             : 0,
    }
  }
  getValidations(){
    let validations = {  
      
    }
    return validations
  }
  isValid(){
    return super.isValid(this.getValidations())
  }
}