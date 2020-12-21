import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'
import { mapPagingToApi, mapPagingFromApi  } from '../../helpers/common' 

const url_read    = getServiceUrl(SERVICE_TYPES.PREPAID_CARD_READ, 1)
const url_command = getServiceUrl(SERVICE_TYPES.PREPAID_CARD_CMD, 1)

let url_change_order_no = url_command + SERVICE_EXTEND_TYPES.CHANGE_ORDER_NO

export default class PrepaidCardApi {
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }

  mapFieldToApi(model){
    return {
      prepaidCardId      : model.id,
      prepaidCardName    : model.name,
      shopId             : model.shop_id,
      status             : model.status,
      price              : model.price,
      chargeAmount       : model.charge_amount,
      salarySalesValue   : Number(model.salary_sales_value),
      salarySalesType    : model.salary_sales_type,
      validity           : model.validity,
      validityType       : model.validity_type,
      prepaidCardType    : model.prepaid_card_type,
      discountForClient  : model.discount_for_client,
      discountForService : model.discount_for_service,
      discountForProduct : model.discount_for_product
    }
  }

  mapFieldFromApi(model){
    return {
      id                   : model.prepaidCardId,
      name                 : model.prepaidCardName,
      shop_id              : model.shopId,
      status               : model.status,
      price                : model.price,
      charge_amount        : model.chargeAmount,
      salary_sales_value   : model.salarySalesValue,
      salary_sales_type    : model.salarySalesType,
      validity             : model.validity,
      validity_type        : model.validityType,
      prepaid_card_type    : model.prepaidCardType,
      discount_for_client  : model.discountForClient,
      discount_for_service : model.discountForService,
      discount_for_product : model.discountForProduct,
      own_shop_id          : model.ownShopId,
      shared               : model.shared
    }
  }

  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK

    if(response.data.isOK) this.result.data = this.mapFieldFromApi(response.data.result)
    return this.result
  }

  async getPrepaidCardsAsync(query) {
    try {
      let query_map=  mapPagingToApi(query)

      const response = await this.http.post(url_read, query_map)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      
      if(this.result.is_ok) {
        let mapData = {
          items: [],
          pagination: {}
        }
        for(let item in response.data.result.items){
          mapData.items.push(this.mapFieldFromApi(response.data.result.items[item]))
        }
        mapData.pagination = mapPagingFromApi(response.data.result.pagingInfo)
        this.result.data = mapData
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async addPrepaidCardAsync(data) {
    let data_send = this.mapFieldToApi(data)

    try {
      const response = await this.http.post(url_command, data_send)
      this.setResult(response)
      if(this.result.is_ok) {
        this.result.data.registration_date = response.data.result.registrationDate
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updatePrepaidCardAsync(data) {
    let data_send = this.mapFieldToApi(data)

    try {
      const response = await this.http.put(url_command, data_send)
      this.setResult(response)
      if(this.result.is_ok) {
        this.result.data.modification_date = response.data.result.modificationDate
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async deletePrepaidCardAsync(data) {
    let data_send = this.mapFieldToApi(data)

    try {
      const response = await this.http.delete(url_command, data_send)
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updatePrepaidCardOrderNoAsync(data) {
    let data_send = {
      'shopId'        : data.shop_id,
      'oldPositionId' : data.old_position_id,
      'newPositionId' : data.new_position_id
    }

    try {
      const response = await this.http.post(url_change_order_no, data_send)
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      this.result.is_ok = response.data.isOK
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}