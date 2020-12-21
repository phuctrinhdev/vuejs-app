import ServicesBaseAPI                           from '../services-base-api.js'
import BalancePointsEditHistoryViewModel         from '../../view-model/sales/balance-points-edit-history/balance-points-edit-history.js'
import { mapPagingFromApi }                      from '../../helpers/common'
import { getServiceUrl }                         from '../../helpers/api-url-generator'
import { SERVICE_TYPES,SERVICE_EXTEND_TYPES }    from '../../config/constant'
const url_read = getServiceUrl(SERVICE_TYPES.SALES_CLIENT_HISTORY_READ,1) + SERVICE_EXTEND_TYPES.BALANCE_POINT_EDIT_HISTORIES_LIVE


export default class BalancePointsEditHistoryApi extends ServicesBaseAPI{
  constructor(){
    super()
  }

  async getBalancePointEditHistoriesAsync(query){
    let params = {
      fromDateTS     : query.from_date.value,
      toDateTS       : query.to_date.value,
      searchType     : query.edited_item_type,
      createdById    : query.user_id,
      pageSize       : query.page_size,
      pageNumber     : query.page_number,
      shopId         : query.shop_id,
      clientId       : query.client_id
    }
    try{
      let response = await this.http.post(url_read,params)
      this.setResult(response,()=>{
        let balance_points_edit_histories = []
        for(let item of response.data.result.items){
          let balance_points_edit_history = new BalancePointsEditHistoryViewModel()
          balance_points_edit_history.mapFieldsFromApi(item)
          balance_points_edit_histories.push(balance_points_edit_history.getFields())
        }
        this.result.data = {
          items      : balance_points_edit_histories,
          pagination : mapPagingFromApi(response.data.result.pagingInfo)
        }
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }
}
