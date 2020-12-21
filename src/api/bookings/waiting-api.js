import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { mapPagingFromApi, convertDateToTimeStamp, convertTimeStampToDate, mapSecurityInfo } from '../../helpers/common'
import { SERVICE_TYPES  } from '../../config/constant' 
import { options } from '../../helpers/options'

const url_read    = getServiceUrl(SERVICE_TYPES.WAITING_READ, 1) + '/Live'
const url_command = getServiceUrl(SERVICE_TYPES.WAITING_CMD, 1)

export default class WaitingApi {  
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data:{
        items:[]
      }
    }
  } 
  mapFieldToApi(model){
    model = mapSecurityInfo(model)

    let tmp_chain_id = model.chain_id
    if(tmp_chain_id == 0)
      tmp_chain_id = null

    return {
      waitingId                 : model.id,
      shopId                    : model.shop_id,
      clientId                  : model.client_id,
      clientName                : model.client_name,
      clientMobileNumber        : model.client_mobile_number,
      clientMemberNumber        : model.client_member_number,
      clientRegistrationDateTS  : model.client_registration_date_ts,
      bookingDateTS             : convertDateToTimeStamp(model.booking_date),
      notes                     : model.notes,
      fromTime                  : model.from_time,
      toTime                    : model.to_time ,
      isNextDay                 : model.is_next_day,
      status                    : model.status,
      bookingSource             : model.booking_source,
      bookingResourceSetupId    : model.booking_resource_setup_id,
      bookingResourceName       : model.booking_resource_name,
      waitingBookedItems        : model.waiting_booked_items,
      createdById               : model.created_by_id,
      createdByName             : model.created_by_name, 
      modificationDate          : model.modification_date,  
      sessionToken              : model.session_token,
      shopLocation              : model.shop_location,
      chainId                   : tmp_chain_id,
      branchNumber              : model.branch_number,
      shopName                  : model.shop_name,
      clientShopId              : model.client_shop_id,
      clientShopName            : model.client_shop_name,
    }
  }
  mapFieldFromApi(model){
    let result = {
      id                        : model.waitingId,
      shop_id                   : model.shopId,
      client_id                 : model.clientId,
      client_name               : model.clientName,
      client_mobile_number      : model.clientMobileNumber,
      client_member_number      : model.clientMemberNumber,
      client_registration_date  : convertTimeStampToDate(model.clientRegistrationDateTS),
      client_registration_date_ts: model.clientRegistrationDateTS,
      booking_date              : convertTimeStampToDate(model.bookingDateTS), 
      booking_date_ts           : model.bookingDateTS, 
      notes                     : model.notes,
      from_time                 : model.fromTime,
      to_time                   : model.toTime,
      is_next_day               : model.isNextDay,
      status                    : model.status,
      booking_source            : model.bookingSource,
      waiting_booked_items      : [], 
      booking_resource_setup_id : model.bookingResourceSetupId,
      booking_resource_name     : model.bookingResourceName,
      resource_name             : model.resourceName,
      created_by_id             : model.createdById,
      created_by_name           : model.createdByName, 
      registration_date         : model.registrationDate,
      modification_date         : model.modificationDate,
      session_token             : model.sessionToken,
      shop_location             : model.shopLocation,
      chain_id                  : model.chainId,
      branch_number             : model.branchNumber,
      shop_name                 : model.shopName,
      client_shop_id            : model.clientShopId,
      client_shop_name          : model.clientShopName,
    }
    if(model.id > 0 ){
      result.id = model.id
    }
    if(model.registrationDateTS > 0){
      result.registration_date  = convertTimeStampToDate(model.registrationDateTS)
    }
    if(model.modificationDateTS > 0){
      result.modification_date  = convertTimeStampToDate(model.modificationDateTS)
    }
    let map_waiting_booked_items = [] 
    for(let index in model.waitingBookedItems){
      let booked_item = this.mapWaitingBookedItemsFromApi(model.waitingBookedItems[index])
      booked_item.order_number = index 
      map_waiting_booked_items.push(booked_item)
    } 
    result.waiting_booked_items=map_waiting_booked_items
    return result
  }
  mapWaitingBookedItemsToApi(model){
    return {
      waitingBookedItemId : model.waiting_booked_item_id,
      waitingId           : model.waiting_id,
      serviceId           : model.service_id,
      serviceName         : model.service_name,
      estimatedTime       : model.estimated_time,
      processingTime      : model.processing_time,
      finishingTime       : model.finishing_time,
      bookingItemId       : model.booking_item_id,
      shopId              : model.shop_id,
      deductedPrepaidGoodsRef     : model.deducted_prepaid_goods_ref,
      deductedPrepaidGoodsRefName : model.deducted_prepaid_goods_ref_name,
    }
  }
  mapWaitingBookedItemsFromApi(model){
    return {
      waiting_booked_item_id : model.waitingBookedItemId,
      waiting_id            : model.waitingId,
      service_id            : model.serviceId,
      service_name          : model.serviceName,
      estimated_time        : model.estimatedTime,
      processing_time       : model.processingTime,
      finishing_time        : model.finishingTime,
      booking_item_id       : model.bookingItemId,
      shop_id               : model.shopId,
      deducted_prepaid_goods_ref      : model.deductedPrepaidGoodsRef,
      deducted_prepaid_goods_ref_name : model.deductedPrepaidGoodsRefName,
    }
  }
  mapParamToApi(query){
    return {
      typeDate          : query.type_date,
      fromDate          : query.from_date,
      toDate            : query.to_date, 
      shopId            : query.shop_id,
    }
  } 
  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK 
    if(response.data.isOK) this.result.data = this.mapFieldFromApi(response.data.result)
    return this.result
  }
  mapWaitingsFromApi(waitings){
    let mapData = {
      items: [],
      pagination: {}
    }
    let waiting_data = {} 
    for(let index in waitings){ 
      if(waitings[index].id > 0 ){
        waitings[index].WaitingId = waitings[index].id
      }
      waiting_data = this.mapFieldFromApi(waitings[index])  
      mapData.items.push(waiting_data)
    }
    return mapData
  } 
  async getWaitingsAsync(query) {
    let data_query = {
      typeDate                : query.type_date,
      fromWaitingDateTS       : convertDateToTimeStamp(query.from_waiting_date), 
      toWaitingDateTS         : convertDateToTimeStamp(query.to_waiting_date),
      nameOrMobile            : query.name_or_mobile,
      bookingResourceSetupId  : query.booking_resource_setup_id, 
      status                  : query.status, 
      clientId                : query.client_id, 
      ascOrdering             : query.asc_ordering,
      pageSize                : query.page_size,
      pageNumber              : query.page_number, 
      shopId                  : query.shop_id, 
    }

    if(data_query.typeDate == options.type_date.date){
      data_query.toWaitingDateTS = data_query.fromWaitingDateTS
    }

    try { 
      const response = await this.http.post(url_read, data_query)  
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let mapData = {
          items: [],
          pagination: {}
        } 
        mapData = this.mapWaitingsFromApi(response.data.result.items)
        mapData.pagination = mapPagingFromApi(response.data.result.pagingInfo)
        this.result.data = mapData  
      }
    }
    catch(e){ 
      return this.http.loadError(e)
    }
    return this.result
  }
  loadError(e){
    this.http.loadError(e)
  }
  async addWaitingAsync(data) { 
    let data_send = this.mapFieldToApi(data)
    for(let i in data.waiting_booked_items){
      data.waiting_booked_items[i] = this.mapWaitingBookedItemsToApi(data.waiting_booked_items[i])
    } 
    try { 
      const response = await this.http.post(url_command, data_send)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) { 
        this.result.data = this.mapFieldFromApi(response.data.result)
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateWaitingAsync(data) {
    let data_send = this.mapFieldToApi(data)
    for(let i in data.waiting_booked_items){
      data.waiting_booked_items[i] = this.mapWaitingBookedItemsToApi(data.waiting_booked_items[i])
    }

    try {
      const response = await this.http.put(url_command, data_send)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        this.result.data = this.mapFieldFromApi(response.data.result)
      }
    }
    catch(e) { 
      this.http.loadError(e)
    }
    return this.result
  }
}