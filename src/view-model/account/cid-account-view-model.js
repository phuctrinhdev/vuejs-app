import ViewModel from '../view-model'
import { COMMON_STATUS } from '../../config/constant'

export default class CIDAccountViewModel extends ViewModel {
  constructor(){
    super()

    this.fields = {
      cid_account_id: 0,
      shop_id: 0,
      cid_login_id: '',
      cid_login_password: '',
      mac_address: '',
      status: COMMON_STATUS.INACTIVE,
    }
  }
  getValidations(){
    let validations = { 
      cid_login_id: {
        rules: {
          require: '',
          maxLength: {
            max_value: 50
          }
        },
        cid_login_pw: {
          rules: {
            require: '',
            maxLength: {
              max_value: 200
            }
          }
        },
        mac_address: {
          rules: {
            maxLength: {
              max_value: 20
            }
          }
        },
      }
    }
    return validations
  }
  isValid(){
    return super.isValid(this.getValidations())
  }
}