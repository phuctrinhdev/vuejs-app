<template>
  <main class="app-content">
    <section class="contents-style common-style">
      <div class="inner">
        <article class="setup-top clearfix">
          <h3>{{ $t('netmoney-histories.title') }}</h3>
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
            <li class="part mr15">
              <span class="badge badge-info badge-pill search-part">{{ $t('netmoney-histories.type') }}</span> 
              <select v-model="table_filter.netmoney_variation" class="custom-select">
                <option :value="null">{{ $t('general.all-select') }}</option>    
                <option :value="options.admin_sales_enums.netmoney_variation.charge">{{ $t('netmoney-histories.saving') }}</option>    
                <option :value="options.admin_sales_enums.netmoney_variation.used">{{ $t('netmoney-histories.deduction') }}</option>             
              </select>
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
              <template slot="type" slot-scope="{ row }">
                {{ formatTypeCol(row.amount) }}
              </template>
            </view-table>
          </div>
        </div>
      </div>
    </section> 
  </main>
</template>

<script>
import { options }                from '../../../helpers/options'
import component_base             from '../../../components/common/component-base/component-base'
import NetmoneyHistoryApi         from '../../../api/account/netmoney-history-api'
import view_table                 from '../../../components/common/view-table/view-table'
import { setupCalendar
  , DatePicker }                  from 'v-calendar'
import { formatDateBySetting 
  , convertDateToTimezone
  , convertFirstDateToTimezone }  from '../../../helpers/common'

export default {
  components: {
    'view-table'   : view_table,
    'v-date-picker': DatePicker,
  },
  extends: component_base,
  data() {
    return {
      options : options,
      table_data: {
        fields: [
          { field: 'id',                   label: 'general.number',             width: '10%',  sortable: false },
          { field: 'registration_date',    label: 'general.datetime',           width: '25%',  sortable: false, formatFn: this.formatDateCol },
          { field: 'type',                 label: 'netmoney-histories.type',    width: '15%',  sortable: false, expand: true },
          { field: 'netmoney_source_type', label: 'netmoney-histories.items',   width: '20%',  sortable: false, formatFn: this.formatItemCol },
          { field: 'amount',               label: 'netmoney-histories.amount',  width: '15%',  sortable: false },
          { field: 'balance',              label: 'netmoney-histories.balance', width: '15%',  sortable: false }
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
        netmoney_variation: null,
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
      let netmoney_history_api = new NetmoneyHistoryApi()
      let result = await netmoney_history_api.getNetmoneyHistoriesAsync(this.table_filter)
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
      return formatDateBySetting(date)
    },
    formatTypeCol(amount){
      if(amount > 0)
        return this.$i18n.t('netmoney-histories.saving')
      else
        return this.$i18n.t('netmoney-histories.deduction')
    },
    formatItemCol(item){
      return this.$i18n.t(options.admin_sales_enums.netmoney_source_type_select.find(x => x.value == item).text)
    },
    async onChangePage(page_num){
      this.table_filter.page_number = page_num
      await this.loadTableData()
    },
  }
}
</script>