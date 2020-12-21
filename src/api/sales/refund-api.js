import Http             from '../../helpers/http'
import RefundViewModel  from '../../view-model/sales/refund/refund-view-model'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant' // SERVICE_EXTEND_TYPES

const url_read    = getServiceUrl(SERVICE_TYPES.REFUND_READ, 1)
const url_command = getServiceUrl(SERVICE_TYPES.REFUND_CMD, 1)
let url_cmd_refund_notes = url_command + SERVICE_EXTEND_TYPES.SALES_NOTES



export default class SalesApi {
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }
  
  mapParamToApi(query){
    return {
      pageSize: query.page_size,
      pageNumber: query.page_number,
      shopId: query.shop_id,
      status: query.status
    }
  }
  mapParamFromApi(pagination){
    return {
      page_number : pagination.pageNumber,
      page_size   : pagination.pageSize,
      total_items : pagination.totalItems,
    }
  }

  async getRefundAsync(query) {
    let query_map = {
      refundId   : query.refund_id,
      shopId     : query.shop_id
    }
    try {
      const response = await this.http.post(url_read, query_map)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK

      if(this.result.is_ok){
        let refund_vm = new RefundViewModel()
        refund_vm.mapFieldsFromApi(response.data.result)
        this.result.data = refund_vm.getFields()
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async addRefundAsync(tmp_refund_vm) {
    let data_send = tmp_refund_vm.mapFieldsToApi()
    
    try {
      const response = await this.http.post(url_command, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
      if(this.result.is_ok){
        let refund_vm = new RefundViewModel()
        refund_vm.mapFieldsFromApi(response.data.result)
        this.result.data = refund_vm.getFields()
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateRefundNotesAsync(sales_notes){
    let data_send = {
      clientId    : sales_notes.client_id,
      refundId    : sales_notes.refund_id,
      notes       : sales_notes.notes,
      sessionToken: sales_notes.session_token,
      shopLocation: sales_notes.shop_location,
      shopId      : sales_notes.shop_id
    }

    try {
      const response = await this.http.put(url_cmd_refund_notes, data_send)
      
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
      if(this.result.is_ok){
        let sales_notes = {
          client_id     : response.data.result.clientId,
          refund_id     : response.data.result.refundId,
          notes         : response.data.result.notes,
          session_token : response.data.result.sessionToken,
          shop_location : response.data.result.shopLocation,
          shop_id       : response.data.result.shopId,
        }
        this.result.data = sales_notes
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async deleteRefundAsync(refund_delete_vm) {
    let data_send = refund_delete_vm.mapFieldsToApi()
    try {
      const response = await this.http.delete(url_command, data_send)

      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK

      if(this.result.is_ok){
        this.result.data = {}
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}