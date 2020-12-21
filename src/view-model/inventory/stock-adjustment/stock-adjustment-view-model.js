import ViewModel             from './../../view-model.js'

export default class StockAdjustmentViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      items         : [],
      notes         : '',
      user_id       : 0,
      user_name     : '',
      shop_id       : 0
    }
  }
  mapFieldsFromProducts(products){
    let tmp_products = []
    for(let product of products){
      if(product.stock_after !== '' && product.stock_before != product.stock_after){
        let tmp_product = {
          product_id  : product.id,
          product_code: product.code,
          product_name: product.name,
          stock_before: product.stock_before,
          stock_after : product.stock_after,
        }
        tmp_products.push(tmp_product)
      }
    }
    this.fields.items = tmp_products
  }
  mapFieldsToApi(){
    let tmp_items = []
    for(let item of this.fields.items){
      let tmp_item = {
        productId  : item.product_id,
        productCode: item.product_code,
        productName: item.product_name,
        stockBefore: item.stock_before,
        stockAfter : item.stock_after
      }
      tmp_items.push(tmp_item)
    }

    return {
      items       : tmp_items,
      notes       : this.fields.notes,
      userId      : this.fields.user_id,
      userName    : this.fields.user_name,
      shopId      : this.fields.shop_id
    }
  }
  isValid(){
    let validations = {
      notes: {
        rules: {
          maxLength: {
            max_value: 100
          }
        }
      }
    }
    return super.isValid(validations)
  }
}
