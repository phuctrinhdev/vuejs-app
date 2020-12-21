import ViewModel from '../view-model'
import { CLIENTS_ENUMS } from '../../config/constant'
import { options } from '../../helpers/options'
import store from '../../store/store'

export default class ClientViewModel extends ViewModel {
  constructor(){
    super()

    this.fields = {
      id                  : 0,
      shop_id             : 0,
      member_type         : 2,
      member_number       : 0,
      client_name         : null,
      mobile_number       : null,
      mobile_number2      : null,
      is_vip              : false,
      allowed_message_type: 1,
      phone_number        : null,
      email               : null,
      sex                 : CLIENTS_ENUMS.SEX.NONE,
      birth_year          : null,
      birth_month         : null,
      birth_dd            : null,
      birthday_type       : CLIENTS_ENUMS.BIRTHDAY_TYPE.SOLAR,
      postcode            : null,
      address1            : null,
      address2            : null,
      notes               : null,
      avatar              : null,

      balance             : 0,
      outstanding         : 0,
      points              : 0,
      family_id           : null,
      family_balance      : 0,
      family_point        : 0,

      first_visit_date    : 0,
      recent_visit_date   : 0,
      number_of_visit     : 0,
      average_sales_amount : 0,
      
      client_group_id             : null,
      client_rating_id            : null,
      client_referral_source_id   : null,
      client_preferred_staff_id   : null,
      recommender_id              : null,
      recommender_name            : null,
      client_group_name           : null,
      client_rating_name          : null,
      client_referral_source_name : null,
      preferred_staff_name        : null,
      registration_date           : null
    }
  }
  getPoints(){
    let tmp_points = this.fields.points
    if(this.fields.family_id > 0)
      tmp_points = this.fields.family_point

    return tmp_points
  }
  getValidations(check_fields_validation){
    let validations = {
      client_name: {
        rules: {
          require: '',
          maxLength: {
            max_value: 50
          }
        }
      },
      member_number: {
        rules: {
          numeric: '',
          maxLength: {
            max_value: 20
          }
        }
      },
      email: {
        rules: {
          email: '',
          maxLength: {
            max_value: 50
          }
        }
      },
      birth_year: {
        rules: {
          numeric: '',
          between: {
            min_value: 1900,
            max_value: new Date().getUTCFullYear() + 1
          }
        }
      },
      birth_month: {
        rules: {
          numeric: '',
          between: {
            min_value: 1,
            max_value: 12
          }
        }
      },
      birth_dd: {
        rules: {
          numeric: '',
          between: {
            min_value: 1,
            max_value: 31
          }
        }
      },
      notes: {
        rules: {
          maxLength: {
            max_value: 5000
          }
        }
      }
    }
    if(this.fields.member_type == options.clients_enums.client_member_type.member){
      let temp_data = {
        require: ''
      }
      Object.assign(validations.member_number.rules, temp_data)
    }
    let country = store.getters['user/getShop'].country
    if(check_fields_validation.mobile_validation){
      let valid_mobile_number = {
        mobile_number: {
          rules: {
            mobilePhone: {
              country: country
            },
            customRule: {
              message: [],
              process(model) {
                let flag = true
                if(model.mobile_number == model.mobile_number2){
                  this.message.push({   
                    message: 'validate_messages.mobile_number_equal'
                  })
                  flag = false
                }
                return flag
              }
            }
          }
        },
      }
      validations = Object.assign(validations, valid_mobile_number)
    }
    if(check_fields_validation.mobile2_validation){
      let valid_mobile_number2 = {
        mobile_number2: {
          rules: {
            mobilePhone: {
              country: country
            }
          }
        }
      }
      validations = Object.assign(validations, valid_mobile_number2)
    }
    if(check_fields_validation.phone_validation){
      let valid_phone_number = {
        phone_number: {
          rules: {
            phone: {
              country: country
            }
          }
        }
      }
      validations = Object.assign(validations, valid_phone_number)
    }
    if(check_fields_validation.postcode_validation){
      let valid_postcode = {
        postcode: {
          rules: {
            postcode: {
              country: country
            }
          }
        }
      }
      validations = Object.assign(validations, valid_postcode)
    }
    if(check_fields_validation.address1_validation){
      let valid_address1 = {
        address1: {
          rules: {
            maxLength: {
              max_value: 50
            }
          }
        }
      }
      validations = Object.assign(validations, valid_address1)
    }
    if(check_fields_validation.address2_validation){
      let valid_address2 = {
        address2: {
          rules: {
            maxLength: {
              max_value: 50
            }
          }
        }
      }
      validations = Object.assign(validations, valid_address2)
    }

    return validations
  }
  isValid(check_fields_validation=[])
  {
    return super.isValid(this.getValidations(check_fields_validation))
  }
}