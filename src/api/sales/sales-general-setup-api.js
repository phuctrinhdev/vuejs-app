import ServicesBaseAPI                         from '../services-base-api'
import { getServiceUrl }                       from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'
import SalesGeneralSetupViewModel              from '../../view-model/sales/sales-general-setup-view-model'

const url_command           = getServiceUrl(SERVICE_TYPES.SALES_SETUP_CMD, 1)
const url_cmd_general_setup = url_command + SERVICE_EXTEND_TYPES.GENERAL

export default class SalesGeneralSetupAPI extends ServicesBaseAPI {
  constructor() {
    super()
  }

  async addOrUpdateSalesGeneralSetupAsync(model) {
    let data_send = model.mapFieldsToApi()
    try {
      let response = await (model.fields.id > 0 
        ? this.http.put(url_cmd_general_setup, data_send) 
        : this.http.post(url_cmd_general_setup, data_send))
      this.setResult(response, () => {
        let general_setup = new SalesGeneralSetupViewModel()
        general_setup.mapFieldsFromApi(response.data.result)
        this.result.data = general_setup
      })
    }
    catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }
}