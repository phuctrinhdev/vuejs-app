<template>
  <main class="app-content">
    <section class="content report-sales-by-month-page">
      <div class="page-title">
        <h3>{{ $t('report.sales-by-month') }}</h3>
      </div>
      
      <div class="filter-wrapper">
        <div class="row">
          <div class="col-12 col-md-10 filter">
            <div class="row">
              <div class="col-12">
                <input-month-range @input="onInputMonthRange"/>
              </div>
              <div class="col-12 form-group prepaid-sales-counting">
                <label>{{ $t('report.prepaid-sales-counting') }}</label>
                <radio-group v-model="table_filter.prepaid_sales_counting_type" 
                             :options="prepaid_sales_counting_type_options"/>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-2">
            <div class="filter-search">
              <button class="btn btn-search" @click.prevent="onSearch"><i class="btn-search-white"/> <span>{{ $t('general.search') }}</span></button>
            </div>
          </div>
        </div>
      </div>

      <div class="chart-wrapper">
        <template v-if="chart_has_data">
          <div class="display-item">
            <label>{{ $t('report.display-item') }}</label>
            <b-form-select v-model="table_filter.display_item_type" :options="display_item_type_options" 
                           @input="onInputDisplayItemType"
                           @mouseleave.native="onMouseLeaveSelect"/>
          </div>

          <chart-legend :chart_data="chart_data"/>
          <chart-line :key="chart_key" :data="chart_data"/>
        </template>
        <template v-else>
          <div class="chart-no-data">{{ no_data_for_chart }}</div>
        </template>
      </div>
      
      <div id="table-wrapper" class="table-wrapper">
        <view-table :data="table_data">
          <template slot="date" slot-scope="{row}">
            {{ row.date }}
          </template>
          <template slot="service_amount" slot-scope="{row}">
            {{ formatMoney(row.service_amount, 0) }}
          </template>
          <template slot="product_amount" slot-scope="{row}">
            {{ formatMoney(row.product_amount, 0) }}
          </template>
          <template slot="prepaid_card_amount" slot-scope="{row}">
            {{ formatPrepaidGoodsAmount(row.prepaid_card_amount) }}
          </template>
          <template slot="prepaid_service_amount" slot-scope="{row}">
            {{ formatPrepaidGoodsAmount(row.prepaid_service_amount) }}
          </template>
          <template slot="total_amount" slot-scope="{row}">
            {{ formatMoney(row.total_amount, 0) }}
          </template>
        </view-table>
      </div>
    </section>
  </main>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { options }                   from '../../../helpers/options'
import { common_options }            from '../../../helpers/options/common-options.js'
import { sales_options }             from '../../../helpers/options/sales-options.js'
import component_base                from '../../../components/common/component-base/component-base'
import input_month_range             from '../../../components/common/form/input/input-month-range/input-month-range.vue'
import radio_group                   from '../../../components/common/form/radio/radio-group/radio-group'
import view_table                    from '../../../components/common/view-table/view-table'
import chart_line                    from '../../../components/common/chart/chart-line'
import chart_legend                  from '../../../components/common/chart/chart-legend'
import ReportApi                     from '../../../api/sales/report-api'
import { formatMoney,
  guid,
  convertDateToTimeStamp 
}           from '../../../helpers/common'

export default {
  components: {
    'input-month-range': input_month_range,
    'radio-group'             : radio_group,
    'view-table'              : view_table,
    'chart-line'              : chart_line,
    'chart-legend'            : chart_legend
  },
  extends : component_base,
  data(){
    return {
      options,
      sales_options,
      
      // form
      form_options : {},
      errors       : [],

      report_api: new ReportApi(),
      
      table_data   : {
        fields : [
          {field: 'date',                   label: 'general.month',         width: '20%',   sortable: false, expand: true },
          {field: 'service_amount',         label: 'report.service',        width: '15%',   sortable: false, expand: true },
          {field: 'product_amount',         label: 'report.product',        width: '15%',   sortable: false, expand: true },
          {field: 'prepaid_card_amount',    label: 'report.prepaid-card',   width: '15%',   sortable: false, expand: true },
          {field: 'prepaid_service_amount', label: 'report.prepaid-service',width: '15%',   sortable: false, expand: true },
          {field: 'total_amount',           label: 'general.total',         width: '20%',   sortable: false, expand: true }
        ],
        rows   : [],
        rows_chart: [],
        pagination : { total_pages: 1 },
        options : { 
          pagination: false
        }
      },
      table_filter : {
        from_date_ts                : 0,
        to_date_ts                  : 0,
        date_type                   : common_options.date_type.month,
        prepaid_sales_counting_type : sales_options.prepaid_sales_counting_type.sold,
        display_item_type           : sales_options.display_item_type.all,
        shop_id                     : 0
      },
      prepaid_sales_counting_type_loaded: sales_options.prepaid_sales_counting_type.sold,

      display_item_type_options: [],
      chart_key: '',
      chart_data: {
        labels: [],
        datasets: [],
      },
    }
  },
  computed:{
    chart_has_data(){
      return this.table_data.rows_chart && this.table_data.rows_chart.length > 0
    },
    prepaid_sales_counting_type_options(){
      return [
        { value: sales_options.prepaid_sales_counting_type.sold, text: 'report.when-sold' },
        { value: sales_options.prepaid_sales_counting_type.used, text: 'report.when-used' },
      ]
    },
    display_item_type_when_sold_options(){
      return [
        { value: sales_options.display_item_type.all,             text: this.$i18n.t('general.all') },
        { value: sales_options.display_item_type.service,         text: this.$i18n.t('report.service') },
        { value: sales_options.display_item_type.product,         text: this.$i18n.t('report.product') },
        { value: sales_options.display_item_type.prepaid_card,    text: this.$i18n.t('report.prepaid-card') },
        { value: sales_options.display_item_type.prepaid_service, text: this.$i18n.t('report.prepaid-service') },
      ]
    },
    display_item_type_when_used_options(){
      return [
        { value: sales_options.display_item_type.all,             text: this.$i18n.t('general.all') },
        { value: sales_options.display_item_type.service,         text: this.$i18n.t('report.service') },
        { value: sales_options.display_item_type.product,         text: this.$i18n.t('report.product') }
      ]
    },
    text_display(){
      let tmp = ''
      if(this.table_filter.display_item_type == sales_options.display_item_type.all)
        tmp = this.$i18n.t('general.total')
      if(this.table_filter.display_item_type == sales_options.display_item_type.service)
        tmp = this.$i18n.t('report.service')
      if(this.table_filter.display_item_type == sales_options.display_item_type.product)
        tmp = this.$i18n.t('report.product')
      if(this.table_filter.display_item_type == sales_options.display_item_type.prepaid_card)
        tmp = this.$i18n.t('report.prepaid-card')
      if(this.table_filter.display_item_type == sales_options.display_item_type.prepaid_service)
        tmp = this.$i18n.t('report.prepaid-service')
      return tmp
    },
    text_average(){return this.$i18n.t('report.average')},
    text_total(){ return this.$i18n.t('general.total') },
    no_data_for_chart(){return this.$i18n.t('report.no_data_for_chart')},
    end_date_can_not_before_start_date(){return this.$i18n.t('input-date-range.end-date-can-not-before-start-date')},
    error_date_range_can_not_exceed_1_year(){return this.$i18n.t('report.error_date_range_can_not_exceed_1_year')},
  },
  async mounted(){
    // load table data
    this.display_item_type_options = this.display_item_type_when_sold_options
    this.table_filter.shop_id = this.shop_data.shop_id
    await this.loadTableDataAsync()
  },
  methods:{
    formatMoney,

    // filter
    onInputMonthRange(month_range){
      this.table_filter.from_date_ts = month_range.from_date_ts
      this.table_filter.to_date_ts   = month_range.to_date_end_ts
    },
    onInputDisplayItemType(){
      this.generateChartData()
    },

    // table
    async loadTableDataAsync(){
      let errors = []
      let tmp_to_date_limit    = moment(new Date(this.table_filter.from_date_ts * 1000)).add(1, 'year').toDate()
      let tmp_to_date_limit_ts = convertDateToTimeStamp(tmp_to_date_limit) - 1
      
      if(this.table_filter.from_date_ts > this.table_filter.to_date_ts){
        errors.push(this.end_date_can_not_before_start_date)
      }
      if(this.table_filter.to_date_ts > tmp_to_date_limit_ts){
        errors.push(this.error_date_range_can_not_exceed_1_year)
      }
      if(errors.length > 0){
        this.showAlert(errors)
        return
      }

      this.preLoader()
      let response = await this.report_api.getSalesByMonthReportAsync(this.table_filter)
      this.preLoader(false)
      
      if(response.is_ok){
        // table
        this.table_data.rows = _.cloneDeep(response.data)
        if(this.table_data.rows.length > 0){
          let total_row = {
            date                  : this.text_total,
            service_amount        : this.getColumnTotal('service_amount'),
            product_amount        : this.getColumnTotal('product_amount'),
            prepaid_card_amount   : this.getColumnTotal('prepaid_card_amount'),
            prepaid_service_amount: this.getColumnTotal('prepaid_service_amount'),
            total_amount          : this.getColumnTotal('total_amount'),
          }
          this.table_data.rows.push(total_row)
        }
        if(this.prepaid_sales_counting_type_loaded != this.table_filter.prepaid_sales_counting_type){
          if(this.table_filter.display_item_type == sales_options.display_item_type.prepaid_card
          || this.table_filter.display_item_type == sales_options.display_item_type.prepaid_service){
            this.table_filter.display_item_type = sales_options.display_item_type.all
          }
          this.prepaid_sales_counting_type_loaded = this.table_filter.prepaid_sales_counting_type
        }

        // chart
        this.table_data.rows_chart = response.data
        this.generateChartData()
        if(this.table_filter.prepaid_sales_counting_type == sales_options.prepaid_sales_counting_type.sold)
          this.display_item_type_options = this.display_item_type_when_sold_options
        else
          this.display_item_type_options = this.display_item_type_when_used_options
      }
      else {
        this.showAlert(response.error_messages)
      }
    },
    getColumnTotal(field){
      return this.table_data.rows.reduce((total, row) => total + row[field], 0)
    },
    generateChartData(){
      // other labels & datasets
      let tmp_labels = []
      let tmp_dataset_display = {
        label: this.text_display,
        data: [],
        color: 'green'
      }

      // average label
      let tmp_dataset_average = {
        label: this.text_average,
        data: [],
        color: 'orange',
        
        // view point
        pointRadius: 0,
        pointHoverRadius: 0,
        datalabels: {
          display: false
        }
      }
      let total_amount_display = this.table_data.rows_chart.reduce((prev, row_current) => {
        return prev + this.getAmountByDisplayType(row_current)
      }, 0)
      let total_amount_display_average = total_amount_display/this.table_data.rows_chart.length
      tmp_dataset_average.label += ` (${formatMoney(total_amount_display_average,2)})`

      // set data to labels & datasets
      for(let row of this.table_data.rows_chart){
        tmp_labels.push(row.date)
        tmp_dataset_display.data.push(this.getAmountByDisplayType(row))
        tmp_dataset_average.data.push(total_amount_display_average)
      }
      let tmp_datasets = []
      tmp_datasets.push(tmp_dataset_display)
      tmp_datasets.push(tmp_dataset_average)

      this.chart_data = {
        labels  : tmp_labels,
        datasets: tmp_datasets,
      }
      this.chart_key = guid()
    },
    getAmountByDisplayType(row){
      let tmp = 0
      if(this.table_filter.display_item_type == sales_options.display_item_type.all)
        tmp = row.total_amount
      if(this.table_filter.display_item_type == sales_options.display_item_type.service)
        tmp = row.service_amount
      if(this.table_filter.display_item_type == sales_options.display_item_type.product)
        tmp = row.product_amount
      if(this.table_filter.display_item_type == sales_options.display_item_type.prepaid_card)
        tmp = row.prepaid_card_amount
      if(this.table_filter.display_item_type == sales_options.display_item_type.prepaid_service)
        tmp = row.prepaid_service_amount
      return tmp
    },
    onSearch(){
      this.loadTableDataAsync()
    },

    // format
    formatPrepaidGoodsAmount(amount){
      let tmp = 0
      if(this.table_filter.prepaid_sales_counting_type == sales_options.prepaid_sales_counting_type.used && amount == 0)
        tmp = '-'
      else
        tmp = formatMoney(amount, 0)
      return tmp
    },
    formatTotal(row){
      let tmp_total = row.service_amount + row.product_amount + row.prepaid_card_amount + row.prepaid_service_amount
      return formatMoney(tmp_total, 0)
    }
  }
}
</script>

<style lang="scss">
@import './report-sales-by-month.scss';
</style>