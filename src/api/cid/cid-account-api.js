import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'
import { mapPagingToApi, mapPagingFromApi } from '../../helpers/common'

const url_read    = getServiceUrl(SERVICE_TYPES.ADMINS.CID_ACCOUNT_READ, 1) // Read API URL, Version
const url_command = getServiceUrl(SERVICE_TYPES.ADMINS.CID_ACCOUNT_CMD, 1) // Command API URL, Version


let url_list = url_read + SERVICE_EXTEND_TYPES.LIST

export default class ShopEnvironmentApi {
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
      shopId            : model.shop_id,
      cidAccountId      : model.cid_account_id,
      cidLoginID        : model.cid_login_id,
      cidLoginPassword  : model.cid_login_password,
      macAddress        : model.mac_address,
      status            : model.status
    }
  }
  mapFieldFromApi(model){
    return {
      cid_account_id                : model.cidAccountId,
      shop_id                       : model.shopId,
      cid_login_id                  : model.cidLoginID,
      cid_login_password            : model.cidLoginPassword,
      mac_address                   : model.macAddress,
      manager_id                    : model.managerID,
      manager_name                  : model.managerName,
      registration_date             : model.registrationDate,
      modification_date             : model.modificationDate,
      status                        : model.status
    }
  }

  setResult(response){
    this.result.error_messages = response.data.errorMessages
    this.result.is_ok = response.data.isOK

    if(response.data.isOK)
      this.result.data = this.mapFieldFromApi(response.data.result)
  }

  async getCIDAccountAsync(query) {
    let data_send = {
      shopId: query.shop_id,
      cidAccountId: query.cid_account_id
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

  async getCIDAccountsAsync(query) {
    try {
      let query_map = mapPagingToApi(query)
      query_map.shopId = query.shop_id
      const response = await this.http.post(url_list, query_map)
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

  async addOrUpdateCIDAccountAsync(data) {
    let data_send = this.mapFieldToApi(data)
    try {
      const response = await this.http.post(url_command, data_send)
      this.setResult(response)
      if(this.result.is_ok) {
        this.result.data.registration_date = response.data.result.registrationDate
        this.result.data.modification_date = response.data.result.modificationDate
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async deleteCIDAccountAsync(query) {
    let data_send = {
      shopId: query.shop_id,
      cidAccountId: query.cid_account_id
    }
    try {
      const response = await this.http.delete(url_command, data_send)
      this.setResult(response)
      if(this.result.is_ok) {
        this.setResult(response)
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}