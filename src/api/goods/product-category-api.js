import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'

const url_read    = getServiceUrl(SERVICE_TYPES.PRODUCT_CATEGORY_READ, 1)
const url_command = getServiceUrl(SERVICE_TYPES.PRODUCT_CATEGORY_CMD, 1)

let url_change_order_no = url_command + SERVICE_EXTEND_TYPES.CHANGE_ORDER_NO

export default class ProductCategoryApi {
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
      productCategoryId   : model.id,
      productCategoryName : model.name,
      orderNo             : model.order_no,
      status              : model.status,
      shared              : model.shared,
      shopId              : model.shop_id,
    }
  }
  mapFieldFromApi(model){
    return {
      id           : model.productCategoryId,
      name         : model.productCategoryName,
      order_no     : model.orderNo,
      status       : model.status,
      shared       : model.shared,
      shop_id      : model.shopId,
      own_shop_id  : model.ownShopId 
    }
  }
  mapParamToApi(query){
    return {
      pageSize: query.page_size,
      pageNumber: query.page_number,
      shopId: query.shop_id,
      status: query.status
    }
  }
  mapParamFromApi(pagination){
    return {
      page_number : pagination.pageNumber,
      page_size   : pagination.pageSize,
      total_items : pagination.totalItems,
    }
  }
  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK

    if(response.data.isOK) this.result.data = this.mapFieldFromApi(response.data.result)
    return this.result
  }

  async getProductCategoriesAsync(query) {
    query = this.mapParamToApi(query)

    try {
      const response = await this.http.post(url_read, query)
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
        mapData.pagination = this.mapParamFromApi(response.data.result.pagingInfo)
        this.result.data = mapData
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async addProductCategoryAsync(data) {
    let data_send = this.mapFieldToApi(data)
    data_send.shared = data.shared

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

  async updateProductCategoryAsync(data) {
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

  async updateProductCategoryOrderNoAsync(data) {
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

  async deleteProductCategoryAsync(data) {
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
}