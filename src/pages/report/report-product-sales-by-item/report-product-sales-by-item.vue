<template>
  <main class="app-content">
    <section class="content report-product-sales-by-item-page">
      <div class="page-title">
        <h3>{{ $t('report.product-sales-by-item') }}</h3>
        <ul class="group-btn">
          <li class="btn">{{ $t('general.print') }}</li>
        </ul>
      </div>
      
      <div class="filter-wrapper">
        <div class="row">
          <div class="col-12 col-md-10 filter">
            <div class="row">
              <div class="col-12">
                <input-date-range-by-date-type ref="input_date_range_by_date_type" v-model="table_filter"/>
              </div>
              <div class="col-12">
                <div class="report-by">
                  <label>{{ $t('report.report-by') }}</label>
                  <b-form-select v-model="table_filter.report_by_type" :options="report_by_type_options"
                                 @mouseleave.native="onMouseLeaveSelect"/>
                </div>
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

      <div class="row">
        <div class="col-12 col-lg-6">
          <div class="chart-wrapper">
            <template v-if="chart_has_data">
              <chart-legend :chart_data="chart_data" :chart_type="chart_view"/>
              <chart-bar :key="chart_key" :data="chart_data" class="chart-bar"/>
            </template>
            <template v-else>
              <div class="chart-no-data">{{ no_data_for_chart }}</div>
            </template>
          </div>
        </div>
        <div class="col-12 col-lg-6">
          <div id="table-wrapper" class="table-wrapper">
            <view-table :data="table_data">
              <template slot="name_col">
                {{ report_by_type_view_name }}
              </template>
              <template slot="name" slot-scope="{row}">
                {{ row.name }}
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
import moment from 'moment'
import { options }                   from '../../../helpers/options'
import { common_options }            from '../../../helpers/options/common-options.js'
import { sales_options }             from '../../../helpers/options/sales-options.js'
import component_base                from '../../../components/common/component-base/component-base'
import input_date_range_by_date_type from '../../../components/common/form/input/input-date-range-by-date-type/input-date-range-by-date-type.vue'
import radio_group                   from '../../../components/common/form/radio/radio-group/radio-group'
import view_table                    from '../../../components/common/view-table/view-table'
import chart_bar                     from '../../../components/common/chart/chart-bar'
import chart_legend                  from '../../../components/common/chart/chart-legend'
import ReportApi                     from '../../../api/sales/report-api'
import { formatMoney,
  guid,
  convertDateToTimeStamp 
}           from '../../../helpers/common'

export default {
  components: {
    'input-date-range-by-date-type': input_date_range_by_date_type,
    'radio-group': radio_group,
    'view-table' : view_table,
    'chart-bar'  : chart_bar,
    'chart-legend': chart_legend
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
          {field: 'name',         label: '',                      width: '35%',   sortable: false, expand: true, column_expand: true },
          {field: 'quantity',     label: 'general.qty',           width: '15%',   sortable: false, expand: true },
          {field: 'amount',       label: 'general.amount',        width: '25%',   sortable: false, expand: true },
          {field: 'ratio',        label: 'general.ratio',         width: '25%',   sortable: false, expand: true }
        ],
        rows   : [],
        rows_chart: [],
        pagination : { total_pages: 1 },
        options : { 
          pagination: false
        }
      },
      table_filter: {
        from_date_ts        : 0,
        to_date_ts          : 0,
        report_by_type      : sales_options.report_by_type.product,
        shop_id             : 0,

        // ui only
        date_type           : common_options.date_type.month,
        from_date           : {},
        to_date             : {},
        chart_value         : options.chart_value.amount,
      },

      report_by_type_view: sales_options.report_by_type.product,
      chart_view: options.chart_type.bar,
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
    report_by_type_options(){
      return [
        { value: sales_options.report_by_type.product,          text: this.$i18n.t('report.product') },
        { value: sales_options.report_by_type.product_category, text: this.$i18n.t('report.product-category') },
        { value: sales_options.report_by_type.staff,            text: this.$i18n.t('report.staff') }
      ]
    },
    report_by_type_view_name(){
      let tmp = ''
      if(this.report_by_type_view == sales_options.report_by_type.product)
        tmp = this.$i18n.t('report.product')
      if(this.report_by_type_view == sales_options.report_by_type.product_category)
        tmp = this.$i18n.t('report.product-category')
      if(this.report_by_type_view == sales_options.report_by_type.staff)
        tmp = this.$i18n.t('report.staff')
      return tmp
    },
    text_display(){
      let tmp = ''
      if(this.table_filter.chart_value == options.chart_value.amount)
        tmp = this.$i18n.t('general.amount')
      if(this.table_filter.chart_value == options.chart_value.qty)
        tmp = this.$i18n.t('refund.quantity')
      return tmp
    },
    no_input_text(){return this.$i18n.t('report.no-input')},
    text_total(){ return this.$i18n.t('general.total') },
    no_data_for_chart(){return this.$i18n.t('report.no_data_for_chart')},
    error_date_range_can_not_exceed_1_year(){return this.$i18n.t('report.error_date_range_can_not_exceed_1_year')},
  },
  async mounted(){
    this.table_filter.shop_id = this.shop_data.shop_id
    await this.loadTableDataAsync()
  },
  methods:{
    formatMoney,

    // table
    async loadTableDataAsync(){
      if(this.table_filter.date_type == common_options.date_type.date_range){
        let errors = [...this.$refs.input_date_range_by_date_type.errors]
        let tmp_to_date_limit    = moment(new Date(this.table_filter.from_date.value * 1000)).add(1, 'year').toDate()
        let tmp_to_date_limit_ts = convertDateToTimeStamp(tmp_to_date_limit) - 1
        
        if(this.table_filter.to_date.value > tmp_to_date_limit_ts){
          errors.push(this.error_date_range_can_not_exceed_1_year)
        }
        if(errors.length > 0){
          this.showAlert(errors)
          return
        }
      }

      this.preLoader()
      let response = await this.report_api.getProductSalesByItemReportAsync(this.table_filter)
      this.preLoader(false)
      
      if(response.is_ok){
        // viewing
        this.report_by_type_view = this.table_filter.report_by_type

        // table
        let tmp_rows = response.data
        for(let tmp_row of tmp_rows){
          tmp_row.name = this.formatName(tmp_row.name)
        }
        this.table_data.rows = _.cloneDeep(tmp_rows)
        if(this.table_data.rows.length > 0){
          let total_row = {
            name    : this.text_total,
            quantity: this.getColumnTotal('quantity'),
            amount  : this.getColumnTotal('amount'),
            ratio   : 100
          }
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

      // set data to labels & datasets
      for(let row of this.table_data.rows_chart){
        tmp_labels.push(row.name)
        tmp_dataset_display.data.push(this.getAmountByDisplayType(row))
      }
      let tmp_datasets = []
      tmp_datasets.push(tmp_dataset_display)

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
    },

    // format
    formatName(api_name){
      let tmp_name = api_name
      if(tmp_name == 'NONE') 
        tmp_name = this.no_input_text
      return tmp_name
    },
  }
}
</script>

<style lang="scss">
@import './report-product-sales-by-item.scss';
</style>