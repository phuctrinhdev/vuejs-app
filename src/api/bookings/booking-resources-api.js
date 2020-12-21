import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'
import _ from 'lodash'
import { convertTimeStampToDate } from '../../helpers/common'
import { convertDateToTimeStamp } from '../../helpers/common'
const url_read    = getServiceUrl(SERVICE_TYPES.BOOKINGS_RESOURCES_SETUP_READ, 1)
const url_command = getServiceUrl(SERVICE_TYPES.BOOKINGS_RESOURCES_SETUP_CMD, 1) 
let url_opening_hours     = url_command + SERVICE_EXTEND_TYPES.OPENING_HOUR
let url_specific_off_days = url_command + SERVICE_EXTEND_TYPES.SPECIFIC_OFF_DAY
let url_change_order_no   = url_command + SERVICE_EXTEND_TYPES.CHANGE_ORDER_NO

 
export default class BookingResourcesApi {
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
    
  }
  mapFieldToApi(model){
    let openingHours =[]
    for(let item in  model.opening_hours){
      let openingHour = { 
        startTime                     : model.opening_hours[item].start_time,
        finishTime                    : model.opening_hours[item].finish_time,
        openedDaysOfWeek              : model.opening_hours[item].opened_days_of_week,
        crossDate                     : model.opening_hours[item].cross_date
      }
      openingHours.push(openingHour) 
    }
    return {
      bookingResourceSetupId      : model.id,
      openingHours                : openingHours,
      resourceType                : model.resource_type,
      resourceId                  : model.resource_id,
      resourceName                : model.resource_name,
      workingHoursAreSameAsSalon  : model.working_hours_are_same_as_salon,
      allowOnlineBooking          : model.allow_online_booking,
      status                      : model.status, 
      shopId                      : model.shop_id,
    }
  }
  mapFieldFromApi(model, index){
    let openingHours = []
    for(let item in  model.openingHours){
      let openingHour={
        id                       : model.openingHours[item].id,
        start_time               : model.openingHours[item].startTime,
        finish_time              : model.openingHours[item].finishTime,
        opened_days_of_week      : model.openingHours[item].openedDaysOfWeek,
        cross_date               : model.openingHours[item].crossDate,
        shop_id                  : model.openingHours[item].shopId,
        modification_Date        : model.openingHours[item].modificationDate,
        registration_Date        : model.openingHours[item].registrationDate 
      }
      openingHours.push(openingHour) 
    }
    if(model.specificOffDayTS != null) {
      model.specificOffDayTS = model.specificOffDayTS.map(timestamp => convertTimeStampToDate(timestamp))
    }
    else model.specificOffDayTS = []
    if(model.id > 0) model.bookingResourceId = model.id
    return {
      index                        : index,
      id                           : model.bookingResourceId,
      resource_type                : model.resourceType,
      resource_id                  : model.resourceId,
      resource_name                : model.resourceName, 
      specific_off_days            : model.specificOffDayTS,
      opening_hours                : openingHours,
      allow_online_booking         : model.allowOnlineBooking,
      working_hours_are_same_as_salon  : model.workingHoursAreSameAsSalon,
      status                       : model.status,
      shared                       : model.shared,
      shop_id                      : model.shopId,
    }
  }
  mapBookingResourcesFromApi(response){
    let mapData = {
      items: [],
    }
    for(let index in response.bookingResourcesSetup){
      mapData.items.push(this.mapFieldFromApi(response.bookingResourcesSetup[index], index))
    }
    return mapData
  }
  mapParamToSpecificOffDayApi(model){
    model.fields.specific_off_days = _.cloneDeep(model.fields.specific_off_days)
    model.fields.specific_off_days = model.fields.specific_off_days.map(date => convertDateToTimeStamp(date))
    return {
      bookingResourceSetupId      : model.fields.id,
      specificOffDays             : model.fields.specific_off_days,
      shopId                      : model.fields.shop_id,
    }
  }
  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK 
    if(response.data.isOK) this.result.data = this.mapFieldFromApi(response.data.result)
    return this.result
  }
  
  async getBookingResourcesAsync(query) {
    let date_send = {
      shopId: query.shop_id
    }
    try { 
      let url_get = url_read + '/Live'
      const response = await this.http.post(url_get, date_send)

      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      
      if(this.result.is_ok) {
        this.result.data = this.mapBookingResourcesFromApi(response.data.result)
      }
    }
    catch(e){  
      return this.http.loadError(e)
    }
    return this.result
  }
  async addBookingResourceAsync(data) { 
    let data_send = this.mapFieldToApi(data) 
    try {
      const response = await this.http.post(url_opening_hours, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK

      if(this.result.is_ok) {
        this.result.data = this.mapFieldFromApi(response.data.result)
         
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateBookingResourceAsync(data) {
    let data_send =  this.mapFieldToApi(data) 
    try {
      const response = await this.http.put(url_opening_hours, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
      if(this.result.is_ok) {
        // this.result.data = data
        this.result.data = this.mapFieldFromApi(response.data.result)
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateBookingResourceOrderNoAsync(data) {
    let data_send = {
      'shopId'        : data.shop_id,
      'oldPositionId' : data.old_position_id,
      'newPositionId' : data.new_position_id
    }

    try {
      const response = await this.http.post(url_change_order_no, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async deleteBookingResourceAsync(data) {
    let data_send =  {
      bookingResourceSetupId: data.id,
      shopId: data.shop_id 
    }   
    try {
      const response = await this.http.delete(url_opening_hours, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK

      if(this.result.is_ok) {
        this.result.data = this.mapFieldFromApi(response.data.result)
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async addSpecificOffDayAsync(data) {
    let data_send =  this.mapParamToSpecificOffDayApi(data) 
    
    try {
      const response = await this.http.post(url_specific_off_days, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK

      if(this.result.is_ok) {
        this.result.data = data
        this.result.data.registration_date = response.data.result.registrationDate
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async deleteSpecificOffDayAsync(data) {
    let data_send =  this.mapParamToSpecificOffDayApi(data)
    
    try {
      const response = await this.http.delete(url_specific_off_days, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK

      if(this.result.is_ok) {
        this.result.data.registration_date = response.data.result.registrationDate
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}