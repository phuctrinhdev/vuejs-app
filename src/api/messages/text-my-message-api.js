import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'
import { mapPagingFromApi } from '../../helpers/common' 

const url_read_base    = getServiceUrl(SERVICE_TYPES.MESSAGES.TEXT_MY_MESSAGE_READ, 1) // Read API URL, Version
const url_command_base = getServiceUrl(SERVICE_TYPES.MESSAGES.TEXT_MY_MESSAGE_CMD, 1) // Command API URL, Version

let url_list = url_read_base + SERVICE_EXTEND_TYPES.LIST_BY_SHOP

export default class TextMyMessageApi {
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
      textMyMessageId : model.id,
      countryCode     : model.country_code,
      solutionId      : model.solution_id,
      shopId          : model.shop_id,
      messageType     : model.message_type,
      contents        : model.contents
    }
  }

  mapFieldFromApi(model){
    return {
      id           : model.textMyMessageId,
      country_code : model.countryCode,
      solution_id  : model.solutionId,
      shop_id      : model.shopId,
      message_type : model.messageType,
      contents     : model.contents
    }
  }

  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK

    if(response.data.isOK)       
      this.result.data = this.mapFieldFromApi(response.data.result)      
  }

  async getTextMyMessagesAsync(query) {
    let query_map = this.mapFieldToApi(query)
    query_map.pageSize = query.page_size
    query_map.pageNumber = query.page_number

    try {
      const response = await this.http.post(url_list, query_map)
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

  async createTextMyMessageAsync(data) {
    let data_send = this.mapFieldToApi(data)

    try {
      const response = await this.http.post(url_command_base, data_send)
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateTextMyMessageAsync(data) {
    let data_send = this.mapFieldToApi(data)

    try {
      const response = await this.http.put(url_command_base, data_send)
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async deleteTextMyMessageAsync(data) {
    let data_send = this.mapFieldToApi(data)

    try {
      const response = await this.http.delete(url_command_base, data_send)
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}