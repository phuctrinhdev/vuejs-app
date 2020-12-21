import ViewModel from '../../view-model.js'
import RefundItemViewModel from '../refund-item/refund-item-view-model'
import {
  convertTimeStampPlusLocalzone,
  convertTimeStampMinusSettingzone,
} from '../../../helpers/common'

export default class RefundViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = {
      client_id                       : 0,
      client_name                     : '',
      client_mobile_number            : '',
      client_rating_id                : 0,
      client_rating_name              : '',
      client_sex                      : 1,
      member_number                   : 0,
      family_id                       : 0,

      refund_id                       : 0,
      status                          : 1,
      refund_items                    : [],

      total_amount                    : 0,
      payments                        : [],
      remaining                       : 0, // only viewing

      points_type                     : 0,
      deduction_points                : 0,

      notes                           : '',
      invoice_date_time               : new Date(),
      invoice_date_time_ts            : 0,
      hour_of_day                     : 0,
      created_by_id                   : 0,
      created_by_name                 : '',
      created_date_time_ts            : 0,
      deleted_by_id                   : 0,
      deleted_by_name                 : '',
      deleted_date_time_ts            : 0,
      
      session_token                   : '',
      shop_location                   : '',
      shop_id                         : 0,

      // chain-sharing
      chain_id                        : null,
      branch_number                   : '',
      shop_name                       : '',
      client_shop_id                  : 0,
      client_shop_name                : '',
    }
  }
  mapFieldsFromApi(api_data){
    let tmp_refund_items = []
    for(let i in api_data.refundItems){
      let tmp_refund_item = new RefundItemViewModel()
      tmp_refund_item.mapFieldsFromApi(api_data.refundItems[i])
      tmp_refund_items.push(tmp_refund_item.getFields())
    }
    let tmp_payments = []
    for(let i in api_data.payments){
      let tmp_payment = this.mapPaymentFromApi(api_data.payments[i])
      tmp_payments.push(tmp_payment)
    }

    this.fields.client_id                       = api_data.clientId
    this.fields.client_name                     = api_data.clientName
    this.fields.client_mobile_number            = api_data.clientMobileNumber
    this.fields.client_rating_id                = api_data.clientRatingId
    this.fields.client_rating_name              = api_data.clientRatingName
    this.fields.client_sex                      = api_data.sex
    this.fields.member_number                   = api_data.memberNumber
    this.fields.family_id                       = api_data.familyId

    this.fields.refund_id                       = api_data.refundId
    this.fields.status                          = api_data.status
    this.fields.refund_items                    = tmp_refund_items
    
    this.fields.total_amount                    = api_data.totalAmount
    this.fields.payments                        = tmp_payments
    this.fields.remaining                       = 0

    this.fields.points_type                     = api_data.pointsType
    this.fields.deduction_points                = api_data.deductionPoints

    this.fields.notes                           = api_data.notes
    this.fields.invoice_date_time_ts            = convertTimeStampMinusSettingzone(api_data.invoiceDateTimeTS)
    this.fields.hour_of_day                     = api_data.hourOfDay

    this.fields.created_by_id                   = api_data.createdById
    this.fields.created_by_name                 = api_data.createdByName
    this.fields.created_date_time_ts            = convertTimeStampMinusSettingzone(api_data.createdDateTimeTS)
    this.fields.deleted_by_id                   = api_data.deletedById
    this.fields.deleted_by_name                 = api_data.deletedByName
    this.fields.deleted_date_time_ts            = convertTimeStampMinusSettingzone(api_data.deletedDateTimeTS)
    
    this.fields.session_token                   = api_data.sessionToken
    this.fields.shop_location                   = api_data.shopLocation
    this.fields.shop_id                         = api_data.shopId

    this.fields.chain_id                        =  api_data.chainId,
    this.fields.branch_number                   =  api_data.branchNumber,
    this.fields.shop_name                       =  api_data.shopName,
    this.fields.client_shop_id                  =  api_data.clientShopId,
    this.fields.client_shop_name                =  api_data.clientShopName
  }
  mapFieldsToApi(){
    let tmp_refund_items = []
    for(let refund_item of this.fields.refund_items){
      let tmp_refund_item = new RefundItemViewModel().mapFieldsToApi(refund_item)
      tmp_refund_items.push(tmp_refund_item)
    }

    let tmp_payments = []
    for(let i in this.fields.payments){
      let tmp_payment = this.mapPaymentToApi(this.fields.payments[i])
      tmp_payments.push(tmp_payment)
    }

    if(this.fields.deduction_points == '') 
      this.fields.deduction_points = 0

    let tmp_chain_id = this.fields.chain_id
    if(tmp_chain_id == 0)
      tmp_chain_id = null
    
    return {
      clientId                    : this.fields.client_id,
      clientName                  : this.fields.client_name,
      clientMobileNumber          : this.fields.client_mobile_number,
      clientRatingId              : this.fields.client_rating_id,
      clientRatingName            : this.fields.client_rating_name,
      sex                         : this.fields.client_sex,
      memberNumber                : this.fields.member_number,
      familyId                    : this.fields.family_id,

      refundId                    : this.fields.refund_id,
      status                      : this.fields.status,
      refundItems                 : tmp_refund_items,

      totalamount                 : this.fields.total_amount,
      payments                    : tmp_payments,
      
      pointsType                  : this.fields.points_type,
      deductionPoints             : this.fields.deduction_points,

      notes                       : this.fields.notes,
      invoiceDateTimeTS           : convertTimeStampPlusLocalzone(this.fields.invoice_date_time_ts),
      hourOfDay                   : Number(this.fields.hour_of_day),
      createdById                 : this.fields.created_by_id,
      createdByName               : this.fields.created_by_name,
      createdDateTimeTS           : convertTimeStampPlusLocalzone(this.fields.created_date_time_ts),
      deletedById                 : this.fields.deleted_by_id,
      deletedByName               : this.fields.deleted_by_name,
      deletedDateTimeTS           : convertTimeStampPlusLocalzone(this.fields.deleted_date_time_ts),

      sessionToken                : this.fields.session_token,
      shopLocation                : this.fields.shop_location,
      shopId                      : this.fields.shop_id,

      chainId             : tmp_chain_id,
      branchNumber        : this.fields.branch_number,
      shopName            : this.fields.shop_name,
      clientShopId        : this.fields.client_shop_id,
      clientShopName      : this.fields.client_shop_name
    }
  }
  mapPaymentFromApi(api_payment){
    return {
      payment_method_id   : api_payment.paymentMethodId,
      payment_method_name : api_payment.paymentMethodName,
      payment_amount      : api_payment.paymentAmount
    }
  }
  mapPaymentToApi(ui_payment){
    return {
      paymentMethodId   : ui_payment.payment_method_id,
      paymentMethodName : ui_payment.payment_method_name,
      paymentAmount     : ui_payment.payment_amount
    }
  }
  getValidations(){
    let validations = {
      notes: {
        rules: {
          maxLength: {
            max_value:500
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