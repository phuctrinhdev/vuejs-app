import ViewModel     from './../../view-model.js'
export default class ReceivingItemViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      receiving_id           : 0,
      receiving_item_id      : 0,
      receiving_item_guid_id : 0, // This field used to add the sames product_id
      product_id             : 0,
      product_code           : '',
      product_name           : '',
      spec                   : '',
      product_category_id    : 0,
      product_category_name  : '',
      unit_price             : 0,
      quantity               : 0,
      amount                 : 0,
      shop_id                : 0,
      stock_on_hand          : 0,
      user_id                : 0,
      user_name              : ''
    }
  }

  mapFieldsFromApi(data){
    this.fields.receiving_item_id     = data.receivingItemId
    this.fields.product_id            = data.productId
    this.fields.product_code          = data.productCode
    this.fields.product_name          = data.productName
    this.fields.spec                  = data.spec
    this.fields.product_category_id   = data.productCategoryId
    this.fields.product_category_name = data.productCategoryName
    this.fields.shop_id               = data.shopId

    if(data.amount)        this.fields.amount        = data.amount
    if(data.unitPrice)     this.fields.unit_price    = data.unitPrice
    if(data.quantity)      this.fields.quantity      = data.quantity
    if(data.supplierPrice) this.fields.unit_price    = data.supplierPrice
    if(data.stockOnHand)   this.fields.stock_on_hand = data.stockOnHand
    if(data.specification) this.fields.spec          = data.specification
  }
  mapFieldsToUpdateReceivingItemApi(){
    return {
      shopId         : this.fields.shop_id,
      receivingId    : this.fields.receiving_id,
      userId         : this.fields.user_id,
      username       : this.fields.user_name,
      receivingItemId: this.fields.receiving_item_id,
      productId      : this.fields.product_id,
      productCode    : this.fields.product_code,
      unitPrice      : this.fields.unit_price,
      quantity       : this.fields.quantity
    }
  }

  // getters
  get receiving_id(){
    return this.fields.receiving_id
  }
  get receiving_item_id(){
    return this.fields.receiving_item_id
  }
  get product_code(){
    return this.fields.product_code
  }
  get product_name(){
    return this.fields.product_name
  }
  get unit_price(){
    return this.fields.unit_price
  }
  get quantity(){
    return this.fields.quantity
  }
  get product_id(){
    return this.fields.product_id
  }
  get amount(){
    return this.fields.amount
  }
  get product_category_id(){
    return this.fields.product_category_id
  }
  get product_category_name(){
    return this.fields.product_category_name
  }
  get spec(){
    return this.fields.spec
  }
  get receiving_item_guid_id(){
    return this.fields.receiving_item_guid_id
  }

  // Setters
  set unit_price(value){
    if(Number(value) <= Number.MAX_SAFE_INTEGER){
      this.fields.unit_price = Number(value)
      this.fields.amount = value * this.fields.quantity
    }
  }
  set quantity(value){
    if(Number(value) <= Number.MAX_SAFE_INTEGER){
      this.fields.quantity = Number(value)
      this.fields.amount = value * this.fields.unit_price
    }
  }
  set shop_id(value){
    this.fields.shop_id = value
  }
  set receiving_id(value){
    this.fields.receiving_id = value
  }
  set user_id(value){
    this.fields.user_id = value
  }
  set user_name(value){
    this.fields.user_name = value
  }
  set receiving_item_guid_id(value){
    this.fields.receiving_item_guid_id = value
  }

  isValid(){
    let validation_rules = {
      quantity:{
        rules : {
          require: '',
          numeric: '',
          minValue: {
            min_value: 1
          },
          maxValue: {
            max_value: 999999
          },
        },
      },
      unit_price : {
        rules : {
          numeric: '',
          minValue: {
            min_value: 0
          },
          maxValue: {
            max_value: 999999999999
          },
        },
      }
    }
    return super.isValid(validation_rules)
  }
}
