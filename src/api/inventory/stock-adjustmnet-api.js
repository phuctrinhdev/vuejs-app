import Http              from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES } from '../../config/constant'
// import { mapPagingFromApi }    from '../../helpers/common'
// import StockAdjustmentViewModel from '../../view-model/inventory/stock-adjustment/stock-adjustment-view-model'
// import { convertDateToTimeStamp } from '../../helpers/common'

const url_cmd = getServiceUrl(SERVICE_TYPES.STOCK_STATUS_CMD, 1)

let url_cmd_adjust = url_cmd + '/Adjust'

export default class StockAdjustmentApi {
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

  async addStockAdjustmentAsync(stock_adjustment_vm){
    try{
      let send_data= stock_adjustment_vm.mapFieldsToApi()
      let response = await this.http.post(url_cmd_adjust, send_data)
      this.setResult(response,()=>{
        this.result.data = response.data.result
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }
}
