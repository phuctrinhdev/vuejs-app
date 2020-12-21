import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES } from '../../config/constant'

const url_shop_usage_read = getServiceUrl(SERVICE_TYPES.ADMIN_SALES.SHOP_USAGE_READ, 1)

export default class PaymentShopUsageApi {  
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
      shopId   : model.shop_id
    }
  }

  mapFieldFromApi(model){
    return {
      shop_id : model.shopId,
      country_code     : model.countryCode,
      time_zone         : model.timeZone,
      expiry_date_ts    : model.expiryDateTS,
      net_money_balance : model.netMoneyBalance,
      modification_date : model.modificationDate,
      registration_date : model.registrationDate,
      shop_name         : model.shopName
    }
  }

  async getPaymentShopUsageAsync(query) {
    let data_send = this.mapFieldToApi(query)
    try {
      const response = await this.http.post(url_shop_usage_read, data_send)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
        this.result.is_ok = response.data.isOK
    
        if(response.data.isOK) this.result.data = this.mapFieldFromApi(response.data.result)
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

}