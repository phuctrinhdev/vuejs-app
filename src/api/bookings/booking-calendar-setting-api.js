 
import Http from '../../helpers/http' 
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES } from '../../config/constant'
import BookingCalendarSettingViewModel from '../../view-model/bookings/booking-calendar-setting-view-model'

const url_read  = getServiceUrl(SERVICE_TYPES.BOOKINGS_CALENDAR_SETUP_READ, 1)
const url_command = getServiceUrl(SERVICE_TYPES.BOOKINGS_CALENDAR_SETUP_CMD, 1) 

export default class BookingCalendarSettingApi {
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    } 
  }
  
  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK 
    if(response.data.isOK){
      let view_model = new BookingCalendarSettingViewModel()
      view_model.mapFieldFromApi(response.data.result)
      this.result.data = view_model
    }

    return this.result
  } 
  async getBookingCalendarSettingAsync(shop_id) {
    let url_get = url_read + '/Live'
    let query = {
      shopId: shop_id
    }
    try { 
      const response = await this.http.post(url_get, query) 
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result  
  }
  async addBookingCalendarSettingAsync(view_model) { 
    let data_send = view_model.mapFieldToApi()
    try {
      const response = await this.http.post(url_command, data_send)
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  } 
  async updateBookingCalendarSettingAsync(view_model) {
    let data_send = view_model.mapFieldToApi() 
    try {
      const response = await this.http.put(url_command, data_send)
      this.setResult(response)
    }
    catch(e) { 
      this.http.loadError(e)
    }
    return this.result
  } 
   
}