import ViewModel from '../../view-model.js'
export default class PaymentViewModel extends ViewModel{
  constructor(){
    super()
    this.fields = {
      payment_method_id   : 0,
      payment_method_name : '',
      payment_amount      : 0
    }
  }
  setPaymentMethodId(value){
    this.fields.payment_method_id = value 
  }
  setPaymentMethodName(value){
    this.fields.payment_method_name = value
  }
  setPaymentAmount(value){
    this.fields.payment_amount = value
  }

  mapFieldsToApi(){
    return {
      paymentMethodId   : this.fields.payment_method_id,
      paymentMethodName : this.fields.payment_method_name,
      paymentAmount     : this.fields.payment_amount
    }
  }
}