import ViewModel from '../view-model.js'
import { formatMoney } from '../../helpers/common'

export default class LoyaltyPointViewModel extends ViewModel {
  constructor(){
    super()

    this.fields = {
      // change client points
      client_id      : 0,
      points         : 0, // viewing 
      change_point   : 0,
      shop_id        : 0,

      // change family points
      family_id      : 0,
      created_by_id  : 0,
      created_by_name: ''
    }
  }
  updateFieldsFromSalesClientAccount(sales_client_account){
    this.fields.client_id = sales_client_account.fields.client_id
    this.fields.points    = formatMoney(sales_client_account.getPoints(), 0)
    this.fields.shop_id   = sales_client_account.fields.shop_id
    this.fields.family_id = sales_client_account.fields.family_id
  }
  getValidations(){
    let validations = {  
      change_point: {
        rules: {
          numeric: '',
          decimalLength: {
            decimal_value: 1
          },
          maxValue: {
            max_value: 9999999999.9
          },
          minValue: {
            min_value: 0
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