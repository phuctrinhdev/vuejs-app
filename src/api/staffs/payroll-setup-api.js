// import ServicesBaseAPI         from '../services-base-api'
import Http              from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES } from '../../config/constant'
import PayrollSetupViewModel from '../../view-model/staffs/payroll-setup-view-model'

const url_read= getServiceUrl(SERVICE_TYPES.STAFF_PAYROLL_READ, 1) // Read API URL, Version
const url_cmd = getServiceUrl(SERVICE_TYPES.STAFF_PAYROLL_CMD, 1) // Command API URL, Version

let url_read_payroll_setup    = url_read + '/PayrollSetup'
let url_cmd_payroll_setup     = url_cmd  + '/PayrollSetup'

export default class PayrollSetupApi {
  constructor() {
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }

  setResult(response, handleMapFieldsFromAPI) {
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK
    if (response.data.isOK) {
      handleMapFieldsFromAPI()
    }
  }

  async getPayrollSetupAsync(shop_id){
    let params = {
      shopId: shop_id
    }
    try{
      let response = await this.http.post(url_read_payroll_setup, params)
      this.setResult(response,()=>{
        let tmp_item = new PayrollSetupViewModel()
        tmp_item.mapFieldsFromApi(response.data.result)
        this.result.data = tmp_item.getFields()
      })
    }
    catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async updatePayrollSetupAsync(payroll_setup){
    try{
      let model    = payroll_setup.mapFieldsToApi()
      let response = await this.http.post(url_cmd_payroll_setup, model)
      this.setResult(response,()=>{
        let tmp_model = new PayrollSetupViewModel()
        tmp_model.mapFieldsFromApi(response.data.result)
        this.result.data = tmp_model.getFields()
      })
    }
    catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }
}