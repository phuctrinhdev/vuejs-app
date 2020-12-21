<template>
  <main class="app-content">
    <section class="content report-new-clients-by-month-page">
      <div class="page-title">
        <h3>{{ $t('report.new-clients-by-month') }}</h3>
      </div>
      
      <div class="filter-wrapper">
        <div class="row">
          <div class="col-12 col-md-10 filter">
            <div class="row">
              <div class="col-12">
                <input-month-range @input="onInputMonthRange"/>
              </div>
              <div class="col-12">
                <div class="filter-select">
                  <div class="select-box referral-source">
                    <label>{{ $t('report.referral-source') }}</label>
                    <b-form-select v-model="table_filter.referral_source_id" 
                                   :options="referral_source_options" value-field="id" text-field="name"
                                   @mouseleave.native="onMouseLeaveSelect"/>
                  </div>
                  <div class="select-box chart">
                    <label>{{ $t('report.chart') }}</label>
                    <b-form-select v-model="table_filter.chart_type" :options="chart_type_options"
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
        <div class="col-12 col-lg-6">
          <div id="table-wrapper" class="table-wrapper">
            <view-table :data="table_data">
              <template slot="month" slot-scope="{row}">
                {{ row.month }}
              </template>
              <template slot="number_of_client" slot-scope="{row}">
                {{ formatMoney(row.number_of_client, 0) }}
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
// import { common_options }            from '../../../helpers/options/common-options.js'
import { sales_options }             from '../../../helpers/options/sales-options.js'
import product_category_mixin        from '../../../helpers/mixins/product-category-mixin'
import product_mixin                 from '../../../helpers/mixins/product-mixin'
import staff_mixin                   from '../../../helpers/mixins/staff-mixin'
import component_base                from '../../../components/common/component-base/component-base'
import input_month_range             from '../../../components/common/form/input/input-month-range/input-month-range.vue'
import radio_group                   from '../../../components/common/form/radio/radio-group/radio-group'
import view_table                    from '../../../components/common/view-table/view-table'
import chart_line                    from '../../../components/common/chart/chart-line'
import chart_bar                     from '../../../components/common/chart/chart-bar'
import chart_legend                  from '../../../components/common/chart/chart-legend'
import ReportApi                     from '../../../api/sales/report-api'
import ClientReferralSourceApi       from '../../../api/clients/client-referralsource-api'
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
    'chart-bar'               : chart_bar,
    'chart-legend'            : chart_legend
  },
  extends : component_base,
  mixins: [product_category_mixin, product_mixin, staff_mixin],
  data(){
    return {
      options,
      sales_options,
      errors       : [],
      
      table_data   : {
        fields : [
          {field: 'month',            label: 'general.month',           width: '35%',   sortable: false, expand: true },
          {field: 'number_of_client', label: 'report.number-of-clients',width: '50%',   sortable: false, expand: true },
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
        referral_source_id  : -1,
        shop_id             : 0,

        // ui only
        chart_type          : options.chart_type.line
      },

      report_api: new ReportApi(),
      client_referral_source_api: new ClientReferralSourceApi(),

      referral_source_options: [],

      chart_view: options.chart_type.line,
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
    chart_type_options(){
      return [
        { value: options.chart_type.line,     text: this.$i18n.t('report.line') },
        { value: options.chart_type.bar,      text: this.$i18n.t('report.bar') },
        { value: options.chart_type.bar_line, text: this.$i18n.t('report.bar-line') }
      ]
    },
    text_display(){
      return this.$i18n.t('report.number-of-clients')
    },
    text_all(){ return this.$i18n.t('general.all') },
    text_average(){return this.$i18n.t('report.average')},
    text_total(){ return this.$i18n.t('general.total') },
    no_data_for_chart(){return this.$i18n.t('report.no_data_for_chart')},
    end_date_can_not_before_start_date(){return this.$i18n.t('input-date-range.end-date-can-not-before-start-date')},
    error_date_range_can_not_exceed_1_year(){return this.$i18n.t('report.error_date_range_can_not_exceed_1_year')},
  },
  async mounted(){
    this.table_filter.shop_id = this.shop_data.shop_id

    await this.loadClientReferralSourceAsync()
    await this.loadTableDataAsync()
  },
  methods:{
    formatMoney,

    // filter
    onInputMonthRange(month_range){
      this.table_filter.from_date_ts = month_range.from_date_ts
      this.table_filter.to_date_ts   = month_range.to_date_end_ts
    },
    async loadClientReferralSourceAsync(){
      let filter = {
        page_size: options.pagination.max,
        page_number: 1,
        shop_id: this.shop_data.shop_id,
        status: options.good_status.active
      }
      let response = await this.client_referral_source_api.getClientReferralSourceAsync(filter)
      if(response.is_ok){
        let tmp_all_option = { id: -1, name: this.text_all }
        this.referral_source_options = [tmp_all_option, ...response.data.items]
        this.table_filter.referral_source_id = tmp_all_option.id
      }
      else 
        this.showAlert(response.error_messages)
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
      let response = await this.report_api.getNewClientsByMonthReportAsync(this.table_filter)
      this.preLoader(false)
      
      if(response.is_ok){
        // table
        this.table_data.rows = _.cloneDeep(response.data)
        if(this.table_data.rows.length > 0){
          let total_row = {
            month           : this.text_total,
            number_of_client: this.getColumnTotal('number_of_client'),
          }
          this.table_data.rows.push(total_row)
        }

        // chart
        this.chart_view = this.table_filter.chart_type
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
      return row.number_of_client
    },
    onSearch(){
      this.loadTableDataAsync()
    },
  }
}
</script>

<style lang="scss">
@import './report-new-clients-by-month.scss';
</style>