import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES } from '../../config/constant'
import PaymentBankTransferViewModel from '../../view-model/account/payment-bank-transfer-view-model'

const url_bank_transfer_notice_command = getServiceUrl(SERVICE_TYPES.ADMIN_SALES.BANK_TRANSFER_NOTICE_CMD, 1)


export default class PaymentApi {  
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }
  
  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK

    if(response.data.isOK){
      let bank_transfer_vm = new PaymentBankTransferViewModel()
      this.result.data = bank_transfer_vm.mapFieldFromApi(response.data.result)
    }
  }

  async createBankTransferNoticeAsync(bank_transfer_vm) {
    let data_send = bank_transfer_vm.mapFieldToApi()
    try {
      const response = await this.http.post(url_bank_transfer_notice_command, data_send)
      this.setResult(response)
      if(this.result.is_ok) {
        this.result.data.registration_date = response.data.result.registrationDate
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}

