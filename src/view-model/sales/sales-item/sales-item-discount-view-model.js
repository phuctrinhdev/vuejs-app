import ViewModel from '../../view-model.js'
import { options } from '../../../helpers/options'
import { sales_options } from '../../../helpers/options/sales-options'

export default class SalesItemDiscountViewModel extends ViewModel {
  constructor(){
    super() 
    this.fields = {
      discount_category_id: 0,
      discount_category_name: '',
      discount_type : sales_options.discount_type.amount,
      discount_value: 0
    }
  }
  getValidations(){
    let validations = {
      discount_value: {
        label:'general.amount',
        rules: {
          numeric: '',
          customRule: {
            message: 'validate_messages.discount',
            process(model) {
              if(model.discount_type == options.sales_enum.discount_type.percent) {
                if(model.discount_value < 0 || model.discount_value > 100) {
                  return false
                }
              }
              if(model.discount_type == options.sales_enum.discount_type.amount) {
                if(model.discount_value < 0 || model.discount_value > 9999999999) {
                  return false
                }
              }
              return true
            }
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