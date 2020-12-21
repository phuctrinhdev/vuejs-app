import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES  } from '../../config/constant'
import { options } from '../../helpers/options'

const url_read    = getServiceUrl(SERVICE_TYPES.PACKAGE_ITEM_READ, 1) 
 
export default class PackageItemApi {  
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  } 
  mapFieldFromApi(model){
    return {
      id                  : model.packageItemId,
      item_type           : model.itemType,
      goods_category_id   : model.goodsCategoryId,
      goods_category_name : model.goodsCategoryName,
      goods_id            : model.goodsId,
      name                : model.packageItemName, 
      price               : model.price,
      status              : model.status,
      validity            : model.validity,
      validity_type       : model.validityType,
      product_code        : model.productCode,

      // prepaid card
      charge_amount       : model.chargeAmount,
      discount_for_client : model.discountForClient,
      discount_for_service: model.discountForService,
      discount_for_product: model.discountForProduct,
      
      // prepaid service
      quantity            : model.quantity,
      related_service_id  : model.relatedServiceId,

      package_id          : model.packageId ,
      package_name        : model.packageName,
      
      own_shop_id         : model.ownShopId  
    }
  }
  mapParamFromApi( ){
    return {
      page_number : 1,
      page_size   : 100,
      total_items : 1000,
    }
  }
  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK 
    if(response.data.isOK)  this.result.data= this.mapFieldFromApi(response.data.result) 
    return this.result
  } 
  async getPackageItemsAsync(query) {
    let data_send = {
      packageId: query.id,
      shopId: query.shop_id
    }
    try {
      const response = await this.http.post(url_read, data_send)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let mapData = {
          items: [],
          pagination: {}
        }
        for(let item of response.data.result){
          if(item.status == options.good_status.active)
            mapData.items.push(this.mapFieldFromApi(item))
        }
        mapData.pagination = this.mapParamFromApi()
        this.result.data = mapData
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
}

