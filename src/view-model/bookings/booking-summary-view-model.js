import ViewModel from '../view-model.js'  

export default class BookingSummaryViewModel extends ViewModel {
  constructor(){
    super() 

    this.fields = { 
      client_id             : 0,
      total_bookings        : 0,
      total_no_show_bookings: 0,
      from_date_ts          : 0,
      to_date_ts            : 0,
      shop_id               : 0
    }
  }
  mapFieldFromApi(api_data){
    this.fields.client_id             = api_data.clientId
    this.fields.total_bookings        = api_data.totalBookings
    this.fields.total_no_show_bookings= api_data.totalNoShowBookings
    this.fields.from_date_ts          = api_data.fromDateTS
    this.fields.to_date_ts            = api_data.toDateTS
    this.fields.shop_id               = api_data.shopId
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