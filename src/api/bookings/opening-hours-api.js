import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'
import { convertTimeStampToDate } from '../../helpers/common'

const url_read    = getServiceUrl(SERVICE_TYPES.BOOKINGS_OPENING_HOURS_SETUP_READ, 1)
const url_command = getServiceUrl(SERVICE_TYPES.BOOKINGS_OPENING_HOURS_SETUP_CMD, 1)

let url_opening_hours = url_command + SERVICE_EXTEND_TYPES.OPENING_HOURS

export default class OpeningHoursApi {
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }
  mapOpeningHoursFieldToApi(model){
    return {
      id                : model.id,
      openingHourId     : model.id,
      startTime         : model.start_time,
      finishTime        : model.finish_time,
      openedDaysOfWeek  : model.opened_days_of_week,
      crossDate         : model.cross_date,
      shopId            : model.shop_id
    }
  }
  mapOpeningHoursFieldFromApi(model){
    return {
      id                  : model.id,
      opening_hour_id     : model.openingHourId,
      start_time          : model.startTime,
      finish_time         : model.finishTime,
      opened_days_of_week : model.openedDaysOfWeek,
      cross_date          : model.crossDate,
      shop_id             : model.shopId
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
  mapOpeningHourSetupFromApi(model){
    let opening_hour_setup = {}
    // opening hours
    opening_hour_setup.opening_hours = []
    for(let opening_hour in model.openingHours){
      opening_hour_setup.opening_hours.push(this.mapOpeningHoursFieldFromApi(model.openingHours[opening_hour]))
    }
    
    // repeat off days
    if(model.repeatedOffDays == null){
      opening_hour_setup.repeated_off_days = {
        repeat_type: 1,
        repeated_weeks: [1],
        repeated_days_of_week: [0],
        shop_id: 0
      }
    }
    else opening_hour_setup.repeated_off_days = this.mapRepeatedOffDaysFieldFromApi(model.repeatedOffDays)
    
    // specific off day
    opening_hour_setup.specific_off_days = model.specificOffDayTS.map(timestamp => convertTimeStampToDate(timestamp))

    return opening_hour_setup
  }
  mapParamToApi(query){
    return {
      pageNumber: query.page_number,
      pageSize: query.page_size,
      shopId: query.shop_id
    }
  }
  mapParamFromApi(pagination){
    return {
      page_number : pagination.pageNumber,
      page_size   : pagination.pageSize,
      total_items : pagination.totalItems,
    }
  }
  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK

    if(response.data.isOK) this.result.data = this.mapFieldFromApi(response.data.result)
    return this.result
  }

  async getOpeningHoursAsync(query) {
    let url_get_opening_hours = url_read + '/Live'
    query = this.mapParamToApi(query)
    
    try {
      const response = await this.http.post(url_get_opening_hours, query)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if(this.result.is_ok){
        this.result.data = this.mapOpeningHourSetupFromApi(response.data.result)
      }
      else {
        this.result.data = {
          opening_hours: [],
          repeated_off_days: {},
          specific_off_days: []
        }
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async addOpeningHourAsync(data) {
    data.id = 0
    let data_send = this.mapOpeningHoursFieldToApi(data)

    try {
      const response = await this.http.post(url_opening_hours, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK

      if(this.result.is_ok) {
        this.result.data = this.mapOpeningHoursFieldFromApi(response.data.result)
        this.result.data.registration_date = response.data.result.registrationDate
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateOpeningHourAsync(data) {
    let data_send = this.mapOpeningHoursFieldToApi(data)
    
    try {
      const response = await this.http.put(url_opening_hours, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK

      if(this.result.is_ok) {
        this.result.data = this.mapOpeningHoursFieldFromApi(response.data.result)
        this.result.data.modification_date = response.data.result.modificationDate
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async deleteOpeningHourAsync(data) {
    let data_send = this.mapOpeningHoursFieldToApi(data)
    
    try {
      const response = await this.http.delete(url_opening_hours, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK

      if(this.result.is_ok) {
        this.result.data = this.mapOpeningHoursFieldFromApi(response.data.result)
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}