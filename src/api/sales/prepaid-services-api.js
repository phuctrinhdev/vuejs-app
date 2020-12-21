import ServicesBaseAPI         from '../services-base-api'
import { mapPagingFromApi }    from '../../helpers/common'
import PrepaidServiceViewModel from '../../view-model/sales/prepaid-service/prepaid-service-view-model'
import { getServiceUrl }       from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES }       from '../../config/constant'

const url_read  = getServiceUrl(SERVICE_TYPES.SALES_CLIENT_PREPAID_SERVICE_READ,1)
const url_cmd   = getServiceUrl(SERVICE_TYPES.SALES_CLIENT_PREPAID_SERVICE_CMD,1)

let url_read_live = url_read + SERVICE_EXTEND_TYPES.CLIENT_PREPAID_SERVICES_LIVE


export default class ClientPrepaidServicesApi extends ServicesBaseAPI{
  constructor(){
    super()
  }

  async getPrepaidServicesAsync(query){
    let params = {
      clientId             : query.client_id,
      includeExpired       : query.show_expired,
      includeFamilyService : query.include_family_service,
      pageSize             : query.page_size,
      pageNumber           : query.page_number,
      shopId               : query.shop_id
    }
    try{
      let response = await this.http.post(url_read_live,params)
      this.setResult(response,()=>{
        let prepaid_services = []
        for(let item of response.data.result.items){
          let prepaid_service = new PrepaidServiceViewModel()
          prepaid_service.mapFieldsFromApi(item)
          prepaid_services.push(prepaid_service.getFields())
        }
        this.result.data = { 
          items : prepaid_services,
          pagination : mapPagingFromApi(response.data.result.pagingInfo)
        }
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async updatePrepaidServicesAsync(prepaid_service){
    try{
      let model    = prepaid_service.mapFieldsToApi()
      let response = await this.http.put(url_cmd,model)
      this.setResult(response,()=>{
        let prepaid_service = new PrepaidServiceViewModel()
        prepaid_service.mapFieldsFromApi(response.data.result)
        this.result.data = prepaid_service
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }
}