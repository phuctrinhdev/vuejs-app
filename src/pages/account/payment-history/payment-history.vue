<template>
  <main class="app-content">
    <section class="contents-style common-style">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ $t('payment-history.title') }}</h3>
        </article>
        <div class="section-search-part clearfix">
          <ul class="clearfix">
            <li class="part mr15">
              <span class="badge badge-info badge-pill search-part">{{ $t('general.date-range') }}</span> 
              <div class="dib">
                <div class="datepicker-dib">
                  <v-date-picker v-model="table_filter.date_from" :popover="{ placement: 'bottom' }"
                                 :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"/> ~ 
                </div>
                <div class="datepicker-dib">
                  <v-date-picker v-model="table_filter.date_to" :popover="{ placement: 'bottom' }"
                                 :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"/>
                </div>
              </div>
            </li>
          </ul>
          <div class="search-btn clearfix">
            <button class="submit-btn pc" @click="onSearch"><span class="search-pc"/><span>{{ $t('general.search') }}</span></button>
            <button class="submit-btn mobile" @click="onSearch"><span class="search-mobile"/></button>                       
          </div>
        </div>
        <div class="section-part">            
          <p class="mb5 fz13">{{ $t('login-history.all').replace('{0}', table_data.pagination.total_items) }}</p>
          <div class="slide-x small">
            <view-table :data="table_data" @change-page="onChangePage">
              
              <!-- // todo Order number, Buyer Name, Receipt -->
              <template slot="receipt_url" slot-scope="{ row }">
                <a v-if="row.payment_method_code == 'AC'" class="btn secondary small text-long" @click="openReceipt(row)">{{ $t('payment-history.print-receipt') }}</a>
              </template>
            </view-table>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { options }         from '../../../helpers/options'
import component_base      from '../../../components/common/component-base/component-base'
import view_table          from '../../../components/common/view-table/view-table'
import { setupCalendar, DatePicker }  from 'v-calendar'
import {
  formatDateBySetting
  , convertDateToTimezone
  , convertFirstDateToTimezone
  , convertTimeStampToDate
  , convertDateFromTimezoneToTimestamp
}  from '../../../helpers/common'
import AdminSalesApi       from '../../../api/account/admin-sales-api.js'

export default {
  components: {
    'view-table'    : view_table,
    'v-date-picker' : DatePicker,
  },
  extends: component_base,
  data() {
    return {
      options : options,
      table_data: {
        fields: [
          { field: 'sales_date_ts',     label: 'general.date',              width: '10%',  sortable: false, formatFn: this.formatTimeStampCol },
          { field: 'payment_method_name',            label: 'payment-history.payment-method-name',        width: '10%',  sortable: false, expand: false },
          { field: 'amount',            label: 'payment-history.amount',        width: '20%',  sortable: false },
          { field: 'merchant_id',      label: 'payment-history.order-number',  width: '20%',  sortable: false, expand: false },
          { field: 'buyer_name',      label: 'payment-history.buyer-name',    width: '20%',  sortable: false, expand: false },
          { field: 'receipt_url',           label: 'payment-history.receipt',       width: '6%',  sortable: false, expand: true },
        ],
        rows:[],
        pagination:{
          total_pages: 1
        },
        options: {
          drag: false,
          pagination: true
        },
        style: 'normal'
      },
      table_filter: {
        page_size: options.pagination.default,
        page_number: 1,
        shop_id: 0,
        country_code: null,
        date_from: convertFirstDateToTimezone(new Date()),
        date_to: convertDateToTimezone(new Date()),
      },
    }
  },
  mounted() {
    this.table_filter.shop_id = this.shop_data.shop_id
    this.table_filter.country_code = this.shop_data.country
    this.loadTableData()
  },
  beforeMount(){
    setupCalendar({
      locale: this.locale,
      firstDayOfWeek: 2,
      titleTransition: 'none',
      weeksTransition: 'none',
      datePickerTintColor: '#3499db'
    })
  },
  methods: {
    async loadTableData(){
      this.preLoader()
      let query = Object.assign({}, this.table_filter)      
      if (this.table_filter.date_from != null) query.date_from_ts = convertDateFromTimezoneToTimestamp(query.date_from)
      else query.date_from_ts = 0
      if (this.table_filter.date_to != null) query.date_to_ts = convertDateFromTimezoneToTimestamp(query.date_to)
      else query.date_to_ts = 0

      let api = new AdminSalesApi()
      let result = await api.getAdminSalesListByShopAsync(query)
      this.preLoader(false)
      if(result.is_ok){
        this.table_data.rows = result.data.items
        this.table_data.pagination = result.data.pagination
        this.table_data.pagination.total_pages = Math.ceil(this.table_data.pagination.total_items / this.table_data.pagination.page_size)
        this.table_data.total_count = this.table_data.pagination.total_items
      }
      else this.showAlert(result.error_messages)
    },
    onSearch(){
      this.table_filter.page_number = 1
      this.loadTableData()
    },
    async onChangePage(page_num){
      this.table_filter.page_number = page_num
      await this.loadTableData()
    },
    formatTimeStampCol(time_stamp){
      if (time_stamp > 0) {
        return formatDateBySetting(convertTimeStampToDate(time_stamp, true))
      }
      else return ''
    },
    openReceipt(row){
      window.open(row.receipt_url, '_blank', 'left=100, top= 100, width=100, height=100')
    }
  }
}
</script>