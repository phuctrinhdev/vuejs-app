import ViewModel from '../view-model'
import { COMMON_STATUS, FORM_ACTIONS } from '../../config/constant'

export default class UserAccountViewModeal extends ViewModel {
  constructor(){
    super()

    this.fields = {
      user_account_id: 0,
      user_id: null,
      country_code: null,
      shop_id: 0,
      solution_id: 0,
      status: COMMON_STATUS.ACTIVE,
      staff_id: null,
      password: null,
      password2: null,
      user_role_code: null,
      user_role_name: null,
      language: null
    }
  }
  getValidations(type){
    let validations = { 
      solution_id: {
        rules: {
          require: '',
        }
      },
      user_id: {
        rules: {
          require: '',
          userID: ''
        }
      },
      user_role_code: {
        rules: {
          require: ''
        }
      },
      language: {
        rules: {
          require: ''
        }
      }
    }
    if(type == FORM_ACTIONS.ADD){
      let valid_password = {
        password: {
          rules: {
            require: '',
            password: {
              equal_data: this.fields.password2,
              equal: true
            }
          }
        }
      }
      validations = Object.assign(validations, valid_password)
    }
    return validations
  }
  isValid(type){
    return super.isValid(this.getValidations(type))
  }
}