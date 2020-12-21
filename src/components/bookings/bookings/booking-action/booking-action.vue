<template>
  <b-modal id="booking-action-modal" 
           :title="form_title"
           :no-close-on-backdrop="true"
           hide-footer
           class="booking-action-modal"
           @show="onLoadForm()"
           @hide="onCancel()">
    <div class="form-wrapper">
      <client-search v-if="x_booking_action.action != options.form_actions.edit"
                     ref="client_search"
                     :action_visible="false"
                     @click-search-client="onClickSearchClient" 
                     @clear-search-client="onClearSearchClientForm"
                     @select-client="onSelectClient"/>
      <div v-show="show_booking_form" class="booking-form">
        <div class="row">
          <div class="col-12 col-lg-5">
            <client-info :data="client" 
                         :booking_summary="booking_summary" 
                         :bookings_by_client="bookings_by_client"
                         :has_rebook="true"
                         :hide_info="hide_info"
                         @remove-client="onRemoveClient"
                         @rebook="onRebooking"
                         @change-page-bookings-by-client="onChangePageBookingsByClient"
                         @deduct-prepaid-service="onDeductPrepaidService"/>
          </div>
          <div class="col-12 col-lg-7 booking-info-wrapper">
            <div class="divider"/>
            <booking-info ref="booking_info" :data="booking"/>
            <error-box :errors="booking_errors"/>
            <footer class="modal-footer">
              <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
            </footer>
          </div>
        </div>
      </div>

      <alert-confirm :id="alert_id" :data_alerts="alert_data"
                     @confirm="onAlertConfirmAsync" @cancel="onAlertCancel"/>
    </div>
  </b-modal>
</template>

<script>
// Utils
import _ from 'lodash'
import moment from 'moment'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { options }              from '../../../../helpers/options'
import ClientViewModel          from '../../../../view-model/clients/client-view-model'
import BookingViewModel         from '../../../../view-model/bookings/booking-view-model'

// Mixins
import client_info_mixin        from '../../../../helpers/mixins/client-info-mixin'

// Components
import client_search            from '../client-search/client-search'
import client_info              from '../client-info/client-info.vue'
import booking_info             from '../booking-info/booking-info.vue'
import alert_confirm            from '../../../common/alert/alert-confirm'
import error_box                from '../../../common/form/error-box/error-box' 
import btn_action_group         from '../../../common/button/btn-action-group/btn-action-group'
import component_base           from '../../../common/component-base/component-base'

import { convertHoursToMinutes, 
  convertMinutesToHours,
  formatMoney,
  calculateStartTime,
  generateLeadTimeOptions,
  cache_session,
  getTimeSubtract24,
  getTimeInclude24,
  isOver24Hours, 
  isBookingStartTimeExeedWorkHour,
  getHideClientInfoPermission,
  convertTimeStampPlusLocalzone,
  convertDateToTimeStamp, 
  convertDateToTimezone,
}               from '../../../../helpers/common'
import ClientsCache                     from '../../../../helpers/cache/clients-cache'

export default {
  components: {
    'client-search': client_search,
    'client-info': client_info,
    'booking-info': booking_info,
    'alert-confirm': alert_confirm,
    'error-box': error_box,
    'btn-action-group': btn_action_group
  },
  extends: component_base,
  mixins: [client_info_mixin],
  data(){
    return {
      options,

      form_options: {
        delete: false
      },
      show_booking_form: true,

      bookings: [],

      client: new ClientViewModel(),
      booking: new BookingViewModel(),
      
      payment_method_options: [],

      booking_errors: [],
      booking_items_setup: null ,
      booking_setup: null,
      booking_resources_setup: null,
      booking_calendar_setup: null,

      alert_id: 'alert-confirm-booking-errors-modal',
      alert_data: [],
      modal_error_messages: [],
      form_error_messages: [],
      
      hide_info: true,
      clients_setup: {},
      clients_cache: new ClientsCache(),
    }
  },
  computed: {
    ...mapGetters('alert', {
      x_alerts: 'getAlerts',
    }),
    ...mapGetters('booking', {
      x_bookings: 'getBookingCalendar',
      x_booking_helps: 'getBookingHelps',
      x_booking_action: 'getBookingAction',
    }),
    ...mapGetters('client', {
      x_booking_client: 'getBookingClient',
    }),
    form_title(){
      let tmp_title = ''
      if(this.x_booking_action.action == options.form_actions.add)    tmp_title = this.$i18n.t('bookings.add-booking')
      if(this.x_booking_action.action == options.form_actions.edit)   tmp_title = this.$i18n.t('bookings.edit-booking')
      if(this.x_booking_action.action == options.form_actions.re_add) tmp_title = this.$i18n.t('bookings.rebook')
      return tmp_title
    },
    start_time_exeeds_working_hours(){return this.$i18n.t('bookings.warning-start-time-exeeds-working-hours')},
    booking_over_hours_message() {return this.$i18n.t('bookings.warning-booking-over-working-hours')},
    want_to_save_message() {return this.$i18n.t('bookings.warning-really-save')},
  },
  methods: {
    ...mapActions('alert', [
      'setAlertsData'
    ]),
    ...mapActions('booking', [
      'setBookingHelpsData',
      'setBookingActionData',
      'addBookingDataAsync',
      'changingWaitingToBookingDataAsync',
      'updateBookingDataAsync'
    ]),
    ...mapMutations('client', [
      'setBookingClient',
    ]),
    hideModal(){
      this.resetBookingAction()
      this.hideDialogById('booking-action-modal')
    },
    onCancel(){
      if(this.$refs.client_search && this.x_booking_action.action != options.form_actions.edit)
        this.$refs.client_search.onClearSearch()

      this.hideModal()
    },
    resetBookingAction(){
      let booking_action = {
        action: options.form_actions.add,
        data: new BookingViewModel().getFields(),
        options: {
          booking_resource_setup_id: 0,
          booking_date: new Date(),
          start_time: '00:00'
        }
      }
      this.setBookingActionData(booking_action)
    },
    onRebooking(booking){
      let tmp_booking_action = _.cloneDeep(this.x_booking_action)

      // get booked_items
      tmp_booking_action.action = options.form_actions.re_add
      tmp_booking_action.data.booking_date = tmp_booking_action.options.booking_date
      tmp_booking_action.data.booked_items = booking.booked_items
      for(let i in tmp_booking_action.data.booked_items){
        let booked_item = tmp_booking_action.data.booked_items[i]
        booked_item.booking_resource_setup_id = tmp_booking_action.options.booking_resource_setup_id
        // booked_item.resource_name
        if(i == 0){
          booked_item.is_next_day = false
          booked_item.start_time = tmp_booking_action.options.start_time
        }
      }

      // get client info
      tmp_booking_action.data.client_id            = booking.client_id
      tmp_booking_action.data.client_member_number = booking.client_member_number
      tmp_booking_action.data.client_mobile_number = booking.client_mobile_number
      tmp_booking_action.data.client_name          = booking.client_name
      tmp_booking_action.data.member_number        = booking.client_member_number
      tmp_booking_action.data.client_shop_id       = booking.client_shop_id

      this.setBookingActionData(tmp_booking_action)
      this.onLoadForm()
    },
    onDeductPrepaidService(prepaid_service, service){
      let tmp_service = service.service.fields
      this.$refs.booking_info.onAddBookedItems([tmp_service])

      // update deducted info
      for(let i in this.booking.fields.booked_items){
        let tmp_booked_item = this.booking.fields.booked_items[i]
        if(i == this.booking.fields.booked_items.length - 1){
          tmp_booked_item.deducted_prepaid_goods_ref      = prepaid_service.client_prepaid_service_id
          tmp_booked_item.deducted_prepaid_goods_ref_name = prepaid_service.prepaid_service_name
        }
      }
    },
    async onLoadForm(){
      this.booking_errors = []
      this.booking_setup = await cache_session.getBookingSetupCache(this.shop_data.shop_id)
      if(this.isMissingCalendarSetup(this.booking_setup)){
        this.showAlert(this.booking_setup.error_messages)
      }
      this.clients_setup = await this.clients_cache.getAllClientsSetupCache(this.shop_data.shop_id)
      if(this.isNullObject(this.clients_setup)){
        this.showMissingClientsSetupAlert()
      }
      else{
        this.booking_resources_setup = this.booking_setup.booking_resources_setup
        this.booking_calendar_setup = this.booking_setup.booking_calendar_setup
        
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

        if(this.x_booking_action.action == options.form_actions.add) {
          this.booking = new BookingViewModel()
          if(this.x_booking_action.data.waiting_id > 0){
            this.booking.fields = Object.assign(this.booking.fields, this.x_booking_action.data)   
            this.loadActionData(options.form_actions.add)
          }
          else {
            this.booking.fields.booking_date = this.x_booking_action.options.booking_date
            this.client = new ClientViewModel()
          }

          // cusor focus to client_search_input
          this.$nextTick(() => {
            this.$refs.client_search.$refs.client_search_input.$el.focus()
          })

          // set default client if has booking_client from client vuex store 
          if (this.x_booking_client) {
            let is_empty_client_name = this.isEmptyClientName(this.x_booking_client.client_name)
            if(this.x_booking_client.id && !is_empty_client_name){
              this.onSelectClient(this.x_booking_client)
            }
            if(!this.x_booking_client.id && is_empty_client_name){
              //From CID, unregistered client who has mobile number
              if(this.x_booking_client.mobile_number && this.x_booking_client.mobile_number.length > 0){
                this.client.fields.mobile_number = this.x_booking_client.mobile_number
              }
            }
          }
        }
        
        if(this.x_booking_action.action == options.form_actions.edit
        || this.x_booking_action.action == options.form_actions.re_add){
          this.hide_info=false
          this.booking.fields = Object.assign(this.booking.fields, this.x_booking_action.data)
          this.booking.fields.booking_date = convertDateToTimezone(this.booking.fields.booking_date)

          this.loadActionData(options.form_actions.edit)
          
          if(this.x_booking_action.action == options.form_actions.edit && this.client.fields.id > 0) {
            await this.loadBookingsSummaryByClient(this.client.fields.id)
            await this.loadBookingsByClient(this.client.fields.id)
          }
        }
        this.booking.fields.is_booking_exceeds_work_hours = false
        this.$refs.booking_info.prepaidSetupData()
      }
    },
    loadActionData(action){
      for(let i in this.booking.fields.booked_items){
        let item = this.booking.fields.booked_items[i]
        item = generateLeadTimeOptions(item, this.x_booking_helps.estimated_time_options)
      }

      if(action == options.form_actions.edit){
        for(let ii in this.booking.fields.booked_items){
          let tmp_item = this.booking.fields.booked_items[ii]
          if(tmp_item.is_next_day)
            this.booking.fields.booked_items[ii].start_time = getTimeInclude24(tmp_item.start_time)
        }
      }
      
      this.booking.fields.booked_items = calculateStartTime(
        this.booking.fields.booked_items, 
        action,
        this.x_booking_action.options.start_time, 
        this.booking_calendar_setup.booking_time_slot
      )

      // booking deposit
      let format = options.standard_date_format.ymd
      if(this.booking.fields.booking_deposit.deposit_type == options.deposit_type.not_paid_yet){
        format += ' a HH:mm'
      }
      this.booking.fields.booking_deposit.due_date_view = moment(this.booking.fields.booking_deposit.due_date).format(format)
      
      // client info
      this.client.fields.id            = this.booking.fields.client_id
      this.client.fields.client_id     = this.booking.fields.client_id
      this.client.fields.client_name   = this.booking.fields.client_name
      this.client.fields.mobile_number = this.booking.fields.client_mobile_number
      this.client.fields.member_number = this.booking.fields.client_member_number
    },
    onConfirm(){
      if(this.x_booking_action.action == options.form_actions.add
      || this.x_booking_action.action == options.form_actions.re_add){
        if(this.x_booking_action.data.waiting_id >0){ 
          this.submitActionAsync('changingWaitingToBookingDataAsync', 'changed-waiting-to-booking')
        }
        else{ 
          this.submitActionAsync('addBookingDataAsync', 'added-booking')
        } 
      }
      else if(this.x_booking_action.action == options.form_actions.edit){
        this.submitActionAsync('updateBookingDataAsync', 'edited-booking')
      }
    },
    async submitActionAsync(api_action, success_action){
      this.booking_errors = []
      let booking = _.cloneDeep(this.booking)

      let tmp_client_registration_date = null
      if(this.x_booking_action.action == options.form_actions.add || this.x_booking_action.action == options.form_actions.re_add){
        let tmp_client_registration_date = booking.fields.booking_date // unregistered client
        if(this.client.fields.id > 0){
          tmp_client_registration_date = this.client.fields.registration_date
        }
        booking.fields.client_registration_date_ts = this.getClientRegistrationDateTS(tmp_client_registration_date)
      }
      if(this.x_booking_action.action == options.form_actions.edit && this.client.fields.id > 0){
        if(this.client.fields.registration_date == null){
          tmp_client_registration_date = this.client.fields.registration_date
          booking.fields.client_registration_date_ts = this.getClientRegistrationDateTS(tmp_client_registration_date)
        }
      }

      // map client data
      booking.fields.client_id            = this.client.fields.id
      booking.fields.client_name          = this.client.fields.client_name
      booking.fields.client_mobile_number = this.client.fields.mobile_number
      booking.fields.client_member_number = this.client.fields.member_number
      
      // chain-sharing
      booking.fields.chain_id             = this.shop_data.chain_id
      booking.fields.branch_number        = this.shop_data.branch_number
      booking.fields.shop_name            = this.shop_data.shop_name
      booking.fields.client_shop_id       = this.shop_data.shop_id
      booking.fields.client_shop_name     = this.shop_data.shop_name
      
      let tmp_client_shop_id   = booking.fields.client_shop_id
      let tmp_client_shop_name = booking.fields.client_shop_name
      if(this.client.fields.id > 0){
        booking.fields.client_shop_id       = this.client.fields.shop_id
        booking.fields.client_shop_name     = this.client.fields.shop_name
      }
      if(this.x_booking_action.data.waiting_id > 0){
        booking.fields.client_shop_id       = tmp_client_shop_id
        booking.fields.client_shop_name     = tmp_client_shop_name
      }

      // validate
      this.booking_errors = booking.isValid()
      if(this.booking_errors.length == 0){
        booking.fields = Object.assign(booking.fields, this.shop_data)

        // check start time exceed workhour cover booking calendar
        if(await isBookingStartTimeExeedWorkHour(booking.fields.booking_date, booking.fields.booked_items)){
          booking.fields.is_booking_exceeds_work_hours = false
          this.showAlertDialog([this.start_time_exeeds_working_hours])
          return
        }
        
        // map is-next-day booked-item
        for(let i in booking.fields.booked_items){
          let booked_item = booking.fields.booked_items[i]
          if(isOver24Hours(booked_item.start_time)){
            booked_item.start_time = getTimeSubtract24(booked_item.start_time)
            booked_item.is_next_day = true
          }
          else booked_item.is_next_day = false
        }

        // map booking date & repeat booking
        booking.fields.booking_date = moment(booking.fields.booking_date).utc().toDate()
        if(this.x_booking_action.action == options.form_actions.add && this.booking.fields.repeat_booking != null){
          this.booking.fields.repeat_booking.repeat_dates = this.booking.fields.repeat_booking.repeat_dates.map(date => {
            let utc_date = ''
            if(!moment(date).isValid()) utc_date = moment(date, options.standard_date_format.ymd).utc().toDate()
            else utc_date = date
            return utc_date
          })
        }

        // map booking deposit
        if(booking.fields.is_deposit_required){
          let amount = booking.fields.booking_deposit.amount
          if(typeof(amount) == 'number') amount = amount.toString()
          if(amount.indexOf('.') == -1) amount = formatMoney(amount, 2)
          booking.fields.booking_deposit.amount = amount
        }

        // map resource inactive
        let tmp_resource_ids = this.booking_resources_setup.items.map(r => r.id)
        for(let i in booking.fields.booked_items){
          let tmp_item = booking.fields.booked_items[i]
          if(!tmp_resource_ids.includes(tmp_item.booking_resource_setup_id)){
            tmp_item.booking_resource_setup_id = 0
          }
        }
        
        // flag validate
        booking.fields.is_allowed_moving_multi_resources_booking = true
        booking.fields.is_duplicate_blocked_time = false
        if(this.booking_calendar_setup.allow_duplicate_bookings){
          booking.fields.is_duplicate_another_booking = true
        }
        else{
          booking.fields.is_duplicate_another_booking = false
        }

        this.setAlertsData([])

        this.preLoader()
        await this[api_action](booking.fields)
        this.preLoader(false)

        if(this.x_alerts.length == 0) {
          this.$emit(success_action)
          this.hideModal()
        }
        else {
          this.showAlertConfirmBooking(this.x_alerts)
        }
      }
    },
    getClientRegistrationDateTS(date){
      return convertTimeStampPlusLocalzone(convertDateToTimeStamp(date, false, true))
    },
    showAlertConfirmBooking(messages){
      let modal_error_codes = [
        options.booking.booking_error_codes.bk36c, // booking-exceed-shop-workhour
        options.booking.booking_error_codes.bk48c, // booking-exceed-resource-workhour
      ]
      this.modal_error_messages = []
      this.form_error_messages = []

      for(let i in messages){
        let tmp_error_codes = messages[i].match(/BK[0-9]+C/g)
        if(tmp_error_codes != null && tmp_error_codes.length > 0){
          for(let j in tmp_error_codes){
            if(modal_error_codes.includes(tmp_error_codes[j]))
              this.modal_error_messages.push(messages[i])
            else
              this.form_error_messages.push(messages[i])
          }
        }
        else
          this.form_error_messages.push(messages[i])
      }
      if(this.form_error_messages.length > 0){
        this.booking_errors = this.form_error_messages
      }
      else if(this.modal_error_messages.length > 0){
        this.alert_data = [this.booking_over_hours_message]
        this.alert_data.push(this.want_to_save_message) 
        this.showDialogById(this.alert_id)
      }
    },
    onAlertConfirmAsync(){
      this.booking.fields.is_booking_exceeds_work_hours = true
      this.onConfirm()
    },
    onAlertCancel(){
      this.booking_errors = [...this.booking_errors, ...this.modal_error_messages]
    },
   
    calculateStartEndTimeBookedItem(item){
      item.start_time_minutes = convertHoursToMinutes(item.start_time)
      item.end_time_minutes = item.start_time_minutes + item.estimated_time + item.processing_time + item.finishing_time
      item.end_time = convertMinutesToHours(item.end_time_minutes)
      return item
    },
    onClickSearchClient(){
      this.show_booking_form = false
      this.client = new ClientViewModel()
    },
    onRemoveClient(){
      this.show_booking_form = true
      this.client = new ClientViewModel()

      // reset booking_client from client vuex store
      this.setBookingClient(new ClientViewModel().fields)
    },
    async onSelectClient(client){
      this.show_booking_form = true
      this.client.fields = client
      this.hide_info=getHideClientInfoPermission(this.clients_setup.environments.contact_info_to_manager, this.clients_setup.environments.contact_info_to_staff, this.client.fields.registration_date)
      let tmp_client_id = 0
      if(this.client.fields.id > 0)
        tmp_client_id = this.client.fields.id
      if(this.client.fields.client_id > 0)
        tmp_client_id = this.client.fields.client_id

      this.booking.fields.client_id            = tmp_client_id
      this.booking.fields.client_name          = this.client.fields.client_name
      this.booking.fields.client_mobile_number = this.client.fields.mobile_number
      this.booking.fields.client_member_number = this.client.fields.member_number
      this.booking.fields.client_shop_id       = this.client.fields.shop_id

      await this.loadBookingsSummaryByClient(this.client.fields.id)
      await this.loadBookingsByClient(this.client.fields.id)
    },
    onClearSearchClientForm(){
      this.show_booking_form = true
    },
    isEmptyClientName(client_name){
      return client_name === null || client_name === undefined || client_name === ''
    }
  }
}
</script>

<style lang="scss">
@import './booking-action.scss';
</style>