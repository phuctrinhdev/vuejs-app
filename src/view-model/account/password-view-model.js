import ViewModel from '../view-model'

export default class PasswordViewModel extends ViewModel {
  constructor(){
    super()

    this.fields = {
      user_account_id: null,
      shop_id: null,
      user_id: null,
      password: null,
      password2: null
    }
  }

  getValidations(){
    let validations = {
      password: {
        rules: {
          require: '',
          password: {
            equal: true,
            equal_data: this.fields.password2
          }
        }
      } 
    }
    return validations
  }
  isValid(){
    return super.isValid(this.getValidations())
  }
}