import ViewModel from '../../view-model'

export default class TextSenderPhoneViewModel extends ViewModel {
  constructor(){
    super()

    this.fields = {
      id                        : null,
      country_code              : null,
      shop_id                   : null, 
      sender_phone              : null,
      certification_type        : null,
      is_auto_sender            : false,
      admin_memo                : null,
      user_id                   : null,
    }
  }
  
  getValidations(){
    let validations = {    
      country_code: {
        rules: {
          require: '',
          maxLength: {
            max_value: 10
          }
        }
      },      
      shop_id: {
        rules: {
          require: '',
          numbers: '',
          minValue: {
            min_value: 1
          }
        }
      },
      sender_phone: {
        rules: {
          require: '',
          numeric: '',
          maxLength: {
            max_value: 12
          }
        }
      },
      user_id: {
        rules: {
          require: '',
          maxLength: {
            max_value: 16
          }
        }
      },
      certification_type: {
        rules: {
          require: '',
        }
      }
    }
    return validations
  }
  isValid(){
    return super.isValid(this.getValidations())
  }
}