<template>
  <main class="app-content">
    <section class="content report-bookings-by-date-page">
      <div class="page-title">
        <h3>{{ $t('report.bookings-by-date') }}</h3>
        <ul class="group-btn">
          <li class="btn"><a>{{ $t('general.print') }}</a></li>
        </ul>
      </div>
      
      <div class="filter-wrapper">
        <div class="row">
          <div class="col-12 col-sm-10 filter">
            <div class="row">
              <div class="col-12">
                <input-date-range ref="input_date_range" @input="onInputDateRange"/>
              </div>
            </div>
          </div>
          <div class="col-12 col-sm-2">
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

          <chart-legend :chart_data="chart_data" :chart_type="chart_view"/>
          <chart-line :key="chart_key" :data="chart_data" :is_decimal_data="false"/>
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
          <template slot="total" slot-scope="{row}">
            {{ formatMoney(row.total, 0) }}
          </template>
          <template slot="cancel" slot-scope="{row}">
            {{ formatMoney(row.cancel, 0) }}
          </template>
          <template slot="no_show" slot-scope="{row}">
            {{ formatMoney(row.no_show, 0) }}
          </template>
          <template slot="cancel_percentage" slot-scope="{row}">
            <span v-if="row.cancel_percentage > 0">{{ formatMoney(row.cancel_percentage, 1) }}%</span>
          </template>
          <template slot="no_show_percentage" slot-scope="{row}">
            <span v-if="row.no_show_percentage > 0">{{ formatMoney(row.no_show_percentage, 1) }}%</span>
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
import { bookings_options }          from '../../../helpers/options/bookings-options.js'
import component_base                from '../../../components/common/component-base/component-base'
import input_date_range              from '../../../components/common/form/input/input-date-range/input-date-range.vue'
import radio_group                   from '../../../components/common/form/radio/radio-group/radio-group'
import view_table                    from '../../../components/common/view-table/view-table'
import chart_line                    from '../../../components/common/chart/chart-line'
import chart_legend                  from '../../../components/common/chart/chart-legend'
import ReportApi                     from '../../../api/sales/report-api'
import { guid,
  formatMoney,
  convertDateToTimeStamp }           from '../../../helpers/common'

export default {
  components: {
    'input-date-range': input_date_range,
    'radio-group'                  : radio_group,
    'view-table'                   : view_table,
    'chart-line'                   : chart_line,
    'chart-legend'                 : chart_legend
  },
  extends : component_base,
  data(){
    return {
      options,
      sales_options,
      errors       : [],

      report_api: new ReportApi(),
      
      table_data   : {
        fields : [
          {field: 'date',              label: 'general.date',             width: '20%',   sortable: false, expand: true },
          {field: 'total',             label: 'general.total',            width: '15%',   sortable: false, expand: true },
          {field: 'cancel',            label: 'general.cancel',           width: '15%',   sortable: false, expand: true },
          {field: 'no_show',           label: 'bookings.no-show',         width: '15%',   sortable: false, expand: true },
          {field: 'cancel_percentage', label: 'report.cancel-percentage', width: '15%',   sortable: false, expand: true },
          {field: 'no_show_percentage',label: 'report.no-show-percentate',width: '20%',   sortable: false, expand: true }
        ],
        rows   : [],
        rows_chart: [],
        pagination : { total_pages: 1 },
        options : {
          fixed_header: true,
          pagination: false
        }
      },
      table_filter : {
        from_date_ts                : 0,
        to_date_ts                  : 0,
        bookings_source             : -1,
        display_item_type           : sales_options.display_item_type.all,
        shop_id                     : 0,

        // ui only
        date_type                   : common_options.date_type.date,
        from_date                   : {},
        to_date                     : {},
      },

      chart_view: options.chart_type.line,
      chart_key : '',
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
    display_item_type_options(){
      return [
        { value: bookings_options.booking_display_item_type.total,   text: this.$i18n.t('general.total') },
        { value: bookings_options.booking_display_item_type.cancel,  text: this.$i18n.t('general.cancel') },
        { value: bookings_options.booking_display_item_type.no_show, text: this.$i18n.t('bookings.no-show') }
      ]
    },
    text_display(){
      let tmp = ''
      if(this.table_filter.display_item_type == bookings_options.booking_display_item_type.total)
        tmp = this.$i18n.t('general.total')
      if(this.table_filter.display_item_type == bookings_options.booking_display_item_type.cancel)
        tmp = this.$i18n.t('general.cancel')
      if(this.table_filter.display_item_type == bookings_options.booking_display_item_type.no_show)
        tmp = this.$i18n.t('bookings.no-show')
      return tmp
    },
    text_average(){return this.$i18n.t('report.average')},
    text_total(){ return this.$i18n.t('general.total') },
    no_data_for_chart(){return this.$i18n.t('report.no_data_for_chart')},
    error_date_range_can_not_exceed_1_month(){return this.$i18n.t('report.error_date_range_can_not_exceed_1_month')},
    end_date_can_not_before_start_date(){return this.$i18n.t('input-date-range.end-date-can-not-before-start-date')},
  },
  created(){
    this.table_filter.shop_id = this.shop_data.shop_id
  },
  async mounted(){
    await this.loadTableDataAsync()
  },
  methods:{
    formatMoney,

    // filter
    onInputDateRange(data){
      this.table_filter.from_date    = data.value.from_date
      this.table_filter.to_date      = data.value.to_date
      this.table_filter.from_date_ts = data.value.from_date.value
      this.table_filter.to_date_ts   = data.value.to_date.value
    },
    onInputDisplayItemType(){
      this.generateChartData()
    },

    // table
    async loadTableDataAsync(){
      let errors = []
      let tmp_to_date_limit    = moment(this.table_filter.from_date.text).add(1, 'month').toDate()
      let tmp_to_date_limit_ts = convertDateToTimeStamp(tmp_to_date_limit) - 1
      
      errors = [...this.$refs.input_date_range.errors]
      if(this.table_filter.to_date_ts > tmp_to_date_limit_ts){
        errors.push(this.error_date_range_can_not_exceed_1_month)
      }
      if(errors.length > 0){
        this.showAlert(errors)
        return
      }

      this.preLoader()
      let response = await this.report_api.getBookingsByDateReportAsync(this.table_filter)
      this.preLoader(false)
      
      if(response.is_ok){
        // table
        this.table_data.rows = _.cloneDeep(response.data)
        if(this.table_data.rows.length > 0){
          let total_row = {
            date              : this.text_total,
            total             : this.getColumnTotal('total'),
            cancel            : this.getColumnTotal('cancel'),
            no_show           : this.getColumnTotal('no_show'),
            cancel_percentage : 0,
            no_show_percentage: 0
          }
          total_row.cancel_percentage  = total_row.cancel / total_row.total * 100
          total_row.no_show_percentage = total_row.no_show / total_row.total * 100
          this.table_data.rows.push(total_row)
        }

        // chart
        this.table_data.rows_chart = response.data
        this.generateChartData()
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
      if(this.table_filter.display_item_type == bookings_options.booking_display_item_type.total)
        tmp = row.total
      if(this.table_filter.display_item_type == bookings_options.booking_display_item_type.cancel)
        tmp = row.cancel
      if(this.table_filter.display_item_type == bookings_options.booking_display_item_type.no_show)
        tmp = row.no_show
      return tmp
    },
    onSearch(){
      this.loadTableDataAsync()
    }
  }
}
</script>

<style lang="scss">
@import './report-bookings-by-date.scss';
</style>
