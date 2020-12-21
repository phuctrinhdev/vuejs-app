import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES } from '../../config/constant'
import { convertDateToTimeStamp, convertTimeStampToDate, mapSecurityInfo } from '../../helpers/common'

const url_command = getServiceUrl(SERVICE_TYPES.BLOCKED_TIME_CMD, 1)


export default class BlockedTimeApi {
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }
  mapBlockedTimeFieldToApi(model){
    model = mapSecurityInfo(model)
    return {
      blockedTimeId         : model.blocked_time_id,
      shopId                : model.shop_id,
      blockedDate           : model.blocked_date,
      blockedDateTS         : convertDateToTimeStamp(model.blocked_date),
      fromTime              : model.from_time,
      toTime                : model.to_time,
      isNextDay             : model.is_next_day,
      notes                 : model.notes,
      bookingResourceSetupId: model.booking_resource_setup_id,
      shopLocation          : model.shop_location,
    }
  }
  mapBlockedTimeFieldFromApi(model){
    return {
      blocked_time_id           : model.blockedTimeId,
      shop_id                   : model.shopId,
      blocked_date              : convertTimeStampToDate(model.blockedDateTS),
      blocked_date_ts           : model.blockedDateTS,
      from_time                 : model.fromTime,
      to_time                   : model.toTime,
      is_next_day               : model.isNextDay, 
      notes                     : model.notes,
      booking_resource_setup_id : model.bookingResourceSetupId,
      shop_location             : model.shopLocation,
    }
  }
  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK

    if(response.data.isOK) this.result.data = this.mapBlockedTimeFieldFromApi(response.data.result)
    return this.result
  }

  async addBlockedTimeAsync(data) {
    let data_send = this.mapBlockedTimeFieldToApi(data)

    try {
      const response = await this.http.post(url_command, data_send)
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateBlockedTimeAsync(data) {
    let data_send = this.mapBlockedTimeFieldToApi(data)
    
    try {
      const response = await this.http.put(url_command, data_send)
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async deleteBlockedTimeAsync(data) {
    data = mapSecurityInfo(data)
    let data_send = {
      blockedTimeId: data.blocked_time_id,
      shopId: data.shop_id,
      shopLocation: data.shop_location
    }
    
    try {
      const response = await this.http.delete(url_command, data_send)
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}