import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'
import ShopViewModel from '../../view-model/account/shop-info-view-model'

const url_command = getServiceUrl(SERVICE_TYPES.ADMINS.SHOP_CMD, 1) // Command API URL, Version
const url_read = getServiceUrl(SERVICE_TYPES.ADMINS.SHOP_READ, 1)

let url_command_contact = url_command + SERVICE_EXTEND_TYPES.CONTACT
let url_read_basic = url_read + SERVICE_EXTEND_TYPES.BASIC
let url_shop_name = url_read + SERVICE_EXTEND_TYPES.SHOP_NAME_LIST
let url_shop_monthly_fee = url_read + SERVICE_EXTEND_TYPES.MONTHLY_FEE

export default class ShopInfoApi {  
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }
  mapShopNameFieldFromApi(model){
    return{
      shop_name : model.shopName,
      shop_id   : model.shopId

    }
  }
  mapFieldFromMonthlyFeeApi(model){
    return{
      shop_id                   : model.shopId,
      month_6DC_rate            : model.month6DCRate,
      month_12DC_rate           : model.month12DCRate,
      fee_truncate              : model.feeTruncate,
      billing_type              : model.billingType,
      shop_solution_amount      : model.shopSolutionAmount,
      shop_total_extra_amount   : model.shopTotalExtraAmount,
      shop_discount_amount      : model.shopDiscountAmount,
      auto_transfer             : model.autoTransfer
    }
  }
  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK

    if(response.data.isOK){
      let shop_vm = new ShopViewModel()
      this.result.data = shop_vm.mapFieldFromApi(response.data.result)
    }
  }
  
  async getShopInfoAsync(query) {
    let query_map = {
      shopId: query.shop_id
    }
    if(query.shop_id == null)
      query_map.shopId = 0
    try {
      const response = await this.http.post(url_read_basic, query_map)
      this.result.action = query.action
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }  

  async updateShopInfoAsync(shop_vm) {
    let data_send = shop_vm.mapFieldToApi()
    try {
      const response = await this.http.put(url_command_contact, data_send)
      this.setResult(response)
      if(this.result.is_ok) {
        this.result.data.modification_date = response.data.result.modificationDate
        delete this.result.data.registration_date
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getShopNames(query) {
    let query_map = {
      shopIds: query
    }
    try {
      const response = await this.http.post(url_shop_name, query_map)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
  
      if(this.result.is_ok) {
        let mapData = {
          items: [],
        }
        for(let item in response.data.result.items){
          mapData.items.push(this.mapShopNameFieldFromApi(response.data.result.items[item]))
        }
        this.result.data = mapData
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getShopMonthlyFeeAsync(query) {
    let query_map = {
      shopId: query
    }

    try {
      const response = await this.http.post(url_shop_monthly_fee, query_map)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
      if(response.data.isOK) this.result.data = this.mapFieldFromMonthlyFeeApi(response.data.result)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}

