<template>
  <div v-if="!isNullObject(booking_setup)" class="booking-info">
    <b-form-checkbox v-model="booking.fields.booking_client_type" 
                     :value="options.booking_client_type.walking_client" 
                     :unchecked-value="options.booking_client_type.booked_client" 
                     :disabled="booking.fields.original_booking_id != null && booking.fields.original_booking_id != undefined"
                     class="walk-in" 
                     @click.native.prevent="onClickBookingClientType">{{ $t('bookings.walk-in') }}</b-form-checkbox>
    <div class="title">{{ $t('bookings.booking') }}</div>
    <div class="box-time">
      <div class="clearfix">
        <div class="color-picker-box form-group clearfix">
          <label>{{ $t('bookings.color') }}</label>
          <select-color v-model="booking.fields.display_color"/>
        </div>
        <b-form-checkbox v-model="booking.fields.is_vip" :value="true" :unchecked-value="false" 
                         class="is-vip">{{ $t('bookings.vip') }}</b-form-checkbox>
        <b-form-checkbox v-model="booking.fields.send_messages" :value="false" :unchecked-value="true" 
                         class="not-send-message">{{ $t('bookings.not-send-messages') }}</b-form-checkbox>
      </div>

      <div class="box-date clearfix">
        <div class="date-picker-box">
          <label>{{ $t('general.date') }}</label>
          <v-date-picker v-model="booking.fields.booking_date" :popover="{ placement: 'bottom' }"
                         :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"
                         @input="onInputBookingDate"/>
          <div v-if="!can_change_booking_date" class="view-only"/>
        </div>
        
        <div v-show="(x_booking_action.action == options.form_actions.add || booking.fields.original_booking_id == null || booking.fields.original_booking_id == undefined)
        && booking.fields.booking_client_type != options.booking_client_type.walking_client" class="repeat-block">
          <a class="btn btn-repeat" @click="onActionRepeatBooking">{{ $t('bookings.repeat') }}</a>
          <span v-show="booking.fields.repeat_booking.repeat_dates && booking.fields.repeat_booking.repeat_dates.length > 0">
            {{ booking.fields.repeat_booking.repeat_dates.length + 1 }} 
            <span v-if="booking.fields.repeat_booking.repeat_dates.length > 0">{{ $t('bookings.days-repeat') }}</span>
          </span>
        </div>
      </div>
    </div>

    <div class="add-service">
      <table>
        <thead>
          <tr>
            <th class="booking-items"><span>{{ $t('booking-item.booking-items') }}</span></th>
            <th class="resource"><span>{{ $t('booking-resources.resource') }}</span></th>
            <th class="start-time"><span>{{ $t('booking-resources.start-time') }}</span></th>
            <th class="estimated-time"><span>{{ $t('booking-item.estimated-time') }}</span></th>
            <th class="delele-action"><span>{{ $t('general.delete') }}</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in booking.fields.booked_items" :key="index">
            <td>{{ item.service_name }}</td>
            <td><b-form-select v-model="item.booking_resource_setup_id" :options="booking_resources_setup.items"
                               value-field="id" text-field="resource_name" @change="onChangeBookedItem"/></td>
            <td>
              <select-hour v-if="!item.disabled" v-model="item.start_time" :select_hour_options="from_time_picker_options" 
                           :disabled="item.disabled" class="from-time" @change="onChangeBookedItem"/>
              <b-form-select v-else v-model="item.start_time" 
                             :options="[{id:item.start_time, time: getStartTimeText(item.start_time)}]" 
                             :disabled="true" value-field="id" text-field="time"
                             class="from-time"/>
            </td>
            <td><b-form-select v-model="item.lead_time" :options="item.lead_time_options" 
                               value-field="id" text-field="time" @change="onChangeBookedItem"/></td>
            <td><a class="btn btn-white" @click="onDeleteBookedItem(item)">x</a></td>
          </tr>
          <tr>
            <td colspan="5"><a class="btn" @click="onClickAddBookedItems">{{ $t('bookings.add-booking-item') }}</a></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="booking-deposit">
      <b-form-checkbox v-model="booking.fields.is_deposit_required" :value="true" :unchecked-value="false"
                       :disabled="booking_deposit_disabled" 
                       @click.native.prevent="onChangeDepositRequired">
        <span>{{ $t('bookings.booking-deposit-is-required') }}</span>
      </b-form-checkbox>
      <p v-if="booking.fields.is_deposit_required" class="deposit-brief"> 
        <span>(<b>{{ $t('general.amount') }}</b> {{ formatMoney(booking.fields.booking_deposit.amount) }} / </span>
        <span v-if="booking.fields.booking_deposit.deposit_type == options.deposit_type.not_paid_yet">
          <b>{{ $t('bookings.due-date-time') }}</b> {{ booking.fields.booking_deposit.due_date_view }})
        </span>
        <span v-if="booking.fields.booking_deposit.deposit_type == options.deposit_type.paid">
          <b>{{ $t('bookings.paid') }}</b> {{ $t('general.on') }} {{ booking.fields.booking_deposit.due_date_view }} 
          {{ $t('general.by') }} {{ booking.fields.booking_deposit.payment_method_name }})
        </span>
        <span v-if="booking.fields.booking_deposit.deposit_type == options.deposit_type.pay_by_balance">
          <b>{{ $t('bookings.pay-by-balance') }})</b>
        </span>
        <span class="btn btn-white" @click="onActionBookingDepositFromBookingCalendar(booking.fields.booking_deposit, options.form_actions.edit, booking.fields)">
          {{ $t('general.edit') }}</span>
      </p>
    </div>
    <div class="booking-note form-group">
      <b-form-textarea v-model="booking.fields.notes" :rows="4" placeholder="Notes"/>
    </div>

    <booked-item-action @add-booked-item="onAddBookedItems"/>
    <repeat-booking-action :data="booking.fields.repeat_booking" :booking_date="booking.fields.booking_date" 
                           @submit-repeat-booking="onSubmitRepeatBooking"/>
    <deposit-action :modal_id="deposit_action_modal_id" @submit-deposit="onSubmitDeposit"/>
    <alert-confirm :id="alert_id" :data_alerts="alert_data"
                   @confirm="onAlertConfirmDeleteDeposit" @cancel="onAlertCancelDeleteDeposit"/>
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters }     from 'vuex'
import { setupCalendar, DatePicker }  from 'v-calendar'
import { options }                    from '../../../../helpers/options'
import booking_deposit_mixin          from '../../../../helpers/mixins/booking-deposit-mixin'
import BookingViewModel               from '../../../../view-model/bookings/booking-view-model'
import BookingDepositViewModel        from '../../../../view-model/bookings/booking-deposit-view-model'

import booked_item_action       from '../booked-item-action/booked-item-action'
import repeat_booking_action    from '../repeat-booking-action/repeat-booking-action'
import deposit_action           from '../deposit-action/deposit-action'
import alert_confirm            from '../../../common/alert/alert-confirm'
import component_base           from '../../../common/component-base/component-base'
import select_hour              from '../../../common/form/select/select-hour/select-hour'
import select_color             from '../../../common/form/select/select-color/select-color'
import { formatMoney, 
  calculateStartTime, 
  generateLeadTimeOptions, 
  convertHoursToMinutes,
  cache_session,
  calculatePaymentMethodName,
  convertMinutesToHours, 
  generateWorkHourOfShop,
  getLastTimeSlotToBooking,
  getDatePickerMin,
  getDatePickerMax,
  convertDateToTimezone,
  getTimeSubtract24}            from '../../../../helpers/common'

export default {
  components: {
    'v-date-picker': DatePicker,
    'booked-item-action': booked_item_action,
    'repeat-booking-action': repeat_booking_action,
    'deposit-action': deposit_action,
    'alert-confirm': alert_confirm,
    'select-hour': select_hour,
    'select-color': select_color
  },
  extends: component_base,
  mixins: [booking_deposit_mixin],
  props: {
    data: {
      type: Object,
      default: () => []
    },
  },
  data(){
    return {
      options,

      booking_deposit_disabled: false,
      booking_setup: null,
      booking_calendar_setup: null,
      booking_resources_setup: null,
      booking_items_setup: null,

      today: convertDateToTimezone(new Date()),
      booking_date: new Date(),
      next_day_text: this.$i18n.t('booking-resources.next-day'),
      from_time_picker_options:{
        start: '00:00',
        step: '00:30',
        end: '23:30'
      },

      deposit_action_modal_id: 'booking-deposit-action-modal-from-booking-calendar',

      alert_id: 'booking_deposit_delete_alert_id',
      alert_data: [],
    }
  },
  computed: {
    ...mapGetters('booking', {
      x_booking_helps: 'getBookingHelps'
    }),
    ...mapGetters('booking', {
      x_booking_action: 'getBookingAction'
    }),
    ...mapGetters('booking_deposit', {
      x_booking_deposit: 'getBookingDepositAction'
    }),
    warning_delete_booking_deposit(){return this.$i18n.t('bookings.warning-delete-booking-deposit')},
    warning_walk_in_client_can_not_deposit(){return this.$i18n.t('bookings.warning-walk-in-client-can-not-deposit')},
    formatMoney(){
      return formatMoney
    },
    booking(){
      let booking_vm = new BookingViewModel()
      booking_vm = Object.assign(booking_vm, this.data)
      return booking_vm
    },
    can_change_booking_date(){
      let can_change = true
      if(this.booking.fields.repeat_booking.repeat_dates && this.booking.fields.repeat_booking.repeat_dates.length > 0)
        can_change = false
      if(this.x_booking_action.action == options.form_actions.edit && this.booking.fields.id == this.booking.fields.original_booking_id)
        can_change = true
      return can_change
    },
    date_picker_min(){
      return getDatePickerMin(this.today)
    },
    date_picker_max(){
      return getDatePickerMax(this.today)
    }
  },
  async mounted(){
    setupCalendar({
      locale: this.locale,
      firstDayOfWeek: 2,
      titleTransition: 'none',
      weeksTransition: 'none',
      datePickerTintColor: '#3499db'
    })
  },
  methods: {
    async prepaidSetupData(){
      this.booking_setup = await cache_session.getBookingSetupCache(this.shop_data.shop_id)
      if(this.isMissingCalendarSetup(this.booking_setup)){
        this.showAlert(this.booking_setup.error_messages)
      }
      else{
        let booking_opening_hours_setup = this.booking_setup.booking_opening_hours_setup
        let work_hours = generateWorkHourOfShop(booking_opening_hours_setup.opening_hours)
      
        this.from_time_picker_options.start = work_hours.time_start
        this.from_time_picker_options.end   = getLastTimeSlotToBooking(work_hours.time_finish, this.booking_setup.booking_calendar_setup.booking_time_slot)
        this.from_time_picker_options.step  = convertMinutesToHours(this.booking_setup.booking_calendar_setup.booking_time_slot)
        this.booking_calendar_setup  = this.booking_setup.booking_calendar_setup
        this.booking_resources_setup = this.booking_setup.booking_resources_setup
        this.booking_items_setup     = this.booking_setup.booking_items_setup
      }
    },
    getStartTimeText(start_time){
      let start_time_minutes = convertHoursToMinutes(start_time)
      if(start_time_minutes >= options.minutes_of_24h)
        return this.next_day_text + ' ' + getTimeSubtract24(start_time)
      else
        return start_time
    },
    updateStartTimeForBookedItems(start_time, form_action){
      this.booking.fields.booked_items = calculateStartTime(
        this.booking.fields.booked_items,
        form_action,
        start_time, 
        this.booking_calendar_setup.booking_time_slot)
    },
    onClickBookingClientType(){
      if(this.booking.fields.is_deposit_required){
        this.booking.fields.booking_client_type = options.booking_client_type.booked_client
        this.showAlertDialog([this.warning_walk_in_client_can_not_deposit])
      }
      else {
        if(this.booking.fields.booking_client_type == options.booking_client_type.booked_client) {
          this.booking.fields.booking_client_type = options.booking_client_type.walking_client
          this.booking_deposit_disabled = true

          this.booking.fields.is_deposit_required = false
          this.booking.fields.repeat_booking.repeat_dates = []
        }
        else if(this.booking.fields.booking_client_type == options.booking_client_type.walking_client) {
          this.booking.fields.booking_client_type = options.booking_client_type.booked_client
          this.booking_deposit_disabled = false
        }
      }
    },
    async onClickAddBookedItems(){
      this.showDialogById('booked-item-action-modal')
    },
    onAddBookedItems(items){
      for(let i in items){
        let booked_item = {
          booking_resource_setup_id: this.x_booking_action.options.booking_resource_setup_id,
          estimated_time:   items[i].estimated_time,
          finishing_time:   items[i].finishing_time,
          processing_time:  items[i].processing_time,
          service_name:     items[i].name,
          start_time:       items[i].start_time
        }
        if(this.booking_items_setup.use_service_code){
          booked_item.booking_item_id = 0
          booked_item.service_id      = items[i].id
        }
        else {
          booked_item.booking_item_id = items[i].id
          booked_item.service_id      = 0
        } 
        booked_item = generateLeadTimeOptions(booked_item, this.x_booking_helps.estimated_time_options)
        this.booking.fields.booked_items.push(booked_item)
      } 
      this.updateStartTimeForBookedItems(
        this.x_booking_action.options.start_time, 
        options.form_actions.add)
    },
    onDeleteBookedItem(item){
      this.booking.fields.booked_items = this.booking.fields.booked_items.filter(i => i.order_number != item.order_number)
      this.updateStartTimeForBookedItems(
        this.x_booking_action.options.start_time, 
        options.form_actions.delete)
    },
    async onChangeBookedItem(){
      this.updateStartTimeForBookedItems(this.x_booking_action.options.start_time, options.form_actions.edit)
    },
    async onChangeStartTime(start_time){
      let start_time_minutes = convertHoursToMinutes(start_time)
      let tmp_start_time = start_time
      if(start_time_minutes >= options.minutes_of_24h)
        tmp_start_time = getTimeSubtract24(start_time)
      this.booking.fields.booked_items[0].start_time = tmp_start_time
      this.updateStartTimeForBookedItems(tmp_start_time,  options.form_actions.edit)
    },
    onActionRepeatBooking(){
      this.showDialogById('repeat-booking-action-modal')
    },
    onSubmitRepeatBooking(repeat_booking){
      this.booking.fields.repeat_booking = repeat_booking
    },
    onChangeDepositRequired(){
      if(this.booking.fields.booking_client_type != options.booking_client_type.walking_client){
        if(!this.booking.fields.is_deposit_required) {
          this.onActionBookingDepositFromBookingCalendar(this.booking.fields.booking_deposit, options.form_actions.add, this.booking.fields)
        }
        else {
          this.alert_data = [this.warning_delete_booking_deposit]
          this.showDialogById(this.alert_id)
        }
      }
    },
    onActionBookingDepositFromBookingCalendar(booking_deposit, action, booking){
      this.onActionBookingDeposit(booking_deposit, action, booking, options.deposit_from.booking_calendar)
    },
    async onSubmitDeposit(){
      this.booking.fields.is_deposit_required = true
      this.booking.fields.booking_deposit = this.x_booking_deposit.data
      let format = this.shop_data.format_date
      if(this.booking.fields.booking_deposit.deposit_type == options.deposit_type.not_paid_yet){
        format += ' a HH:mm'
      }
      this.booking.fields.booking_deposit.due_date_view = moment(this.booking.fields.booking_deposit.due_date).format(format)
      this.booking.fields.booking_deposit.payment_method_name = await calculatePaymentMethodName(this.booking)
    },
    onAlertCancelDeleteDeposit(){
      this.hideDialogById(this.alert_id)
    },
    onAlertConfirmDeleteDeposit(){
      this.deleteBookingDeposit()
    },
    deleteBookingDeposit(){
      this.booking.fields.is_deposit_required = false
      this.booking.fields.booking_deposit = new BookingDepositViewModel().getFields()
      this.booking.fields.booking_deposit.amount = 0
    },
    onInputBookingDate(date){
      if(date == null) {
        this.booking.fields.booking_date = this.x_booking_action.options.booking_date
      }
    }
  }
}
</script>

<style lang="scss">
@import './booking-info.scss';
</style>