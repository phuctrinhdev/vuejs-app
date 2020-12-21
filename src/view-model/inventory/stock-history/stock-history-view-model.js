import ViewModel             from './../../view-model.js'
import { convertTimeStampToDate } from '../../../helpers/common'

export default class StockHistoryViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      action        : 0,
      action_reason : 0,
      product_code  : '',
      product_name  : '',
      stock_on_hand : 0,
      stock_before  : 0,
      adjusted_qty  : 0,
      notes         : '',
      date_time     : 0, // ui only
      date_time_ts  : 0,
      user_id       : 0,
      user_name     : 0,
      shop_id       : 0
    }
  }
  mapFieldsFromApi(api_data){
    this.fields.action        = api_data.action
    this.fields.action_reason = api_data.actionReason
    this.fields.product_code  = api_data.productCode
    this.fields.product_name  = api_data.productName
    this.fields.stock_on_hand = api_data.stockOnHand
    this.fields.stock_before  = api_data.stockBefore
    this.fields.adjusted_qty  = api_data.adjustedQty
    this.fields.notes         = api_data.notes
    this.fields.date_time     = convertTimeStampToDate(api_data.dateTimeTS, true),
    this.fields.date_time_ts  = api_data.dateTimeTS
    this.fields.user_id       = api_data.userId
    this.fields.user_name     = api_data.userName
    this.fields.shop_id       = api_data.shopId
  }

  // setter
  set action(value){ this.fields.action = value }
  set action_reason(value){ this.fields.action_reason = value }
  set product_code(value){ this.fields.product_code = value }
  set product_name(value){ this.fields.product_name = value }
  set stock_on_hand(value){ this.fields.stock_on_hand = value }
  set stock_before(value){ this.fields.stock_before = value }
  set adjusted_qty(value){ this.fields.adjusted_qty = value }
  set notes(value){ this.fields.notes = value }
  set date_time(value){ this.fields.date_time = value }
  set date_time_ts(value){ this.fields.date_time_ts = value }
  set user_id(value){ this.fields.user_id = value }
  set user_name(value){ this.fields.user_name = value }
  set shop_id(value){ this.fields.shop_id = value }
  
  // getters
  get action(){ return this.fields.action }
  get action_reason(){ return this.fields.action_reason }
  get product_code(){ return this.fields.product_code }
  get product_name(){ return this.fields.product_name }
  get stock_on_hand(){ return this.fields.stock_on_hand }
  get stock_before(){ return this.fields.stock_before }
  get adjusted_qty(){ return this.fields.adjusted_qty }
  get notes(){ return this.fields.notes }
  get date_time(){ return this.fields.date_time }
  get date_time_ts(){ return this.fields.date_time_ts }
  get user_id(){ return this.fields.user_id }
  get user_name(){ return this.fields.user_name }
  get shop_id(){ return this.fields.shop_id }
}
