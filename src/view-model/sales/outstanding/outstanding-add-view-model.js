import OutstandingBaseViewModel from './outstanding-base-view-model.js'
import {convertDateToTimeStamp} from '../../../helpers/common.js'
import i18n                     from '../../../translate/translate.js'
import _                        from 'lodash'

import {
  convertTimeStampPlusLocalzone,
} from '../../../helpers/common'

export default class OutstandingAddViewModel extends OutstandingBaseViewModel{
  constructor(){
    super()
    this.fields.staff_id                        = null
    this.fields.staff_name                      = ''
    this.fields.earned_points                   = 0
    this.fields.outstanding_before_paid         = 0
    this.fields.total_paid                      = 0
    this.fields.outstanding                     = 0
    this.fields.notes                           = ''
    this.fields.invoice_dateTime_ts             = 0
    this.fields.payments                        = []

    // chain-sharing
    this.fields.chain_id                        = null
    this.fields.branch_number                   = 0
    this.fields.shop_name                       = ''
    this.fields.client_shop_id                  = 0
    this.fields.client_shop_name                = ''
  }

  setStaffName(value){
    this.fields.staff_name = value
  }
  setOutstandingBeforePaid(value){
    this.fields.outstanding_before_paid = value
  }
  setInvoiceDateTimeTs(date){
    this.fields.invoice_dateTime_ts = convertDateToTimeStamp(date,false,true)
  }

  updatePayment(payment){
    if(!payment) return
    let index = _.findIndex(this.fields.payments, o => o.fields.payment_method_id == payment.fields.payment_method_id)
    if(index == -1){
      this.fields.payments.push(payment)
    }else{
      this.fields.payments[index] = payment
    }
  }
  removePayment(payment){
    if(payment && this.fields.payments.length > 0)
      _.remove(this.fields.payments,o => o.fields.payment_method_id == payment.fields.payment_method_id)
  }
  getPaymentAmount(id){
    let payment = _.find(this.fields.payments,o => o.fields.payment_method_id == id)
    if (typeof payment !== 'undefined'){
      return payment.fields.payment_amount
    }
    return this.fields.outstanding
  }

  calTotalPaid(){
    this.fields.total_paid = _.sumBy(this.fields.payments,x=>x.fields.payment_amount)
  }
  calOutstanding(){
    this.fields.outstanding = this.fields.outstanding_before_paid - this.fields.total_paid
  }
  calEarnedPoints(decimal = 0){
    let factor = Math.pow(10, decimal)
    return Math.round(this.fields.earned_points * factor) / factor
  }

  mapFieldsToApi(){
    if(!this.fields.phone_number) this.fields.phone_number = ''
    if(!this.fields.mobile_number) this.fields.mobile_number = ''
    
    let tmp_payments = []
    for(let payment of this.fields.payments){
      tmp_payments.push(payment.mapFieldsToApi())
    }

    let tmp_chain_id = this.fields.chain_id
    if(tmp_chain_id == 0)
      tmp_chain_id = null

    return {
      clientId                    : this.fields.client_id,
      clientName                  : this.fields.client_name,
      phoneNumber                 : this.fields.phone_number,
      mobileNumber                : this.fields.mobile_number,
      familyId                    : this.fields.family_id,
      staffId                     : this.fields.staff_id,
      staffName                   : this.fields.staff_name,
      earnedPoints                : this.calEarnedPoints(0),
      outstandingBeforePaid       : this.fields.outstanding_before_paid,
      totalPaid                   : this.fields.total_paid,
      outstanding                 : this.fields.outstanding,
      notes                       : this.fields.notes,
      invoiceDateTimeTS           : convertTimeStampPlusLocalzone(this.fields.invoice_dateTime_ts),
      createdById                 : this.fields.created_by_id,
      createdByName               : this.fields.created_by_name,
      sessionToken                : this.fields.session_token,
      shopLocation                : this.fields.shop_location,
      shopId                      : this.fields.shop_id,
      payments                    : tmp_payments,

      // chain-sharing
      chainId                     : tmp_chain_id,
      branchNumber                : this.fields.branch_number,
      shopName                    : this.fields.shop_name,
      clientShopId                : this.fields.client_shop_id,
      clientShopName              : this.fields.client_shop_name,
    }
  }
  
  isValid(){
    let errors = []
    let validation_rules = {
      notes: {
        label: 'sales-outstanding-payment.notes',
        rules: {
          maxLength: {
            max_value:500
          }
        }
      },
      earned_points : {
        label : 'sales-outstanding-payment.loyalty-point',
        rules : {
          numeric : '',
          maxLength:{
            max_value : 12
          }
        }
      }
    }
    
    errors = super.isValid(validation_rules)

    if(this.fields.payments.length <= 0){
      errors.push(i18n.t('sales-outstanding-payment.payments-required'))
    }
    if(!this.fields.total_paid > 0){
      errors.push(i18n.t('sales.warning-outstanding-not-paid-yet'))
    }
    if(this.fields.total_paid > this.fields.outstanding_before_paid){
      errors.push(i18n.t('sales.warning-payment-amount-can-not-exceed-the-outstanding'))
    }
    return errors
  }
}