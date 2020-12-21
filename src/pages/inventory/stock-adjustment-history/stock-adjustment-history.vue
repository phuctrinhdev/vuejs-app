<template>
  <main class="app-content">
    <section class="content stock-adjustment-history">
      <div class="page-title">
        <h3>{{ $t('stock-adjustment.stock-adjustment-history') }}</h3>
        <ul class="group-btn">
          <li class="btn"><router-link :to="{ name: 'stock-adjustment' }">{{ $t('stock-adjustment.stock-adjustment') }}</router-link></li>
          <!-- <li class="btn">{{ $t('general.print') }}</li> -->
        </ul>
      </div>

      <div class="filter-wrapper">
        <b-form class="row">
          <div class="col-sm-10 filter">
            <div class="form-group date-range">
              <label>{{ $t('stock-internal-use.date-range') }}</label>
              <v-date-picker
                id="stock-adjustment-history-from-date"
                v-model="table_filter.date_from" 
                :popover="{ placement: 'bottom' }"
                :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"
                @input="onInputDateFrom"/>
              <v-date-picker
                id="stock-adjustment-history-to-date"
                v-model="table_filter.date_to" 
                :popover="{ placement: 'bottom' }"
                :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }"
                @input="onInputDateTo"/>
            </div>

            <div class="form-group product">
              <label>{{ $t('products.product') }}</label>
              <b-form-input id="stock-adjustment-history-product-code" v-model="table_filter.key_word" :placeholder="product_placeholder"
                            type="text"/>
            </div>
          </div>
          <div class="col-sm-2 filter-search">
            <button class="btn btn-search" @click.prevent="onSearch"><i class="btn-search-white"/> <span>{{ $t('general.search') }}</span></button>
          </div>
        </b-form>
      </div>
      
      <div id="table-stock-adjustment-history" class="table table-stock-adjustment-history">
        <div class="intro">{{ stock_history_intro }}</div>
        <view-table :data="table_data" @change-page="onChangePage">
          <template slot="date_time" slot-scope="{row}">
            {{ moment(row.date_time).format(options.standard_date_format.ymd) }}
          </template>
          <template slot="stock_before" slot-scope="{row}">
            {{ formatMoney(row.stock_before,0) }}
          </template>
          <template slot="stock_on_hand" slot-scope="{row}">
            {{ formatMoney(row.stock_on_hand,0) }}
          </template>
          <template slot="adjusted_qty" slot-scope="{row}">
            {{ formatMoney(row.adjusted_qty,0) }}
          </template>
          
        </view-table>
      </div>
    </section>
  </main>
</template>

<script>
// import _ from 'lodash'
import moment from 'moment'
import { mapMutations, mapGetters }   from 'vuex'
import { options }    from '../../../helpers/options'
import { inventory_options } from '../../../helpers/options/inventory-options.js'
import { DatePicker, setupCalendar }       from 'v-calendar'
import product_mixin from '../../../helpers/mixins/product-mixin'
import product_category_mixin from '../../../helpers/mixins/product-category-mixin'
import staff_mixin from '../../../helpers/mixins/staff-mixin'
import supplier_action       from '../../../components/inventory/supplier-action/supplier-action.vue'
import component_base        from '../../../components/common/component-base/component-base.vue'
import view_table            from '../../../components/common/view-table/view-table.vue'
import StockHistoryApi           from '../../../api/inventory/stock-history-api'
// import StockInternalUseViewModel     from '../../../view-model/inventory/stock-internal-use/stock-internal-use-view-model'
import { convertDateToTimezone,
  convertDateToTimeStamp,
  convertTimeStampMinusLocalzone,
  formatMoney } from '../../../helpers/common'

export default {
  components : {
    'v-date-picker'   : DatePicker,
    'view-table'      : view_table,
    'supplier-action' :supplier_action
  },
  extends : component_base,
  mixins: [product_mixin, product_category_mixin, staff_mixin],
  data(){
    return {
      options,
      inventory_options,

      stock_history_api: new StockHistoryApi(),

      table_data: {
        fields: [
          {field: 'date_time',         label: 'general.date-time',              width: '10%', sortable: false, expand: true },
          {field: 'product_code',      label: 'products.product-code',          width: '15%', sortable: false },
          {field: 'product_name',      label: 'products.product-name',          width: '20%', sortable: false },
          {field: 'stock_before',      label: 'stock-adjustment.before',        width: '10%', sortable: false, expand: true },
          {field: 'stock_on_hand',     label: 'stock-adjustment.after',         width: '10%', sortable: false, expand: true },
          {field: 'adjusted_qty',      label: 'stock-adjustment.diff',          width: '10%', sortable: false, expand: true },
          {field: 'notes',             label: 'general.notes',                  width: '20%', sortable: false }
        ],
        rows: [],
        pagination: { total_pages: 1 },
        options: {
          // fixed_header: true,
          pagination: true 
        }
      },
      table_filter: {
        date_from   : convertDateToTimezone(moment().date(1).toDate()),
        date_from_ts: 0,
        date_to     : convertDateToTimezone(new Date()),
        date_to_ts  : 0,
        key_word    : '',
        product_code: '',
        action      : inventory_options.stock_history_action.stock_adjustment,
        page_size   : options.pagination.big,
        page_number : 1,
        shop_id     : 0,
      },
    }
  },
  computed:{
    ...mapGetters('stock_internal_use',{
      x_products_with_stock: 'getProductsWithStock',
    }),
    ...mapGetters('stock_safety',{
      x_stock_history_view_product_code: 'getStockHistoryViewProductCode',
    }),
    
    product_placeholder(){return this.$i18n.t('products.product-code-or-name')},
    text_all(){return this.$i18n.t('general.all')},
    text_sales(){return this.$i18n.t('stock-history.sales')},
    text_sales_modified(){return this.$i18n.t('stock-history.sales-modified')},
    text_sales_deleted(){return this.$i18n.t('stock-history.sales-deleted')},
    text_refund(){return this.$i18n.t('stock-history.refund')},
    text_refund_modified(){return this.$i18n.t('stock-history.refund-modified')},
    text_refund_deleted(){return this.$i18n.t('stock-history.refund-deleted')},
    text_receiving(){return this.$i18n.t('stock-history.receiving')},
    text_receiving_modified(){return this.$i18n.t('stock-history.receiving-modified')},
    text_receiving_deleted(){return this.$i18n.t('stock-history.receiving-deleted')},
    text_internal_use(){return this.$i18n.t('stock-history.internal-use')},
    text_internal_use_modified(){return this.$i18n.t('stock-history.internal-use-modified')},
    text_internal_use_deleted(){return this.$i18n.t('stock-history.internal-use-deleted')},
    text_damaged(){return this.$i18n.t('stock-history.damaged')},
    text_lost(){return this.$i18n.t('stock-history.lost')},
    text_out_of_date(){return this.$i18n.t('stock-history.out-of-date')},
    text_return(){return this.$i18n.t('stock-history.return')},
    text_etc(){return this.$i18n.t('stock-history.etc')},
    text_stock_adjustment(){return this.$i18n.t('stock-history.stock-adjustment')},

    stock_history_intro(){
      let tmp = this.$i18n.t('stock-history.all-records')
      tmp = tmp.replace('{records}', formatMoney(this.table_data.pagination.total_items,0))
      return tmp
    },
    stock_history_action_options(){
      return [
        { value: inventory_options.stock_history_action.all,              text: this.$i18n.t('general.all') },
        { value: inventory_options.stock_history_action.sales,            text: this.$i18n.t('stock-history.sales') },
        { value: inventory_options.stock_history_action.refund,           text: this.$i18n.t('stock-history.refund') },
        { value: inventory_options.stock_history_action.receiving,        text: this.$i18n.t('stock-history.receiving') },
        { value: inventory_options.stock_history_action.internal_use,     text: this.$i18n.t('stock-history.internal-use') },
        { value: inventory_options.stock_history_action.stock_adjustment, text: this.$i18n.t('stock-history.stock-adjustment') },
        { value: inventory_options.stock_history_action.decrease_stock,   text: this.$i18n.t('stock-history.decrease-stock') },
      ]
    }
  },
  async created(){
    // filter
    setupCalendar({
      locale: this.locale,
      firstDayOfWeek: 2,
      titleTransition: 'none',
      weeksTransition: 'none',
      datePickerTintColor: '#3499db',
    })

    // load table-data
    this.table_filter.shop_id = this.shop_data.shop_id
    await this.onLoadTableData()
  },
  methods:{
    ...mapMutations('stock_internal_use',[
      'setProductsWithStock',
      'setStockInternalUseAction',
    ]),
    ...mapMutations('stock_safety',[
      'setStockHistoryViewProductCode'
    ]),
    ...mapMutations('staff',[
      'setStaffOptions',
    ]),
    moment,
    formatMoney,

    // table
    async onLoadTableData(){
      this.table_filter.date_from_ts = convertDateToTimeStamp(this.table_filter.date_from)
      this.table_filter.date_to_ts   = convertDateToTimeStamp(moment(this.table_filter.date_to).add(1, 'day'))
      this.table_filter.date_to_ts  -= 1

      this.table_filter.date_from_ts = convertTimeStampMinusLocalzone(this.table_filter.date_from_ts)
      this.table_filter.date_to_ts   = convertTimeStampMinusLocalzone(this.table_filter.date_to_ts)

      this.preLoader()
      let response = await this.stock_history_api.getStockHistorysAsync(this.table_filter)
      this.preLoader(false)

      if(response.is_ok){
        this.table_data.rows       = response.data.items
        this.table_data.pagination = response.data.pagination
      }
      else {
        this.showAlert(response.error_messages)
      }
    },
    onSearch(){
      this.table_filter.page_number = 1
      this.onLoadTableData()
    },
    onChangePage(page_number){
      this.table_filter.page_number = page_number
      this.onLoadTableData()
    },

    // filter
    onInputDateFrom(date){
      if(date == null)
        this.table_filter.date_from = moment(convertDateToTimezone(new Date())).date(1).toDate()
    },
    onInputDateTo(date){
      if(date == null)
        this.table_filter.date_to = convertDateToTimezone(new Date())
    },

    // format
    formatStockHistoryActionReason(stock_history){
      let tmp_reason = ''
      if(stock_history.action == inventory_options.stock_history_action.sales){
        if(stock_history.action_reason == inventory_options.action_reason_for_sales.sales)
          tmp_reason = this.text_sales
        else if(stock_history.action_reason == inventory_options.action_reason_for_sales.sales_modified)
          tmp_reason = this.text_sales_modified
        else if(stock_history.action_reason == inventory_options.action_reason_for_sales.sales_deleted)
          tmp_reason = this.text_sales_deleted
      }
      else if(stock_history.action == inventory_options.stock_history_action.refund){
        if(stock_history.action_reason == inventory_options.action_reason_for_refund.refund)
          tmp_reason = this.text_refund
        else if(stock_history.action_reason == inventory_options.action_reason_for_refund.refund_modified)
          tmp_reason = this.text_refund_modified
        else if(stock_history.action_reason == inventory_options.action_reason_for_refund.refund_deleted)
          tmp_reason = this.text_refund_deleted
      }
      else if(stock_history.action == inventory_options.stock_history_action.receiving){
        if(stock_history.action_reason == inventory_options.action_reason_for_receiving.receiving)
          tmp_reason = this.text_receiving
        else if(stock_history.action_reason == inventory_options.action_reason_for_receiving.receiving_modified)
          tmp_reason = this.text_receiving_modified
        else if(stock_history.action_reason == inventory_options.action_reason_for_receiving.receiving_deleted)
          tmp_reason = this.text_receiving_deleted
      }
      else if(stock_history.action == inventory_options.stock_history_action.internal_use){
        if(stock_history.action_reason == inventory_options.action_reason_for_internal_use.internal_use)
          tmp_reason = this.text_internal_use
        else if(stock_history.action_reason == inventory_options.action_reason_for_internal_use.internal_use_modified)
          tmp_reason = this.text_internal_use_modified
        else if(stock_history.action_reason == inventory_options.action_reason_for_internal_use.internal_use_deleted)
          tmp_reason = this.text_internal_use_deleted
      }
      else if(stock_history.action == inventory_options.stock_history_action.stock_adjustment){
        tmp_reason = this.text_stock_adjustment
      }
      else if(stock_history.action == inventory_options.stock_history_action.decrease_stock){
        if(stock_history.action_reason == inventory_options.action_reason_for_decrease_stock.damaged)
          tmp_reason = this.text_damaged
        else if(stock_history.action_reason == inventory_options.action_reason_for_decrease_stock.lost)
          tmp_reason = this.text_lost
        else if(stock_history.action_reason == inventory_options.action_reason_for_decrease_stock.out_of_date)
          tmp_reason = this.text_out_of_date
        else if(stock_history.action_reason == inventory_options.action_reason_for_decrease_stock.return)
          tmp_reason = this.text_return
        else if(stock_history.action_reason == inventory_options.action_reason_for_decrease_stock.etc)
          tmp_reason = this.text_etc
      }

      return tmp_reason
    }
  }
}
</script>

<style lang="scss">
@import './stock-adjustment-history.scss';
</style>