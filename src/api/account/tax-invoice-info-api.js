import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES } from '../../config/constant'
import TaxInvoiceInfoViewModel from '../../view-model/account/tax-invoice-info-view-model'

const url_command = getServiceUrl(SERVICE_TYPES.ADMINS.TAX_INVOICE_INFO_CMD, 1) // Command API URL, Version
const url_read = getServiceUrl(SERVICE_TYPES.ADMINS.TAX_INVOICE_INFO_READ, 1)

export default class TaxInvoiceInfoApi {  
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
    if(response.data.isOK) {
      let vm = new TaxInvoiceInfoViewModel()
      this.result.data = vm.mapFieldFromApi(response.data.result)
    }
  }

  async getTaxInvoiceInfoAsync(query) {    
    let data_send = {
      shopId: query.shop_id
    }
    try {
      const response = await this.http.post(url_read, data_send)
      this.result.action = query.action
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async createTaxInvoiceInfoAsync(tax_vm) {
    let data_send = tax_vm.mapFieldToApi()
    try {
      const response = await this.http.post(url_command, data_send)
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

  async updateTaxInvoiceInfoAsync(tax_vm) {
    let data_send = tax_vm.mapFieldToApi()
    try {
      const response = await this.http.put(url_command, data_send)
      this.setResult(response)
      if(this.result.is_ok) {
        this.result.data.modification_date = response.data.result.modificationDate
        delete this.result.data.registration_date
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }  
}

