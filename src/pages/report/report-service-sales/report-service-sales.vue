<template>
  <main class="app-content">
    <section class="content service-sales-page">
      <div class="page-title">
        <h3>{{ $t('report.service-sales') }}</h3>
        <ul class="group-btn">
          <li class="btn"><a>{{ $t('general.print') }}</a></li>
        </ul>
      </div>

      <div class="filter-wrapper">
        <div class="row">
          <div class="col-12 col-md-10">
            <div class="row">
              <div class="col-12 form-group input-month-range">
                <input-date-range-by-date-type ref="input_date_range_by_date_type" v-model="table_filter"/>
              </div>
              <div class="col-12">
                <div class="select-filter">
                  <div class="select-box report-by">
                    <label>{{ $t('report.report-by') }}</label>
                    <b-form-select v-model="table_filter.report_by_type" :options="report_by_type_options" 
                                   @mouseleave.native="onMouseLeaveSelect"/>
                  </div>
                  <div class="select-box staff">
                    <label>{{ $t('general.staff') }}</label>
                    <b-form-select v-model="table_filter.staff_id"
                                   :options="staff_options" value-field="id" text-field="aliasname"
                                   @mouseleave.native="onMouseLeaveSelect"/>
                  </div>
                  <div class="select-box chart">
                    <label>{{ $t('report.chart') }}</label>
                    <b-form-select v-model="table_filter.chart_type" :options="chart_type_options"
                                   @mouseleave.native="onMouseLeaveSelect"/>
                    <radio-group v-model="table_filter.chart_value" :options="chart_value_options"/>
                  </div>
                </div>
              </div>
              <div class="col-12"/>
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
        <div class="col-12 col-xl-6">
          <div class="chart-wrapper">
            <template v-if="chart_has_data">
              <chart-legend :chart_data="chart_data" :chart_type="chart_view"/>
              <chart-bar v-if="chart_view == options.chart_type.bar" :key="chart_key" :data="chart_data" 
                         class="chart-bar"/>
              <chart-pie v-if="chart_view == options.chart_type.pie" :key="chart_key" :data="chart_data" 
                         class="chart-pie"/>
            </template>
            <template v-else>
              <div class="chart-no-data">{{ no_data_for_chart }}</div>
            </template>
          </div>
        </div>
        
        <div class="col-12 col-xl-6">
          <div class="table-wrapper">
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
import staff_mixin                   from '../../../helpers/mixins/staff-mixin'
import radio_group                   from '../../../components/common/form/radio/radio-group/radio-group'
import view_table                    from '../../../components/common/view-table/view-table'
import chart_pie                     from '../../../components/common/chart/chart-pie'
import chart_bar                     from '../../../components/common/chart/chart-bar'
import chart_legend                  from '../../../components/common/chart/chart-legend'
import ReportApi                     from '../../../api/sales/report-api'
import component_base                from '../../../components/common/component-base/component-base'
import input_date_range_by_date_type from '../../../components/common/form/input/input-date-range-by-date-type/input-date-range-by-date-type'
import   moment                      from 'moment'
import { options }                   from '../../../helpers/options'
import { sales_options }             from '../../../helpers/options/sales-options'
import { guid,
  formatMoney,
  loadDayOfWeek,
  convertTimeStampToDate,
  convertDateToTimeStamp
}                                    from '../../../helpers/common'
import { common_options }            from '../../../helpers/options/common-options'

export default {
  components: {
    'input-date-range-by-date-type': input_date_range_by_date_type,
    'radio-group': radio_group,
    'view-table' : view_table,
    'chart-bar'  : chart_bar,
    'chart-pie'  : chart_pie,
    'chart-legend': chart_legend
  },
  extends : component_base,
  mixins  : [staff_mixin],
  data(){
    return {
      options,
      common_options,

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
          pagination: false,
        }
      },
      table_filter : {
        from_date_ts  : 0,
        to_date_ts    : 0,
        report_by_type: sales_options.report_by_type_of_service_sales.staff,
        staff_id      : -1,
        shop_id       : 0,
        
        // ui only
        date_type  : common_options.date_type.month,
        from_date  : {},
        to_date    : {},
        chart_type : options.chart_type.bar,
        chart_value: options.chart_value.amount,
      },

      report_api: new ReportApi(),

      staff_options: [],

      report_by_type_view: sales_options.report_by_type_of_service_sales.staff,
      chart_view: options.chart_type.bar,
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
    report_by_type_options(){
      return [
        { value: sales_options.report_by_type_of_service_sales.staff,         text: this.$i18n.t('report.staff') },
        { value: sales_options.report_by_type_of_service_sales.category,      text: this.$i18n.t('report.category') },
        { value: sales_options.report_by_type_of_service_sales.service,       text: this.$i18n.t('report.service') },
        { value: sales_options.report_by_type_of_service_sales.day_of_week,   text: this.$i18n.t('report.day-of-week') },
        { value: sales_options.report_by_type_of_service_sales.hour_of_day,   text: this.$i18n.t('report.hour-of-day') },
        // { value: sales_options.report_by_type_of_service_sales.client_rating, text: this.$i18n.t('report.client-rating') },
        // { value: sales_options.report_by_type_of_service_sales.sex,           text: this.$i18n.t('report.sex') },
        // { value: sales_options.report_by_type_of_service_sales.sales_type,    text: this.$i18n.t('report.sales-type') },
      ]
    },
    report_by_type_view_name(){
      let tmp = ''
      if(this.is_view_staff)         tmp = this.$i18n.t('report.staff')
      if(this.is_view_category)      tmp = this.$i18n.t('report.category')
      if(this.is_view_service)       tmp = this.$i18n.t('report.service')
      if(this.is_view_day_of_week)   tmp = this.$i18n.t('report.day-of-week')
      if(this.is_view_hour_of_day)   tmp = this.$i18n.t('report.hour-of-day')
      if(this.is_view_client_rating) tmp = this.$i18n.t('report.client-rating')
      if(this.is_view_sex)           tmp = this.$i18n.t('report.sex')
      if(this.is_view_sales_type)    tmp = this.$i18n.t('report.sales-type')
      return tmp
    },
    is_view_staff(){
      return this.report_by_type_view == sales_options.report_by_type_of_service_sales.staff
    },
    is_view_category(){
      return this.report_by_type_view == sales_options.report_by_type_of_service_sales.category
    },
    is_view_service(){
      return this.report_by_type_view == sales_options.report_by_type_of_service_sales.service
    },
    is_view_day_of_week(){
      return this.report_by_type_view == sales_options.report_by_type_of_service_sales.day_of_week
    },
    is_view_hour_of_day(){
      return this.report_by_type_view == sales_options.report_by_type_of_service_sales.hour_of_day
    },
    is_view_client_rating(){
      return this.report_by_type_view == sales_options.report_by_type_of_service_sales.client_rating
    },
    is_view_sex(){
      return this.report_by_type_view == sales_options.report_by_type_of_service_sales.sex
    },
    is_view_sales_type(){
      return this.report_by_type_view == sales_options.report_by_type_of_service_sales.sales_type
    },
    chart_type_options(){
      return [
        { value: options.chart_type.bar, text: this.$i18n.t('report.bar') },
        { value: options.chart_type.pie, text: this.$i18n.t('report.pie') }
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
    none_text(){return this.$i18n.t('report.none')},
    male_text(){return this.$i18n.t('clients.male')},
    female_text(){return this.$i18n.t('clients.female')},
    no_input_text(){return this.$i18n.t('report.no-input')},
    text_all(){ return this.$i18n.t('general.all') },
    text_total(){ return this.$i18n.t('general.total') },
    no_data_for_chart(){return this.$i18n.t('report.no_data_for_chart')},
    error_date_range_can_not_exceed_1_year(){return this.$i18n.t('report.error_date_range_can_not_exceed_1_year')},
  },
  async mounted() {
    this.table_filter.shop_id = this.shop_data.shop_id

    await this.loadStaffItemsAsync()
    await this.loadTableDataAsync()
  },
  methods: {
    moment,
    formatMoney,
    convertTimeStampToDate,

    // filter
    async loadStaffItemsAsync(){
      let tmp_all_option = { id: -1, aliasname: this.text_all }
      let response = await this.getStaffsAsyncMixin()
      if(response.is_ok){
        this.staff_options = [tmp_all_option , ...response.data.items]
        this.table_filter.staff_id = tmp_all_option.id
      }
      else 
        this.showAlert(response.error_messages)
    },

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
      let response = await this.report_api.getServiceSalesReportAsync(this.table_filter)
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
        this.chart_view = this.table_filter.chart_type
        this.table_data.rows_chart = tmp_rows
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
        data : [],
        color: 'green'
      }
      let tmp_pie_color = [
        '#0074D9', '#FF4136', '#2ECC40', '#FF851B', '#7FDBFF', 
        '#B10DC9', '#FFDC00', '#001f3f', '#39CCCC', '#01FF70', 
        '#85144b', '#F012BE', '#3D9970', '#111111', '#AAAAAA',
        '#0074D9', '#FF4136', '#2ECC40', '#FF851B', '#7FDBFF', 
        '#B10DC9', '#FFDC00', '#001f3f', '#39CCCC', '#01FF70', 
        '#85144b', '#F012BE', '#3D9970', '#111111', '#AAAAAA',
      ]

      // set data to labels & datasets
      for(let row of this.table_data.rows_chart){
        tmp_labels.push(row.name)
        tmp_dataset_display.data.push(this.getAmountByDisplayType(row))

        if(this.chart_view == options.chart_type.pie){
          tmp_dataset_display.color = tmp_pie_color
          tmp_dataset_display.datalabels = {
            labels: {
              title: false
            }
          }
        }
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

      if(this.is_view_day_of_week){
        tmp_name = loadDayOfWeek([api_name])
      }
      if(this.is_view_hour_of_day){
        tmp_name = this.formatHourOfDay(api_name)
      }
      if(this.is_view_sex){
        tmp_name = this.formatClientSex(api_name)
      }
      else{
        if(tmp_name == 'NONE') 
          tmp_name = this.no_input_text
      }
      return tmp_name
    },
    formatHourOfDay(hour_number){
      if(hour_number >= 24)
        hour_number = Number(hour_number) - 24
      let hour_number_next = Number(hour_number) + 1
      
      let tmp = ''
      if(hour_number <= 8)
        tmp = `0${hour_number}:00 ~ 0${hour_number_next}:00`
      if(hour_number == 9)
        tmp = `0${hour_number}:00 ~ ${hour_number_next}:00`
      if(hour_number >= 10)
        tmp = `${hour_number}:00 ~ ${hour_number_next}:00`
      return tmp
    },
    formatClientSex(sex){
      let tmp_sex_txt = ''
      if(sex == options.client_sex.no_input)
        tmp_sex_txt = this.no_input_text
      if(sex == options.client_sex.male)
        tmp_sex_txt = this.male_text
      if(sex == options.client_sex.female)
        tmp_sex_txt = this.female_text
      if(sex == options.client_sex.none)
        tmp_sex_txt = this.none_text
      return tmp_sex_txt
    }
  }
}
</script>

<style lang="scss">
@import './report-service-sales.scss';
</style>