import ServicesBaseAPI      from '../services-base-api'
import SalesPrepaidCardViewModel from '../../view-model/sales/prepaid-card/prepaid-card-view-model'
import { mapPagingFromApi } from '../../helpers/common'
import { getServiceUrl }    from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES }    from '../../config/constant'
const url_read = getServiceUrl(SERVICE_TYPES.SALES_CLIENT_PREPAID_CARD_READ, 1)
const url_cmd  = getServiceUrl(SERVICE_TYPES.SALES_CLIENT_PREPAID_CARD_CMD, 1)

let url_read_live = url_read + SERVICE_EXTEND_TYPES.CLIENT_PREPAID_CARDS_LIVE

export default class PrepaidCardsAPI extends ServicesBaseAPI {
  constructor() {
    super()
  }
  async getPrepaidCardsAsync(query){
    let params = {
      clientId          : query.client_id,
      includeExpiredCard: query.include_expired_card,
      includeFamilyCard : query.include_family_card,
      prepaidCardType   : query.prepaid_card_type,
      pageSize          : query.page_size,
      pageNumber        : query.page_number,
      shopId            : query.shop_id
    }
    try {
      let response = await this.http.post(url_read_live,params)
      this.setResult(response, () => {
        let prepaid_cards = []
        for (let item of response.data.result.items) {
          let prepaid_card = new SalesPrepaidCardViewModel()
          prepaid_card.mapFieldsFromApi(item)
          prepaid_cards.push(prepaid_card.getFields())
        }
        this.result.data = {
          items: prepaid_cards,
          pagination: mapPagingFromApi(response.data.result.pagingInfo)
        }
      })
    } catch (ex) {
      return this.http.loadError(ex)
    }
    return this.result
  }

  async updatePrepaidCardAsync(update_prepaid_card){
    try{
      let model = update_prepaid_card.mapFieldsToApi()
      let response = await this.http.put(url_cmd,model)
      this.setResult(response,()=>{
        let prepaid_card = new SalesPrepaidCardViewModel()
        prepaid_card.mapFieldsFromApi(response.data.result)
        this.result.data = prepaid_card
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }
}