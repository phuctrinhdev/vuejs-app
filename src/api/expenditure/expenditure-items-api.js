// import ServicesBaseAPI         from '../services-base-api'
import Http              from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES } from '../../config/constant'
import ExpenditureItemViewModel       from '../../view-model/expenditure/expenditure-item-view-model'

const url_read = getServiceUrl(SERVICE_TYPES.EXPENDITURE_READ, 1)
const url_cmd  = getServiceUrl(SERVICE_TYPES.EXPENDITURE_CMD, 1)

let url_read_expenditure_items    = url_read + '/Items'
let url_cmd_items                 = url_cmd  + '/Items'
let url_cmd_items_change_order_no = url_cmd_items + '/ChangeOrderNo'

export default class ExpenditureItemApi {
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

  async getExpenditureItemsAsync(query){
    let params = {
      status   : query.status,
      shopId   : query.shop_id
    }
    try{
      let response = await this.http.post(url_read_expenditure_items, params)
      this.setResult(response,()=>{
        let tmp_items = []
        for(let item of response.data.result){
          let tmp_item = new ExpenditureItemViewModel()
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

  async addExpenditureItemAsync(expenditure_item_vm){
    try{
      let model    = expenditure_item_vm.mapFieldsToApi()
      let response = await this.http.post(url_cmd_items, model)
      this.setResult(response,()=>{
        let tmp_model = new ExpenditureItemViewModel()
        tmp_model.mapFieldsFromApi(response.data.result)
        this.result.data = tmp_model.getFields()
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async updateExpenditureItemAsync(expenditure_item_vm){
    try{
      let model    = expenditure_item_vm.mapFieldsToApi()
      let response = await this.http.put(url_cmd_items, model)
      this.setResult(response,()=>{
        let tmp_model = new ExpenditureItemViewModel()
        tmp_model.mapFieldsFromApi(response.data.result)
        this.result.data = tmp_model.getFields()
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }

  async updateExpenditureItemOrderNoAsync(data) {
    let data_send = {
      'shopId'        : data.shop_id,
      'oldPositionId' : data.old_position_id,
      'newPositionId' : data.new_position_id
    }
    
    try {
      const response = await this.http.post(url_cmd_items_change_order_no, data_send)
      this.setResult(response,()=>{
        this.result.data = response.data.result
      })
    }
    catch(e) {
      this.http.loadError(e)
    }
    return this.result
  }
}
