import ViewModel from '../view-model.js'  

export default class BookingCalendarSettingViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = { 
      id: 0,
      booking_time_slot: 30,
      number_of_day: 1,
      allow_duplicate_bookings: true,
      show_waiting_list: true,
      time_show_up: true,
      service_show_up: true,
      notes_show_up: true,
      member_number_show_up: true,
      shop_id: 0
    }
  }
  mapFieldFromApi(api_data){
    this.fields.id                            = api_data.id
    this.fields.booking_time_slot             = api_data.bookingTimeSlot
    this.fields.number_of_day                 = api_data.numberOfDay
    this.fields.allow_duplicate_bookings      = api_data.allowDuplicateBookings
    this.fields.show_waiting_list             = api_data.showWaitingList
    this.fields.time_show_up                  = api_data.timeShowUp
    this.fields.service_show_up               = api_data.serviceShowUp
    this.fields.notes_show_up                 = api_data.notesShowUp
    this.fields.member_number_show_up         = api_data.memberNumberShowUp
    this.fields.shop_id                       = api_data.shopId
  }
  mapFieldToApi(){
    return {
      id                           : this.fields.id,
      bookingTimeSlot              : this.fields.booking_time_slot,
      numberOfDay                  : this.fields.number_of_day,
      allowDuplicateBookings       : this.fields.allow_duplicate_bookings, 
      showWaitingList              : this.fields.show_waiting_list, 
      timeShowUp                   : this.fields.time_show_up, 
      serviceShowUp                : this.fields.service_show_up, 
      notesShowUp                  : this.fields.notes_show_up, 
      memberNumberShowUp           : this.fields.member_number_show_up, 
      shopId                       : this.fields.shop_id,
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