<template>
  <div class="client-sales-bookings tabbox-table slide-x large">
    <div class="fz13 color-gray table-intro">{{ client_bookings_table_intro }}</div>
    <view-table :data="table_data" class="client-bookings" @change-page="onChangePage">
      <template slot="mobile_col" slot-scope="">
        {{ client_bookings_table_intro }}
      </template>
      <template slot="mobile" slot-scope="{ row }">
        {{ formatBookingDate(row.booking_date) }}
        <p v-for="item of row.booked_items" :key="item.booked_item_id">{{ item.service_name }} <span>{{ item.resource_name }}</span><br></p>
        <p class="notes">{{ row.notes }}</p>
        <div v-if="row.expand" class="more-info">
          <p>{{ $t('general.status') }}: {{ $t(formatBookingStatus(row)) }}</p>
          <p>{{ $t('sales-booking-tab.registered-date') }}: {{ formatBookingDate(row.registration_date) }}</p>
          <b-nav-item-dropdown v-if="hasEditBookingButton(row)" dropleft>
            <template slot="button-content">
              <button type="button" class="btn btn-white" >{{ $t('booking-list.edit') }}</button>
            </template>
            <b-dropdown-item @click="onEditBooking(row)">{{ $t('booking-list.edit-booking') }}</b-dropdown-item>
            <b-dropdown-item @click="onCancelBooking(row)">{{ $t('booking-list.cancel-booking') }}</b-dropdown-item>
          </b-nav-item-dropdown>
        </div>
        <div :class="{ 'expand': row.expand }" class="show-more-text view-mobile" @click="onClickShowMore(row)">></div>
      </template>

      <template slot="branch_number" slot-scope="{ row }">
        <div :id="'tooltip-branch-number' + row.id">
          {{ row.branch_number }}
        </div>
        <b-tooltip :target="'tooltip-branch-number' + row.id" placement="bottom">
          {{ row.shop_name }}
        </b-tooltip>
      </template>
      <template slot="booking_date_ts" slot-scope="{ row }">
        {{ formatBookingDate(row.booking_date) }}
      </template>
      <template slot="booked_items" slot-scope="{ row }"> 
        <div v-html="formatBookingItemsName(row)"/>
      </template>
      <template slot="booking_id" slot-scope="{ row }"> 
        <div v-html="formatBookingResourcesName(row)"/>
      </template>
      <template slot="status" slot-scope="{ row }"> 
        {{ $t(formatBookingStatus(row)) }}
      </template>
      <template slot="registration_date" slot-scope="{ row }"> 
        {{ formatBookingDate(row.registration_date) }}
      </template>
      <template slot="notes" slot-scope="{ row }">
        {{ formatBookingNotes(row) }}
      </template>
      <template slot="edit" slot-scope="{ row }"> 
        <b-nav-item-dropdown v-if="hasEditBookingButton(row)" dropleft>
          <template slot="button-content">
            <button type="button" class="btn btn-white" >{{ $t('booking-list.edit') }}</button>
          </template>
          <b-dropdown-item @click="onEditBooking(row)">{{ $t('booking-list.edit-booking') }}</b-dropdown-item>
          <b-dropdown-item @click="onCancelBooking(row)">{{ $t('booking-list.cancel-booking') }}</b-dropdown-item>
        </b-nav-item-dropdown>
      </template>
    </view-table>

    <booking-action @edited-booking="onEditedBooking"/>
    <cancel-repeat-booking/>
    <cancel-booking/>
  </div>
</template>


<script>
import _ from 'lodash'
import moment from 'moment'
import { mapGetters, mapActions } from 'vuex'
import { options }               from '../../../helpers/options'
import BookingUtils              from '../../../helpers/utils/booking-utils'
import CancelBookingActionData   from '../../../view-model/actions/bookings/cancel-booking-action-data'

import view_table                from '../../common/view-table/view-table'
import booking_action            from '../../bookings/bookings/booking-action/booking-action'
import cancel_repeat_booking     from '../../bookings/bookings/cancel-repeat-booking/cancel-repeat-booking'
import cancel_booking            from '../../bookings/bookings/cancel-booking/cancel-booking'
import component_base            from '../../common/component-base/component-base'

import { 
  cache_session,
  // formatMoney,
  convertDateToTimezone,
  convertDateToTimeStamp
} from '../../../helpers/common'


export default {
  components: {
    'view-table': view_table,
    'booking-action': booking_action,
    'cancel-repeat-booking': cancel_repeat_booking,
    'cancel-booking': cancel_booking
  },
  extends: component_base,
  data(){
    return {
      table_data: {
        fields: [],
        rows:[],
        pagination:{
          total_pages: 1
        },
        options: {
          pagination: true
        }
      },
      table_filter: {
        type_date: options.type_date.date_range,
        from_booking_date: moment(convertDateToTimezone(new Date(1))).toDate(),
        to_booking_date: moment(convertDateToTimezone(new Date())).add(100, 'years').toDate(),
        name_or_mobile:'' ,
        booking_resource_id: null,
        status: null,
        client_id: 0,
        booking_source: null,
        asc_ordering: false,
        page_size: options.pagination.default,
        page_number: 1,
        shop_id: 0,
        chain_id: 0
      },
    }
  },
  computed: {
    ...mapGetters('alert', {
      x_alerts: 'getAlerts',
    }),
    ...mapGetters('client', {
      x_client: 'getClientInformation'
    }),
    ...mapGetters('booking', {
      x_booking_list: 'getBookingList',
      x_booking_action: 'getBookingAction'
    }),
    client_bookings_table_intro(){
      let intro = this.$i18n.t('sales-booking-tab.all')
      intro = intro.replace('{records}', this.table_data.pagination.total_items)
      return intro
    }
  },
  async mounted(){
    this.table_data.fields = this.getTableDataFields()
    await this.loadBookingsByClientAsync()
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
    ...mapActions('booking_cancel', [
      'setBookingCancelActionData'
    ]),

    getTableDataFields(){
      let tmp_fields_custom = [
        { field: 'mobile',            label: 'sales-booking-tab.loc',               width: 'auto',sortable: false, expand: true, tdClass: 'mobile', column_expand: true, thClass: 'mobile' }
      ]

      let tmp_field_branch_number = 
      {   field: 'branch_number',     label: 'sales-booking-tab.loc',               width: '5%',  sortable: false, expand: true }
      
      let tmp_fields = [
        { field: 'booking_date_ts',   label: 'sales-booking-tab.booking-date-time', width: '12%', sortable: false, expand: true },
        { field: 'booked_items',      label: 'sales-booking-tab.booking-items',     width: '25%', sortable: false, expand: true },
        { field: 'booking_id',        label: 'sales-booking-tab.resource-name',     width: '12%', sortable: false, expand: true },
        { field: 'status',            label: 'sales-booking-tab.status',            width: '12%', sortable: false, expand: true },
        { field: 'registration_date', label: 'sales-booking-tab.registered-date',   width: '12%', sortable: false, expand: true },
        { field: 'notes',             label: 'sales-booking-tab.notes',             width: '15%', sortable: false, expand: true },
        { field: 'edit',              label: 'general.edit',                        width: '7%',  sortable: false, expand: true, tdClass: 'edit'},
      ]

      // branch_number
      if(this.shop_data.chain_id && this.shop_data.chain_sharing_settings.share_client)
        tmp_fields_custom.push(tmp_field_branch_number)
      
      return [...tmp_fields_custom, ...tmp_fields]
    },
    async loadBookingsByClientAsync(){
      this.setAlertsData([])

      this.booking_setup = await cache_session.getBookingSetupCache(this.shop_data.shop_id)
      if(this.isMissingCalendarSetup(this.booking_setup)){
        this.showAlert(this.booking_setup.error_messages)
        return
      }

      this.table_filter.client_id = this.x_client.data.id
      this.table_filter.shop_id   = this.shop_data.shop_id
      this.table_filter.chain_id  = this.shop_data.chain_id

      if(this.table_filter.type_date == options.type_date.date_range 
      && convertDateToTimeStamp(this.table_filter.from_booking_date) > convertDateToTimeStamp(this.table_filter.to_booking_date)){
        this.showAlert([this.$i18n.t('validate_messages.from_to_time')])
      }
      else {
        this.preLoader()
        await this.getBookingListDataAsync(this.table_filter)
        this.preLoader(false)
        
        if(this.x_alerts.length == 0){
          this.table_data.rows       = this.x_booking_list.items
          this.table_data.pagination = this.x_booking_list.pagination
        }
        else {
          this.showAlert(this.x_alerts)
        }
      }
    },
    isDataOfCurrentShop(row){
      return row.shop_id == this.shop_data.shop_id
    },
    hasEditBookingButton(booking){
      let not_edit = booking.status == options.booking.booking_status.no_show 
                  || booking.status == options.booking.booking_status.checked_out 
                  || booking.status == options.booking.booking_status.canceled
      return this.isDataOfCurrentShop(booking) && !not_edit
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
    async onEditedBooking(){
      await this.loadBookingsByClientAsync()
    },
    onCancelBooking(booking){
      this.onActionBookingCancel(booking)
    },
    onActionBookingCancel(booking){
      if(booking.id > 0) booking.booking_id = booking.id
      
      let booking_cancel = new CancelBookingActionData(
        booking.booking_id,
        booking.booked_items,
        booking.client_name,
        booking.booking_date,
        booking.booking_date_ts,
        booking.original_booking_id,
        booking.start_time,
        options.booking_cancel_type.booking_only,
        options.booking_reason.not_selected,
        options.booking.booking_source.staff,
        '')

      booking_cancel = Object.assign(booking_cancel, this.shop_data)
      this.booking_cancel_action = {
        action: options.form_actions.add,
        data: booking_cancel
      }

      this.setBookingCancelActionData(this.booking_cancel_action)
      if(booking.original_booking_id == null){
        this.showDialogById('booking-cancel-action-modal')
      }
      else {
        this.showDialogById('cancel-repeat-booking-modal')
      }
    },
    async onChangePage(page_num){
      this.table_filter.page_number = page_num
      await this.loadBookingsByClientAsync()
    },

    // viewing
    onClickShowMore(row){
      row.expand = !row.expand
    },
    formatBookingDate(booking_date){
      let tmp = convertDateToTimezone(booking_date)
      return moment(tmp).format(options.standard_date_format.ymd)
    },
    formatBookingItemsName(booking){
      let tmp_booked_items_name = ''
      for(let booked_item of booking.booked_items){
        tmp_booked_items_name += booked_item.service_name + '<br>'
      }
      return tmp_booked_items_name
    },
    formatBookingResourcesName(booking){
      let tmp_resources_name = ''
      for(let booked_item of booking.booked_items){
        tmp_resources_name += booked_item.resource_name + '<br>'
      }
      return tmp_resources_name
    },
    formatBookingStatus(booking){
      return BookingUtils.getBookingStatus(booking.status)
    },
    formatBookingNotes(booking){
      return booking.notes
    },
  }
}
</script>

<style lang="scss">
@import './sales-bookings.scss';
</style>