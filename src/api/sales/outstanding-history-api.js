import ServicesBaseAPI             from '../services-base-api.js'
import OutstandingHistoryViewModel from '../../view-model/sales/outstanding/outstanding-history-view-model.js'
import { mapPagingFromApi }        from '../../helpers/common'
import { getServiceUrl }           from '../../helpers/api-url-generator'
import { SERVICE_TYPES }           from '../../config/constant'

const url_read  = getServiceUrl(SERVICE_TYPES.SALES_OUTSTANDING_HISTORY_READ,1)

export default class OutstandingHistoryApi extends ServicesBaseAPI{
  constructor(){
    super()
  }

  async getOutstandingHistoriesAsync(query){
    let params = {
      clientId  : query.client_id,
      fromDateTS: query.from_date.value,
      toDateTS  : query.to_date.value,
      keyword   : query.keyword,
      outstandingHistoryType: query.outstanding_history_type,
      pageSize  : query.page_size,
      pageNumber: query.page_number,
      shopId    : query.shop_id
    }
    try{
      let response = await this.http.post(url_read,params)
      this.setResult(response,()=>{
        let outstanding_histories = []
        for(let item of response.data.result.items){
          let outstanding_history = new OutstandingHistoryViewModel()
          outstanding_history.mapFieldsFromApi(item)
          outstanding_histories.push(outstanding_history.getFields())
        }
        this.result.data = {
          items      : outstanding_histories,
          pagination : mapPagingFromApi(response.data.result.pagingInfo)
        }
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }
}
