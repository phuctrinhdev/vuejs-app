<template>
  <b-modal :id="modal_id" 
           :class="modal_id"
           :title="form_title"
           :no-close-on-backdrop="true"
           hide-footer
           @show="onLoadForm()"
           @hide="onCancel()">
    <div class="booking-client">
      <div class="client-info">
        <p class="client-name">{{ client.client_name }}</p>
        <p class="client-mobile-number">{{ client.client_mobile_number }}</p>
      </div>
      <div class="client-contact-actions">
        <i class="call-w-icon"/>
        <i class="message-w-icon"/>
      </div>
      <div class="add-to-client-wrapper">
        <div class="btn" @click="onAddClient(client)">{{ $t('booking-list.add-to-clients') }}</div>
      </div>
    </div>

    <div class="same-registered-client-wrapper">
      <div class="table-intro" v-html="table_intro"/>
      <view-table :data="table_data">
        <template slot="branch_number" slot-scope="{ row }">
          <div class="text-center note-tooltip">
            <div :id="'shop-name-tooltip' + row.id" class="text-ellip">{{ row.branch_number }}</div>
            <b-tooltip :target="'shop-name-tooltip' + row.id" class="tooltip" placement="bottom">
              {{ row.shop_name }}
            </b-tooltip>
          </div>
        </template>
        <template slot="recent_visit_date" slot-scope="{ row }">
          {{ formatDate(convertTimeStampToDate(row.recent_visit_date, true)) }}
        </template>
        <template slot="registration_date" slot-scope="{ row }">
          {{ formatDate(row.registration_date) }}
        </template>
        <template slot="client_id" slot-scope="{ row }">
          <div class="btn" @click="onConnectClient(row)">{{ $t('clients.connect') }}</div>
        </template>
      </view-table>
    </div>

    <error-box :errors="errors"/>
    <footer class="modal-footer">
      <btn-action-group :data="form_options" @cancel="onCancel"/>
    </footer>
  </b-modal>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { DatePicker } from 'v-calendar'
import { mapGetters, mapActions, mapMutations } from 'vuex'
import { options }             from '../../../../helpers/options'
// import { CLIENTS_ENUMS }          from '../../../../config/constant'
import ClientApi               from '../../../../api/clients/client-api'
import BookingApi               from '../../../../api/bookings/booking-api'
import BookingViewModel from '../../../../view-model/bookings/booking-view-model'

import radio_group      from '../../../common/form/radio/radio-group/radio-group'
import input_money      from '../../../common/form/input/input-money/input-money-by-blur.vue' 
import error_box        from '../../../common/form/error-box/error-box' 
import btn_action_group from '../../../common/button/btn-action-group/btn-action-group'
import component_base   from '../../../common/component-base/component-base'
import select_hour      from '../../../common/form/select/select-hour/select-hour'
import view_table       from '../../../common/view-table/view-table'
import { 
  convertTimeStampToDate,
  convertDateToTimeStamp
} from '../../../../helpers/common'

export default {
  components: {
    'radio-group': radio_group,
    'v-date-picker': DatePicker,
    'input-money': input_money,
    'error-box': error_box,
    'btn-action-group': btn_action_group,
    'select-hour': select_hour,
    'view-table': view_table
  },
  extends: component_base,
  data(){
    return {
      options,

      modal_id: 'booking-connect-client-action-modal',
      form_options: {
        confirm: false,
        delete: false
      },

      table_data: {
        fields: [
          // { field: 'branch_number',               label: 'general.location',           width: '15%', sortable: false, expand: true, thClass: 'location' },
          { field: 'member_number',               label: 'clients.client-number',      width: '20%', sortable: false },
          { field: 'recent_visit_date',           label: 'bookings.recent-visit-date', width: '25%', sortable: false, expand: true, thClass: 'recent-visit' },
          { field: 'registration_date',           label: 'general.registered-date',    width: '20%', sortable: false, expand: true },
          { field: 'client_id',                   label: 'clients.connect-client',     width: '20%', sortable: false, expand: true },
        ],
        rows:[],
        pagination:{
          total_pages: 1
        },
        options: {
          pagination: true
        }
      },
      table_filter: {
        client_name       : '',
        mobile_number     : '',
        shop_id           : 0,
        // search_condition  : options.clients_enums.client_search_condition_type.name_or_phone,
        // search_keyword    : '',
        // search_in_branches: true,
        // page_size         : options.pagination.default,
        // page_number       : 1,
        // page              : CLIENTS_ENUMS.PAGE.ADD_BOOKING
      },

      client: {
        client_id                 : 0,
        client_name               : '',
        client_member_number      : '',
        client_mobile_number      : '',
        client_first_visit_date_ts: 0,
        client_shop_id            : 0,
        client_shop_name          : ''
      },
      client_api: new ClientApi(),
      booking_api: new BookingApi(),
    }
  },
  computed:{
    ...mapGetters('alert', {
      x_alerts: 'getAlerts',
    }),
    ...mapGetters('booking', {
      x_booking_action: 'getBookingAction'
    }),
    form_title(){
      return this.$t('bookings.unregistered-client-information')
    },
    table_intro(){
      let tmp = ''
      tmp += this.$t('bookings.booking-connect-client-intro-1', {records: this.table_data.pagination.total_items}) + '<br>'
      tmp += this.$t('bookings.booking-connect-client-intro-2')
      return tmp
    }
  },
  methods: {
    ...mapActions('alert', [
      'setAlertsData'
    ]),
    ...mapActions('booking', [
      'updateBookingDataAsync',
      'setBookingActionData'
    ]),
    ...mapMutations('booking',[
      'updateBooking'
    ]),
    ...mapMutations('client',[
      'setClientAction'
    ]),
    moment,
    convertTimeStampToDate,

    hideModal(){
      this.resetBookingAction()
      this.hideDialogById(this.modal_id)
    },
    onCancel(){
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
    async onLoadForm(){
      this.setClientData()
      await this.loadClients()
    },
    setClientData(){
      this.client.client_id                   = this.x_booking_action.data.client_id
      this.client.client_name                 = this.x_booking_action.data.client_name
      this.client.client_member_number        = this.x_booking_action.data.client_member_number
      this.client.client_mobile_number        = this.x_booking_action.data.client_mobile_number
      this.client.client_first_visit_date_ts  = this.x_booking_action.data.client_first_visit_date_ts
      this.client.client_shop_id              = this.x_booking_action.data.client_shop_id
      this.client.client_shop_name            = this.x_booking_action.data.client_shop_name
    },
    async loadClients(){
      this.table_filter.client_name   = this.client.client_name
      this.table_filter.mobile_number = this.client.client_mobile_number
      this.table_filter.shop_id       = this.client.client_shop_id

      this.preLoader()
      let result = await this.client_api.getClientsByNameAndMobileAsync(this.table_filter)
      this.preLoader(false)

      if(result.is_ok){
        this.table_data.rows = result.data.items
        this.table_data.pagination = result.data.pagination
      }
      else this.showAlert(result.error_messages)
    },
    // async onChangePage(page_num){
    //   this.table_filter.page_number = page_num
    //   await this.loadClients()
    // },

    // action
    onAddClient(client){
      let action_data = {
        action: options.form_actions.add
      }
      this.setClientAction(action_data)
      this.showDialogById('action-client-modal')
      
      // set Data
      this.$parent.$refs.client_action.client.fields.client_name   = client.client_name
      this.$parent.$refs.client_action.client.fields.mobile_number = client.client_mobile_number
    },
    async onConnectClient(client){
      let booking = _.cloneDeep(this.x_booking_action.data)
      let tmp_registration_date_ts = convertDateToTimeStamp(client.registration_date)

      // update booking
      let query = {
        client_id                   : client.id,
        client_member_number        : client.member_number,
        client_registration_date_ts : tmp_registration_date_ts,
        client_shop_id              : booking.shop_id,
        client_shop_name            : booking.shop_name,
        booking_id                  : booking.id,
        shop_id                     : booking.shop_id,
        shop_location               : booking.shop_location,
        session_token               : booking.session_token,
      }

      // update booking
      this.preLoader()
      this.setAlertsData([])
      let response = await this.booking_api.updateBookingClientAsync(query)
      if(response.is_ok) {
        // update bookings to booking calendar & booking list
        for(let i in response.data.items){
          this.updateBooking(response.data.items[i])
        }
        this.hideModal()
      }
      else {
        this.showAlert(this.x_alerts)
      }
      this.preLoader(false)
    },

    // format
    formatDate(date){
      return moment(date).format(options.standard_date_format.ymd)
    }
  }
}
</script>

<style lang="scss">
@import './booking-connect-client-action.scss';
</style>