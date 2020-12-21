import ViewModel             from './../../view-model.js'
import { inventory_options } from '../../../helpers/options/inventory-options.js'

export default class StockDecreaseViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      product_id    : 0,
      product_code  : '',
      product_name  : '',
      quantity      : '',
      action_reason : inventory_options.action_reason_for_decrease_stock.damaged,
      notes         : '',
      user_id       : '',
      user_name     : '',
      shop_id       : 0
    }
  }

  // Mapping
  mapFieldsFromApi(data){
    this.fields.product_id      = data.productId
    this.fields.product_code    = data.productCode
    this.fields.product_name    = data.productName
    this.fields.quantity        = data.quantity
    this.fields.action_reason   = data.actionReason
    this.fields.notes           = data.notes
    this.fields.user_id         = data.userId
    this.fields.user_name       = data.username
    this.fields.shop_id         = data.shopId
  }
  mapFieldsToApi(){
    return {
      productId     : this.fields.product_id,
      productCode   : this.fields.product_code,
      productName   : this.fields.product_name,
      quantity      : this.fields.quantity,
      actionReason  : this.fields.action_reason,
      notes         : this.fields.notes,
      userId        : this.fields.user_id,
      username      : this.fields.user_name,
      shopId        : this.fields.shop_id
    }
  }
  mapFieldsFromProduct(product){
    this.fields.product_id      = product.id
    this.fields.product_code    = product.code
    this.fields.product_name    = product.name
  }

  isValid(){
    let validations = {
      quantity: {
        label: 'stock-status.qty',
        rules: {
          require: '',
        }
      },
      action_reason: {
        label: 'stock-status.reason',
        rules: {
          require: '',
        }
      }
    }
    return super.isValid(validations)
  }
}
