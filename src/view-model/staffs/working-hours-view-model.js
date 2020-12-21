import ViewModel from '../view-model.js'  

export default class WorkingHoursViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = {
      id: 0, 
      start_time: '00:00',
      finish_time: '00:00',
      worked_days_of_week: [],
      staff_id: 0
    }
  }
  getValidations(){
    let validations = {
      start_time: {
        label: 'working-hour.start',
        rules: {
          require: ''
        }
      },
      finish_time: {
        label: 'working-hour.finish',
        rules: {
          require: ''
        }
      },
      worked_days_of_week: {
        label: 'working-hour.day-of-week',
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