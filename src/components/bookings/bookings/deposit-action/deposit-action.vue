<template>
  <b-modal :id="modal_id" 
           :title="form_title"
           :no-enforce-focus="true"
           :no-close-on-backdrop="true"
           :no-close-on-esc="true"
           :hide-header-close="true"
           hide-footer
           class="booking-deposit-action-modal"
           @show="onLoadForm()"
           @hide="onCancel()">
    <div v-if="is_disabled" class="view-only"/>
    <div class="form-wrapper">
      <div class="deposit-type">
        <radio-group v-model="booking_deposit.fields.deposit_type" :options="deposit_type_option" :buttons="false"
                     @input="onInputDepositType"/>
      </div>
      <div class="deposit-info">
        <div v-if="booking_deposit.fields.deposit_type != options.deposit_type.pay_by_balance" class="row form-group">
          <div class="col-12 col-sm-4">
            <label class="require">
              <span v-if="booking_deposit.fields.deposit_type == options.deposit_type.not_paid_yet">{{ $t('bookings.due-date-time') }}</span>
              <span v-if="booking_deposit.fields.deposit_type == options.deposit_type.paid">{{ $t('bookings.paid-date') }}</span>
            </label>
          </div>
          <div class="col-12 col-sm-4 due-date">
            <v-date-picker v-model="booking_deposit.fields.due_date" 
                           :popover="{ placement: 'bottom' }"
                           :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"
                           @input="onInputDueDate"/>
          </div>
          <div v-if="booking_deposit.fields.deposit_type == options.deposit_type.not_paid_yet" class="col-12 col-sm-4 due-time">
            <select-hour v-model="booking_deposit.fields.due_time"
                         :select_hour_options="due_time_options"/>
          </div>
          <div v-if="booking_deposit.fields.deposit_type == options.deposit_type.paid" class="col-12 col-sm-4 payment-method">
            <b-form-select v-model="booking_deposit.fields.payment_method_id">
              <option v-for="option in payment_method_options" :key="option.id" :value="option.id">{{ option.name }}</option>
            </b-form-select>
          </div>
        </div>
        <div v-else class="row form-group">
          <div class="col-12 col-sm-4">
            <label>{{ $t('bookings.balance') }}</label>
          </div>
          <div class="col-12 col-sm-8 balance">
            <!-- :decimal="2" -->
            <input-money v-model="client.fields.balance" :decimal="2" :zero="true" 
                         :disabled="true"/>
          </div>
        </div>

        <div class="row form-group">
          <div class="col-12 col-sm-4">
            <label class="require">{{ $t('general.amount') }}</label>
          </div>
          <div class="col-12 col-sm-8 amount">
            <!-- :decimal="2" -->
            <input-money v-model="booking_deposit.fields.amount" :decimal="2"/>
          </div>
        </div>
      </div>

      <error-box :errors="deposit_errors"/>
      <footer class="modal-footer">
        <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { DatePicker } from 'v-calendar'
import { mapGetters, mapActions } from 'vuex'
import { options }             from '../../../../helpers/options'
import ClientApi               from '../../../../api/clients/client-api'
import ClientViewModel         from '../../../../view-model/clients/client-view-model'
import BookingDepositViewModel from '../../../../view-model/bookings/booking-deposit-view-model'

import radio_group      from '../../../common/form/radio/radio-group/radio-group'
import input_money      from '../../../common/form/input/input-money/input-money-by-blur.vue' 
import error_box        from '../../../common/form/error-box/error-box' 
import btn_action_group from '../../../common/button/btn-action-group/btn-action-group'
import component_base   from '../../../common/component-base/component-base'
import select_hour      from '../../../common/form/select/select-hour/select-hour'
import { formatMoney,
  convertMinutesToHours,
  convertDateToTimezone,
  cache_session
} from '../../../../helpers/common'

export default {
  components: {
    'radio-group': radio_group,
    'v-date-picker': DatePicker,
    'input-money': input_money,
    'error-box': error_box,
    'btn-action-group': btn_action_group,
    'select-hour': select_hour,
  },
  extends: component_base,
  props: {
    modal_id: {
      type: String,
      default: ''
    }
  },
  data(){
    return {
      options,

      form_options: {
        confirm: true,
        delete: false
      },

      due_time_options:{
        start: '00:00',
        step: '00:05',
        end: '23:55'
      },
      payment_method_options: [],
      is_disabled: false, // true: in case checked-out booking only

      client: new ClientViewModel(),
      booking_deposit: new BookingDepositViewModel(),
      deposit_errors: [],
    }
  },
  computed:{
    ...mapGetters('alert', {
      x_alerts: 'getAlerts',
    }),
    ...mapGetters('booking_deposit', {
      x_booking_deposit: 'getBookingDepositAction'
    }),
    form_title(){return this.$i18n.t('bookings.booking-deposit')},
    warning_deposit_must_less_or_equal_balance(){return this.$i18n.t('bookings.warning-deposit-must-less-or-equal-balance')},
    is_registered_client(){
      return this.x_booking_deposit.options && this.x_booking_deposit.options.booking.client_id > 0
    },
    deposit_type_option(){
      let tmp_options = [
        { value: options.deposit_type.not_paid_yet,   text: 'bookings.not-paid-yet' },
        { value: options.deposit_type.paid,           text: 'bookings.paid' },
        { value: options.deposit_type.pay_by_balance, text: 'bookings.pay-by-balance' },
      ]
      if(!this.is_registered_client)
        tmp_options = tmp_options.filter(o => o.value != options.deposit_type.pay_by_balance)
      return tmp_options
    }
  },
  methods: {
    ...mapActions('alert', [
      'setAlertsData'
    ]),
    ...mapActions('booking_deposit', [
      'setBookingDepositActionData'
    ]),
    ...mapActions('booking', [
      'updateBookingDataAsync'
    ]),
    hideModal(){
      this.hideDialogById(this.modal_id)
    },
    onCancel(){
      this.hideModal()
    },
    async onLoadForm(){
      this.is_disabled = false
      this.form_options.confirm = true
      this.deposit_errors = []

      this.payment_method_options = await cache_session.getPaymentMethodSetupCache(this.shop_data.shop_id)
      this.booking_deposit.fields = Object.assign(this.booking_deposit.fields, this.x_booking_deposit.data)
      
      // load client balance
      if(this.is_registered_client){
        let query = {
          client_id: this.x_booking_deposit.options.booking.client_id,
          shop_id: this.shop_data.shop_id
        }
        
        let api = new ClientApi()
        let result = await api.getClientAsync(query)
        this.client.setFields(result.data)
      }
      
      if(this.booking_deposit.fields.due_date == null 
      || this.booking_deposit.fields.due_date == '' 
      || this.booking_deposit.fields.deposit_type == options.deposit_type.pay_by_balance) {
        this.setDueDateAndDueTime(convertDateToTimezone(new Date()))
      }
      else {
        let tmp_due_date = moment(this.booking_deposit.fields.due_date).toDate()
        this.setDueDateAndDueTime(tmp_due_date)
      }
      if(this.x_booking_deposit.action == options.form_actions.add || this.booking_deposit.fields.amount == 0) 
        this.booking_deposit.fields.amount = ''

      // for booking-list
      if(this.x_booking_deposit.options.deposit_from == options.deposit_from.booking_list){
        let ref_booking = this.x_booking_deposit.options.booking
        if(ref_booking.status == options.booking.booking_status.checked_out){
          this.is_disabled = true
          this.form_options.confirm = false
        }
      }
    },
    async onConfirm(){
      this.deposit_errors = []
      let booking_deposit = _.cloneDeep(this.booking_deposit)
      booking_deposit.fields = this.mapBookingDeposit(booking_deposit.fields)
      
      this.deposit_errors = booking_deposit.isValid()
      if(this.deposit_errors.length == 0) {
        // balance > amount (in case pay by balance)
        if(booking_deposit.fields.deposit_type == options.deposit_type.pay_by_balance 
        && booking_deposit.fields.amount > this.client.fields.balance){
          this.deposit_errors.push(this.warning_deposit_must_less_or_equal_balance)
          return
        }

        // for booking-list
        if(this.x_booking_deposit.options.deposit_from == options.deposit_from.booking_list){
          let booking = this.x_booking_deposit.options.booking
          booking.is_deposit_required = true
          booking.booking_deposit = booking_deposit.fields
          booking.booking_deposit.amount = formatMoney(booking.booking_deposit.amount, 2)
          this.enableAllFlag(booking)

          let data_send = _.cloneDeep(booking)
          this.setAlertsData([])
          
          await this.updateBookingDataAsync(data_send)
          if(this.x_alerts.length > 0) {
            this.deposit_errors = this.x_alerts
            return
          }
        }
        // for calendar
        else {
          let booking_deposit_action = {
            data: booking_deposit.fields,
            action: options.form_actions.edit
          }
          this.setBookingDepositActionData(booking_deposit_action)
          this.$emit('submit-deposit', this.payment_method_options)
        }
        this.hideModal()
      }
    },
    enableAllFlag(booking){
      booking.is_duplicate_blocked_time       = false
      booking.is_duplicate_another_booking    = true
      booking.is_booking_exceeds_work_hours   = true
      booking.must_check_performance_resource = false
    },
    setDueDateAndDueTime(due_date){
      this.booking_deposit.fields.due_date = due_date
      this.booking_deposit.fields.due_time = this.getDueTimeFromDueDate(due_date)
    },
    getDueTimeFromDueDate(due_date){
      let tmp_minutes_all = due_date.getHours() * 60 + due_date.getMinutes()
      let tmp_minutes_surplus = tmp_minutes_all % 5
      let tmp_minutes_final = tmp_minutes_all - tmp_minutes_surplus        
      return convertMinutesToHours(tmp_minutes_final)
    },
    mapBookingDeposit(booking_deposit){
      if(booking_deposit.due_date == null 
      || booking_deposit.due_date == '' 
      || booking_deposit.deposit_type == options.deposit_type.pay_by_balance) {
        this.setDueDateAndDueTime(convertDateToTimezone(new Date()))
      }
      if(booking_deposit.deposit_type == options.deposit_type.not_paid_yet){
        let hour    = booking_deposit.due_time.substring(0,2)
        let minutes = booking_deposit.due_time.substring(3,5)
        booking_deposit.due_date.setHours(hour)
        booking_deposit.due_date.setMinutes(minutes)

        booking_deposit.payment_method_id = 0
      }
      if(booking_deposit.deposit_type == options.deposit_type.pay_by_balance){
        booking_deposit.due_date = null
        booking_deposit.payment_method_id = 0
      }

      let booking_deposit_data = _.cloneDeep(booking_deposit)
      return booking_deposit_data
    },
    onInputDepositType(){
      if(this.booking_deposit.fields.payment_method_id == null)
        this.booking_deposit.fields.payment_method_id = 0
    },
    onInputDueDate(date){
      if(date == null)
        this.setDueDateAndDueTime(convertDateToTimezone(new Date()))
    },
  }
}
</script>

<style lang="scss">
@import './deposit-action.scss';
</style>