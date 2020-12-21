<template>
  <div id="calendar-table" :style="{ height: calendar_height }"
       class="calendar-view full-table table-responsive">
    <div class="hide">calendar_view_created_duration: {{ calendar_view_created_duration.toFixed(3) }}</div>
    
    <alert-confirm :id="alert_id" :title="alert_title" :data_alerts="alert_data"
                   :label_yes="alert_label_yes" :hide_yes="alert_hide_yes" 
                   :label_no="alert_label_no" :hide_no="alert_hide_no"
                   @confirm="onAlertConfirmAsync" @cancel="onAlertCancel"/>
    <cancel-booking @cancel-booking-success="onCancelBookingSuccess"/>

    <table v-if="computed_calendar_data.booking_table.cols.length>0" :key="canlendar_view_key" class="booking-table table table-bordered">
      <thead id="calendar-head">
        <tr v-if="calendar_data.isShowedSeveralDatesInDailyViewMode(options.booking.calendar_view_mode.daily)" class="thead-first-row">
          <th :style="{ 'max-width': calendar_first_col_width + 'px' }"
              scope="col" rowspan="2" class="first-col">
            <span>{{ $t('general.time') }}</span>
          </th>
          <th v-for="(date, index) in calendar_data.calendar_dates" :key="index"
              :style="{ 'min-width': table_cell_width + 'px' }"
              :colspan="calendar_data.getMaxDisplayedResourcesByDate(index)" scope="col">
            <span>{{ formatDateBySetting(date) }}</span>
          </th>
        </tr>
        <tr class="thead-second-row">
          <th v-if="!calendar_data.isShowedSeveralDatesInDailyViewMode(options.booking.calendar_view_mode.daily)"
              :style="{ 'max-width': calendar_first_col_width + 'px' }"
              scope="col" class="first-col">
            <span>{{ $t('general.time') }}</span>
          </th>
          <th v-for="(col, index) in computed_calendar_data.booking_table.cols" ref="calendar_cols" 
              :key="index"
              :style="{ 'min-width': table_cell_width + 'px' }"
              scope="col">
            <span :class="{ 'long-name': computed_calendar_data.booking_table.cols >= 4 && col.name.length > 10 }">{{ col.name }}</span>
            <div class="resource-menu-wrapper">
              <div class="resource-menu-content">
                <ul>
                  <li @click.prevent="onChangeResourceAndViewMode(col, options.booking.calendar_view_mode.weekly)">
                    <a href="#">{{ $t('bookings.week-view') }}</a>
                  </li>
                  <li @click.prevent="onChangeResourceAndViewMode(col, options.booking.calendar_view_mode.daily)">
                    <a href="#">{{ $t('bookings.day-view') }}</a>
                  </li>
                  <li @click.prevent="openBlockedTimeActionDialog(options.form_actions.add, {}, col, {})">
                    <a href="#">{{ $t('bookings.add-blocked-time') }}</a>
                  </li>
                </ul>
              </div>
            </div>
          </th>
        </tr>
      </thead>
      <tbody class="calendar-body">
        <tr v-for="(row, row_index) in computed_calendar_data.booking_table.rows" :key="row_index">
          <th scope="row"><span>{{ row.text }}</span></th>
          <td v-for="(col, col_index) in computed_calendar_data.booking_table.cols" :key="col_index" :style="{ width: table_cell_width + 'px', height: table_cell_height + 'px' }">
            <calendar-cell :is_mobile="is_mobile"
                           :key="loadCellData(col_index, row_index).getKey(computed_calendar_data.force_update_cells_key)"
                           :col_index="col_index"
                           :col="col" :row="row"
                           :calendar_specs="calendar_specs"
                           :cell_data="loadCellData(col_index, row_index)"
                           :calendar_head_col_width="calendar_head_col_width"
                           @on-moving-booking-start="onMovingBookingStart"
                           @on-moving-booking-stop="onMovingBookingStopAsync"
                           @on-click-checkout-information="onClickCheckoutInformation"
                           @validate-and-save-drop-booking="validateAndSaveDropBookingAsync"
                           @validate-and-save-resized-booking="validateAndSaveResizedBookingAsync"
                           @validate-and-save-blocked-time="validateAndSaveBlockedTimeAsync"/>
          </td>
        </tr>
      </tbody>
    </table>

    <sales-detail :is_call_api="false" />
  </div>
</template>

<script>
//Helpers, 3rd components
import _                          from 'lodash'
import moment                     from 'moment'
import { mapGetters, mapActions } from 'vuex'
import { options }                from '../../../../helpers/options'
import { PAGINATION, TYPE_DATE }  from '../../../../config/constant'
import { convertHoursToMinutes, 
  convertMinutesToHours, 
  formatDateBySetting, 
  checkDuplicateViewGroup,
  setViewGroupStyle,
  generateWorkHourInDate, 
  isNullObject,
  guid,
  isAmOrPm,
  logTime,
  isExceedMaxCalendarCols,
  isOffDay,
  isBookingStartTimeExeedWorkHour,
  convertDateToTimezone,
}                                       from '../../../../helpers/common'
import sales_mixin from '../../../../helpers/mixins/sales-mixin'

// view models, classes
import CalendarViewData                 from './calendar-view-data'
import CalendarColData                  from './calendar-col-data'
import CalendarRowData                  from './calendar-row-data'
import CalendarCellData                 from './calendar-cell-data'
import CalendarCellSpec                 from './calendar-cell-spec'
import SalesApi                         from '../../../../api/sales/sales-api'
import CalendarCellBookingViewGroup     from './calendar-cell-booking-view-group'
import CalendarCellBlockedTimeViewGroup from './calendar-cell-blocked-time-view-group'
import BookingApi                       from '../../../../api/bookings/booking-api'
import BlockedTimeApi                   from '../../../../api/bookings/blocked-time-api'

// our components
import menu_booking_action      from '../menu-booking-action/menu-booking-action'
import calendar_cell            from './calendar-cell/calendar-cell'
import alert_confirm            from '../../../common/alert/alert-confirm'
import cancel_booking           from '../../../../components/bookings/bookings/cancel-booking/cancel-booking'
import component_base           from '../../../common/component-base/component-base'
import booking_mixin            from '../../../../helpers/mixins/booking-mixin'
import blocked_time_mixin       from '../../../../helpers/mixins/blocked-time-mixin'
import CalendarCellViewBlock from './calendar-cell-view-block'
import sales_detail from '../../../../components/sales/sales-detail/sales-detail'


export default {
  components: {
    'menu-booking-action': menu_booking_action,
    'calendar-cell': calendar_cell,
    'alert-confirm': alert_confirm,
    'cancel-booking': cancel_booking,
    'sales-detail': sales_detail,
  },
  extends: component_base,
  mixins: [booking_mixin, blocked_time_mixin, sales_mixin],
  props: {
    is_mobile: {
      type: Boolean,
      default: false
    },
    calendar_specs: {
      type: Object,
      default: () => []
    },
    calendar_data: {
      type: CalendarViewData,
      default: ()=> new CalendarViewData()
    }
  },
  data() {
    return {
      options,
      canlendar_view_key: '',
      booking_setup: {},
      changed_booking_view_group: null,
      changed_blocked_time_view_group: null,

      //alerts
      alert_id :'calendar_view_alert_id',
      alert_title :'',
      alert_data:[],
      alert_label_yes:'',
      alert_hide_yes: false,
      alert_label_no:'',
      alert_hide_no: false,
   
      force_update_times: 0, //change this value to re-draw the calendar view

      // setBookingOpeningHoursData
      booking_opening_hours_setup: [],
      booking_repeated_off_days_setup: {},
      booking_specific_off_days_setup: [],
      booking_table_time_start: '',
      booking_table_time_finish: '',
      workhour_shop: {
        start_row: 0,
        finish_row: 0
      },

      // setBookingResourcesData
      booking_resources_setup: [],

      // setBookingCalendarData
      booking_calendar_setup: {},
      time_working_duration: '',
      table_cell_width: 0,
      table_cell_height: options.booking.table_cell_height, // fixed for calendar

      // setBookingOnlineData
      booking_online_setup: {},

      // setBookingItemData
      booking_items_setup: {},

      // calendar style
      calendar_height: 'auto',
      calendar_head_col_width: 0,
      calendar_first_col_width: this.is_mobile ? options.calendar_first_col_width_mobile : options.calendar_first_col_width,

      // blocked-times data
      is_show_bookable_waitings: false,
      is_get_bookable_waiting: false,
      bookable_waitings:[],
      force_update_cells: false,

      calendar_view_created_start: 0,
      calendar_view_created_end: 0,
      calendar_view_created_duration: 0,

      tag_date: '#date'
    }
  },
  computed: {
    ...mapGetters('alert', {
      x_alerts: 'getAlerts'
    }),
    ...mapGetters('booking', {
      x_waitings: 'getWaitingCalendar',
    }),
    ...mapGetters('blocked_time', {
      x_blocked_times: 'getBlockedTimeCalendar',
    }),
    bookable_alert_yes() {return this.$i18n.t('general.waiting-list')},
    bookable_alert_no(){return this.$i18n.t('general.close')},
    bookable_alert_message() {return this.$i18n.t('notification.label-has-bookable-waiting')},
    booking_duplicate_message() {return this.$i18n.t('bookings.warning-duplicated-booking')},
    blocked_time_duplicate_message(){return this.$i18n.t('bookings.warning-duplicated-blocked-time')},
    booking_move_out_calendar_message() {return this.$i18n.t('bookings.can-not-move-out-calendar')},
    can_not_merge_multi_resource_booking(){return this.$i18n.t('bookings.can-not-merge-multi-resource-booking')},
    multi_resources_booking_can_not_moving_to_other_date(){return this.$i18n.t('bookings.multi-resources-booking-can-not-moving-to-other-date')},
    booking_over_hours_message() {return this.$i18n.t('bookings.warning-booking-over-working-hours')},
    blocked_time_over_hours_message() {return this.$i18n.t('bookings.warning-blocked-time-over-working-hours')},
    can_not_perform_service(){return this.$i18n.t('bookings.resources-can-not-perform-selected-services')},
    want_to_save_message() {return this.$i18n.t('bookings.warning-really-save')},
    has_bookable_waiting(){return this.$i18n.t('notification.label-has-bookable-waiting')},
    exceed_max_calendar_cols(){return this.$i18n.t('bookings.exceed-max-calendar-cols')},
    off_date_can_not_make_booking(){return this.$i18n.t('bookings.off-date-can-not-make-booking')},
    start_time_exeeds_working_hours(){return this.$i18n.t('bookings.warning-start-time-exeeds-working-hours')},

    computed_calendar_data(){
      let tmp_data = { 
        booking_view_groups: [],
        blocked_time_view_groups: [],
        booking_table: {
          cols: [],
          rows: [],
          cells: [[]],
        },
        force_update_cells_key: guid()
      }

      let tmp_booking_view_groups = this.calculateBookingViewGroups()
      let tmp_blocked_time_view_groups = this.calculateBlockedTimeViewGroups()
      tmp_data.booking_table = this.calculateBookingTable(tmp_booking_view_groups, tmp_blocked_time_view_groups)
      this.setCalendarCellSpec( new CalendarCellSpec(this.table_cell_height,
        this.booking_calendar_setup.booking_time_slot,
        tmp_data.booking_table.rows.length
      ))
      tmp_data.booking_view_groups = tmp_booking_view_groups
      tmp_data.blocked_time_view_groups =tmp_blocked_time_view_groups
      this.arrangeDuplicateViewGroups(tmp_data.booking_view_groups , tmp_data.blocked_time_view_groups)

      return tmp_data
    }
  },

  /* VueJS lifecycle's event 's handlers*/
  async created(){
    this.calendar_view_created_start = logTime()
    
    // booking setup
    this.preLoader()
    if(!this.isNullObject(this.calendar_data.booking_setup)){

      this.booking_opening_hours_setup     = this.calendar_data.booking_setup.booking_opening_hours_setup.opening_hours
      this.booking_repeated_off_days_setup = this.calendar_data.booking_setup.booking_opening_hours_setup.repeated_off_days
      this.booking_specific_off_days_setup = this.calendar_data.booking_setup.booking_opening_hours_setup.specific_off_days
      this.booking_resources_setup         = this.calendar_data.booking_setup.booking_resources_setup.items
      this.booking_calendar_setup          = this.calendar_data.booking_setup.booking_calendar_setup
      this.booking_online_setup            = this.calendar_data.booking_setup.booking_online_setup
      this.booking_items_setup             = this.calendar_data.booking_setup.booking_items_setup

      // start-finish time on calendar
      this.booking_table_time_start  = convertHoursToMinutes(_.head(_.sortBy(this.booking_opening_hours_setup, 'start_time')).start_time)
      let opening_cross_date = this.booking_opening_hours_setup.filter(opening => opening.cross_date == true)
      if(opening_cross_date.length > 0){
        this.booking_table_time_finish = convertHoursToMinutes(_.last(_.sortBy(opening_cross_date, 'finish_time')).finish_time)
        this.booking_table_time_finish += options.minutes_of_24h
      }
      else this.booking_table_time_finish = convertHoursToMinutes(_.last(_.sortBy(this.booking_opening_hours_setup, 'finish_time')).finish_time)
      
      this.booking_calendar_setup.time_slot_width = this.getTimeSlotWidthByDevice()
      this.table_cell_width = this.booking_calendar_setup.time_slot_width
      let time_slot = this.booking_calendar_setup.booking_time_slot
      this.time_working_duration = (this.booking_table_time_finish - this.booking_table_time_start) / time_slot
      this.calendar_height = window.innerHeight * 0.8 + 'px'

      this.canlendar_view_key = this.generateCalendarViewKey()
      if(isExceedMaxCalendarCols(this.booking_calendar_setup.number_of_day, this.booking_resources_setup.length))
        this.$parent.showAlertExceedMaxCalendarCols()
      else
        await this.loadBookingsAsync()
    }
    this.preLoader(false)
    
    this.calendar_view_created_end = logTime()
    this.calendar_view_created_duration = this.calendar_view_created_end - this.calendar_view_created_start
  },
  beforeMount(){
    // console.log(2, 'calendar-view-beforeMount: ' + this.canlendar_view_key, logTime())
  },
  mounted(){
    // console.log(2, 'calendar-view-mounted: '+  this.canlendar_view_key, logTime())
  },
  beforeUpdate(){
    // console.log(2, 'calendar-view-beforeUpdate: ' + this.canlendar_view_key, logTime())
  },
  updated(){
    // created: cell-min-width = 150px
    // mounted: cell-width = browser auto calculate -> cells have width different (1px)
    // updated: recalculate
    if(!this.isNullObject(this.$refs.calendar_cols) && this.$refs.calendar_cols.length>0) {
      let table_object        = document.getElementById('calendar-table')
      let table_width         = table_object.getBoundingClientRect().width
      let table_content_width = table_width - this.calendar_first_col_width - options.browser_scroll
      let time_slot_width     = this.getTimeSlotWidthByDevice()
      let min_content_width   = time_slot_width * this.$refs.calendar_cols.length
      let tmp_col_width       = 0
      
      if(min_content_width > table_content_width) tmp_col_width = time_slot_width
      else tmp_col_width = Math.ceil(table_content_width / this.$refs.calendar_cols.length)

      this.calendar_head_col_width = tmp_col_width
      this.table_cell_width = tmp_col_width
    }
    // console.log(2, 'calendar-view-updated: ' + this.canlendar_view_key, logTime())
  },
  methods: {
    ...mapActions('alert', [
      'setAlertsData'
    ]),
    ...mapActions('booking', [
      'getBookingCalendarDataAsync',
      'updateBookingDataToStoreOnly',
      'addBookingDataAsync',
      'addBookingNotificationData',
      'updateBookingInfoHeightData'
    ]),
    ...mapActions('waiting', [
      'setWaitingListData',
    ]),
    ...mapActions('notification', [
      'setNoticesInBookableWaitingData',
    ]),
    formatDateBySetting,
    forceUpdate(){
      this.force_update_times = this.force_update_times + 1
      this.canlendar_view_key = this.generateCalendarViewKey()
    },
    setDefaultConfirmButtons(){
      this.alert_hide_yes = false
      this.alert_hide_no = false
      this.alert_label_yes =''
      this.alert_label_no = ''
    },
    hideYesConfirmButton(){
      this.alert_hide_yes = true
      this.alert_label_no = this.bookable_alert_no
    },
    getTimeSlotWidthByDevice(){
      let time_slot_width = 0
      if(this.is_mobile) time_slot_width = options.time_slot_width_mobile
      else time_slot_width = options.time_slot_width
      return time_slot_width
    },
    isExceedMaxCalendarCols(dates_on_calendar, resources_by_date){
      let max_calendar_col = options.calendar_max_cols
      let tmp_calendar_col = dates_on_calendar * resources_by_date
      if(dates_on_calendar > 1 && tmp_calendar_col > max_calendar_col) 
        return true

      return false
    },
    async loadBookingsAsync(){
      let from_date = this.calendar_data.calendar_dates[0]
      let to_date = this.calendar_data.calendar_dates[this.calendar_data.calendar_dates.length-1]
      let type_date = this.calendar_data.calendar_dates.length === 1 ? TYPE_DATE.DATE : TYPE_DATE.DATE_RANGE
      this.booking_setup = this.calendar_data.booking_setup
      
      let booking_filter = {
        type_date: type_date,
        from_date: from_date,
        to_date: to_date,
        booking_resource_id: 0,
        number_item_waiting: PAGINATION.SMALL,
        shop_id: this.shop_data.shop_id
      }
      // console.log('===============', 'calendar-view-loadBookingsAsync: ' + this.canlendar_view_key, logTime())
      await this.getBookingCalendarDataAsync(booking_filter)
      // console.log('===============', 'calendar-view-loadBookingsAsync: ' + this.canlendar_view_key, logTime())
      
      if(this.x_alerts.length == 0){
        this.bookings = this.x_bookings
        this.waitings = this.x_waitings 
      }
      else this.showAlert(this.x_alerts)
    },

    generateCalendarViewKey(){ 
      let tmp_key = 'canlendar_view_key-' + this.force_update_times + '-' + this.calendar_data.calendar_dates_ts[0]
      return tmp_key
    },
    calculateBookingTableCols(){
      let cols = []
      // cacculate number of displayed columns on calendar based on "canbe-displayed-resources"
      if(this.calendar_data.calendar_view_mode === options.booking.calendar_view_mode.weekly){
        let resources_first_date = this.calendar_data.canbe_displayed_resource_setup_ids[this.calendar_data.calendar_dates_ts[0]]
        //is existed in resources setup
        let tmp_resource = _.filter(this.booking_resources_setup, item=>item.id === resources_first_date[0])
        if(tmp_resource && tmp_resource.length===1){
          for(let i in this.calendar_data.calendar_dates){
            let calendar_date = this.calendar_data.calendar_dates[i]
            let calendar_date_ts = this.calendar_data.calendar_dates_ts[i]
            let col = new CalendarColData(i, 
              tmp_resource[0].id, 
              calendar_date,
              calendar_date_ts,
              calendar_date_ts * 1000,
              formatDateBySetting(this.calendar_data.calendar_dates[i]),
              generateWorkHourInDate(this.booking_opening_hours_setup, calendar_date, this.calendar_data.booking_setup),
              generateWorkHourInDate(tmp_resource[0].opening_hours, calendar_date, this.calendar_data.booking_setup)
            )
            cols.push(col)
          }
        }
      }
      else if (this.calendar_data.calendar_view_mode === options.booking.calendar_view_mode.daily) {
        let col_index = 0
        for(let i in this.calendar_data.calendar_dates_ts){
          let calendar_date = this.calendar_data.calendar_dates[i]
          let calendar_date_ts = this.calendar_data.calendar_dates_ts[i]
          for(let ii in this.booking_resources_setup){
            let resource = this.booking_resources_setup[ii]
            if(resource.status == options.good_status.active){

              let col = new CalendarColData(col_index, 
                resource.id, 
                calendar_date,
                calendar_date_ts,
                calendar_date_ts * 1000,
                this.booking_resources_setup[ii].resource_name,
                generateWorkHourInDate(this.booking_opening_hours_setup, calendar_date, this.calendar_data.booking_setup),
                generateWorkHourInDate(resource.opening_hours, calendar_date, this.calendar_data.booking_setup)
              )
              if(this.canResourceBeDisplayed(col.resource_setup_id, col.booking_date_ts)){
                cols.push(col)
                col_index++
              }
            }
          }
        }
      }
      return cols
    },
    calculateCells(booking_table, booking_view_groups, blocked_time_view_groups){
      for(let j in booking_table.cols){
        let col = booking_table.cols[j]
        for(let i in booking_table.rows){
          let row = booking_table.rows[i]
          let calendar_date_ts = col.booking_date_ts
          let exceed_work_hour = this.exceedWorkHourCalendarCell(booking_table.cols,
            calendar_date_ts, 
            col.resource_setup_id, 
            row.row_index)

          let tmp_booking_view_groups= this.bookingViewGroupInCalendarCell(booking_view_groups, 
            calendar_date_ts, 
            col.resource_setup_id, row)
          
          let tmp_blocked_time_view_groups= this.blockedTimeViewGroupInCalendarCell(blocked_time_view_groups, 
            calendar_date_ts, 
            col.resource_setup_id, 
            row)

          booking_table.cells.push(new CalendarCellData(col.col_index, row.row_index,
            exceed_work_hour, tmp_booking_view_groups, tmp_blocked_time_view_groups))
        }
      }
    },
    calculateBookingTable(booking_view_groups, blocked_time_view_groups){
      let tmp_booking_table = {
        cols: [],
        rows: [],
        cells: []
      }
      // calculate number of displayed rows on calendar based on time-slot and working-hour
      let time_slot = this.booking_calendar_setup.booking_time_slot
      for(let i = 0; i < this.time_working_duration; i++) {
        let cross_date = false
        let minutes = this.booking_table_time_start + i * time_slot
        let time_slot_string = convertMinutesToHours(minutes)
        let row_text = '' 
        if(minutes >= options.minutes_of_24h) {
          cross_date = true
          let tmp_minutes = convertHoursToMinutes(time_slot_string) - options.minutes_of_24h
          time_slot_string = convertMinutesToHours(tmp_minutes)
          row_text = '+1D ' + isAmOrPm(minutes)
          row_text = row_text.substr(0, row_text.length - 3)
        }
        else row_text = isAmOrPm(minutes)
        
        let row = new CalendarRowData(i, time_slot_string, row_text, cross_date)
        tmp_booking_table.rows.push(row)
      }
      tmp_booking_table.cols = [...this.calculateBookingTableCols()]
      this.calculateCells(tmp_booking_table, booking_view_groups, blocked_time_view_groups)
      return tmp_booking_table
    },
   
    calculateBookingViewGroups(){
      let bookings = this.x_bookings.filter(booking => {
        if(booking.status != options.booking.booking_status.canceled) return booking
      })
      let booking_groups = []
      let index = 0
      for(let booking in bookings){
        for(let i in bookings[booking].booked_items){
          index++
          let item = bookings[booking].booked_items[i]
          let group = new CalendarCellBookingViewGroup(index,  
            this.calendar_data.booking_setup, 
            this.booking_calendar_setup,
            bookings[booking], 
            item)

          if(booking_groups.length == 0){
            booking_groups.push(group)
          }
          else {
            let same_group = booking_groups.filter(g => g.booking_id == bookings[booking].id
                                                  && g.booking_resource_setup_id == item.booking_resource_setup_id)
            if(same_group.length > 0)
              same_group[0].addItem(item)
            else
              booking_groups.push(group)
          }
        }
      }

      for(let i in booking_groups){
        booking_groups[i].updateViewBlocks()
      }
      
      return booking_groups
    },
    calculateBlockedTimeViewGroups(){
      let blocked_time_groups = []
      for(let i in this.x_blocked_times){
        blocked_time_groups.push(new CalendarCellBlockedTimeViewGroup(i, 
          this.calendar_data.booking_setup,
          this.booking_calendar_setup, 
          this.x_blocked_times[i]))
      }
      return blocked_time_groups
    },
    // re-arrange duplicated-view-groups
    // 1. calculate all duplicated_groups
    // 2. in one area on calendar, get biggest crowd include duplicated-groups
    // 3. seperating crowd to cols have groups & format cols
    arrangeDuplicateViewGroups(booking_view_groups, blocked_time_view_groups){
      let groups = [...booking_view_groups , ...blocked_time_view_groups]
      let duplicated_view_groups_crowds = []
      for(let i in groups){
        let group = groups[i]
        let duplicated_view_groups = checkDuplicateViewGroup(group, booking_view_groups, blocked_time_view_groups)
        if(duplicated_view_groups.length > 1){
          duplicated_view_groups_crowds.push(duplicated_view_groups)
        }
      }
      let duplicated_groups = _.uniqBy(_.flatMap(duplicated_view_groups_crowds), 'view_group_id')

      let merge_crowds = []
      for(let i in duplicated_groups){
        let group = duplicated_groups[i]
        let crowds_has_group = []

        if(group instanceof CalendarCellBookingViewGroup){
          crowds_has_group = duplicated_view_groups_crowds.filter(crowd => _.findIndex(crowd, ['booking_id', group.booking_id]) > -1)
        }
        else if(group instanceof CalendarCellBlockedTimeViewGroup){
          crowds_has_group = duplicated_view_groups_crowds.filter(crowd => _.findIndex(crowd, ['blocked_time_id', group.blocked_time_id]) > -1)
        }

        let merge_crowd = _.uniqBy(_.flatMap(crowds_has_group), 'view_group_id')
        merge_crowd = _.sortBy(merge_crowd, ['row'])
        merge_crowds.push(merge_crowd)
      }

      // style for duplicated groups
      for(let i in duplicated_groups){
        let group = duplicated_groups[i]
        let merge_crowd_has_group = merge_crowds.filter(crowd => {
          for(let ii in crowd){
            let g = crowd[ii]
            if(g.booking_id == group.booking_id) return crowd
          }
          return
        })
        let biggest_crowd_tmp = _.maxBy(merge_crowd_has_group, (crowd) => crowd.length)
        biggest_crowd_tmp = _.sortBy(biggest_crowd_tmp, ['row'])
        
        let cols = []
        let col_number = 0
        for(let ii in biggest_crowd_tmp){
          let group = biggest_crowd_tmp[ii]
          let col = {
            col_number: col_number,
            groups: [group]
          }
          if(ii == 0){
            cols.push(col)
          }
          else {
            let inserted = false
            for(let iii in cols){
              let tmp_col = cols[iii]
              let tmp_booking_view_groups = tmp_col.groups.filter(g => g.booking_id > 0)
              let tmp_blocked_time_view_groups = tmp_col.groups.filter(g => g.blocked_time_id > 0)
              let tmp_duplicated_groups = checkDuplicateViewGroup(group, tmp_booking_view_groups, tmp_blocked_time_view_groups)
              if(tmp_duplicated_groups.length == 1){
                tmp_col.groups.push(group)
                inserted = true
                break
              }
            }
            if(!inserted){
              col_number = col_number + 1
              col.col_number = col_number
              cols.push(col)
            }
          }
        }
        setViewGroupStyle(cols)
      }

      // style for not duplicated groups
      let not_duplicated_groups = _.difference(groups, duplicated_groups)
      for(let i in not_duplicated_groups){
        let group = not_duplicated_groups[i]
        group.width = 100
        group.margin_left = 0
      }
    },
    getViewGroupInCalendarCell(view_groups, booking_date_ts, resource_setup_id, row){
      let groups = []
      if(view_groups){
        groups = view_groups.filter(group => {
          if (group.processed) return
          let condition_view = group.calendar_date_ts === booking_date_ts && 
                              group.booking_resource_setup_id == resource_setup_id
        
          if(condition_view){
            if((group.row === row.row_index) || //perfect match, in the same day
            (row.cross_date && group.start_time === row.time) || //in the next day mode
            (group.row < 0)){ //rare case, the start-time of the booking is out of the range of the calendar
              group.processed = true
              group.updateCrossDateInfo(row.cross_date)
              return group
            }
          }
          return
        })
      }
      return groups
    },
    bookingViewGroupInCalendarCell(booking_view_groups, booking_date_ts, resource_setup_id, row){
      return this.getViewGroupInCalendarCell(booking_view_groups,
        booking_date_ts,
        resource_setup_id, 
        row)
    },

    blockedTimeViewGroupInCalendarCell(blocked_time_view_groups, booking_date_ts, resource_setup_id, row){
      return this.getViewGroupInCalendarCell(blocked_time_view_groups,
        booking_date_ts,
        resource_setup_id, 
        row)
    },
    canResourceBeDisplayed(resource_setup_id, calendar_date_ts){
      let is_valid = false
      let canbe_displayed_resource_setup_ids = this.calendar_data.canbe_displayed_resource_setup_ids[calendar_date_ts]
      if(canbe_displayed_resource_setup_ids && canbe_displayed_resource_setup_ids.length>0){
        let resource_index = canbe_displayed_resource_setup_ids.indexOf(resource_setup_id)
        if(resource_index > -1) {
          is_valid = true

          if(this.is_mobile){
            let block_of_resource = Math.ceil((resource_index + 1) / 4)
            if(block_of_resource != this.calendar_data.canbe_displayed_resource_block_mobile) 
              is_valid = false
          }
        }
      }
      return is_valid
    },
    loadCellData(col_index, row_index){
      let cell = this.getCellData(col_index, row_index)
      if(!this.isNullObject(cell)){
        if(!(this.isNullObject(cell.booking_view_groups)) && 
          cell.booking_view_groups.length>0){
          for(let i in cell.booking_view_groups){
            cell.booking_view_groups[i].updateCurrentCellIndexInfo(col_index, row_index)
          }
          for(let i in cell.blocked_time_view_groups){
            cell.blocked_time_view_groups[i].updateCurrentCellIndexInfo(col_index, row_index)
          }
        }  
      }
      return cell
    },
    getCellData(col_index, row_index){
      let cell = _.filter(this.computed_calendar_data.booking_table.cells,
        item => item.col_index == col_index && item.row_index == row_index)[0]
      return cell
    },
    checkExceedWorkHour(view_group = new CalendarCellViewBlock()){
      let row_end_index = Math.ceil(view_group.row_end)
      for(let i= view_group.row; i<row_end_index; i++){
        let cell = this.getCellData(view_group.col_index, i)
        if(!this.isNullObject(cell) && cell.exceed_work_hour) return true
      }
      return false
    },
    exceedWorkHourCalendarCell(cols, calendar_date_ts, resource_setup_id, row_index){
      let date = convertDateToTimezone(new Date(calendar_date_ts * 1000))
      let day_picker  = Number(moment(date).format('d'))
      let date_picker = Number(moment(date).format('D'))
      let date_formated = moment(date).format(options.standard_date_format.ymd)
      let week_picker = Math.ceil(date_picker/7)
      let exceed = false

      // shop: repeat off days & specific off days
      if(this.booking_repeated_off_days_setup.repeat_type == options.repeat_type.every_week){
        if(this.booking_repeated_off_days_setup.repeated_days_of_week.indexOf(day_picker) > -1) {
          exceed = true
        }
      }
      if(this.booking_repeated_off_days_setup.repeat_type == options.repeat_type.monthly){
        if(this.booking_repeated_off_days_setup.repeated_weeks.indexOf(week_picker) > -1){
          if(this.booking_repeated_off_days_setup.repeated_days_of_week.indexOf(day_picker) > -1) {
            exceed = true
          }
        }
      }
      for(let i in this.booking_specific_off_days_setup){
        let off_day = this.booking_specific_off_days_setup[i]
        if(date_formated == moment(off_day).format(options.standard_date_format.ymd)) 
          exceed = true
      }

      // shop: workhour of day in shop_opening_day
      let shop_opened_days = []
      for(let i in this.booking_opening_hours_setup){
        let opening_hour = this.booking_opening_hours_setup[i]
        let opened_days_of_week = opening_hour.opened_days_of_week

        if(opened_days_of_week.indexOf(day_picker) > -1){
          let current_col = cols.filter(col => col.booking_date_ts == calendar_date_ts)
          let exceeds = []
          if(!this.isNullObject(current_col[0])){
            let workhours_shop = current_col[0].workhour_shop
        
            for(let ii in workhours_shop){
              let workhour_shop = workhours_shop[ii]
              if(row_index < workhour_shop.start_row || row_index >= workhour_shop.finish_row) {
                exceeds.push(true)
              }
              else {
                exceeds.push(false)
              }
            }
          }
          
          let exceeds_false = exceeds.filter(e => e == false)
          if(exceeds_false.length == 0) 
            exceed = true
        }
        shop_opened_days = shop_opened_days.concat(opened_days_of_week)
      }

      // shop: days not in shop_opened_days
      if(shop_opened_days.indexOf(day_picker) == -1) 
        exceed = true

      // resource
      for(let i in this.booking_resources_setup){
        let resource = this.booking_resources_setup[i]
        if(resource_setup_id === resource.id){
          // specific off days
          for(let ii in resource.specific_off_days){
            let resource_off_day = resource.specific_off_days[ii]
            let resource_off_day_format = moment(resource_off_day).format(options.standard_date_format.ymd)
            if(date_formated == resource_off_day_format) 
              exceed = true
          }

          // resource: workhour of day in shop_opening_day
          let resource_opened_days = []
          for(let ii in resource.opening_hours){
            let opening_hour = resource.opening_hours[ii]
            let opened_days_of_week = opening_hour.opened_days_of_week

            if(opened_days_of_week.indexOf(day_picker) > -1){
              let current_col = cols.filter(col => col.booking_date_ts == calendar_date_ts && col.resource_setup_id == resource_setup_id)
              let exceeds = []
              if(!this.isNullObject(current_col[0])){
                let workhours_resource = current_col[0].workhour_resource

                for(let iii in workhours_resource){
                  let workhour_resource = workhours_resource[iii]
                  if(row_index < workhour_resource.start_row || row_index >= workhour_resource.finish_row) {
                    exceeds.push(true)
                  }
                  else {
                    exceeds.push(false)
                  }
                }
              }
              
              let exceeds_false = exceeds.filter(e => e == false)
              if(exceeds_false.length == 0) 
                exceed = true
            }
            resource_opened_days = resource_opened_days.concat(opened_days_of_week)
          }

          // resource: days not in resource_opened_days
          if(resource_opened_days.indexOf(day_picker) == -1) 
            exceed = true
        }
      }

      return exceed
    },
    showConfirmationDialog(messages){
      this.alert_data = messages
      this.showDialogById(this.alert_id)
    },
    ///////////////////////////////////////////////////////
    // Blocked Time's methods
    ///////////////////////////////////////////////////////
    clearTemporaryBlockedTimeData(){
      this.changed_blocked_time_view_group = null
    },
    async updateBlockedTimeAsync(blocked_time){
      this.preLoader()
      try {
        let blocked_time_api = new BlockedTimeApi()
        let result = await blocked_time_api.updateBlockedTimeAsync(blocked_time)
        if(result.is_ok) {
          this.updateBlockedTimeDataToStoreOnly(result.data)
        }
        else{
          if(!isNullObject(this.changed_blocked_time_view_group))
            this.changed_blocked_time_view_group.rollBack()
          this.showAlert(result.error_messages)
          this.forceUpdate()
          this.clearTemporaryBookingData()
        }
      }
      catch(e){
        this.showAlert([e.message])
      }
      this.preLoader(false)
    },
    async validateAndSaveBlockedTimeAsync(changed_blocked_time_view_group){ 
      if(!this.isNullObject(changed_blocked_time_view_group)){
        this.changed_blocked_time_view_group = changed_blocked_time_view_group
        let data_alert = []
        let duplicated_groups = checkDuplicateViewGroup(changed_blocked_time_view_group, 
          this.computed_calendar_data.booking_view_groups, 
          this.computed_calendar_data.blocked_time_view_groups)

        this.hideYesConfirmButton()
        if(duplicated_groups.length > 1){ 
          data_alert.push(this.blocked_time_duplicate_message) 
          this.showConfirmationDialog(data_alert)
          return
        }

        if(this.checkExceedWorkHour(changed_blocked_time_view_group)){
          data_alert.push(this.blocked_time_over_hours_message)
          this.showConfirmationDialog(data_alert)
          return
        }
        
        if(data_alert.length == 0) {
          await this.updateBlockedTimeAsync(this.changed_blocked_time_view_group.getChangeBlockedTime())
        }
      }
    },
    async onBlockedTimeAlertConfirmAsync(){
      await this.updateBlockedTimeAsync(this.changed_blocked_time_view_group.getChangeBlockedTime())
      this.clearTemporaryBlockedTimeData()
    },
    onBlockedTimeAlertCancel(){
      if(!isNullObject(this.changed_blocked_time_view_group))
        this.changed_blocked_time_view_group.rollBack()
      //have to call this method because the data is not changed in store
      this.forceUpdate()
      this.clearTemporaryBlockedTimeData()
    },
    
    ///////////////////////////////////////////////////////
    // Booking's methods
    ///////////////////////////////////////////////////////
    clearTemporaryBookingData(){
      this.changed_booking_view_group = null
    },
    async updateBookingAsync(booking){
      this.preLoader()
      try {
        let booking_api = new BookingApi()  
        if(this.is_get_bookable_waiting) 
          booking.is_get_bookable_waiting = this.is_get_bookable_waiting 
        let result = await booking_api.updateBookingAsync(booking)

        if(result.is_ok) {
          if(this.calendar_specs.calendar_cell_mode === options.booking.calendar_cell_mode.move_booking){
            this.$emit('calendar-cell-mode-changed', options.booking.calendar_cell_mode.add_booking)
          }

          let existed = _.find(this.x_bookings, {id: booking.id})
          if(existed)
            this.updateBookingDataToStoreOnly(result.data.booking)
          else
            this.addBookingNotificationData([result.data.booking])

          if(this.is_get_bookable_waiting){
            if(!this.isNullObject(result.data.bookable_waitings) && result.data.bookable_waitings.length >0){
              this.bookable_waitings = result.data.bookable_waitings
              this.is_show_bookable_waitings = true
              this.is_get_bookable_waiting  = false
              this.alert_label_yes = this.bookable_alert_yes
              this.alert_label_no = this.bookable_alert_no
              this.alert_data = [this.bookable_alert_message]

              this.setNoticesInBookableWaitingData(undefined)
              this.showDialogById(this.alert_id)
            }
          }
        }
        else{
          // resource can not perform service BK43C -> only match when don't have other errors
          if(result.error_messages.length == 1){
            let error_message = result.error_messages[0]
            if(error_message.indexOf(options.booking.booking_error_codes.bk43c) > -1){
              this.setDefaultConfirmButtons()
              this.showConfirmationDialog([error_message, this.want_to_save_message])
              this.preLoader(false)
              return
            }
          }

          if(!(this.isNullObject(this.changed_booking_view_group)))
            this.changed_booking_view_group.rollBack()

          this.showAlert(result.error_messages)
          this.forceUpdate()
          this.clearTemporaryBookingData()
        }
      }
      catch(e){
        this.showAlert([e.message])
      }
      this.preLoader(false)
    },
    // eslint-disable-next-line no-unused-vars
    onMovingBookingStart(moving_booking_view_group){
      this.$emit('calendar-cell-mode-changed', options.booking.calendar_cell_mode.move_booking)
    },
    async onMovingBookingStopAsync(moving_booking_view_group, new_col_index, new_row_index){
      await this.validateAndSaveMovedBookingAsync(moving_booking_view_group, new_col_index, new_row_index)
    },
    async validateAndSaveDropBookingAsync(moved_booking_view_group, x, y){
      let x_change = x / this.calendar_head_col_width
      let y_change = y / this.table_cell_height
      let new_col_index = moved_booking_view_group.col_index + x_change
      let new_row_index = moved_booking_view_group.row_index + y_change
      
      let max_col_index = this.computed_calendar_data.booking_table.cols.length
      let max_row_index = this.computed_calendar_data.booking_table.rows.length
      if(!(new_col_index===moved_booking_view_group.col_index && new_row_index===moved_booking_view_group.row_index)){
        let data_alerts = []

        // out of calendar
        if(new_col_index < 0 || new_col_index >= max_col_index 
        || new_row_index < 0 || new_row_index >= max_row_index){
          data_alerts.push(this.booking_move_out_calendar_message)
        }

        // moving multi-resource booking to other date
        let tmp_message = this.checkMovingMultiResourcesBookingToOtherDate(moved_booking_view_group, new_col_index)
        if(tmp_message != '') 
          data_alerts.push(tmp_message)

        this.setDefaultConfirmButtons()
        if(data_alerts.length > 0)
          this.preventBookingMovingBehavior(moved_booking_view_group, data_alerts) 
        else
          await this.validateAndSaveMovedBookingAsync(moved_booking_view_group, new_col_index, new_row_index)
      }
    },
    async validateAndSaveMovedBookingAsync(moved_booking_view_group, new_col_index, new_row_index){
      let tmp_col_index = Math.floor(new_col_index)
      let tmp_row_index = Math.floor(new_row_index)
      let col = this.computed_calendar_data.booking_table.cols[tmp_col_index]
      let row = this.computed_calendar_data.booking_table.rows[tmp_row_index]
      let new_booking_date = col.booking_date
      let new_booking_date_ts = col.booking_date_ts
      let minutes_changed = (new_row_index - moved_booking_view_group.row) * 
                            this.calendar_data.booking_setup.booking_calendar_setup.booking_time_slot
      let new_booking_resource_setup_id = col.resource_setup_id
      let data_alerts = []

      // is_same_resource_booking_view_groups
      for(let i in this.computed_calendar_data.booking_view_groups){
        let view_group = this.computed_calendar_data.booking_view_groups[i]
        if(view_group.booking_id == moved_booking_view_group.booking_id
        && view_group.view_group_id != moved_booking_view_group.view_group_id
        && view_group.calendar_date_ts == new_booking_date_ts
        && view_group.booking_resource_setup_id == new_booking_resource_setup_id){
          data_alerts.push(this.can_not_merge_multi_resource_booking)
          break
        }
      }

      // moving multi-resource booking to other date
      let tmp_message = this.checkMovingMultiResourcesBookingToOtherDate(moved_booking_view_group, new_col_index)
      if(tmp_message != '') 
        data_alerts.push(tmp_message)

      if(data_alerts.length > 0){
        this.preventBookingMovingBehavior(moved_booking_view_group, data_alerts)
      }
      else {
        moved_booking_view_group.updateWithMovedInformation(row.cross_date, new_col_index, new_row_index,
          new_booking_resource_setup_id, new_booking_date,
          new_booking_date_ts , minutes_changed)
        this.is_get_bookable_waiting = true
        await this.validateAndSaveBookingAsync(moved_booking_view_group)
      }
    },
    async validateAndSaveResizedBookingAsync(changed_booking_view_group, resized_booking_view_block, height, changed_time){
      if(!this.isNullObject(changed_booking_view_group)){
        let y_change = height / this.table_cell_height
        let new_row_index = changed_booking_view_group.original_row_index + y_change
        let max_row_index = this.computed_calendar_data.booking_table.rows.length
        this.setDefaultConfirmButtons()
        if(new_row_index > max_row_index){
          this.changed_booking_view_group = changed_booking_view_group
          this.hideYesConfirmButton()
          this.showConfirmationDialog([this.booking_move_out_calendar_message])
        }
        else{
          changed_booking_view_group.updateChangedTime(resized_booking_view_block.ref_booked_item.booked_item_id, changed_time)
          this.is_get_bookable_waiting = false
          await this.validateAndSaveBookingAsync(changed_booking_view_group)
        }
      }
    },
    async validateAndSaveBookingAsync(changed_booking_view_group){
      let is_valid = true
      if(!this.isNullObject(changed_booking_view_group)){
        this.changed_booking_view_group = changed_booking_view_group
        let data_alert = []
        this.setDefaultConfirmButtons()

        // check off day
        let tmp_booking_date = convertDateToTimezone(new Date(changed_booking_view_group.calendar_date_ts * 1000))
        if(isOffDay(
          tmp_booking_date, 
          changed_booking_view_group.booking_resource_setup_id,
          this.calendar_data.booking_setup)){
          let date_formated = moment(tmp_booking_date).format(options.standard_date_format.ymd)
          let off_date_message = this.off_date_can_not_make_booking.replace(this.tag_date, date_formated)
          
          data_alert.push(off_date_message)
          return is_valid = this.isFalseBookingRule(data_alert)
        }

        // check start-time excedd workhour
        let tmp_changed_booking = changed_booking_view_group.getChangedBooking()
        if(await isBookingStartTimeExeedWorkHour(tmp_changed_booking.booking_date, tmp_changed_booking.booked_items)){
          changed_booking_view_group.ref_booking.is_booking_exceeds_work_hours = false
          data_alert.push(this.start_time_exeeds_working_hours)
          return is_valid = this.isFalseBookingRule(data_alert)
        }

        // check duplicate bookings
        if(!this.booking_calendar_setup.allow_duplicate_bookings){
          let duplicated_groups = checkDuplicateViewGroup(changed_booking_view_group,
            this.computed_calendar_data.booking_view_groups,
            this.computed_calendar_data.blocked_time_view_groups)
          duplicated_groups = this.getDuplicatedBookingViewGroupsOnly(duplicated_groups)
          
          if(duplicated_groups.length > 1){
            data_alert.push(this.booking_duplicate_message)
            return is_valid = this.isFalseBookingRule(data_alert)
          }
        }

        // check exceed workhour
        if(this.checkExceedWorkHour(changed_booking_view_group)){
          data_alert.push(this.booking_over_hours_message)
          is_valid = false
        }

        if(is_valid) {
          let changed_booking = this.setChangedBookingFlag(changed_booking_view_group)
          await this.updateBookingAsync(changed_booking)
          changed_booking_view_group.clearRollBackInfo()
        }
        else {
          data_alert.push(this.want_to_save_message)
          this.showConfirmationDialog(data_alert)
        }
      }
      return is_valid
    },
    isFalseBookingRule(data_alert){
      this.hideYesConfirmButton()
      this.showConfirmationDialog(data_alert)
      return false
    },
    checkMovingMultiResourcesBookingToOtherDate(moved_booking_view_group, new_col_index){
      let tmp_col = this.computed_calendar_data.booking_table.cols[Math.floor(new_col_index)]
      let tmp_message = ''
      
      let tmp_booking_resources = []
      for(let i in moved_booking_view_group.ref_booking.booked_items){
        let booked_item = moved_booking_view_group.ref_booking.booked_items[i]
        tmp_booking_resources.push(booked_item.booking_resource_setup_id)
      }
      tmp_booking_resources = _.uniq(tmp_booking_resources)

      if(tmp_booking_resources.length > 1
      && tmp_col
      && moved_booking_view_group.calendar_date_ts != tmp_col.booking_date_ts){
        let tmp_date = moment(tmp_col.booking_date).format(options.standard_date_format.ymd)
        tmp_message = this.multi_resources_booking_can_not_moving_to_other_date
        tmp_message = tmp_message.replace(this.tag_date, tmp_date)
      }
      return tmp_message
    },
    setChangedBookingFlag(changed_booking_view_group){
      let changed_booking = changed_booking_view_group.getChangedBooking()
      changed_booking.is_duplicate_blocked_time       = false
      changed_booking.is_duplicate_another_booking    = true
      changed_booking.is_booking_exceeds_work_hours   = true
      return changed_booking
    },
    getDuplicatedBookingViewGroupsOnly(duplicated_groups){
      return _.filter(duplicated_groups, g => g.booking_id > 0)
    },

    async onBookingAlertConfirmAsync(){ 
      if(this.is_show_bookable_waitings){
        let waitings =[]
        if(!this.isNullObject( this.bookable_waitings)){
          waitings =this.bookable_waitings
        }
        let data = {
          items: waitings,
          pagination: {
            page_number: 1,
            page_size: waitings.length,
            total_items: waitings.length,
            total_pages: 1
          }
        }
        this.setWaitingListData(data)
        this.showDialogById('waiting-list-bookable-modal')
       
        this.is_show_bookable_waitings = false
      }
      else{
        let changed_booking = this.setChangedBookingFlag(this.changed_booking_view_group)
        changed_booking.must_check_performance_resource = false

        await this.updateBookingAsync(changed_booking)
        this.clearTemporaryBookingData()
      }
      this.setDefaultConfirmButtons()
    },
    onBookingAlertCancel(){
      if(this.is_show_bookable_waitings){
        this.is_show_bookable_waitings = false
      }
      else{
        if(!(this.isNullObject(this.changed_booking_view_group)))
          this.changed_booking_view_group.rollBack()

        // have to call this method because the data is not changed in store
        this.forceUpdate()
        this.clearTemporaryBookingData()
      }
      this.setDefaultConfirmButtons()
    },

    //////////////////////////////////////////////////
    // Component Event's handlers
    //////////////////////////////////////////////////
    onCancelBookingSuccess(data){ 
      this.bookable_waitings = data.bookable_waitings
      this.alert_data = []
      if(!this.isNullObject(this.bookable_waitings) && this.bookable_waitings.length >0){ 
        this.alert_data = [this.has_bookable_waiting]
        this.showDialogById(this.alert_id) 
        this.is_show_bookable_waitings = true
      }
    },
    async onAlertConfirmAsync(){
      this.preLoader()  
      if(!this.isNullObject(this.changed_booking_view_group) || this.is_show_bookable_waitings)
        await this.onBookingAlertConfirmAsync()
      else if(!this.isNullObject(this.changed_blocked_time_view_group))
        await this.onBlockedTimeAlertConfirmAsync()
      this.preLoader(false)
    },
    onAlertCancel(){
      if(!this.isNullObject(this.changed_booking_view_group))
        this.onBookingAlertCancel()
      else if(!this.isNullObject(this.changed_blocked_time_view_group))
        this.onBlockedTimeAlertCancel()
    },
    onChangeResourceAndViewMode(col, calendar_view_mode){
      this.$emit('resource-and-view-mode-changed', col.booking_date, col.resource_setup_id, calendar_view_mode)
    },
    openBlockedTimeActionDialog(form_action, blocked_time, col){
      this.preLoader()
      this.onActionBlockedTime(form_action, blocked_time, col.resource_setup_id, col.booking_date,
        col.booking_date_ts_miliseconds, false, this.computed_calendar_data.booking_table.rows[0].time)
      this.preLoader(false)
    },
    preventBookingMovingBehavior(moved_booking_view_group, data_alert){
      this.changed_booking_view_group = moved_booking_view_group
      this.hideYesConfirmButton()
      this.showConfirmationDialog(data_alert)
      return
    },
    async onClickCheckoutInformation(booking_data) {
      this.preLoader()
      const sales_api = new SalesApi()
      const response = await sales_api.getSalesByBookingIdLiveAsync({
        booking_id: booking_data.id,
        shop_id: this.shop_data.shop_id
      })
      this.preLoader(false)
      
      if (response.is_ok) {
        this.onActionSalesMixin(options.form_actions.view, response.data, response.data.ref_status)
      } else {
        this.showAlert(response.error_messages)
      }
    }
  }
}
</script>