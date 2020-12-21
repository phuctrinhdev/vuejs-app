import ViewModel from '../view-model.js'

export default class OffDaysViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = {
      repeat_type: 3,
      repeated_weeks: [],
      repeated_days_of_week: [],
      repeated_off_days: [],
      shop_id: 0
    }
  }
  getValidations(){
    let validations = {  
      
    }
    return validations
  }
  isValid(){
    return super.isValid(this.getValidations())
  }
}