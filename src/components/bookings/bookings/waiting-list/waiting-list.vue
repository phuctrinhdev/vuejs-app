<template>
  <b-modal id="waiting-list-modal" 
           :title="$t('waiting-list.waiting-list')" 
           :no-close-on-backdrop="true"
           hide-footer
           class="waiting-list-modal"
           @show="onLoadForm()"
           @hide="onCancel()">
    <div class="row">
      <div class="col-sm-12">
        <div class="box-btn-top">
          <button type="button" class="btn" @click="onActionWaiting(options.form_actions.add, {})">{{ $t('waiting-list.add-waiting') }}</button> 
        </div>
      </div>
    </div>
    <form :class="{ 'date': data_query.type_date == options.type_date.date }" class="box-form-search"> 
      <div class="row">
        <div class="col-sm-12 col-md-10">
          <div class="row">
            <div class="col-sm-6 col-md-4 col-xl-3">
              <b-form-group class="box-date">
                <b-form-radio v-model="data_query.type_date" :value="options.type_date.date" name="some-radios">{{ $t('waiting-list.date') }}</b-form-radio>
                <b-form-radio v-model="data_query.type_date" :value="options.type_date.date_range" name="some-radios" >{{ $t('waiting-list.date-range') }}</b-form-radio>
              </b-form-group>
            </div>
            <!-- date -->
            <div v-if="data_query.type_date == options.type_date.date" 
                 class="col-12 col-sm-6 col-md-8 col-xl-2 from-date">
              <v-date-picker v-model="data_query.from_waiting_date" :popover="{ placement: 'bottom' }"
                             :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"
                             @input="onInputFromWaitingDate"/>
            </div>
            <div v-if="data_query.type_date == options.type_date.date" class="col-xl-2 to-date"/>
            <!-- date range -->
            <div v-if="data_query.type_date == options.type_date.date_range" 
                 class="col-6 col-sm-3 col-md-4 col-xl-2 from-date">
              <v-date-picker v-model="data_query.from_waiting_date" :popover="{ placement: 'bottom' }"
                             :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"
                             @input="onInputFromWaitingDate"/>
            </div>
            <div v-if="data_query.type_date == options.type_date.date_range" 
                 class="col-6 col-sm-3 col-md-4 col-xl-2 to-date">
              <div v-if="data_query.type_date == options.type_date.date_range" class="to-waiting-date">
                <v-date-picker v-model="data_query.to_waiting_date" :popover="{ placement: 'bottom' }"
                               :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"
                               @input="onInputToWaitingDate"/>
              </div>
            </div>
            <div class="col-sm-12 col-md-12 col-xl-5 box-right">
              <div class="row form-group">
                <div class="col-md-2
                              resource-before"/>
                <div class="col-sm-2 col-md-2 col-lg-2 col-xl-3">
                  <label>{{ $t('waiting-list.resource') }}</label>
                </div> 
                <div class="col-6 col-sm-4 col-md-4 col-lg-4 col-xl-4 resource">
                  <b-form-select v-model="data_query.booking_resource_setup_id" :placeholder="$t('waiting-list.resource')"
                                 :options="resource_options" value-field="id" text-field="resource_name" />
                </div>
                <div class="col-6 col-sm-6 col-md-4 col-lg-4 col-xl-5 keyword">
                  <b-form-input v-model="data_query.name_or_mobile" :placeholder="$t('waiting-list.client-name-or-mobile')" type="text"/>
                </div>
              </div>
            </div>
          </div>
        </div> 
        <div class="col-sm-12 col-md-2">
          <button type="button" class="btn button-search" @click="onClickSearch()">{{ $t('waiting-list.search') }}</button>
        </div>
      </div> 
    </form>

    <waiting-items ref="waiting_items" :skin="bookings_options.waiting_list_skin.full" 
                   @canceled-waiting="onCanceledWaiting" @change-page="onChangePage"/>  
  </b-modal>
</template>

<script> 
import { options }         from '../../../../helpers/options'
import { bookings_options } from '../../../../helpers/options/bookings-options'
import { DatePicker } from 'v-calendar'   
import moment from 'moment'    
import waiting_items from '../waiting-items/waiting-items.vue'
import error_box         from '../../../common/form/error-box/error-box' 
import component_base    from '../../../common/component-base/component-base'
import { mapGetters, mapActions } from 'vuex' 
import view_table from '../../../common/view-table/view-table.vue'
import { cache_session, 
  isNullObject, 
  convertDateToTimezone,
  convertDateToTimeStamp
} from '../../../../helpers/common'

export default {
  components: {   
    'v-date-picker': DatePicker,   
    'view-table': view_table ,  
    'waiting-items': waiting_items ,  
    'error-box': error_box 
  },  
  extends: component_base,
  data(){
    return {
      options,
      bookings_options,
      is_showed: false,

      resource_options:[],
      data_client:{}, 
      data_table:{
        fields: [
          { field: 'booking_date',   label: 'waiting-list.booking-date-time',             width: '15%', sortable: false, thClass: 'booking-date',   expand: true  },
          { field: 'client_info',    label: 'waiting-list.client-name-mobile-number',     width: '15%', sortable: false, thClass: 'client-info',    expand: true  }, 
          { field: 'resource_name',  label: 'waiting-list.resource',                      width: '15%', sortable: false, thClass: 'resource-name' },
          { field: 'booking_items',  label: 'waiting-list.booking-items',                 width: '10%', sortable: false, thClass: 'booking-items',  expand: true  },
          { field: 'estimated_time', label: 'waiting-list.estimated-time',                width: '10%', sortable: false, thClass: 'estimated-time', expand: true  },
          { field: 'notes',          label: 'waiting-list.notes',                         width: '15%', sortable: false, thClass: 'estimated-time' },
          { field: 'booking',        label: 'waiting-list.booking',                       width: '10%', sortable: false, thClass: 'notes',          expand: true },
          { field: 'edit',           label: 'general.edit',                               width: '10%', sortable: false, thClass: 'edit',           expand: true }, 
        ],
        rows:[], 
        pagination:{
          total_pages: 1,
          total_items:0
        },
        options: {
          fixed_header: false,
          pagination: true
        }, 
      }, 
      
      data_query: {},
      form_title: '',
      booking_setup: {},
      booking_resources_setup: [],
      waiting_to_change_booking: {},
    }
  },
  computed: {
    ...mapGetters('alert', {
      x_alerts: 'getAlerts',
    }),
    ...mapGetters('waiting', {
      x_waiting_list: 'getWaitingList'
    }),
    waiting_all_text(){return this.$i18n.t('waiting-list.all')}
  },
  methods: { 
    isNullObject ,
    ...mapActions('alert', [
      'setAlertsData',
      'setOptions',
    ]), 
    ...mapActions('waiting', [
      'getWaitingListDataAsync', 
      'setWaitingActionData'
    ]),
    hideModal(){
      this.hideDialogById('waiting-list-modal')
      this.is_showed = false
    },
    onCancel(){
      this.hideModal()
    },
    async onLoadForm(){ 
      this.loadDefaultDataQuery()
      this.booking_setup = await cache_session.getBookingSetupCache(this.shop_data.shop_id)
      if(!this.isMissingCalendarSetup(this.booking_setup)){
        this.booking_resources_setup = this.booking_setup.booking_resources_setup.items
        this.loadSelectList() 
        await this.loadWaitingList()
      }
      else{
        this.showAlert(this.booking_setup.error_messages)
      }
      this.is_showed = true
    }, 
    loadDefaultDataQuery(){ 
      this.data_query = {
        type_date: options.type_date.date,
        status: options.waiting_status.new_waiting,
        from_waiting_date: convertDateToTimezone(new Date()),
        to_waiting_date: convertDateToTimezone(new Date()),
        name_or_mobile: '',
        booking_resource_setup_id: 0,
        client_id: 0,
        bookable_waiting: false,
        asc_ordering: true,
        page_size: options.pagination.default,
        page_number: 1,
        shop_id: 0
      }
    },
    async loadWaitingList(){
      this.setAlertsData([])
      let query = Object.assign(this.data_query, this.shop_data)
      if(query.type_date == options.type_date.date_range && convertDateToTimeStamp(query.from_waiting_date) > convertDateToTimeStamp(query.to_waiting_date))
        this.showAlertDialog([this.$i18n.t('validate_messages.from_to_time')])
      else {
        this.preLoader()
        await this.getWaitingListDataAsync(query)
        this.preLoader(false)

        if(this.x_alerts.length == 0){
          this.data_table.rows = this.x_waiting_list.items
          this.data_table.pagination = this.x_waiting_list.pagination 
        }
        else {
          this.showAlertDialog(this.x_alerts)
        }
      }
    },
    loadSelectList(){  
      this.resource_options = this.booking_resources_setup   
      this.resource_options.unshift({'id': 0, resource_name: this.waiting_all_text }) 
    }, 
    onClickSearch(){
      this.data_query.page_number = 1
      this.loadWaitingList()
    }, 
    onChangePage(page){
      this.data_query.page_number = page
      this.loadWaitingList()
    }, 
    formatDate(date, format){ 
      if(date == null || date == undefined) return ''
      return moment(date).format(format)
    },
    formatTime(time ){ 
      if(time == null || time == undefined) return ''
      return moment(time, options.standard_hour_format.h24_seconds).format(options.standard_hour_format.h24) 
    },
    onActionWaiting(action, waiting = {}){
      this.$refs.waiting_items.onActionWaiting(action, waiting)
    },
    onCanceledWaiting(){
      this.loadWaitingList()
    },
    onInputFromWaitingDate(date){
      if(date == null)
        this.data_query.from_waiting_date = convertDateToTimezone(new Date())
    },
    onInputToWaitingDate(date){
      if(date == null)
        this.data_query.to_waiting_date = convertDateToTimezone(new Date())
    }
  }
}
</script>

<style lang="scss">
@import './waiting-list.scss';
</style>