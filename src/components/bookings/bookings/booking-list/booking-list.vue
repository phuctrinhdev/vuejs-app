<template>
  <b-modal id="booking-list-modal" 
           :title="$t('booking-list.booking-list')" 
           :no-close-on-backdrop="true"
           hide-footer
           class="booking-list-modal"
           @show="onLoadForm()"
           @hide="onCancel()">
    <div class="booking-table">
      <div class="row">
        <div class="col-sm-12">
          <div class="box-btn-top">
            <button type="button" class="btn" @click="onClickPrint()">{{ $t('booking-list.print') }}</button>
            <button type="button" class="btn" @click="onClickSendMessage()">{{ $t('booking-list.send-message') }}</button>
          </div>
        </div>
      </div>
      <form :class="{'date': data_query.type_date == options.type_date.date}" class="box-form-search"> 
        <div class="row">
          <div class="col-12 col-md-10"> 
            <div class="row"> 
              <div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 date-type">
                <b-form-group class="box-date">
                  <b-form-radio v-model="data_query.type_date" :value="options.type_date.date" >{{ $t('booking-list.date') }}</b-form-radio>
                  <b-form-radio v-model="data_query.type_date" :value="options.type_date.date_range" >{{ $t('booking-list.date-range') }}</b-form-radio>
                </b-form-group>
              </div>
              <!-- date -->
              <div v-if="data_query.type_date == options.type_date.date"
                   class="col-12 col-sm-6 col-md-6 col-lg-3 col-xl-3 from-date">  
                <v-date-picker v-model="data_query.from_booking_date" :popover="{ placement: 'bottom' }"
                               :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"
                               @input="onInputFromBookingDate"/>
              </div>
              <div v-if="data_query.type_date == options.type_date.date"
                   class="col-6 col-sm-3 col-md-3 col-lg-1 col-xl-1 to-date"/>
              <!-- date range -->
              <div v-if="data_query.type_date == options.type_date.date_range"
                   class="col-6 col-sm-3 col-md-3 col-lg-2 col-xl-2 from-date">  
                <v-date-picker v-model="data_query.from_booking_date" :popover="{ placement: 'bottom' }"
                               :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"
                               @input="onInputFromBookingDate"/>
              </div>
              <div v-if="data_query.type_date == options.type_date.date_range"
                   class="col-6 col-sm-3 col-md-3 col-lg-2 col-xl-2 to-date">
                <div class="to-date-content">
                  <v-date-picker v-model="data_query.to_booking_date" :popover="{ placement: 'bottom' }"
                                 :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"
                                 @input="onInputToBookingDate"/>
                </div>
              </div>

              <div class="col-6 col-sm-6 col-md-6 col-lg-4 col-xl-5 resource">
                <div class="row form-group">
                  <div class="col-sm-3 col-md-3 col-lg-3 col-xl-5">
                    <label>{{ $t('booking-list.resource') }}</label>
                  </div> 
                  <div class="col-sm-9 col-md-9 col-lg-9 col-xl-7">
                    <b-form-select v-model="data_query.booking_resource_id" :placeholder="$t('booking-list.resource')"
                                   :options="resource_options" value-field="id" text-field="resource_name"/>
                  </div> 
                </div> 
              </div>
              <div class="col-6 col-sm-6 col-md-6 col-lg-4 col-xl-3 source">
                <div class="row form-group" >
                  <div class="col-sm-3 col-md-3">
                    <label>{{ $t('booking-list.source') }}</label>
                  </div> 
                  <div class="col-sm-9 col-md-9">
                    <b-form-select v-model="data_query.booking_source" :placeholder="$t('booking-list.source')"> 
                      <option v-for="(option, index) in source_options" :key="index" :value="option.value">{{ $t(option.text) }}</option>
                    </b-form-select>
                  </div> 
                </div> 
              </div>
              <div class="col-sm-12 col-md-12 
                          offset-lg-1 col-lg-7 
                          offset-xl-2 col-xl-7">
                <div class="row">
                  <div class="col-6 col-sm-6 col-md-6
                              offset-xl-1 col-xl-6 status">
                    <div class="row form-group">
                      <div class="col-sm-3 col-md-3">
                        <label>{{ $t('booking-list.status') }}</label>
                      </div>
                      <div class="col-sm-9 col-md-9">
                        <b-form-select v-model="data_query.status" :placeholder="$t('booking-list.source')">
                          <option v-for="(option, index) in status_options" :key="index" :value="option.value">{{ $t(option.text) }}</option>
                        </b-form-select>
                      </div> 
                    </div>
                  </div>
                  <div class="col-6 col-sm-6 col-md-6 col-xl-5 keyword">
                    <div class="row form-group">
                      <div class="col-sm-3 col-md-3 label">
                        <label>{{ $t('general.keyword') }}</label>
                      </div>
                      <div class="col-sm-9 col-md-9 col-lg-12">
                        <b-form-input v-model="data_query.name_or_mobile" :placeholder="$t('booking-list.client-name-or-mobile')" type="text"/>
                      </div> 
                    </div> 
                  </div>  
                </div>
              </div>
            </div>
          </div> 
          <div class="col-sm-12 col-md-2">
            <button type="button" class="btn button-search" @click="onClickSearch()">{{ $t('booking-list.search') }}</button>
          </div>
        </div>
      </form>
      <div class="box-list-search booking-table table-data form-wrapper ">
        <p class="list-total">{{ $t('booking-list.total').replace('{0}', data_table.pagination.total_items) }}</p>
        <div class="table-wrapper">
          <table class="vgt-table bordered">
            <thead>
              <tr>
                <th rowspan="2" colspan="1" class="select-sending-message">
                  <span class="thead-border"/>
                  <span class="thead-content">
                    <b-form-checkbox v-model="check_all" :value="true" :unchecked-value="false"
                                     @input="onCheckAll()"/>
                  </span>
                </th>
                <!-- <th rowspan="2" colspan="1" class="mobile">
                  <span class="thead-border"/>
                  <span class="thead-content">
                    {{ $t('booking-list.total').replace('{0}', data_table.pagination.total_items) }}
                  </span>
                </th> -->
                <th v-for="(item, index) in fields.field_top" :key="index"
                    :rowspan="item.row_span" :colspan="item.col_span" :class="item.thClass">
                  <span class="thead-border"/>
                  <span class="thead-content">{{ $t(item.label) }}</span>
                </th>
              </tr>
              <!-- <tr>
                <th v-for="(item, index) in fields.field_bottom" :key="index" :class="item.thClass">
                  <span class="thead-border"/>
                  <span class="thead-content">{{ $t(item.label) }}</span>
                </th>
              </tr> -->
            </thead>
            <tbody>
              <template v-for="(item) in data_table.items">
                <tr :key="item.booking_id">
                  <td :rowspan="item.booked_items_count"><b-form-checkbox v-model="item.is_check" :value="true" :unchecked-value="false"/> </td>
                  <!-- <td :rowspan="item.booked_items_count">
                    <p class="date-time">09-03-2018 10:30 <span>Repeat</span></p>
                    <p class="client">Name Mobile-number</p>
                  </td> -->
                  <td :rowspan="item.booked_items_count">
                    <div v-if="item.booking_source == options.booking.booking_source.staff">
                      <div :id="'tooltip-booking-source' + item.id">
                        {{ getTextSource(item.booking_source) }} 
                      </div>
                      <b-tooltip :target="'tooltip-booking-source' + item.id" placement="bottom">
                        <p>{{ $t('booking-list.registered-by') }} {{ item.created_by_name }}</p>
                        <p>{{ formatDate(item.registration_date, options.standard_date_format.dmyh) }}</p>
                      </b-tooltip>
                    </div>
                    <div v-else>{{ getTextSource(item.booking_source) }}</div >  
                  </td>
                  <td :rowspan="item.booked_items_count" >{{ formatBookingDate(item.booking_date) }}</td>
                  <td>
                    <span v-if="!isNullObject(item.booked_items) && item.booked_items_count > 0">
                      <small v-if="item.booked_items[0].is_next_day">{{ next_day_text }}</small> 
                      {{ formatTime(item.booked_items[0].start_time) }} 
                    </span>
                    <div v-if="item.original_booking_id > 0 && !isNullObject(item.repeat_booking)">
                      ({{ $t('booking-list.repeat') }})
                    </div>
                  </td>
                  <td :rowspan="item.booked_items_count">
                    <div v-if="item.client_id >0">
                      {{ item.client_name }}
                    </div>
                    <div v-else>
                      <b-nav-item-dropdown :text="item.client_name" class="box-menu-client">
                        <b-dropdown-item @click="onAddClient(item)">{{ $t('booking-list.add-to-clients') }}</b-dropdown-item>
                        <b-dropdown-item @click="onConnectClient(item)">{{ $t('booking-list.connect-client') }}</b-dropdown-item>
                      </b-nav-item-dropdown> 
                    </div>
                  </td>
                  <td :rowspan="item.booked_items_count">
                    {{ formatHideInfoCol(item.client_mobile_number, item.client_registration_date) }}
                  </td>
                  <td>
                    <span v-if="!isNullObject(item.booked_items) && item.booked_items_count > 0">
                      {{ item.booked_items[0].resource_name }} 
                    </span>
                  </td>
                  <td>
                    <span v-if="!isNullObject(item.booked_items) && item.booked_items_count > 0">
                      {{ item.booked_items[0].service_name }} 
                    </span>
                  </td>
                  <td :rowspan="item.booked_items_count">
                    {{ getTextStatus(item.status) }}
                    <!-- #todo: add cancel reason to tooltip -->
                  </td>
                  <td :rowspan="item.booked_items_count" class="booking-deposit">
                    <span v-if="item.booking_deposit.amount != 0">
                      <a :id="'tooltip-payment-amount' + item.id" 
                         :class="{ 'not-paid-yet': item.booking_deposit.deposit_type == options.deposit_type.not_paid_yet }" 
                         class="text-amount" 
                         @click="onActionBookingDepositFromBookingList(item.booking_deposit, options.form_actions.edit, item)">
                        {{ formatMoney(item.booking_deposit.amount, 2) }}
                      </a>
                      <b-tooltip v-if="item.booking_deposit.deposit_type == options.deposit_type.not_paid_yet" 
                                 :target="'tooltip-payment-amount' + item.id" placement="bottom">
                        <p>{{ $t('bookings.due-date-time') }}</p>
                        <p>{{ moment(item.booking_deposit.due_date).format(options.standard_date_format.dmyh) }}</p>
                      </b-tooltip>
                    </span>
                    <span v-else>
                      <button type="button" class="btn btn-white" 
                              @click="onActionBookingDepositFromBookingList(item.booking_deposit, options.form_actions.add, item)">{{ $t('booking-list.add') }}</button>
                    </span>
                  </td>
                  <!-- <td :rowspan="item.booked_items_count" class="deposit-to-sales">
                    <span v-if="(item.status == options.booking.booking_status.no_show || item.status == options.booking.booking_status.canceled) && item.is_deposit_required == true">
                      <button type="button" class="btn btn-white" @click="onActionDepositToSales(item)">{{ $t('booking-list.add') }}</button>
                    </span>
                  </td> -->
                  <td :rowspan="item.booked_items_count">
                    {{ item.notes }}
                    <!-- #todo: Display limited Note content and show all content when MouseOver within ToolTip -->
                  </td>
                  <td :rowspan="item.booked_items_count" class="box-menu-booking">
                    <b-nav-item-dropdown v-if="hasEditButton(item)">
                      <template slot="button-content">
                        <button type="button" class="btn btn-white" >{{ $t('booking-list.edit') }}</button>
                      </template>
                      <b-dropdown-item @click="onEditBooking(item)">{{ $t('booking-list.edit-booking') }}</b-dropdown-item>
                      <b-dropdown-item @click="onCancelBooking(item)">{{ $t('booking-list.cancel-booking') }}</b-dropdown-item>
                    </b-nav-item-dropdown>
                  </td>
                  <td :rowspan="item.booked_items_count">
                    <button v-if="item.status != options.booking.booking_status.canceled" class="btn btn-white" @click="onShowCalendar(item)">➝</button>
                  </td>
                </tr>
                <template v-if="!isNullObject(item.booked_items) && item.booked_items_count > 1">
                  <template v-for="(booked_item, index) in item.booked_items">
                    <tr v-if="index > 0" :key="item.id +'-'+ index">
                      <td>
                        <small v-if="booked_item.is_next_day">{{ next_day_text }}</small> 
                        {{ formatTime(booked_item.start_time) }}
                        <span v-if="item.original_booking_id > 0 ">({{ $t('booking-list.repeat') }})</span>
                      </td>
                      <td>{{ booked_item.resource_name }}</td> 
                      <td>{{ booked_item.service_name }}</td> 
                    </tr>
                  </template>
                </template>
              </template>
              <tr v-if="data_table.items.length <= 0">
                <td colspan="14">{{ $t('general.table-empty') }}</td>
              </tr>
            </tbody>
          </table>
          <div class="box-comment hide" v-html="$t('booking-list.booking-list-note')"/>
        </div>

        <pagination v-if="data_table.pagination" :pagination.sync="data_table.pagination" @change-page="onChangePage"/>
      </div>
    </div>
    
    <deposit-action :modal_id="deposit_action_modal_id"/>
    <deposit-to-sales/>

    <send-message-booking/> 
  </b-modal>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { DatePicker } from 'v-calendar'  
import { mapGetters, mapActions, mapMutations } from 'vuex'

import { options }                from '../../../../helpers/options'
import booking_deposit_mixin      from '../../../../helpers/mixins/booking-deposit-mixin'
import select_control             from '../../../common/form/select/select-control/select-control'
import pagination                 from '../../../common/pagination/pagination'
import send_message_booking       from '../send-message-action/send-message-action'
import deposit_action             from '../deposit-action/deposit-action'
import deposit_to_sales           from '../deposit-to-sales/deposit-to-sales'
import error_box                  from '../../../common/form/error-box/error-box' 
import component_base             from '../../../common/component-base/component-base'
import ClientsCache               from '../../../../helpers/cache/clients-cache'
import { formatMoney, 
  cache_session, 
  convertDateToTimezone,
  convertDateToTimeStamp,
  getHideClientInfoPermission,
  hideMobilePhone,
  formatDateBySetting }           from '../../../../helpers/common'

export default {
  components: {
    pagination,
    'v-date-picker': DatePicker, 
    'send-message-booking': send_message_booking,
    'deposit-action': deposit_action,
    'deposit-to-sales': deposit_to_sales,
    'error-box': error_box,
    'select-control': select_control 
  },
  extends: component_base,
  mixins: [booking_deposit_mixin],
  data(){
    return {
      options,
      is_showed: false,

      resource_options:[],
      source_options:[
        { value: options.booking.booking_source.all,    text: 'booking-source.all' },
        { value: options.booking.booking_source.staff,  text: 'booking-source.staff' },
        { value: options.booking.booking_source.online, text: 'booking-source.online' }
      ],
      check_all: false,
      status_options: [
        { value: options.booking.booking_status.all,              text: 'booking-status.all-include-canceled' },
        { value: options.booking.booking_status.all_no_canceled,  text: 'booking-status.all' },
        { value: options.booking.booking_status.completed,        text: 'booking-status.completed' },
        { value: options.booking.booking_status.requested,        text: 'booking-status.requested' },
        { value: options.booking.booking_status.no_show,          text: 'booking-status.no-show' },
        { value: options.booking.booking_status.arrived,          text: 'booking-status.arrived' },
        { value: options.booking.booking_status.canceled,         text: 'booking-status.canceled' },
        { value: options.booking.booking_status.checked_out,      text: 'booking-status.checked-out' }
      ],
      fields: { 
        field_top : [ 
          { label: 'booking-list.src',              row_span:1, col_span:1, thClass: 'src' },
          { label: 'booking-list.booking-date',     row_span:1, col_span:1, thClass: 'booking-date' },
          { label: 'booking-list.booking-time',     row_span:1, col_span:1, thClass: 'booking-time' },
          { label: 'booking-list.client-name',      row_span:1, col_span:1, thClass: 'client-name' },
          { label: 'booking-list.mobile-number',    row_span:1, col_span:1, thClass: 'mobile-number' },
          { label: 'booking-list.resource',         row_span:1, col_span:1, thClass: 'resource' },
          { label: 'booking-list.booking-items',    row_span:1, col_span:1, thClass: 'booking-items' },
          { label: 'booking-list.status',           row_span:1, col_span:1, thClass: 'status' },
          { label: 'booking-list.booking-beposit',  row_span:1, col_span:1, thClass: 'booking-beposit' },
          { label: 'booking-list.notes',            row_span:1, col_span:1, thClass: 'notes' },
          { label: 'booking-list.edit',             row_span:1, col_span:1, thClass: 'edit' },
          { label: 'booking-list.calendar',         row_span:1, col_span:1, thClass: 'calendar' }
        ],
        field_bottom: [ 
          { label: 'booking-list.deposit'     , thClass: 'deposit' },
          { label: 'booking-list.add-to-sales', thClass: 'add-to-sales' }, 
        ]
      },
      data_table:{
        items:[],
        pagination:{}
      },
      data_query:{},
      booking_resources_setup:[],
      booking_setup:{},

      deposit_action_modal_id: 'booking-deposit-action-modal-from-booking-list',
      next_day_text: '+1D',

      clients_setup: {},
      clients_cache: new ClientsCache(),
    }
  },
  computed: {
    ...mapGetters('alert', {
      x_alerts: 'getAlerts',
    }),
    ...mapGetters('booking', {
      x_booking_list: 'getBookingList'
    }),
    resource_all(){return this.$i18n.t('general.all')}
  },
  methods: {
    ...mapActions('alert', [
      'setAlertsData'
    ]),
    ...mapActions('booking', [
      'getBookingListDataAsync',
      'setBookingActionData', 
      'updateBookingHelpsData',
    ]),
    ...mapMutations('client',[
      'setClientAction'
    ]),
    
    moment,
    formatMoney,
    formatDateBySetting,
    hideModal(){
      this.hideDialogById('booking-list-modal')
      this.is_showed = false
    },
    onCancel(){
      this.hideModal()
    },
    async onLoadForm(){
      this.loadDefaultDataQuery()
      this.booking_setup = await cache_session.getBookingSetupCache(this.shop_data.shop_id)
      if(!this.isMissingCalendarSetup(this.booking_setup)){
        this.booking_resources_setup= this.booking_setup.booking_resources_setup.items
        this.loadSelectList()
        await this.loadBookingList()
      }
      else{
        this.showAlert(this.booking_setup.error_messages)
      }
      this.is_showed = true

      this.clients_setup = await this.clients_cache.getAllClientsSetupCache(this.shop_data.shop_id)
      if(this.isNullObject(this.clients_setup))
        this.showMissingClientsSetupAlert()
    },
    loadDefaultDataQuery(){
      this.data_query = {
        type_date: options.type_date.date,
        from_booking_date: convertDateToTimezone(new Date()),
        to_booking_date: convertDateToTimezone(new Date()),
        name_or_mobile:'' ,
        booking_resource_id: null,
        status: null,
        client_id: 0,
        booking_source: null,
        asc_ordering: true,
        page_size: options.pagination.default,
        page_number: 1,
        shop_id: this.shop_data.shop_id
      }
    },
    loadSelectList(){ 
      this.resource_options = this.booking_resources_setup
      this.resource_options.unshift({'id': null, resource_name: this.$i18n.t('booking-status.all')})
    },
    async loadBookingList(){
      this.setAlertsData([])
      let query = Object.assign(this.data_query, this.shop_data)
      if(query.type_date == options.type_date.date_range && convertDateToTimeStamp(query.from_booking_date) > convertDateToTimeStamp(query.to_booking_date))
        this.showAlertDialog([this.$i18n.t('validate_messages.from_to_time')])
      else {
        this.preLoader()
        await this.getBookingListDataAsync(query)
        this.preLoader(false)
        
        if(this.x_alerts.length == 0){ 
          this.data_table = this.x_booking_list
          this.onCheckAll()
        }
        else {
          this.showAlertDialog(this.x_alerts)
        }
      }
    },
    onClickSearch(){
      this.data_query.page_number = 1
      this.loadBookingList()
    }, 
    onChangePage(page){
      this.data_query.page_number = page
      this.loadBookingList()
    },
    onShowCalendar(booking){
      this.$emit('show-calendar', booking)
      this.hideModal()
    }, 
    getTextStatus(status){
      var data = options.booking.option_booking_status.filter(t=>t.value == status)
      if(data != undefined && data.length >0){
        return this.$i18n.t(data[0].text)
      }
      return ''
    },
    getTextSource(source){
      var data = options.booking.option_booking_source.filter(t=>t.value == source)
      if(data != undefined && data.length >0){
        return  (data[0].acronym)
      }
      return ''
    },
    formatDate(date, format){ 
      if(date == null || date == undefined) return ''
      return moment(date).format(format)
    },
    formatTime(time ){ 
      if(time == null || time == undefined) return ''
      return moment(time, 'HH:mm:ss').format('HH:mm') 
    },
    onActionBookingDepositFromBookingList(booking_deposit, action, booking){
      this.onActionBookingDeposit(booking_deposit, action, booking, options.deposit_from.booking_list)
    },
    onActionDepositToSales(){
      this.showDialogById('deposit-to-sales-modal')
    },
    hasEditButton(booking){
      let not_edit = booking.status == options.booking.booking_status.no_show 
                  || booking.status == options.booking.booking_status.checked_out 
                  || booking.status == options.booking.booking_status.canceled
      return !not_edit
    },
    onEditBooking(booking){ 
      let booking_action = {
        action: options.form_actions.edit,
        data: _.cloneDeep(booking),
        options: {
          booking_resource_setup_id: 0,
          booking_date: booking.booking_date,
          start_time: booking.booked_items[0].start_time,
        }
      }
      this.updateBookingHelpsData({ date_picker: booking.booking_date })
      this.setBookingActionData(booking_action)
      this.showDialogById('booking-action-modal')
    },
    onCancelBooking(booking){
      this.$emit('cancel-booking', booking)
    },
    onClickSendMessage(){ 
      this.showDialogById('send-message-action-modal')
    },
    onClickPrint(){
      //
    },
    onAddClient(booking){
      let action_data = {
        action: options.form_actions.add
      }
      this.setClientAction(action_data)
      this.showDialogById('action-client-modal')

      // set Data
      this.$parent.$refs.client_action.client.fields.client_name   = booking.client_name
      this.$parent.$refs.client_action.client.fields.mobile_number = booking.client_mobile_number
    },
    onConnectClient(booking){
      let booking_action = {
        action: options.form_actions.edit,
        data: _.cloneDeep(booking),
        options: {
          booking_resource_setup_id: 0,
          booking_date: booking.booking_date,
          start_time: booking.booked_items[0].start_time,
        }
      }
      this.setBookingActionData(booking_action)
      this.showDialogById('booking-connect-client-action-modal')
    },
    onCheckAll(){ 
      for (var index in this.data_table.items) {
        this.data_table.items[index].is_check  = this.check_all
      } 
    },
    onInputFromBookingDate(date){
      if(date == null)
        this.data_query.from_booking_date = convertDateToTimezone(new Date())
    },
    onInputToBookingDate(date){
      if(date == null)
        this.data_query.to_booking_date = convertDateToTimezone(new Date())
    },

    // format
    formatHideInfoCol(mobile, registration_date){
      if(!_.isEmpty(this.clients_setup))
      {
        let isHideClientInfo = getHideClientInfoPermission(this.clients_setup.environments.contact_info_to_manager, this.clients_setup.environments.contact_info_to_staff, registration_date)
        if(isHideClientInfo) mobile= hideMobilePhone(mobile)
      }
      return mobile
    },
    formatBookingDate(booking_date){
      let tmp = convertDateToTimezone(booking_date)
      return moment(tmp).format(options.standard_date_format.ymd)
    }
  }
}
</script>

<style lang="scss">
@import './booking-list.scss';
</style>