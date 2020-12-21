import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'

const url_read = getServiceUrl(SERVICE_TYPES.ADMIN_SALES.MISC_CODE_READ, 1)
let url_bank_account_list = url_read + SERVICE_EXTEND_TYPES.LIST

export default class MiscCodeApi {
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
      countryCode : 'KR',
      miscCodeType: model.misc_code_type,
      status: model.status
    }
  }

  mapFieldFromApi(model){
    return {
      misc_code_type     : model.miscCodeType,
      is_admin_only      : model.isAdminOnly,
      id                 : model.setupId,
      country_code       : model.countryCode,
      status             : model.status,
      code_name          : model.codeName,
      order_no           : model.orderNo
    }
  }

  async getMiscCodeBankAccountAsync(query) {
    let data_send = this.mapFieldToApi(query)

    try {
      const response = await this.http.post(url_bank_account_list, data_send)
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