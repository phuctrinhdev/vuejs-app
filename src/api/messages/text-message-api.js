import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'
import { mapPagingFromApi, mapPagingToApi } from '../../helpers/common' 

const url_read = getServiceUrl(SERVICE_TYPES.MESSAGES.TEXT_MESSAGE_READ, 1) // Read API URL, Version

const url_aggr = getServiceUrl(SERVICE_TYPES.MESSAGE_AGGR, 1) //aggregator API URL, Version

let url_image                      = url_read + SERVICE_EXTEND_TYPES.VIEW_IMAGE
let url_message_detail_by_receiver = url_read + SERVICE_EXTEND_TYPES.DETAIL + SERVICE_EXTEND_TYPES.LIST_BY_RECEIVER
let url_message_master_by_shop     = url_read + SERVICE_EXTEND_TYPES.MASTER + SERVICE_EXTEND_TYPES.LIST_BY_SHOP
let url_message_detail_by_master   = url_read + SERVICE_EXTEND_TYPES.DETAIL + SERVICE_EXTEND_TYPES.LIST_BY_MASTER

let url_create      = url_aggr + SERVICE_EXTEND_TYPES.CREATE
let url_delete_list = url_aggr + SERVICE_EXTEND_TYPES.DELETE_LIST

export default class TextMessageApi {
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }

  mapMessageDetailByReceiverFieldToApi(model){
    return {
      countryCode            : model.country_code,        
      registrationDateFromTS : model.registration_date_from_ts,
      registrationDateToTS   : model.registration_date_to_ts,
      shopId                 : model.shop_id,
      messageType            : model.message_type,
      receiverKey            : model.receiver_key,
      pageSize               : model.page_size,
      pageNumber             : model.page_number
    }
  }

  mapCreateFieldToApi(model){
    let receivers = []

    for(let index in model.receivers){
      let receiver = {
        rp   : model.receivers[index].receiver_phone,
        rk   : model.receivers[index].receiver_key,
        skey : model.receivers[index].source_key,
        v1   : model.receivers[index].var1,
        v2   : model.receivers[index].var2,
        v3   : model.receivers[index].var3,
        v4   : model.receivers[index].var4,
        v5   : model.receivers[index].var5,
        v6   : model.receivers[index].var6,
        v7   : model.receivers[index].var7,
        v8   : model.receivers[index].var8
      }
      receivers.push(receiver)
    }

    return {
      countryCode  : model.country_code,
      solutionId   : model.solution_id,
      shopId       : model.shop_id,
      messageType  : model.message_type,
      senderPhone  : model.sender_phone,
      isAutoSend   : model.is_auto_send,
      isSendNow    : model.is_send_now,
      targetDateTS : model.target_date_ts,
      targetCount  : model.target_count,
      contents     : model.contents,
      imagePath    : model.image_path,
      imageName    : model.image_name,        
      userID       : model.user_id,
      variableData : model.variable_data,
      senderKey    : model.sender_key,
      sendType     : model.send_type,        
      sourceType   : model.soruce_type,   
      imageUrl     : model.image_url,
      imageBase64  : model.image_base64,
      receivers    : receivers
    }
  }

  mapCreateFieldFromApi(model){
    return {
      message_master_id : model.messageMasterId,
      registration_date : model.registrationDate,
      netmoney_id       : model.netMoneyId,
      country_code      : model.countryCode,
      solution_id       : model.solutionId,
      shop_id           : model.shopId,
      message_type      : model.messageType,
      sender_phone      : model.senderPhone,
      is_auto_send      : model.isAutoSend,
      is_send_now       : model.isSendNow,
      target_date_Ts    : model.targetDateTS,
      target_count      : model.targetCount,
      contents          : model.contents,
      image_path        : model.imagePath,
      image_name        : model.imageName,        
      user_id           : model.userID,
      variable_data     : model.variableData,
      sender_key        : model.senderKey,
      send_type         : model.sendType,        
      soruce_type       : model.sourceType,   
    }
  }

  mapDeleteListFieldToApi(model){
    let messages = []
    model.forEach(e => {
      messages.push({
        countryCode     : e.country_code,
        shopId          : e.shop_id,
        messageType     : e.message_type,
        messageMasterId : e.message_master_id,
        messageDetailId : e.message_detail_id
      })
    })

    return {
      messages : messages
    }
  }

  mapMessageMasterByShopFieldToApi(model){
    return {
      countryCode            : model.country_code,
      shopId                 : model.shop_id,
      registrationDateFromTS : model.registration_date_from_ts,
      registrationDateToTS   : model.registration_date_to_ts,
      messageType            : model.message_type,
      targetCountNotLess     : model.target_count_not_less
    }
  }

  mapMessageMasterByShopFieldFromApi(model){
    return {
      message_master_id   : model.messageMasterId,
      country_code        : model.countryCode,
      solution_id         : model.solutionId,
      shop_id             : model.shopId,
      message_type        : model.messageType,
      sender_phone        : model.senderPhone,
      target_date_ts      : model.targetDateTS,
      target_date_country : model.targetDateCountry,
      contents            : model.contents,
      image_path          : model.imagePath,
      image_name          : model.imageName,
      target_count        : model.targetCount,
      send_count          : model.sendCount,
      send_fail_count     : model.sendFailCount,
      result_fail_count   : model.resultFailCount,
      result_succ_count   : model.resultSuccCount,
      wait_count          : model.waitCount,
      variable_data       : model.variableData,
      source_type         : model.sourceType
    }
  }

  mapMessageDetailFieldFromApi(model){
    return {
      message_detail_id   : model.messageDetailId,
      country_code        : model.countryCode,
      shop_id             : model.shopId,
      message_type        : model.messageType,
      message_status      : model.messageStatus,
      target_date_ts      : model.targetDateTS,
      target_date_coutnry : model.targetDateCountry,        
      receiver_phone      : model.receiverPhone,        
      contents            : model.contents,        
      image_path          : model.imagePath,        
      image_name          : model.imageName,        
      receiver_key        : model.receiverKey,        
      var1                : model.var1,        
      var2                : model.var2,        
      var3                : model.var3,        
      var4                : model.var4,        
      var5                : model.var5,        
      var6                : model.var6,        
      var7                : model.var7,        
      var8                : model.var8,        
      source_type         : model.sourceType,        
      source_key          : model.sourceKey,
      send_status_code    : model.sendStatusCode,
      result_code         : model.resultCode,
      delete_status       : model.deleteStatus,
      message_master_id   : model.messageMasterId,        
      sender_phone        : model.senderPhone,
      sender_key          : model.senderKey,
      registration_date   : model.registrationDate,
      modification_Date   : model.modificationDate,
      send_type           : model.sendType
    }
  }

  async getMessageDetailsByReceiverAsync(query) {
    let query_map = this.mapMessageDetailByReceiverFieldToApi(query)

    try {
      const response = await this.http.post(url_message_detail_by_receiver, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let mapData = {
          items: [],
          pagination: {}
        }
        for(let item in response.data.result.items){
          mapData.items.push(this.mapMessageDetailFieldFromApi(response.data.result.items[item]))
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

  async getMessageMastersByShopAsync(query) {
    let query_map = this.mapMessageMasterByShopFieldToApi(query)
    query_map.pageSize = query.page_size
    query_map.pageNumber = query.page_number

    try {
      const response = await this.http.post(url_message_master_by_shop, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let mapData = {
          items: [],
          pagination: {}
        }
        for(let item in response.data.result.items){
          mapData.items.push(this.mapMessageMasterByShopFieldFromApi(response.data.result.items[item]))
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

  async getMessageDetailsByMasterAsync(query) {
    let query_map = mapPagingToApi(query)
    query_map.countryCode = query.country_code
    query_map.messageMasterId = query.message_master_id
    query_map.shopId = query.shop_id

    try {
      const response = await this.http.post(url_message_detail_by_master, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let mapData = {
          items: [],
          pagination: {}
        }
        for(let item in response.data.result.items){
          mapData.items.push(this.mapMessageDetailFieldFromApi(response.data.result.items[item]))
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

  async createTextMessageAsync(data) {
    let data_send = this.mapCreateFieldToApi(data)

    try {
      const response = await this.http.post(url_create, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
  
      if(response.data.isOK)
        this.result.data = this.mapCreateFieldFromApi(response.data.result)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async deleteTextMessagesAsync(data) {
    let data_send = this.mapDeleteListFieldToApi(data)

    try {
      const response = await this.http.delete(url_delete_list, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getImageUrl(query){
    const response = await this.http.get(url_image + `?ImagePath=${query.image_path}&ImageName=${query.image_name}`)
    const blob = new Blob([response.data])
    return window.URL.createObjectURL(blob)
  }
}