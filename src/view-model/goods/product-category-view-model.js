import ViewModel from '../view-model.js'
import { GOODS_STATUS } from '../../config/constant'


export default class ProductCategoryViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = {
      id      : 0, 
      name    : '',
      status  : GOODS_STATUS.ACTIVE,
      shop_id : 0
    }
  }
  getValidations(){
    let validations = {
      name: {
        label:'product-category.category-name',
        rules: {
          require: '',
          maxLength: {
            max_value: 40
          }
        }
      }
    }
    return validations
  }
  isValid(){
    return super.isValid(this.getValidations())
  }
}