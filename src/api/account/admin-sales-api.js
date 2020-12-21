import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'
import { mapPagingFromApi } from '../../helpers/common' 

const url_read = getServiceUrl(SERVICE_TYPES.ADMIN_SALES.ADMIN_SALES_READ, 1) // Read API URL, Version

let url_list = url_read + SERVICE_EXTEND_TYPES.LIST_BY_SHOP

export default class AdminSalesApi {
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }

  mapFieldToApi(model){ // list query
    return {
      shopId                 : model.shop_id,
      countryCode            : model.country_code,
      dateFromTS             : model.date_from_ts,
      dateToTS               : model.date_to_ts,
      pageSize               : model.page_size,
      pageNumber             : model.page_number
    }
  }

  mapFieldFromApi(model){
    return {
      id                     : model.adminSalesId,
      modification_date      : model.modificationDate,
      registration_date      : model.registrationDate,      
      sales_date_ts          : model.salesDateTS,
      amount                 : model.amount,
      payment_date_ts        : model.paymentDateTS,      
      payment_method_code    : model.paymentMethodCode,
      payment_method_name    : model.paymentMethodName,
      merchant_id            : model.merchantId,
      payment_status         : model.paymentStatus,
      buyer_name             : model.buyerName,
      receipt_url            : model.receiptUrl
    }
  }

  async getAdminSalesListByShopAsync(query) {
    let query_map = this.mapFieldToApi(query)
    
    try {
      const response = await this.http.post(url_list, query_map)
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
}