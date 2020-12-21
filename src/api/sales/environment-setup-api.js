import ServicesBaseAPI                       from '../services-base-api'
import SalesGeneralSetupViewModel            from '../../view-model/sales/sales-general-setup-view-model'
import DataProtectionAndSecurityViewModel    from '../../view-model/sales/data-protection-and-security-view-model'
import ClientEnvironmentSetupViewModel       from '../../view-model/clients/client-environment-setup-view-model'
import MessageSetupLoginViewModel            from '../../view-model/message-autos/message-setup-login/message-setup-login-view-model'
import ShopEnvironmentSetupViewModel            from '../../view-model/account/shop-environment-setup-view-model'

import {getServiceUrl}                       from '../../helpers/api-url-generator'
import {SERVICE_TYPES,SERVICE_EXTEND_TYPES}  from '../../config/constant'


const url_aggr                         = getServiceUrl(SERVICE_TYPES.SALES_AGGR, 1)
const url_get_environment_setup_live   = url_aggr + SERVICE_EXTEND_TYPES.GET_ENVIRONMENT_SETUP_LIVE

export default class EnvironmentSetupAPI extends ServicesBaseAPI{
  constructor(){
    super()
  }

  async getEnvironmentSetupAsync(shop_id, country_code){
    let send_data = {
      shopId : shop_id,
      countryCode: country_code
    }
    try{
      let response = await this.http.post(url_get_environment_setup_live,send_data)
      this.setResult(response,()=>{
        let sales_general            = new SalesGeneralSetupViewModel()
        let data_protection_security = new DataProtectionAndSecurityViewModel() 
        let client_setup             = new ClientEnvironmentSetupViewModel()
        let login_setup              = new MessageSetupLoginViewModel
        let shop_id                  = response.data.result.shopId
        let shop_environment_setup   = new ShopEnvironmentSetupViewModel()

        sales_general.mapFieldsFromApi(response.data.result.salesGeneralSetup,shop_id)
        data_protection_security.mapFieldsFromApi(response.data.result.salesDataProtectionAndSecuritySetup,shop_id)
        client_setup.mapFieldsFromApi(response.data.result.clientEnvironmentSetup,shop_id)
        login_setup.mapFieldsFromApi(response.data.result.loginMessageSetup, shop_id)
        shop_environment_setup.mapFieldsFromApi(response.data.result.shopEnvironmentDTO,shop_id)
        
        this.result.data = {
          salesGeneralSetup                   : sales_general,
          salesDataProtectionAndSecuritySetup : data_protection_security,
          clientEnvironmentSetup              : client_setup,
          messageSetupLogin                   : login_setup,
          shopEnvironmentSetup                : shop_environment_setup
        }
      })
    }catch(ex){
      return this.http.loadError(ex)
    }
    return this.result
  }
}