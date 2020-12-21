import Http                   from '../../helpers/http'
import LoyaltyPointsSetupsViewModel from '../../view-model/sales/loyalty-points-setups-view-model'
// import { options } from '../../helpers/options'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES,SERVICE_EXTEND_TYPES} from '../../config/constant'

const url_read = getServiceUrl(SERVICE_TYPES.SALES_SETUP_READ, 1)
const url_cmd  = getServiceUrl(SERVICE_TYPES.SALES_SETUP_CMD, 1)

let url_read_loyalty_points = url_read + SERVICE_EXTEND_TYPES.LOYALTY_POINTS_LIVE
let url_cmd_loyalty_points  = url_cmd  + SERVICE_EXTEND_TYPES.LOYALTY_POINTS


export default class LoyaltyPointsSetupsApi { 
  constructor(){
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }
  mapFieldsFromApi(api_data){
    let loyalty_points_setups_vm = new LoyaltyPointsSetupsViewModel()
    loyalty_points_setups_vm.mapFieldsFromApi(api_data)
    return loyalty_points_setups_vm
  }
  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK 
    if(response.data.isOK){
      let tmp_vm = this.mapFieldsFromApi(response.data.result)
      this.result.data = tmp_vm.getFields()
    }
  }

  async getLoyaltyPointsSetupsAsync(shop_id) {
    let query = {
      shopId: shop_id
    }
    try {
      const response = await this.http.post(url_read_loyalty_points, query)
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async updateLoyaltyPointsSetupsAsync(loyalty_points_setups_vm) {
    let send_data = loyalty_points_setups_vm.mapFieldsToApi()

    try {
      let response = await this.http.put(url_cmd_loyalty_points, send_data)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK

      if(response.data.isOK){
        let tmp_vm = this.mapFieldsFromApi(response.data.result.loyaltyPointsSetups)
        this.result.data = tmp_vm.getFields()
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}