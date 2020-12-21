export default class BaseCache {

  setCache(key, value, expire_duration_minutes = 0, shop_id){
    let expire_time = 0
    if(expire_duration_minutes != 0) expire_time = Date.now() + (expire_duration_minutes * 60 * 1000) 
    let data = {
      shop_id     : shop_id,
      expire_time : expire_time,
      value       : value
      
    }
    sessionStorage.setItem(key, JSON.stringify(data))
  }

  getCache(key, shop_id){
    let data = sessionStorage.getItem(key)
    if(data != null) {
      data = JSON.parse(data)
      if((data.expire_time != 0 && Date.now() > data.expire_time) || Number(data.shop_id) != Number(shop_id)) {
        sessionStorage.removeItem(key)
        return null
      }
      else if(data.expire_time == 0 || Date.now() < data.expire_time) {
        return data.value
      }
    }
    return null
  }

  clearAllCache(caches){
    for(let cache of caches){
      sessionStorage.removeItem(cache.key)
    }
  }
}