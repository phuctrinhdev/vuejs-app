import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { mapPagingFromApi  } from '../../helpers/common' 
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'

const url_read    = getServiceUrl(SERVICE_TYPES.PRODUCT_READ, 1)
const url_command = getServiceUrl(SERVICE_TYPES.PRODUCT_CMD, 1)

let url_aggr_product = getServiceUrl(SERVICE_TYPES.GOODS_AGGR,1) + '/Product'
let url_aggr_product_total_valuation = url_aggr_product + '/TotalValuation'
let url_update_status = url_command + SERVICE_EXTEND_TYPES.UPDATE_STATUS


export default class ProductApi {
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
      productId           : model.id,
      productCode         : model.code,
      productName         : model.name,
      productCategoryId   : model.product_category_id,
      productCategoryName : model.product_category_name,
      barCode             : model.bar_code,
      specification       : model.specification,
      retailPrice         : model.retail_price,
      supplierPrice       : model.supplier_price,
      usageStatus         : model.usage,
      notes               : model.notes,
      status              : model.status,
      stockSafety         : model.stock_safety,
      stockOnHand         : model.stock_on_hand,
      shared              : model.shared,
      shopId              : model.shop_id,
    }
  }
  mapFieldFromApi(model){
    return {
      id                      : model.productId,
      code                    : model.productCode,
      name                    : model.productName,
      product_category_id     : model.productCategoryId,
      product_category_name   : model.productCategoryName,
      bar_code                : model.barCode,
      specification           : model.specification,
      retail_price            : model.retailPrice,
      supplier_price          : model.supplierPrice,
      usage                   : model.usageStatus,
      notes                   : model.notes,
      status                  : model.status,
      stock_safety            : model.stockSafety,
      stock_on_hand           : model.stockOnHand,
      shared                  : model.shared,
      shop_id                 : model.shopId,
      own_shop_id             : model.ownShopId 
    }
  }
  mapParamToApi(query){
    return {
      productCategoryId : query.product_category_id,
      keyWord           : query.key_word,
      usageStatus       : query.usage_status,
      pageSize          : query.page_size,
      pageNumber        : query.page_number,
      shopId            : query.shop_id,
      status            : query.status,
    }
  } 
  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK

    if(response.data.isOK) this.result.data = this.mapFieldFromApi(response.data.result)
    return this.result
  }
  async getProductsAsync(query) {
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
        mapData.pagination = mapPagingFromApi(response.data.result.pagingInfo)
        this.result.data = mapData
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async getProductsWithStockAsync(query) {
    query = this.mapParamToApi(query)
    try {
      const response = await this.http.post(url_aggr_product, query)
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
  async getProductsWithStockAndTotalValuationAsync(query) {
    query = this.mapParamToApi(query)
    try {
      const response = await this.http.post(url_aggr_product_total_valuation, query)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)

      if(this.result.is_ok) {
        if(response.data.result != null){
          this.result.data = {
            total_qty      : response.data.result.totalQty,
            total_valuation: response.data.result.totalValuation,
          }
        }
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async addProductAsync(data) {
    let data_send = this.mapFieldToApi(data)
    data_send.shared = data.shared

    try {
      const response = await this.http.post(url_command, data_send)
      this.setResult(response)
      if(response.data.isOK) this.result.data.registration_date = response.data.result.registrationDate
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async updateProductAsync(data) {
    let data_send = this.mapFieldToApi(data)

    try {
      const response = await this.http.put(url_command, data_send)
      this.setResult(response)
      if(response.isOK) this.result.data.modification_date = response.data.result.modificationDate
    }
    catch(e) { 
      this.http.loadError(e)
    }
    return this.result
  }
  async updateProductStatusAsync(data) {
    let data_send = {
      productIds: data.product_ids,
      status    : data.status,
      shopId    : data.shop_id
    }
    
    try {
      const response = await this.http.post(url_update_status, data_send)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    }
    catch(e) { 
      this.http.loadError(e)
    }
    return this.result
  }
}
