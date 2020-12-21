import BaseCache           from './base-cache'
import { cache_session }   from '../cache-session'
import { options }   from '../options'
import { common_options }  from '../options/common-options'
import SalesApi            from '../../api/sales/sales-api'
import PaymentMethodApi from '../../api/sales/payment-method-api'

export default class SalesCache extends BaseCache {
  constructor() {
    super()
  }

  async getAllSalesSetupCache(shop_id){
    let cache_key = options.sessions.all_sales_setups.key
    let all_sales_setup = this.getCache(cache_key, shop_id)
    if(all_sales_setup == null || all_sales_setup == undefined){
      let query = { 
        status : common_options.good_status.active,
        shop_id: shop_id 
      }
      let sales_api = new SalesApi() 
      let result = await sales_api.getAllSalesSetupsAsync(query)

      if(result.is_ok) {
        all_sales_setup = result.data
        this.setCache(
          cache_key, 
          all_sales_setup, 
          options.sessions.all_sales_setups.expire_time,
          shop_id
        )
      }
      else {
        all_sales_setup = {
          error_messages: result.error_messages
        }
      }
    }

    return all_sales_setup
  }
  
  static clearAllSalesSetupCache(){
    sessionStorage.removeItem(options.sessions.all_sales_setups.key)
  }

  static async getEnvironmentSetupCacheAsync(shop_id) {
    let cache_key = common_options.environment_setup_session.key
    let expire_time = common_options.environment_setup_session.expire_time
    let environment_setup = cache_session.getSession(cache_key, shop_id)
    if (environment_setup == null || environment_setup == undefined) {
      // TODO By Hung
      environment_setup = {
        sales: '',
        data_protection_and_securiy: ''
      }
      cache_session.setSession(cache_key, environment_setup, expire_time, shop_id)
    }
    return environment_setup
  }

  static setEnvironmentSetupToCache(shop_id, environment_setup) {
    let cache_key = common_options.environment_setup_session.key
    let expire_time = common_options.environment_setup_session.expire_time
    let environment_setup_cache = cache_session.getSession(cache_key, shop_id)
    if (environment_setup_cache != null && environment_setup_cache != undefined) {
      sessionStorage.removeItem(cache_key)
    }
    cache_session.setSession(cache_key, environment_setup, expire_time, shop_id)
  }

  static clearSessionEnvironmentSetup() {
    sessionStorage.removeItem(common_options.environment_setup_session.key)
  }

  async getPaymentMethodSetupCache(shop_id) {
    const cache_key = options.sessions.payment_method_setup.key
    let payment_method_setup = this.getCache(cache_key, shop_id)
    if (payment_method_setup == null || payment_method_setup == undefined) {
      const query = {
        shop_id: shop_id,
        status: common_options.good_status.active,
        page_size: common_options.pagination.max,
        page_number: 1
      }
      const payment_method_api = new PaymentMethodApi()
      const result = await payment_method_api.getPaymentMethodsAsync(query)
      if (result.is_ok) {
        payment_method_setup = result.data.items
        this.setCache(
          cache_key,
          payment_method_setup,
          options.sessions.payment_method_setup.expire_time,
          shop_id
        )
      }
    }
    return payment_method_setup
  }

  clearSessionPaymentMethodSetup() {
    sessionStorage.removeItem(options.sessions.payment_method_setup.key)
  }
}