import ViewModel from '../view-model.js'

export default class WaitingViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = {
      id                        : 0,
      shop_id                   : 0,
      client_id                 : 0,
      client_name               : '',
      client_mobile_number      : '', 
      client_member_number      : '',
      client_registration_date  : '',
      client_registration_date_ts: 0,
      booking_date              : new Date(), 
      notes                     : '',
      from_time                 : '',
      to_time                   : '', 
      from_time_show            : '',
      to_time_show              : '',
      status                    : 1,
      booking_source            : 1,
      waiting_booked_items      : [],
      waiting_booked_items_count: 0,
      booking_resource_setup_id : 0,
      booking_resource_name     : '',
      resource_name             : 0,
      created_by_id             : 0,
      created_by_name           : '', 
      is_next_day               : false,
    }
  }
  getValidations(){
    let validations = {  
      client_name: {
        label:'clients.client-name',
        rules: {
          require: '',
          maxLength: {
            max_value: 50
          }
        }
      },
      client_mobile_number: {
        label:'waitings.client-mobile-number',
        rules: {
          numeric: '',
          maxLength: {
            max_value: 12
          } 
        } 
      },
      notes: {
        label:'waitings.notes',
        rules: { 
          maxLength: {
            max_value: 500
          }
        }
      }, 
      from_time: {
        label:'waitings.from-time',
        rules: {
          require: ''
        }
      }, 
      to_time: {
        label:'waitings.to-time',
        rules: {
          require: ''
        }
      },  
      booking_date: {
        label:'waitings.date',
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