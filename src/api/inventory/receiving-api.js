import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES } from '../../config/constant'

import ServicesBaseAPI         from '../services-base-api'
import { mapPagingFromApi }    from '../../helpers/common'
import ReceivingViewModel      from '../../view-model/inventory/receivings/receiving-view-model.js'
import ReceivingItemViewModel  from '../../view-model/inventory/receivings/receiving-item-view-model.js'

// TODO :  The urls will be configs after api deployed.
const url_cmd  = getServiceUrl(SERVICE_TYPES.RECEIVING_CMD,1)
const url_read = getServiceUrl(SERVICE_TYPES.RECEIVING_READ,1)
const url_read_goods = getServiceUrl(SERVICE_TYPES.GOODS_AGGR,1)

const url_read_products  = url_read_goods + '/Product'
const url_read_list      = url_read + '/list'
const url_read_detail    = url_read + '/detail'
const url_cmd_items      = url_cmd + '/Items'
const url_cmd_items_add_list = url_cmd_items + '/AddList'


export default class ReceivingApi extends ServicesBaseAPI{
  constructor(){
    super()
  }

  async updateReceivingItemAsync(receiving_item_vm){
    try{
      let model    = receiving_item_vm.mapFieldsToUpdateReceivingItemApi()
      let response = await this.http.put(url_cmd_items,model)
      this.setResult(response,()=>{
        let tmp_receiving_vm = new ReceivingViewModel()
        tmp_receiving_vm.mapFieldsFromApi(response.data.result)
        this.result.data = tmp_receiving_vm
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }
  async updateReceivingAsync(receiving_vm){
    try{
      let model    = receiving_vm.mapFieldsToUpdateReceivingApi()
      let response = await this.http.put(url_cmd,model)
      this.setResult(response,()=>{
        receiving_vm.mapFieldsFromUpdateReceivingApi(response.data.result)
        this.result.data = receiving_vm
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }


  async addReceivingAsync(receiving_vm){
    try{
      let model    = receiving_vm.mapFieldsToAddReceivingApi()
      let response = await this.http.post(url_cmd,model)
      this.setResult(response,()=>{
        let tmp_receiving_vm = new ReceivingViewModel()
        tmp_receiving_vm.mapFieldsFromApi(response.data.result)
        this.result.data = tmp_receiving_vm
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }
  async addReceivingItemsAsync(receiving_vm){
    try{
      let model    = receiving_vm.mapFieldsToAddReceivingItemsApi()
      let response = await this.http.post(url_cmd_items_add_list,model)
      this.setResult(response,()=>{
        let tmp_receiving_vm = new ReceivingViewModel()
        tmp_receiving_vm.mapFieldsFromApi(response.data.result)
        this.result.data = tmp_receiving_vm
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }


  async deleteReceivingAsync(query){
    let params = {
      receivingId: query.receiving_id,
      userId   : query.user_id,
      username : query.user_name,
      shopId   : query.shop_id
    }
    try{
      let response      = await this.http.delete(url_cmd,params)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }
  async deleteReceivingItemAsync(query){
    let params = {
      shopId      : query.shop_id,
      receivingId : query.receiving_id,
      userId      : query.user_id,
      username    : query.user_name,
      receivingItemId : query.receiving_item_id
    }
    try{
      let response = await this.http.delete(url_cmd_items,params)
      this.setResult(response,()=>{
        let tmp_receiving_vm = new ReceivingViewModel()
        tmp_receiving_vm.mapFieldsFromApi(response.data.result)
        this.result.data = tmp_receiving_vm
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }


  async getReceivingsAsync(query){
    let params = {
      supplierId : query.supplier_id,
      dateFromTS : query.date_from_ts,
      dateToTS   : query.date_to_ts,
      keywords   : query.keywords,
      pageSize   : query.page_size,
      pageNumber : query.page_number,
      shopId     : query.shop_id
    }
    try{
      let response = await this.http.post(url_read_list,params)
      this.setResult(response,()=>{
        let receivings = []
        for(let item of response.data.result.items){
          let receiving_vm = new ReceivingViewModel()
          receiving_vm.mapFieldsFromApi(item)
          receivings.push(receiving_vm)
        }
        this.result.data = {
          items             : receivings,
          pagination        : mapPagingFromApi(response.data.result.pagingInfo),
          receiving_summary : {
            total_quantity: response.data.result.receivingSummary.totalQty,
            total_amount  : response.data.result.receivingSummary.totalAmount
          }
        }
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }
  async getReceivingDetailAsync(query){
    let params = {
      id     : query.id,
      shopId : query.shop_id
    }
    try{
      let response = await this.http.post(url_read_detail,params)
      this.setResult(response,()=>{
        let tmp_receiving_vm = new ReceivingViewModel()
        tmp_receiving_vm.mapFieldsFromApi(response.data.result)
        this.result.data = tmp_receiving_vm
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }
  async getProductsAsync(query){
    let params = {
      productCategoryId : query.product_category_id,
      keyWord           : query.key_word,
      usageStatus       : query.usage_status,
      pageSize          : query.page_size,
      pageNumber        : query.page_number,
      shopId            : query.shop_id,
      status            : query.status
    }
    try{
      let response = await this.http.post(url_read_products,params)
      this.setResult(response,()=>{
        let receiving_items_vm = []
        for(let item of response.data.result.items){
          let receiving_item_vm = new ReceivingItemViewModel()
          receiving_item_vm.mapFieldsFromApi(item)
          receiving_items_vm.push(receiving_item_vm)
        }
        this.result.data = {
          items      : receiving_items_vm,
          pagination : mapPagingFromApi(response.data.result.pagingInfo)
        }
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }
}
