<template>
  <main class="app-content">
    <section class="content sales-by-item-page">
      <sales-total-header/>

      <div class="filter-wrapper">
        <div class="row">
          <div class="col-12 col-md-10 filter">
            <div class="row">
              <div class="col-12">
                <input-date-range-by-date-type ref="input_date_range_by_date_type" v-model="table_filter"/>
              </div>
              <div class="col-12">
                <div class="select-box sales-item">
                  <label>{{ $t('report.sales-item') }}</label>
                  <b-form-select v-model="table_filter.sales_item_type"
                                 :options="sales_item_type_options"/>
                </div>
                <div class="select-box staff">
                  <label>{{ $t('general.staff') }}</label>
                  <b-form-select v-model="table_filter.staff_id"
                                 :options="staff_options" value-field="id" text-field="aliasname"/>
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
      
      <div class="table-wrapper">
        <div class="row">
          <div class="table-sales-total col-12">
            <h3 class="table-title">{{ text_sales_item_by }}</h3>
            <div v-if="is_view_service || is_view_prepaid_service" class="display-by-type">
              <label>{{ $t('report.display-by') }}</label>
              <radio-group v-model="table_filter.display_by_type" :options="display_by_type_options" @input="onInputDisplayByType"/>
            </div>
            <div class="table-sales-by-item">
              <table v-if="is_view_service" class="table">
                <thead>
                  <tr>
                    <th rowspan="2" width="15%">{{ $t('report.category') }}</th>
                    <th v-if="can_display_by_service" rowspan="2" width="15%">{{ $t('report.service') }}</th>
                    <th colspan="2" width="17%">{{ $t('sales.sales') }}</th>
                    <th colspan="2" width="17%">{{ $t('sales.balance-deduction') }}</th>
                    <th colspan="2" width="17%">{{ $t('report.service-deduction') }}</th>
                    <th colspan="2" width="17%">{{ $t('general.total') }}</th>
                    <th rowspan="2" width="9%" >{{ $t('report.average-unit-price') }}</th>
                    <th rowspan="2" width="8%" >{{ $t('report.points-deduction') }}</th>
                  </tr>
                  <tr>
                    <th>{{ $t('general.qty') }}</th>
                    <th>{{ $t('sales.amount') }}</th>
                    <th>{{ $t('general.qty') }}</th>
                    <th>{{ $t('sales.amount') }}</th>
                    <th>{{ $t('general.qty') }}</th>
                    <th>{{ $t('sales.amount') }}</th>
                    <th>{{ $t('general.qty') }}</th>
                    <th>{{ $t('sales.amount') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,i) in table_rows" :key="i">
                    <td class="category-name">{{ formatName(item.fields.category_name) }}</td>
                    <td v-if="can_display_by_service" class="service-name">{{ item.fields.service_name }}</td>
                    <td class="sales-quantity">
                      <span v-if="!isZeroBoth(item.fields.sales.quantity, item.fields.refund.quantity)">
                        {{ formatNumber(item.fields.sales.quantity) }}<br>
                        <span v-if="!isZero(item.fields.refund.quantity)">({{ formatNumber(item.fields.refund.quantity) }})</span>
                      </span>
                    </td>
                    <td class="sales-amount">
                      <span v-if="!isZeroBoth(item.fields.sales.amount, item.fields.refund.amount)">
                        {{ formatNumber(item.fields.sales.amount) }}<br>
                        <span v-if="!isZero(item.fields.refund.amount)">({{ formatNumber(item.fields.refund.amount) }})</span>
                      </span>
                    </td>
                    <td class="balance-deduction-quantity">
                      {{ formatNumber(item.fields.balance_deduction.quantity,0) }}
                    </td>
                    <td class="balance-deduction-amount">
                      {{ formatNumber(item.fields.balance_deduction.amount,0) }}
                    </td>
                    <td class="service-deduction-quantity">
                      {{ formatNumber(item.fields.service_deduction.quantity,0) }}
                    </td>
                    <td class="service-deduction-amount">
                      {{ formatNumber(item.fields.service_deduction.amount,0) }}
                    </td>
                    <td class="total-quantity">
                      <span v-if="!isZero(item.fields.total.quantity)">
                        {{ formatNumber(item.fields.total.quantity) }}<br>
                        <!-- <span v-if="!isZero(item.fields.refund.quantity)">({{ formatNumber(item.fields.refund.quantity) }})</span> -->
                      </span>
                    </td>
                    <td class="total-amount">
                      <span v-if="!isZero(item.fields.total.amount)">
                        {{ formatNumber(item.fields.total.amount) }}<br>
                        <!-- <span v-if="!isZero(item.fields.refund.amount)">({{ formatNumber(item.fields.refund.amount) }})</span> -->
                      </span>
                    </td>
                    <td class="average-unit-price">
                      {{ formatNumber(item.fields.average_unit_price) }}
                    </td>
                    <td class="points-deduction">
                      {{ formatNumber(item.fields.points_deduction) }}
                    </td>
                  </tr>
                </tbody>
              </table>

              <table v-if="is_view_product" class="table">
                <thead>
                  <tr>
                    <th>{{ $t('products.product-code') }}</th>
                    <th>{{ $t('products.product-name') }}</th>
                    <th>{{ $t('report.sales-quantity') }}</th>
                    <th>{{ $t('report.sales-total') }}</th>
                    <th>{{ $t('products.supplier-price') }}</th>
                    <th>{{ $t('report.purchase-total') }}</th>
                    <th>{{ $t('report.sales-profit') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,i) in table_rows" :key="i">
                    <td class="product-code">{{ item.fields.product_code }}</td>
                    <td class="product-name">{{ formatName(item.fields.product_name) }}</td>
                    <td class="sales-quantity">
                      <span v-if="!isZeroBoth(item.fields.total.quantity, item.fields.refund.quantity)">
                        {{ formatNumber(item.fields.total.quantity) }}<br>
                        <span v-if="!isZero(item.fields.refund.quantity)">({{ formatNumber(item.fields.refund.quantity) }})</span>
                      </span>
                    </td>
                    <td class="sales-total">
                      <span v-if="!isZeroBoth(item.fields.total.amount, item.fields.refund.amount)">
                        {{ formatNumber(item.fields.total.amount) }}<br>
                        <span v-if="!isZero(item.fields.refund.amount)">({{ formatNumber(item.fields.refund.amount) }})</span>
                      </span>
                    </td>
                    <td class="supplier-price">{{ formatNumber(item.fields.supplier_price) }}</td>
                    <td class="purchase-total">{{ formatNumber(item.fields.purchase_amount) }}</td>
                    <td class="sales-profit">{{ formatNumber(item.fields.sales_profit) }}</td>
                  </tr>
                </tbody>
              </table>

              <table v-if="is_view_prepaid_card" class="table">
                <thead>
                  <tr>
                    <th>{{ $t('report.prepaid-card') }}</th>
                    <th>{{ $t('report.sales-qty') }}</th>
                    <th>{{ $t('report.sales-amount') }}</th>
                    <th>{{ $t('sales.refund') }}</th>
                    <th>{{ $t('general.total') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,i) in table_rows" :key="i">
                    <td class="prepaid-card">{{ formatName(item.fields.prepaid_card_name) }}</td>
                    <td class="sales-quantity">{{ formatNumber(item.fields.sales.quantity) }}</td>
                    <td class="sales-amount">{{ formatNumber(item.fields.sales.amount) }}</td>
                    <td class="refund">{{ formatNumber(item.fields.refund.amount) }}</td>
                    <td class="total">{{ formatNumber(item.fields.total) }}</td>
                  </tr>
                </tbody>
              </table>

              <table v-if="is_view_prepaid_service" class="table">
                <thead>
                  <tr>
                    <th rowspan="2">{{ $t('report.category') }}</th>
                    <th v-if="can_display_by_service" rowspan="2">{{ $t('report.prepaid-service') }}</th>
                    <th colspan="2">{{ $t('sales.sales') }}</th>
                    <th colspan="2">{{ $t('report.service-deduction') }}</th>
                    <th rowspan="2">{{ $t('report.points-deduction') }}</th>
                  </tr>
                  <tr>
                    <th>{{ $t('general.qty') }}</th>
                    <th>{{ $t('general.amount') }}</th>
                    <th>{{ $t('general.qty') }}</th>
                    <th>{{ $t('general.amount') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,i) in table_rows" :key="i">
                    <td class="category">{{ formatName(item.fields.category_name) }}</td>
                    <td v-if="can_display_by_service" class="prepaid-service">{{ item.fields.prepaid_service_name }}</td>
                    <td class="sales-quantity">{{ formatNumber(item.fields.sales.quantity) }}</td>
                    <td class="sales-amount">{{ formatNumber(item.fields.sales.amount) }}</td>
                    <td class="service-deduction-quantity">
                      <span v-if="!isZeroBoth(item.fields.service_deduction.quantity, item.fields.service_deduction_refund.quantity)">
                        {{ formatNumber(item.fields.service_deduction.quantity) }}<br>
                        <span v-if="!isZero(item.fields.service_deduction_refund.quantity)">({{ formatNumber(item.fields.service_deduction_refund.quantity) }})</span>
                      </span>
                    </td>
                    <td class="service-deduction-amount">
                      <span v-if="!isZeroBoth(item.fields.service_deduction.amount, item.fields.service_deduction_refund.amount)">
                        {{ formatNumber(item.fields.service_deduction.amount) }}<br>
                        <span v-if="!isZero(item.fields.service_deduction_refund.amount)">({{ formatNumber(item.fields.service_deduction_refund.amount) }})</span>
                      </span>
                    </td>
                    <td class="points-deduction">{{ formatNumber(item.fields.points_deduction) }}</td>
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
const ALL_STAFF        = -1
const NOT_SELECT_STAFF = 0
const DISPLAY_BY_CATEGORY = 1
const DISPLAY_BY_SERVICE  = 2
import moment from 'moment'
import { DatePicker }                from 'v-calendar'
import component_base                from '../../../components/common/component-base/component-base.vue'
import input_date_range_by_date_type from '../../../components/common/form/input/input-date-range-by-date-type/input-date-range-by-date-type.vue'
import staff_mixin                   from '../../../helpers/mixins/staff-mixin.js'
import ReportApi                     from '../../../api/sales/report-api'
import sales_total_header            from '../../../pages/sales/sales-total/sales-total-header'
import radio_group                   from '../../../components/common/form/radio/radio-group/radio-group'
import { sales_options }             from '../../../helpers/options/sales-options.js'
import { common_options }            from '../../../helpers/options/common-options.js'
import { formatMoney,
  convertDateToTimeStamp,
  getTypeNameOfArray }               from '../../../helpers/common'
export default {
  components : {
    'sales-total-header': sales_total_header,
    'v-date-picker' : DatePicker,
    'input-date-range-by-date-type' : input_date_range_by_date_type,
    'radio-group': radio_group
  },
  extends : component_base,
  mixins  : [staff_mixin],
  data(){
    return {
      ALL_STAFF,
      NOT_SELECT_STAFF,
      sales_options,

      report_api    : new ReportApi(),

      table_filter : {
        from_date_ts    : 0,
        to_date_ts      : 0,
        sales_item_type : sales_options.sales_goods_type.service,
        display_by_type : DISPLAY_BY_CATEGORY,
        staff_id        : ALL_STAFF,
        shop_id         : 0,

        // ui only
        date_type  : common_options.date_type.month,
        from_date  : {},
        to_date    : {},
      },
      table_rows    : [],

      sales_item_type_view: sales_options.sales_goods_type.service,
      staff_options : [],
    }
  },
  computed:{
    sales_item_type_options(){
      return [
        { value: sales_options.sales_goods_type.service,        text: this.$i18n.t('report.service') },
        { value: sales_options.sales_goods_type.product,        text: this.$i18n.t('report.product') },
        { value: sales_options.sales_goods_type.prepaid_card,   text: this.$i18n.t('report.prepaid-card') },
        { value: sales_options.sales_goods_type.prepaid_service,text: this.$i18n.t('report.prepaid-service') }
      ]
    },
    display_by_type_options(){
      return [
        { value: DISPLAY_BY_CATEGORY, text: 'report.category' },
        { value: DISPLAY_BY_SERVICE,  text: 'report.service' },
      ]
    },
    text_sales_item_by(){
      let tmp_txt = ''
      if(this.is_view_service)
        tmp_txt = this.$i18n.t('report.sales-by-service')
      if(this.is_view_product)
        tmp_txt = this.$i18n.t('report.sales-by-product')
      if(this.is_view_prepaid_card)
        tmp_txt = this.$i18n.t('report.sales-by-prepaid-card')
      if(this.is_view_prepaid_service)
        tmp_txt = this.$i18n.t('report.sales-by-prepaid-service')
      return tmp_txt
    },
    is_view_service(){
      return this.sales_item_type_view == sales_options.sales_goods_type.service
    },
    is_view_product(){
      return this.sales_item_type_view == sales_options.sales_goods_type.product
    },
    is_view_prepaid_card(){
      return this.sales_item_type_view == sales_options.sales_goods_type.prepaid_card
    },
    is_view_prepaid_service(){
      return this.sales_item_type_view == sales_options.sales_goods_type.prepaid_service
    },
    is_display_by_category(){
      return this.table_filter.display_by_type == DISPLAY_BY_CATEGORY
    },
    is_display_by_service(){
      return this.table_filter.display_by_type == DISPLAY_BY_SERVICE
    },
    can_display_by_service(){
      return (this.is_view_service || this.is_view_prepaid_service) && this.is_display_by_service
    },
    text_no_category(){return this.$i18n.t('report.no-category')},
    text_outstanding(){return this.$i18n.t('sales.outstanding')},
    text_total(){return this.$i18n.t('general.total')},
    text_all(){ return this.$i18n.t('general.all') },
    text_not_select(){ return this.$i18n.t('sales.not-select') },
    error_date_range_can_not_exceed_1_year(){return this.$i18n.t('report.error_date_range_can_not_exceed_1_year')},
  },
  async mounted() {
    this.table_filter.shop_id = this.shop_data.shop_id

    await this.loadStaffItemsAsync()
    await this.loadTableDataAsync()
  },
  methods:{
    formatMoney,
    getTypeNameOfArray,

    // filter
    async loadStaffItemsAsync(){
      let tmp_all_option        = { id: ALL_STAFF,        aliasname: this.text_all }
      let tmp_not_select_option = { id: NOT_SELECT_STAFF, aliasname: this.text_not_select }
      let response = await this.getStaffsAsyncMixin()
      if(response.is_ok){
        this.staff_options = [tmp_all_option , ...response.data.items, tmp_not_select_option]
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
      let response = await this.report_api.getSalesTotalByItemReportAsync(this.table_filter)
      this.preLoader(false)

      if(response.is_ok){
        this.table_rows = response.data
        this.sales_item_type_view = this.table_filter.sales_item_type
      }
      else
        this.showAlert(response.error_messages)
    },
    async onSearch(){
      await this.loadTableDataAsync()
    },
    async onInputDisplayByType(){
      await this.loadTableDataAsync()
    },
    
    // format
    isZero(number){
      return number == 0
    },
    isZeroBoth(number1, number2){
      return number1 == 0 && number2 == 0
    },
    formatName(name){
      let tmp = name
      if(tmp == 'NONE')
        tmp = this.text_no_category
      if(tmp == 'TOTAL')
        tmp = this.text_total
      return tmp
    },
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
@import './sales-by-item.scss';
</style>