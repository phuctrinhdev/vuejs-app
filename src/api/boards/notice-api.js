import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'
import { mapPagingToApi, mapPagingFromApi, mapFileFromApi } from '../../helpers/common' 

const url_read    = getServiceUrl(SERVICE_TYPES.BOARDS.NOTICE_READ, 1) // Read API URL, Version
const url_command = getServiceUrl(SERVICE_TYPES.BOARDS.NOTICE_CMD, 1) // Command API URL, Version

let url_list       = url_read + SERVICE_EXTEND_TYPES.LIST
let url_read_count = url_command + SERVICE_EXTEND_TYPES.READ_COUNT

export default class NoticeAPI {
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }

  mapCreateFieldToApi(model, form_data){
    form_data.append('countryCode', model.country_code)
    form_data.append('shopId', model.shop_id)
    if(model.chain_id)
      form_data.append('chainId', model.chain_id)
    form_data.append('solutionId', model.solution_id)
    form_data.append('boardCode', model.board_code)
    form_data.append('postOnTop', model.post_on_top)
    form_data.append('title', model.title)
    form_data.append('contents', model.contents)
    form_data.append('masterOnlyReading', model.master_only_reading)
  
    if(model.files){
      model.files.forEach(e => {
        form_data.append('formFiles', e.file)  
      })
    }
  }

  mapUpdateFieldToApi(model, form_data){
    form_data.append('noticeId', model.id)
    form_data.append('postOnTop', model.post_on_top)
    form_data.append('title', model.title)
    form_data.append('contents', model.contents)
    form_data.append('masterOnlyReading', model.master_only_reading)
  
    if(model.files){
      model.files.forEach(e => {
        if(e.file_attachment_id > 0)
          form_data.append('ExistFileAttachmentIds', e.file_attachment_id)  
        else
          form_data.append('formFiles', e.file)  
      })
    }
  }

  mapFieldFromApi(model){
    return {
      id                    : model.noticeId,
      country_code          : model.countryCode,
      board_code            : model.boardCode,
      solution_id           : model.solutionId,
      chain_id              : model.chainId,
      registration_date     : model.registrationDate,
      read_count            : model.readCount,    
      post_on_top           : model.postOnTop,
      solution_ids          : model.solutionIds,
      business_type_codes   : model.businessTypeCodes,
      title                 : model.title,
      contents              : model.contents,
      master_only_reading   : model.masterOnlyReading,
      shop_id               : model.shopId,
      created_by_user_name  : model.createdByUserName,
      created_by_user_id    : model.createdByUserID,
      created_by_user_role    : model.createdByUserRole,
      file_attachment_count : model.fileAttachmentCount
    }
  }

  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK

    if(response.data.isOK)
      this.result.data = this.mapFieldFromApi(response.data.result)
  }

  async getNoticeAsync(query) {
    let data_send = {
      noticeId    : query.notice_id,
      countryCode : query.country_code,
    }
    
    try {
      const response = await this.http.post(url_read, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
  
      if(response.data.isOK){
        this.result.data = this.mapFieldFromApi(response.data.result)
        if(this.result.data.file_attachment_count > 0)
        {
          let files = []
          for(let item in response.data.result.fileAttachments){
            files.push(mapFileFromApi(response.data.result.fileAttachments[item]))
          }
          this.result.data.files = files
        }
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getNoticesAsync(query) {
    let query_map = mapPagingToApi(query)

    query_map.boardCode = query.board_code
    query_map.countryCode = query.country_code
    query_map.solutionId = query.solution_id
    query_map.businessTypeCode = query.business_type_code
    query_map.searchType = query.search_type
    query_map.contents = query.contents
    query_map.chainId = query.chain_id

    try {
      const response = await this.http.post(url_list, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let mapData = {
          items: [],
          post_on_top_items: [],
          pagination: {}
        }
        for(let item in response.data.result.items){
          mapData.items.push(this.mapFieldFromApi(response.data.result.items[item]))
        }
        for(let item in response.data.result.postOnTopItems){
          mapData.post_on_top_items.push(this.mapFieldFromApi(response.data.result.postOnTopItems[item]))
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

  async createNoticeAsync(data) {
    let data_send = new FormData()
    this.mapCreateFieldToApi(data, data_send)
    
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

  async updateNoticeAsync(data) {
    let data_send = new FormData()
    this.mapUpdateFieldToApi(data, data_send)

    try {
      const response = await this.http.put(url_command, data_send)
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

  async updateNoticeReadCountAsync(data) {
    let data_send = {
      noticeId : data
    }

    try {
      const response = await this.http.post(url_read_count, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async deleteNoticeAsync(data) {
    let data_send = {
      noticeId : data
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