import Http                   from '../../helpers/http'
import PaymentMethodViewModel from '../../view-model/sales/payment-method-view-model'

import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'
import { mapPagingFromApi  } from '../../helpers/common'

const url_read = getServiceUrl(SERVICE_TYPES.SALES_SETUP_READ, 1)
const url_cmd = getServiceUrl(SERVICE_TYPES.SALES_SETUP_CMD, 1)

let url_read_payment_method_live   = url_read + SERVICE_EXTEND_TYPES.PAYMENT_METHOD_LIVE
let url_cmd_payment_method         = url_cmd  + SERVICE_EXTEND_TYPES.PAYMENT_METHOD
let url_cmd_change_order_no        = url_cmd_payment_method + SERVICE_EXTEND_TYPES.CHANGE_ORDER_NO


export default class PaymentMethodApi { 
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }
  // using for single result like add/update
  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK 
    if(response.data.isOK) {
      let payment_method_vm = new PaymentMethodViewModel()
      payment_method_vm.mapFieldsFromApi(response.data.result)
      this.result.data = payment_method_vm.getFields()
    }
  }

  async getPaymentMethodsAsync(query) {
    let data_send = {
      shopId: query.shop_id,
      status: query.status,
      pageSize: query.page_size,
      pageNumber: query.page_number
    }
    try {
      const response = await this.http.post(url_read_payment_method_live, data_send)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      
      if(this.result.is_ok) {
        let mapData = {
          items: [],
          pagination: {}
        }
        for(let i in response.data.result.items){
          let payment_method_vm = new PaymentMethodViewModel()
          payment_method_vm.mapFieldsFromApi(response.data.result.items[i])
          mapData.items.push(payment_method_vm.getFields())
        }
        mapData.pagination = mapPagingFromApi(response.data.result.pagingInfo)
        this.result.data = mapData
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async addPaymentMethodAsync(payment_method_vm) {
    let data_send = payment_method_vm.mapFieldsToApi()
    
    try {
      const response = await this.http.post(url_cmd_payment_method, data_send)
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async updatePaymentMethodAsync(payment_method_vm) {
    let data_send = payment_method_vm.mapFieldsToApi()
    
    try {
      const response = await this.http.put(url_cmd_payment_method, data_send)
      this.setResult(response)
    }
    catch(e) { 
      this.http.loadError(e)
    }
    return this.result
  }
  async updatePaymentMethodOrderNoAsync(data) {
    let data_send = {
      'shopId'        : data.shop_id,
      'oldPositionId' : data.old_position_id,
      'newPositionId' : data.new_position_id
    }
    
    try {
      const response = await this.http.put(url_cmd_change_order_no, data_send)
      this.setResult(response)
    }
    catch(e) { 
      this.http.loadError(e)
    }
    return this.result
  }
}