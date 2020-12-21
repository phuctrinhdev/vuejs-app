import ViewModel from '../view-model.js'
import { convertHoursToMinutes } from '../../helpers/common'
import { options } from '../../helpers/options'

export default class OpeningHoursViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = {
      id: 0, 
      start_time: '',
      finish_time: '',
      opened_days_of_week: [],
      cross_date: false,
      shop_id: 0
    }
  }
  getValidations(){
    let validations = {
      start_time: {
        label: 'booking-opening-hours.start',
        rules: {
          require: ''
        }
      },
      finish_time: {
        label: 'booking-opening-hours.finish',
        rules: {
          require: '',
          customRule: {
            message: 'validate_messages.exceed-24h',
            process(model) {
              let start_time_minutes = convertHoursToMinutes(model.start_time)
              let finish_time_minutes = convertHoursToMinutes(model.finish_time)
              let exceed_24h = (finish_time_minutes - start_time_minutes) > options.minutes_of_24h
              if(finish_time_minutes < options.minutes_of_24h) {
                if(finish_time_minutes < start_time_minutes) {
                  this.message = 'validate_messages.start_to_finish'
                  return false
                }
              }
              else {
                if(exceed_24h) return false
              }
              
              return true
            }
          }
        }
      },
      opened_days_of_week: {
        label: 'booking-opening-hours.day-of-week',
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