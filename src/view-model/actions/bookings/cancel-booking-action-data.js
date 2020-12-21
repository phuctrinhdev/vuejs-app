import { options } from '../../../helpers/options'
export default class CancelBookingActionData {
  constructor(booking_id  = 0,
    booked_items        = [], //array of booked items
    client_name         = '',
    booking_date        = new Date(),
    booking_date_ts     = 0,
    original_booking_id = null,
    start_time          = '',
    option              = options.booking_cancel_type,
    reason              = options.booking_reason.not_selected,
    cancel_source       = options.booking.booking_source.staff,
    notes               =''
  ){
    this.booking_id             = booking_id
    this.booked_items           = booked_items
    this.client_name            = client_name
    this.booking_date           = booking_date
    this.booking_date_ts        = booking_date_ts
    this.original_booking_id    = original_booking_id,
    this.start_time             = start_time
    this.option                 = option
    this.reason                 = reason
    this.cancel_source          = cancel_source
    this.notes                  = notes
    this.cancel_repeat_dates_ts = []
    this.cancel_repeat_message  = ''
  }
  updateCancelRepeatDatesTS(dates_ts){
    this.cancel_repeat_dates_ts = dates_ts
  }
  updateCancelRepeatMessage(message){
    this.cancel_repeat_message = message
  }
}