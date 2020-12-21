import { options }      from '../helpers/options'
import BookingApi       from '../api/bookings/booking-api'
import PaymentMethodApi from '../api/sales/payment-method-api'
import store from '../store/store'

export const cache_session = { 
  setSession(key, value, expire_duration_minutes = 0, shop_id){
    let expire_time = 0
    if(expire_duration_minutes != 0) expire_time = Date.now() + (expire_duration_minutes * 60 * 1000) 
    let data = {
      shop_id     : shop_id,
      expire_time : expire_time,
      value       : value
    }
    sessionStorage.setItem(key, JSON.stringify(data))
  },

  getSession(key, shop_id){
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
  },

  clearAllSession(){
    for(let i in options.sessions){
      let session = options.sessions[i]
      sessionStorage.removeItem(session.key)
    }
  },

  setShopIdCache(shop_id){
    let cache_key = options.sessions.shop_id.key
    this.setSession( // cache
      cache_key, 
      shop_id, 
      options.sessions.all_calendar_setups.expire_time,
      shop_id
    )
  },
  getShopIdCache(){
    let shop_id       = 0
    let cache_shop_id = JSON.parse((sessionStorage.getItem(options.sessions.shop_id.key)))

    if(cache_shop_id == null){
      let shop = store.getters['user/getShop']
      shop_id = shop.shop_id
    }
    else {
      shop_id = cache_shop_id.shop_id
    }
    
    return shop_id
  },

  async getBookingSetupCache(shop_id){
    let cache_key = options.sessions.all_calendar_setups.key
    let booking_setup = this.getSession(cache_key, shop_id)
    if(booking_setup == null || booking_setup == undefined){
      let booking_api = new BookingApi()
      let all_calendar_setups_result = await booking_api.getAllCalendarSetupsAsync({ shop_id: shop_id })
      if(all_calendar_setups_result.is_ok) {
        booking_setup = all_calendar_setups_result.data
        this.setSession(
          cache_key, 
          booking_setup, 
          options.sessions.all_calendar_setups.expire_time,
          shop_id
        )
      }
      else {
        booking_setup = {
          error_messages: all_calendar_setups_result.error_messages
        }
      }
    }
    return booking_setup 
  },
  clearSessionBookingSetup(){
    sessionStorage.removeItem(options.sessions.all_calendar_setups.key)
  },
  async getPaymentMethodSetupCache(shop_id){
    let cache_key = options.sessions.payment_method_setup.key
    let payment_method_setup = this.getSession(cache_key, shop_id)
    if(payment_method_setup == null || payment_method_setup == undefined){
      let query = {
        shop_id: shop_id,
        status: options.good_status.active,
        page_size: options.pagination.max,
        page_number: 1
      }
      let payment_method_api = new PaymentMethodApi() 
      let result = await payment_method_api.getPaymentMethodsAsync(query)
      if(result.is_ok) {
        payment_method_setup = result.data.items
        this.setSession(
          cache_key, 
          payment_method_setup, 
          options.sessions.payment_method_setup.expire_time,
          shop_id
        )
      }
    }
    return payment_method_setup 
  },
  clearSessionPaymentMethodSetup(){
    sessionStorage.removeItem(options.sessions.payment_method_setup.key)
  }
}