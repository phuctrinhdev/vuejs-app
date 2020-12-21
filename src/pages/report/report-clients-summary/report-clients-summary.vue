<template>
  <main class="app-content">
    <section class="content report-clients-summary-page">
      <div class="page-title">
        <h3>{{ $t('report.clients-summary') }}</h3>
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
            </div>
          </div>
          <div class="col-12 col-md-2">
            <div class="filter-search">
              <button class="btn btn-search" @click.prevent="onSearch"><i class="btn-search-white"/> <span>{{ $t('general.search') }}</span></button>
            </div>
          </div>
        </div>
      </div>

      <div id="table-wrapper" class="table-wrapper">
        <div class="row">
          <div class="col-12 col-md-6">
            <div class="service-sales-clients">
              <div class="table-title">{{ $t('report.service-sales-clients') }}</div>
              <table>
                <thead>
                  <tr>
                    <th colspan="3">{{ $t('report.service-sales') }}</th>
                    <th rowspan="2">{{ $t('report.deduction') }}</th>
                    <th rowspan="2">{{ $t('report.total-sales-deduction') }}</th>
                  </tr>
                  <tr>
                    <th>{{ $t('general.new') }}</th>
                    <th>{{ $t('report.repeat') }}</th>
                    <th>{{ $t('general.total') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="table_data.service_sales_clients">
                    <td>{{ formatMoney(table_data.service_sales_clients.new_clients,0) }}</td>
                    <td>{{ formatMoney(table_data.service_sales_clients.repeat_clients,0) }}</td>
                    <td>{{ formatMoney(table_data.service_sales_clients.total_clients,0) }}</td>
                    <td>{{ formatMoney(table_data.service_sales_clients.deduction_clients,0) }}</td>
                    <td>{{ formatMoney(table_data.service_sales_clients.all_clients,0) }}</td>
                  </tr>
                  <tr v-else>
                    <td colspan="5">{{ text_no_data_for_table }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="prepaid-sales-clients">
              <div class="table-title">{{ $t('report.prepaid-sales-clients') }}</div>
              <table>
                <thead>
                  <tr>
                    <th>{{ $t('general.new') }}</th>
                    <th>{{ $t('report.repeat') }}</th>
                    <th>{{ $t('general.total') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="table_data.prepaid_sales_clients">
                    <td>{{ formatMoney(table_data.prepaid_sales_clients.new_clients,0) }}</td>
                    <td>{{ formatMoney(table_data.prepaid_sales_clients.repeat_clients,0) }}</td>
                    <td>{{ formatMoney(table_data.prepaid_sales_clients.total_clients,0) }}</td>
                  </tr>
                  <tr v-else>
                    <td colspan="3">{{ text_no_data_for_table }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="all-clients">
              <div class="table-title">{{ $t('report.all-clients') }}</div>
              <table>
                <thead>
                  <tr>
                    <th rowspan="2">{{ $t('report.all-clients') }}</th>
                    <th colspan="2">{{ $t('report.prepaid-clients') }}</th>
                  </tr>
                  <tr>
                    <th>{{ $t('general.all') }}</th>
                    <th>{{ $t('report.visited-in-2-weeks') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="table_data.all_clients">
                    <td>{{ formatMoney(table_data.all_clients.all_clients,0) }}</td>
                    <td>{{ formatMoney(table_data.all_clients.all_prepaid_clients,0) }}</td>
                    <td>{{ formatMoney(table_data.all_clients.all_prepaid_clients_visited_in_2_week,0) }}</td>
                  </tr>
                  <tr v-else>
                    <td colspan="3">{{ text_no_data_for_table }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
// import _ from 'lodash'
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
      
      table_filter: {
        from_date_ts            : 0,
        to_date_ts              : 0,
        shop_id                 : 0,

        // ui only
        date_type               : common_options.date_type.month,
        from_date               : {},
        to_date                 : {},
      },
      table_data: {}
    }
  },
  computed:{
    text_no_data_for_table(){return this.$i18n.t('general.no-data-for-table')},
    no_input_text(){return this.$i18n.t('report.no-input')},
    text_total(){ return this.$i18n.t('general.total') },
    error_prepaid_gooods_need_at_least_one(){return this.$i18n.t('report.error_you_need_select_one_of_the_two_options')},
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
      let response = await this.report_api.getClientsSummaryReportAsync(this.table_filter)
      this.preLoader(false)
      
      if(response.is_ok){
        this.table_data = response.data
      }
      else {
        this.showAlert(response.error_messages)
      }
    },
    onSearch(){
      this.loadTableDataAsync()
    }
  }
}
</script>

<style lang="scss">
@import './report-clients-summary.scss';
</style>