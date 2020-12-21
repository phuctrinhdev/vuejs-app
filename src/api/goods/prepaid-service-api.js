import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'
import PrepaidServiceViewModel from '../../view-model/goods/prepaid-service-view-model'
import { mapPagingToApi, mapPagingFromApi, isNullObject } from '../../helpers/common' 

const url_command       = getServiceUrl(SERVICE_TYPES.PREPAID_SERVICE_CMD, 1)
const url_read          = getServiceUrl(SERVICE_TYPES.PREPAID_SERVICE_READ, 1)
let url_change_order_no = url_command + SERVICE_EXTEND_TYPES.CHANGE_ORDER_NO


export default class PrepaidServiceApi {  
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }
  mapFieldFromApi(prepaid_service_api_data){
    if(!isNullObject(prepaid_service_api_data)){
      let prepaid_service_vm = new PrepaidServiceViewModel()
      prepaid_service_vm.mapFieldFromApi(prepaid_service_api_data)
      return prepaid_service_vm
    }
    return null
  }
  mapFieldToApi(prepaid_service_vm){
    return prepaid_service_vm.mapFieldToApi()
  }
  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK 
    if(response.data.isOK) this.result.data = this.mapFieldFromApi(response.data.result).getFields()
    return this.result
  }
  async getPrepaidServiceAsync(query) {
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
  async addPrepaidServiceAsync(data) {
    let data_send = this.mapFieldToApi(data)
    data_send.shared = data.shared

    try {
      const response = await this.http.post(url_command, data_send)
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async updatePrepaidServiceAsync(data) {
    let data_send = this.mapFieldToApi(data)

    try {
      const response = await this.http.put(url_command, data_send)
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
  async updatePrepaidServiceOrderNoAsync(data) {
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
