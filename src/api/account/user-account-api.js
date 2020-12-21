import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'
import { mapPagingToApi } from '../../helpers/common' 

const url_command = getServiceUrl(SERVICE_TYPES.IDENTITIES.USER_ACCOUNT_CMD, 1)  // Command API URL, Version
const url_read    = getServiceUrl(SERVICE_TYPES.IDENTITIES.USER_ACCOUNT_READ, 1) // Read API URL, Version
const url_aggr    = getServiceUrl(SERVICE_TYPES.USER_ACCOUNT_AGGR, 1)            //aggregator API URL, Version

let url_get_list        = url_aggr + SERVICE_EXTEND_TYPES.SALON + SERVICE_EXTEND_TYPES.GET_LIST
let url_change_password = url_command + SERVICE_EXTEND_TYPES.CHANGE_PASSWORD

export default class UserAccountApi {
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
      userAccountId : model.id,
      countryCode   : model.country,
      solutionId    : model.solution_id,
      shopId        : model.shop_id,
      userID        : model.user_id,
      password      : model.password,
      status        : model.status,
      userRoleCode  : model.user_role_code,
      language      : model.language,
      staffId       : model.staff_id
    }
  }

  mapListFieldFromApi(model){
    return {
      id                  : model.userAccountId,
      user_id             : model.userID,
      staff_id            : model.staffId,
      staff_name          : model.staffName,
      user_role_code      : model.userRoleCode,
      user_role_name      : model.userRoleName,
      status              : model.status
    }
  }

  mapFieldFromApi(model){
    return {
      id             : model.userAccountId,
      user_id        : model.userID,
      user_role_code : model.userRoleCode,
      user_role_name : model.userRoleName,
      staff_id       : model.staffId,
      language       : model.language,
      status         : model.status,
      name           : model.name
    }
  }

  async getSalonUserAccountsAsync(query) {
    let data_send = mapPagingToApi(query)
    data_send.shopId = query.shop_id
    data_send.userID = ''
    data_send.isMaster = false

    try {
      const response = await this.http.post(url_get_list, data_send)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let mapData = {
          items: []
        }
        for(let item in response.data.result.items){
          mapData.items.push(this.mapListFieldFromApi(response.data.result.items[item]))
        }
        this.result.data = mapData
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getSalonUserAccountAsync(query) {
    let data_send = {
      userAccountId: query.id,
      shopId: query.shop_id,
      status: query.status
    }

    try {
      const response = await this.http.post(url_read, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
  
      if(response.data.isOK){
        this.result.action = query.action
        this.result.data = this.mapFieldFromApi(response.data.result) 
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async createSalonUserAccountAsync(data) {
    let data_send = this.mapFieldToApi(data)

    try {
      const response = await this.http.post(url_command, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
  
      // if(response.data.isOK){ // must-reload
      //   this.result.data = this.mapListFieldFromApi(response.data.result) 
      // }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateSalonUserAccountAsync(data) {
    let data_send = this.mapFieldToApi(data)

    try {
      const response = await this.http.put(url_command, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
  
      // if(response.data.isOK){ // must-reload
      //   this.result.data = this.mapListFieldFromApi(response.data.result) 
      // }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updatePasswordAsync(data) {
    let data_send = {
      userAccountId: data.id,
      password: data.password,
      shopId: data.shop_id,
      userID: data.user_id 
    }
    
    try {
      const response = await this.http.put(url_change_password, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}