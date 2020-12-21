/*
    This file just contains enum , options , contains for Booking Part.
    Please follow naming convention : 
    - Enum type :  <name>_<enum>.
    - Constants :  <uppercase_name>.
    - Session : <name>_<session>
 */
import { SESSION_KEY } from '../../config/constant'

import {
  BOOKING_STATUS, BOOKING_CLIENT_COLOR, BOOKING_ERROR_CODES,
  BOOKING_SOURCE, CALENDAR_VIEW_MODE, CALENDAR_CELL_MODE, BLOCKED_TIME_ERROR_CODES, BOOKING_SETUP_ERROR_CODES, WAITING_ERROR_CODES
} from '../../config/constant'

export const bookings_options = {
  cache: {
    all_booking_calendar_setups_session: {
      key: SESSION_KEY.All_CALENDAR_SETUPS,
      expire_time: 30
    },
  },
  waiting_list_skin: {
    mini: 0,
    full: 1
  },
  booking_display_item_type: {
    total  : 0,
    cancel : 1,
    no_show: 2
  },
  booking_report_by_type: {
    resource   : 0,
    day_of_week: 1,
    hour_of_day: 2
  },

  // options
  booking_status: {
    all: BOOKING_STATUS.ALL,
    all_no_canceled: BOOKING_STATUS.ALL_NO_CANCELD,
    requested: BOOKING_STATUS.REQUESTED,
    completed: BOOKING_STATUS.COMPLETED,
    arrived: BOOKING_STATUS.ARRIVED,
    canceled: BOOKING_STATUS.CANCELED,
    no_show: BOOKING_STATUS.NO_SHOW,
    checked_out: BOOKING_STATUS.CHECKED_OUT,
    no_booking: BOOKING_STATUS.NO_BOOKING,
    blocked_booking: BOOKING_STATUS.BLOCKED_BOOKING,
    booking_available: BOOKING_STATUS.BOOKING_AVAILABLE
  },
  option_booking_status: [
    { value: BOOKING_STATUS.REQUESTED, text: 'booking-status.requested', color: '#fcb735' },
    { value: BOOKING_STATUS.COMPLETED, text: 'booking-status.completed', color: '#2eb398' },
    { value: BOOKING_STATUS.ARRIVED, text: 'booking-status.arrived', color: '#7c79b6' },
    { value: BOOKING_STATUS.CANCELED, text: 'booking-status.canceled', color: 'white' },
    { value: BOOKING_STATUS.NO_SHOW, text: 'booking-status.no-show', color: '#db3c44' },
    { value: BOOKING_STATUS.CHECKED_OUT, text: 'booking-status.checked-out', color: '#3499db' },
    { value: BOOKING_STATUS.NO_BOOKING, text: 'booking-status.no-booking', color: '#dee2e6' },
    { value: BOOKING_STATUS.BLOCKED_BOOKING, text: 'booking-status.blocked-booking', color: '#adb5bd' },
    { value: BOOKING_STATUS.BOOKING_AVAILABLE, text: 'booking-status.booking-available', color: '#ffffff' }
  ],
  booking_client_color: {
    none: BOOKING_CLIENT_COLOR.NONE,
    red: BOOKING_CLIENT_COLOR.RED,
    orange: BOOKING_CLIENT_COLOR.ORANGE,
    yellow: BOOKING_CLIENT_COLOR.YELLOW,
    green: BOOKING_CLIENT_COLOR.GREEN,
    blue: BOOKING_CLIENT_COLOR.BLUE,
    indigo: BOOKING_CLIENT_COLOR.INDIGO,
    violet: BOOKING_CLIENT_COLOR.VIOLET,
    pink: BOOKING_CLIENT_COLOR.PINK
  }, 
  booking_client_color_options: [
    { id: BOOKING_CLIENT_COLOR.NONE,    color: '#ffffff',     name: 'none' },
    { id: BOOKING_CLIENT_COLOR.RED,     color: '#db0a44',     name: 'red' },
    { id: BOOKING_CLIENT_COLOR.ORANGE,  color: '#fc8536',     name: 'orange' },
    { id: BOOKING_CLIENT_COLOR.YELLOW,  color: '#f6de78',     name: 'yellow' },
    { id: BOOKING_CLIENT_COLOR.GREEN,   color: '#57c386',     name: 'green' },
    { id: BOOKING_CLIENT_COLOR.BLUE,    color: '#3499db',     name: 'blue' },
    { id: BOOKING_CLIENT_COLOR.INDIGO,  color: '#4a148c',     name: 'indigo' },
    { id: BOOKING_CLIENT_COLOR.PURPLE,  color: '#7c47b6',     name: 'purple' },
  ],
  booking_source: {
    all: BOOKING_SOURCE.ALL,
    staff: BOOKING_SOURCE.STAFF,
    online: BOOKING_SOURCE.ONLINE,
  },
  option_booking_source: [
    { value: BOOKING_SOURCE.STAFF, text: 'booking-source.staff', acronym: 'S' },
    { value: BOOKING_SOURCE.ONLINE, text: 'booking-source.online', acronym: 'O' },
    { value: BOOKING_SOURCE.KAKAO, text: 'booking-source.kakao', acronym: 'N' },
    { value: BOOKING_SOURCE.NAVER, text: 'booking-source.naver', acronym: 'K' },
  ],
  booking_min_duration: 5,
  table_cell_height: 30,
  calendar_view_mode: {
    daily: CALENDAR_VIEW_MODE.DAILY,
    weekly: CALENDAR_VIEW_MODE.WEEKLY
  },
  calendar_cell_mode: {
    add_booking: CALENDAR_CELL_MODE.ADD_BOOKING,
    move_booking: CALENDAR_CELL_MODE.MOVE_BOOKING,
    add_blocked_time: CALENDAR_CELL_MODE.ADD_BLOCKED_TIME
  },
  view_direction: {
    next: 1,
    pre: -1
  },
  booking_error_codes: {
    bk15c: BOOKING_ERROR_CODES.BK15C,
    bk45c: BOOKING_ERROR_CODES.BK45C,
    bk44c: BOOKING_ERROR_CODES.BK44C,
    bk36c: BOOKING_ERROR_CODES.BK36C,
    bk35c: BOOKING_ERROR_CODES.BK35C,
    bk46c: BOOKING_ERROR_CODES.BK46C,
    bk48c: BOOKING_ERROR_CODES.BK48C,
    bk47c: BOOKING_ERROR_CODES.BK47C,
    bk49c: BOOKING_ERROR_CODES.BK49C,
    bk30c: BOOKING_ERROR_CODES.BK30C,
    bk31c: BOOKING_ERROR_CODES.BK31C,
    bk52c: BOOKING_ERROR_CODES.BK52C,
    bk43c: BOOKING_ERROR_CODES.BK43C
  },
  waiting_error_codes: {
    wt15c: WAITING_ERROR_CODES.WT15C,
    wt16c: WAITING_ERROR_CODES.WT16C,
    wt17c: WAITING_ERROR_CODES.WT17C,
    wt18c: WAITING_ERROR_CODES.WT18C,
    wt19c: WAITING_ERROR_CODES.WT19C,
    wt20c: WAITING_ERROR_CODES.WT20C,
    wt21c: WAITING_ERROR_CODES.WT21C
  },
  blocked_time_error_codes: {
    bt11c: BLOCKED_TIME_ERROR_CODES.BT11C,
    bt12c: BLOCKED_TIME_ERROR_CODES.BT12C,
    bt13c: BLOCKED_TIME_ERROR_CODES.BT13C,
    bt14c: BLOCKED_TIME_ERROR_CODES.BT14C,
    bt17c: BLOCKED_TIME_ERROR_CODES.BT17C,
    bt18c: BLOCKED_TIME_ERROR_CODES.BT18C,
    bt19c: BLOCKED_TIME_ERROR_CODES.BT19C
  },
  booking_setup_error_codes: {
    rs05c: BOOKING_SETUP_ERROR_CODES.RS05C
  }
}