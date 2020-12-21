import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'
import { mapPagingFromApi, convertDateFromTimezoneToTimestamp } from '../../helpers/common' 

const url_read = getServiceUrl(SERVICE_TYPES.ADMIN_SALES.NETMONEY_HISTORY_READ, 1) // Read API URL, Version

let url_list = url_read + SERVICE_EXTEND_TYPES.SHOP_LIST

export default class NetmoneyHistoryApi {
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
      shopId                 : model.shop_id,
      netMoneyVariation      : model.netmoney_variation,
      registrationDateFromTS : convertDateFromTimezoneToTimestamp(model.registration_date_from),
      registrationDateToTS   : convertDateFromTimezoneToTimestamp(model.registration_date_to),
      pageSize               : model.page_size,
      pageNumber             : model.page_number
    }
  }

  mapFieldFromApi(model){
    return {
      id                   : model.netMoneyHistoryId,
      amount               : model.amount,
      balance              : model.balance,
      netmoney_source_type : model.netMoneySourceType,
      registration_date    : model.registrationDate
    }
  }

  async getNetmoneyHistoriesAsync(query) {
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