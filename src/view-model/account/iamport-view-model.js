import ViewModel             from '../view-model'

export default class IamportViewModel extends ViewModel {
  constructor(){
    super()

    this.fields = {
      shop_id             : 0,
      country_code        : '',
      payment_gateway     : '',
      payment_method      : '',
      // vbankDue                      : '202010011200',
      // bizNum                            : '0',
      // quota                   : '0',
      // merchantUid                        : null,
      product_name        : '',
      amount              : '',     
      months              : 0, 
      buyer_name          : '',
      buyer_phone_number  : '',
      buyer_email         : ''

    }
  }  
  getValidations(){
    let validations = {       
      payment_gateway: {
        rules: {
          require: ''
        }
      },
      buyer_name: {
        rules: {
          require: ''
        }
      },
      buyer_phone_number: {
        rules: {
          require: ''
        }
      }
    }    
    return validations
  }
  isValid(){
    return super.isValid(this.getValidations())
  }
}