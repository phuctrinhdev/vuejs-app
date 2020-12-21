import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES } from '../../config/constant'

const url_read    = getServiceUrl(SERVICE_TYPES.BOARDS.BOARD_MANAGEMENT_READ, 1) // Read API URL, Version

export default class BoardManagementApi {
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
      id                        : model.boardManagementId,
      board_code                : model.boardCode,
      board_group_type          : model.boardGroupType,
      solution_id               : model.solutionId,
      chain_id                  : model.chainId,
      allow_file_attachment     : model.allowFileAttachment,
      allow_master_only_reading : model.allowMasterOnlyReading,
      display_read_count        : model.displayReadCount,
      country_code              : model.countryCode,
      registration_date         : model.registrationDate,
      status                    : model.status
    }
  }

  async getBoardManagementAsync(query) {
    let data_send = {
      boardCode   : query.board_code,
      countryCode : query.country_code,
      status      : query.status
    }
    
    try {
      const response = await this.http.post(url_read, data_send)
      this.result.action = query.action
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
  
      if(response.data.isOK)
        this.result.data = this.mapFieldFromApi(response.data.result)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}