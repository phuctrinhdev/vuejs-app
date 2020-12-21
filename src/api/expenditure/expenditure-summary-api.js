// import ServicesBaseAPI         from '../services-base-api'
import Http              from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES } from '../../config/constant'
import ExpenditureSummaryItemViewModel from '../../view-model/expenditure/expenditure-summary-item-view-model'

const url_read = getServiceUrl(SERVICE_TYPES.EXPENDITURE_READ, 1)

let url_read_summary = url_read + '/Summary'

export default class ExpenditureSummaryApi {
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

  async getExpenditureSummaryAsync(query){
    let params = {
      dateFromTS: query.from_date_ts,
      dateToTS  : query.to_date_ts,
      shopId    : query.shop_id
    }
    try{
      let response = await this.http.post(url_read_summary, params)
      this.setResult(response,()=>{
        let tmp_items = []
        for(let item of response.data.result){
          let tmp_item = new ExpenditureSummaryItemViewModel()
          tmp_item.mapFieldsFromApi(item)
          tmp_items.push(tmp_item.getFields())
        }
        this.result.data = tmp_items
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }
}
