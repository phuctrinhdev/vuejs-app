import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES,SERVICE_EXTEND_TYPES, CLIENTS_ENUMS } from '../../config/constant'
import { mapPagingToApi, mapPagingFromApi  } from '../../helpers/common'

const url_read    = getServiceUrl(SERVICE_TYPES.CLIENTS.CLIENT_CODESETUP_READ, 1) + CLIENTS_ENUMS.CLIENT_TYPE.CLIENT_GROUP
const url_command = getServiceUrl(SERVICE_TYPES.CLIENTS.CLIENT_CODESETUP_CMD, 1)  + CLIENTS_ENUMS.CLIENT_TYPE.CLIENT_GROUP

let url_change_order_no = url_command + SERVICE_EXTEND_TYPES.CHANGE_ORDER_NO
let url_list = url_read + SERVICE_EXTEND_TYPES.LIST

export default class ClientGroupApi { 
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
      itemName : model.name,
      shopId   : model.shop_id,
      status   : model.status,
    }
  }
  mapFieldFromApi(model){
    return {
      id        : model.clientGroupId,
      name      : model.itemName,
      order_no  : model.orderNo,
      shop_id   : model.shopId,
      status    : model.status
    }
  }
  
  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK 
    if(response.data.isOK)  this.result.data= this.mapFieldFromApi(response.data.result) 
  }

  async getClientGroupAsync(query) {
    try {
      const response = await this.http.post(url_list, mapPagingToApi(query) )
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

  async addClientGroupAsync(data) {
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

  async updateClientGroupAsync(data) {
    let data_send = this.mapFieldToApi(data) 
    data_send.clientGroupId =data.id 
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
  
  async updateClientGroupOrderNoAsync(data) {    
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