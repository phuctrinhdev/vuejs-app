<template>
  <main class="app-content">
    <section class="content report-sales-by-discount-category-page">
      <div class="page-title">
        <h3>{{ $t('report.sales-by-discount-category') }}</h3>
        <ul class="group-btn">
          <li class="btn"><a>{{ $t('general.print') }}</a></li>
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
                <div class="filter-select">
                  <div class="select-box staff">
                    <label>{{ $t('general.staff') }}</label>
                    <b-form-select v-model="table_filter.staff_id"
                                   :options="staff_options" value-field="id" text-field="aliasname"
                                   @mouseleave.native="onMouseLeaveSelect"/>
                  </div>
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
              <chart-bar v-if="chart_view == options.chart_type.bar" :key="chart_key" :data="chart_data" 
                         class="chart-bar"/>
            </template>
            <template v-else>
              <div class="chart-no-data">{{ no_data_for_chart }}</div>
            </template>
          </div>
        </div>
        <div class="col-12 col-lg-6">
          <div id="table-wrapper" class="table-wrapper">
            <view-table :data="table_data">
              <template slot="discount_category" slot-scope="{row}">
                {{ row.discount_category }}
              </template>
              <template slot="quantity" slot-scope="{row}">
                {{ formatMoney(row.quantity, 0) }}
              </template>
              <template slot="discount_amount" slot-scope="{row}">
                {{ formatMoney(row.discount_amount, 0) }}
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
import staff_mixin                   from '../../../helpers/mixins/staff-mixin'
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
    'radio-group'             : radio_group,
    'view-table'              : view_table,
    'chart-bar'               : chart_bar,
    'chart-legend'            : chart_legend
  },
  extends : component_base,
  mixins: [staff_mixin],
  data(){
    return {
      options,
      sales_options,
      errors       : [],

      report_api: new ReportApi(),
      
      table_data   : {
        fields : [
          {field: 'discount_category', label: 'report.discount-category', width: '40%',   sortable: false },
          {field: 'quantity',          label: 'general.qty',              width: '15%',   sortable: false, expand: true },
          {field: 'discount_amount',   label: 'report.discount-amount',   width: '25%',   sortable: false, expand: true },
          {field: 'ratio',             label: 'general.ratio',            width: '20%',   sortable: false, expand: true }
        ],
        rows   : [],
        rows_chart: [],
        pagination : { total_pages: 1 },
        options : { 
          pagination: false
        }
      },
      table_filter : {
        from_date_ts        : 0,
        to_date_ts          : 0,
        staff_id            : -1,
        shop_id             : 0,

        // ui only
        date_type           : common_options.date_type.month,
        from_date           : {},
        to_date             : {},
        chart_value         : options.chart_value.amount,
      },

      staff_options: [],

      chart_view: options.chart_type.bar,
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
    text_display(){
      return this.$i18n.t('report.discount-amount')
    },
    text_all(){ return this.$i18n.t('general.all') },
    text_total(){ return this.$i18n.t('general.total') },
    no_data_for_chart(){return this.$i18n.t('report.no_data_for_chart')},
    end_date_can_not_before_start_date(){return this.$i18n.t('input-date-range.end-date-can-not-before-start-date')},
    error_date_range_can_not_exceed_1_year(){return this.$i18n.t('report.error_date_range_can_not_exceed_1_year')},
  },
  async mounted(){
    this.table_filter.shop_id = this.shop_data.shop_id

    this.preLoader()
    await this.loadStaffsAsync()
    await this.loadTableDataAsync()
    this.preLoader(false)
  },
  methods:{
    formatMoney,

    async loadStaffsAsync(){
      let tmp_all_option = { id: -1, aliasname: this.text_all }
      let response = await this.getStaffsAsyncMixin()

      if(response.is_ok){
        this.staff_options = [tmp_all_option, ...response.data.items]
        this.table_filter.staff_id = tmp_all_option.id
      }
      else {
        this.showAlert(response.error_messages)
      }
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
      let response = await this.report_api.getSalesByDiscountCategoryReportAsync(this.table_filter)
      this.preLoader(false)
      
      if(response.is_ok){
        // table
        this.table_data.rows = _.cloneDeep(response.data)
        if(this.table_data.rows.length > 0){
          let total_row = {
            discount_category: this.text_total,
            quantity         : this.getColumnTotal('quantity'),
            discount_amount  : this.getColumnTotal('discount_amount'),
            ratio            : 100
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
        tmp_labels.push(row.discount_category)
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
      return row.discount_amount
    },
    onSearch(){
      this.loadTableDataAsync()
    },
  }
}
</script>

<style lang="scss">
@import './report-sales-by-discount-category.scss';
</style>