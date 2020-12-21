import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'
import { mapPagingFromApi, mapPagingToApi } from '../../helpers/common' 

const url_read_base    = getServiceUrl(SERVICE_TYPES.MESSAGES.TEXT_SENDER_PHONE_READ, 1) // Read API URL, Version
const url_command_base = getServiceUrl(SERVICE_TYPES.MESSAGES.TEXT_SENDER_PHONE_CMD, 1) // Command API URL, Version
let url_read = url_read_base
let url_read_auto = url_read_base + SERVICE_EXTEND_TYPES.AUTO
let url_list_by_shop = url_read_base + SERVICE_EXTEND_TYPES.LIST_BY_SHOP
let url_command = url_command_base 
let url_command_as_auto_sendedr = url_command_base + SERVICE_EXTEND_TYPES.AS_AUTO_SENDER

export default class TextSenderPhoneApi {
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }
  mapCreateFieldToApi(model){
    return {
      countryCode             : model.country_code,
      shopId                  : model.shop_id,
      senderPhone             : model.sender_phone,
      certificationType       : model.certification_type,
      adminMemo               : model.admin_memo,
      userID                  : model.user_id
    }
  }
  mapUpdateAsAutoSenderFieldToApi(model){
    return {
      textSenderPhoneId       : model.id,
      shopId                  : model.shop_id,
      userID                  : model.user_id
    }
  }
  mapDeleteFieldToApi(model){
    return {
      textSenderPhoneId       : model.id,
      shopId                  : model.shop_id,
      userID                  : model.user_id
    }
  }
  mapFieldFromApi(model){
    if (model==null) return null
    return {
      id                      : model.textSenderPhoneId,
      country_code            : model.countryCode,
      shop_id                 : model.shopId,
      sender_phone            : model.senderPhone,
      is_auto_sender          : model.isAutoSender,
      certification_type      : model.certificationType,
      admin_memo              : model.adminMemo,
      user_id                 : model.userID,
      registration_date       : model.registrationDate
    }
  }  

  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK

    if(response.data.isOK)
      this.result.data = this.mapFieldFromApi(response.data.result)
  }

  async getTextSenderPhoneAsync(query) {
    try {
      let send_data = {
        textSenderPhoneId: query.id,
        shopId: query.shop_id
      }
      const response = await this.http.post(url_read, send_data)
      this.result.action = query.action
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }  
  async getTextSenderAutoPhoneAsync(query) {
    try {
      let send_data = {
        shopId: query.shop_id
      }
      const response = await this.http.post(url_read_auto, send_data)
      this.result.action = query.action
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async getTextSenderPhonesByShopAsync(query) {
    try {
      let query_map = mapPagingToApi(query)
      query_map.shopId = query.shop_id

      const response = await this.http.post(url_list_by_shop, query_map)
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

  async createTextSenderPhoneAsync(data) {
    let data_send = this.mapCreateFieldToApi(data)
    try {
      const response = await this.http.post(url_command, data_send)
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
  async updateTextSenderPhoneAsAutoSenderAsync(data) {
    let data_send = this.mapUpdateAsAutoSenderFieldToApi(data)
    try {      
      const response = await this.http.put(url_command_as_auto_sendedr, data_send)
      this.setResult(response)
      if(this.result.is_ok) {
        this.result.data.modification_date = response.data.result.modificationDate
        delete this.result.data.registration_date
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async deleteTextSenderPhoneAsync(data) {
    let data_send = this.mapDeleteFieldToApi(data)
    try {
      const response = await this.http.delete(url_command, data_send)
      this.setResult(response, null)
      this.result.data = {}
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result    
  }
}