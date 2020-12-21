<template>
  <main class="app-content">
    <section class="content service-sales-by-month-page">
      <div class="page-title">
        <h3>{{ $t('report.service-sales-by-month') }}</h3>
        <ul class="group-btn">
          <li class="btn"><a>{{ $t('general.print') }}</a></li>
        </ul>
      </div>

      <div class="filter-wrapper">
        <div class="row">
          <div class="col-12 col-lg-10">
            <div class="row">
              <div class="col-12 form-group input-month-range">
                <input-month-range @input="onInputMonthRange"/>
              </div>
              <div class="col-12">
                <div class="select-filter category">
                  <div class="select-box">
                    <label>{{ $t('products.category') }}</label>
                    <b-form-select v-model="table_filter.category_id" 
                                   :options="category_options" value-field="id" text-field="name"
                                   @change="onChangeCategoryService"
                                   @mouseleave.native="onMouseLeaveSelect">
                      <template v-slot:first>
                        <option :value="-1">{{ $t('general.all') }}</option>
                      </template>
                    </b-form-select>
                  </div>
                  <div class="select-box service">
                    <label>{{ $t('report.service') }}</label>
                    <b-form-select v-model="table_filter.service_id" 
                                   :options="service_options" value-field="id" text-field="name"
                                   @mouseleave.native="onMouseLeaveSelect">
                      <template v-slot:first>
                        <option :value="-1">{{ $t('general.all') }}</option>
                      </template>
                    </b-form-select>
                  </div>
                  <div class="select-box staff">
                    <label>{{ $t('general.staff') }}</label>
                    <b-form-select v-model="table_filter.staff_id"
                                   :options="staff_options" value-field="id" text-field="aliasname"
                                   @mouseleave.native="onMouseLeaveSelect">
                      <template v-slot:first>
                        <option :value="-1">{{ $t('general.all') }}</option>
                      </template>
                    </b-form-select>
                  </div>
                  <div class="select-box chart chart-select-box">
                    <label>{{ $t('report.chart') }}</label>
                    <b-form-select v-model="table_filter.chart_type" :options="chart_type_options"
                                   @mouseleave.native="onMouseLeaveSelect"/>
                  </div>
                  <div class="chart-value">
                    <radio-group v-model="table_filter.chart_value" :options="chart_value_options"
                                 @mouseleave.native="onMouseLeaveSelect"/>
                  </div>
                </div>
              </div>
              <div class="col-12"/>
            </div>
          </div>
          <div class="col-12 col-lg-2">
            <div class="filter-search">
              <button class="btn btn-search" @click.prevent="onSearch"><i class="btn-search-white"/> <span>{{ $t('general.search') }}</span></button>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 col-xl-6">
          <div class="chart-wrapper">
            <template v-if="chart_has_data">
              <chart-legend :chart_data="chart_data" :chart_type="chart_view"/>
              <chart-line v-if="chart_view == options.chart_type.line" :key="chart_key" :data="chart_data"
                          class="chart-line"/>
              <chart-bar v-if="chart_view == options.chart_type.bar" :key="chart_key" :data="chart_data" 
                         class="chart-bar"/>
              <chart-bar v-if="chart_view == options.chart_type.bar_line" :key="chart_key" :data="chart_data" 
                         class="chart-bar-line"/>
            </template>
            <template v-else>
              <div class="chart-no-data">{{ no_data_for_chart }}</div>
            </template>
          </div>
        </div>
        <div class="col-12 col-xl-6">
          <div class="table-wrapper">
            <view-table :data="table_data">
              <template slot="month" slot-scope="{row}">
                {{ row.month }}
              </template>
              <template slot="quantity" slot-scope="{row}">
                {{ formatMoney(row.quantity, 0) }}
              </template>
              <template slot="amount" slot-scope="{row}">
                {{ formatMoney(row.amount, 0) }}
              </template>
              <template slot="ratio" slot-scope="{row}">
                {{ formatMoney(row.ratio, 1) }}%
              </template>
            </view-table>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import _ from 'lodash'
import service_mixin                 from '../../../helpers/mixins/service-mixin'
import product_mixin                 from '../../../helpers/mixins/product-category-mixin'
import staff_mixin                   from '../../../helpers/mixins/staff-mixin'
import radio_group                   from '../../../components/common/form/radio/radio-group/radio-group'
import view_table                    from '../../../components/common/view-table/view-table'
import chart_line                    from '../../../components/common/chart/chart-line'
import chart_bar                     from '../../../components/common/chart/chart-bar'
import chart_legend                  from '../../../components/common/chart/chart-legend'
import ReportApi                     from '../../../api/sales/report-api'
import component_base                from '../../../components/common/component-base/component-base'
import input_month_range             from '../../../components/common/form/input/input-month-range/input-month-range'
import moment                        from 'moment'
import { options }                   from '../../../helpers/options'
import { guid,
  formatMoney, 
  convertTimeStampToDate,
  convertDateToTimeStamp
}                                    from '../../../helpers/common'
import { common_options }            from '../../../helpers/options/common-options'

export default {
  components: {
    'input-month-range'       : input_month_range,
    'radio-group'             : radio_group,
    'view-table'              : view_table,
    'chart-line'              : chart_line,
    'chart-bar'               : chart_bar,
    'chart-legend'            : chart_legend
  },
  extends : component_base,
  mixins  : [service_mixin,product_mixin,staff_mixin],
  data(){
    return {
      options,
      common_options,

      report_api: new ReportApi(),
      
      category_options  : [],
      service_options   : [],
      staff_options     : [],
      table_data   : {
        fields : [
          {field: 'month',        label: 'general.month',         width: '35%',   sortable: false, expand: true },
          {field: 'quantity',     label: 'general.qty',           width: '15%',   sortable: false, expand: true },
          {field: 'amount',       label: 'general.amount',        width: '25%',   sortable: false, expand: true },
          {field: 'ratio',        label: 'general.ratio',         width: '25%',   sortable: false, expand: true }
        ],
        rows   : [],
        rows_chart: [],
        pagination : { total_pages: 1 },
        options : { 
          pagination: false,
        }
      },
      table_filter : {
        from_date_ts: 0,
        to_date_ts  : 0,
        category_id : -1,
        service_id  : -1,
        staff_id    : -1,
        shop_id     : 0,
        
        // viewing only
        chart_type  : options.chart_type.line,
        chart_value : options.chart_value.amount,
      },
      services_pagination: {
        page_number: 1
      },

      chart_view: options.chart_type.line,
      chart_key : '',
      chart_data: {
        labels  : [],
        datasets: [],
      },
    }
  },
  computed:{
    chart_has_data(){
      return this.table_data.rows_chart && this.table_data.rows_chart.length > 0
    },
    chart_type_options(){
      return [
        { value: options.chart_type.line,     text: this.$i18n.t('report.line') },
        { value: options.chart_type.bar,      text: this.$i18n.t('report.bar') },
        { value: options.chart_type.bar_line, text: this.$i18n.t('report.bar-line') }
      ]
    },
    chart_value_options(){
      return [
        { value: options.chart_value.qty,    text: 'general.qty' },
        { value: options.chart_value.amount, text: 'general.amount' }
      ]
    },
    text_display(){
      let tmp = ''
      if(this.table_filter.chart_value == options.chart_value.amount)
        tmp = this.$i18n.t('general.amount')
      if(this.table_filter.chart_value == options.chart_value.qty)
        tmp = this.$i18n.t('refund.quantity')
      return tmp
    },
    text_average(){return this.$i18n.t('report.average')},
    text_total(){ return this.$i18n.t('general.total') },
    no_data_for_chart(){return this.$i18n.t('report.no_data_for_chart')},
    end_date_can_not_before_start_date(){return this.$i18n.t('input-date-range.end-date-can-not-before-start-date')},
    error_date_range_can_not_exceed_1_year(){return this.$i18n.t('report.error_date_range_can_not_exceed_1_year')},
  },
  async mounted() {
    this.table_filter.shop_id = this.shop_data.shop_id

    await this.loadServiceCategoriesAsync()
    await this.loadServicesByCategoryAsync(this.table_filter.category_id,this.services_pagination.page_number)
    await this.loadStaffItemsAsync()
    await this.loadTableDataAsync()
  },
  methods: {
    moment,
    formatMoney,
    convertTimeStampToDate,

    // prepair
    async loadServiceCategoriesAsync(){
      let result_categorys = await this.loadServiceCategorysAsync()
      if(result_categorys.is_ok) {
        this.category_options = result_categorys.data.items
      }
      else
        this.showAlert(result_categorys.error_messages)
    },
    async loadServicesByCategoryAsync(category_id, page_number){
      let tmp_category_id = category_id == -1 ? 0 : category_id

      this.preLoader()
      let result_services = await this.loadServicesAsync(tmp_category_id, page_number)
      this.preLoader(false)

      if(result_services.is_ok){
        this.service_options = result_services.data.items
      }
      else{
        this.showAlert(result_services.error_messages)
      }
    },
    async loadStaffItemsAsync(){
      let result = await this.getStaffsAsyncMixin()
      if(result.is_ok){
        this.staff_options = result.data.items
      }
      else 
        this.showAlert(result.error_messages)
    },

    // filter
    onInputMonthRange(month_range){
      this.table_filter.from_date_ts = month_range.from_date_ts
      this.table_filter.to_date_ts   = month_range.to_date_end_ts
    },
    async onChangeCategoryService(category_id){
      this.table_filter.service_id = -1
      await this.loadServicesByCategoryAsync(category_id,this.services_pagination.page_number)
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
      let response = await this.report_api.getServiceSalesByMonthReportAsync(this.table_filter)
      this.preLoader(false)

      if(response.is_ok){
        // table
        this.table_data.rows = _.cloneDeep(response.data)
        if(this.table_data.rows.length > 0){
          let total_row = {
            month   : this.text_total,
            quantity: this.getColumnTotal('quantity'),
            amount  : this.getColumnTotal('amount'),
            ratio   : 100
          }
          this.table_data.rows.push(total_row)
        }

        // chart
        this.chart_view = this.table_filter.chart_type
        this.table_data.rows_chart = response.data
        this.generateChartData()
      }
      else{
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
        tmp_labels.push(row.month)
        tmp_dataset_display.data.push(this.getAmountByDisplayType(row))
        tmp_dataset_average.data.push(total_amount_display_average)
      }
      let tmp_datasets = []
      tmp_datasets.push(tmp_dataset_display)
      if(this.chart_view == options.chart_type.line){
        tmp_datasets.push(tmp_dataset_average)
      }
      if(this.chart_view == options.chart_type.bar_line){
        let tmp_dataset_display_line   = _.cloneDeep(tmp_dataset_display)
        tmp_dataset_display_line.type  = 'line'
        tmp_dataset_display_line.color = 'orange'
        tmp_dataset_display_line.datalabels = {
          labels: {
            title: null
          }
        }
        tmp_datasets.unshift(tmp_dataset_display_line)
      }

      this.chart_data = {
        labels  : tmp_labels,
        datasets: tmp_datasets,
      }
      this.chart_key = guid()
    },
    getAmountByDisplayType(row){
      let tmp = 0
      if(this.table_filter.chart_value == options.chart_value.amount)
        tmp = row.amount
      if(this.table_filter.chart_value == options.chart_value.qty)
        tmp = row.quantity
      return tmp
    },
    onSearch(){
      this.loadTableDataAsync()
    }
  }
}
</script>

<style lang="scss">
@import './report-service-sales-by-month.scss';
</style>