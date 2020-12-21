<template>
  <main class="app-content">
    <section class="content service-sales-by-sales-type-page">
      <div class="page-title">
        <h3>{{ $t('report.service-sales-by-sales-type') }}</h3>
        <ul class="group-btn">
          <li class="btn"><a>{{ $t('general.print') }}</a></li>
        </ul>
      </div>

      <div class="filter-wrapper">
        <div class="row">
          <div class="col-12 col-xl-10">
            <div class="row">
              <div class="col-12 form-group input-month-range">
                <input-date-range-by-date-type ref="input_date_range_by_date_type" v-model="table_filter"/>
              </div>
              <div class="col-12">
                <div class="select-filter">
                  <div class="select-box staff">
                    <label>{{ $t('general.staff') }}</label>
                    <b-form-select v-model="table_filter.staff_id"
                                   :options="staff_options"
                                   value-field="id"
                                   text-field="aliasname"
                                   @mouseleave.native="onMouseLeaveSelect">
                      <template v-slot:first>
                        <option :value="-1">{{ $t('general.all') }}</option>
                      </template>
                    </b-form-select>
                  </div>
                  <div class="select-box category">
                    <label>{{ $t('products.category') }}</label>
                    <b-form-select v-model="table_filter.category_id" 
                                   :options="category_options" 
                                   value-field="id" 
                                   text-field="name"
                                   @change="onChangeCategoryService"
                                   @mouseleave.native="onMouseLeaveSelect">
                      <template v-slot:first>
                        <option :value="-1">{{ $t('general.all') }}</option>
                      </template>
                    </b-form-select>
                  </div>
                  <div class="select-box service">
                    <label>{{ $t('report.service') }}</label>
                    <b-form-select v-model="table_filter.service_id" 
                                   :options="service_options" 
                                   value-field="id" 
                                   text-field="name"
                                   @mouseleave.native="onMouseLeaveSelect">
                      <template v-slot:first>
                        <option :value="-1">{{ $t('general.all') }}</option>
                      </template>
                    </b-form-select>
                  </div>
                  <div class="select-box prepaid-sales-counting">
                    <label>{{ $t('report.prepaid-sales-counting') }}</label>
                    <radio-group v-model="table_filter.prepaid_sales_counting_type" :options="prepaid_sales_counting_type_options"/>
                  </div>
                  <div class="select-box exclude-points-deduction">
                    <b-form-checkbox v-model="table_filter.exclude_points_deduction" :value="true">{{ $t('report.exclude-points-deduction') }}</b-form-checkbox>
                  </div>
                </div>
              </div>
              <div class="col-12"/>
            </div>
          </div>
          <div class="col-12 col-xl-2">
            <div class="filter-search">
              <button class="btn btn-search" @click.prevent="onSearch"><i class="btn-search-white"/> <span>{{ $t('general.search') }}</span></button>
            </div>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
          <div class="wrapper">
            <div class="table-wrapper">
              <table>
                <thead>
                  <th><div>{{ $t('report.staff') }}</div></th>
                  <th><div>{{ $t('report.no-input') }}</div></th>
                  <th v-for="(sales_type,i) in sales_type_options" :key="i"><div>{{ sales_type.name }}</div></th>
                  <th><div>{{ $t('general.total') }}</div></th>
                </thead>
                <tbody>
                  <tr v-for="(row, i) in table_data.rows" :key="i">
                    <th><div class="staff-name">{{ row.staff.staff_name }}</div></th>
                    <td v-for="(sales_type, k) of row.sales_types" :key="k" :class="{ 'has-data': sales_type.has_data }">
                      <span v-if="sales_type.has_data" class="quantity">{{ formatMoney(sales_type.quantity,0) }}<br></span>
                      <span v-if="sales_type.has_data" class="amount">{{ formatMoney(sales_type.amount,0) }}</span>
                    </td>
                    <td class="has-data" v-html="getTotalRow(row)"/>
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
import _ from 'lodash'
import moment                        from 'moment'
import staff_mixin                   from '../../../helpers/mixins/staff-mixin'
import service_mixin                 from '../../../helpers/mixins/service-mixin'
import sales_type_mixin              from '../../../helpers/mixins/sales-type-mixin'
import radio_group                   from '../../../components/common/form/radio/radio-group/radio-group'
import view_table                    from '../../../components/common/view-table/view-table'
import chart_line                    from '../../../components/common/chart/chart-line'
import chart_bar                     from '../../../components/common/chart/chart-bar'
import ReportApi                     from '../../../api/sales/report-api'
import component_base                from '../../../components/common/component-base/component-base'
import input_date_range_by_date_type from '../../../components/common/form/input/input-date-range-by-date-type/input-date-range-by-date-type.vue'
import { options }                   from '../../../helpers/options'
import { common_options }            from '../../../helpers/options/common-options'
import { sales_options }             from '../../../helpers/options/sales-options'
import { 
  formatMoney, 
  convertTimeStampToDate,
  convertDateToTimeStamp
}                                    from '../../../helpers/common'

export default {
  components: {
    'input-date-range-by-date-type': input_date_range_by_date_type,
    'radio-group'             : radio_group,
    'view-table'              : view_table,
    'chart-line'              : chart_line,
    'chart-bar'               : chart_bar
  },
  extends : component_base,
  mixins  : [staff_mixin,service_mixin,sales_type_mixin],
  data(){
    return {
      options,
      common_options,

      report_api: new ReportApi(),
      
      table_data   : {
        fields : [],
        rows   : [],
        pagination : { total_pages: 1 },
        options : { 
          pagination: false,
        }
      },
      table_filter: {
        from_date_ts               : 0,
        to_date_ts                 : 0,
        category_id                : -1,
        service_id                 : -1,
        staff_id                   : -1,
        prepaid_sales_counting_type: sales_options.prepaid_sales_counting_type.sold,
        exclude_points_deduction   : false,
        sales_type_ids             : [],
        shop_id                    : 0,
        
        // ui only
        date_type                  : common_options.date_type.month,
        from_date                  : {},
        to_date                    : {},
      },

      staff_options     : [],
      category_options  : [],
      service_options   : [],
      sales_type_options: [],
      sales_type_all    : [],

      chart_view: options.chart_type.line,
      chart_key : '',
      chart_data: {
        labels  : [],
        datasets: [],
      },
    }
  },
  computed:{
    prepaid_sales_counting_type_options(){
      return [
        { value: sales_options.prepaid_sales_counting_type.sold, text: 'report.when-sold' },
        { value: sales_options.prepaid_sales_counting_type.used, text: 'report.when-used' },
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
    no_input_text(){return this.$i18n.t('report.no-input')},
    text_average(){return this.$i18n.t('report.average')},
    text_total(){ return this.$i18n.t('general.total') },
    end_date_can_not_before_start_date(){return this.$i18n.t('input-date-range.end-date-can-not-before-start-date')},
    error_date_range_can_not_exceed_1_year(){return this.$i18n.t('report.error_date_range_can_not_exceed_1_year')},
  },
  async mounted() {
    this.table_filter.shop_id = this.shop_data.shop_id

    await this.loadStaffItemsAsync()
    await this.loadServiceCategoriesAsync()
    await this.loadServicesByCategoryAsync(this.table_filter.category_id)
    await this.loadSalesTypesAsync()
    await this.loadTableDataAsync()
  },
  methods: {
    moment,
    formatMoney,
    convertTimeStampToDate,

    // // filter
    async loadStaffItemsAsync(){
      let result = await this.getStaffsAsyncMixin()
      if(result.is_ok){
        this.staff_options = result.data.items
      }
      else 
        this.showAlert(result.error_messages)
    },
    async loadServiceCategoriesAsync(){
      let result_categorys = await this.loadServiceCategorysAsync()
      if(result_categorys.is_ok) {
        this.category_options = result_categorys.data.items
      }
      else
        this.showAlert(result_categorys.error_messages)
    },
    async onChangeCategoryService(category_id){
      this.table_filter.service_id = -1
      await this.loadServicesByCategoryAsync(category_id)
    },
    async loadServicesByCategoryAsync(category_id){
      let tmp_category_id = category_id == -1 ? 0 : category_id

      this.preLoader()
      let result_services = await this.loadServicesAsync(tmp_category_id, 1)
      this.preLoader(false)

      if(result_services.is_ok){
        this.service_options = result_services.data.items
      }
      else{
        this.showAlert(result_services.error_messages)
      }
    },
    async loadSalesTypesAsync(){
      let response = await this.getSalesTypesAsyncMixin()
      if(response.is_ok){
        this.sales_type_options = response.data.items
        this.table_filter.sales_type_ids = this.sales_type_options.map(o => o.id)
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
      let response = await this.report_api.getServiceSalesBySalesTypeReportAsync(this.table_filter)
      this.preLoader(false)

      if(response.is_ok){
        let tmp_rows = []
        for(let item of response.data){
          // staff
          let tmp_row = item
          if(tmp_row.staff.staff_id == 0){
            tmp_row.staff.staff_name = this.no_input_text
          }
          
          // no-input
          let tmp_sales_type_no_input = {
            sales_type_id: 0,
            quantity     : 0,
            amount       : 0,
            order_no     : 0,
            id           : 0
          }
          let tmp_no_input = tmp_row.sales_types.filter(st => st.sales_type_id == 0)
          if(tmp_no_input.length == 0){
            tmp_row.sales_types.push(tmp_sales_type_no_input)
          }

          // sales-types empty
          let tmp_existing_sales_type_ids = item.sales_types.map(st => st.sales_type_id)
          this.sales_type_all = [tmp_sales_type_no_input, ...this.sales_type_options]
          for(let sales_type of this.sales_type_all){
            if(tmp_existing_sales_type_ids.includes(sales_type.id)){
              let tmp_existing_sales_type = item.sales_types.filter(st => st.sales_type_id == sales_type.id)
              if(tmp_existing_sales_type.length > 0){
                tmp_existing_sales_type[0].order_no = sales_type.order_no
                if(tmp_existing_sales_type[0].quantity != 0 || tmp_existing_sales_type[0].amount != 0)
                  tmp_existing_sales_type[0].has_data = true
              }
            }
            else {
              tmp_row.sales_types.push({
                sales_type_id: sales_type.id,
                quantity     : 0,
                amount       : 0,
                order_no     : sales_type.order_no
              })
            }
          }
          tmp_row.sales_types = _.sortBy(tmp_row.sales_types, ['order_no'])
          tmp_rows.push(tmp_row)
        }
        this.table_data.rows = tmp_rows
        if(this.table_data.rows.length > 0){
          let total_row = {
            staff: {
              staff_id  : -1,
              staff_name: this.text_total,
            },
            sales_types: []
          }
          let sales_type_total_cols = []
          for(let i in this.sales_type_all){
            let sales_type = this.sales_type_all[i]
            sales_type_total_cols.push(this.getColumnTotal(i, sales_type))
          }
          total_row.sales_types = sales_type_total_cols
          this.table_data.rows.push(total_row)
        }
      }
      else{
        this.showAlert(response.error_messages)
      }
    },
    getColumnTotal(i, sales_type){
      let sales_type_total_col = {
        sales_type_id: sales_type.id,
        quantity     : 0,
        amount       : 0,
        order_no     : sales_type.order_no,
        has_data     : false
      }
      let tmp_col_total_quantity = 0
      let tmp_col_total_amount   = 0
      for(let row of this.table_data.rows) {
        tmp_col_total_quantity += row.sales_types[i].quantity
        tmp_col_total_amount   += row.sales_types[i].amount
      }

      sales_type_total_col.quantity = tmp_col_total_quantity
      sales_type_total_col.amount   = tmp_col_total_amount
      if(tmp_col_total_quantity || tmp_col_total_amount)
        sales_type_total_col.has_data = true
      
      return sales_type_total_col
    },
    onSearch(){
      this.loadTableDataAsync()
    },

    getTotalRow(row){
      let tmp_txt = ''
      let tmp_total_quantity = _.sumBy(row.sales_types, 'quantity')
      let tmp_total_amount   = _.sumBy(row.sales_types, 'amount')
      if(tmp_total_quantity != 0 || tmp_total_amount != 0){
        tmp_txt = `<span class="quantity">${formatMoney(tmp_total_quantity,0)}<br>
                   </span><span>${formatMoney(tmp_total_amount,0)}</span>`
      }
      return tmp_txt
    }
  }
}
</script>

<style lang="scss">
@import './report-service-sales-by-sales-type.scss';
</style>