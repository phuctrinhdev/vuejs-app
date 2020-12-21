import ViewModel  from '../../../view-model.js'
export default class PaymentTotalViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      payment_method_name : '',
      sales_amount        : 0,
      refund_amount       : 0,
      outstanding         : 0,
      total               : 0
    }
  }
  
  mapFieldsFromApi(data){
    this.fields.payment_method_name = data.paymentMethodName
    this.fields.sales_amount        = data.salesAmount
    this.fields.refund_amount       = data.refundAmount
    this.fields.outstanding         = data.outstanding
    this.fields.total               = data.salesAmount - data.refundAmount + data.outstanding
  }
}