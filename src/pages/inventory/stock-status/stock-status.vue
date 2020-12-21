<template>
  <main class="app-content">
    <section class="content stock-status-page">
      <div class="page-title">
        <h3>{{ $t('stock-status.stock-status') }}</h3>
        <ul class="group-btn">
          <li class="btn">{{ $t('general.print') }}</li>
        </ul>
      </div>

      <div class="filter-wrapper">
        <b-form class="row">
          <div class="col-10 col-sm-9 filter">
            <div class="row">
              <div class="col-md-6 col-lg-5 col-xl-4 form-group category">
                <label>{{ $t('products.category') }}</label>
                <b-form-select id="stock-status-category" v-model="table_filter.product_category_id" 
                               :options="category_options" value-field="id" text-field="name"/>
              </div>
              <div class="col-md-6 col-lg-5 col-xl-4 form-group product">
                <label>{{ $t('products.product') }}</label>
                <b-form-input id="stock-status-product-code" v-model="table_filter.key_word" :placeholder="product_placeholder"
                              type="text"/>
              </div>
            </div>
          </div>
          <div class="col-2 col-sm-3 filter-search">
            <button class="btn btn-search" @click.prevent="onSearch"><i class="btn-search-white"/> <span>{{ $t('general.search') }}</span></button>
          </div>
        </b-form>
      </div>
      
      <div id="table-stock-status" class="table table-stock-status">
        <div class="table-intro">{{ table_intro }}</div>
        <div class="table-intro-ui">* {{ table_intro_ui }}</div>
        <view-table :data="table_data" @change-page="onChangePage">
          <template slot="stock_safety" slot-scope="{row}">
            <div @click="onActionStockSafety(row)">{{ formatMoney(row.stock_safety, 0) }}</div>
          </template>
          <template slot="stock_on_hand" slot-scope="{row}">
            {{ formatMoney(row.stock_on_hand, 0) }}
          </template>
          <template slot="supplier_price" slot-scope="{row}">
            {{ formatMoney(row.supplier_price, 0) }}
          </template>
          <template slot="valuation" slot-scope="{row}">
            {{ formatMoney(row.supplier_price * row.stock_on_hand, 0) }}
          </template>
          <template slot="decrease_stock" slot-scope="{row}">
            <a class="btn" @click="onActionAddStockDecrease(options.form_actions.add, row)">-</a>
          </template>
          <template slot="stock_history" slot-scope="{row}">
            <a class="btn" @click="onViewStockHistory(row)">{{ $t('general.view') }}</a>
          </template>
        </view-table>
      </div>

      <stock-safety-action ref="stock_safety_action" @updated="onStockSafetyUpdated"/>
      <stock-decrease-action ref="stock_decrease_action" @added="onStockDecreaseAdded"/>
    </section>
  </main>
</template>

<script>
// import _ from 'lodash'
// import moment from 'moment'
import { mapMutations, mapGetters }   from 'vuex'
import { options }    from '../../../helpers/options'
import { inventory_options } from '../../../helpers/options/inventory-options.js'
import { DatePicker, setupCalendar }       from 'v-calendar'
import product_mixin from '../../../helpers/mixins/product-mixin'
import product_category_mixin from '../../../helpers/mixins/product-category-mixin'
import staff_mixin from '../../../helpers/mixins/staff-mixin'
import supplier_action       from '../../../components/inventory/supplier-action/supplier-action.vue'
import component_base        from '../../../components/common/component-base/component-base'
import view_table            from '../../../components/common/view-table/view-table.vue'
import StockStatusApi           from '../../../api/inventory/stock-status-api'
import stock_safety_action from '../../../components/inventory/stock-safety-action/stock-safety-action'
import stock_decrease_action from '../../../components/inventory/stock-decrease-action/stock-decrease-action'
// import ProductViewModel from '../../../view-model/goods/product-view-model'
// import StockSafetyViewModel from '../../../view-model/inventory/stock-safety/stock-safety-view-model'
import { formatMoney } from '../../../helpers/common'

export default {
  components : {
    'stock-safety-action': stock_safety_action,
    'stock-decrease-action': stock_decrease_action,
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

      stock_status_api: new StockStatusApi(),
      stock_intro: {
        total_qty: 0,
        total_valuation: 0
      },

      table_data   : {
        fields : [
          {field: 'product_category_name',  label: 'products.category',           width: '15%',   sortable: false },
          {field: 'code',                   label: 'products.product-code',       width: '12%',   sortable: false },
          {field: 'name',                   label: 'products.product-name',       width: '20%',   sortable: false },
          {field: 'stock_safety',           label: 'products.safety-stock',       width: '7%',    sortable: false, expand: true },
          {field: 'stock_on_hand',          label: 'products.stock-on-hand',      width: '7%',    sortable: false, expand: true },
          {field: 'supplier_price',         label: 'products.supplier-price',     width: '10%',   sortable: false, expand: true },
          {field: 'valuation',              label: 'products.valuation',          width: '14%',   sortable: false, expand: true },
          {field: 'decrease_stock',         label: 'stock-status.decrease-stock', width: '8%',    sortable: false, expand: true},
          {field: 'stock_history',          label: 'stock-status.stock-history',  width: '7%',    sortable: false, expand: true}
        ],
        rows   : [],
        pagination : { total_pages: 1 },
        options : { pagination: true }
      },
      table_filter: {
        product_category_id: 0,
        key_word: '',
        usage_status: options.usage_status.all,
        status: options.good_status.list_default,
        page_size: options.pagination.big,
        page_number: 1,
        shop_id: 0,
      },

      category_options: [],
    }
  },
  computed:{
    ...mapGetters('stock_internal_use',{
      x_products_with_stock : 'getProductsWithStock',
    }),
    ...mapGetters('stock_safety', {
      x_stock_safety_action: 'getStockSafetyAction',
    }),
    product_placeholder(){ return this.$i18n.t('stock-internal-use.product-code-or-name') },
    text_all(){ return this.$i18n.t('general.all') },
    table_intro(){
      let intro = this.$i18n.t('stock-status.stock-status-intro')
      intro = intro.replace('{records}', formatMoney(this.x_products_with_stock.pagination.total_items, 0))
      intro = intro.replace('{qty}', formatMoney(this.stock_intro.total_qty, 0))
      intro = intro.replace('{valuation}', formatMoney(this.stock_intro.total_valuation, 0))
      return intro
    },
    table_intro_ui(){return this.$i18n.t('stock-status.stock-status-intro-ui')}
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
    await this.loadProductCategoryOptionsAsync()

    // stock-internal-use
    this.table_filter.shop_id = this.shop_data.shop_id
    await this.onLoadTableData()
    await this.onLoadTableIntro()
  },

  methods:{
    ...mapMutations('stock_internal_use',[
      'setProductsWithStock',
    ]),
    ...mapMutations('stock_safety',[
      'setStockSafetyAction',
      'setStockDecreaseAction',
      'setStockHistoryViewProductCode'
    ]),
    formatMoney,

    async loadProductCategoryOptionsAsync(){
      let tmp_all_option = { id: 0, name: this.text_all}
      let response = await this.getProductCategorysAsyncMixin()

      if(response.is_ok){
        this.category_options = [tmp_all_option, ...response.data.items]
        this.table_filter.category_id = tmp_all_option.id
      }
      else {
        this.showAlert(response.error_messages)
      }
    },

    // table
    async onLoadTableData(){
      this.preLoader()
      let response = await this.getProductsWithStockAsyncMixin(this.table_filter)
      this.preLoader(false)
      
      if(response.is_ok){
        this.setProductsWithStock(response.data)
        this.table_data.rows       = this.x_products_with_stock.items
        this.table_data.pagination = this.x_products_with_stock.pagination
      }
      else {
        this.showAlert(response.error_messages)
      }
    },
    async onLoadTableIntro(){
      let response = await this.getProductsWithStockAndTotalValuationAsyncMixin(this.table_filter)
      
      if(response.is_ok){
        this.stock_intro = response.data
      }
      else {
        this.showAlert(response.error_messages)
      }
    },
    onSearch(){
      this.table_filter.page_number = 1
      this.onLoadTableData()
      this.onLoadTableIntro()
    },
    onChangePage(page_number){
      this.table_filter.page_number = page_number
      this.onLoadTableData()
    },

    // stock safety
    onActionStockSafety(product){
      let stock_safety_action = {
        action : 0,
        data   : product
      }
      this.setStockSafetyAction(stock_safety_action)
      this.showDialogById('stock-safety-action-modal')
    },
    onStockSafetyUpdated(){
      this.onSearch()
    },

    // stock decrease
    onActionAddStockDecrease(action, product){
      let stock_decrease_action = {
        action: action,
        data  : product
      }
      this.setStockDecreaseAction(stock_decrease_action)
      this.showDialogById('stock-decrease-action-modal')
    },
    onStockDecreaseAdded(){
      this.onSearch()
    },

    // stock history
    onViewStockHistory(product){
      this.setStockHistoryViewProductCode(product.code)
      this.$router.push('/stock-history')
    },
  }
}
</script>

<style lang="scss">
@import './stock-status.scss';
</style>