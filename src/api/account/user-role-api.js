import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'

const url_read = getServiceUrl(SERVICE_TYPES.IDENTITIES.USER_ROLE_READ, 1) // Read API URL, Version

let url_list = url_read + SERVICE_EXTEND_TYPES.LIST

export default class UserRoleApi {
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
      id          : model.userRoleId,
      solution_id : model.solutionId,
      role_code   : model.roleCode,
      role_name   : model.roleName,
      role_level  : model.roleLevel,
      status      : model.status
    }
  }

  async getUserRolesAsync(query) {
    let data_send = {
      solutionId: query.solution_id,
      status: query.status
    }
    
    try {
      const response = await this.http.post(url_list, data_send)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let mapData = {
          items: []
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