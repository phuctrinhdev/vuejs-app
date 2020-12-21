import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, STAFFS_ENUMS, SERVICE_EXTEND_TYPES } from '../../config/constant'
import { mapPagingFromApi } from '../../helpers/common' 
import moment from 'moment'

const url_read    = getServiceUrl(SERVICE_TYPES.STAFF_READ, 1) // Read API URL, Version
const url_command = getServiceUrl(SERVICE_TYPES.STAFF_CMD, 1) // Command API URL, Version
const url_aggr    = getServiceUrl(SERVICE_TYPES.STAFF_AGGR, 1) //aggregator API URL, Version

let url_active = url_read + STAFFS_ENUMS.STAFF_TYPE.ACTIVE
let url_working_hours = url_command + STAFFS_ENUMS.STAFF_TYPE.WORKING_HOUR
let url_working_hours_read_list = url_read + STAFFS_ENUMS.STAFF_TYPE.WORKING_HOUR + SERVICE_EXTEND_TYPES.LIST

let url_staff_list = url_read + SERVICE_EXTEND_TYPES.LIST
let url_aggr_active = url_aggr + STAFFS_ENUMS.STAFF_TYPE.ACTIVE + SERVICE_EXTEND_TYPES.LIST

export default class StaffApi {
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
    
  }
  mapFieldToApi(model){
    let workingHours =[]  
    for(let item in  model.workingHours){
      let workingHour={
        id                      : model.workingHours[item].id,
        startTime               : model.workingHours[item].start_time,
        finishTime              : model.workingHours[item].finish_time,
        workedDaysOfWeek        : model.workingHours[item].worked_days_of_week,
        staffId                 : model.workingHours[item].staff_id,
        modificationDate        : model.workingHours[item].modification_Date,
        registrationDate        : model.workingHours[item].registration_Date 
      }
      workingHours.push(workingHour) 
    } 
    return {
      staffId                : model.id,
      shopId                 : model.shop_id, 
      staffNumber            : model.staff_number,
      aliasName              : model.aliasname,
      fullName               : model.fullname,
      mobilePhoneNumber      : model.mobile_phonenumber,
      phoneNumber            : model.phone_number,
      email                  : model.email,
      birthYear              : model.birth_year,
      birthMonth             : model.birth_month,
      birthDD                : model.birth_dd,
      career                 : model.career,
      jobPosition            : model.job_position,
      certifications         : model.certifications,
      postcode               : model.postcode,
      address1               : model.address1,
      address2               : model.address2,
      entryDate              : model.entry_date,
      leavingDate            : model.leaving_date,
      notes                  : model.notes,
      status                 : model.status,
      workingHours           : workingHours
    }
  }
  mapFieldFromApi(model){
    let workingHours =[]  
    for(let item in  model.workingHours){
      let workingHour={
        id                       : model.workingHours[item].id,
        start_time               : model.workingHours[item].startTime,
        finish_time              : model.workingHours[item].finishTime,
        worked_days_of_week      : model.workingHours[item].workedDaysOfWeek,
        staff_id                 : model.workingHours[item].staffId,
        modification_Date        : model.workingHours[item].modificationDate,
        registration_Date        : model.workingHours[item].registrationDate 
      }
      workingHours.push(workingHour) 
    } 
    return { 
      id                            : model.staffId,
      shop_id                       : model.shopId,
      staff_number                  : model.staffNumber,
      aliasname                     : model.aliasName,
      fullname                      : model.fullName,
      mobile_phonenumber            : model.mobilePhoneNumber,
      phone_number                  : model.phoneNumber,
      email                         : model.email,
      birth_year                    : model.birthYear,
      birth_month                   : model.birthMonth,
      birth_dd                      : model.birthDD, 
      career                        : model.career,
      job_position                  : model.jobPosition,
      certifications                : model.certifications,
      postcode                      : model.postcode,
      address1                      : model.address1,
      address2                      : model.address2,
      entry_date                    : model.entryDate == null ? null : moment(model.entryDate).toDate(),
      leaving_date                  : model.leavingDate == null ? null : moment(model.leavingDate).toDate(),
      notes                         : model.notes,
      status                        : model.status,
      working_hours                 : workingHours
    }
  }

  mapFieldWorkingHourFromApi(model){
    let workingHours =[]  
    for(let item in  model.workingHours){
      let workingHour={
        id                       : model.workingHours[item].id,
        start_time               : model.workingHours[item].startTime,
        finish_time              : model.workingHours[item].finishTime,
        worked_days_of_week      : model.workingHours[item].workedDaysOfWeek,
        staff_id                 : model.workingHours[item].staffId,
        modification_Date        : model.workingHours[item].modificationDate,
        registration_Date        : model.workingHours[item].registrationDate 
      }
      workingHours.push(workingHour) 
    } 
    return { 
      id                            : model.staffId,
      shop_id                       : model.shopId,
      working_hours                 : workingHours
    }
  }

  mapFieldWorkingHourUpdateFromApi(model){
    return { 
      id                          : model.id,
      staff_id                    : model.staffId,
      start_time                  : model.startTime,
      finish_time                 : model.finishTime,
      worked_days_of_week         : model.workedDaysOfWeek,
    }
  }
  mapFieldWorkingHourToApi(model){
    return { 
      id                      : model.id,
      startTime               : model.start_time,
      finishTime              : model.finish_time,
      workedDaysOfWeek        : model.worked_days_of_week,
      staffId                 : model.staff_id,
      modificationDate        : model.modification_Date,
      registrationDate        : model.registration_Date 
    }
  }
  mapSearchFieldFromApi(model){
    return {
      aliasname       : model.aliasName,
      fullname        : model.fullName,
      status          : model.status
    }
  }

  mapActiveFieldFromApi(model){
    return {
      id                 : model.staffId,
      shop_id            : model.shopId,
      aliasname          : model.aliasName,
      staff_number       : model.staffNumber,
    }
  }

  mapParamToApi(query){
    return {
      searchCondition: query.search_condition,
      searchValue: query.search_value,
      pageSize: query.page_size,
      pageNumber: query.page_number,
      shopId: query.shop_id,
      status: query.status
    }
  }
  mapParamToActiveStaffApi(query){
    return {
      shopId: query.shop_id,
      ids: query.ids
    }
  }
  mapParamToWrokignHourApi(query){
    return {
      staffId: query.staff_id,
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

  mapParamToWorkingHourApi(model){ 
    return {
      workingHourId                : model.id,
      startTime                    : model.start_time,
      finishTime                   : model.finish_time,
      staffId                      : model.staff_id,
    }
  }

  nullToZero(data){
    if(data.birthDD == null || data.birthDD == '')
      data.birthDD = '0'
    if(data.birthMonth == null || data.birthMonth == '')
      data.birthMonth = '0'
    if(data.birthYear == null || data.birthYear == '')
      data.birthYear = '0'

    return data
  }

  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK 
    if(response.data.isOK) this.result.data = this.mapFieldFromApi(response.data.result)
    return this.result
  } 
  setResultWorkingHour(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK 
    if(response.data.isOK) this.result.data = this.mapFieldWorkingHourFromApi(response.data.result)
    return this.result
  } 
  setResultWorkingHourUpdate(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK 
    if(response.data.isOK) this.result.data = this.mapFieldWorkingHourUpdateFromApi(response.data.result)
    return this.result
  }

  async getStaffAllAsync(query) {
    query = this.mapParamToApi(query)

    try {
      const response = await this.http.post(url_staff_list, query)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let mapData = {
          items: [],
          pagination: {}
        }
        for(let items in response.data.result.items){
          mapData.items.push(this.mapFieldFromApi(response.data.result.items[items]))
        }
        mapData.pagination = mapPagingFromApi(response.data.result.pagingInfo)
        this.result.data = mapData
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getStaffActiveAsync(query) {
    query = this.mapParamToActiveStaffApi(query)

    try {
      const response = await this.http.post(url_active, query)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let mapData = {
          items: []
        }
        for(let items in response.data.result.items){
          mapData.items.push(this.mapActiveFieldFromApi(response.data.result.items[items]))
        }
        this.result.data = mapData
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getNotUseStaffActiveAsync(query) {
    let query_map = {
      staffId: query.staff_id,
      shopId: query.shop_id
    }

    try {
      const response = await this.http.post(url_aggr_active, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let mapData = {
          items: []
        }
        for(let items in response.data.result.items){
          mapData.items.push(this.mapActiveFieldFromApi(response.data.result.items[items]))
        }
        this.result.data = mapData
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getStaffAsync(data) {
    let send_data = {
      staffId: data.data.id,
      shopId: data.data.shop_id
    }

    try {
      const response = await this.http.post(url_read, send_data)
      this.result.action = data.action
      this.setResult(response, this.mapFieldFromApi)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getWorkingHourAsync(data) {
    let send_data = {
      workingHourId: data.data.id,
      shopId: data.shopId,
      staffId: data.data.staff_id
    }

    try {
      const response = await this.http.post(url_working_hours_read_list, send_data)
      this.result.action = data.action
      this.setResultWorkingHour(response, this.mapFieldWorkingHourFromApi)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async addStaffAsync(data) {
    let data_send = this.mapFieldToApi(data)
    data_send.shared = data.shared

    try {
      const response = await this.http.post(url_command, Object.assign(data_send, this.nullToZero(data_send)))
      this.setResult(response)
      if(this.result.is_ok) {
        this.result.data.registration_date = response.data.result.registrationDate
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateStaffAsync(data) {
    let data_send = this.mapFieldToApi(data)
    data_send.staffId = data.id
    try {
      const response = await this.http.put(url_command, Object.assign(data_send, this.nullToZero(data_send)))
      this.setResult(response)
      if(this.result.is_ok) {
        this.result.data.modification_date = response.data.result.modificationDate
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async addWorkingHourAsync(data) { 
    let data_send = this.mapFieldWorkingHourToApi(data) 
    try {
      const response = await this.http.post(url_working_hours, Object.assign(data_send, this.nullToZero(data_send)))
      this.setResultWorkingHourUpdate(response)
      if(this.result.is_ok) {
        this.result.data.registration_date = response.data.result.registrationDate
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateWorkingHourAsync(data) {
    let data_send =  this.mapFieldWorkingHourToApi(data) 
    data_send.workingHourId = data.id
    try {
      const response = await this.http.put(url_working_hours, Object.assign(data_send, this.nullToZero(data_send)))
      this.setResultWorkingHourUpdate(response)
      if(this.result.is_ok) {
        this.result.data.modification_date = response.data.result.modificationDate
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async deleteWorkingHourAsync(data) {
    let data_send =  {
      workingHourId: data.id,
      staffId: data.staff_id 
    }   
    try {
      const response = await this.http.delete(url_working_hours, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK

      if(this.result.is_ok) {
        this.result.data = this.mapFieldWorkingHourToApi(response.data.result)
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }  
}