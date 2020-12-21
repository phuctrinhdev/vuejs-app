// import ServicesBaseAPI                         from '../services-base-api.js'
import Http from '../../helpers/http'
import ClientAccountViewModel                  from '../../view-model/sales/outstanding/client-account-view-model.js'
import { mapPagingFromApi }                    from '../../helpers/common'
import { getServiceUrl }                       from '../../helpers/api-url-generator.js'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from  '../../config/constant'

const url_read = getServiceUrl(SERVICE_TYPES.SALES_CLIENT_ACCOUNT_READ,1)

let url_read_client_account     = url_read + SERVICE_EXTEND_TYPES.CLIENT_ACCOUNT_LIVE
let url_read_client_oustandings = url_read + SERVICE_EXTEND_TYPES.CLIENT_OUTSTANDINGS_LIVE

export default class SalesClientAccountApi {
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

  async getClientAccountAsync(query){
    let params = {
      clientId  : query.client_id,
      shopId    : query.shop_id
    }
    try{
      let response = await this.http.post(url_read_client_account, params)
      this.setResult(response,()=>{
        let client_account_vm = new ClientAccountViewModel()
        client_account_vm.mapFieldsFromApi(response.data.result)
        this.result.data = client_account_vm.getFields()
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async getClientOutstandingsAsync(query){
    let params = {
      balanceBiggerThan: query.min_outstanding_balance,
      keyword          : query.keyword,
      pageSize         : query.page_size,
      pageNumber       : query.page_number,
      shopId           : query.shop_id
    }
    try{
      let response = await this.http.post(url_read_client_oustandings, params)
      this.setResult(response,()=>{
        let client_accounts = []
        for (let item of response.data.result.items){
          let client_account = new ClientAccountViewModel()
          client_account.mapFieldsFromApi(item)
          client_accounts.push(client_account.getFields())
        }
        this.result.data = {
          total_client  : response.data.result.totalClients,
          total_amount  : response.data.result.totalAmount,
          pagination    : mapPagingFromApi(response.data.result.pagingInfo),
          items         : client_accounts,
        }
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }
}