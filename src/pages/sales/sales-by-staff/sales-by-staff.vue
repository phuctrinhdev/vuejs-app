<template>
  <main class="app-content">
    <section class="content sales-by-staff-page">
      <sales-total-header/>

      <div class="filter-wrapper">
        <div class="row">
          <div class="col-12 col-md-10">
            <div class="filter">
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
      
      <div class="table-wrapper">
        <div class="row">
          <div class="table-sales-total col-12 col-lg-6">
            <h3 class="table-title">{{ $t('report.service-product') }}</h3>
            <table class="table">
              <thead>
                <tr>
                  <th width="20%">{{ $t('report.staff') }}</th>
                  <th width="25%">{{ $t('report.service') }}</th>
                  <th width="25%">{{ $t('report.product') }}</th>
                  <th width="30%">{{ $t('general.total') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row,index) in table_rows" :key="index">
                  <td>{{ formatName(row.fields.staff_name) }}</td>
                  <td class="services">
                    <span v-if="!isZeroBoth(row.fields.services.sales_amount, row.fields.services.refund_amount)">
                      {{ formatMoney(row.fields.services.sales_amount,0) }}<br>
                      <span v-if="!isZero(row.fields.services.refund_amount)">({{ formatMoney(row.fields.services.refund_amount,0) }})<br></span>
                    </span>
                    <span v-if="!isZeroBoth(row.fields.services.sales_quantity, row.fields.services.refund_quantity)">
                      / {{ formatMoney(row.fields.services.sales_quantity,0) }} 
                      <span v-if="!isZero(row.fields.services.refund_quantity)">({{ formatMoney(row.fields.services.refund_quantity,0) }})</span>
                    </span>
                  </td>
                  <td class="products">
                    <span v-if="!isZeroBoth(row.fields.products.sales_amount, row.fields.products.refund_amount)">
                      {{ formatMoney(row.fields.products.sales_amount,0) }}<br>
                      <span v-if="!isZero(row.fields.products.refund_amount)">({{ formatMoney(row.fields.products.refund_amount,0) }})<br></span>
                    </span>
                    <span v-if="!isZeroBoth(row.fields.products.sales_quantity, row.fields.products.refund_quantity)">
                      / {{ formatMoney(row.fields.products.sales_quantity,0) }} 
                      <span v-if="!isZero(row.fields.products.refund_quantity)">({{ formatMoney(row.fields.products.refund_quantity,0) }})</span>
                    </span>
                  </td>
                  <td class="total">
                    <span v-if="!isZeroBoth(row.fields.total_service_product.total_amount, row.fields.total_service_product.refund_amount)">
                      {{ formatMoney(row.fields.total_service_product.total_amount,0) }}<br>
                      <span v-if="!isZero(row.fields.total_service_product.refund_amount)">({{ formatMoney(row.fields.total_service_product.refund_amount,0) }})<br></span>
                    </span>
                    <span v-if="!isZeroBoth(row.fields.total_service_product.total_quantity, row.fields.total_service_product.refund_quantity)">
                      / {{ formatMoney(row.fields.total_service_product.total_quantity,0) }} 
                      <span v-if="!isZero(row.fields.total_service_product.refund_quantity)">({{ formatMoney(row.fields.total_service_product.refund_quantity,0) }})</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="table-payment-total col-12 col-lg-6">
            <h3 class="table-title">{{ $t('report.prepaid-sales') }}</h3>
            <table class="table">
              <thead>
                <tr>
                  <th width="20%">{{ $t('report.staff') }}</th>
                  <th width="25%">{{ $t('report.prepaid-cards') }}</th>
                  <th width="25%">{{ $t('report.prepaid-services') }}</th>
                  <th width="30%">{{ $t('general.total') }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row,index) in table_rows" :key="index">
                  <td>{{ formatName(row.fields.staff_name) }}</td>
                  <td class="prepaid_cards">
                    <span v-if="!isZeroBoth(row.fields.prepaid_cards.sales_amount, row.fields.prepaid_cards.refund_amount)">
                      {{ formatMoney(row.fields.prepaid_cards.sales_amount,0) }}<br>
                      <span v-if="!isZero(row.fields.prepaid_cards.refund_amount)">({{ formatMoney(row.fields.prepaid_cards.refund_amount,0) }})<br></span>
                    </span>
                    <span v-if="!isZeroBoth(row.fields.prepaid_cards.sales_quantity, row.fields.prepaid_cards.refund_quantity)">
                      / {{ formatMoney(row.fields.prepaid_cards.sales_quantity,0) }} 
                      <span v-if="!isZero(row.fields.prepaid_cards.refund_quantity)">({{ formatMoney(row.fields.prepaid_cards.refund_quantity,0) }})</span>
                    </span>
                  </td>
                  <td class="prepaid_services">
                    <span v-if="!isZeroBoth(row.fields.prepaid_services.sales_amount, row.fields.prepaid_services.refund_amount)">
                      {{ formatMoney(row.fields.prepaid_services.sales_amount,0) }}<br>
                      <span v-if="!isZero(row.fields.prepaid_services.refund_amount)">({{ formatMoney(row.fields.prepaid_services.refund_amount,0) }})<br></span>
                    </span>
                    <span v-if="!isZeroBoth(row.fields.prepaid_services.sales_quantity, row.fields.prepaid_services.refund_quantity)">
                      / {{ formatMoney(row.fields.prepaid_services.sales_quantity,0) }} 
                      <span v-if="!isZero(row.fields.prepaid_services.refund_quantity)">({{ formatMoney(row.fields.prepaid_services.refund_quantity,0) }})</span>
                    </span>
                  </td>
                  <td class="total">
                    <span v-if="!isZeroBoth(row.fields.total_prepaid_goods.total_amount, row.fields.total_prepaid_goods.refund_amount)">
                      {{ formatMoney(row.fields.total_prepaid_goods.total_amount,0) }}<br>
                      <span v-if="!isZero(row.fields.total_prepaid_goods.refund_amount)">({{ formatMoney(row.fields.total_prepaid_goods.refund_amount,0) }})<br></span>
                    </span>
                    <span v-if="!isZeroBoth(row.fields.total_prepaid_goods.total_quantity, row.fields.total_prepaid_goods.refund_quantity)">
                      / {{ formatMoney(row.fields.total_prepaid_goods.total_quantity,0) }} 
                      <span v-if="!isZero(row.fields.total_prepaid_goods.refund_quantity)">({{ formatMoney(row.fields.total_prepaid_goods.refund_quantity,0) }})</span>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import moment from 'moment'
import { DatePicker }                from 'v-calendar'
import component_base                from '../../../components/common/component-base/component-base.vue'
import input_date_range_by_date_type from '../../../components/common/form/input/input-date-range-by-date-type/input-date-range-by-date-type.vue'
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
  data(){
    return {
      sales_options,

      table_filter : {
        from_date_ts  : 0,
        to_date_ts    : 0,
        shop_id       : 0,
        
        // ui only
        date_type  : common_options.date_type.date,
        from_date  : {},
        to_date    : {},
      },
      table_rows    : [],

      report_api    : new ReportApi(),
    }
  },
  computed:{
    text_outstanding(){return this.$i18n.t('sales.outstanding')},
    text_total(){return this.$i18n.t('general.total')},
    text_all(){ return this.$i18n.t('general.all') },
    text_not_select(){ return this.$i18n.t('sales.not-select') },
    no_input_text(){return this.$i18n.t('report.no-input')},
    error_date_range_can_not_exceed_1_year(){return this.$i18n.t('report.error_date_range_can_not_exceed_1_year')},
  },
  async mounted() {
    this.table_filter.shop_id = this.shop_data.shop_id
    await this.loadTableDataAsync()
  },
  methods:{
    formatMoney,
    getTypeNameOfArray,

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
      let response = await this.report_api.getSalesTotalByStaffReportAsync(this.table_filter)
      this.preLoader(false)
      
      if(response.is_ok){
        this.table_rows = response.data
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
    formatName(name){
      if(name == 'NONE')
        name = this.no_input_text
      if(name == 'TOTAL')
        name = this.text_total
      return name
    },
    getTotalAmountOfServiceProduct(row){
      let total = row.fields.services.sales_amount + row.fields.services.refund_amount
                 +row.fields.products.sales_amount + row.fields.products.refund_amount
      return total
    },
    getTotalQuantityOfServiceProduct(row){
      let total = row.fields.services.sales_quantity + row.fields.services.refund_quantity
                 +row.fields.products.sales_quantity + row.fields.products.refund_quantity
      return total
    },
    getTotalAmountOfPrepaidGoods(row){
      let total = row.fields.prepaid_cards.sales_amount    + row.fields.prepaid_cards.refund_amount
                 +row.fields.prepaid_services.sales_amount + row.fields.prepaid_services.refund_amount
      return total
    },
    getTotalQuantityOfPrepaidGoods(row){
      let total = row.fields.prepaid_cards.sales_quantity    + row.fields.prepaid_cards.refund_quantity
                 +row.fields.prepaid_services.sales_quantity + row.fields.prepaid_services.refund_quantity
      return total
    }
  }
}
</script>

<style lang="scss">
@import './sales-by-staff.scss';
</style>