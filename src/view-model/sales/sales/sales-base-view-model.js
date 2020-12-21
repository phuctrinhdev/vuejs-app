import ViewModel from '../../view-model.js'
import { 
  convertTimeStampPlusLocalzone,
  convertTimeStampMinusSettingzone,
} from '../../../helpers/common'

export default class SalesBaseViewModel extends ViewModel {
  constructor(){
    super()

    this.fields = {
      sales_id                : 0,
      sales_number            : '',
      client_id               : 0,
      client_name             : '',
      client_phone_number     : '',
      client_mobile_number    : '',
      client_mobile_number2   : '',

      payments: [],
      total_amount            : 0,
      deduction_points        : 0,
      outstanding             : 0,

      notes                   : '',
      invoice_date_time       : new Date(),
      invoice_date_time_ts    : 0,
      hour_of_day             : 0,
      is_sales_connect        : false,

      shop_location           : '',
      shop_id                 : 0,

      chain_id                : null,
      branch_number           : '',
      shop_name               : '',
      client_shop_id          : 0,
      client_shop_name        : '',

      created_by_id           : 0,
      created_by_name         : '',
      created_date_time_ts    : 0,
      edited_by_id            : 0,
      edited_by_name          : '',
      edited_date_time_ts     : 0,
      edited_sales_id         : 0,
      deleted_by_id           : 0,
      deleted_by_name         : '',
      deleted_date_time_ts    : 0
    }
  }
  mapFieldsBaseFromApi(api_data){
    let tmp_payments = []
    if(api_data.payments){
      for(let payment of api_data.payments){
        let tmp_payment = this.mapPaymentFromApi(payment)
        tmp_payments.push(tmp_payment)
      }
    }

    this.fields.sales_id              = api_data.salesId
    this.fields.sales_number          = api_data.salesNumber
    this.fields.client_id             = api_data.clientId
    this.fields.client_phone_number   = api_data.clientPhoneNumber
    this.fields.client_mobile_number  = api_data.clientMobileNumber
    this.fields.client_mobile_number2 = api_data.clientMobileNumber2

    this.fields.payments              = tmp_payments,
    this.fields.total_amount          = api_data.totalAmount,
    this.fields.deduction_points      = api_data.deductionPoints,
    this.fields.outstanding           = api_data.outstanding,
    
    this.fields.notes                 = api_data.notes,
    this.fields.invoice_date_time_ts  = convertTimeStampMinusSettingzone(api_data.invoiceDateTimeTS),
    this.fields.hour_of_day           = api_data.hourOfDay,
    this.fields.is_sales_connect      = api_data.isSalesConnect,

    this.fields.shop_location         = api_data.shopLocation,
    this.fields.shop_id               = api_data.shopId

    this.fields.chain_id              =  api_data.chainId,
    this.fields.branch_number         =  api_data.branchNumber,
    this.fields.shop_name             =  api_data.shopName,
    this.fields.client_shop_id        =  api_data.clientShopId,
    this.fields.client_shop_name      =  api_data.clientShopName
  }
  mapFieldsBaseToApi(ui_data){
    let tmp_payments = []
    for(let i in this.fields.payments){
      let tmp_payment = this.mapPaymentToApi(this.fields.payments[i])
      tmp_payments.push(tmp_payment)
    }

    let tmp_chain_id = this.fields.chain_id
    if(tmp_chain_id == 0)
      tmp_chain_id = null
    
    return {
      salesId             : ui_data.sales_id,
      salesNumber         : ui_data.sales_number,
      clientId            : ui_data.client_id,
      clientPhoneNumber   : ui_data.client_phone_number,
      clientMobileNumber  : ui_data.client_mobile_number,
      clientMobileNumber2 : ui_data.client_mobile_number2,

      payments            : tmp_payments,
      totalAmount         : ui_data.total_amount,
      deductionPoints     : ui_data.deduction_points,
      outstanding         : ui_data.outstanding,

      notes               : ui_data.notes,
      invoiceDateTimeTS   : convertTimeStampPlusLocalzone(ui_data.invoice_date_time_ts),
      hourOfDay           : Number(ui_data.hour_of_day),
      isSalesConnect      : ui_data.is_sales_connect,
      
      shopLocation        : ui_data.shop_location,
      shopId              : ui_data.shop_id,

      chainId             : tmp_chain_id,
      branchNumber        : this.fields.branch_number,
      shopName            : this.fields.shop_name,
      clientShopId        : this.fields.client_shop_id,
      clientShopName      : this.fields.client_shop_name
    }
  }
  mapPaymentFromApi(api_payment){
    return {
      sales_payment_id    : api_payment.salesPaymentId,
      payment_method_id   : api_payment.paymentMethodId,
      payment_method_name : api_payment.paymentMethodName,
      payment_amount      : api_payment.paymentAmount
    }
  }
  mapPaymentToApi(ui_payment){
    return {
      salesPaymentId    : ui_payment.sales_payment_id,
      paymentMethodId   : ui_payment.payment_method_id,
      paymentMethodName : ui_payment.payment_method_name,
      paymentAmount     : ui_payment.payment_amount
    }
  }
}