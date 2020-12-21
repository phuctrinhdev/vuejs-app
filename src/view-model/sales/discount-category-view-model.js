import ViewModel from '../view-model.js'
import { options } from '../../helpers/options'
import _ from 'lodash'

export default class DiscountCategoryViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = {
      id                    : 0,
      name                  : '',
      discount_type         : options.sales_enum.discount_type.percent,
      discount_value        : null, // value = 0 can not validate with rule require
      order_no              : 0,
      status                : options.good_status.active,
      shop_id               : 0
    }
  }
  mapFieldsFromApi(api_data){
    this.fields.id              = api_data.id
    this.fields.name            = api_data.name
    this.fields.discount_type   = api_data.discountType
    this.fields.discount_value  = api_data.discountValue
    this.fields.order_no        = api_data.orderNo
    this.fields.status          = api_data.status
    this.fields.shop_id         = api_data.shopId
  }
  mapFieldsToApi(){
    return {
      id            : this.fields.id,
      name          : this.fields.name,
      discountType  : this.fields.discount_type,
      discountValue : this.fields.discount_value,
      orderNo       : this.fields.order_no,
      status        : this.fields.status,
      shopId        : this.fields.shop_id
    }
  }
  mapDiscountCategorysFromApi(api_discount_categorys){
    let discount_categorys = []
    for(let api_discount_category of api_discount_categorys){
      this.mapFieldsFromApi(api_discount_category)
      discount_categorys.push(_.cloneDeep(this.getFields()))
    }
    return discount_categorys
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
      discount_value: { 
        label:'misc-codes.discount',
        rules: {
          require: '',
          numeric: '',
          customRule: {
            message: 'validate_messages.discount',
            process(model) {  
              if(model.discount_type == options.sales_enum.discount_type.percent) {
                if(model.discount_value < 0 || model.discount_value > 100) return false
              }
              if(model.discount_type == options.sales_enum.discount_type.amount) {
                if(model.discount_value < 0 || model.discount_value > 9999999999) return false
              }
              return true
            }
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