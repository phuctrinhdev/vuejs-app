import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'

const url_command = getServiceUrl(SERVICE_TYPES.BOOKINGS_OPENING_HOURS_SETUP_CMD, 1)

let url_repeat_off_days = url_command + SERVICE_EXTEND_TYPES.REPEAT_OFF_DAY

export default class RepeatOffDaysApi {
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }
  mapRepeatedOffDaysFieldToApi(model){
    return {
      id                  : model.id,
      repeatType          : model.repeat_type,
      repeatedWeeks       : model.repeated_weeks,
      repeatedDaysOfWeek  : model.repeated_days_of_week,
      shopId              : model.shop_id
    }
  }
  mapRepeatedOffDaysFieldFromApi(model){
    return {
      id                    : model.id,
      repeat_type           : model.repeatType,
      repeated_weeks        : model.repeatedWeeks,
      repeated_days_of_week : model.repeatedDaysOfWeek,
      shop_id               : model.shopId
    }
  }
  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK

    if(response.data.isOK) this.result.data = this.mapFieldFromApi(response.data.result)
    return this.result
  }

  async addRepeatOffDaysAsync(data) {
    let data_send = this.mapRepeatedOffDaysFieldToApi(data)
    
    try {
      const response = await this.http.post(url_repeat_off_days, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK

      if(this.result.is_ok) {
        this.result.data = this.mapRepeatedOffDaysFieldFromApi(response.data.result)
        this.result.data.modification_date = response.data.result.modificationDate
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateRepeatOffDaysAsync(data) {
    let data_send = this.mapRepeatedOffDaysFieldToApi(data)
    
    try {
      const response = await this.http.put(url_repeat_off_days, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK

      if(this.result.is_ok) {
        this.result.data = this.mapRepeatedOffDaysFieldFromApi(response.data.result)
        this.result.data.modification_date = response.data.result.modificationDate
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}