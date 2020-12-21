<template>
  <b-modal id="waiting-action-modal" 
           ref="waiting-action"
           :title="form_title"
           :no-close-on-backdrop="true"
           hide-footer
           class="waiting-action-modal"
           @show="onLoadForm()"
           @hide="onCancel()">
    <div class="form-wrapper">
      <client-search ref="client_search"
                     @click-search-client="onClickSearchClient" 
                     @clear-search-client="onClearSearchClientForm"
                     @select-client="onSelectClient"/>
      <div v-show="show_waiting_form" class="waiting-form">
        <div class="row">
          <div class="col-12 col-lg-5">
            <client-info :data="client" 
                         :booking_summary="booking_summary" 
                         :bookings_by_client="bookings_by_client"
                         :has_rebook="false"
                         :hide_info="hide_info"
                         @remove-client="onRemoveClient"
                         @change-page-bookings-by-client="onChangePageBookingsByClient"
                         @deduct-prepaid-service="onDeductPrepaidService"/>
          </div>
          <div class="col-12 col-lg-7 waiting-info-wrapper">
            <div class="waiting-info">
              <div class="box-time">
                <div class="row form-group resource">
                  <div class="col-sm-3">
                    <label>{{ $t('waiting-list.resource') }}</label>
                  </div> 
                  <div class="col-sm-6">
                    <b-form-select v-model="waiting.fields.booking_resource_setup_id" :placeholder="$t('waiting-list.resource')"
                                   :options="resource_options" value-field="id" text-field="resource_name" 
                                   @input="onChangeResource"/>
                  </div>
                </div>
                <div class="row form-group waiting-date">
                  <div class="col-sm-3">
                    <label>{{ $t('waitings.date') }}</label>
                  </div>  
                  <div class="col-sm-6">
                    <v-date-picker v-model="waiting.fields.booking_date" :popover="{ placement: 'bottom' }"
                                   :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"
                                   @input="onChangeBookingDate"/>
                  </div>
                </div>
                <div class="row form-group time">
                  <div class="col-sm-3">
                    <label>{{ $t('waitings.time') }}</label>
                  </div>
                  <div class="col-6 col-sm-3 from-time">
                    <select-hour v-model="waiting.fields.from_time_show" :disabled="is_off_date" 
                                 :select_hour_options="from_time_picker_options" @change="onChangeFromTime" />
                  </div> 
                  <div class="col-6 col-sm-3 to-time">
                    <span class="time-symbol"> ~ </span>
                    <select-hour v-model="waiting.fields.to_time_show" :disabled="is_off_date" 
                                 :select_hour_options="to_time_picker_options"/> 
                  </div>
                </div>
              </div> 
              <div class="add-service">
                <table class="">
                  <thead>
                    <tr>
                      <th width="50%">{{ $t('waitings.booking-items') }}</th>  
                      <th width="40%">{{ $t('waitings.estimated-time') }}</th>
                      <th width="10%">{{ $t('general.delete') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in waiting.fields.waiting_booked_items" :key="index">
                      <td>{{ item.service_name }}</td> 
                      <td>
                        <b-form-select v-model="item.lead_time" :options="item.lead_time_options" 
                                       value-field="id" text-field="time"
                                       class="select-estimated" @change="onChangeBookedItem(item)"/>
                        <span class="select-estimated-label">{{ $t('waitings.minutes') }}</span>
                      </td>
                      <td><a class="btn btn-white btn-delete" @click="onDeleteBookedItem(item)">x</a></td>
                    </tr>
                    <tr class="final-row">
                      <td><a class="btn btn-add-service" @click="onClickAddBookedItems">{{ $t('waitings.add-booking-item') }}</a></td>
                      <td colspan="2"><span v-if="total_estimated > 0">
                        {{ $t('waitings.total-estimated-time') }} {{ total_estimated }} {{ $t('waitings.minutes') }}</span></td>
                    </tr>
                  </tbody>
                </table>
              </div> 
              <div class="form-group notes">
                <b-form-textarea v-model="waiting.fields.notes" :rows="4" :placeholder="$t('waitings.notes')"/>
              </div> 
              <booked-item-action @add-booked-item="onAddBookedItems" />  
            </div> 
            <error-box :errors="waiting_errors"/>
            <footer class="modal-footer">
              <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
            </footer>
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { mapGetters, mapActions } from 'vuex'
import { setupCalendar, DatePicker } from 'v-calendar' 
import { options }        from '../../../../helpers/options'
import WaitingViewModel   from '../../../../view-model/bookings/waiting-view-model'
import ClientViewModel    from '../../../../view-model/clients/client-view-model' 
import error_box          from '../../../common/form/error-box/error-box' 
import btn_action_group   from '../../../common/button/btn-action-group/btn-action-group' 
import client_search      from '../client-search/client-search'
import client_info        from '../client-info/client-info' 
import booked_item_action from '../booked-item-action/booked-item-action'
import select_hour        from '../../../common/form/select/select-hour/select-hour'
import component_base     from '../../../common/component-base/component-base'
import client_info_mixin  from '../../../../helpers/mixins/client-info-mixin'
import { generateLeadTimeOptions, 
  convertHoursToMinutes, 
  convertMinutesToHours, 
  cache_session,
  getTimeSubtract24,
  isOffDay,
  isOver24Hours,
  getLastTimeSlotToBooking,
  convertDateToTimezone,
  convertHourToTimezone,
  convertDateToTimeStamp,
  convertTimeStampPlusLocalzone,
  getDatePickerMin,
  getDatePickerMax,
  getTimeInclude24,
  getTimeOptionsByDate,
  getHideClientInfoPermission
} from '../../../../helpers/common'
import ClientsCache                     from '../../../../helpers/cache/clients-cache'

export default {
  components: {
    'v-date-picker': DatePicker,
    'client-search': client_search,
    'client-info': client_info, 
    'error-box': error_box,
    'booked-item-action': booked_item_action,
    'btn-action-group': btn_action_group,
    'select-hour': select_hour
  }, 
  extends: component_base,
  mixins: [client_info_mixin],
  data(){
    return {
      options , 
      form_options: {
        delete: false
      },
      today: convertDateToTimezone(new Date()),
      show_waiting_form: true,
      client: new ClientViewModel(),
      waiting: new WaitingViewModel(), 
      waiting_errors: [],
      
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
      total_estimated :0,
      booking_items_setup: {} ,
      booking_setup: {},
      booking_resources_setup: {},
      resource_options: [],
      hide_info: true,
      clients_setup: {},
      clients_cache: new ClientsCache(),
    }
  },
  computed: {
    ...mapGetters('alert', {
      x_alerts: 'getAlerts',
    }),
    ...mapGetters('waiting', {
      x_waiting_action: 'getWaitingAction'
    }), 
    ...mapGetters('booking', {
      x_booking_helps: 'getBookingHelps'
    }),
    waiting_select_resource_text(){return this.$i18n.t('waitings.select-resource')},
    form_title(){
      let tmp_title = ''
      if(this.x_waiting_action.action == options.form_actions.add)  tmp_title = this.$i18n.t('waitings.add-waiting')
      if(this.x_waiting_action.action == options.form_actions.edit) tmp_title = this.$i18n.t('waitings.edit-waiting')
      return tmp_title
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
    ...mapActions('waiting', [
      'addWaitingDataAsync',
      'updateWaitingDataAsync'
    ]),
    hideModal(){
      this.hideDialogById('waiting-action-modal')
    },
    onCancel(){
      this.hideModal()
      this.$refs.client_search.onClearSearch()
    },
    onDeductPrepaidService(prepaid_service, service){
      let tmp_service = service.service.fields
      this.onAddBookedItems([tmp_service])

      // update deducted info
      for(let i in this.waiting.fields.waiting_booked_items){
        let tmp_booked_item = this.waiting.fields.waiting_booked_items[i]
        if(i == this.waiting.fields.waiting_booked_items.length - 1){
          tmp_booked_item.deducted_prepaid_goods_ref      = prepaid_service.client_prepaid_service_id
          tmp_booked_item.deducted_prepaid_goods_ref_name = prepaid_service.prepaid_service_name
        }
      }
    },
    async onLoadForm(){
      this.waiting_errors = []
      this.booking_setup = await cache_session.getBookingSetupCache(this.shop_data.shop_id)
      if(this.isMissingCalendarSetup(this.booking_setup)){
        this.showAlert(this.booking_setup.error_messages)
      }
      this.clients_setup = await this.clients_cache.getAllClientsSetupCache(this.shop_data.shop_id)
      if(this.isNullObject(this.clients_setup)){
        this.showMissingClientsSetupAlert()
      }
      else{
        this.from_time_picker_options.step = convertMinutesToHours(this.booking_setup.booking_calendar_setup.booking_time_slot) 
        this.to_time_picker_options.step = this.from_time_picker_options.step
        this.booking_items_setup = this.booking_setup.booking_items_setup
        this.booking_resources_setup = this.booking_setup.booking_resources_setup.items
        this.getResourceOptions()

        if(this.x_waiting_action.action == options.form_actions.add) {
          this.getTimePickerOptions(convertDateToTimezone(new Date()))
          this.waiting = new WaitingViewModel()
          this.waiting.fields.booking_date = convertDateToTimezone(new Date())

          this.client = new ClientViewModel()
        }
        if(this.x_waiting_action.action == options.form_actions.edit){
          this.hide_info = false
          this.waiting.fields = Object.assign(this.waiting.fields, this.x_waiting_action.data)
          this.waiting.fields.booking_date = convertHourToTimezone(this.waiting.fields.booking_date)

          this.getTimePickerOptions(this.waiting.fields.booking_date)
          for(let i in this.waiting.fields.waiting_booked_items){
            let item = this.waiting.fields.waiting_booked_items[i]
            item = generateLeadTimeOptions(item, this.x_booking_helps.estimated_time_options)
          } 
          this.client.fields.id            = this.waiting.fields.client_id
          this.client.fields.client_id     = this.waiting.fields.client_id
          this.client.fields.client_name   = this.waiting.fields.client_name
          this.client.fields.mobile_number = this.waiting.fields.client_mobile_number
          this.client.fields.member_number = this.waiting.fields.client_member_number
          this.client.fields.shop_id       = this.waiting.fields.client_shop_id

          //set start & finish time
          this.loadTime()

          if(this.client.fields.id > 0) {
            await this.loadBookingsSummaryByClient(this.client.fields.id)
            await this.loadBookingsByClient(this.client.fields.id)
          }
        }
      } 
      this.calculateTotalEstimated()
    },
    getResourceOptions(){
      this.resource_options = this.booking_resources_setup
      this.resource_options.unshift({'id': 0, resource_name: this.waiting_select_resource_text }) 
    }, 
    onChangeResource(){
      let tmp_resources = this.booking_resources_setup.filter(r => r.id == this.waiting.fields.booking_resource_setup_id)
      if(tmp_resources.length > 0){
        this.waiting.fields.booking_resource_name = tmp_resources[0].resource_name
      }
      this.getTimePickerOptions(this.waiting.fields.booking_date)
    },
    onChangeFromTime(time){
      this.to_time_picker_options.start = convertMinutesToHours(convertHoursToMinutes(time) + this.booking_setup.booking_calendar_setup.booking_time_slot)

      this.mapTimeTo24hFormat()
      if(!this.isNullObject(this.waiting.fields.to_time)){
        if(convertHoursToMinutes(this.waiting.fields.from_time_show) >= convertHoursToMinutes(this.waiting.fields.to_time_show) ){
          this.waiting.fields.to_time_show = undefined
          this.waiting.fields.to_time = undefined
        }
      }
    }, 
    loadTime(){
      if(this.x_waiting_action.data.is_next_day)
        this.waiting.fields.from_time_show = getTimeInclude24(this.waiting.fields.from_time)
      else
        this.waiting.fields.from_time_show = this.waiting.fields.from_time

      if((this.x_waiting_action.data.is_next_day) 
      || (convertHoursToMinutes(this.waiting.fields.from_time) > convertHoursToMinutes(this.waiting.fields.to_time))) {
        this.waiting.fields.to_time_show = getTimeInclude24(this.waiting.fields.to_time) 
      }
      else{
        this.waiting.fields.to_time_show = this.waiting.fields.to_time
      }
      this.to_time_picker_options.start  = convertMinutesToHours(convertHoursToMinutes(this.waiting.fields.from_time_show) + this.booking_setup.booking_calendar_setup.booking_time_slot)
    },
    mapTimeTo24hFormat(){
      if(!this.isNullObject(this.waiting.fields.from_time_show)){
        if(isOver24Hours(this.waiting.fields.from_time_show))
          this.waiting.fields.from_time = getTimeSubtract24(this.waiting.fields.from_time_show)
        else
          this.waiting.fields.from_time = this.waiting.fields.from_time_show
      }  
      if(!this.isNullObject(this.waiting.fields.to_time_show)){
        if(isOver24Hours(this.waiting.fields.to_time_show))
          this.waiting.fields.to_time = getTimeSubtract24(this.waiting.fields.to_time_show)
        else
          this.waiting.fields.to_time = this.waiting.fields.to_time_show
      }  
    },
    onChangeBookingDate(date){
      if(date == null){
        this.waiting.fields.booking_date = convertDateToTimezone(new Date())
      }
      this.getTimePickerOptions(date)
    },
    getTimePickerOptions(date){
      this.is_off_date = isOffDay(date, this.waiting.fields.booking_resource_setup_id, this.booking_setup)

      if(!this.is_off_date){
        let work_hours = getTimeOptionsByDate(date, this.waiting.fields.booking_resource_setup_id, this.booking_setup)
        let tmp_time_finish = getLastTimeSlotToBooking(work_hours.time_finish, this.booking_setup.booking_calendar_setup.booking_time_slot)
        this.from_time_picker_options.start = work_hours.time_start 
        this.from_time_picker_options.end   = tmp_time_finish
        this.to_time_picker_options.start   = work_hours.time_start
        this.to_time_picker_options.end     = work_hours.time_finish
      }
      else{
        this.waiting.fields.from_time_show  = ''
        this.waiting.fields.to_time_show    = ''
        this.waiting.fields.from_time       = ''
        this.waiting.fields.to_time         = ''
      }
    }, 
    onConfirm(){
      if(this.x_waiting_action.action == options.form_actions.add){
        this.submitActionAsync('addWaitingDataAsync', 'action-waiting-success')
      }
      else if(this.x_waiting_action.action == options.form_actions.edit){
        this.submitActionAsync('updateWaitingDataAsync', 'action-waiting-success')
      }
    },
    async submitActionAsync(api_action, success_action){
      this.waiting_errors = []

      // client_registration_date
      let tmp_client_registration_date = null
      if(this.x_waiting_action.action == options.form_actions.add){
        let tmp_client_registration_date = this.waiting.fields.booking_date
        if(this.client.fields.id > 0){
          tmp_client_registration_date = this.client.fields.registration_date
        }
        this.waiting.fields.client_registration_date_ts = this.getClientRegistrationDateTS(tmp_client_registration_date)
      }
      if(this.x_waiting_action.action == options.form_actions.edit && this.client.fields.id > 0){
        if(this.client.fields.registration_date == null){
          tmp_client_registration_date = this.client.fields.registration_date
          this.waiting.fields.client_registration_date_ts = this.getClientRegistrationDateTS(tmp_client_registration_date)
        }
      }
      
      // map client data
      this.waiting.fields.client_id           = this.client.fields.id
      this.waiting.fields.client_name         = this.client.fields.client_name
      this.waiting.fields.client_mobile_number= this.client.fields.mobile_number
      this.waiting.fields.client_member_number= this.client.fields.member_number
      this.waiting.fields.client_shop_id      = this.client.fields.shop_id

      // chain-sharing
      this.waiting.fields.chain_id            = this.shop_data.chain_id
      this.waiting.fields.branch_number       = this.shop_data.branch_number
      this.waiting.fields.shop_name           = this.shop_data.shop_name
      this.waiting.fields.client_shop_id      = this.shop_data.shop_id
      this.waiting.fields.client_shop_name    = this.shop_data.shop_name
      
      if(this.client.fields.id > 0){
        this.waiting.fields.client_shop_id    = this.client.fields.shop_id
        this.waiting.fields.client_shop_name  = this.client.fields.shop_name
      }

      // map waiting data
      this.mapTimeTo24hFormat()
      this.waiting.fields = Object.assign(this.waiting.fields, this.shop_data)
      if(!this.isNullObject(this.waiting.fields.booking_date)){
        this.waiting.fields.booking_date = moment(this.waiting.fields.booking_date).toDate()
        if(isOver24Hours(this.waiting.fields.from_time_show))
          this.waiting.fields.is_next_day = true
        else
          this.waiting.fields.is_next_day = false
      }
      else {
        this.waiting.fields.booking_date = undefined
      }
  
      // set resource_name
      this.waiting.fields.resource_name=''
      if(this.waiting.fields.booking_resource_setup_id > 0){
        let booking_resource= this.booking_resources_setup.filter(t=>t.id == this.waiting.fields.booking_resource_setup_id) 
        if(!this.isNullObject(booking_resource) && booking_resource.length >0 ){
          this.waiting.fields.resource_name = booking_resource[0].resource_name
        }
      } 
      // validate
      this.waiting_errors = this.waiting.isValid()
      if(this.waiting_errors.length == 0){
        let data_send = _.cloneDeep(this.waiting.fields)

        this.preLoader()
        await this[api_action](data_send) 
        this.preLoader(false)

        if(this.x_alerts.length == 0) {
          this.$emit(success_action, this.x_waiting_action.data) 
          this.hideModal()
        }
        else this.waiting_errors = this.x_alerts
      } 
    },
    getClientRegistrationDateTS(date){
      return convertTimeStampPlusLocalzone(convertDateToTimeStamp(date, false, true))
    },
    
    async onClickAddBookedItems(){
      this.showDialogById('booked-item-action-modal') 
    },
    onAddBookedItems(items){
      let order = 0
      for(let i in items){
        if(!this.isNullObject(this.waiting.fields.waiting_booked_items) && this.waiting.fields.waiting_booked_items.length >0 ){
          order =Number(_.maxBy(this.waiting.fields.waiting_booked_items, (o) =>  o.order_number).order_number)+ 1
        } 
        // map service
        let booked_item = {
          booking_item_id: 0, 
          estimated_time: items[i].estimated_time,
          finishing_time: items[i].finishing_time,
          processing_time: items[i].processing_time,
          service_id: 0,
          service_name: items[i].name, 
          order_number: order
        } 
        if(this.booking_items_setup.use_service_code){ 
          booked_item.service_id      = items[i].id
        }
        else {
          booked_item.booking_item_id = items[i].id
        }
        booked_item = generateLeadTimeOptions(booked_item, this.x_booking_helps.estimated_time_options)
        this.waiting.fields.waiting_booked_items.push(booked_item)
      }  
      this.calculateTotalEstimated()  
    },
    onDeleteBookedItem(item){
      this.waiting.fields.waiting_booked_items = this.waiting.fields.waiting_booked_items.filter(i => i.order_number != item.order_number) 
      this.calculateTotalEstimated()
    },
    calculateTotalEstimated(){
      this.total_estimated  = 0
      if(!this.isNullObject(this.waiting.fields.waiting_booked_items) && this.waiting.fields.waiting_booked_items.length >0 ){ 
        this.total_estimated =  this.waiting.fields.waiting_booked_items.map(item => (item.estimated_time + item.processing_time + item.finishing_time)).reduce((prev, curr) => prev + curr, 0) 
      } 
    },
    async onChangeBookedItem(waiting_booked_item){ 
      if(waiting_booked_item.service_id > 0){
        waiting_booked_item.finishing_time = waiting_booked_item.lead_time - (waiting_booked_item.estimated_time + waiting_booked_item.processing_time) 
      }
      else {
        waiting_booked_item.estimated_time = waiting_booked_item.lead_time
      }
      this.calculateTotalEstimated()
    }, 
    onClickSearchClient(){
      this.show_waiting_form = false
      this.client = new ClientViewModel()
    },
    onRemoveClient(){
      this.show_waiting_form = true
      this.client = new ClientViewModel()
    },
    async onSelectClient(client){
      this.show_waiting_form = true
      this.client.fields = client
      this.hide_info = getHideClientInfoPermission(this.clients_setup.environments.contact_info_to_manager, this.clients_setup.environments.contact_info_to_staff, this.client.fields.registration_date)
      await this.loadBookingsSummaryByClient(this.client.fields.id)
      await this.loadBookingsByClient(this.client.fields.id)
    },
    onClearSearchClientForm(){
      this.show_waiting_form = true
    },
  }
}
</script>
<style lang="scss">
@import './waiting-action.scss';
</style>