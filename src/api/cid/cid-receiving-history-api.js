import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'
import { mapPagingToApi, mapPagingFromApi } from '../../helpers/common'

const url_read    = getServiceUrl(SERVICE_TYPES.CLIENTS.CID_RECEIVING_HISTORY_READ, 1) // Read API URL, Version
const url_command = getServiceUrl(SERVICE_TYPES.CLIENTS.CID_RECEIVING_HISTORY_CMD, 1) // Command API URL, Version

let url_search_list = url_read + SERVICE_EXTEND_TYPES.SEARCH_LIST

export default class ShopEnvironmentApi {
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }
  mapFieldFromAddApi(model){
    return {
      cid_receiving_history_id             : model.cidReceivingHistoryId,
      registration_date                    : model.registrationDate,      
      call_number                          : model.callNumber,
      created_by_user_id                   : model.createdByUserID,
      client_id                            : model.clientId,
      client_own_shop_id                   : model.clientOwnShopId,
      shop_id                              : model.ShopId,
      created_by_shopId                    : model.createdByShopId,
      consult_id                           : model.consultId
    }
  }
  mapFieldFromApi(model){
    return {
      cid_receiving_history_id        : model.cidReceivingHistoryId,
      call_number                     : model.callNumber,
      created_by_user_id              : model.createdByUserID,
      client_id                       : model.clientId,
      member_number                   : model.memberNumber,
      client_name                     : model.clientName,
      client_own_shop_id              : model.clientOwnShopId,
      consult_id                      : model.shopId,
      registration_date               : model.registrationDate,
      modification_date               : model.modificationDate
    }
  }
  setResult(response){
    this.result.error_messages = response.data.errorMessages
    this.result.is_ok = response.data.isOK

    if(response.data.isOK)
      this.result.data = this.mapFieldFromApi(response.data.result)
  }

  async getCIDReceivingHistoryAsync(query) {
    let data_send = {
      shopId: query.shop_id,
      cidReceivingHistoryId: query.cid_receiving_history_id
    }
    try {
      const response = await this.http.post(url_read, data_send)
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getCIDReceivingHistoriesAsync(query) {
    try {
      let query_map = mapPagingToApi(query)

      if(query.call_number.trim() != '')
        query_map.callNumber = query.call_number.trim()
      else
        query_map.callNumber = ''
      
      if(query.registrationDateFromTS != null)
        query_map.registrationDateFromTS =query.registrationDateFromTS
      else 
        query_map.registrationDateFromTS = 0

      if(query.registrationDateToTS != null)
        query_map.registrationDateToTS = query.registrationDateToTS
      else
        query_map.registrationDateToTS = 0
      query_map.shopId = query.shop_id

      const response = await this.http.post(url_search_list, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = response.data.errorMessages

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

  async addCIDReceivingHistoryAsync(data) {
    let data_send = {
      shopId: data.shop_id,
      callNumber: data.call_number
    }
    try {
      const response = await this.http.post(url_command, data_send)
      this.result.error_messages = response.data.errorMessages
      this.result.is_ok = response.data.isOK

      if(response.data.isOK)
      {
        this.result.data = this.mapFieldFromAddApi(response.data.result)
        this.result.data.registration_date = response.data.result.registrationDate
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  
  async UpdateCIDReceivingHistoryClientIdAsync(data) {
    let data_send = {
      shopId: data.shop_id,
      cidReceivingHistoryId: data.cid_receiving_history_id,
      clientId: data.client_id
    }
    try {
      const response = await this.http.put(url_command, data_send)
      this.result.error_messages = response.data.errorMessages
      this.result.is_ok = response.data.isOK

      if(response.data.isOK)
      {
        this.result.data = this.mapFieldFromAddApi(response.data.result)
        this.result.data.registration_date = response.data.result.registrationDate
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async deleteCidHistoryAsync(data) {
    let data_send = {
      shopId: data.shop_id,
      cidReceivingHistoryId : data.cid_receiving_history_id
    }

    try {
      const response = await this.http.delete(url_command, data_send)
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}