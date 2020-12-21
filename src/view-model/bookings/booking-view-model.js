import ViewModel from '../view-model.js'
import { options } from '../../helpers/options'

export default class BookingViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = {
      is_allowed_moving_multi_resources_booking: true,
      is_duplicate_blocked_time: false,
      is_duplicate_another_booking: false,
      is_booking_exceeds_work_hours: false,
      is_check_bookable_waiting: false,
      is_get_bookable_waiting: false,
      must_check_performance_resource: true,
      id: 0,
      shop_id: 0,
      client_id: 0,
      client_name: '',
      client_mobile_number: '',
      client_member_number: null,
      client_registration_date: '',
      client_registration_date_ts: 0,
      booking_client_type: 1,
      display_color: 0,
      is_vip: false,
      confirmed: false,
      send_messages: true,
      booking_date: new Date(),
      is_deposit_required: false,
      notes: '',
      status: options.booking.booking_status.completed,
      booking_source: 1,
      booked_items: [],
      booked_items_count: 0,
      repeat_booking: {
        booking_id          : 0,
        repeat_booking_id   : 0,
        repeat_type         : 2,
        repeat_times        : 1,
        repeat_dates        : [],
        repeated_day_of_week: [],
      },
      booking_deposit: {
        booking_deposit_id : 0,
        deposit_type       : 1,
        due_date           : '',
        due_time           : '',
        amount             : 0,
        payment_method_id  : 0,
        payment_method_name: '',
        is_added_to_sales  : true,
      },
      chain_id             : null,
      branch_number        : '',
      shop_name            : '',
      client_shop_id       : 0,
      client_shop_name     : '',
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
        label:'clients.mobile-number',
        rules: {
          maxLength: {
            max_value: 12
          }
        }
      },
      booking_date: {
        label:'general.date',
        rules: {
          require: ''
        }
      },
      booked_items: {
        label:'booking-item.booking-items',
        rules: {
          require: ''
        }
      },
      notes: {
        label: 'general.notes',
        rules: {
          maxLength: {
            max_value:500
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