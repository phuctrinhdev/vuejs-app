import ViewModel from '../view-model.js'
import { options } from '../../helpers/options'
import _ from 'lodash'

export default class PaymentMethodViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = {
      id                    : 0,
      name                  : '',
      order_no              : 0,
      status                : options.good_status.active,
      shop_id               : 0
    }
  }
  mapFieldsFromApi(api_data){
    this.fields.id       = api_data.id
    this.fields.name     = api_data.name,
    this.fields.order_no = api_data.orderNo,
    this.fields.status   = api_data.status,
    this.fields.shop_id  = api_data.shopId
  }
  mapFieldsToApi(){
    return {
      id      : this.fields.id,
      name    : this.fields.name,
      orderNo : this.fields.order_no,
      status  : this.fields.status,
      shopId  : this.fields.shop_id
    }
  }
  mapPaymentMethodsFromApi(api_payment_methods){
    let payment_methods = []
    for(let api_payment_method of api_payment_methods){
      this.mapFieldsFromApi(api_payment_method)
      payment_methods.push(_.cloneDeep(this.getFields()))
    }
    return payment_methods
  }
  getValidations(){
    let validations = {
      name: {
        label: 'misc-codes.item-name',
        rules: {
          require: '',
          maxLength: {
            max_value: 50
          }
        }
      },
    }
    
    return validations
  }
  isValid(){
    return super.isValid(this.getValidations())
  }
}