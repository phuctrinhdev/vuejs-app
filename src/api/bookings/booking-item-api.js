import Http from '../../helpers/http'
import { mapPagingToApi, mapPagingFromApi  } from '../../helpers/common' 
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'

const url_items_read    = getServiceUrl(SERVICE_TYPES.BOOKINGS_ITEMS_SETUP_READ, 1)
const url_items_cmd     = getServiceUrl(SERVICE_TYPES.BOOKINGS_ITEMS_SETUP_CMD, 1) 
const url_item_command  = getServiceUrl(SERVICE_TYPES.BOOKINGS_ITEM_SETUP_CMD, 1)
let url_read_booking_items_by_ids = url_items_read   + '/BookingItems/' + SERVICE_EXTEND_TYPES.LIVE
let url_change_order_no           = url_item_command + SERVICE_EXTEND_TYPES.CHANGE_ORDER_NO


 
export default class BookingItemApi {
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }
  mapFieldToApi(model){
    return {
      bookingItemId               : model.id,
      useServiceCode              : model.use_service_code,
      bookingItemName             : model.booking_item_name,
      estimatedTime               : model.estimated_time, 
      status                      : model.status, 
      shopId                      : model.shop_id,
    }
  }
  mapFieldFromApi(model){   
    return {
      t_id                         : model.id,
      id                           : model.id,
      booking_item_name            : model.bookingItemName,
      estimated_time               : model.estimatedTime, 
      status                       : model.status, 
      shop_id                      : model.shopId,
    }
  }
  mapBookingItemSetupFromApi(response){
    let mapData = {
      use_service_code: false,
      items: [],
      pagination: {}
    }
    let items = response.bookingItemsSetup.bookingItems
    for(let item in items){ 
      mapData.items.push(this.mapFieldFromApi(items[item]))
    } 
    mapData.pagination = mapPagingFromApi(response.pagingInfo) 
    mapData.use_service_code = response.bookingItemsSetup.useServiceCode
    
    return mapData  
  }
  mapParamToApi(query){
    return {
      pageSize: query.page_size,
      pageNumber: query.page_number,
      shopId: query.shop_id,
      status: query.status
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
  
  async updateBookingItemsSetupAsync(query) {
    let send_data = {
      shopId        : query.shop_id,
      useServiceCode: query.use_service_code 

    }
    try {
      const response = await this.http.put(url_items_cmd, send_data)

      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        this.result.data = {
          shop_id         : response.data.result.shopId,
          use_service_code: response.data.result.useServiceCode
        }
      }
    }
    catch(e){
      return this.http.loadError(e)
    } 
    return this.result
  }

  async getBookingItemsAsync(query) {
    let get_url = url_items_read + '/Live'
    let query_map =  mapPagingToApi(query)
    
    try {
      const response = await this.http.post(get_url, query_map)

      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        this.result.data = this.mapBookingItemSetupFromApi(response.data.result)
      }
    }
    catch(e){
      return this.http.loadError(e)
    } 
    return this.result
  }

  async getBookingItemsByIdsAsync(query) {
    let query_map = {
      shopId        : query.shop_id,
      bookingItemIds: query.booked_item_ids
    }
    try {
      const response = await this.http.post(url_read_booking_items_by_ids, query_map)

      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        this.result.data = this.mapBookingItemSetupFromApi(response.data.result)
      }
    }
    catch(e){
      return this.http.loadError(e)
    } 
    return this.result
  }

  async getBookingItemAsync(query) {
    try {
      let query_map=  mapPagingToApi(query)  
      const response = await this.http.post(url_items_read, query_map) 
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      
      if(this.result.is_ok) {
        let mapData = {
          items: [],
          pagination: {}
        }
        for(let item in response.data.result.items){
          mapData.items.push(this.mapFieldFromApi(response.data.result.items[item]))
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

  async addBookingItemAsync(data) {
    let data_send = this.mapFieldToApi(data)
    try {
      const response = await this.http.post(url_item_command, data_send)
      this.setResult(response)
      if(response.isOK) this.result.data.registration_date = response.data.result.registrationDate
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateBookingItemAsync(data) {
    let data_send = this.mapFieldToApi(data) 
    data_send.packageId = data.id
    try {
      const response = await this.http.put(url_item_command, data_send)
      
      this.setResult(response)
      if(response.isOK) this.result.data.modification_date = response.data.result.modificationDate
    }
    catch(e) { 
      this.http.loadError(e)
    }
    return this.result
  }

  async updateBookingItemOrderNoAsync(data) {
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

  async deleteBookingItemAsync(data) {
    let data_send = this.mapFieldToApi(data)
    data_send.packageId = data.id
    try {
      const response = await this.http.delete(url_item_command, data_send)
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}