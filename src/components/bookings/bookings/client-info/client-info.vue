<template>
  <div class="client-info">
    <div v-if="client.fields.id == 0" class="client-unregistered">
      <p>{{ $t('bookings.client-not-selected') }}</p>
      <p>{{ $t('bookings.input-unregistered-client') }}</p>
      <div class="client-form">
        <div class="row form-group">
          <div class="col-5 col-sm-4 col-md-3 col-lg-4">
            <label class="require">{{ $t('clients.client-name') }}</label>
          </div>
          <div class="col-7 col-sm-8 col-md-9 col-lg-8">
            <b-form-input v-model="client.fields.client_name" type="text"/>
          </div>
        </div>
        <div class="row form-group">
          <div class="col-5 col-sm-4 col-md-3 col-lg-4">
            <label>{{ $t('clients.mobile-number') }}</label>
          </div>
          <div class="col-7 col-sm-8 col-md-9 col-lg-8">
            <b-form-input v-model="client.fields.mobile_number" type="text"/>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="client.fields.id != 0" class="client-view">
      <div v-if="x_booking_action.action != options.form_actions.edit" class="client-remove" @click="onRemoveClient">x</div>
      <div class="client-vip">
        <h4><span class="name-client">{{ client.fields.client_name }}</span><span v-if="client.fields.is_vip" class="vip">{{ $t('bookings.vip') }}</span></h4> 
      </div>
      <div class="client-shop-name">
        <p v-if="shop_data.chain_sharing_settings.share_client && client.fields.shop_id != shop_data.shop_id" class="mb15"><span class="color-blue">({{ client.fields.shop_name }})</span></p>
      </div>
      <div class="detail-client">
        <ul class="list-item">
          <li class="item"><span class="title-item">{{ $t('bookings.mp') }}</span><span class="desc-item">{{ formatHideInfo(client.fields.mobile_number) }}</span></li>
          <li class="item"><span class="title-item">{{ $t('bookings.no') }}</span><span class="desc-item">{{ client.fields.member_number }}</span></li>
          <!-- <li class="item"><span class="title-item">{{ $t('bootkings.balance') }}</span><span class="desc-item">400,000</span></li> -->
        </ul>
        <p v-if="booking_summary != null" class="desc-client">
          {{ booking_summary.fields.total_bookings }} appointments, 
          <span class="highlight">{{ booking_summary.fields.total_no_show_bookings }} NoShow</span> for Recent 1 year
        </p>
      </div>
      <div class="notes-client">
        <p>{{ $t('general.notes') }}:</p>
        <p>{{ client.fields.notes }}</p>
      </div>
    </div>

    <b-tabs v-if="client.fields.id != 0 && bookings_by_client" ref="client_tabs" 
            pills card class="client-reference">
      <b-tab :title="$t('bookings.bookings')" class="tab-booking" active
             @click="onClickBookingsTab">
        <div v-if="bookings_by_client.items && bookings_by_client.items.length > 0" class="booking-list-wrapper">
          <div v-if="bookings_by_client != null" class="booking-list">
            <div class="title">{{ $t('bookings.recent-bookings') }}</div>
            <div v-for="(booking, index) in bookings_by_client.items" :key="index" class="item">
              <div class="info-booking">
                <p class="datetime">
                  {{ formatBookingDate(booking.booking_date) }} 
                  <span v-if="booking.booked_items[0].is_next_day">{{ next_day_text }}</span>
                  {{ booking.booked_items[0].start_time.substring(0, 5) }}
                </p>
                <p class="services">
                  <span v-for="(booked_item, index) in booking.booked_items" :key="index">{{ booked_item.service_name }}</span>
                </p>
              </div>
              <div v-if="has_rebook" class="rebook">
                <a href="#" class="btn" @click.prevent="onClickRebook(booking)">{{ $t('bookings.rebook') }}</a>
              </div>
            </div>
          </div>
          <pagination v-if="bookings_by_client.pagination" :pagination.sync="bookings_by_client.pagination" @change-page="onChangePageBookingsByClient"/>
        </div>
        <div v-else class="booking-list-wrapper">
          <div class="empty-message">{{ $t('bookings.there-is-no-booking') }}</div>
        </div>
      </b-tab>

      <b-tab :title="$t('services.prepaid-services')" class="tab-prepaid-service"
             @click="onClickPrepaidServicesTab">
        <sales-prepaid-services-brief ref="sales_prepaid_services_brief" :client="client"
                                      @select-prepaid-service="onSelectPrepaidService"/>
      </b-tab>
      
      <b-tab v-if="has_rebook"
             :title="$t('bookings.sales-history')" class="tab-sales-history"
             @click="onClickSalesHistoryTab">
        <div v-if="sales_history.items && sales_history.items.length > 0" class="sales-history-wrapper">
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>{{ $tc('bookings.all-sales-total-amount', sales_history.total_items, { total_items: sales_history.total_items, total_amount: formatMoney(sales_history.total_amount, 0) }) }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in sales_history.items" :key="i">
                  <td>
                    <p>{{ formatInvoiceDate(row.invoice_date_time_ts) }} {{ formatMoney(row.total_amount,0) }}</p>
                    <p v-for="(item, index) in row.items" :key="index">
                      <span>{{ item.goods_name }} </span>
                      <span v-if="item.staffs.length > 0" class="color-red">
                        ({{ item.staffs[0].staff_name }}<span v-if="item.staffs.length > 1">+</span>)
                      </span>
                    </p>
                    <p class="notes color-red">{{ row.notes }}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <pagination v-if="sales_history.pagination" :pagination.sync="sales_history.pagination" @change-page="onChangePageSalesHistory"/>
        </div>
        <div v-else class="sales-history-wrapper">
          <div class="empty-message">{{ $t('bookings.there-is-no-sales') }}</div>
        </div>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { options }              from '../../../../helpers/options'
import pagination               from '../../../common/pagination/pagination.vue'
import ClientViewModel          from '../../../../view-model/clients/client-view-model'
import BookingSummaryViewModel  from '../../../../view-model/bookings/booking-summary-view-model'
import component_base           from '../../../../components/common/component-base/component-base'
import ServiceApi               from '../../../../api/goods/service-api'
import BookingItemApi           from '../../../../api/bookings/booking-item-api'
import ClientsCache             from '../../../../helpers/cache/clients-cache'
import SalesApi                 from '../../../../api/sales/sales-api'
import sales_prepaid_services_brief from '../../../sales/sales-prepaid-services-brief/sales-prepaid-services-brief.vue'

import { 
  hideMobilePhone,
  formatMoney,
  convertDateToTimezone,
  convertDateToTimeStamp,
  convertTimeStampToDate
} from '../../../../helpers/common' //convertDateFromTimezoneToTimestamp


export default {
  components: {
    pagination,
    'sales-prepaid-services-brief': sales_prepaid_services_brief
  },
  extends: component_base,
  props: {
    data: {
      type: Object,
      default: () => []
    },
    booking_summary: {
      type: BookingSummaryViewModel,
      default: null
    },
    bookings_by_client: {
      type: Object,
      default: null
    },
    has_rebook: {
      type: Boolean,
      default: false
    },
    hide_info: {
      type: Boolean,
      default: true
    }
  },
  data(){
    return {
      options,
      show_client_info: true,

      next_day_text: '+1D',
      clients_setup: {},
      clients_cache: new ClientsCache(),

      // bookings tab
      service_api: new ServiceApi(),

      // sales history tab
      sales_api: new SalesApi(),
      sales_filter: {
        client_id       : 0,
        from_date_ts    : 1,
        to_date_ts      : convertDateToTimeStamp(new Date(), true),
        include_deleted : false,
        page_size       : options.pagination.small,
        page_number     : 1,
        shop_id         : 0,
        client_shop_id  : 0
      },
      sales_history: {
        items:[],
        pagination:{},
        total_amount: 0,
      },
    }
  },
  computed: {
    ...mapGetters('booking', {
      x_booking_action: 'getBookingAction'
    }),
    client(){
      let tmp_client = new ClientViewModel()
      tmp_client = Object.assign(tmp_client, this.data)
      return tmp_client
    },
  },
  watch: {
    'client.fields.id'() {
      const active_client_tabs_index = this.$refs.client_tabs && this.$refs.client_tabs.$data.currentTab
      
      // reload client prepaid services tab data when client changed and current tab is prepaid services
      if (active_client_tabs_index === 1) {
        this.$nextTick(this.$refs.sales_prepaid_services_brief.loadClientPrepaidServicesAsync)
      }

      // reload client sales history tab data when client changed and current tab is sales history
      if (active_client_tabs_index === 2) {
        this.loadClientSalesHistoryAsync()
      }
    }
  },
  methods: {
    moment,
    formatMoney,
    
    // client
    onRemoveClient(){
      this.$emit('remove-client')
    },
    formatHideInfo(mobile){
      if(this.hide_info) mobile=hideMobilePhone(mobile)
      return mobile
    },

    // tab bookings
    onClickBookingsTab(){
      // 
    },
    formatBookingDate(booking_date){
      let tmp = convertDateToTimezone(booking_date)
      return moment(tmp).format(options.standard_date_format.ymd)
    },
    onChangePageBookingsByClient(page_number){
      this.$emit('change-page-bookings-by-client', page_number)
    },
    async onClickRebook(booking){
      let tmp_booking = _.cloneDeep(booking)
      let tmp_booked_items = []
      let booked_item_first = tmp_booking.booked_items[0]
      let tmp_data = {
        shop_id: this.shop_data.shop_id,
        booked_item_ids: []
      }
      // service
      if(booked_item_first.service_id != null){
        tmp_data.booked_item_ids = tmp_booking.booked_items.map(i => i.service_id)

        this.preLoader()
        let result = await this.service_api.getServicesByIdsAsync(tmp_data)
        this.preLoader(false)

        if(result.is_ok){
          for(let i in tmp_booking.booked_items){
            let tmp_booked_item = tmp_booking.booked_items[i]
            for(let j in result.data){
              let tmp_service = result.data[j]
              if(tmp_booked_item.service_id == tmp_service.id && tmp_service.status == options.good_status.active){
                // update service info
                tmp_booked_item.estimated_time = tmp_service.estimated_time
                tmp_booked_item.processing_time= tmp_service.processing_time
                tmp_booked_item.finishing_time = tmp_service.finishing_time
                tmp_booked_item.service_name   = tmp_service.name

                tmp_booked_items.push(tmp_booked_item)
              }
            }
          }
          tmp_booking.booked_items = tmp_booked_items
        }
        else
          this.showAlertDialog(result.error_messages)
      }
      // booking-item
      else{
        tmp_data.booked_item_ids = tmp_booking.booked_items.map(i => i.booking_item_id)

        this.preLoader()
        let api = new BookingItemApi()
        let result = await api.getBookingItemsByIdsAsync(tmp_data)
        this.preLoader(false)

        if(result.is_ok){
          for(let i in tmp_booking.booked_items){
            let tmp_booked_item = tmp_booking.booked_items[i]
            for(let j in result.data.items){
              let tmp_booking_item = result.data.items[j]
              if(tmp_booked_item.booking_item_id == tmp_booking_item.id && tmp_booking_item.status == options.good_status.active){
                // update booking item info
                tmp_booked_item.estimated_time = tmp_booking_item.estimated_time
                tmp_booked_item.processing_time= 0
                tmp_booked_item.finishing_time = 0
                tmp_booked_item.service_name   = tmp_booking_item.booking_item_name

                tmp_booked_items.push(tmp_booked_item)
              }
            }
          }
          tmp_booking.booked_items = tmp_booked_items
        }
        else
          this.showAlertDialog(result.error_messages)
      }
      
      if(tmp_booking.booked_items.length > 0)
        this.$emit('rebook', tmp_booking)
      else
        this.showAlertDialog([this.$i18n.t('bookings.can-not-rebook')])
    },

    // tab prepaid-services
    onClickPrepaidServicesTab(){
      this.$refs.sales_prepaid_services_brief.loadClientPrepaidServicesAsync()
    },
    onSelectPrepaidService(prepaid_service, service){
      this.$emit('deduct-prepaid-service', prepaid_service, service)
    },

    // tab sales-history
    onClickSalesHistoryTab(){
      this.loadClientSalesHistoryAsync()
    },
    async loadClientSalesHistoryAsync(){
      let tmp_to_date = moment(convertDateToTimezone(new Date())).add(1, 'day').format(options.standard_date_format.ymd)
      this.sales_filter.to_date_ts    = convertDateToTimeStamp(tmp_to_date) - 1
      this.sales_filter.client_id     = this.client.fields.id
      this.sales_filter.shop_id       = this.shop_data.shop_id
      this.sales_filter.client_shop_id= this.client.fields.shop_id
      
      this.preLoader()
      let result = await this.sales_api.getSalesHistoryByClientAsync(this.sales_filter)
      this.preLoader(false)
      
      if(result.is_ok){
        this.sales_history = {
          items: result.data.items,
          pagination: result.data.pagination,
          total_amount: result.data.total_amount,
          total_items: result.data.pagination.total_items,
        }
      }
      else {
        this.showAlert(result.error_messages)
      }
    },
    formatInvoiceDate(invoice_date_time_ts){
      return moment(convertTimeStampToDate(invoice_date_time_ts,true)).format(options.standard_date_format.ymdh)
    },
    onChangePageSalesHistory(page_number){
      this.sales_filter.page_number = page_number
      this.loadClientSalesHistoryAsync()
    }
  }
}
</script>

<style lang="scss">
@import './client-info.scss';
</style>