import ServicesBaseAPI                                          from '../services-base-api'
import { getServiceUrl }                                        from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES }                  from '../../config/constant'
import DataProtectionAndSecurityViewModel                       from '../../view-model/sales/data-protection-and-security-view-model'

const url_command                      = getServiceUrl(SERVICE_TYPES.SALES_SETUP_CMD, 1)
const url_cmd_data_protection_security = url_command + SERVICE_EXTEND_TYPES.DATA_PROTECTION_AND_SECURITY

export default class DataProtectionAndSecurityAPI extends ServicesBaseAPI {
  constructor() {
    super()
  }

  async addOrUpdateDataProtectionAndSecurityAsync(model) {
    let params = model.mapFieldsToApi()
    try {
      let response = model.fields.id > 0 ? await this.http.put(url_cmd_data_protection_security, params) : await this.http.post(url_cmd_data_protection_security, params)
      this.setResult(response, () => {
        let data_protection_and_security = new DataProtectionAndSecurityViewModel()
        data_protection_and_security.mapFieldsFromApi(response.data.result)
        this.result.data = data_protection_and_security
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }
}