import _ from 'lodash'
import Http from '../../helpers/http'
import { getServiceUrl } from '../../helpers/api-url-generator'
import { options } from '../../helpers/options'
import i18n from '../../translate/translate'

import { mapPagingFromApi, 
  mapSecurityInfo, 
  convertDateToTimeStamp, 
  convertTimeStampToDate, 
  formatMoney, 
  isNullObject,
  limitFinishingTimeOfBookedItem,
  // guid,
} from '../../helpers/common'
import { SERVICE_TYPES, SERVICE_EXTEND_TYPES} from '../../config/constant'

import BookingOpeningHourSetupApi           from './opening-hours-api'
import BookingResourceSetupApi              from './booking-resources-api'
import BookingItemSetupApi                  from './booking-item-api'
import BookingCalendarSettingViewModel      from '../../view-model/bookings/booking-calendar-setting-view-model'
import BookingOnlineBookingSettingViewModel from '../../view-model/bookings/booking-online-booking-setting-view-model'
import BookingSummaryViewModel              from '../../view-model/bookings/booking-summary-view-model'

import BlockedTimeApi from './blocked-time-api'
import WaitingApi     from './waiting-api'

const url_read    = getServiceUrl(SERVICE_TYPES.BOOKING_READ, 1)
const url_command = getServiceUrl(SERVICE_TYPES.BOOKING_CMD, 1)

let url_read_booking_list                  = url_read + SERVICE_EXTEND_TYPES.LIST
let url_read_calendar                      = url_read + SERVICE_EXTEND_TYPES.CALENDAR + '/Live'
let url_read_all_calendar_setups           = url_read + SERVICE_EXTEND_TYPES.All_CALENDAR_SETUPS
let url_read_upcomming_repeated_bookings   = url_read + SERVICE_EXTEND_TYPES.UPCOMING_REPEATED_BOOKINGS
let url_read_bookings_summary_by_client    = url_read + SERVICE_EXTEND_TYPES.BOOKINGS_SUMMARY_BY_CLIENT
let url_command_change_waiting_to_booking  = url_command + SERVICE_EXTEND_TYPES.CHANGE_WAITING_TO_BOOKING
let url_cancel_booking                     = url_command + SERVICE_EXTEND_TYPES.CANCEL_BOOKING
let url_update_booking_client              = url_command + SERVICE_EXTEND_TYPES.UPDATE_BOOKING_CLIENT
let url_update_booking_status              = url_command + SERVICE_EXTEND_TYPES.UPDATE_BOOKING_STATUS
let url_update_booking_confirmed           = url_command + SERVICE_EXTEND_TYPES.UPDATE_BOOKING_CONFIRMED
let url_get_bookable_waiting               = url_command + SERVICE_EXTEND_TYPES.GET_BOOKABLE_WAITING


export default class BookingApi {  
  constructor(){ 
    this.http = new Http()
    this.result = {
      is_ok: false,
      error_messages: [],
      data: {}
    }
  }
  mapFieldToApi(model){
    if(model.booked_items != null){
      for(let i in model.booked_items){
        model.booked_items[i] = this.mapBookedItemsToApi(model.booked_items[i])
      }
    }
    model = mapSecurityInfo(model)

    // date to timestamp
    model.booking_date_ts = convertDateToTimeStamp(model.booking_date)
    if(!isNullObject(model.repeat_booking)){
      if(Array.isArray(model.repeat_booking.repeat_dates) && model.repeat_booking.repeat_dates.length == 0){
        model.repeat_booking.repeat_date_tss = model.repeat_booking.repeat_dates
      }
      else if(Array.isArray(model.repeat_booking.repeat_dates) && model.repeat_booking.repeat_dates.length > 0){
        model.repeat_booking.repeat_date_tss = model.repeat_booking.repeat_dates.map(date => convertDateToTimeStamp(date))
      }
    }

    // repeat booking
    if(!isNullObject(model.repeat_booking)){ 
      model.booking_deposit.due_date_ts = convertDateToTimeStamp(model.booking_deposit.due_date, false, true)
      if(model.booking_deposit.due_date_ts == 0) model.booking_deposit.due_date_ts = null
    }

    // booking deposit
    model.booking_deposit.due_date_ts = convertDateToTimeStamp(model.booking_deposit.due_date, false, true)
    if(model.booking_deposit.due_date_ts == 0 || model.booking_deposit.deposit_type == options.deposit_type.pay_by_balance) 
      model.booking_deposit.due_date_ts = null
    if(model.booking_deposit.payment_method_id == 0)
      model.booking_deposit.payment_method_id = null
    if(model.is_deposit_required && model.booking_deposit.amount.toString().indexOf('.') == -1) 
      model.booking_deposit.amount = formatMoney(model.booking_deposit.amount, 2)

    // chain_id
    let tmp_chain_id = model.chain_id
    if(model.chain_id == 0)
      tmp_chain_id = null
    
    return {
      isAllowedMovingMultiResourcesBooking: model.is_allowed_moving_multi_resources_booking,
      isDuplicateBlockedTime              : model.is_duplicate_blocked_time,
      isDuplicateAnotherBooking           : model.is_duplicate_another_booking,
      isBookingExceedsWorkHours           : model.is_booking_exceeds_work_hours,
      isCheckBookableWaiting              : model.is_check_bookable_waiting,
      isGetBookableWaiting                : model.is_get_bookable_waiting,
      mustCheckPerformanceResource        : model.must_check_performance_resource,
      sessionToken              : model.session_token,
      shopLocation              : model.shop_location,
      bookingId                 : model.id,
      clientId                  : model.client_id,
      clientName                : model.client_name,
      clientMobileNumber        : model.client_mobile_number,
      clientMemberNumber        : model.client_member_number,
      clientRegistrationDateTS  : model.client_registration_date_ts,
      bookingClientType         : model.booking_client_type,
      displayColor              : model.display_color,
      isVip                     : model.is_vip,
      confirmed                 : model.confirmed,
      bookingDate               : model.booking_date,
      bookingDateTS             : model.booking_date_ts,
      sendMessages              : model.send_messages,
      isDepositRequired         : model.is_deposit_required,
      notes                     : model.notes,
      status                    : model.status,
      bookingSource             : model.booking_source,
      createdById               : model.created_by_id,
      createdByName             : model.created_by_name, 
      modificationDate          : model.modification_date,
      shopId                    : model.shop_id,
      bookedItems               : model.booked_items,
      repeatBooking             : {
        repeatBookingId         : model.repeat_booking.repeat_booking_id,
        repeatTimes             : model.repeat_booking.repeat_times,
        repeatType              : model.repeat_booking.repeat_type,
        repeatDates             : model.repeat_booking.repeat_dates,
        repeatDateTSs           : model.repeat_booking.repeat_date_tss,
        repeatedDayOfWeek       : model.repeat_booking.repeated_day_of_week,
      },
      bookingDeposit            : {
        bookingDepositId        : model.booking_deposit.booking_deposit_id,
        depositType             : model.booking_deposit.deposit_type,
        dueDate                 : model.booking_deposit.due_date,
        dueDateTS               : model.booking_deposit.due_date_ts,
        amount                  : model.booking_deposit.amount,
        paymentMethodId         : model.booking_deposit.payment_method_id,
        paymentMethodName       : model.booking_deposit.payment_method_name,
        isAddedToSales          : model.booking_deposit.is_added_to_sales,
      },
      chainId                   : tmp_chain_id,
      branchNumber              : model.branch_number,
      shopName                  : model.shop_name,
      clientShopId              : model.client_shop_id,
      clientShopName            : model.client_shop_name,
    }
  }
  mapFieldFromApi(model){
    let result = {
      session_token                             : model.sessionToken,
      is_duplicate_blocked_time                 : false,
      is_duplicate_another_booking              : false,
      is_booking_exceeds_work_hours             : false,
      id                                        : model.bookingId,
      client_id                                 : model.clientId,
      client_name                               : model.clientName,
      client_mobile_number                      : model.clientMobileNumber,
      client_member_number                      : model.clientMemberNumber,
      client_registration_date                  : convertTimeStampToDate(model.clientRegistrationDateTS),
      client_registration_date_ts               : model.clientRegistrationDateTS,
      booking_client_type                       : model.bookingClientType,
      display_color                             : model.displayColor,
      is_vip                                    : model.isVip,
      confirmed                                 : model.confirmed,
      booking_date                              : model.bookingDate,
      booking_date_ts                           : model.bookingDateTS,
      send_messages                             : model.sendMessages,
      is_deposit_required                       : model.isDepositRequired,
      notes                                     : model.notes,
      status                                    : model.status,
      booking_source                            : model.bookingSource,
      created_by_id                             : model.createdById,
      created_by_name                           : model.createdByName, 
      registration_date                         : model.registrationDate,
      modification_date                         : model.modificationDate,
      shop_id                                   : model.shopId,
      original_booking_id                       : model.originalBookingId, 
      booked_items_count                        : model.bookedItems.length,
      booked_items                              : [],
      chain_id                                  : model.chainId,
      branch_number                             : model.branchNumber,
      shop_name                                 : model.shopName,
      client_shop_id                            : model.clientShopId,
      client_shop_name                          : model.clientShopName,
      expand                                    : false
    }
    if(model.clientMemberNumber == 0){
      result.client_member_number = null
    }
    if(model.registrationDateTS > 0){
      result.registration_date  = convertTimeStampToDate(model.registrationDateTS)
    }
    if(model.modificationDateTS > 0){
      result.modification_date  = convertTimeStampToDate(model.modificationDateTS)
    }
    if(model.bookedItems != null){
      model.bookedItems = _.sortBy(model.bookedItems, ['isNextDay','startTime'])
      for(let i in model.bookedItems){
        result.booked_items.push(this.mapBookedItemsFromApi(model.bookedItems[i]))
      }
    }

    if(model.repeatBooking != null && model.repeatBooking){
      result.repeat_booking = {
        repeat_booking_id           : model.repeatBooking.repeatBookingId,
        repeat_times                : model.repeatBooking.repeatTimes,
        repeat_type                 : model.repeatBooking.repeatType,
        repeat_dates                : model.repeatBooking.repeatDates,
        repeat_date_tss             : model.repeatBooking.repeatDateTSs,
        repeated_day_of_week        : model.repeatBooking.repeatedDayOfWeek,
      }
    }
    else result.repeat_booking = {
      booking_id          : 0,
      repeat_booking_id   : 0,
      repeat_type         : 2,
      repeat_times        : 1,
      repeat_dates        : [],
      repeat_date_tss     : [],
      repeated_day_of_week: [],
    }

    if(model.bookingDeposit && model.bookingDeposit != null){
      result.booking_deposit = {
        booking_deposit_id          : model.bookingDeposit.bookingDepositId,
        deposit_type                : model.bookingDeposit.depositType,
        due_date                    : model.bookingDeposit.dueDate,
        due_date_ts                 : model.bookingDeposit.dueDateTS,
        amount                      : model.bookingDeposit.amount,
        payment_method_id           : model.bookingDeposit.paymentMethodId,
        payment_method_name         : model.bookingDeposit.paymentMethodName,
        is_added_to_sales           : model.bookingDeposit.isAddedToSales,
      }
    }
    else result.booking_deposit = {
      booking_deposit_id : 0,
      deposit_type       : 1,
      due_date_ts        : '',
      amount             : 0,
      payment_method_id  : 0,
      payment_method_name: 0,
      is_added_to_sales  : true,
    }
    
    // timestamp to date
    result.booking_date = convertTimeStampToDate(result.booking_date_ts)
    if(result.repeat_booking.repeat_date_tss!=null)
      result.repeat_booking.repeat_dates = result.repeat_booking.repeat_date_tss.map(timestamp => convertTimeStampToDate(timestamp))
    result.booking_deposit.due_date = convertTimeStampToDate(result.booking_deposit.due_date_ts)

    return result
  }
  mapBookedItemsToApi(model){
    model = limitFinishingTimeOfBookedItem(model)
    return {
      bookedItemId          : model.booked_item_id,
      serviceName           : model.service_name,
      serviceId             : model.service_id,
      bookingItemId         : model.booking_item_id,
      bookingResourceSetupId: model.booking_resource_setup_id,
      startTime             : model.start_time,
      isNextDay             : model.is_next_day,
      estimatedTime         : model.estimated_time,
      processingTime        : model.processing_time,
      finishingTime         : model.finishing_time,
      deductedPrepaidGoodsRef     : model.deducted_prepaid_goods_ref,
      deductedPrepaidGoodsRefName : model.deducted_prepaid_goods_ref_name,
    }
  }
  mapBookedItemsFromApi(model){
    return {
      booked_item_id            : model.bookedItemId,
      service_name              : model.serviceName,
      service_id                : model.serviceId,
      booking_item_id           : model.bookingItemId,
      booking_resource_setup_id : model.bookingResourceSetupId,
      resource_name             : model.resourceName,
      start_time                : model.startTime,
      is_next_day               : model.isNextDay,
      estimated_time            : model.estimatedTime,
      processing_time           : model.processingTime,
      finishing_time            : model.finishingTime,
      deducted_prepaid_goods_ref      : model.deductedPrepaidGoodsRef,
      deducted_prepaid_goods_ref_name : model.deductedPrepaidGoodsRefName,
    }
  }
  mapBookingCancelToApi(model){
    model = mapSecurityInfo(model)
    return {
      shopId      : model.shop_id,
      sessionToken: model.session_token,
      shopLocation: model.shop_location,
      option      : model.option,
      bookingId   : model.booking_id,
      reason      : model.reason,
      cancelSource: model.cancel_source,
      notes       : model.note
    }
  }
  mapBookingCancelFromApi(model){
    return {
      id                : model.bookingId,
      cancel_booking_id : model.cancelBookingReasonId,
      cancel_source     : model.cancelSource,
      notes             : model.notes
    }
  }
  mapNotBeCanceledBookingsFromApi(model){
    return {
      booking_id        : model.bookingId,
      reason            : model.reason,
      date_ts           : model.dateTS
    }
  }
  mapBookingStatusToApi(model){
    model = mapSecurityInfo(model)
    return {
      shopId      : model.shop_id,
      bookingId   : model.booking_id,
      status      : model.status,
      sessionToken: model.session_token,
      shopLocation: model.shop_location,
    }
  }
  mapBookingStatusFromApi(model){
    return {
      id      : model.bookingId,
      status  : model.status,
      shop_id : model.shopId
    }
  }
  mapBookingConfirmedToApi(model){
    model = mapSecurityInfo(model)
    return {
      shopId      : model.shop_id,
      bookingId   : model.booking_id,
      confirmed   : model.confirmed,
      sessionToken: model.session_token,
      shopLocation: model.shop_location,
    }
  }
  mapBookingConfirmedFromApi(model){
    return {
      id        : model.bookingId,
      confirmed : model.confirmed,
      shop_id   : model.shopId
    }
  }
  mapBookingsSummaryByClientFromApi(model){
    return {
      client_id             : model.clientID,
      total_bookings        : model.totalBookings,
      total_no_show_bookings: model.totalNoShowBookings,
      from_date_ts          : model.fromDateTS,
      to_date_ts            : model.toDateTS,
      shop_id               : model.shopId
    }
  }
  mapParamToApi(query){
    return {
      typeDate                : query.type_date,
      fromDateTS              : convertDateToTimeStamp(query.from_date),
      toDateTS                : convertDateToTimeStamp(query.to_date),
      bookingResourceSetupId  : query.booking_resource_id,
      numberItemWaiting       : query.number_item_waiting,
      shopId                  : query.shop_id,
    }
  }
  setResult(response){
    this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
    this.result.is_ok = response.data.isOK

    if(response.data.isOK) this.result.data = this.mapFieldFromApi(response.data.result)
    return this.result
  }
  mapBookingsFromApi(bookings){
    let mapData = {
      items: [],
      pagination: {}
    }
    let booking_data = {} 
    for(let booking in bookings){
      booking_data = this.mapFieldFromApi(bookings[booking])
      mapData.items.push(booking_data)
    }
    return mapData
  }
  async getAllCalendarSetupsAsync(query){
    let query_data = {
      shopId: query.shop_id
    }

    try {
      const response = await this.http.post(url_read_all_calendar_setups, query_data)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let result = {}
        
        // booking_opening_hour_setup
        if(response.data.result.bookingOpeningHourSetup != null){
          let booking_opening_hour_setup_api = new BookingOpeningHourSetupApi()
          result.booking_opening_hours_setup = booking_opening_hour_setup_api.mapOpeningHourSetupFromApi(response.data.result.bookingOpeningHourSetup)
        }
        else {
          this.result.error_messages.push(i18n.t('bookings.booking-opening-hour-not-setup-yet'))
        }

        // booking_resrouce_setup
        if(response.data.result.bookingResourceSetup.bookingResourcesSetup.length > 0){
          let booking_resource_setup_api = new BookingResourceSetupApi()
          result.booking_resources_setup = booking_resource_setup_api.mapBookingResourcesFromApi(response.data.result.bookingResourceSetup)
          result.booking_resources_setup.items = _.filter(result.booking_resources_setup.items, ['status', options.good_status.active])
        }
        else {
          this.result.error_messages.push(i18n.t('bookings.booking-resource-not-setup-yet'))
        }

        // booking_item_setup
        if(!response.data.result.bookingItemSetup.bookingItemsSetup.useServiceCode && response.data.result.bookingItemSetup.bookingItemsSetup.bookingItems.length == 0){
          this.result.error_messages.push(i18n.t('bookings.booking-item-not-setup-yet'))
        }
        else {
          let booking_item_setup_api = new BookingItemSetupApi()
          result.booking_items_setup = booking_item_setup_api.mapBookingItemSetupFromApi(response.data.result.bookingItemSetup)
        }

        // booking_calendar_setup
        if(response.data.result.bookingCalendarSetup != null){
          let booking_calendar_setting_vm = new BookingCalendarSettingViewModel()
          booking_calendar_setting_vm.mapFieldFromApi(response.data.result.bookingCalendarSetup)
          result.booking_calendar_setup = booking_calendar_setting_vm.getFields()
        }
        else {
          this.result.error_messages.push(i18n.t('bookings.booking-calendar-not-setup-yet'))
        }

        // booking_online_setup
        if(response.data.result.bookingOnlineBooking != null){
          let booking_online_setting_vm = new BookingOnlineBookingSettingViewModel
          booking_online_setting_vm.mapFieldFromApi(response.data.result.bookingOnlineBooking)
          result.booking_online_setup   = booking_online_setting_vm.getFields()
        }
        else {
          this.result.error_messages.push(i18n.t('bookings.booking-online-not-setup-yet'))
        }

        if(this.result.error_messages.length > 0){
          this.result.is_ok = false
          this.result.error_messages = [i18n.t('bookings.missing-calendar-setup'), ...this.result.error_messages]
        }
        
        this.result.data = result
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async getBookingsCalendarAsync(query) {
    query = this.mapParamToApi(query)

    try {
      const response = await this.http.post(url_read_calendar, query)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        this.result.data = this.mapBookingsFromApi(response.data.result.bookings)
        // blocked times on booking calendar
        let blocked_time_api = new BlockedTimeApi()
        let blocked_times = []
        for(let i in response.data.result.blockedTimes){
          let item = blocked_time_api.mapBlockedTimeFieldFromApi(response.data.result.blockedTimes[i])
          blocked_times.push(item)
        }
        this.result.data.blocked_times = blocked_times
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async getBookingListAsync(query) {
    query.from_booking_date_ts  = convertDateToTimeStamp(query.from_booking_date)
    query.to_booking_date_ts    = convertDateToTimeStamp(query.to_booking_date)
    let data_query = {
      typeDate              : query.type_date,
      fromBookingDate       : query.from_booking_date, 
      fromBookingDateTS     : query.from_booking_date_ts, 
      toBookingDate         : query.to_booking_date,
      toBookingDateTS       : query.to_booking_date_ts,
      nameOrMobile          : query.name_or_mobile ,
      bookingResourceSetupId: query.booking_resource_id, 
      status                : query.status, 
      clientId              : query.client_id,
      bookingSource         : query.booking_source,
      ascOrdering           : query.asc_ordering,
      pageSize              : query.page_size,
      pageNumber            : query.page_number, 
      shopId                : query.shop_id,
      chainId               : query.chain_id
    }
    
    try {
      const response = await this.http.post(url_read_booking_list, data_query)  
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) { 
        let mapData = {
          items: [],
          pagination: {}
        }  
        mapData = this.mapBookingsFromApi(response.data.result.items)
        mapData.pagination = mapPagingFromApi(response.data.result.pagingInfo)
        this.result.data = mapData
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async getBookingAsync(query) {
    query = {
      bookingId: query.booking_id,
      shopId: query.shop_id
    }

    try {
      const response = await this.http.post(url_read, query)
      
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        this.result.data = this.mapBookingsFromApi([response.data.result]).items[0]
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }
  async getBookableWaitingsAsync(data) {
    let data_send={
      shopId : data.shop_id ,
      bookingDateTS : convertDateToTimeStamp(data.booking_date),
    } 
    try {
      const response = await this.http.post(url_get_bookable_waiting, data_send)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let waiting_api = new WaitingApi()
        let waitings = []
        for(let i in response.data.result.waitings){
          let item = waiting_api.mapFieldFromApi(response.data.result.waitings[i])
          waitings.push(item)
        }
        this.result.data.waitings = waitings 
      }
    }
    catch(e) { 
      this.http.loadError(e)
    }
    return this.result
  }

  async addBookingAsync(data) {
    let data_send = this.mapFieldToApi(_.cloneDeep(data))
    
    try {
      const response = await this.http.post(url_command, data_send)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        this.result.data = this.mapBookingsFromApi(response.data.result.bookings)
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  }

  async updateBookingAsync(data) {
    let data_send = this.mapFieldToApi(_.cloneDeep(data))
    
    try {
      // var tmp_url = url_command + '?t=' + guid()
      const response = await this.http.put(url_command, data_send)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        // add repeat to booking -> return list of bookings
        this.result.data.bookings = this.mapBookingsFromApi(response.data.result.bookings).items
        this.result.data.booking = this.result.data.bookings[0]
        
        let waiting_api = new WaitingApi()
        this.result.data.bookable_waitings = []
        for(let i in response.data.result.bookableWaitings){
          this.result.data.bookable_waitings.push(waiting_api.mapFieldFromApi(response.data.result.bookableWaitings[i]))
        }
      }
    }
    catch(e) {
      this.http.loadError(e)
    }
    return this.result
  }

  async updateBookingClientAsync(query) {
    query = mapSecurityInfo(query)
    let request = {
      bookingId                   : query.booking_id,
      clientId                    : query.client_id,
      clientMemberNumber          : query.client_member_number,
      clientRegistrationDateTS    : query.client_registration_date_ts,
      clientShopId                : query.client_shop_id,
      clientShopName              : query.client_shop_name,
      shopId                      : query.shop_id,
      shopLocation                : query.shop_location,
      sessionToken                : query.session_token
    }
    
    try {
      const response = await this.http.put(url_update_booking_client, request)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        this.result.data = this.mapBookingsFromApi(response.data.result.bookings)
      }
    }
    catch(e) { 
      this.http.loadError(e)
    }
    return this.result
  }

  async updateBookingStatusAsync(data) {
    let data_send = this.mapBookingStatusToApi(_.cloneDeep(data))
    
    try {
      const response = await this.http.put(url_update_booking_status, data_send)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        this.result.data = this.mapBookingStatusFromApi(response.data.result)
      }
    }
    catch(e) { 
      this.http.loadError(e)
    }
    return this.result
  }
  async updateBookingConfirmedAsync(data) {
    let data_send = this.mapBookingConfirmedToApi(_.cloneDeep(data))
    
    try {
      const response = await this.http.put(url_update_booking_confirmed, data_send)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        this.result.data = this.mapBookingConfirmedFromApi(response.data.result)
      }
    }
    catch(e) { 
      this.http.loadError(e)
    }
    return this.result
  }
  async cancelBookingAsync(data) {
    let data_send = this.mapBookingCancelToApi(_.cloneDeep(data))
    try {
      const response = await this.http.delete(url_cancel_booking, data_send)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      
      if(this.result.is_ok) {
        this.result.data.cancel_bookings = []
        for(let i in response.data.result.cancelRepeatBookings){
          this.result.data.cancel_bookings.push(this.mapBookingCancelFromApi(response.data.result.cancelRepeatBookings[i]))
        }

        let waiting_api = new WaitingApi()
        this.result.data.bookable_waitings = []
        for(let i in response.data.result.bookableWaitings){
          this.result.data.bookable_waitings.push(waiting_api.mapFieldFromApi(response.data.result.bookableWaitings[i]))
        }
      }
      else {
        this.result.data.not_be_canceled_bookings = []
        for(let i in response.data.result.notBeCanceledBookings){
          this.result.data.not_be_canceled_bookings.push(this.mapNotBeCanceledBookingsFromApi(response.data.result.notBeCanceledBookings[i]))
        }
      }
    }
    catch(e){
      return this.http.loadError(e)
    }
    return this.result
  } 
  async changingWaitingToBookingAsync(data) {
    let data_send = this.mapFieldToApi(_.cloneDeep(data)) 
    data_send.waitingId = data.waiting_id
    data_send.fromTime = data.from_time
    data_send.toTime = data.to_time
    
    try {
      const response = await this.http.post(url_command_change_waiting_to_booking, data_send)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        this.result.data = this.mapBookingsFromApi(response.data.result.bookings)
      }
    }
    catch(e) { 
      this.http.loadError(e)
    }
    return this.result
  }
  async getUpcomingRepeatedBookings(query){
    let data_send = {
      bookingId         : query.booking_id,
      bookingDateTS     : query.booking_date_ts,
      originalBookingId : query.original_booking_id,
      shopId            : query.shop_id
    }
    try {
      const response = await this.http.post(url_read_upcomming_repeated_bookings, data_send)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        this.result.data = response.data.result
      }
    }
    catch(e){
      this.http.loadError(e)
    }
    return this.result
  }
  async getBookingsSummaryByClient(query){
    let data_send = {
      clientId: query.client_id,
      shopId  : query.shop_id
    }
    try {
      const response = await this.http.post(url_read_bookings_summary_by_client, data_send)
      this.result.is_ok = response.data.isOK
      this.result.error_messages = this.http.mapErrorsFromApi(response.data.errorMessages)
      if(this.result.is_ok) {
        let booking_summary_vm = new BookingSummaryViewModel()
        booking_summary_vm.mapFieldFromApi(response.data.result)
        this.result.data = booking_summary_vm.getFields()
      }
    }
    catch(e){
      this.http.loadError(e)
    }
    return this.result
  }
}