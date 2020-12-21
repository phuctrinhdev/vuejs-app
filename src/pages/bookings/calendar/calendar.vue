<template>
  <main class="app-content">
    <section class="content bookings-page">
      <div class="inner">
        <div class="dsmart">
          <div class="rh-booking-cld ct-container ct-padding booking-calendar">
            <div v-if="blocked_time_mode" class="col-sm-12 notify">{{ $t('bookings.click-calendar-to-add-blocked-time') }}
              <div class="btn" @click="onAddBlockedTimeMode(false)">x</div>
            </div>
            <div v-if="calendar_specs.calendar_cell_mode === options.booking.calendar_cell_mode.move_booking" 
                 class="col-sm-12 notify moving-booking-cell-mode">{{ $t('bookings.click-calendar-select-date-time') }}
              <div class="btn" @click="onCalendarCellModeChange(options.booking.calendar_cell_mode.add_booking)">x</div>
            </div>
            <div class="row wrap">
              <button class="btn left-calendar-trigger" @click="onTriggerShowLeftCalendar">
                <span v-show="show_left_calendar" class="hide-text"/>
                <span v-show="!show_left_calendar" class="show-text"/>
              </button>
              <div v-show="show_left_calendar" id="sidebar">
                <div class="widgets">
                  <section class="widget datepicker-wrapper">
                    <v-date-picker v-model="date_picker" :formats="{ title: 'MM-YYYY' }"
                                   is-inline @input="onChangeDatePicker(date_picker, true)"/>
                  </section>
                  <section class="widget waiting-list-wrapper">
                    <div class="top-title">
                      <h4 class="widget-title">{{ $t('bookings.waiting-list') }}</h4>
                      <div class="list-button">
                        <b-btn class="btn btn-add-waiting" @click="onActionWaiting(options.form_actions.add, {})">+</b-btn>
                        <b-btn v-b-modal.waiting-list-modal class="btn btn-waiting-list">=</b-btn>
                      </div>
                    </div>
                    <div class="box-section">
                      <waiting-items ref="waitings_calendar" :skin="bookings_options.waiting_list_skin.mini" @canceled-waiting="onActionWaitingSuccess"/>
                    </div>
                  </section>
                </div>
              </div>
              <div id="content-table" :class="{ 'calendar-full': !show_left_calendar }">
                <div :class="{ 'has-view-more-resource-block': canbe_displayed_resource_block_max > 1 }" class="top-table">
                  <div class="working-staff">
                    <div class="form-group">
                      <b-form-select v-model="selected_resources" value-field="id" text-field="resource_name" 
                                     @change="onChangeSelectedResources()"
                                     @mouseleave.native="onMouseLeaveSelect">
                        <option v-for="resource in selected_resources_options" :key="resource.id" 
                                :value="resource.id">{{ resource.resource_name }}</option>
                      </b-form-select>
                    </div>
                  </div>
                  <div class="choose-date">
                    <ul class="list-pagination">
                      <li class="prev-date">
                        <a href="#" @click.prevent="onChangeDates(options.booking.view_direction.prev)">&lt;</a>
                      </li>
                      <li class="current-date">
                        <v-date-picker v-model="date_picker" :formats="{ title: 'MM-YYYY' }" 
                                       :popover="{ placement: 'bottom', visibility: 'hover' }"
                                       @input="onChangeDatePicker(date_picker, true)">
                          <div>{{ formatDateBySetting(x_date_picker) }}</div>
                        </v-date-picker>
                      </li>
                      <li class="next-date">
                        <a href="#" @click.prevent="onChangeDates(options.booking.view_direction.next)">&gt;</a>
                      </li>
                    </ul>
                  </div>
                  <div class="calendar-mode list-option">
                    <ul class="list-button">
                      <li :class="{ 'active': (x_calendar_view_mode===calendar_daily_mode)}" 
                          @click.prevent="onChangeCalendarViewMode(calendar_daily_mode)">
                        <a href="#">{{ $t('general.day') }}</a>
                      </li>
                      <li :class="{ 'active': (x_calendar_view_mode===calendar_weekly_mode)}" 
                          @click.prevent="onChangeCalendarViewMode(calendar_weekly_mode)">
                        <a href="#">{{ $t('general.week') }}</a>
                      </li>
                    </ul>
                    <b-dropdown right text="=" class="more-option" >
                      <b-dropdown-item v-b-modal.add-client-modal><a @click="onActionClient">{{ $t('bookings.add-client') }}</a></b-dropdown-item>
                      <b-dropdown-item><a @click="onActionWaiting(options.form_actions.add, {})">{{ $t('bookings.add-waiting') }}</a></b-dropdown-item>
                      <b-dropdown-item v-b-modal.waiting-list-modal><a @click="onActionWaitingList">{{ $t('bookings.waiting-list') }}</a></b-dropdown-item>
                      <b-dropdown-item v-b-modal.booking-list-modal><a @click="onActionBookingList">{{ $t('bookings.booking-list') }}</a></b-dropdown-item>
                      <b-dropdown-item>
                        <a @click="onAddBlockedTimeMode(true)">{{ $t('bookings.add-blocked-time') }}</a>
                      </b-dropdown-item>
                      <b-dropdown-item>
                        <router-link :to="{ name: 'booking-opening-hours' }">{{ $t('bookings.setup') }}</router-link>
                      </b-dropdown-item>
                    </b-dropdown>
                  </div>
                  <div class="working-staff mobile">
                    <div class="form-group">
                      <b-form-select v-model="selected_resources" value-field="id" text-field="resource_name" 
                                     @change="onChangeSelectedResources()">
                        <option v-for="resource in selected_resources_options" :key="resource.id" 
                                :value="resource.id">{{ resource.resource_name }}</option>
                      </b-form-select>
                    </div>
                  </div>
                  <div v-if="canbe_displayed_resource_block_max > 1" class="load-resources">
                    <button :disabled="canbe_displayed_resource_block_mobile <= 1"
                            class="btn prev" 
                            @click="onViewMoreResourceBlock(options.booking.view_direction.prev)">➞</button>
                    <button :disabled="canbe_displayed_resource_block_mobile >= canbe_displayed_resource_block_max" 
                            class="btn next" 
                            @click="onViewMoreResourceBlock(options.booking.view_direction.next)">➞</button>
                  </div>
                </div>
                <div class="hide">calendar_created_duration: {{ calendar_created_duration.toFixed(3) }}</div>

                <calendar-view v-if="!isNullObject(calendar_views_data.booking_setup)" :key="calendar_view_generated_key" 
                               :is_mobile="is_mobile"
                               :calendar_specs="calendar_specs" :calendar_data="calendar_views_data"
                               @calendar-cell-mode-changed="onCalendarCellModeChange"
                               @resource-and-view-mode-changed="onResourceAndViewModeChanged"/>

                <div class="block-color clearfix hide">
                  <ul class="list-color row">
                    <li v-for="status in options.booking.option_booking_status" :key="status.index" class="col-6 col-sm-4 col-md-3 item">
                      <div class="row inner-item flex-center">
                        <span :style="{ background: status.color }" class="col-2 color"/>
                        <span class="col-10 note-color">{{ $t(status.text) }}</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <alert-confirm :id="alert_exceed_max_calendar_cols_id" :data_alerts="alert_exceed_max_calendar_cols_data"
                   :hide_yes="alert_hide_yes" :label_no="alert_label_no"
                   @cancel="onCancelAlertExceedMaxCalendarCols"/>

    <waiting-list ref="waiting_list"/>
    <waiting-action @action-waiting-success="onActionWaitingSuccess"/>

    <booking-list ref="booking_list" @cancel-booking="onActionBookingCancel" @show-calendar="onShowCalendar"/>
    <booking-action @edited-booking="onEditedBooking" @changed-waiting-to-booking="onChangedWaitingToBooking"/>
    <cancel-repeat-booking/>

    <blocked-time-action/>

    <client-action ref="client_action"/>
    <booking-connect-client/>
  </main>
</template>

<script>
// Utils
import _ from 'lodash'
import moment from 'moment'
import {
  convertDateToTimeStamp, 
  formatDateBySetting,
  cache_session,
  convertHoursToRow, 
  convertMinutesToHours, 
  convertHoursToMinutes, 
  guid,
  convertDateToTimezone,
  convertHourToTimezone,
  logTime,
  isExceedMaxCalendarCols
} from '../../../helpers/common'
import { options } from '../../../helpers/options'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { CALENDAR_VIEW_MODE }   from '../../../config/constant'
import ClientViewModel from '../../../view-model/clients/client-view-model'
import { bookings_options } from '../../../helpers/options/bookings-options'
import CancelBookingActionData  from '../../../view-model/actions/bookings/cancel-booking-action-data'

// Components
import { setupCalendar, DatePicker } from 'v-calendar'
import alert_confirm          from '../../../components/common/alert/alert-confirm'
import component_base         from '../../../components/common/component-base/component-base'
import client_action          from '../../../components/clients/client-action/client-action.vue'
import calendar_view          from '../../../components/bookings/bookings/calendar-view/calendar-view'
import booking_action         from '../../../components/bookings/bookings/booking-action/booking-action'
import CalendarViewData         from '../../../components/bookings/bookings/calendar-view/calendar-view-data'
import cancel_repeat_booking  from '../../../components/bookings/bookings/cancel-repeat-booking/cancel-repeat-booking'
import blocked_time_action    from '../../../components/bookings/bookings/blocked-time-action/blocked-time-action'
import booking_list           from '../../../components/bookings/bookings/booking-list/booking-list'
import waiting_list           from '../../../components/bookings/bookings/waiting-list/waiting-list'
import waiting_items          from '../../../components/bookings/bookings/waiting-items/waiting-items'
import waiting_action         from '../../../components/bookings/bookings/waiting-action/waiting-action'
import booking_connect_client from '../../../components/bookings/bookings/booking-connect-client-action/booking-connect-client-action'

export default {
  components: {
    'v-date-picker': DatePicker,
    'calendar-view': calendar_view,
    'blocked-time-action': blocked_time_action, 
    'booking-action': booking_action,
    'cancel-repeat-booking': cancel_repeat_booking,

    'waiting-list': waiting_list,
    'waiting-items': waiting_items,
    'waiting-action': waiting_action,
    
    'booking-list': booking_list,
    'alert-confirm': alert_confirm,
    'client-action': client_action,
    'booking-connect-client': booking_connect_client,
  },
  extends: component_base,
  data(){
    return {
      options,
      bookings_options,

      calendar_specs: {
        calendar_cell_mode: options.booking.calendar_cell_mode.add_booking
      },
      calendar_views_data: new CalendarViewData(),
      selected_resources: options.selected_resources_options.all,
      selected_resources_options: [],

      // booking-setup
      booking_setup: {},
      booking_opening_hours_setup: [],
      booking_resources_setup: [],
      booking_calendar_setup: {},
      booking_online_setup: {},
      booking_items_setup: {},
      start_time_options: [],
      workhour_shop: {
        start_row: 0,
        finish_row: 0
      },
      
      // blocked-times data
      blocked_time_mode: false,
      blocked_times: [],

      // calendar style
      show_left_calendar: true,
      canbe_displayed_resource_block_mobile: 1,
      canbe_displayed_resource_block_max: 1,
      
      // date picker
      date_picker: convertDateToTimezone(new Date()),
      prev_date_picker: convertDateToTimezone(new Date()), //fix "click on the same date" issue
      calendar_daily_mode: CALENDAR_VIEW_MODE.DAILY,
      calendar_weekly_mode: CALENDAR_VIEW_MODE.WEEKLY, 
      calendar_view_mode: CALENDAR_VIEW_MODE.DAILY, 
      displaying_dates_on_calendar: [],

      is_mobile: this.isMobile(),
      calendar_created_start: 0,
      calendar_created_end: 0,
      calendar_created_duration: 0,

      alert_exceed_max_calendar_cols_id: 'alert-exceed-max-calendar-cols-modal',
      alert_exceed_max_calendar_cols_data: [],
      alert_hide_yes: true,
    }
  },
  computed: {
    ...mapGetters('alert', {
      x_alerts: 'getAlerts',
    }),
    ...mapGetters('booking', {
      x_bookings: 'getBookingCalendar',
      x_date_picker: 'getDatePicker',
      x_calendar_view_mode: 'getCalendarViewMode',
      x_forced_reload_key: 'getCalendarForcedReloadKey'
    }),
    ...mapGetters('waiting', {
      x_waitings_calendar: 'getWaitingsCalendar',
    }),
    calendar_view_generated_key(){
      let calendar_key = 'calendar-view-key-' + 
                         this.x_calendar_view_mode +'-'+ 
                         convertDateToTimeStamp(this.x_date_picker) +'-'+ 
                         this.x_forced_reload_key
      this.loadCalendarViewsData()
      return calendar_key
    },
    resource_all_text(){return this.$i18n.t('general.all')},
    resource_working_staffs_text(){return this.$i18n.t('bookings.working-staffs')},
    exceed_max_calendar_cols(){return this.$i18n.t('bookings.exceed-max-calendar-cols')},
    alert_label_no(){return this.$i18n.t('general.close')}
  },
  async created(){
    this.calendar_created_start = logTime()

    // LOAD BOOKING SETUP, Booking-calendar & Blocked-time
    try{
      this.preLoader()
      this.booking_setup = await cache_session.getBookingSetupCache(this.shop_data.shop_id)
      if(!this.isMissingCalendarSetup(this.booking_setup)){
        this.setDatePickerData(convertDateToTimezone(new Date()))
        this.date_picker = this.x_date_picker
        this.prev_date_picker = this.x_date_picker

        this.calendar_view_mode = this.x_calendar_view_mode
        this.loadBookingSetup()
        this.loadResourcesToDropDown(this.calendar_view_mode)
        this.loadCalendarViewsData()
      }
      this.preLoader(false)
    }
    catch{
      this.preLoader(false)
    }
    
    if(this.isMissingCalendarSetup(this.booking_setup))
      this.showAlert(this.booking_setup.error_messages)
    else{
      this.loadWaitingsCalendar()
    }
    
    this.calendar_created_end = logTime()
    this.calendar_created_duration = this.calendar_created_end - this.calendar_created_start
  },
  beforeMount(){
    setupCalendar({
      locale: this.locale,
      firstDayOfWeek: 2,
      titleTransition: 'none',
      weeksTransition: 'none',
      datePickerTintColor: '#3499db'
    })
    this.setShowMenuPcData({ is_show: false }) // auto hide menu pc when load calendar
  },
  mounted() {
    // console.log(1, 'calendar-mounted', logTime())
  },
  updated(){
    // sync date_picker with store (include click Calendar button on header)
    this.date_picker = this.x_date_picker
    // console.log(1, 'calendar-mounted', logTime())
  },
  beforeRouteLeave(to, from, next) {
    // reset booking_client from client vuex store
    this.setBookingClient(new ClientViewModel().fields)
    next()
  },
  methods: {
    ...mapActions('alert', [
      'setAlertsData'
    ]),
    ...mapActions('booking', [
      'setBookingHelpsData',
      'setDatePickerData',
      'setCalendarViewModeData',
      'setCalendarForcedReloadKeyData'
    ]),
    ...mapActions('booking_cancel', [
      'setBookingCancelActionData'
    ]),  
    ...mapActions('menu', [
      'setShowMenuPcData'
    ]),
    ...mapActions('waiting', [
      'getWaitingsCalendarDataAsync',
      'setWaitingActionData',
    ]),
    ...mapMutations('client', [
      'setBookingClient',
    ]),
    formatDateBySetting,
    //preparing data of calendar. It must be called when
    //- first load 
    //- selected resources are changed
    loadCalendarViewsData(){
      let tmp_selected_dates_ts = []
      let tmp_selected_resources = {}
      let number_of_displayed_dates = 1
      this.displaying_dates_on_calendar = [this.x_date_picker]
      if(!this.isNullObject(this.booking_setup)){
        if(this.x_calendar_view_mode === CALENDAR_VIEW_MODE.WEEKLY){
        //calculate to_date and displaying_dates_on_calendar
          number_of_displayed_dates = 7
        }
        else if(this.x_calendar_view_mode === CALENDAR_VIEW_MODE.DAILY){
          if(!this.isNullObject(this.booking_setup)){
            if(this.booking_setup.booking_calendar_setup.number_of_day>1 && !this.is_mobile){
              number_of_displayed_dates = this.booking_setup.booking_calendar_setup.number_of_day
            }
          }
        }
        if(number_of_displayed_dates>1){
          for(let i = 1; i < number_of_displayed_dates; i++){
            this.displaying_dates_on_calendar.push(moment(this.x_date_picker).add(i, 'days').toDate())
          }
        }
      }
      
      for(let i in this.displaying_dates_on_calendar){
        let date_ts = convertDateToTimeStamp(this.displaying_dates_on_calendar[i])
        tmp_selected_dates_ts.push(date_ts)
        tmp_selected_resources[date_ts] = this.getSelectedResourceSetupIdsByWorkingDate(this.displaying_dates_on_calendar[i])
      }
      let calendar_view_data = new CalendarViewData(this.booking_setup,
        tmp_selected_resources,
        this.displaying_dates_on_calendar,
        tmp_selected_dates_ts,
        this.x_calendar_view_mode,
        this.canbe_displayed_resource_block_mobile)
      this.calendar_views_data = calendar_view_data

      if(this.is_mobile){
        this.canbe_displayed_resource_block_max = Math.ceil(this.calendar_views_data.getMaxDisplayedResourcesByDate(0) / 4)
      }
    },

    //get resources can be displayed on each calendar based on
    //- working date (selected date on calendar) 
    //- selecting resources's option: all, working resources, individual resources, etc
    getSelectedResourceSetupIdsByWorkingDate(working_date){
      let resource_setup_ids = []
      let all_resource_setup_ids = []
      let working_resource_setup_ids = []
      if(!this.isNullObject(this.booking_setup)){
        if(this.x_calendar_view_mode === CALENDAR_VIEW_MODE.DAILY){
          //these options only are vaild in CALENDAR_VIEW_MODE.DAILY
          for(let i in this.booking_setup.booking_resources_setup.items){
            let resource = this.booking_setup.booking_resources_setup.items[i]
            all_resource_setup_ids.push(resource.id)
            if(this.checkWorkingDateOfResource(working_date, resource)) working_resource_setup_ids.push(resource.id)
          }
        }
      
        if(this.selected_resources === options.selected_resources_options.all){
          resource_setup_ids = all_resource_setup_ids
        }
        else if(this.selected_resources === options.selected_resources_options.working_staffs){
          if(working_resource_setup_ids.length == 0) working_resource_setup_ids = all_resource_setup_ids
          resource_setup_ids = working_resource_setup_ids
        }
        else {
          resource_setup_ids = [this.selected_resources]
        }
      }

      return resource_setup_ids
    },

    loadResourcesToDropDown(calendar_view_mode){
      if(!this.isNullObject(this.booking_setup)){
        if(calendar_view_mode === CALENDAR_VIEW_MODE.DAILY){
          this.selected_resources_options = [
            { id: options.selected_resources_options.all,            resource_name: this.resource_all_text },
            { id: options.selected_resources_options.working_staffs, resource_name: this.resource_working_staffs_text }
          ]
        }
        else this.selected_resources_options = []
       
        for(let i in this.booking_setup.booking_resources_setup.items){
          let resource_setup = this.booking_setup.booking_resources_setup.items[i]
          this.selected_resources_options.push(resource_setup)
        }
        if(this.selected_resources_options.length>0){
          if(this.calendar_view_mode === CALENDAR_VIEW_MODE.WEEKLY){
            //only reset selected resource option if it is not 'invidual' option
            if(this.selected_resources=== options.selected_resources_options.all ||
            this.selected_resources=== options.selected_resources_options.working_staffs)
              this.selected_resources = this.selected_resources_options[0].id
          }
        }
      }
    },

    loadBookingSetup(){
      this.booking_opening_hours_setup     = this.booking_setup.booking_opening_hours_setup.opening_hours
      this.booking_repeated_off_days_setup = this.booking_setup.booking_opening_hours_setup.repeated_off_days
      this.booking_specific_off_days_setup = this.booking_setup.booking_opening_hours_setup.specific_off_days
      this.booking_resources_setup         = this.booking_setup.booking_resources_setup.items
      this.booking_calendar_setup          = this.booking_setup.booking_calendar_setup
      this.booking_online_setup            = this.booking_setup.booking_online_setup
      this.booking_items_setup             = this.booking_setup.booking_items_setup

      // start-finish time on calendar
      this.booking_table_time_start  = convertHoursToMinutes(_.head(_.sortBy(this.booking_opening_hours_setup, 'start_time')).start_time)
      let opening_cross_date = this.booking_opening_hours_setup.filter(opening => opening.cross_date == true)
      if(opening_cross_date.length > 0){
        this.booking_table_time_finish = convertHoursToMinutes(_.last(_.sortBy(opening_cross_date, 'finish_time')).finish_time)
        this.booking_table_time_finish += options.minutes_of_24h
      }
      else this.booking_table_time_finish = convertHoursToMinutes(_.last(_.sortBy(this.booking_opening_hours_setup, 'finish_time')).finish_time)

      let time_slot = this.booking_calendar_setup.booking_time_slot
      this.time_working_duration = (this.booking_table_time_finish - this.booking_table_time_start) / time_slot
      
      for(let i = 0; i < this.time_working_duration; i++) {
        let time_slot_string = convertMinutesToHours(this.booking_table_time_start + i * time_slot)
        if(convertHoursToMinutes(time_slot_string) >= options.minutes_of_24h) {
          time_slot_string = convertMinutesToHours(convertHoursToMinutes(time_slot_string) - options.minutes_of_24h)
        }
        let start_time_option = {
          id: time_slot_string, 
          time: time_slot_string
        }
        this.start_time_options.push(start_time_option)
      }
      this.start_time_options = _.orderBy(this.start_time_options, ['time'], ['asc'])

      this.generateWorkHourTimeSlot()

      // store shared data
      let estimated_time_options = []
      let n = 300/this.booking_calendar_setup.booking_time_slot
      for(let i = 1; i <= n; i++){
        let time = i * this.booking_calendar_setup.booking_time_slot
        estimated_time_options.push({ id: time, time: time })
      }
      let booking_helps = {
        start_time_options: this.start_time_options, 
        estimated_time_options: estimated_time_options,
      }
      this.setBookingHelpsData(booking_helps)

      if(isExceedMaxCalendarCols(this.booking_calendar_setup.number_of_day, this.booking_resources_setup.length))
        this.showAlertExceedMaxCalendarCols()
    },

    checkWorkingDateOfResource(working_date, resource){
      let working_day = Number(moment(working_date).format('d'))

      for(let i in resource.specific_off_days){
        let resource_off_day = resource.specific_off_days[i]
        let resource_off_day_format = moment(resource_off_day).format(options.standard_date_format.ymd)
        let working_date_format     = moment(working_date).format(options.standard_date_format.ymd)
        if(working_date_format == resource_off_day_format) {
          return false
        }
      }
      
      for(let i in resource.opening_hours){
        let resource_opening_hour = resource.opening_hours[i]
        let opened_days_of_week = resource_opening_hour.opened_days_of_week
        
        if(opened_days_of_week.indexOf(working_day) > -1) {
          return true
        }
      }

      return false
    },

    forceUpdateCalendarView(){
      this.setCalendarForcedReloadKeyData(guid())
    },

    generateWorkHourTimeSlot(){
      for(let i in this.booking_opening_hours_setup){
        let opening_hour = this.booking_opening_hours_setup[i]
        if(!this.isNullObject(opening_hour)){
          let days = opening_hour.opened_days_of_week
          let day_picker = Number(moment(this.x_date_picker).format('d'))

          if(days.indexOf(day_picker) > -1){
            this.workhour_shop.start_row  = convertHoursToRow(opening_hour.start_time, this.booking_setup)
            this.workhour_shop.finish_row = convertHoursToRow(opening_hour.finish_time, this.booking_setup)
            break
          }
        }
      }
    },

    loadWaitingsCalendar(){
      let query = {
        type_date: options.type_date.date_range,
        status: options.waiting_status.new_waiting,
        from_waiting_date: convertDateToTimezone(new Date()),
        to_waiting_date: new Date('2100-01-01'), // get waiting from today to future
        name_or_mobile: '',
        booking_resource_setup_id: 0,
        client_id: 0,
        bookable_waiting: false,
        asc_ordering: true,
        page_size: options.pagination.small,
        page_number: 1,
        shop_id: this.shop_data.shop_id
      }
      this.getWaitingsCalendarDataAsync(query)
    },

    ///////////////////////////////////////////////////////////////
    // Component Event's handlers
    ///////////////////////////////////////////////////////////////
    onActionWaitingList(){
      this.onAddBlockedTimeMode(false)
    },

    onActionBookingCancel(booking){
      if(booking.id > 0) booking.booking_id = booking.id
      
      let booking_cancel = new CancelBookingActionData(
        booking.booking_id,
        booking.booked_items,
        booking.client_name,
        booking.booking_date,
        booking.booking_date_ts,
        booking.original_booking_id,
        booking.start_time,
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
      if(booking.original_booking_id == null){
        this.showDialogById('booking-cancel-action-modal')
      }
      else {
        this.showDialogById('cancel-repeat-booking-modal')
      }
    },

    onActionClient(){
      this.onAddBlockedTimeMode(false)
    },

    onChangeCalendarViewMode(calendar_view_mode){
      this.setCalendarViewModeData(calendar_view_mode)

      if(this.calendar_view_mode === calendar_view_mode)
        this.forceUpdateCalendarView()  

      this.calendar_view_mode = calendar_view_mode
      this.loadResourcesToDropDown(calendar_view_mode)
    },
    
    onActionBookingList(){
      this.onAddBlockedTimeMode(false)
    },

    onTriggerShowLeftCalendar(){
      this.show_left_calendar = !this.show_left_calendar
    },

    onShowCalendar(booking){
      this.onResourceAndViewModeChanged(booking.booking_date, options.selected_resources_options.all, this.calendar_daily_mode)
    },

    onActionWaiting(action, waiting = {}){
      this.waiting_action = {
        action: action,
        data: waiting 
      } 
      this.setWaitingActionData(this.waiting_action)    
      this.showDialogById('waiting-action-modal')
    },
    onCalendarCellModeChange(new_cell_mode){
      this.calendar_specs.calendar_cell_mode = new_cell_mode
    },
    onAddBlockedTimeMode(value){
      if(value === false)
        this.calendar_specs.calendar_cell_mode = options.booking.calendar_cell_mode.add_booking
      else
        this.calendar_specs.calendar_cell_mode = options.booking.calendar_cell_mode.add_blocked_time
      this.blocked_time_mode = value
    },

    onChangeDates(direction){
      this.preLoader()
      let number_of_days = 1
      if(!this.is_mobile){
        if(this.calendar_view_mode === options.booking.calendar_view_mode.weekly)
          number_of_days = 7
        else if(this.calendar_view_mode === options.booking.calendar_view_mode.daily)
          number_of_days = this.booking_calendar_setup.number_of_day
      }
      
      if(direction === options.booking.view_direction.prev)
        number_of_days = -number_of_days
      let date_picker = moment(this.x_date_picker).add(number_of_days, 'days').toDate()
      this.onChangeDatePicker(date_picker)
    },
    onChangeDatePicker(date, is_selectd_on_calendar = false){
      // when select date on left small calendar, hour = 00:00:00
      // then set hour by date_settting hour
      if(is_selectd_on_calendar) date = convertHourToTimezone(date)
      if(!moment(date).isValid()) {
        if(moment(this.prev_date_picker).isValid())
          date = this.prev_date_picker
        else
          date = convertDateToTimezone(new Date())
      }
      this.canbe_displayed_resource_block_mobile = 1
      this.date_picker = date
      this.prev_date_picker = date
      this.setDatePickerData(date)
      this.forceUpdateCalendarView()
    },

    onChangeSelectedResources(){
      this.loadCalendarViewsData()
    },
    onResourceAndViewModeChanged(booking_date, resource_setup_id, calendar_view_mode){
      this.date_picker = booking_date
      this.setDatePickerData(booking_date)
      this.selected_resources = resource_setup_id
      this.onChangeCalendarViewMode(calendar_view_mode)
    },
    onViewMoreResourceBlock(direction){
      if(direction === options.booking.view_direction.prev){
        this.canbe_displayed_resource_block_mobile -= 1 
      }
      else this.canbe_displayed_resource_block_mobile += 1
    },
    showAlertExceedMaxCalendarCols(){
      this.alert_exceed_max_calendar_cols_data = [this.exceed_max_calendar_cols]
      this.showDialogById(this.alert_exceed_max_calendar_cols_id)
    },
    onCancelAlertExceedMaxCalendarCols(){
      this.$router.push('/booking-calendar-settings')
    },
    onEditedBooking(){
      if(this.$refs.booking_list.is_showed){
        this.$refs.booking_list.loadBookingList()
      }
    },
    onActionWaitingSuccess(){
      // waiting bookable
      this.hideDialogById('waiting-list-bookable-modal')

      // waiting calendar
      this.loadWaitingsCalendar()

      // waiting list
      if(this.$refs.waiting_list.is_showed)
        this.$refs.waiting_list.loadWaitingList()
    },
    onChangedWaitingToBooking(){
      this.$refs.waiting_list.loadWaitingList()
      this.loadWaitingsCalendar()
    },
  }
}
</script>

<style lang='scss'>
@import './calendar.scss';
</style>