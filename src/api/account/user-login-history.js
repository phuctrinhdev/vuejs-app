import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'
import { mapPagingFromApi, convertDateToTimeStamp } from '../../helpers/common' 


const url_read = getServiceUrl(SERVICE_TYPES.IDENTITIES.USER_LOGIN_HISTORY_READ, 1) // Read API URL, Version

let url_list = url_read + SERVICE_EXTEND_TYPES.LIST

export default class UserLoginHistoryApi {
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
      userID                 : model.user_id,
      registrationDateFromTS : convertDateToTimeStamp(model.registration_date_from),
      registrationDateToTS   : convertDateToTimeStamp(model.registration_date_to),
      pageSize               : model.page_size,
      pageNumber             : model.page_number
    }
  }

  mapFieldFromApi(model){
    return {
      id                : model.userLoginHistoryId,
      shop_id           : model.shopId,
      registration_date : model.registrationDate,
      user_id           : model.createdByUserID,
      login_ip          : model.loginIP
    }
  }

  async getUserLoginHistoriesAsync(query) {
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