import ViewModel             from './../../view-model.js'
import { convertTimeStampToDate,  } from '../../../helpers/common'

export default class StockInternalUseViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      stock_in_use_id : 0,
      category_id     : 0,
      category_name   : '',
      product_id      : 0,
      product_code    : '',
      product_name    : '',
      unit_price      : 0,
      qty             : '',
      amount          : 0,
      staff_id        : 0,
      staff_name      : '',
      notes           : '',
      using_date      : new Date(),
      using_date_ts   : 0,
      user_id         : 0,
      user_name       : '',
      shop_id         : 0
    }
  }

  mapFieldsFromApi(api_data){
    this.fields.stock_in_use_id= api_data.stockInUseId
    this.fields.category_id    = api_data.categoryId
    this.fields.category_name  = api_data.categoryName
    this.fields.product_id     = api_data.productId
    this.fields.product_code   = api_data.productCode
    this.fields.product_name   = api_data.productName
    this.fields.unit_price     = api_data.unitPrice
    this.fields.qty            = api_data.qty
    this.fields.amount         = api_data.amount
    this.fields.staff_id       = api_data.staffId
    this.fields.staff_name     = api_data.staffName
    this.fields.notes          = api_data.notes
    this.fields.using_date     = convertTimeStampToDate(api_data.usingDateTS)
    this.fields.using_date_ts  = api_data.usingDateTS
    this.fields.user_id        = api_data.userId
    this.fields.user_name      = api_data.userName
    this.fields.shop_id        = api_data.shopId
  }

  mapFieldsToApi(){
    let tmp_amount = this.fields.qty * this.fields.unit_price
    return {
      stockInUseId: this.fields.stock_in_use_id,
      categoryId  : this.fields.category_id,
      categoryName: this.fields.category_name,
      productId   : this.fields.product_id,
      productCode : this.fields.product_code,
      productName : this.fields.product_name,
      unitPrice   : this.fields.unit_price,
      qty         : this.fields.qty,
      amount      : tmp_amount,
      staffId     : this.fields.staff_id,
      staffName   : this.fields.staff_name,
      notes       : this.fields.notes,
      usingDate   : this.fields.using_date,
      usingDateTS : this.fields.using_date_ts,
      userId      : this.fields.user_id,
      userName    : this.fields.user_name,
      shopId      : this.fields.shop_id,
    }
  }

  mapFieldsFromProduct(product){
    this.fields.category_id    = product.product_category_id
    this.fields.category_name  = product.product_category_name
    this.fields.product_id     = product.id
    this.fields.product_code   = product.code
    this.fields.product_name   = product.name
    this.fields.unit_price     = product.supplier_price
  }

  isValid(){
    let validations = {
      product_name: {
        rules: {
          require: '',
          maxLength: {
            max_value: 50
          }
        }
      },
      qty: {
        rules: {
          require: ''
        }
      }
    }
    return super.isValid(validations)
  }

  // setter
  set stock_in_use_id(value){ this.fields.stock_in_use_id = value }
  set category_id(value){ this.fields.category_id = value }
  set category_name(value){ this.fields.category_name = value }
  set product_id(value){ this.fields.product_id = value }
  set product_code(value){ this.fields.product_code = value }
  set product_name(value){ this.fields.product_name = value }
  set unit_price(value){ this.fields.unit_price = value }
  set qty(value){ this.fields.qty = value }
  set amount(value){ this.fields.amount = value }
  set staff_id(value){ this.fields.staff_id = value }
  set staff_name(value){ this.fields.staff_name = value }
  set notes(value){ this.fields.notes = value }
  set using_date(value){ this.fields.using_date = value }
  set using_date_ts(value){ this.fields.using_date_ts = value }
  set user_id(value){ this.fields.user_id = value }
  set user_name(value){ this.fields.user_name = value }
  set shop_id(value){ this.fields.shop_id = value }

  // getters
  get stock_in_use_id(){ return this.fields.stock_in_use_id }
  get category_id(){ return this.fields.category_id }
  get category_name(){ return this.fields.category_name }
  get product_id(){ return this.fields.product_id }
  get product_code(){ return this.fields.product_code }
  get product_name(){ return this.fields.product_name }
  get unit_price(){ return this.fields.unit_price }
  get qty(){ return this.fields.qty }
  get amount(){ return this.fields.amount }
  get staff_id(){ return this.fields.staff_id }
  get staff_name(){ return this.fields.staff_name }
  get notes(){ return this.fields.notes }
  get using_date(){ return this.fields.using_date }
  get using_date_ts(){ return this.fields.using_date_ts }
  get user_id(){ return this.fields.user_id }
  get user_name(){ return this.fields.user_name }
  get shop_id(){ return this.fields.shop_id }
}
