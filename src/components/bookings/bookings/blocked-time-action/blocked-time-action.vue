<template>
  <b-modal id="blocked-time-action-modal" 
           :title="form_title"
           :no-close-on-backdrop="true"
           hide-footer 
           class="blocked-time-action-modal"
           @show="onLoadForm">
    <div class="form-wrapper">
      <div class="row form-group date">
        <div class="col-12 col-sm-3">
          <label>{{ $t('general.date') }}</label>
        </div>
        <div class="col-12 col-sm-9">
          <v-date-picker v-model="calendar_date" :popover="{ placement: 'bottom' }"
                         :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }" 
                         @input="onChangeBookingDate"/>
        </div>
      </div>
      <div class="row form-group blocked-time">
        <div class="col-12 col-sm-3">
          <label>{{ $t('bookings.blocked-time') }}</label>
        </div>
        <div class="col-12 col-sm-9">
          <div class="row">
            <div class="col-sm-6 from-time">
              <select-hour v-model="blocked_time.fields.from_time_show" :disabled="is_off_date"
                           :select_hour_options="from_time_picker_options"
                           @change="onChangeFromTime"/>
            </div>
            <div class="col-sm-6 to-time">
              <select-hour v-model="blocked_time.fields.to_time_show" :disabled="is_off_date"
                           :select_hour_options="to_time_picker_options"/>
            </div>
          </div>
        </div>
      </div>
      <div class="row form-group resource">
        <div class="col-12 col-sm-3">
          <label>{{ $t('booking-resources.resource') }}</label>
        </div>
        <div class="col-12 col-sm-9">
          <b-form-select v-model="blocked_time.fields.booking_resource_setup_id" :placeholder="$t('general.select')"
                         :options="booking_resources_setup" :disabled="x_blocked_time_action.action == options.form_actions.edit"
                         value-field="id" text-field="resource_name" @input="onSelectBookingResource"/>
        </div>
      </div>
      <div class="row form-group notes">
        <div class="col-12 col-sm-3">
          <label>{{ $t('general.description') }}</label>
        </div>
        <div class="col-12 col-sm-9">
          <b-form-textarea v-model="blocked_time.fields.notes" :rows="4" placeholder=""/>
        </div>
      </div>
    </div>

    <error-box :errors="errors"/>
    <div class="modal-footer">
      <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
    </div>
  </b-modal>
</template>

<script>
import _                          from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import { DatePicker }             from 'v-calendar'
import { options }                from '../../../../helpers/options'
import BlockedTimeViewModel       from '../../../../view-model/bookings/blocked-time-view-model'

import error_box                  from '../../../common/form/error-box/error-box' 
import btn_action_group           from '../../../common/button/btn-action-group/btn-action-group'
import component_base             from '../../../common/component-base/component-base'
import select_hour                from '../../../common/form/select/select-hour/select-hour'
import {convertMinutesToHours, 
  convertHoursToMinutes, 
  getTimeOptionsByDate, 
  getTimeInclude24,
  getTimeSubtract24, 
  isOffDay,
  cache_session,
  getLastTimeSlotToBooking,
  getDatePickerMin,
  getDatePickerMax,
  convertDateToTimezone,
  isOver24Hours}                  from    '../../../../helpers/common'


export default {
  components: {
    'v-date-picker': DatePicker,
    'error-box': error_box,
    'btn-action-group': btn_action_group,
    'select-hour': select_hour
  },
  extends: component_base,
  data(){
    return {
      options,
      
      today: convertDateToTimezone(new Date()),
      calendar_date: convertDateToTimezone(new Date()),
      form_options: {
        delete: false
      },

      blocked_time: new BlockedTimeViewModel(),
      this_year: new Date().getFullYear(),
      time_picker_format: options.standard_hour_format.default,
      from_time_picker_options:{
        start: '00:00',
        step: '00:30',
        end: '23:30'
      },
      to_time_picker_options:{
        start: '00:00',
        step: '00:30',
        end: '23:30'
      }, 
      is_off_date : false,
      booking_setup: [],
      booking_resources_setup: [],
      booking_resources: [],
      booking_resource_setup_options: [], 
    }
  },
  computed: {
    ...mapGetters('alert', {
      x_alerts: 'getAlerts',
    }),
    ...mapGetters('blocked_time', {
      x_blocked_time_action: 'getBlockedTimeAction'
    }),
    form_title(){
      let tmp_title = ''
      if(this.x_blocked_time_action.action == options.form_actions.add)  tmp_title = this.$i18n.t('bookings.add-blocked-time')
      if(this.x_blocked_time_action.action == options.form_actions.edit) tmp_title = this.$i18n.t('bookings.edit-blocked-time')
      return tmp_title
    },
    date_picker_min(){
      return getDatePickerMin(this.today)
    },
    date_picker_max(){
      return getDatePickerMax(this.today)
    }
  },
  methods: {
    ...mapActions('alert', [
      'setAlertsData'
    ]),
    ...mapActions('blocked_time', [
      'addBlockedTimeDataAsync',
      'updateBlockedTimeDataAsync'
    ]),
    hideModal(){
      this.hideDialogById('blocked-time-action-modal')
    },
    onCancel(){
      this.hideModal()
    },
    async onLoadForm(){
      this.booking_setup = await cache_session.getBookingSetupCache(this.shop_data.shop_id)

      if(this.isMissingCalendarSetup(this.booking_setup)){
        this.showAlert(this.booking_setup.error_messages)
      }
      else{
        this.booking_resources_setup =  this.booking_setup.booking_resources_setup.items
        this.from_time_picker_options.step = convertMinutesToHours(this.booking_setup.booking_calendar_setup.booking_time_slot) 
        this.to_time_picker_options.step   = this.from_time_picker_options.step
        this.calendar_date = this.x_blocked_time_action.options.booking_date
        let from_time_minutes = 0
        if(this.x_blocked_time_action.action == options.form_actions.add){
          this.blocked_time = new BlockedTimeViewModel()

          this.blocked_time.fields.blocked_date = convertDateToTimezone(this.blocked_time.fields.blocked_date)
          this.blocked_time.fields.from_time = this.x_blocked_time_action.options.start_time
          from_time_minutes = convertHoursToMinutes(this.blocked_time.fields.from_time)
          this.blocked_time.fields.to_time = convertMinutesToHours(from_time_minutes + 
                                             this.booking_setup.booking_calendar_setup.booking_time_slot)  
      
          this.blocked_time.fields.booking_resource_setup_id = this.x_blocked_time_action.options.booking_resource_setup_id
        }
        else if(this.x_blocked_time_action.action == options.form_actions.edit){
          this.blocked_time.fields = Object.assign({}, this.x_blocked_time_action.data)
        } 

        this.getTimePickerOptions(this.calendar_date)
        this.loadTime()
      }
      this.errors = []
    },
    onConfirm(){
      if(this.x_blocked_time_action.action == options.form_actions.add){
        this.submitActionAsync('addBlockedTimeDataAsync', 'add-blocked-time')
      }
      else if(this.x_blocked_time_action.action == options.form_actions.edit){
        this.submitActionAsync('updateBlockedTimeDataAsync', 'update-blocked-time')
      }
    },
    async submitActionAsync(api_action, success_action){
      this.blocked_time.fields = Object.assign(this.blocked_time.fields, this.shop_data)

      this.mapTimeTo24hFormat() 
      this.blocked_time.fields.blocked_date = this.calendar_date
      if(isOver24Hours(this.blocked_time.fields.from_time_show))
        this.blocked_time.fields.is_next_day = true
      else 
        this.blocked_time.fields.is_next_day = false

      // validate
      this.setAlertsData([])
      this.errors = this.blocked_time.isValid() 
      if(this.errors.length == 0) {
        let data_send = _.cloneDeep(this.blocked_time.fields)
        
        this.preLoader()
        await this[api_action](data_send)
        this.preLoader(false)

        if(this.x_alerts.length == 0) {
          this.$emit(success_action)
          this.hideModal()
        }
        else this.errors = this.x_alerts
      }
    },
    onChangeFromTime(time){
      this.to_time_picker_options.start = convertMinutesToHours(convertHoursToMinutes(time) + this.booking_setup.booking_calendar_setup.booking_time_slot) 
      
      this.mapTimeTo24hFormat()
      if(!this.isNullObject(this.blocked_time.fields.to_time)){
        if(convertHoursToMinutes(this.blocked_time.fields.from_time_show) >= convertHoursToMinutes(this.blocked_time.fields.to_time_show)){
          this.blocked_time.fields.to_time_show = undefined
          this.blocked_time.fields.to_time = undefined
        }
      }
      this.$forceUpdate()
    }, 
    loadTime(){
      if(this.x_blocked_time_action.options.cross_date)
        this.blocked_time.fields.from_time_show = getTimeInclude24(this.blocked_time.fields.from_time)
      else
        this.blocked_time.fields.from_time_show =  this.blocked_time.fields.from_time
      
      if((this.x_blocked_time_action.options.cross_date) 
      || (convertHoursToMinutes(this.blocked_time.fields.from_time) > convertHoursToMinutes(this.blocked_time.fields.to_time))) {
        this.blocked_time.fields.to_time_show = getTimeInclude24(this.blocked_time.fields.to_time) 
      }
      else{ 
        this.blocked_time.fields.to_time_show = this.blocked_time.fields.to_time
      }
      this.to_time_picker_options.start  = convertMinutesToHours(convertHoursToMinutes(this.blocked_time.fields.from_time_show ) + this.booking_setup.booking_calendar_setup.booking_time_slot)
    },
    mapTimeTo24hFormat(){
      if(!this.isNullObject(this.blocked_time.fields.from_time_show)){
        if(isOver24Hours(this.blocked_time.fields.from_time_show))
          this.blocked_time.fields.from_time = getTimeSubtract24(this.blocked_time.fields.from_time_show)
        else
          this.blocked_time.fields.from_time = this.blocked_time.fields.from_time_show
      }  
      if(!this.isNullObject(this.blocked_time.fields.to_time_show)){
        if(isOver24Hours(this.blocked_time.fields.to_time_show))
          this.blocked_time.fields.to_time = getTimeSubtract24(this.blocked_time.fields.to_time_show)
        else
          this.blocked_time.fields.to_time = this.blocked_time.fields.to_time_show 
      }
    },
    onChangeBookingDate(date){
      if(date == null)
        this.calendar_date = convertDateToTimezone(new Date())
      this.getTimePickerOptions(this.calendar_date)
    },
    onSelectBookingResource(){
      this.getTimePickerOptions(this.calendar_date)
    },
    getTimePickerOptions(date){
      this.is_off_date = isOffDay(date, this.blocked_time.fields.booking_resource_setup_id, this.booking_setup)
      
      if(!this.is_off_date){
        let work_hours = getTimeOptionsByDate(date, this.blocked_time.fields.booking_resource_setup_id, this.booking_setup)
        let tmp_time_finish = getLastTimeSlotToBooking(work_hours.time_finish, this.booking_setup.booking_calendar_setup.booking_time_slot)
        this.from_time_picker_options.start = work_hours.time_start 
        this.from_time_picker_options.end   = tmp_time_finish
        this.to_time_picker_options.start   = work_hours.time_start
        this.to_time_picker_options.end     = work_hours.time_finish
      }
      else{
        this.blocked_time.fields.from_time_show = ''
        this.blocked_time.fields.to_time_show   = ''
        this.blocked_time.fields.from_time      = ''
        this.blocked_time.fields.to_time        = ''
      }
    }, 
  }
}
</script>

<style lang="scss">
@import './blocked-time-action.scss';
</style>