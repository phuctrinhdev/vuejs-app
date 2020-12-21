import ViewModel from '../view-model.js'
import { options } from '../../helpers/options.js'

export default class RepeatBookingViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = {
      repeat_by: options.repeat_by.week_of_day,
      repeat_type: options.repeat_type.every_week,
      repeated_day_of_week: [],
      repeat_times: '',
      repeat_dates: [],
      repeat_dates_view: [],
      list_off_days: [],
      booking_date: new Date()
    }
  }
  getValidations(){
    let validations = {
      repeat_times: {
        label:'bookings.repeat-times',
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