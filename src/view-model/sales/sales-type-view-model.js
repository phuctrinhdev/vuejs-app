import ViewModel from '../view-model.js'
import { options } from '../../helpers/options'
import _ from 'lodash'

export default class SalesTypeViewModel extends ViewModel {
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
    this.fields.id        = api_data.id
    this.fields.name      = api_data.name
    this.fields.order_no  = api_data.orderNo
    this.fields.status    = api_data.status
    this.fields.shop_id   = api_data.shopId
  }
  mapFieldsToApi(){
    return {
      id            : this.fields.id,
      name          : this.fields.name,
      orderNo       : this.fields.order_no,
      status        : this.fields.status,
      shopId        : this.fields.shop_id
    }
  }
  mapSalesTypesFromApi(api_sales_types){
    let sales_types = []
    for(let api_sales_type of api_sales_types){
      this.mapFieldsFromApi(api_sales_type)
      sales_types.push(_.cloneDeep(this.getFields()))
    }
    return sales_types
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