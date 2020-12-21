import ServicesBaseAPI                        from '../services-base-api'
import ClientAfterOutstandingChangedViewModel from '../../view-model/sales/outstanding/client-after-outstanding-changed-view-model.js'
import OutstandingDeleteViewModel             from '../../view-model/sales/outstanding/outstanding-delete-view-model'
import { getServiceUrl }                      from '../../helpers/api-url-generator'
import { SERVICE_TYPES }                      from '../../config/constant'
const url_cmd = getServiceUrl(SERVICE_TYPES.SALES_OUTSTANDING_PAYMENT_CMD,1)

export default class OutstandingPaymentAPI extends ServicesBaseAPI{
  constructor(){
    super()
  }

  async addOutstandingPaymentAsync(outstanding_payment){
    try{
      let model    = outstanding_payment.mapFieldsToApi()
      let response = await this.http.post(url_cmd,model)
      this.setResult(response,()=>{
        let client = new ClientAfterOutstandingChangedViewModel()
        client.mapFieldsFromApi(response.data.result)
        this.result.data = client
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async updateOutstandingPaymentAsync(outstanding_edit){
    try{
      let model    = outstanding_edit.mapFieldsToApi()
      let response = await this.http.put(url_cmd,model)
      this.setResult(response,()=>{
        let client = new ClientAfterOutstandingChangedViewModel()
        client.mapFieldsFromApi(response.data.result)
        this.result.data = client
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async deleteOutstandingPaymentAsync(outstanding_delete_vm) {
    let data_send = outstanding_delete_vm.mapFieldsToApi()
    try {
      const response = await this.http.delete(url_cmd, data_send)

      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK

      if(this.result.is_ok){
        let outstanding_delete_vm = new OutstandingDeleteViewModel()
        outstanding_delete_vm.mapFieldsFromApi(response.data.result)
        this.result.data = outstanding_delete_vm.getFields()
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}
