import ViewModel from '../view-model'
import { STAFFS_ENUMS } from '../../config/constant'

export default class StaffViewModel extends ViewModel {
  constructor(){
    super()

    this.fields = {
      id: 0,
      shop_id: 0,
      staff_number: null,
      aliasname: null,
      fullname: null,
      mobile_phonenumber: null,
      phone_number: null,
      email: null,
      birth_year: null,
      birth_month: null,
      birth_dd: null,
      career: null,
      job_position: null,
      certifications: null,
      postcode: null,
      address1: null,
      address2: null,
      entry_date: null,
      leaving_date: null,
      notes: null,
      status: STAFFS_ENUMS.STATUS.ACTIVE,
      working_hours: []
    }
  }
  getValidations(){
    let validations = {
      aliasname: {
        rules: {
          require: '',
          maxLength: {
            max_value: 50
          }
        }
      },
      fullname: {
        rules: {
          maxLength: {
            max_value: 50
          }
        }
      },
      staff_number: {
        rules: {
          numeric: '',
          require: '',
          maxLength: {
            max_value: 20
          }
        }
      },
      mobile_phonenumber: {
        rules: {
          numeric: '',
          maxLength: {
            max_value: 12
          }
        }
      },
      phone_number: {
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
      postcode: {
        rules: {
          engNumeric: '',
          maxLength: {
            max_value: 20
          }
        }
      },
      address1: {
        rules: {
          maxLength: {
            max_value: 50
          }
        }
      },
      address2: {
        rules: {
          maxLength: {
            max_value: 50
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
    return validations
  }
  isValid(){
    return super.isValid(this.getValidations())
  }
}