import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES  } from '../../config/constant' // SERVICE_EXTEND_TYPES
import RecommendationPointSetupViewModel from '../../view-model/sales/recommendation-point-setup-view-model'

const url_cmd  = getServiceUrl(SERVICE_TYPES.RECOMMENDATION_POINT_SETUP_CMD, 1)
const url_read = getServiceUrl(SERVICE_TYPES.RECOMMENDATION_POINT_SETUP_READ, 1)

let url_cmd_recommendation_setup  = url_cmd
let url_read_recommendation_setup = url_read + '/GetByShopId/Live'

export default class RecommendationPointSetupApi { 
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }
  
  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK

    if(response.data.isOK) {
      let recommendation_setup_vm = new RecommendationPointSetupViewModel()
      recommendation_setup_vm.mapFieldFromApi(response.data.result)
      this.result.data = recommendation_setup_vm.getFields()
    }
  }
  async getRecommendationPointSetupAsync(shop_id) {
    try {
      let send_data = {
        shopId: shop_id
      }
      const response = await this.http.post(url_read_recommendation_setup, send_data)
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async addOrUpdateRecommendationPointSetupAsync(recommendation_setup_vm) {
    let data_send = recommendation_setup_vm.mapFieldToApi()
    try {
      let response = null
      if(recommendation_setup_vm.fields.recommendation_point_setup_id == 0)
        response = await this.http.post(url_cmd_recommendation_setup, data_send)
      else 
        response = await this.http.put(url_cmd_recommendation_setup, data_send)
      this.setResult(response)
    }
    catch(e) {
      this.http.loadError(e)
    }
    return this.result
  }
}