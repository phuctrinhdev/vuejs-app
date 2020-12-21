import ServicesBaseAPI         from '../services-base-api'
import PrepaidCardViewModel    from '../../view-model/sales/prepaid-card/prepaid-card-view-model'
import { getServiceUrl }       from '../../helpers/api-url-generator'
import { SERVICE_TYPES }       from '../../config/constant'

const url_cmd = getServiceUrl(SERVICE_TYPES.SALES_BALANCE_MOVE_CMD, 1)

let url_cmd_add    = url_cmd
let url_cmd_delete = url_cmd + '/DeleteBalanceMoveByHistoryId'

export default class BalanceMoveAPI extends ServicesBaseAPI{
  constructor(){
    super()
  }

  async addBalanceMoveAsync(add_balance_move){
    try{
      let model    = add_balance_move.mapFieldsToApi()
      let response = await this.http.post(url_cmd_add, model)
      this.setResult(response,()=>{
        let prepaid_cards = []
        for(let item of response.data.result.clientPrepaidCards){
          let prepaid_card = new PrepaidCardViewModel()
          prepaid_card.mapFieldsFromApi(item)
          prepaid_cards.push(prepaid_card)
        }
        this.result.data = prepaid_cards
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async deleteBalanceMoveByHistoryIdAsync(model){
    let params = {
      historyId   : model.history_id,
      clientId    : model.client_id,
      sessionToken: model.session_token,
      shopLocation: model.shop_location,
      shopId      : model.shop_id
    }
    try{
      let response = await this.http.delete(url_cmd_delete, params)
      this.setResult(response,()=>{
        this.result.data = response.data.result
      })
    }
    catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }
}