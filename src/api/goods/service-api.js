import Http from '../../helpers/http'
import ServiceViewModel from '../../view-model/goods/service-view-model'
import PerformingResourceViewModel from '../../view-model/goods/performing-resource-view-model'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { mapPagingToApi, mapPagingFromApi, isNullObject  } from '../../helpers/common' 

import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'

const url_read    = getServiceUrl(SERVICE_TYPES.SERVICE_READ, 1)
const url_command = getServiceUrl(SERVICE_TYPES.SERVICE_CMD, 1)
const url_agg     = getServiceUrl(SERVICE_TYPES.SERVICE_CMD_AGG, 1)

let url_read_services_by_ids  = url_read    + SERVICE_EXTEND_TYPES.LIST
let url_change_order_no       = url_command + SERVICE_EXTEND_TYPES.CHANGE_ORDER_NO
 
export default class ServiceApi {  
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
      service: model.service.mapFieldToApi(),
      performingResource: model.performing_resource.mapFieldToApi()
    }
  }
  mapFieldFromApi(service_api_data){
    if(!isNullObject(service_api_data)){
      let service_vm = new ServiceViewModel()
      service_vm.mapFieldFromApi(service_api_data)
      return service_vm
    }
    return null
  }
  mapPerformingResourceFieldsFromApi(performing_api_data){
    if(!isNullObject(performing_api_data)){
      let performing_resource_vm = new PerformingResourceViewModel()
      performing_resource_vm.mapFieldFromApi(performing_api_data)
      return performing_resource_vm
    }
    return null
  }
  mapFieldFromApiAgg(model){
    return {
      service: this.mapFieldFromApi(model.service),
      performing_resource: this.mapPerformingResourceFieldsFromApi(model.performingResource)
    }
  }
  setResultAgg(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK 
    this.result.data = this.mapFieldFromApiAgg(response.data.result) 
    return this.result
  }
  async getServicesAsync(query) {
    let query_map = mapPagingToApi(query)
    query_map.serviceCategoryId = query.category
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
          mapData.items.push(this.mapFieldFromApi(response.data.result.items[item]).getFields())
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
  async getServicesByIdsAsync(query) {
    let query_map = {
      shopId: query.shop_id,
      serviceIds: query.booked_item_ids
    }
    try {
      const response = await this.http.post(url_read_services_by_ids, query_map) 
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.data = []
      
      if(this.result.is_ok) {
        for(let item in response.data.result){
          this.result.data.push(this.mapFieldFromApi(response.data.result[item]).getFields())
        }
      }
    }
    catch(e){
      return this.http.loadError(e)
    } 
    return this.result
  }
  async getServiceAsync(id, query) {
    let url_send = url_agg + '/' + id
    let data_send = {
      shopId: query.shop_id,
      status: query.status
    }
    try {
      const response = await this.http.post(url_send, data_send) 
      this.setResultAgg(response) 
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  // because aggregator merged add & update api
  async addOrUpdateServiceAsync(data) {
    let data_send = this.mapFieldToApi(data) 
    try {
      const response = await this.http.post(url_agg, data_send)  
      this.setResultAgg(response)
      if(response.isOK) this.result.data.registration_date = response.data.result.registrationDate
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  
  async updateServiceOrderNoAsync(data) {
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
}

