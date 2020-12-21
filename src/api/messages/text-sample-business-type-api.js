import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'

const url_read_base    = getServiceUrl(SERVICE_TYPES.MESSAGES.TEXT_SAMPLE_READ, 1) // Read API URL, Version

let url_read = url_read_base + SERVICE_EXTEND_TYPES.TEXT_SAMPLE_BUSINESS_TYPE

let url_list = url_read + SERVICE_EXTEND_TYPES.LIST

export default class TextSampleBusinessTypeApi {
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
      id                   : model.textSampleBusinessTypeId,
      country_code         : model.countryCode,
      solution_id          : model.solutionId,
      business_type_code   : model.businessTypeCode,
      business_type_name   : model.businessTypeName,
      status               : model.status,
      text_sample_group_id : model.textSampleGroupId,
    }
  }
  
  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK

    if(response.data.isOK)
      this.result.data = this.mapFieldFromApi(response.data.result)
  }

  async getTextSampleBusinessTypesAsync(query) {
    try {
      let query_map = {} // mapPagingToApi(query)
      query_map.countryCode = query.country_code
      query_map.solutionId = query.solution_id
      query_map.businessTypeCode = query.business_type_code
      
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
        this.result.data = mapData
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}