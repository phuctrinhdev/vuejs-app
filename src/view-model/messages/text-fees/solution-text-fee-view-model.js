import ViewModel from '../../view-model'

export default class SolutionTextFeeViesModel extends ViewModel {
  constructor(){
    super()

    this.fields = {
      id               : '',
      country_code     : '',
      solution_id      : 0,
      sms_fee          : 0,
      lms_fee          : 0,
      mms_fee          : 0,
      auto_sms_fee     : 0,
      auto_lms_fee     : 0,
      sms_max_bytes    : 0,
      lms_max_bytes    : 0,
      mms_max_bytes    : 0,
      time_zone        : 0,
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
      solution_id: {
        rules: {
          numbers: '',
          minValue: {
            min_value: 0
          }
        }
      },
      sms_fee: {
        rules: {
          numeric: '',
          minValue: {
            min_value: 0
          }
        }
      },
      lms_fee: {
        rules: {
          numeric: '',
          minValue: {
            min_value: 0
          }
        }
      },
      mms_fee: {
        rules: {
          numeric: '',
          minValue: {
            min_value: 0
          }
        }
      },

      auto_sms_fee: {
        rules: {
          numeric: '',
          minValue: {
            min_value: 0
          }
        }
      },
      auto_lms_fee: {
        rules: {
          numeric: '',
          minValue: {
            min_value: 0
          }
        }
      },

      sms_max_bytes: {
        rules: {          
          numbers: '',
          minValue: {
            min_value: 0
          }
        }
      },
      lms_max_bytes: {
        rules: {
          numbers: '',
          minValue: {
            min_value: 0
          }
        }
      },
      mms_max_bytes: {
        rules: {
          numbers: '',
          minValue: {
            min_value: 0
          }
        }
      },
    }
    return validations
  }
  isValid(){
    return super.isValid(this.getValidations())
  }
}