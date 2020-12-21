<template>
  <main class="app-content">
    <section class="content add-internal-use-page">
      <div class="page-title">
        <h3>{{ $t('stock-internal-use.add-internal-use') }}</h3>
        <ul class="group-btn">
          <li class="btn"><router-link :to="{ name: 'stock-internal-use' }">{{ $t('stock-internal-use.stock-internal-use') }}</router-link></li>
        </ul>
      </div>

      <div class="filter-wrapper">
        <b-form class="row">
          <div class="col-md-10 col-xl-9 filter">
            <div class="row">
              <div class="col-sm-6 col-md-4 form-group category">
                <label>{{ $t('products.category') }}</label>
                <b-form-select v-model="table_filter.product_category_id" 
                               :options="category_options" value-field="id" text-field="name"/>
              </div>
              <div class="col-sm-6 col-md-3 form-group product">
                <label class="view-mobile">{{ $t('products.product') }}</label>
                <b-form-input v-model="table_filter.key_word" :placeholder="product_placeholder" type="text"/>
              </div>
              <div class="col-md-5 form-group include-products-for-sales">
                <b-form-checkbox v-model="table_filter.usage_status" 
                                 :value="options.usage_status.all" 
                                 :unchecked-value="options.usage_status.internal_use_all">
                  <span>{{ $t('stock-internal-use.include-products-for-sales') }}</span>
                </b-form-checkbox>
              </div>
            </div>
          </div>
          <div class="col-md-2 col-xl-3 filter-search">
            <button class="btn btn-search" @click.prevent="onSearch"><i class="btn-search-white"/> <span>{{ $t('general.search') }}</span></button>
          </div>
        </b-form>
      </div>
      
      <div id="table-stock-internal-uses" class="table table-stock-internal-uses">
        <view-table :data="table_data" @change-page="onChangePage">
          <template slot="edit" slot-scope="{row}">
            <a class="btn" @click="onActionAddInternalUse(options.form_actions.add, row)">{{ $t('general.add') }}</a>
          </template>
        </view-table>
      </div>

      <stock-internal-use-action @added="onAddedStockInternalUse"/>
    </section>
  </main>
</template>

<script>
import _ from 'lodash'
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
import StockInternalUseApi           from '../../../api/inventory/stock-internal-use-api'
import StockInternalUseViewModel     from '../../../view-model/inventory/stock-internal-use/stock-internal-use-view-model'
import stock_internal_use_action from '../../../components/inventory/stock-internal-use/stock-internal-use-action.vue'
import { convertDateToTimezone } from '../../../helpers/common'

export default {
  components : {
    'stock-internal-use-action': stock_internal_use_action,
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

      stock_internal_use_api: new StockInternalUseApi(),

      table_data   : {
        fields : [
          {field: 'code',          label: 'products.product-code', width: '15%',   sortable: false },
          {field: 'name',          label: 'products.product-name', width: '40%',   sortable: false },
          {field: 'specification', label: 'products.spec',         width: '20%',   sortable: false },
          {field: 'stock_on_hand', label: 'products.stock-on-hand',width: '15%',   sortable: false },
          {field: 'edit',          label: 'general.edit',          width: '5%',    sortable: false, expand: true}
        ],
        rows   : [],
        pagination : { total_pages: 1 },
        options : { pagination: true }
      },
      table_filter: {
        product_category_id: 0,
        key_word: '',
        usage_status: options.usage_status.internal_use_all,
        page_size: options.pagination.big,
        page_number: 1,
        shop_id: 0,
        status: options.good_status.list_default
      },

      category_options: [],
      staff_options: [],
    }
  },
  computed:{
    ...mapGetters('stock_internal_use',{
      x_products_with_stock : 'getProductsWithStock',
    }),
    product_placeholder(){ return this.$i18n.t('stock-internal-use.product-code-or-name') },
    text_all(){ return this.$i18n.t('general.all') }
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
    await this.loadStaffOptionsAsync()

    // stock-internal-use
    this.table_filter.date_from = moment(this.table_filter.date_from).date(1).toDate()
    this.table_filter.shop_id = this.shop_data.shop_id
    await this.onLoadTableData()
  },

  methods:{
    ...mapMutations('stock_internal_use',[
      'setProductsWithStock',
      'setStockInternalUseAction',
    ]),
    ...mapMutations('staff',[
      'setStaffOptions',
    ]),

    // filter
    onInputDateFrom(date){
      if(date == null)
        this.table_filter.date_from = convertDateToTimezone(new Date())
    },
    onInputDateTo(date){
      if(date == null)
        this.table_filter.date_to = convertDateToTimezone(new Date())
    },
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
    async loadStaffOptionsAsync(){
      let tmp_all_option = { id: 0, aliasname: this.text_all }
      let response = await this.getStaffsAsyncMixin()

      if(response.is_ok){
        this.setStaffOptions(response.data.items)
        this.staff_options = [tmp_all_option, ...response.data.items]
        this.table_filter.staff_id = tmp_all_option.id
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
    onSearch(){
      this.table_filter.page_number = 1
      this.onLoadTableData()
    },
    onChangePage(page_number){
      this.table_filter.page_number = page_number
      this.onLoadTableData()
    },

    // action
    onActionAddInternalUse(action, product){
      let stock_internal_use = new StockInternalUseViewModel()
      stock_internal_use.mapFieldsFromProduct(_.cloneDeep(product))
      let stock_internal_use_action = {
        action : action,
        data   : stock_internal_use.fields
      }
      this.setStockInternalUseAction(stock_internal_use_action)
      this.showDialogById('stock-internal-use-action-modal')
    },
    onAddedStockInternalUse(){
      this.onSearch()
    },
  }
}
</script>

<style lang="scss">
@import './add-internal-use.scss';
</style>