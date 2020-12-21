import ViewModel from '../view-model.js'
// import { sales_options } from '../../helpers/options/sales-options.js'
// import { common_options } from '../../helpers/options/common-options.js'
// import { forEachLeadingCommentRange } from 'typescript'
import { convertTimeStampToDate,
  convertDateToTimeStamp } from '../../helpers/common'

export default class BookingDepositSalesViewModel extends ViewModel {
  constructor() {
    super()
    this.fields = {
      shop_id             : 0,
      booking_id          : 0,
      client_id           : 0,
      amount              : 0,
      refund_amount       : 0,
      invoice_date_time   : new Date(),
      invoice_date_time_ts: 0,
      payments            : [],
      staffs              : [],

      is_refund           : false
    }
  }

  mapFieldsFromApi(api_data) {
    let tmp_payments = []
    for(let i in api_data.payments){
      let payment = api_data.payments[i]
      tmp_payments.push(this.mapPaymentFromApi(payment))
    }

    let tmp_staffs = []
    for(let i in api_data.staffs){
      let staff = api_data.staffs[i]
      tmp_staffs.push(this.mapStaffFromApi(staff))
    }

    this.fields.shop_id               = api_data.shopId
    this.fields.booking_id            = api_data.bookingId
    this.fields.client_id             = api_data.clientId
    this.fields.amount                = api_data.amount
    this.fields.refund_amount         = api_data.refundAmount
    this.fields.invoice_date          = convertTimeStampToDate(api_data.invoiceDateTimeTS)
    this.fields.invoice_date_ts       = api_data.invoiceDateTimeTS
    this.fields.payments              = tmp_payments
    this.fields.staffs                = tmp_staffs
  }

  mapFieldsToApi() {
    return {
      shopId              : this.fields.shop_id,
      bookingId           : this.fields.booking_id,
      clientId            : this.fields.client_id,
      amount              : this.fields.amount,
      refundAmount        : this.fields.refund_amount,
      invoiceDateTime     : this.fields.invoice_date,
      invoiceDateTimeTS   : convertDateToTimeStamp(this.fields.invoice_date),
      payments            : this.fields.payments,
      staffs              : this.fields.staffs

    }
  }

  mapPaymentFromApi(api_data){
    return {
      payment_method_id   : api_data.paymentMethodId,
      payment_method_name : api_data.paymentMethodName,
      payment_amount      : api_data.paymentAmount
    }
  }

  mapPaymentToApi(data){
    return {
      paymentMethodId   : data.payment_method_id,
      paymentMethodName : data.payment_method_name,
      paymentAmount     : data.payment_amount
    }
  }

  mapStaffFromApi(api_data){
    return {
      staff_id   : api_data.staffId,
      staff_name : api_data.staffName,
      amount     : api_data.amount
    }
  }

  mapStaffToApi(data){
    return {
      staffId   : data.staff_id,
      staffName : data.staff_name,
      amount    : data.amount
    }
  }

  getValidationRules() {
    let validations = {

    }
    return validations
  }

  isValid() {
    return super.isValid(this.getValidationRules())
  }
}