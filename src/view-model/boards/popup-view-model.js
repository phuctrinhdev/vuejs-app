import ViewModel   from '../view-model'
import { STATUS
  , BOARDS_ENUMS } from '../../config/constant'

export default class BoardViewModeal extends ViewModel {
  constructor(){
    super()

    this.fields = {
      id                  : null, 
      country_code        : null, 
      popup_type          : 1, // System POPUp
      title               : null, 
      start_date_ts       : null,
      end_date_ts         : null,
      solution_ids        : null,
      business_type_codes : null,
      top                 : 0, 
      left                : 0, 
      width               : 0, 
      height              : 0, 
      contents            : null, 
      link_url            : null,
      link_target         : BOARDS_ENUMS.LINK_TARGET.PARENT,
      never_see_period    : BOARDS_ENUMS.NEVER_SEE_PERIOD.DAY,
      status              : STATUS.ACTIVE,
      shop_id             : null,
      chain_id            : null,
      // created_by_user_id   : null,
      // created_by_user_name : null,
      file : null
    }
  }
  getValidations(){
    let validations = {
      title: {
        rules: {
          maxLength: {
            max_value: 200
          }
        }
      }, 
      file: {
        rules: {
          require: ''
        }
      },
      start_date_ts: {
        rules: {
          require: ''
        }
      },
      end_date_ts: {
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