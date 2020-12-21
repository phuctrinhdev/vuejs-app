import BaseCache           from './base-cache'
import { clients_options }   from '../options/clients-options'
import { cache_session }   from '../cache-session'
import ClientsApi            from '../../api/clients/client-api'

export default class ClientsCache extends BaseCache {
  constructor() {
    super()
  }

  async getAllClientsSetupCache(shop_id){
    let cache_key = clients_options.cache.all_clients_setups.key
    let all_clients_setup = this.getCache(cache_key, shop_id)
    if(all_clients_setup == null || all_clients_setup == undefined){
      let clients_api = new ClientsApi() 
      let result = await clients_api.getClientShopInfoAsync(shop_id)

      if(result.is_ok) {
        all_clients_setup = result.data
        if(all_clients_setup.field_setups.id === 0 
            || all_clients_setup.environments.id === 0 ){
          all_clients_setup = null //not enough setup information
        }
        else{
          cache_session.setSession(cache_key, all_clients_setup, clients_options.cache.all_clients_setups.expire_time, shop_id)
        }
      }
    }
    return all_clients_setup
  }
  
  static clearAllClientsSetupCache(){
    sessionStorage.removeItem(clients_options.cache.all_clients_setups.key)
  }
}