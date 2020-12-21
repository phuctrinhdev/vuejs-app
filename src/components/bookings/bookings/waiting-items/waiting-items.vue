<template>
  <div class="waiting-items-wrapper">
    <div v-if="skin == bookings_options.waiting_list_skin.full"
         class="box-list-search waiting-table table-data form-wrapper"> 
      <p class="list-total">{{ $t('waiting-list.total').replace('{0}', waiting_list.pagination.total_items ) }}</p> 
      <div class="table-wrapper">
        <view-table :data="waiting_list" @change-page="onChangePage">  
          <template slot="booking_date" slot-scope="{ row }">
            <div v-b-tooltip.hover.bottom.html :title="getToolTipContent(row)">
              <waiting-time :waiting="row"/>
            </div>
          </template>

          <template slot="client_info" slot-scope="{ row }"> 
            <p>{{ row.client_name }}</p>
            <p>{{ formatHideInfoCol(row.client_mobile_number, row.client_registration_date) }}</p>
          </template>
          
          <template slot="resource_name" slot-scope="{ row }"> 
            <p v-if="row.booking_resource_setup_id > 0">{{ row.resource_name }}</p> 
          </template>

          <template slot="booking_items" slot-scope="{ row }"> 
            <p v-for="(item, index) in row.waiting_booked_items" :key="index">{{ item.service_name }}</p> 
          </template>

          <template slot="estimated_time" slot-scope="{ row }"> 
            <p v-if="!isNullObject(row.waiting_booked_items) && row.waiting_booked_items.length >0">{{ calculateTotalEstimated(row.waiting_booked_items) }} {{ $t('waiting-list.minutes') }}</p> 
          </template>

          <template slot="booking" slot-scope="{ row }">
            <a class="btn btn-edit" @click="onChangeWaitingToBooking(row)">{{ $t('waiting-list.book') }}</a>
          </template>

          <template slot="edit" slot-scope="{ row }"> 
            <div class="menu-waiting-actions">
              <menu-waiting-action :waiting="row" @edit-waiting="onActionWaiting" @cancel-waiting="onCancelWaiting"/>
            </div>
          </template>
        </view-table>
      </div>
    </div>

    <div v-else-if="skin == bookings_options.waiting_list_skin.mini" class="list-waiting">
      <div v-for="waiting in x_waitings_calendar" :key="waiting.index" class="item has-item"> 
        <div class="left">
          <waiting-time :waiting="waiting"/>

          <p>{{ waiting.client_name }}</p>
          <p v-if="waiting.booking_resource_setup_id > 0">{{ waiting.resource_name }}</p>
        </div>
        <menu-waiting-action :waiting="waiting" @edit-waiting="onActionWaiting" @cancel-waiting="onCancelWaiting"/>
      </div>
    </div>

    <alert-confirm :id="alert_id" :title="alert_title" :data_alerts="alert_data"  
                   @confirm="onAlertConfirm" @cancel="onAlertCancel"/>
  </div>
</template> 
<script>
import _ from 'lodash'
import moment from 'moment'
import { options }         from '../../../../helpers/options'
import { bookings_options } from '../../../../helpers/options/bookings-options'

import { mapGetters, mapActions } from 'vuex' 
import view_table from '../../../common/view-table/view-table.vue' 
import alert_confirm from '../../../common/alert/alert-confirm'
import WaitingViewModel from '../../../../view-model/bookings/waiting-view-model'
import BookingViewModel     from '../../../../view-model/bookings/booking-view-model'  
import component_base    from '../../../common/component-base/component-base' 
import ClientsCache                     from '../../../../helpers/cache/clients-cache'
import { 
  // calculateStartTime,
  convertDateToTimezone,
  formatDateBySetting,
  formatHourShort,
  exceedWorkHourViewGroup, 
  cache_session,
  generateLeadTimeOptions,
  getTimeInclude24,
  convertMinutesToHours, 
  convertHoursToMinutes, 
  getHideClientInfoPermission,
  hideMobilePhone,
  convertHoursToRow } from '../../../../helpers/common' 

let WaitingTime = {
  props: {
    waiting: {
      type: Object,
      default: new WaitingViewModel().getFields()
    }
  },
  data(){
    return {
      next_day_text: '+1D'
    }
  },
  methods: {
    formatDateBySetting,
    formatHourShort,
    checkIsNextDay(waiting){
      let is_next_day = false
      is_next_day = waiting.is_next_day || convertHoursToMinutes(waiting.from_time) > convertHoursToMinutes(waiting.to_time)
      return is_next_day
    },
    formatBookingDate(booking_date){
      let tmp = convertDateToTimezone(booking_date)
      return moment(tmp).format(options.standard_date_format.ymd)
    },
  },
  template: 
    '<div>'+
      '<p class="date">{{ formatBookingDate(waiting.booking_date) }}</p>'+
      '<p>'+
        '<span v-if="waiting.is_next_day">{{ next_day_text }}</span> {{ formatHourShort(waiting.from_time) }} ~ '+
        '<span v-if="checkIsNextDay(waiting)">{{ next_day_text }}</span> {{ formatHourShort(waiting.to_time) }}'+
      '</p>'+
    '</div>'
}

let MenuWaitingAction = {
  props: {
    waiting: {
      type: Object,
      default: new WaitingViewModel().getFields()
    }
  },
  methods: {
    onClickEditWaiting(waiting){
      this.$emit('edit-waiting', options.form_actions.edit, waiting)
    },
    onClickCancelWaiting(waiting){
      this.$emit('cancel-waiting', waiting)
    }
  },
  template: 
    '<b-dropdown text="=" class="dropdown-custom" '+
              'no-caret no-flip dropleft>'+
      '<b-dropdown-item @click="onClickEditWaiting(waiting)">{{ $t(\'waiting-list.edit-waiting\') }}</b-dropdown-item>'+
      '<b-dropdown-item @click="onClickCancelWaiting(waiting)">{{ $t(\'waiting-list.cancel-waiting\') }}</b-dropdown-item>'+
    '</b-dropdown>'
}

export default {
  components: {
    'view-table': view_table, 
    'alert-confirm': alert_confirm,
    'waiting-time': WaitingTime,
    'menu-waiting-action': MenuWaitingAction
  }, 
  extends: component_base,
  props: {
    skin: {
      type: Number,
      default: null
    }
  },
  data(){
    return {
      options,
      bookings_options,

      data_table:{
        fields: [
          { field: 'booking_date',                label: 'waiting-list.booking-date-time',             width: '15%', sortable: false, thClass: 'booking-date',   expand: true  },
          { field: 'client_info',                 label: 'waiting-list.client-name-mobile-number',     width: '15%', sortable: false, thClass: 'client-info',    expand: true  }, 
          { field: 'resource_name',               label: 'waiting-list.resource',                      width: '15%', sortable: false, thClass: 'resource-name' },
          { field: 'booking_items',               label: 'waiting-list.booking-items',                 width: '10%', sortable: false, thClass: 'booking-items',  expand: true  },
          { field: 'estimated_time',              label: 'waiting-list.estimated-time',                width: '10%', sortable: false, thClass: 'estimated-time', expand: true  },
          { field: 'notes',                       label: 'waiting-list.notes',                         width: '15%', sortable: false, thClass: 'notes' },
          { field: 'booking',                     label: 'waiting-list.booking',                       width: '10%', sortable: false, thClass: 'booking',        expand: true },
          { field: 'edit',                        label: 'general.edit',                               width: '10%', sortable: false, thClass: 'edit',           expand: true }, 
        ],
        rows:[], 
        pagination:{
          total_pages: 1,
          total_items:0
        },
        options: {
          fixed_header: true,
          pagination: true
        }, 
      }, 

      clients_setup: {},
      clients_cache: new ClientsCache(),

      booking_add:{},
      this_year: new Date().getFullYear(), 
      waiting_cancel:{},
      show_alert_bookable_wating: false,

      alert_id: 'waiting_items_alert_id',
      alert_title :'',
      alert_data:[],
    }
  },
  computed: {
    ...mapGetters('alert', {
      x_alerts: 'getAlerts', 
    }),  
    ...mapGetters('waiting', {
      x_waitings_calendar: 'getWaitingsCalendar',
      x_waiting_list: 'getWaitingList'
    }),   
    ...mapGetters('booking', {
      x_booking_helps: 'getBookingHelps'
    }),
    waiting_list(){
      return this.loadWaitingList(this.x_waiting_list)
    },
    registered_by(){return this.$i18n.t('booking-list.registered-by')},
    warning_delete_waiting(){return this.$i18n.t('waiting-list.warning-delete-waiting')},
    bookable_waiting_confirmation(){return this.$i18n.t('waiting-list.bookable-waiting-confirmation')}
  },
  async created(){
    if(this.skin == bookings_options.waiting_list_skin.full)
      this.alert_id = 'full' + this.alert_id
    else if(this.skin == bookings_options.waiting_list_skin.mini)
      this.alert_id = 'mini' + this.alert_id

    this.clients_setup = await this.clients_cache.getAllClientsSetupCache(this.shop_data.shop_id)
    if(this.isNullObject(this.clients_setup))
      this.showMissingClientsSetupAlert()
  },
  methods: { 
    ...mapActions('alert', [
      'setAlertsData', 
    ]),
    ...mapActions('booking', [ 
      'setBookingActionData', 
      'updateBookingHelpsData',
      'changingWaitingToBookingDataAsync'
    ]),
    ...mapActions('waiting', [
      'setWaitingActionData',
      'updateWaitingDataAsync'
    ]),
    // Load waiting list
    loadWaitingList(waiting_list){
      if(!this.isNullObject(waiting_list)){
        this.data_table.rows = waiting_list.items   
        this.data_table.pagination = waiting_list.pagination 
      }
      return this.data_table
    },
    calculateTotalEstimated(waiting_booked_items){ 
      let total_time = 0 
      for(var index in waiting_booked_items){ 
        let booked_item = waiting_booked_items[index]
        if(!this.isNullObject(booked_item)){
          total_time += (booked_item.estimated_time + booked_item.processing_time + booked_item.finishing_time )
        }
      }
      return total_time
    },

    // action waiting
    onActionWaiting(action, waiting = {}){
      this.waiting_action = {
        action: action,
        data: waiting 
      } 
      this.setWaitingActionData(this.waiting_action)  
      this.showDialogById('waiting-action-modal')
    },
    onCancelWaiting(waiting_cancel){
      waiting_cancel.status = options.waiting_status.canceled
      this.waiting_cancel =waiting_cancel

      this.alert_data = [this.warning_delete_waiting]
      this.showDialogById(this.alert_id) 
    },
    async onAlertConfirm(){ 
      if(this.show_alert_bookable_wating){  
        this.showAddBooking(this.booking_add)
        this.booking_add ={}
        this.show_alert_bookable_wating = false
        this.waiting_to_change_booking={}
      }
      else{
        this.preLoader() 
        await this.updateWaitingDataAsync(this.waiting_cancel) 
        this.preLoader(false)

        if(this.x_alerts.length > 0 ) {
          this.showAlert(this, this.x_alerts, { title:'', confirm : undefined }) 
        }
        else {
          this.$emit('canceled-waiting', this.waiting_cancel)
          this.data_table.rows = this.x_waiting_list.items
        } 
        this.waiting_cancel = {}
      } 
    },
    onAlertCancel(){
      this.waiting_cancel ={} 
      this.booking_add = {} 
      this.waiting_to_change_booking={}
      this.show_alert_bookable_wating = false
    },
    async onChangeWaitingToBooking(waiting){
      this.booking_setup  = await cache_session.getBookingSetupCache(this.shop_data.shop_id)
      if(this.isMissingCalendarSetup(this.booking_setup)){
        this.showAlert(this.booking_setup.error_messages)
      }
      else {
        let booking_calendar_setup = this.booking_setup.booking_calendar_setup
        this.waiting_to_change_booking = waiting
        this.booking_add = this.mapWaitingToBooking(waiting, booking_calendar_setup)  

        let is_error = false
        if(waiting.booking_resource_setup_id > 0 && !this.isNullObject(this.booking_add.fields.booked_items) && this.booking_add.fields.booked_items.length >0){
          let first_booked_item = this.booking_add.fields.booked_items [0] 
          let last_booked_item = _.last(this.booking_add.fields.booked_items)
          let group  = {
            booking_resource_setup_id: waiting.booking_resource_setup_id, 
            row: convertHoursToRow(first_booked_item.start_time, this.booking_setup),
            row_end: convertHoursToRow(last_booked_item.end_time, this.booking_setup)
          }
          let exceed = await exceedWorkHourViewGroup(this.booking_add.fields.booking_date, group)
          if(exceed == false){
            var booking_check =_.cloneDeep(this.booking_add.fields)
            booking_check.is_check_bookable_waiting = true
            booking_check.is_duplicate_blocked_time = false
            booking_check.is_duplicate_another_booking = false 
            booking_check.is_booking_exceeds_work_hours = false

            await this.changingWaitingToBookingDataAsync(booking_check) 
            if(this.x_alerts.length > 0 ) {
              is_error = true
            }
          }
        }
        if(is_error){ 
          this.show_alert_bookable_wating = true
          this.showConfirmation()
        }
        else{ 
          this.showAddBooking(this.booking_add)
        }
      }
    },
    showConfirmation(){
      this.alert_data = [this.bookable_waiting_confirmation]
      this.showDialogById(this.alert_id)
    },
    showAddBooking(booking){ 
      let tmp_start_time = this.waiting_to_change_booking.is_next_day ? getTimeInclude24(this.waiting_to_change_booking.from_time) : this.waiting_to_change_booking.from_time
      let booking_action = {
        action: this.options.form_actions.add,
        data: _.cloneDeep(booking).fields,
        options: {
          booking_resource_setup_id: 0,
          booking_date: booking.booking_date,
          start_time: tmp_start_time,
        }
      }

      this.updateBookingHelpsData({ date_picker: booking.booking_date })
      this.setBookingActionData(booking_action)
      this.showDialogById('booking-action-modal')
    },
    mapWaitingToBooking(waiting){
      var booking = new BookingViewModel() 
      booking.fields = Object.assign(booking.fields, this.shop_data) 
      booking.fields.waiting_id =  waiting.id
      booking.fields.booking_date = waiting.booking_date 
      booking.fields.client_id= waiting.client_id 
      booking.fields.client_name= waiting.client_name 
      booking.fields.client_mobile_number= waiting.client_mobile_number 
      booking.fields.notes= waiting.notes  
      booking.fields.status= options.booking.booking_status.requested
      booking.fields.booking_source= options.booking.booking_source.staff
      booking.fields.repeat_booking={ repeat_date_tss:[],repeat_dates:[] }
      booking.fields.booking_deposit={}
      booking.fields.booked_items = []
      booking.fields.from_time = waiting.from_time
      booking.fields.to_time = waiting.to_time

      booking.fields.chain_id         = waiting.chain_id
      booking.fields.branch_number    = waiting.branch_number
      booking.fields.shop_name        = waiting.shop_name
      booking.fields.client_shop_id   = waiting.client_shop_id
      booking.fields.client_shop_name = waiting.client_shop_name

      let booked_item = {}
      if(!this.isNullObject(waiting.waiting_booked_items) && waiting.waiting_booked_items.length >0){
        for(var index in waiting.waiting_booked_items){ 
          let booked = waiting.waiting_booked_items[index]
          booked_item = {
            booking_resource_setup_id: waiting.booking_resource_setup_id,
            is_next_day     : waiting.is_next_day,
            start_time      : waiting.is_next_day ? getTimeInclude24(waiting.from_time) : waiting.from_time,
            estimated_time  : booked.estimated_time,
            finishing_time  : booked.finishing_time,
            processing_time : booked.processing_time, 
            service_id      : booked.service_id,
            service_name    : booked.service_name,
            booking_item_id : booked.booking_item_id,
            deducted_prepaid_goods_ref      : booked.deducted_prepaid_goods_ref,
            deducted_prepaid_goods_ref_name : booked.deducted_prepaid_goods_ref_name,
          }
          
          booked_item = generateLeadTimeOptions(booked_item, this.x_booking_helps.estimated_time_options)
          booked_item = this.calculateStartEndTimeBookedItem(booked_item)
          booking.fields.booked_items.push(booked_item) 
        }
      }
      return booking
    },
    calculateStartEndTimeBookedItem(item){
      item.start_time_minutes = convertHoursToMinutes(item.start_time)
      item.end_time_minutes = item.start_time_minutes + item.estimated_time + item.processing_time + item.finishing_time
      item.end_time = convertMinutesToHours(item.end_time_minutes)
      return item
    },
    onChangePage(page){
      this.$emit('change-page', page)
    },
    getToolTipContent(row){
      return '<p>' + this.registered_by + ' ' + row.created_by_name + '</p>'+
             '<p>' + moment(row.registration_date).format(options.standard_date_format.dmyh) + '</p>'
    },
    formatHideInfoCol(mobile, registration_date){
      if(!_.isEmpty(this.clients_setup))
      {
        let isHideClientInfo = getHideClientInfoPermission(this.clients_setup.environments.contact_info_to_manager, this.clients_setup.environments.contact_info_to_staff, registration_date)
        if(isHideClientInfo) mobile= hideMobilePhone(mobile)
      }
      return mobile
    }
  }
}
</script>

<style lang="scss">
@import './waiting-items.scss';
</style>