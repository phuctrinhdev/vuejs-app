<template>
  <main class="app-content">
    <section class="content report-booking-deposit-summary-page">
      <div class="page-title">
        <h3>{{ $t('report.booking-deposit-summary') }}</h3>
        <ul class="group-btn">
          <li class="btn"><a>{{ $t('general.print') }}</a></li>
        </ul>
      </div>
      
      <div class="filter-wrapper">
        <div class="row">
          <div class="col-10 filter">
            <input-date-range-by-date-type ref="input_date_range_by_date_type" v-model="table_filter"/>
            <radio-group v-model="table_filter.report_by_type" :options="report_by_type_options"/>
          </div>
          <div class="col-2">
            <div class="filter-search">
              <button class="btn btn-search" @click.prevent="onSearch"><i class="btn-search-white"/> <span>{{ $t('general.search') }}</span></button>
            </div>
          </div>
        </div>
      </div>
      
      <div id="table-wrapper" class="table-wrapper">
        <table v-if="is_view_deposit" class="table-deposit">
          <thead>
            <tr>
              <th rowspan="2">{{ $t('sales.payment-method') }}</th>
              <th colspan="2">{{ $t('sales.deposit') }}</th>
              <th colspan="2">{{ $t('sales.refund') }}</th>
              <th rowspan="2">{{ $t('sales.total-amount') }}</th>
            </tr>
            <tr>
              <th>{{ $t('general.qty') }}</th>
              <th>{{ $t('sales.amount') }}</th>
              <th>{{ $t('general.qty') }}</th>
              <th>{{ $t('sales.amount') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row,i) in table_rows" :key="i">
              <td class="payment-method">{{ row.payment_method_name }}</td>
              <td class="deposit-quantity">{{ formatNumber(row.deposit_quantity) }}</td>
              <td class="deposit-amount">{{ formatNumber(row.deposit_amount) }}</td>
              <td class="refund-quantity">{{ formatNumber(row.refund_quantity) }}</td>
              <td class="refund-amount">{{ formatNumber(row.refund_amount) }}</td>
              <td class="total-amount">{{ formatNumber(row.total_amount) }}</td>
            </tr>
          </tbody>
        </table>

        <table v-if="is_view_added_to_sales" class="table-added-to-sales">
          <thead>
            <tr>
              <th>{{ $t('sales.payment-method') }}</th>
              <th>{{ $t('sales.qty') }}</th>
              <th>{{ $t('sales.amount') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row,i) in table_rows" :key="i">
              <td class="payment-method">{{ row.payment_method_name }}</td>
              <td class="deposit-quantity">{{ formatNumber(row.deposit_quantity) }}</td>
              <td class="deposit-amount">{{ formatNumber(row.deposit_amount) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script>
let report_by_type_enum = {
  deposit       : 1,
  added_to_sales: 2
}
import moment from 'moment'
import { options }                   from '../../../helpers/options'
import { common_options }            from '../../../helpers/options/common-options.js'
import { sales_options }             from '../../../helpers/options/sales-options.js'
import component_base                from '../../../components/common/component-base/component-base'
import input_date_range_by_date_type from '../../../components/common/form/input/input-date-range-by-date-type/input-date-range-by-date-type'
import radio_group                   from '../../../components/common/form/radio/radio-group/radio-group'
import view_table                    from '../../../components/common/view-table/view-table'
import ReportApi                     from '../../../api/sales/report-api'
import { guid,
  formatMoney,
  convertDateToTimeStamp }           from '../../../helpers/common'

export default {
  components: {
    'input-date-range-by-date-type': input_date_range_by_date_type,
    'radio-group'             : radio_group,
    'view-table'              : view_table,
  },
  extends : component_base,
  data(){
    return {
      options,
      sales_options,

      report_api: new ReportApi(),
      
      table_filter : {
        from_date_ts        : 0,
        to_date_ts          : 0,
        report_by_type      : report_by_type_enum.deposit,
        shop_id             : 0,

        // ui only
        date_type           : common_options.date_type.month,
        from_date           : {},
        to_date             : {},
      },
      table_rows: [],

      report_by_type_view: report_by_type_enum.deposit
    }
  },
  computed:{
    report_by_type_options(){
      return [
        { value: report_by_type_enum.deposit,        text: 'sales.deposit' },
        { value: report_by_type_enum.added_to_sales, text: 'report.added-to-sales' }
      ]
    },
    is_view_deposit(){
      return this.report_by_type_view == report_by_type_enum.deposit
    },
    is_view_added_to_sales(){
      return this.report_by_type_view == report_by_type_enum.added_to_sales
    },
    txt_prepaid_cards(){return this.$i18n.t('report.prepaid-cards')},
    end_date_can_not_before_start_date(){return this.$i18n.t('input-date-range.end-date-can-not-before-start-date')},
    error_date_range_can_not_exceed_1_year(){return this.$i18n.t('report.error_date_range_can_not_exceed_1_year')},
  },
  async mounted(){
    this.table_filter.shop_id = this.shop_data.shop_id
    await this.loadTableDataAsync()
  },
  methods:{
    guid,
    formatMoney,

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
      let response = await this.report_api.getBookingDepositSummaryReportAsync(this.table_filter)
      this.preLoader(false)
      
      if(response.is_ok){
        this.table_rows = response.data
        this.report_by_type_view = this.table_filter.report_by_type
      }
      else {
        this.showAlert(response.error_messages)
      }
    },
    onSearch(){
      this.loadTableDataAsync()
    },

    // format
    formatNumber(number){
      let tmp = ''
      if(number != 0){
        tmp = formatMoney(number,0)
      }
      return tmp
    }
  }
}
</script>

<style lang="scss">
@import './report-booking-deposit-summary.scss';
</style>
