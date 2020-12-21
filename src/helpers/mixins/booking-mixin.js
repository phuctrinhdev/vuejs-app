import _                            from 'lodash'
import { options }                  from '../options'
import { mapGetters, mapActions }   from 'vuex'

import BookingViewModel             from '../../view-model/bookings/booking-view-model'
import CalendarCellSpec             from '../../components/bookings/bookings/calendar-view/calendar-cell-spec'

import CancelBookingActionData      from '../../view-model/actions/bookings/cancel-booking-action-data'

import { getTimeInclude24,
  // convertDateToTimezone 
}                                   from '../common'

//private method is created for reused purpose
function _showDialogById(vue_component, dialog_id){
  vue_component.$root.$emit('bv::show::modal', dialog_id) 
}
let _calendar_cell_data = new CalendarCellSpec()

// eslint-disable-next-line no-unused-vars
let _moving_booking = null //CalendarCellBookingViewGroup

export default {
  computed: {
    ...mapGetters('booking', {
      x_bookings: 'getBookingCalendar',
    }),
  },
  methods: {
    ...mapActions('booking', [
      'setBookingActionData',
    ]),
    ...mapActions('booking_cancel', [
      'setBookingCancelActionData'
    ]),
    setMovingBooking(moving_booking_view_group){
      _moving_booking = _.cloneDeep(moving_booking_view_group)
    },
    getMovingBooking(){
      return _moving_booking
    },
    clearMovingBooking(){
      _moving_booking = null
    },
    canBookingBeEditted(booking){
      return !(booking.status === options.booking.booking_status.checked_out)
    },
    getBookingFromStore(booking_id){
      return this.x_bookings.filter(booking => booking.id == booking_id)[0]
    },
    setCalendarCellSpec(calendar_cell_data){
      _calendar_cell_data = calendar_cell_data
    },
    getCalendarCellSpec(){
      return _calendar_cell_data
    },
    onActionBooking(action, group = {}, col = {}, row = {}){
      let booking = {}
      if(action == options.form_actions.delete){
        this.onActionBookingCancel(group, row.time)
      }
      else {
        if(action == options.form_actions.add) {
          booking = new BookingViewModel().getFields()
        }
        else {
          booking = _.cloneDeep(group.ref_booking)
        }
        let tmp_start_time = row.time
        if(row.cross_date)
          tmp_start_time = getTimeInclude24(tmp_start_time)
        this.openBookingAction(action, booking, col.resource_setup_id, col.booking_date, tmp_start_time)
      }
    },
    openBookingAction(action, booking = new BookingViewModel(), resource_setup_id = 0, booking_date = new Date(), time ='00:00'){
      this.booking_action = {
        action: action,
        data: booking,
        options: {
          booking_resource_setup_id: resource_setup_id,
          booking_date: booking_date,
          start_time: time,
        }
      }
      this.setBookingActionData(this.booking_action)
      if(action == options.form_actions.part){
        _showDialogById(this, 'booking-connect-client-action-modal')
      }
      else {
        _showDialogById(this, 'booking-action-modal')
      }
    },
    onActionBookingCancel(group, start_time){
      if(group.id > 0) group.booking_id = group.id
      
      let booking_cancel = new CancelBookingActionData(
        group.ref_booking.id,
        group.ref_booking.booked_items,
        group.ref_booking.client_name,
        group.ref_booking.booking_date,
        group.ref_booking.booking_date_ts,
        group.ref_booking.original_booking_id,
        start_time,
        options.booking_cancel_type.booking_only,
        options.booking_reason.not_selected,
        options.booking.booking_source.staff,
        '')
      
      booking_cancel = Object.assign(booking_cancel, this.shop_data)
      this.booking_cancel_action = {
        action: options.form_actions.add,
        data: booking_cancel
      }
      this.setBookingCancelActionData(this.booking_cancel_action)
      if(group.ref_booking.original_booking_id == null){
        _showDialogById(this, 'booking-cancel-action-modal')
      }
      else {
        _showDialogById(this, 'cancel-repeat-booking-modal')
      }
    },
  
  }
}