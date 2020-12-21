<template>
  <main class="app-content">
    <section class="content sales-history">

      <!-- BEGIN TITLE -->
      <div class="title">
        <h3>{{ $t('sales-invoice-tab.sales-history') }}</h3>
        <div><a>{{ $t('sales-invoice-tab.print') }}</a></div>
      </div>
      <!-- END TITLE -->

      <!-- BEGIN FILTER -->
      <div class="filter">
        <div class="row">
          <div class="col-lg-10">
            <div class="filter-box">
              <input-date-range-by-date-type ref="input_date_range_by_date_type" v-model="table_filter"/>
              <div class="items">
                <label>{{ $t('sales-invoice-tab.items') }}</label>
                <select-multi-sales-item-type ref="select_multi_sales_item_type"
                                              v-model="item_types" 
                                              :has_outstanding="true"
                                              @input="onInputItemTypes"/>
              </div>
              <div class="payment-method view-pc">
                <label>{{ $t('sales-invoice-tab.payment-method') }}</label>
                <b-form-select v-model="table_filter.payment_method_id"
                               :options="payment_options"
                               value-field="id" text-field="name"
                               @mouseleave.native="onMouseLeaveSelect">
                  <template v-slot:first>
                    <option :value="DEFAULT_GET_ALL_PAYMENT">{{ $t('general.all') }}</option>
                  </template>
                </b-form-select>
              </div>
              <div class="staff">
                <label>{{ $t('sales-invoice-tab.staff') }}</label>
                <b-form-select v-model="table_filter.staff_id"
                               :options="staff_options"
                               value-field="id" text-field="aliasname"
                               @mouseleave.native="onMouseLeaveSelect">
                  <template v-slot:first>
                    <option :value="DEFAULT_GET_ALL_STAFF">{{ $t('general.all') }}</option>
                  </template>
                </b-form-select>
              </div>
              <div class="payment-method view-mobile">
                <label>{{ $t('sales-invoice-tab.payment-method') }}</label>
                <b-form-select v-model="table_filter.payment_method_id"
                               :options="payment_options"
                               value-field="id" text-field="name"
                               @mouseleave.native="onMouseLeaveSelect">
                  <template v-slot:first>
                    <option :value="DEFAULT_GET_ALL_PAYMENT">{{ $t('general.all') }}</option>
                  </template>
                </b-form-select>
              </div>
            </div>
          </div>
          
          <div class="col-lg-2">
            <div class="search">
              <button class="btn-submit" @click.prevent="onSearchAsync"><i class="btn-search-white"/> <span>{{ $t('general.search') }}</span></button>
            </div>
          </div>
        </div>
      </div>

      <!-- BEGIN TABLE -->
      <div class="table">
        <p>{{ total_records_text }}</p>
        <sales-table :is_connect_client_to_sales="true"
                     @show-deleted="onShowDeleted"
                     @change-page="onChangePage"
                     @sales-added="reloadSalesHistoriesAsync"
                     @sales-edited="reloadSalesHistoriesAsync"
                     @sales-deleted="reloadSalesHistoriesAsync"
                     @refund-added="reloadSalesHistoriesAsync"
                     @refund-deleted="reloadSalesHistoriesAsync"
                     @outstanding-deleted="reloadSalesHistoriesAsync"/>
      </div>
    </section>
  </main>
</template>

<script>
const DEFAULT_GET_ALL_STAFF   = -1
const DEFAULT_GET_ALL_PAYMENT = -1
const DEFAULT_NUMBER_PAGE     = 1

import moment from 'moment'
import SalesApi                      from '../../../api/sales/sales-api.js'
import alert_confirm                 from '../../../components/common/alert/alert-confirm.vue'
import component_base                from '../../../components/common/component-base/component-base.vue'
import sales_table                   from '../../../components/sales/sales-table/sales-table.vue'
import input_date_range_by_date_type from '../../../components/common/form/input/input-date-range-by-date-type/input-date-range-by-date-type.vue'
import select_multi_sales_item_type  from '../../../components/common/form/select/select-multi-sales-item-type/select-multi-sales-item-type.vue'
import staff_mixin                   from '../../../helpers/mixins/staff-mixin'
import sales_mixin                   from '../../../helpers/mixins/sales-mixin'
import SalesCache                    from '../../../helpers/cache/sales-cache.js'
import { options }                   from '../../../helpers/options'
import { common_options }            from '../../../helpers/options/common-options.js'
import { sales_options }             from '../../../helpers/options/sales-options.js'
import { DatePicker }                from 'v-calendar'
import { mapMutations }              from 'vuex'
import { formatMoney, 
  convertDateToTimeStamp }           from '../../../helpers/common'

export default {
  components : {
    'v-date-picker'                : DatePicker,
    'sales-table'                  : sales_table,
    'alert-confirm'                : alert_confirm,
    'input-date-range-by-date-type': input_date_range_by_date_type,
    'select-multi-sales-item-type' : select_multi_sales_item_type
  },
  extends : component_base,
  mixins  : [staff_mixin,sales_mixin],
  data(){
    return {
      DEFAULT_GET_ALL_STAFF,
      DEFAULT_GET_ALL_PAYMENT,

      common_options,
      sales_options,
      sales_api         : new SalesApi(),
      total_records     : 0,
      current_date_time : new Date(),
      staff_options     : [],
      payment_options   : [],
      items             : [],
      item_types        : [],
      alert_data        : [],
      alert_id          : 'alert-sales-history-errors-modal',

      table_filter      : {
        date_type              : common_options.date_type.month,
        from_date              : {},
        to_date                : {},
        include_service        : true,
        include_product        : true,
        include_prepaid_card   : true,
        include_prepaid_service: true,
        include_outstanding    : true,
        include_deleted        : false,
        payment_method_id      : DEFAULT_GET_ALL_PAYMENT,
        staff_id               : DEFAULT_GET_ALL_STAFF,
        page_size              : common_options.pagination.default,
        page_number            : DEFAULT_NUMBER_PAGE,
        shop_id                : 0,
        client_shop_id         : 0
      },
      sales_setup: {},
    }
  },
  computed:{
    total_records_text(){
      let text = this.$i18n.t('sales-invoice-tab.all-result')
      text = text.replace('{total_records}',formatMoney(this.total_records,0))
      return text
    },
    close_text(){
      return this.$i18n.t('general.close')
    },
    date_range_can_not_exceed_3_months(){
      return this.$i18n.t('sales.date_range_can_not_exceed_3_months')
    }
  },
  async mounted(){
    this.resetState()
    this.table_filter.shop_id       = this.shop_data.shop_id
    this.table_filter.client_shop_id= this.shop_data.shop_id
    this.item_types                 = this.$refs.select_multi_sales_item_type.item_type_options

    this.preLoader()
    await this.loadPaymentsAsync()
    await this.loadStaffOptions()
    await this.loadDataTableAsync()
    this.preLoader(false)
  },
  methods:{
    ...mapMutations('client',[
      'resetState'
    ]),
    ...mapMutations('sales',[
      'setSalesList'
    ]),
    ...mapMutations('staff',[
      'setStaffOptions',
    ]),
    async loadPaymentsAsync(){
      let sales_cache = new SalesCache()
      this.sales_setup = await sales_cache.getAllSalesSetupCache(this.shop_data.shop_id)
      if(this.isMissingSalesSetup(this.sales_setup)){
        this.showAlert(this.sales_setup.error_messages)
      }
      else {
        this.payment_options = this.sales_setup.payment_method_setup
      }
    },
    async loadStaffOptions(){
      let result = await this.getStaffsAsyncMixin()
      if(result.is_ok){
        this.staff_options = result.data.items
        this.setStaffOptions(result.data.items)
      }
      else this.showAlert(result.error_messages)
    },
    async loadDataTableAsync(){
      // validate filter
      if(this.table_filter.date_type == common_options.date_type.date_range){
        let errors = [...this.$refs.input_date_range_by_date_type.errors]
        let tmp_to_date_limit    = moment(this.table_filter.from_date.text).add(3, 'months').subtract(1,'day').toDate()
        let tmp_to_date_limit_ts = convertDateToTimeStamp(tmp_to_date_limit) + options.seconds_of_24h - 1
        
        if(this.table_filter.to_date.value > tmp_to_date_limit_ts){
          errors.push(this.date_range_can_not_exceed_3_months)
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
      let response = await this.sales_api.getSalesHistoriesLiveAsync(this.table_filter)
      this.preLoader(false)

      if(response.is_ok){
        this.total_records = response.data.pagination.total_items
        this.setSalesList(response.data)
      }
      else{
        this.showAlert(response.error_messages)
      }
    },
    async onSearchAsync(){
      this.table_filter.page_number = DEFAULT_NUMBER_PAGE
      await this.loadDataTableAsync()
    },
    async onShowDeleted(include_deleted){
      this.table_filter.include_deleted = include_deleted
      this.table_filter.page_number = 1
      await this.loadDataTableAsync()
    },
    async onChangePage(page_number){
      this.table_filter.page_number = page_number
      await this.loadDataTableAsync()
    },
    reloadSalesHistoriesAsync(){
      this.preLoader()
      setTimeout(() => { 
        this.loadDataTableAsync()
        this.preLoader(false)
      }, 1000)
    },
    onInputItemTypes(item_types, item_types_value){
      this.table_filter.include_service         = item_types_value.includes(options.sales_enum.goods_type.service)
      this.table_filter.include_product         = item_types_value.includes(options.sales_enum.goods_type.product)
      this.table_filter.include_prepaid_card    = item_types_value.includes(options.sales_enum.goods_type.prepaid_card)
      this.table_filter.include_prepaid_service = item_types_value.includes(options.sales_enum.goods_type.prepaid_service)
      this.table_filter.include_outstanding     = item_types_value.includes(5)
    },
  }
}
</script>

<style lang="scss">
@import './sales-history.scss';
</style>
