import ViewModel from '../view-model.js'

export default class BlockedTimeViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = { 
      blocked_time_id           : 0,
      shop_id                   : 0,
      blocked_date              : new Date(),
      from_time                 : '00:00',
      to_time                   : '00:00',
      is_next_day               : false,
      notes                     : '',
      booking_resource_setup_id : 0,
    }
  }
  getValidations(){
    let validations = { 
      blocked_date: {
        label: 'general.date',
        rules: {
          require: '',
        }
      },
      from_time: {
        label: 'general.from-time',
        rules: {
          require: ''
        }
      },
      to_time: {
        label: 'general.to-time',
        rules: {
          require: ''
        }
      },
      notes: {
        label: 'general.notes',
        rules: {
          maxLength: {
            max_value:2000
          }
        }
      },
      booking_resource_setup_id: {
        label: 'booking-resources.resource',
        rules: {
          require: ''
        }
      },
    }
    return validations
  }
  isValid(){
    return super.isValid(this.getValidations())
  }
}