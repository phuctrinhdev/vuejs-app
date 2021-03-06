import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES,SERVICE_EXTEND_TYPES} from '../../config/constant'
import { mapPagingToApi, mapPagingFromApi  } from '../../helpers/common'

const url_read    = getServiceUrl(SERVICE_TYPES.SERVICE_CATEGORY_READ, 1)
const url_command = getServiceUrl(SERVICE_TYPES.SERVICE_CATEGORY_CMD, 1) 

let url_change_order_no = url_command + SERVICE_EXTEND_TYPES.CHANGE_ORDER_NO
let url_name = url_read + SERVICE_EXTEND_TYPES.NAME

export default class ServiceCategoryApi {  
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
      serviceCategoryName : model.name,
      shopId              : model.shop_id,
      status              : model.status,
    }
  }
  mapFieldFromApi(model){
    return {
      id                      : model.serviceCategoryId,
      name                    : model.serviceCategoryName,
      order_no                : model.orderNo,
      shared                  : model.shared,
      shop_id                 : model.shopId,
      status                  : model.status,
      own_shop_id             : model.ownShopId 
    }
  }
  mapNameFieldFromApi(model){
    return {
      id   : model.serviceCategoryId,
      name : model.serviceCategoryName
    }
  }
  
  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK 
    if(response.data.isOK)  this.result.data= this.mapFieldFromApi(response.data.result) 
    return this.result
  }
  async getServiceCategoryAsync(query) {
    let query_map = mapPagingToApi(query)
    
    try {
      const response = await this.http.post(url_read, query_map)
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
  async addServiceCategoryAsync(data) {
    let data_send = this.mapFieldToApi(data)
    data_send.shared = data.shared
    
    try {
      const response = await this.http.post(url_command, data_send)
      this.setResult(response)
      if(response.isOK) this.result.data.registration_date = response.data.result.registrationDate
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async updateServiceCategoryAsync(data) {
    let data_send = this.mapFieldToApi(data) 
    data_send.serviceCategoryId = data.id 
    
    try {
      const response = await this.http.put(url_command, data_send)
      
      this.setResult(response)
      if(response.isOK) this.result.data.modification_date = response.data.result.modificationDate
    }
    catch(e) { 
      this.http.loadError(e)
    }
    return this.result
  }
  
  async deleteServiceCategoryAsync(data) {
    let data_send = this.mapFieldToApi(data) 
    data_send.serviceCategoryId = data.id 
    
    try {
      const response = await this.http.delete(url_command, data_send)
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateServiceCategoryOrderNoAsync(data) {
    let data_send = {
      shopId        : data.shop_id,
      oldPositionId : data.old_position_id,
      newPositionId : data.new_position_id
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

  async getServiceCategoryNamesAsync(query) {
    let query_map = {
      serviceCategoryIds : String(query).split(',')
    }
    try {
      const response = await this.http.post(url_name, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      
      if(this.result.is_ok) {
        let mapData = {
          items: []
        }
        for(let item in response.data.result.items){
          mapData.items.push(this.mapNameFieldFromApi(response.data.result.items[item]))
        }
        this.result.data = mapData
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}

