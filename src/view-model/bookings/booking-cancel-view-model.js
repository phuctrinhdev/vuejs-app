import ViewModel from '../view-model.js'  

export default class BookingCancelViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = { 
      shop_id: 0,
      booking_id: 0,
      option: 1,
      reason: 2,
      cancel_source: 1,
      notes: '',

      booked_items: [],
      client_name: '',
      booking_date: '',
      start_time: ''
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