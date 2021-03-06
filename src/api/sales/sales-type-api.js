import Http               from '../../helpers/http'
import SalesTypeViewModel from '../../view-model/sales/sales-type-view-model'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES} from '../../config/constant'
import { mapPagingFromApi  } from '../../helpers/common'

const url_read = getServiceUrl(SERVICE_TYPES.SALES_SETUP_READ, 1)
const url_cmd  = getServiceUrl(SERVICE_TYPES.SALES_SETUP_CMD, 1)

let url_read_sales_type_live = url_read    + SERVICE_EXTEND_TYPES.SALES_TYPE_LIVE
let url_cmd_sales_type       = url_cmd     + SERVICE_EXTEND_TYPES.SALES_TYPE
let url_cmd_change_order_no  = url_cmd_sales_type + SERVICE_EXTEND_TYPES.CHANGE_ORDER_NO


export default class SalesTypeApi { 
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
      let sales_type_vm = new SalesTypeViewModel()
      sales_type_vm.mapFieldsFromApi(response.data.result)
      this.result.data = sales_type_vm.getFields()
    }
  }

  async getSalesTypesAsync(query) {
    let data_send = {
      shopId: query.shop_id,
      status: query.status,
      pageSize: query.page_size,
      pageNumber: query.page_number
    }
    try {
      const response = await this.http.post(url_read_sales_type_live, data_send)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      
      if(this.result.is_ok) {
        let map_data = {
          items: [],
          pagination: {}
        }
        for(let i in response.data.result.items){
          let sales_type_vm = new SalesTypeViewModel()
          sales_type_vm.mapFieldsFromApi(response.data.result.items[i])
          map_data.items.push(sales_type_vm.getFields())
        }
        map_data.pagination = mapPagingFromApi(response.data.result.pagingInfo)
        this.result.data = map_data
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async addSalesTypeAsync(sales_type_vm) {
    let data_send = sales_type_vm.mapFieldsToApi()

    try {
      const response = await this.http.post(url_cmd_sales_type, data_send)
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async updateSalesTypeAsync(sales_type_vm) {
    let data_send = sales_type_vm.mapFieldsToApi()

    try {
      const response = await this.http.put(url_cmd_sales_type, data_send)
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async updateSalesTypeOrderNoAsync(data) {
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