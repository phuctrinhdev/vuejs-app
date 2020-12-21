import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES } from '../../config/constant'

const url_read    = getServiceUrl(SERVICE_TYPES.BOARDS.FILE_ATTACHMENT_READ, 1) // Read API URL, Version

let url_download = url_read + '/Download'

export default class FileAttachmentApi {
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
      countryCode      : model.country_code,
      fileAttachmentId : model.file_attachment_id,
      relatedType      : model.related_type,
      relatedId        : model.related_id,
    }
  }

  async getFileAttachmentAsync(query) {
    let data_send = this.mapFieldToApi(query)
    
    try {
      const response = await this.http.donwload(url_download, data_send)
      const blob = new Blob([response.data])
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = query.name
      link.click()
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}