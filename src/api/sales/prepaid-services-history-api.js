import ServicesBaseAPI                from '../services-base-api'
import { mapPagingFromApi }           from '../../helpers/common'
import PrepaidServiceHistoryViewModel from '../../view-model/sales/prepaid-service/prepaid-service-history-view-model'
import { getServiceUrl }              from '../../helpers/api-url-generator'
import { SERVICE_TYPES }              from '../../config/constant'
const url_read = getServiceUrl(SERVICE_TYPES.SALES_CLIENT_PREPAID_SERVICE_HISTORY_READ,1)

export default class PrepaidServiceHistoryAPI extends ServicesBaseAPI{
  constructor(){
    super()
  }
  async getPrepaidServiceHistoriesAsync(query){
    let params = {
      clientId             : query.client_id,
      pageSize             : query.page_size,
      pageNumber           : query.page_number,
      shopId               : query.shop_id
    }
    try{
      let response = await this.http.post(url_read,params)
      this.setResult(response,()=>{
        let prepaid_service_histories = []
        for(let item of response.data.result.items){
          let prepaid_service_history = new PrepaidServiceHistoryViewModel()
          prepaid_service_history.mapFieldsFromApi(item)
          prepaid_service_histories.push(prepaid_service_history.getFields())
        }
        this.result.data = {
          items : prepaid_service_histories,
          pagination : mapPagingFromApi(response.data.result.pagingInfo)
        }
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }
}