<template>
  <main class="app-content">
    <section class="content new-client-by-referal-source">
      <div class="page-title">
        <h3>{{ $t('report.new-clients-by-referral-source') }}</h3>
        <ul class="group-btn">
          <li class="btn"><a>{{ $t('general.print') }}</a></li>
        </ul>
      </div>
      <div class="filter-wrapper">
        <div class="row">
          <div class="col-12 col-md-10 filter">
            <div class="date">
              <input-date-range-by-date-type ref="input_date_range_by_date_type" v-model="table_filter"/>
            </div>
            <div class="chart-type">
              <label>{{ $t('report.chart') }}</label>
              <radio-group v-model="table_filter.chart_type" 
                           :options="chart_type_options"/>
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
              <chart-bar v-if="chart_view == options.chart_type.bar" :key="chart_key" :data="chart_data"/>
              <chart-pie v-if="chart_view == options.chart_type.pie" :key="chart_key" :data="chart_data"/>
            </template>
            <template v-else>
              <div class="chart-no-data">{{ no_data_for_chart }}</div>
            </template>
          </div>
        </div>
        <div class="col-12 col-lg-6">
          <div class="table-wrapper">
            <view-table :data="table_data">
              <template slot="total_client" slot-scope="{row}">
                {{ formatTotalClient(row) }}
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
import input_date_range_by_date_type from '../../../components/common/form/input/input-date-range-by-date-type/input-date-range-by-date-type.vue'
import radio_group                   from '../../../components/common/form/radio/radio-group/radio-group'
import view_table                    from '../../../components/common/view-table/view-table'
import ReportApi                     from '../../../api/sales/report-api'
import component_base                from '../../../components/common/component-base/component-base'
import chart_bar                     from '../../../components/common/chart/chart-bar'
import chart_pie                     from '../../../components/common/chart/chart-pie'
import chart_legend                  from '../../../components/common/chart/chart-legend'
import { options }                   from '../../../helpers/options'
import { common_options }            from '../../../helpers/options/common-options'
import { guid,
  convertDateToTimeStamp,
  formatMoney }                      from '../../../helpers/common'
export default {
  components: {
    'radio-group'                  : radio_group,
    'view-table'                   : view_table,
    'input-date-range-by-date-type': input_date_range_by_date_type,
    'chart-bar'                    : chart_bar,
    'chart-pie'                    : chart_pie,
    'chart-legend'                 : chart_legend
  },
  extends : component_base,
  data(){
    return {
      options,
      common_options,

      report_api: new ReportApi(),

      table_data   : {
        fields : [
          {field: 'referral_source_name',  label: 'clients.referral-source',  width: '50%',   sortable: false},
          {field: 'total_client',          label: 'report.number-of-clients', width: '50%',   sortable: false, expand: true }
        ],
        rows   : [],
        rows_chart: [],
        pagination : { total_pages: 1 },
        options : {
          pagination: false,
        }
      },
      table_filter : {
        date_type  : common_options.date_type.month,
        from_date  : {},
        to_date    : {},
        chart_type : options.chart_type.pie,
        shop_id    : 0
      },

      chart_view: options.chart_type.pie,
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
    chart_type_options(){
      return [
        { value: options.chart_type.bar, text: 'report.bar' },
        { value: options.chart_type.pie, text: 'report.pie' }
      ]
    },
    text_total(){ return this.$i18n.t('general.total') },
    text_display(){return this.$i18n.t('report.number-of-clients')},
    no_data_for_chart(){return this.$i18n.t('report.no_data_for_chart')},
    error_date_range_can_not_exceed_1_year(){return this.$i18n.t('report.error_date_range_can_not_exceed_1_year')},
  },
  async mounted(){
    this.table_filter.shop_id = this.shop_data.shop_id
    await this.loadTableDataAsync()
  },
  methods:{
    async loadTableDataAsync(){
      // validate filter
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
      let response = await this.report_api.getNewClientsByReferralSource(this.table_filter)
      this.preLoader(false)
      if(response.is_ok){
        // table
        this.table_data.rows = _.cloneDeep(response.data)
        if(this.table_data.rows.length > 0){
          let total_row = {
            referral_source_name: this.text_total,
            total_client        : this.getColumnTotal('total_client')
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
        tmp_labels.push(row.referral_source_name)
        tmp_dataset_display.data.push(row.total_client)

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
    onSearch(){
      this.loadTableDataAsync()
    },

    // format
    formatTotalClient(row){
      let tmp_total = '' 
      if(row.total_client == 0)
        tmp_total = '-'
      else
        tmp_total = formatMoney(row.total_client, 0) 
      return tmp_total
    },

    formatMoney
  },
  
}
</script>

<style lang="scss">
@import './report-new-clients-by-referral-source.scss';
</style>