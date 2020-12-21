import ServicesBaseAPI      from '../services-base-api'
import PrepaidCardsHistory  from '../../view-model/sales/prepaid-card/prepaid-card-history-view-model'
import { mapPagingFromApi } from '../../helpers/common'
import { getServiceUrl }    from '../../helpers/api-url-generator'
import { SERVICE_TYPES }    from '../../config/constant'
const url = getServiceUrl(SERVICE_TYPES.SALES_CLIENT_PREPAID_CARD_HISTORY_READ,1)

export default class PrepaidCardsHistoryAPI extends ServicesBaseAPI {
  constructor() {
    super()
  }
  async getPrepaidCardsHistoriesAsync(query) {
    let params = {
      shopId    : query.shop_id,
      pageSize  : query.page_size,
      pageNumber: query.page_number,
      clientId  : query.client_id
    }
    try {
      let response = await this.http.post(url,params)
      this.setResult(response, () => {
        let prepaid_cards_histories = []
        for (let item of response.data.result.items) {
          let prepaid_cards_history = new PrepaidCardsHistory()
          prepaid_cards_history.mapFieldsFromApi(item)
          prepaid_cards_histories.push(prepaid_cards_history.getFields())
        }
        this.result.data = {
          items: prepaid_cards_histories,
          pagination: mapPagingFromApi(response.data.result.pagingInfo)
        }
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }
}