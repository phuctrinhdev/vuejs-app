import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'
import { mapPagingToApi, mapPagingFromApi, mapFileFromApi } from '../../helpers/common' 

const url_read = getServiceUrl(SERVICE_TYPES.BOARDS.MANUAL_MANAGEMENT_READ, 1) // Read API URL, Version

let url_list = url_read + SERVICE_EXTEND_TYPES.LIST

export default class ManualManagementAPI {
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }

  mapFieldFromApi(model){
    let storage_file_name = null
    if(model.listImage != undefined)
      storage_file_name = model.listImage[0].storageFileName
    return {
      id                 : model.manualManagementId, 
      country_code       : model.countryCode, 
      solution_id        : model.solutionId, 
      business_type_code : model.businessTypeCode, 
      manual_type        : model.manualType,
      title              : model.title,
      file_url           : model.fileURL,
      order_no           : model.orderNo,
      registration_date  : model.registrationDate,
      modification_date  : model.modificationDate,
      storage_file_name  : storage_file_name
    }
  }

  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK

    if(response.data.isOK)
      this.result.data = this.mapFieldFromApi(response.data.result)
  }

  async getManualManagementAsync(query) {
    let data_send = {
      manualManagementId : query.manual_management_id,
      countryCode        : query.country_code,
    }
    
    try {
      const response = await this.http.post(url_read, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
  
      if(response.data.isOK){
        this.result.data = this.mapFieldFromApi(response.data.result)
        let content_images = []

        for (let index = 0; index < response.data.result.fileAttachments.length; index++) {
          if(index == 0) 
            this.result.data.list_image = mapFileFromApi(response.data.result.fileAttachments[index])
          else{
            let new_file_attachment = mapFileFromApi(response.data.result.fileAttachments[index])
            content_images.push(new_file_attachment)
          }
        }
        this.result.data.content_images = content_images
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getManualManagementsAsync(query) {
    let query_map = mapPagingToApi(query)
    query_map.countryCode = query.country_code
    query_map.solutionId = query.solution_id
    query_map.businessTypeCode = query.business_type_code
    query_map.manualType = query.manual_type
    
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