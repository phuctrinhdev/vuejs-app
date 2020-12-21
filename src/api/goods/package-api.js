import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'
import { mapPagingToApi, mapPagingFromApi  } from '../../helpers/common' 

const url_read    = getServiceUrl(SERVICE_TYPES.PACKAGE_READ, 1)
const url_command = getServiceUrl(SERVICE_TYPES.PACKAGE_CMD, 1)
let url_change_order_no = url_command + SERVICE_EXTEND_TYPES.CHANGE_ORDER_NO
 
export default class PackageApi {  
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }
  mapFieldToApi(model){
    let package_item = []
    for(let index in model.items){ 
      package_item.push(this.mapPackageItemToApi(model.items[index]))
    }  
    return { 
      packageName      : model.name,
      totalAmount      : model.total_amount,
      items            : package_item, 
      shopId           : model.shop_id,
      status           : model.status 
    }
  }
  mapFieldFromApi(model){
    return {
      id               : model.packageId,
      name             : model.packageName, 
      total_amount     : model.totalAmount,
      order_no         : model.orderNo,
      items            : (model.items), 
      shop_id          : model.shopId,
      status           : model.status ,
      shared           : model.shared,
      own_shopId       : model.ownShopId  
    }
  }
  mapPackageItemToApi(model){
    return {
      packageItemId  : model.id, 
      goodsId        : model.goods_id,
      itemType       : model.item_type, 
      price          : model.price ,  
    }
  }
  mapFieldFromApiPackageItem(model){
    return {
      id           : model.packageItemId, 
      goods_id     : model.goodsId,
      item_type    : model.itemType, 
      price        : model.price,
      package_id   : model.packageId ,
      package_name : model.packageName,
      own_shop_id  : model.ownShopId 
    }
  }
 
  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK 
    if(response.data.isOK)  this.result.data= this.mapFieldFromApi(response.data.result) 
    return this.result
  }
  async getPackagesAsync(query) {
    let query_map = mapPagingToApi(query)  
    try {
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
  async getPackageAsync(id, query) {
    let url_send = url_read + '/' + id
    let data_send = {
      shopId: query.shop_id,
      status: query.status
    }
    try {
      const response = await this.http.post(url_send, data_send)
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async addPackageAsync(data) {
    let data_send = this.mapFieldToApi(data)
    data_send.packageId = data.id
    try {
      const response = await this.http.post(url_command, data_send)
      this.setResult(response)
      if(response.isOK) this.result.data.registration_date = response.data.result.registrationDate
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async updatePackageAsync(data) {
    let data_send = this.mapFieldToApi(data) 
    data_send.packageId = data.id
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
  
  async deletePackageAsync(data) {
    let data_send = this.mapFieldToApi(data)
    data_send.packageId = data.id
    try {
      const response = await this.http.delete(url_command, data_send)
      this.setResult(response)
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  
  async updatePackageOrderNoAsync(data) {
    let data_send = {
      shopId        : data.shop_id,
      oldPositionId : data.old_position_id,
      newPositionId : data.new_position_id
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

