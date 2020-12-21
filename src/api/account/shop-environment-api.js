import { getServiceUrl } from '../../helpers/api-url-generator'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES } from '../../config/constant'
import ServicesBaseAPI            from '../services-base-api'
import ShopEnvironmentSetupViewModel            from '../../view-model/account/shop-environment-setup-view-model'

const url_read    = getServiceUrl(SERVICE_TYPES.ADMINS.SHOP_READ, 1)
const url_command = getServiceUrl(SERVICE_TYPES.ADMINS.SHOP_ENVIRONMENT_CMD, 1) // Command API URL, Version
let url_shop_environment_read = url_read + SERVICE_EXTEND_TYPES.SHOP_ENVIRONMENT

let url_netmoeny = url_command + SERVICE_EXTEND_TYPES.NETMONEY_ALARM
let url_vat_rate = url_command + SERVICE_EXTEND_TYPES.VAT_RATE

export default class ShopEnvironmentApi extends ServicesBaseAPI{
  constructor() {
    super()
  }
  
  mapFieldFromVatRateApi(model){
    return {
      modification_date             : model.modificationDate,
      shop_id                       : model.shopId,
      vat_rate                      : model.vatRate
    }
  }
  async updateNetmoneyAsync(model) {
    let data_send = model.mapFieldsToNetmoneyAlarmApi()
    try {
      const response = await this.http.put(url_netmoeny, data_send)
      this.setResult(response, () => {
        let shop_environment_setup_netmoney = new ShopEnvironmentSetupViewModel()
        shop_environment_setup_netmoney.mapFieldsNetmoneyAlarmFromApi(response.data.result)
        this.result.data = shop_environment_setup_netmoney
      })
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async getShopEnvironmentAsync(query) {
    let data_send = {
      shopId: query.shop_id,
      countryCode: query.country_code
    }
    try {
      const response = await this.http.post(url_shop_environment_read, data_send)
      this.setResult(response, () => {
        let shop_environment_setup = new ShopEnvironmentSetupViewModel()
        shop_environment_setup.mapFieldsFromApi(response.data.result)
        this.result.data = shop_environment_setup
      })
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateVATRateAsync(model) {
    let data_send = {
      shopId: model.shop_id,
      vatRate: model.vat_rate
    }
    try {
      const response = await this.http.put(url_vat_rate, data_send)
      this.result.is_ok = response.data.isOK
  
      if(response.data.isOK){
        this.result.data = this.mapFieldFromVatRateApi(response.data.result) 
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

}