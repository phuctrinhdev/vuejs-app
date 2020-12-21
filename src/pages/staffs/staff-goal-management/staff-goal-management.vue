<template>
  <main class="app-content">
    <section id="staff-goal-management" class="content staff-goal-management-page">
      <div class="page-title">
        <h3>{{ $t('staff-goal.staff-goal-management') }}</h3>
        <ul class="group-btn">
          <li class="btn"><router-link :to="{ name: 'staff-goal-setup' }">{{ $t('staff-goal.goal-setup') }}</router-link></li>
        </ul>
      </div>

      <div class="filter-wrapper">
        <div class="row">
          <div class="col-12 col-md-10">
            <div class="row">
              <div class="col-12 filter-first">
                <input-date-range-by-date-type ref="input_date_range_by_date_type" v-model="table_filter"/>
                <div class="staff">
                  <label>{{ $t('general.staff') }}</label>
                  <b-form-select v-model="table_filter.staff_id"
                                 :options="staff_options" value-field="id" text-field="aliasname"
                                 @mouseleave.native="onMouseLeaveSelect"/>
                </div>
                <div class="select-box items">
                  <label>{{ $t('report.items') }}</label>
                  <select-multi-sales-item-type ref="select_multi_sales_item_type"
                                                v-model="item_types" @input="onInputItemTypes"/>
                </div>
                <b-form-checkbox v-model="table_filter.exclude_point_deduction" :value="true">{{ $t('report.exclude-points-deduction') }}</b-form-checkbox>
              </div>
              <div class="col-12 filter-second">
                <div class="select-filter">
                  <div class="select-box prepaid-sales-counting">
                    <label>{{ $t('report.prepaid-sales-counting') }}</label>
                    <radio-group v-model="table_filter.prepaid_sales_counting_type" :options="prepaid_sales_counting_type_options"/>
                    <b-form-checkbox v-model="table_filter.exclude_point_deduction" :value="true">{{ $t('report.exclude-points-deduction') }}</b-form-checkbox>
                  </div>
                  <div class="select-box goal-calculation">
                    <label>{{ $t('staff-goal.goal-calculation') }}</label>
                    <radio-group v-model="table_filter.goal_calculation_type" :options="goal_calculation_type_options"/>
                  </div>
                  <div class="select-box items">
                    <label>{{ $t('report.items') }}</label>
                    <select-multi-sales-item-type ref="select_multi_sales_item_type"
                                                  v-model="item_types" @input="onInputItemTypes"/>
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

      <div class="chart-wrapper">
        <template v-if="chart_has_data">
          <chart-legend :chart_data="chart_data" :chart_type="options.chart_type.bar"/>
          <chart-bar :key="chart_key" :data="chart_data" :options="chart_options" 
                     class="chart-bar"/>
        </template>
        <template v-else>
          <div class="chart-no-data">{{ no_data_for_chart }}</div>
        </template>
      </div>

      <div class="table-wrapper">
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th rowspan="2" width="15%">{{ $t('sales.staff') }}</th>
                <th colspan="2">{{ $t('report.service') }}</th>
                <th colspan="2">{{ $t('report.product') }}</th>
                <th colspan="2">{{ $t('report.prepaid-card') }}</th>
                <th colspan="2">{{ $t('report.prepaid-service') }}</th>
                <th colspan="2">{{ $t('general.total') }}</th>
              </tr>
              <tr>
                <th>{{ $t('staff-goal.achieved-goals') }}</th>
                <th width="5%">%</th>
                <th>{{ $t('staff-goal.achieved-goals') }}</th>
                <th width="5%">%</th>
                <th>{{ $t('staff-goal.achieved-goals') }}</th>
                <th width="5%">%</th>
                <th>{{ $t('staff-goal.achieved-goals') }}</th>
                <th width="5%">%</th>
                <th>{{ $t('staff-goal.achieved-goals') }}</th>
                <th width="5%">%</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="table_data.rows.length == 0">
                <tr>
                  <td colspan="11" class="table-no-data">{{ text_no_data_for_table }}</td>
                </tr>
              </template>
              <template v-else>
                <tr v-for="(row, i) in table_data.rows" :key="i">
                  <td class="staff">{{ formatName(row.staff_name) }}</td>

                  <td class="service-amount">
                    <template v-if="table_filter.include_service_view">
                      <template v-if="row.service_goal_amount > 0">
                        {{ formatMoney(row.service_achieved_amount,0) }}<br>/{{ formatMoney(row.service_goal_amount,0) }}
                      </template>
                    </template>
                    <template v-else>-</template>
                  </td>
                  <td class="service-percent">
                    <template v-if="table_filter.include_service_view">
                      {{ formatPercent(row.service_percent) }}
                    </template>
                    <template v-else>-</template>
                  </td>

                  <td class="product-amount">
                    <template v-if="table_filter.include_product_view">
                      <template v-if="row.product_goal_amount > 0">
                        {{ formatMoney(row.product_achieved_amount,0) }}<br>/{{ formatMoney(row.product_goal_amount,0) }}
                      </template>
                    </template>
                    <template v-else>-</template>
                  </td>
                  <td class="product-percent">
                    <template v-if="table_filter.include_product_view">
                      {{ formatPercent(row.product_percent) }}
                    </template>
                    <template v-else>-</template>
                  </td>

                  <td class="prepaid-card-amount">
                    <template v-if="table_filter.include_prepaid_card_view">
                      <template v-if="row.prepaid_card_goal_amount > 0">
                        {{ formatMoney(row.prepaid_card_achieved_amount,0) }}<br>/{{ formatMoney(row.prepaid_card_goal_amount,0) }}
                      </template>
                    </template>
                    <template v-else>-</template>
                  </td>
                  <td class="prepaid-card-percent">
                    <template v-if="table_filter.include_prepaid_card_view">
                      {{ formatPercent(row.prepaid_card_percent) }}
                    </template>
                    <template v-else>-</template>
                  </td>

                  <td class="prepaid-service-amount">
                    <template v-if="table_filter.include_prepaid_service_view">
                      <template v-if="row.prepaid_service_goal_amount > 0">
                        {{ formatMoney(row.prepaid_service_achieved_amount,0) }}<br>/{{ formatMoney(row.prepaid_service_goal_amount,0) }}
                      </template>
                    </template>
                    <template v-else>-</template>
                  </td>
                  <td class="prepaid-service-percent">
                    <template v-if="table_filter.include_prepaid_service_view">
                      {{ formatPercent(row.prepaid_service_percent) }}
                    </template>
                    <template v-else>-</template>
                  </td>

                  <td class="total-amount">
                    <template v-if="row.all_goal_amount > 0">
                      {{ formatMoney(row.all_achieved_amount,0) }}<br>/{{ formatMoney(row.all_goal_amount,0) }}
                    </template>
                  </td>
                  <td class="total-percent">
                    {{ formatPercent(row.all_percent) }}
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { options } from '../../../helpers/options'
import { common_options } from '../../../helpers/options/common-options'
import { sales_options } from '../../../helpers/options/sales-options'
import component_base             from '../../../components/common/component-base/component-base'
import StaffGoalManamentApi       from '../../../api/staffs/staff-goal-management-api'
import StaffGoalManamentViewModel from '../../../view-model/staffs/payroll-setup-view-model'
import input_money_by_blur        from '../../../components/common/form/input/input-money/input-money-by-blur'
// import staff_cache                from '../../../helpers/cache/staff-cache'
import input_date_range_by_date_type from '../../../components/common/form/input/input-date-range-by-date-type/input-date-range-by-date-type'
import staff_mixin from '../../../helpers/mixins/staff-mixin'
import radio_group from '../../../components/common/form/radio/radio-group/radio-group'
import select_multi_sales_item_type from '../../../components/common/form/select/select-multi-sales-item-type/select-multi-sales-item-type'
import StaffGoalManagementViewModel from '../../../view-model/staffs/staff-goal-management-view-model'
import chart_legend from '../../../components/common/chart/chart-legend'
import chart_bar from '../../../components/common/chart/chart-bar'

import { convertDateToTimeStamp,
  formatMoney,
  guid
} from '../../../helpers/common'

export default {
  components: {
    'input-money-by-blur': input_money_by_blur,
    'input-date-range-by-date-type': input_date_range_by_date_type,
    'radio-group': radio_group,
    'select-multi-sales-item-type': select_multi_sales_item_type,
    'chart-legend': chart_legend,
    'chart-bar': chart_bar
  },
  extends : component_base,
  mixins: [staff_mixin],
  data(){
    return {
      options,

      staff_goal_management_api: new StaffGoalManamentApi(),
      staff_goal_management    : new StaffGoalManamentViewModel(),

      table_data: {
        rows      : [],
        rows_chart: [],
      },
      table_filter: {
        from_date_ts                : 0,
        to_date_ts                  : 0,
        staff_id                    : -1,
        prepaid_sales_counting_type : sales_options.prepaid_sales_counting_type.sold,
        exclude_point_deduction     : true,
        goal_calculation_type       : options.goal_calculation_type.daily_basis,
        include_service             : true,
        include_product             : true,
        include_prepaid_card        : true,
        include_prepaid_service     : true,
        shop_id                     : 0,
        
        // ui only
        date_type  : common_options.date_type.month,
        from_date  : {},
        to_date    : {},
        include_service_view        : true,
        include_product_view        : true,
        include_prepaid_card_view   : true,
        include_prepaid_service_view: true,
      },
      
      staff_options : [],
      item_types    : [],

      chart_key : '',
      chart_data: {
        labels: [],
        datasets: [],
      },
      chart_options: {},

      errors        : [],
    }
  },
  computed: {
    chart_has_data(){
      return this.table_data.rows_chart && this.table_data.rows_chart.length > 0
    },
    prepaid_sales_counting_type_options(){
      return [
        { value: sales_options.prepaid_sales_counting_type.sold, text: 'report.when-sold' },
        { value: sales_options.prepaid_sales_counting_type.used, text: 'report.when-used' },
      ]
    },
    goal_calculation_type_options(){
      return [
        { value: options.goal_calculation_type.daily_basis,   text: 'staff-goal.daily-basis' },
        { value: options.goal_calculation_type.monthly_basis, text: 'staff-goal.monthly-basis' },
      ]
    },
    items_options(){
      return [
        { value: sales_options.sales_goods_type.service,        text: this.$i18n.t('report.service') },
        { value: sales_options.sales_goods_type.product,        text: this.$i18n.t('report.product') },
        { value: sales_options.sales_goods_type.prepaid_card,   text: this.$i18n.t('report.prepaid-card') },
        { value: sales_options.sales_goods_type.prepaid_service,text: this.$i18n.t('report.prepaid-service') }
      ]
    },
    text_all(){ return this.$i18n.t('general.all') },
    text_total(){ return this.$i18n.t('general.total') },
    no_data_for_chart(){return this.$i18n.t('report.no_data_for_chart')},
    text_no_data_for_table(){return this.$i18n.t('general.no-data-for-table')},
    error_date_range_can_not_exceed_1_month(){return this.$i18n.t('report.error_date_range_can_not_exceed_1_month')},
    error_date_range_can_not_cross_months(){return this.$i18n.t('report.error_date_range_can_not_cross_months')},
  },
  created(){
    // chart options
    this.chart_options = {
      custom_stacked: true,
      custom_data: []
    }
  },
  async mounted(){
    this.table_filter.shop_id = this.shop_data.shop_id
    this.item_types = this.$refs.select_multi_sales_item_type.item_type_options

    await this.loadStaffItemsAsync()
    await this.loadTableDataAsync()
  },
  methods:{
    moment,
    formatMoney,

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
    onInputItemTypes(item_types, item_types_value){
      this.table_filter.include_service         = item_types_value.includes(options.sales_enum.goods_type.service)
      this.table_filter.include_product         = item_types_value.includes(options.sales_enum.goods_type.product)
      this.table_filter.include_prepaid_card    = item_types_value.includes(options.sales_enum.goods_type.prepaid_card)
      this.table_filter.include_prepaid_service = item_types_value.includes(options.sales_enum.goods_type.prepaid_service)
    },

    // table
    async loadTableDataAsync(){
      if(this.table_filter.date_type == common_options.date_type.date_range){
        let errors = [...this.$refs.input_date_range_by_date_type.errors]
        let tmp_to_date_limit    = moment(new Date(this.table_filter.from_date.value * 1000)).add(1, 'month').toDate()
        let tmp_to_date_limit_ts = convertDateToTimeStamp(tmp_to_date_limit) - 1
        let tmp_from_month = this.table_filter.from_date.text.getMonth()
        let tmp_to_month   = this.table_filter.to_date.text.getMonth()

        if(this.table_filter.to_date.value > tmp_to_date_limit_ts){
          errors.push(this.error_date_range_can_not_exceed_1_month)
        }
        if(tmp_from_month != tmp_to_month){
          errors.push(this.error_date_range_can_not_cross_months)
        }
        if(errors.length > 0){
          this.showAlert(errors)
          return
        }
      }
      if(this.$refs.select_multi_sales_item_type.errors.length > 0){
        this.showAlert(this.$refs.select_multi_sales_item_type.errors)
        return
      }

      this.preLoader()
      let response = await this.staff_goal_management_api.getStaffGoalManagementAsync(this.table_filter)
      this.preLoader(false)
      
      if(response.is_ok){
        // viewing
        this.table_filter.include_service_view        = this.table_filter.include_service
        this.table_filter.include_product_view        = this.table_filter.include_product
        this.table_filter.include_prepaid_card_view   = this.table_filter.include_prepaid_card
        this.table_filter.include_prepaid_service_view= this.table_filter.include_prepaid_service

        // table
        this.table_data.rows = _.cloneDeep(response.data)
        if(this.table_data.rows.length > 0){
          let tmp_staff_goal = new StaffGoalManagementViewModel()
          tmp_staff_goal.fields.staff_name                     = this.text_total
          tmp_staff_goal.fields.service_achieved_amount        = this.getColumnTotal('service_achieved_amount')
          tmp_staff_goal.fields.service_goal_amount            = this.getColumnTotal('service_goal_amount')
          tmp_staff_goal.fields.product_achieved_amount        = this.getColumnTotal('product_achieved_amount')
          tmp_staff_goal.fields.product_goal_amount            = this.getColumnTotal('product_goal_amount')
          tmp_staff_goal.fields.prepaid_card_achieved_amount   = this.getColumnTotal('prepaid_card_achieved_amount')
          tmp_staff_goal.fields.prepaid_card_goal_amount       = this.getColumnTotal('prepaid_card_goal_amount')
          tmp_staff_goal.fields.prepaid_service_achieved_amount= this.getColumnTotal('prepaid_service_achieved_amount')
          tmp_staff_goal.fields.prepaid_service_goal_amount    = this.getColumnTotal('prepaid_service_goal_amount')

          tmp_staff_goal.calAllAndPercent()
          this.table_data.rows.push(tmp_staff_goal.getFields())
        }

        // chart
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
      let tmp_dataset_achieved = {
        label: 'Achieved',
        color: 'green',
        data: [],
      }
      let tmp_dataset_remaining = {
        label: 'Remaining',
        color: '#dee2e6',
        data: [],
      }
      let tmp_custom_data = []

      // set data to labels & datasets
      for(let row of this.table_data.rows_chart){
        tmp_labels.push(row.staff_name)

        // chart-data
        tmp_dataset_achieved.data.push(row.all_achieved_amount)
        let tmp_remaining = row.all_goal_amount - row.all_achieved_amount
        if(tmp_remaining > 0){
          tmp_dataset_remaining.data.push(tmp_remaining)
        }
        else {
          tmp_dataset_remaining.data.push(0)
        }
        
        // chart-options.custom-data
        let tmp_percent = row.all_percent * 100
        let tmp_col_text = `${formatMoney(tmp_percent,1)}% / ${formatMoney(row.all_goal_amount,0)}`
        tmp_custom_data.push(tmp_col_text)
      }
      let tmp_datasets = []
      tmp_datasets.push(tmp_dataset_achieved)
      tmp_datasets.push(tmp_dataset_remaining)

      this.chart_data = {
        labels  : tmp_labels,
        datasets: tmp_datasets,
      }
      this.chart_options.custom_data = tmp_custom_data
      this.chart_key = guid()
    },
    onSearch(){
      this.loadTableDataAsync()
    },

    // format
    formatPercent(percent){
      let tmp = ''
      if(percent > 0){
        tmp = `${formatMoney(percent * 100,1)}%`
      }
      return tmp
    },
    formatName(staff_name){
      let tmp_name = staff_name
      if(staff_name == 'TOTAL') tmp_name = this.text_total
      return tmp_name
    },
  }
}
</script>

<style lang="scss">
@import './staff-goal-management.scss';
</style>