<template>
  <main class="app-content">
    <section class="content report-new-clients-repeat-page">
      <div class="page-title">
        <h3>{{ $t('report.new-clients-repeat') }}</h3>
        <ul class="group-btn">
          <li class="btn"><a>{{ $t('general.print') }}</a></li>
        </ul>
      </div>
      
      <div class="filter-wrapper">
        <div class="row">
          <div class="col-10 filter">
            <label>{{ $t('report.as-of') }}</label>
            <input-month-range ref="input_month_range" @input="onInputMonthRange"/>
          </div>
          <div class="col-2">
            <div class="filter-search">
              <button class="btn btn-search" @click.prevent="onSearch"><i class="btn-search-white"/> <span>{{ $t('general.search') }}</span></button>
            </div>
          </div>
        </div>
      </div>
      
      <div id="table-wrapper" class="table-wrapper">
        <div class="table-new-clients-repeat">
          <table v-if="table_rows.length > 0">
            <thead>
              <tr>
                <th rowspan="2" class="staff">{{ $t('general.staff') }}</th>
                <th rowspan="2" class="new-client">{{ formatRootMonth(table_filter.from_date_ts_view) }}<br>{{ $t('report.new-client') }}</th>
                <th v-for="(repeat_info, i) in table_rows[0].repeat_infos" :key="i" 
                    colspan="2" class="repeat-client">
                  {{ formatRepeatMonth(repeat_info.year_month) }}
                </th>
              </tr>
              <tr>
                <template v-for="(repeat_info,i) in table_rows[0].repeat_infos">
                  <th :key="i*2" class="num">{{ $t('report.num') }}</th>
                  <th :key="i*2+1" class="percentage">%</th>
                </template>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in table_rows" :key="i">
                <td class="staff">{{ formatName(row.staff_name) }}</td>
                <td class="new-client">{{ row.new_clients }}</td>
                <template v-for="(repeat_info, j) in row.repeat_infos">
                  <td :key="j*2" class="num">{{ repeat_info.repeat_clients }}</td>
                  <td :key="j*2+1" class="percentage">
                    <span v-if="getRepeatPercentage(repeat_info.repeat_clients, j) > 0 && getRepeatPercentage(repeat_info.repeat_clients, j) < 100">
                      {{ formatMoney(getRepeatPercentage(repeat_info.repeat_clients, j), 1) }}%
                    </span>
                    <span v-if="getRepeatPercentage(repeat_info.repeat_clients, j) == 100">100%</span>
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
          <div v-else class="table-no-data">{{ text_no_data_for_table }}</div>
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
import input_date_range              from '../../../components/common/form/input/input-date-range/input-date-range.vue'
import radio_group                   from '../../../components/common/form/radio/radio-group/radio-group'
import view_table                    from '../../../components/common/view-table/view-table'
import input_month_range             from '../../../components/common/form/input/input-month-range/input-month-range'
import ReportApi                     from '../../../api/sales/report-api'
import {
  formatMoney,
  convertDateToTimezone,
  convertDateToTimeStamp 
}           from '../../../helpers/common'

export default {
  components: {
    'input-date-range': input_date_range,
    'radio-group'             : radio_group,
    'view-table'              : view_table,
    'input-month-range'       : input_month_range
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
          {field: 'date',                   label: 'general.date',          width: '20%',   sortable: false, expand: true },
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
          fixed_header: true,
          pagination: false
        }
      },
      table_filter : {
        from_date_ts                : 0,
        to_date_ts                  : 0,
        shop_id                     : 0,

        // ui only
        date_type         : common_options.date_type.month,
        from_date         : {},
        to_date           : {},
        from_date_ts_view : 0
      },
      table_rows: [],

      display_item_type_options: [],
      chart_key: '',
      chart_data: {
        labels: [],
        datasets: [],
      },
    }
  },
  computed:{
    text_no_data_for_table(){return this.$i18n.t('general.no-data-for-table')},
    no_input_text(){return this.$i18n.t('report.no-input')},
    text_multi_staffs(){return this.$i18n.t('report.multi-staffs')},
    text_repeat(){ return this.$i18n.t('report.repeat') },
    text_total(){ return this.$i18n.t('general.total') },
    error_date_range_can_not_exceed_1_month(){return this.$i18n.t('report.error_date_range_can_not_exceed_1_month')},
    end_date_can_not_before_start_date(){return this.$i18n.t('input-date-range.end-date-can-not-before-start-date')},
  },
  async mounted(){
    this.table_filter.shop_id = this.shop_data.shop_id
    
    // input month, year (cross)
    let today_timezone = convertDateToTimezone(new Date())
    let first_date_of_3_month_ago = moment(today_timezone).subtract(3, 'month').startOf('month').toDate()
    this.$refs.input_month_range.month_range.from_date = first_date_of_3_month_ago
    this.$refs.input_month_range.month_range.from_month= first_date_of_3_month_ago.getMonth() + 1
    this.$refs.input_month_range.onInputFromMonth()

    await this.loadTableDataAsync()
  },
  methods:{
    moment,
    formatMoney,

    // filter
    onInputMonthRange(month_range){
      let tmp_from_date_ts = month_range.from_date_ts
      let tmp_to_date      = moment(new Date(tmp_from_date_ts * 1000)).add(1, 'month').toDate()
      let tmp_to_date_ts   = convertDateToTimeStamp(tmp_to_date) - 1

      this.table_filter.from_date_ts = tmp_from_date_ts
      this.table_filter.to_date_ts   = tmp_to_date_ts
    },

    // table
    async loadTableDataAsync(){
      this.preLoader()
      let response = await this.report_api.getNewClientsRepeatReportAsync(this.table_filter)
      this.preLoader(false)
      
      if(response.is_ok){
        this.table_rows = response.data
        this.table_filter.from_date_ts_view = this.table_filter.from_date_ts
      }
      else {
        this.showAlert(response.error_messages)
      }
    },
    onSearch(){
      this.loadTableDataAsync()
    },

    // format
    formatRootMonth(from_date_ts_view){
      let tmp_date = convertDateToTimezone(new Date(from_date_ts_view * 1000))
      return moment(tmp_date).format('YYYY-MM')
    },
    formatRepeatMonth(YYYYMM){
      let tmp_txt = ''
      let tmp_month = YYYYMM.toString().slice(4,6)
      if(YYYYMM == 0)
        tmp_txt = `${this.text_repeat} ${this.text_total}`
      else
        tmp_txt = `${tmp_month} ${this.text_repeat}`
      return tmp_txt
    },
    formatName(staff_name){
      let tmp_name = staff_name
      if(staff_name == 'NONE')  tmp_name = this.no_input_text
      if(staff_name == 'MULTI') tmp_name = this.text_multi_staffs
      if(staff_name == 'TOTAL') tmp_name = this.text_total
      return tmp_name
    },
    getRepeatPercentage(repeat_clients, index_of_year_month){
      let tmp_percentage = 0
      let row_total = _.last(this.table_rows)
      for(let i in row_total.repeat_infos){
        let total_repeat_info = row_total.repeat_infos[i]
        if(i == index_of_year_month && total_repeat_info.repeat_clients){
          tmp_percentage = repeat_clients / total_repeat_info.repeat_clients * 100
          break
        }
      }
      return tmp_percentage
    }
  }
}
</script>

<style lang="scss">
@import './report-new-clients-repeat.scss';
</style>
