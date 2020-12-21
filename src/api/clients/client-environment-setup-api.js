import Http                             from '../../helpers/http'
import { getServiceUrl }                from '../../helpers/api-url-generator'
import { SERVICE_TYPES } from '../../config/constant'

const url_read = getServiceUrl(SERVICE_TYPES.CLIENTS.CLIENT_ENVIRONMENT_SETUP_READ, 1) // Read API URL, Version
const url_command = getServiceUrl(SERVICE_TYPES.CLIENTS.CLIENT_ENVIRONMENT_SETUP_CMD, 1) // Command API URL, Version

const map_field ='mapFieldFromApi'
const map_all_field = 'mapAllFieldFromApi'

export default class ClientEnvironmentSetupApi {
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }

  mapAllFieldFromApi(model){
    return {
      client_search_condition : model.clientSearchCondition,
      contact_info_to_manager : model.contactInfoToManager,
      contact_info_to_staff   : model.contactInfoToStaff,      
      allow_edit_client       : model.allowEditClient,
      allow_delete_client     : model.allowDeleteClient,
      member_number_setup     : model.memberNumberSetup,
    }
  }

  mapFieldFromApi(model){
    return {
      client_search_condition : model.clientSearchCondition,
      contact_info_to_manager : model.contactInfoToManager,
      contact_info_to_staff   : model.contactInfoToStaff,      
      allow_edit_client       : model.allowEditClient,
      allow_delete_client     : model.allowDeleteClient,
      shop_id                 : model.shopId

    }
  }

  setResult(response, mapType){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK
    
    if(mapType == map_field) {
      if(response.data.isOK) this.result.data = this.mapFieldFromApi(response.data.result)
    }
    else if(mapType == map_all_field) {
      if(response.data.isOK) this.result.data = this.mapAllFieldFromApi(response.data.result)
    }
  }

  async getClientEnvironmentSetupsAsync(shop_id) {
    let send_data = {
      shopId: shop_id
    }
    try {
      const response = await this.http.post(url_read, send_data)
      this.setResult(response,'mapAllFieldFromApi')
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateEnvironmentSetupAsync(data) {
    let send_data = {
      shopId: data.shop_id,
      value: data.value,
      setupType: data.setup_type
    }
    try {
      const response = await this.http.put(url_command, send_data)
      this.setResult(response, 'mapFieldFromApi')
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}