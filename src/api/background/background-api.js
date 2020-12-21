import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { } from '../../helpers/common'
import { SERVICE_TYPES } from '../../config/constant'
  
// const url_read    = getServiceUrl(SERVICE_TYPES.BKG_TASKS_BOOKING_READ, 1) 
// let url_read_booking_token =url_read + SERVICE_EXTEND_TYPES.GET_TOKEN

let url_token_cmd = getServiceUrl(SERVICE_TYPES.BOOKING_CMD, 1) + '/GetToken'

export default class BackgroundApi {
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }
  
  async getTokenBookingAsync(query){
    let data_send = {
      shopId: query.shop_id,
      lifeTime: query.life_time
    }
    try {
      let response = await this.http.post(url_token_cmd, data_send)
      this.result.is_ok = response.status == 200 ? true : false
      
      if(this.result.is_ok) {
        this.result.data = response.data
      }
    }
    catch(e) { 
      this.http.loadError(e)
    }

    return this.result
  }
}