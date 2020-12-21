<template>
  <main class="app-content">
    <section class="content sales-total-page">
      <sales-total-header/>

      <div class="filter-wrapper">
        <div class="row">
          <div class="col-12 col-lg-10">
            <div class="filter">
              <input-date-range-by-date-type ref="input_date_range_by_date_type" v-model="table_filter"/>
              <div class="select-box staff">
                <label>{{ $t('general.staff') }}</label>
                <b-form-select 
                  v-model="table_filter.staff_id"
                  :options="staff_options" value-field="id" text-field="aliasname"/>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-2">
            <div class="filter-search">
              <button class="btn btn-search" @click.prevent="onSearch"><i class="btn-search-white"/> <span>{{ $t('general.search') }}</span></button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="table-wrapper">
        <div class="row">
          <div :class="{ 'col-lg-6': !show_detail_sales_total, 'col-lg-12': show_detail_sales_total }" class="table-sales-total col-12">
            <h3 class="table-title">
              {{ $t('report.sales-total') }}
              <span class="float-right">
                <input v-model="show_detail_sales_total" type="checkbox"> Detail
              </span> 
            </h3>
            <table v-if="!show_detail_sales_total" class="table table-sales-total">
              <thead>
                <tr>
                  <th width="20%">{{ $t('report.sales-item') }}</th>
                  <th width="25%">{{ $t('general.qty') }}</th>
                  <th width="55%">{{ $t('sales.amount') }}</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="sales_total.length == 0">
                  <tr>
                    <td colspan="3" class="table-no-data">{{ text_no_data_for_table }}</td>
                  </tr>
                </template>
                <template v-else>
                  <tr v-for="(item,index) in sales_total" :key="index">
                    <td :class="{'font-weight-bold': isNetSalesTotal(item)}">
                      {{ formatSalesTotalItemName(item.fields.sales_item) }}
                    </td>
                    <td>
                      <span v-if="!isZeroBoth(item.fields.sales.quantity, item.fields.refund.quantity) && !isSalesItemRefund(item) && !isNetSalesTotal(item)">
                        {{ !isNetSalesTotal(item) ? formatMoney(item.fields.sales.quantity,0) : '-' }}
                      </span>
                      <span v-else-if="!isZero(item.fields.refund.quantity) && isSalesItemRefund(item)">
                        {{ formatMoney(-item.fields.refund.quantity,0) }}
                      </span>
                    </td>
                    <td>
                      <span v-if="!isZeroBoth(item.fields.sales.amount, item.fields.refund.amount) && !isSalesItemRefund(item)" :class="{'font-weight-bold': isNetSalesTotal(item)}">
                        {{ formatMoney(item.fields.sales.amount,0) }}
                      </span>
                      <span v-else-if="!isZero(item.fields.refund.amount) && isSalesItemRefund(item)">
                        {{ formatMoney(-item.fields.refund.amount,0) }}
                      </span>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
            <div v-if="show_detail_sales_total" class="table-responsive">
              <table class="table-detail-sales-total">
                <thead>
                  <tr>
                    <th rowspan="2" width="20%">{{ $t('general.type') }}</th>
                    <th v-for="(item, index) in detail_sales_total_th" :key="index" colspan="2">
                      {{ formatSalesTotalItemName(item.fields.sales_item) }}
                    </th>
                  </tr>
                  <tr>
                    <template v-for="(item, index) in detail_sales_total_th">
                      <th :key="'qty' + index">{{ $t('general.qty') }}</th>
                      <th :key="'amount' + index">{{ $t('general.amount') }}</th>
                    </template>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="(item, index) in detail_sales_total">
                    <tr 
                      :key="index" 
                      :class="{
                        'bg-gray-light': item.name == 'net-sales-total' || item.name == 'deduction-total' || item.name == 'grand-total', 
                        'font-weight-bold': item.name == 'grand-total'
                    }">
                      <td>{{ $t(`sales.${item.name}`) }}</td>
                      <td :class="{'td-empty' : isZero(item.fields.service.quantity)}">
                        {{ displayDataDetailSalesTotal(item.fields.service.quantity) }}
                      </td>
                      <td :class="{'td-empty' : isZero(item.fields.service.amount)}">
                        {{ displayDataDetailSalesTotal(item.fields.service.amount) }}
                      </td>
                      <td :class="{'td-empty' : isZero(item.fields.product.quantity)}">
                        {{ displayDataDetailSalesTotal(item.fields.product.quantity) }}
                      </td>
                      <td :class="{'td-empty' : isZero(item.fields.product.amount)}">
                        {{ displayDataDetailSalesTotal(item.fields.product.amount) }}
                      </td>
                      <td :class="{'td-empty' : isZero(item.fields.prepaid_card.quantity)}">
                        {{ displayDataDetailSalesTotal(item.fields.prepaid_card.quantity) }}
                      </td>
                      <td :class="{'td-empty' : isZero(item.fields.prepaid_card.amount)}">
                        {{ displayDataDetailSalesTotal(item.fields.prepaid_card.amount) }}
                      </td>
                      <td :class="{'td-empty' : isZero(item.fields.prepaid_service.quantity)}">
                        {{ displayDataDetailSalesTotal(item.fields.prepaid_service.quantity) }}
                      </td>
                      <td :class="{'td-empty' : isZero(item.fields.prepaid_service.amount)}">
                        {{ displayDataDetailSalesTotal(item.fields.prepaid_service.amount) }}
                      </td>
                      <td :class="{'td-empty' : isZero(item.fields.total.quantity)}">
                        {{ displayDataDetailSalesTotal(item.fields.total.quantity) }}
                      </td>
                      <td :class="{'td-empty' : isZero(item.fields.total.amount)}">
                        {{ displayDataDetailSalesTotal(item.fields.total.amount) }}
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>

          <div class="table-payment-total col-12 col-lg-6">
            <h3 class="table-title">{{ $t('report.payment-total') }}</h3>
            <table class="table">
              <thead>
                <tr>
                  <th width="20%">{{ $t('general.type') }}</th>
                  <th width="25%">{{ $t('report.sales-refund') }}</th>
                  <th width="25%">{{ $t('sales.outstanding') }}</th>
                  <th width="30%">{{ $t('general.total') }}</th>
                </tr>
              </thead>
              <tbody>
                <template v-if="payment_total.length == 0">
                  <tr>
                    <td colspan="4" class="table-no-data">{{ text_no_data_for_table }}</td>
                  </tr>
                </template>
                <template v-else>
                  <tr v-for="(item,index) in payment_total" :key="index">
                    <td>{{ formatName(item.fields.payment_method_name) }}</td>
                    <td>
                      <span v-if="!isZeroBoth(item.fields.sales_amount, item.fields.refund_amount)">
                        {{ formatMoney(item.fields.sales_amount,0) }}<br>
                        <span v-if="!isZero(item.fields.refund_amount)">({{ formatMoney(item.fields.refund_amount,0) }})</span>
                      </span>
                    </td>
                    <td>
                      <span v-if="!isZero(item.fields.outstanding)">{{ formatMoney(item.fields.outstanding,0) }}</span>
                    </td>
                    <td>
                      <span v-if="!isZeroBoth(item.fields.total, item.fields.refund_amount)">
                        {{ formatMoney(item.fields.total,0) }}<br>
                        <span v-if="!isZero(item.fields.refund_amount)">({{ formatMoney(item.fields.refund_amount,0) }})</span>
                      </span>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>

        <div class="sales-total-intro">
          <ul>
            <li>{{ $t('report.sales-total-intro-1') }}</li>
            <li>{{ $t('report.sales-total-intro-2') }}</li>
            <li>{{ $t('report.sales-total-intro-3') }}</li>
          </ul>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
const ALL_STAFF        = -1
const NOT_SELECT_STAFF = 0
import moment from 'moment'
import { DatePicker }                from 'v-calendar'
import component_base                from '../../../components/common/component-base/component-base.vue'
import input_date_range_by_date_type from '../../../components/common/form/input/input-date-range-by-date-type/input-date-range-by-date-type.vue'
import staff_mixin                   from '../../../helpers/mixins/staff-mixin.js'
import ReportApi                     from '../../../api/sales/report-api'
import sales_total_header            from '../../../pages/sales/sales-total/sales-total-header'
import { sales_options }             from '../../../helpers/options/sales-options.js'
import { common_options }            from '../../../helpers/options/common-options.js'
import { formatMoney,
  convertDateToTimeStamp,
  getTypeNameOfArray }               from '../../../helpers/common'


export default {
  components : {
    'sales-total-header': sales_total_header,
    'v-date-picker' : DatePicker,
    'input-date-range-by-date-type' : input_date_range_by_date_type
  },
  extends : component_base,
  mixins  : [staff_mixin],
  data(){
    return {
      ALL_STAFF,
      NOT_SELECT_STAFF,
      sales_options,

      table_filter : {
        from_date_ts  : 0,
        to_date_ts    : 0,
        staff_id      : ALL_STAFF,
        shop_id       : 0,
        
        // ui only
        date_type  : common_options.date_type.date,
        from_date  : {},
        to_date    : {},
      },

      report_api    : new ReportApi(),
      staff_options : [],

      sales_total   : [],
      payment_total : [],
      show_detail_sales_total: false,
      detail_sales_total: [],
      detail_sales_total_th: []
    }
  },
  computed:{
    text_product(){return this.$i18n.t('report.product')},
    text_service(){return this.$i18n.t('report.service')},
    text_prepaid_card(){return this.$i18n.t('report.prepaid-card')},
    text_prepaid_service(){return this.$i18n.t('report.prepaid-service')},
    text_no_data_for_table(){return this.$i18n.t('general.no-data-for-table')},
    text_outstanding(){return this.$i18n.t('sales.outstanding')},
    text_total(){return this.$i18n.t('report.sales-total')},
    text_all(){ return this.$i18n.t('general.all') },
    text_not_select(){ return this.$i18n.t('sales.not-select') },
    no_input_text(){return this.$i18n.t('report.no-input')},
    error_date_range_can_not_exceed_1_year(){return this.$i18n.t('report.error_date_range_can_not_exceed_1_year')},
    text_refund(){return this.$i18n.t('sales.refund')},
    text_net_sales_total(){return this.$i18n.t('sales.net-sales-total')}
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
      let response = await this.report_api.getSalesTotalReportAsync(this.table_filter)
      this.preLoader(false)

      if(response.is_ok){
        this.sales_total   = response.data.sales_total
        this.payment_total = response.data.payment_total
        this.detail_sales_total_th = this.sales_total.filter(e => e.fields.sales_item != 'REFUND' && e.fields.sales_item != 'NET_SALES_TOTAL')
        this.detail_sales_total = response.data.detail_sales_total
      }
      else
        this.showAlert(response.error_messages)
    },
    async onSearch(){
      await this.loadTableDataAsync()
    },
    
    // format
    isZero(number){
      return number == 0
    },
    isZeroBoth(number1, number2){
      return number1 == 0 && number2 == 0
    },
    formatSalesTotalItemName(name){
      let tmp_name = this.formatName(name)
      if(tmp_name == 'Product')
        tmp_name = this.text_product
      if(tmp_name == 'Service')
        tmp_name = this.text_service
      if(tmp_name == 'PrepaidCard')
        tmp_name = this.text_prepaid_card
      if(tmp_name == 'PrepaidService')
        tmp_name = this.text_prepaid_service
      return tmp_name
    },
    formatName(name){
      if(name == 'NONE')
        name = this.no_input_text
      if(name == 'TOTAL')
        name = this.text_total
      if(name == 'REFUND')
        name = this.text_refund
      if(name == 'NET_SALES_TOTAL')
        name = this.text_net_sales_total
      return name
    },
    formatNumber(number){
      let tmp = ''
      if(number != 0){
        tmp = formatMoney(number,0)
      }
      return tmp
    },
    isNetSalesTotal(item){
      if(item.fields.sales_item == 'NET_SALES_TOTAL') return true
      return false
    },
    isSalesItemRefund(item){
      if(item.fields.sales_item == 'REFUND') return true
      return false
    },
    displayDataDetailSalesTotal(item){
      if(!this.isZero(item)) return this.formatMoney(item,0)
      return ''
    }
  }
}
</script>

<style lang="scss">
@import './sales-total.scss';
</style>