import Http              from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES } from '../../config/constant'
import { mapPagingFromApi }    from '../../helpers/common'
import StockInternalUseViewModel       from '../../view-model/inventory/stock-internal-use/stock-internal-use-view-model'
// import { convertDateToTimeStamp } from '../../helpers/common'

const url_cmd  = getServiceUrl(SERVICE_TYPES.STOCK_INTERNAL_USE_CMD, 1)
const url_read = getServiceUrl(SERVICE_TYPES.STOCK_INTERNAL_USE_READ, 1)

export default class StockInternalUseApi {
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

  async getStockInternalUsesAsync(query){
    let params = {
      staffId   : query.staff_id,
      categoryId: query.category_id,
      dateFromTS: query.date_from_ts,
      dateToTS  : query.date_to_ts,
      keywords  : query.key_words,
      pageSize  : query.page_size,
      pageNumber: query.page_number,
      shopId    : query.shop_id,
    }
    
    try{
      let response = await this.http.post(url_read, params)
      this.setResult(response,()=>{
        let items = []
        for(let tmp_item of response.data.result.items){
          let stock_internal_use_vm = new StockInternalUseViewModel()
          stock_internal_use_vm.mapFieldsFromApi(tmp_item)
          items.push(stock_internal_use_vm)
        }
        this.result.data = {
          total_amount: response.data.result.summaryInfo.totalAmount,
          items       : items,
          pagination  : mapPagingFromApi(response.data.result.pagingInfo)
        }
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async addStockInternalUseAsync(stock_internal_use_vm){
    try{
      let send_data= stock_internal_use_vm.mapFieldsToApi()
      let response = await this.http.post(url_cmd, send_data)
      this.setResult(response,()=>{
        let model = new StockInternalUseViewModel()
        model.mapFieldsFromApi(response.data.result)
        this.result.data = model
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async updateStockInternalUseAsync(stock_internal_use_vm){
    try{
      let send_data= stock_internal_use_vm.mapFieldsToApi()
      let response = await this.http.put(url_cmd, send_data)
      this.setResult(response,()=>{
        let model = new StockInternalUseViewModel()
        model.mapFieldsFromApi(response.data.result)
        this.result.data = model
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async deleteStockInternalUseAsync(stock_internal_use_vm){
    try{
      let send_data= stock_internal_use_vm.mapFieldsToApi()
      let response = await this.http.delete(url_cmd, send_data)
      this.setResult(response,()=>{
        let model = new StockInternalUseViewModel()
        model.mapFieldsFromApi(response.data.result)
        this.result.data = model
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }
}
