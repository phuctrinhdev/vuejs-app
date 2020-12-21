import ViewModel             from './../../view-model.js'
// import { inventory_options } from '../../../helpers/options/inventory-options.js'

export default class StockSafetyViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      product_id    : 0,
      product_code  : '',
      product_name  : '',
      stock_safety  : 0,
      shop_id       : 0
    }
  }

  // Mapping
  mapFieldsFromApi(data){
    this.fields.product_id    = data.productId
    this.fields.product_code  = data.productCode
    this.fields.product_name  = data.productName
    this.fields.stock_safety  = data.safetyStock
    this.fields.shop_id       = data.shopId
  }
  mapFieldsToApi(){
    return {
      productId     : this.fields.product_id,
      productCode   : this.fields.product_code,
      productName   : this.fields.product_name,
      safetyStock   : this.fields.stock_safety,
      shopId        : this.fields.shop_id,
    }
  }

  isValid(){
    let validations = {
      stock_safety: {
        rules: {
          numeric: '',
          maxLength: {
            max_value: 6
          }
        }
      },
    }
    return super.isValid(validations)
  }
}
