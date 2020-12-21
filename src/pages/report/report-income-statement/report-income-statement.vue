<template>
  <main class="app-content">
    <section class="content report-income-statement-page">
      <div class="page-title">
        <h3>{{ $t('report.income-statement') }}</h3>
        <ul class="group-btn">
          <li class="btn"><a>{{ $t('general.print') }}</a></li>
        </ul>
      </div>
      
      <div class="filter-wrapper">
        <div class="row">
          <div class="col-12 col-md-10 filter">
            <div class="input-date-range">
              <input-date-range-by-date-type ref="input_date_range_by_date_type" v-model="table_filter"/>
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
        <table>
          <thead>
            <th/>
            <th><div>{{ $t('report.items') }}</div></th>
            <th><div>{{ $t('general.amount') }}</div></th>
          </thead>
          <tbody>
            <tr v-for="(income,i) in table_data.incomes" :key="income.key" 
                :class="{ first: i==0 }" class="income-item">
              <td v-if="i==0" :rowspan="table_data.incomes.length + 1">{{ $t('report.income') }}</td>
              <td>{{ formatIncomeName(income.name) }}</td>
              <td>{{ formatMoney(income.amount,0) }}</td>
            </tr>
            <tr class="income-total">
              <td v-if="table_data.incomes.length == 0" class="income-title">{{ $t('report.income') }}</td>
              <td>{{ $t('report.income-total') }}</td>
              <td>{{ formatMoney(income_total, 0) }}</td>
            </tr>

            <tr v-for="(expenditure,i) in table_data.expenditures" :key="expenditure.key" 
                :class="{ first: i==0 }" class="expenditure-item">
              <td v-if="i==0" :rowspan="table_data.expenditures.length + 1">{{ $t('report.expenditure') }}</td>
              <td>{{ expenditure.name }}</td>
              <td>{{ formatMoney(expenditure.amount,0) }}</td>
            </tr>
            <tr class="expenditure-total">
              <td v-if="table_data.expenditures.length == 0" class="expenditure-title">{{ $t('report.expenditure') }}</td>
              <td>{{ $t('report.expenditure-total') }}</td>
              <td>{{ formatMoney(expenditure_total, 0) }}</td>
            </tr>

            <tr class="net-total">
              <td>{{ $t('report.net-income') }}</td>
              <td>{{ $t('report.income-expenditure') }}</td>
              <td>{{ formatMoney(net_total, 0) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<script>
import moment from 'moment'
import { options }                   from '../../../helpers/options'
import { common_options }            from '../../../helpers/options/common-options.js'
import { sales_options }             from '../../../helpers/options/sales-options.js'
import component_base                from '../../../components/common/component-base/component-base'
import input_date_range_by_date_type from '../../../components/common/form/input/input-date-range-by-date-type/input-date-range-by-date-type'
import radio_group                   from '../../../components/common/form/radio/radio-group/radio-group'
import view_table                    from '../../../components/common/view-table/view-table'
import chart_line                    from '../../../components/common/chart/chart-line'
import ReportApi                     from '../../../api/sales/report-api'
import { guid,
  formatMoney,
  convertDateToTimeStamp }           from '../../../helpers/common'

export default {
  components: {
    'input-date-range-by-date-type': input_date_range_by_date_type,
    'radio-group'             : radio_group,
    'view-table'              : view_table,
    'chart-line'              : chart_line
  },
  extends : component_base,
  data(){
    return {
      options,
      sales_options,

      report_api: new ReportApi(),
      
      table_data   : {
        fields : [],
        rows   : [],
        incomes: [],
        expenditures: [],
        pagination : { total_pages: 1 },
        options : { 
          pagination: false
        }
      },
      table_filter : {
        from_date_ts        : 0,
        to_date_ts          : 0,
        shop_id             : 0,

        // ui only
        date_type           : common_options.date_type.month,
        from_date           : {},
        to_date             : {},
      },
    }
  },
  computed:{
    income_total(){
      return this.table_data.incomes.reduce((total, income) => total + income.amount, 0)
    },
    expenditure_total(){
      return this.table_data.expenditures.reduce((total, expenditure) => total + expenditure.amount, 0)
    },
    net_total(){
      return this.income_total - this.expenditure_total
    },
    txt_service_sales(){return this.$i18n.t('report.service-sales')},
    txt_product_sales(){return this.$i18n.t('report.product-sales')},
    txt_prepaid_cards(){return this.$i18n.t('report.prepaid-cards')},
    txt_prepaid_services(){return this.$i18n.t('report.prepaid-services')},
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
      let response = await this.report_api.getIncomeStatementReportAsync(this.table_filter)
      this.preLoader(false)
      
      if(response.is_ok){
        this.table_data.incomes      = response.data.incomes
        this.table_data.expenditures = response.data.expenditures
      }
      else {
        this.showAlert(response.error_messages)
      }
    },
    onSearch(){
      this.loadTableDataAsync()
    },

    // format
    formatIncomeName(api_name){
      let tmp_name = ''
      if(api_name == sales_options.sales_goods_type.service)
        tmp_name = this.txt_service_sales
      if(api_name == sales_options.sales_goods_type.product)
        tmp_name = this.txt_product_sales
      // if(api_name == sales_options.sales_goods_type.prepaid_card)
      //   tmp_name = this.txt_prepaid_cards
      // if(api_name == sales_options.sales_goods_type.prepaid_service)
      //   tmp_name = this.txt_prepaid_services
      return tmp_name
    }
  }
}
</script>

<style lang="scss">
@import './report-income-statement.scss';
</style>
