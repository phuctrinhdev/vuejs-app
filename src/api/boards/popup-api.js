import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'
import { mapPagingToApi, mapPagingFromApi, mapFileFromApi } from '../../helpers/common' 

const url_read    = getServiceUrl(SERVICE_TYPES.BOARDS.POPUP_READ, 1) // Read API URL, Version

let url_list = url_read + SERVICE_EXTEND_TYPES.LIST

export default class POPUpAPI {
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
      id                   : model.popUpId, 
      country_code         : model.countryCode, 
      popup_type           : model.popUpType, 
      title                : model.title, 
      start_date_ts        : model.startDateTS,
      end_date_ts          : model.endDateTS,
      solution_ids         : model.solutionIds,
      business_type_codes  : model.businessTypeCodes,
      top                  : model.top, 
      left                 : model.left, 
      width                : model.width, 
      height               : model.height, 
      contents             : model.contents, 
      link_url             : model.linkURL,
      link_target          : model.linkTarget,
      never_see_period     : model.neverSeePeriod,
      status               : model.status,
      shop_id              : model.shopId,
      chain_id             : model.chainId,
      created_by_user_id   : model.createdByUserID,
      created_by_user_name : model.createdByUserName,
      registration_date    : model.registrationDate,
      modification_date    : model.modificationDate,
    }
  }

  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK

    if(response.data.isOK)
      this.result.data = this.mapFieldFromApi(response.data.result)
  }

  async getPOPUpAsync(query) {
    let data_send = {
      pOPUpId     : query.popup_id,
      countryCode : query.country_code,
    }
    
    try {
      const response = await this.http.post(url_read, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
  
      if(response.data.isOK){
        this.result.data = this.mapFieldFromApi(response.data.result)
        if(response.data.result.fileAttachment != null)
          this.result.data.file = mapFileFromApi(response.data.result.fileAttachment)
        else this.result.data.file = null
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getPOPUpsAsync(query) {
    let query_map = mapPagingToApi(query)
    query_map.countryCode = query.country_code
    query_map.businessTypeCode = query.business_type_code
    query_map.solutionId = query.solution_id
    query_map.todayTS = query.today_ts

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
}