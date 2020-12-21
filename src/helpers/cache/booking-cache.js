import BaseCache from './base-cache'
import BookingApi from '../../api/bookings/booking-api'
import { bookings_options } from '../options/bookings-options'

export default class BookingCache extends BaseCache {
  constructor() {
    super()
  }

  async getBookingSetupCache(shop_id) {
    let booking_setup = this.getCache(bookings_options.cache.all_booking_calendar_setups_session.key, shop_id)
    if (booking_setup == null || booking_setup == undefined) {
      const query = { shop_id }
      const booking_api = new BookingApi()
      const result = await booking_api.getAllCalendarSetupsAsync(query)
      if (result.is_ok) {
        booking_setup = result.data
        this.setCache(
          bookings_options.cache.all_booking_calendar_setups_session.key,
          booking_setup,
          bookings_options.cache.all_booking_calendar_setups_session.expire_time,
          shop_id
        )
      } else {
        booking_setup = {
          error_messages: result.error_messages
        }
      }
    }
    return booking_setup
  }

  clearSessionBookingSetup() {
    sessionStorage.removeItem(bookings_options.cache.all_booking_calendar_setups_session.key)
  }
}