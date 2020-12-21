// import ServicesBaseAPI         from '../services-base-api'
import Http              from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES } from '../../config/constant'
import { mapPagingFromApi }    from '../../helpers/common'
import ExpenditureHistoryViewModel       from '../../view-model/expenditure/expenditure-history-view-model'

const url_cmd  = getServiceUrl(SERVICE_TYPES.EXPENDITURE_CMD, 1)
const url_read = getServiceUrl(SERVICE_TYPES.EXPENDITURE_READ, 1)

let url_cmd_history    = url_cmd  + '/History'
let url_read_history   = url_read + '/History'

export default class ExpenditureHistoryApi {
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

  async getExpenditureHistoryAsync(query){
    let params = {
      dateFromTS  : query.from_date_ts,
      dateToTS    : query.to_date_ts,
      itemId      : query.item_id,
      paymentId   : query.payment_id,
      keywords    : query.keywords,
      pageSize    : query.page_size,
      pageNumber  : query.page_number,
      shopId      : query.shop_id
    }
    try{
      let response = await this.http.post(url_read_history, params)
      this.setResult(response,()=>{
        let tmp_items = []
        for(let item of response.data.result.items){
          let tmp_item = new ExpenditureHistoryViewModel()
          tmp_item.mapFieldsFromApi(item)
          tmp_items.push(tmp_item.getFields())
        }
        this.result.data = {
          total_amount: response.data.result.summary.totalAmount,
          items       : tmp_items,
          pagination  : mapPagingFromApi(response.data.result.pagingInfo)
        }
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async addExpenditureHistoryAsync(expenditure_historys){
    try{
      let tmp_items = []
      for(let item of expenditure_historys){
        let tmp_vm = new ExpenditureHistoryViewModel()
        tmp_vm.setFields(item)
        tmp_vm.fields.id = 0
        tmp_items.push(tmp_vm.mapFieldsToApi())
      }
      let send_data = {
        items: tmp_items
      }
      let response = await this.http.post(url_cmd_history, send_data)
      this.setResult(response,()=>{
        this.result.data = response.data.result
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async updateExpenditureHistoryAsync(expenditure_history_vm){
    try{
      let model    = expenditure_history_vm.mapFieldsToApi()
      let response = await this.http.put(url_cmd_history, model)
      this.setResult(response,()=>{
        this.result.data = response.data.result
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async deleteExpenditureHistoryAsync(expenditure_history_vm){
    try {
      let model    = expenditure_history_vm.mapFieldsToApi()
      let response = await this.http.delete(url_cmd_history, model)
      this.setResult(response,()=>{
        this.result.data = response.data.result
      })
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}
