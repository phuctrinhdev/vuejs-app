import Http              from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES } from '../../config/constant'
import { mapPagingFromApi }    from '../../helpers/common'
import StockHistoryViewModel       from '../../view-model/inventory/stock-history/stock-history-view-model'
// import { convertDateToTimeStamp } from '../../helpers/common'

const url_read = getServiceUrl(SERVICE_TYPES.STOCK_HISTORY_READ, 1)

export default class StockHistoryApi {
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

  async getStockHistorysAsync(query){
    let params = {
      dateFromTS  : query.date_from_ts,
      dateToTS    : query.date_to_ts,
      action      : query.action,
      keywords    : query.key_word,
      productCode : query.product_code,
      pageSize    : query.page_size,
      pageNumber  : query.page_number,
      shopId      : query.shop_id
    }
    
    try{
      let response = await this.http.post(url_read, params)
      this.setResult(response,()=>{
        let items = []
        for(let tmp_item of response.data.result.items){
          let model = new StockHistoryViewModel()
          model.mapFieldsFromApi(tmp_item)
          items.push(model)
        }
        this.result.data = {
          items       : items,
          pagination  : mapPagingFromApi(response.data.result.pagingInfo)
        }
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }
}
