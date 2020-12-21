// import ServicesBaseAPI         from '../services-base-api'
import Http              from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES } from '../../config/constant'
// import { mapPagingFromApi }    from '../../helpers/common'
// import SupplierViewModel       from '../../view-model/inventory/supplier/supplier-view-model.js'

const url_read = getServiceUrl(SERVICE_TYPES.STOCK_STATUS_READ, 1)
const url_cmd  = getServiceUrl(SERVICE_TYPES.STOCK_STATUS_CMD, 1)

let url_read_product_with_stock_status = url_read + '/GetAllByProductId'
let url_cmd_stock_decrease = url_cmd + '/DecreaseStock'
let url_cmd_stock_safety   = url_cmd + '/SafetyStock'

export default class SupplierApi {
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

  async getProductWithStockStatusAsync(query){
    let send_data = {
      productIds: query.product_ids,
      shopId: query.shop_id
    }
    try{
      let response = await this.http.post(url_read_product_with_stock_status, send_data)
      this.setResult(response,()=>{
        this.result.data = {
          product_id    : response.data.result[0].productId,
          stock_on_hand : response.data.result[0].stockOnHand,
          stock_safety  : response.data.result[0].stockSafety,
        }
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async addStockDecreaseAsync(stock_decrease_vm){
    try{
      let model    = stock_decrease_vm.mapFieldsToApi()
      let response = await this.http.post(url_cmd_stock_decrease, model)
      this.setResult(response,()=>{
        this.result.data = response.data.result
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async updateSafetyStockAsync(stock_safety_vm){
    try{
      let model    = stock_safety_vm.mapFieldsToApi()
      let response = await this.http.put(url_cmd_stock_safety, model)
      this.setResult(response,()=>{
        this.result.data = response.data.result
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }
}
