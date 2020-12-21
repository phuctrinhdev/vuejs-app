<template>
  <main class="app-content">
    <section class="contents-style common-style">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ $t('base-fees.title') }}</h3>
        </article>
        <div class="section-search-part clearfix">
          <ul class="clearfix">
            <li class="part mr15">
              <span class="badge badge-info badge-pill search-part">{{ $t('general.date-range') }}</span> 
              <div class="dib">
                <div class="datepicker-dib">
                  <v-date-picker v-model="table_filter.registration_date_from" :popover="{ placement: 'bottom' }"
                                 :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"
                                 @input="onInputFromDate"/> ~
                </div>
                <div class="datepicker-dib">
                  <v-date-picker v-model="table_filter.registration_date_to" :popover="{ placement: 'bottom' }"
                                 :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"
                                 @input="onInputToDate"/>
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
              <template slot="extend_value" slot-scope="{ row }">
                <div>
                  {{ row.extend_value }}<label v-if="row.base_fee_extend_value_type==options.admin_sales_enums.base_fee_extend_value_type.days">
                    {{ $t('general.days') }}
                  </label>
                </div>  
              </template>
              <template slot="date" slot-scope="{ row }">
                {{ formatTimeStamp(row.start_date_ts) }} ~ {{ formatTimeStamp(row.end_date_ts) }} 
              </template>
            </view-table>
          </div>
        </div>
      </div>
    </section> 
  </main>
</template>

<script>
import { options }                 from '../../../helpers/options'
import component_base              from '../../../components/common/component-base/component-base'
import BaseFeeApi                  from '../../../api/account/base-fee-api'
import view_table                  from '../../../components/common/view-table/view-table'
import { setupCalendar
  , DatePicker }                   from 'v-calendar'
import { formatDateBySetting 
  , convertDateToTimezone
  , convertFirstDateToTimezone
  , formatDate
  , convertTimeStampToDate
  , convertDateFromUtcToTimezone } from '../../../helpers/common'

export default {
  components: {
    'view-table'   : view_table,
    'v-date-picker': DatePicker,
  },
  extends: component_base,
  data() {
    return {
      options,
      table_data: {
        fields: [
          { field: 'registration_date', label: 'general.date',       width: '30%',   sortable: false, formatFn: this.formatDateCol },
          { field: 'amount',            label: 'base-fees.cost',          width: '15%',  sortable: false },
          { field: 'extend_value',     label: 'base-fees.extend-months', width: '15%',  sortable: false, expand: true},
          { field: 'date',              label: 'base-fees.start-end',     width: '40%',  sortable: false, expand: true },
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
        registration_date_from: convertFirstDateToTimezone(new Date()),
        registration_date_to: convertDateToTimezone(new Date()),
      },
    }
  },
  mounted() {
    this.table_filter.shop_id = this.shop_data.shop_id
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
      let base_fee_api = new BaseFeeApi()
      let result = await base_fee_api.getBaseFeesAsync(this.table_filter)
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
    onInputFromDate(date){
      if(date == null)
        this.table_filter.registration_date_from = convertFirstDateToTimezone(new Date())
    },
    onInputToDate(date){
      if(date == null)
        this.table_filter.registration_date_to = convertDateToTimezone(new Date())
    },
    formatDateCol(date){
      return formatDateBySetting(convertDateFromUtcToTimezone(date, this.shop_data.timezone), true)
    },
    formatTimeStamp(time_stamp){
      return formatDate(convertTimeStampToDate(time_stamp, true), this.shop_data.format_date)
    },
    async onChangePage(page_num){
      this.table_filter.page_number = page_num
      await this.loadTableData()
    }
  }
}
</script>