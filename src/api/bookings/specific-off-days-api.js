import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'
import { convertDateToTimeStamp, convertTimeStampToDate } from '../../helpers/common'

const url_command = getServiceUrl(SERVICE_TYPES.BOOKINGS_OPENING_HOURS_SETUP_CMD, 1)

let url_specific_off_days = url_command + SERVICE_EXTEND_TYPES.SPECIFIC_OFF_DAY

export default class SpecificOffDaysApi {
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }
  mapSpecificOffDaysFieldToApi(model){
    model.specific_off_days = model.specific_off_days.map(date => convertDateToTimeStamp(date))
    return {
      specificOffDays  : model.specific_off_days,
      shopId           : model.shop_id
    }
  }
  mapSpecificOffDaysFieldFromApi(specificOffDays){
    specificOffDays = specificOffDays.map(timestamp => convertTimeStampToDate(timestamp))
    return {
      specific_off_days : specificOffDays
    }
  }
  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK

    if(response.data.isOK) this.result.data = this.mapFieldFromApi(response.data.result)
    return this.result
  }

  async createSpecificOffDaysAsync(data) {
    let data_send = this.mapSpecificOffDaysFieldToApi(data)
    
    try {
      const response = await this.http.post(url_specific_off_days, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
      
      if(this.result.is_ok) {
        this.result.data = this.mapSpecificOffDaysFieldFromApi(response.data.result)
        this.result.data.modification_date = response.data.result.modificationDate
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  
  async deleteSpecificOffDaysAsync(data) {
    let data_send = this.mapSpecificOffDaysFieldToApi(data)
    
    try {
      const response = await this.http.delete(url_specific_off_days, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK

      if(this.result.is_ok) {
        this.result.data = this.mapSpecificOffDaysFieldFromApi(response.data.result)
        this.result.data.modification_date = response.data.result.modificationDate
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}