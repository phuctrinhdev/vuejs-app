import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { options }       from '../../helpers/options'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'
import { mapPagingToApi, mapPagingFromApi } from '../../helpers/common' 

const url_read_base    = getServiceUrl(SERVICE_TYPES.MESSAGES.TEXT_SAMPLE_READ, 1) // Read API URL, Version

let url_read = url_read_base + SERVICE_EXTEND_TYPES.TEXT_SAMPLE
let url_list = url_read + SERVICE_EXTEND_TYPES.LIST

export default class TextSampleApi {
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }
  mapFieldFromApi(model){
    return {
      id                    : model.textSampleId,
      country_code          : model.countryCode,
      text_sample_group_id  : model.textSampleGroupId,
      message_type          : model.messageType,
      contents              : model.contents,
      image_path            : model.imagePath,
      image_name            : model.imageName,
    }
  }

  mapPagingFromApi(paging){
    let total_page = 1 
    if(paging && paging.totalItems > 0){ 
      total_page = Math.ceil(paging.totalItems/paging.pageSize)
    }
    else {
      paging = {
        pageNumber: 1,
        pageSize: options.pagination.default, 
        totalItems: options.pagination.zero,
      }
    }
    return {
      page_number : paging.pageNumber,
      page_size   : paging.pageSize,
      total_items : paging.totalItems,
      total_pages : total_page,
    }
  }

  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK

    if(response.data.isOK)       
      this.result.data = this.mapFieldFromApi(response.data.result)      
  }

  async getTextSamplesAsync(query) {
    try {
      let query_map = mapPagingToApi(query)
      query_map.countryCode = query.country_code
      query_map.solutionId = query.solution_id
      query_map.textSampleGroupId = query.text_sample_group_id
      query_map.messageType = query.message_type
      query_map.groupCode = query.group_code

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
}