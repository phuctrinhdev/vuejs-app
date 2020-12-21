<template>
  <main class="app-content">
    <section class="content products-page">
      <div class="inner">
        <article class="row setup-top clearfix">
          <h3 class="col-4 col-sm-6">{{ $t('products.products') }}</h3>
          <ul class="col-8 col-sm-6 justify-content-end btn-group clearfix">
            <li><goods-btn v-if="show_add_button" :data="{ label: 'products.product-add' }" class="btn-large"
                           @click-action="onActionProduct(options.form_actions.add)"/></li>
            <li><a class="btn btn-large btn-excel">{{ $t('products.excel') }}</a></li>
          </ul>
        </article>
        <div class="row table-custom">
          <div class="col-12">
            <b-form>
              <b-form-group class="table-filter form-wrapper">
                <div class="col-sm-11 col-md-4 col-lg-3 form-group category">
                  <label>{{ $t('products.category') }}</label>
                  <b-form-select v-model="table_filter.product_category_id" :options="category_options_all"
                                 value-field="id" text-field="name"
                                 @mouseleave.native="onMouseLeaveSelect"/>
                </div>
                <div class="col-sm-11 col-md-5 col-lg-4 form-group product">
                  <label>{{ $t('products.product') }}</label>
                  <b-form-input v-model="table_filter.key_word" type="text" placeholder="Code or Name"/>
                </div>
                <button class="btn-submit" @click.prevent="onSearch"><i class="btn-search-white"/> <span>{{ $t('general.search') }}</span></button>
              </b-form-group>
            </b-form>

            <!-- table data -->
            <div class="table-data form-wrapper">
              <view-table :data="table_data" @change-page="onChangePage" @select-rows="onSelectRows">
                <!-- action at top table -->
                <template slot="table-actions">
                  <div class="total-data">{{ $t('products.all') }} {{ table_data.pagination.total_items }} {{ $t('products.records') }}</div>
                  <show-inactives v-model="table_filter.status" @input="onShowInactives"/>
                </template>
                <!-- table rows -->
                <template slot="supplier_price" slot-scope="{ row, props }">
                  {{ props.formattedRow.supplier_price }}
                </template>
                <template slot="retail_price" slot-scope="{ row, props }">
                  {{ props.formattedRow.retail_price }}
                </template>
                <template slot="edit" slot-scope="{ row }">
                  <goods-btn :data="{ label: 'general.edit', item: row }"
                             @click-action="onActionProduct(options.form_actions.edit, row)"/>
                </template>
                <!-- action at bottom table -->
                <template slot="table-actions-bottom">
                  <ul v-if="table_data.options.select_options.enabled" class="btn-group btn-status clearfix">
                    <li><goods-btn v-if="show_add_button" :data="{ label: 'general.active' }" class="btn-large"
                                   @click-action="onChangeProductStatus(options.good_status.active)"/></li>
                    <li><goods-btn v-if="show_add_button" :data="{ label: 'general.inactive' }" class="btn-large"
                                   @click-action="onChangeProductStatus(options.good_status.inactive)"/></li>
                  </ul>
                </template>
              </view-table>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- modal action -->
    <product-action :category_options_action_product="category_options_action_product" @reload-page="onReloadPage" @update-page="onUpdatePage"/>
  </main>
</template>

<script>
import product_action from '../../../components/goods/product-action/product-action.vue'
import component_base    from '../../../components/common/component-base/component-base'
import pagination from '../../../components/common/pagination/pagination.vue'
import show_inactives from '../../../components/common/show-inactives/show-inactives.vue'

import { formatMoney } from '../../../helpers/common'
import { mapGetters, mapActions } from 'vuex'
import ProductApi from '../../../api/goods/product-api'
import { options } from '../../../helpers/options'
import goods_btn from '../../../components/goods/goods-btn/goods-btn.vue'
import view_table from '../../../components/common/view-table/view-table'
import { showGoodsAddButton, checkShowGoodsSharedCol } from '../../../config/permission'

export default {
  components: {
    pagination,
    'show-inactives': show_inactives,
    'goods-btn': goods_btn,
    'view-table': view_table,
    'product-action': product_action
  },
  extends: component_base,
  data() {
    return {
      options,

      product_api: new ProductApi(),

      // table
      table_data: {
        fields: [
          { field: 'shared', label: 'services.shared',  width: '5%', sortable: false,  thClass: this.showShareCol, tdClass: this.showShareCol, formatFn: this.formatTrueFalseCol  },
          { field: 'product_category_name', label: 'products.category',       width: '15%', sortable: false },
          { field: 'code',                  label: 'products.product-code',   width: '15%', sortable: false },
          { field: 'name',                  label: 'products.product-name',   width: '30%', sortable: false },
          { field: 'supplier_price',        label: 'products.supplier-price', width: '10%', sortable: false, expand: true, formatFn: this.formatMoneyCol },
          { field: 'retail_price',          label: 'products.retail-price',   width: '10%', sortable: false, expand: true, formatFn: this.formatMoneyCol },
          { field: 'type',                  label: 'products.usage',           width: '5%', sortable: false },
          { field: 'edit',                  label: 'general.edit',            width: '10%', sortable: false, expand: true }
        ],
        rows:[],
        groups: [
          { name: 'shared', rows: [] },
          { name: 'unshared', rows: [] }
        ],
        pagination:{
          total_pages: 1
        },
        options: {
          pagination: true,
          select_options: {
            enabled: false,
            selectOnCheckboxOnly: true
          }
        },
      },
      table_filter: {
        product_category_id : 0,
        key_word            : '',
        usage_status        : options.usage_status.all,
        status              : options.good_status.list_default,
        page_size           : options.pagination.default,
        page_number         : 1,
        shop_id             : 0,
      },
      category_options: [],
      category_options_all: [
        { id: 0, name: 'All'}
      ],
      category_options_action_product: [],

      // change status
      selected_products: [],

      // modal action
      product_action: {},
      show_add_button: true
    }
  },
  computed: {
    ...mapGetters('user', {
      user_data: 'getUser',
    }),
    ...mapGetters('product_category', {
      product_categories_data: 'getProductCategories'
    }),
    ...mapGetters('product', {
      products_data: 'getProducts'
    }),
  },
  async created(){
    this.show_add_button = showGoodsAddButton(options.sharing_goods_type.product)
    // preload category options
    let product_category_param = {
      page_size: options.pagination.max,
      page_number: 1,
      shop_id: this.shop_data.shop_id,
      status: options.good_status.all
    }
    
    this.preLoader()
    await this.getProductCategoriesDataAsync(product_category_param)
    this.preLoader(false)

    if(this.product_categories_data.is_ok) {
      this.category_options = this.product_categories_data.data.items
      this.category_options_all = this.category_options_all.concat(this.product_categories_data.data.items)
    }
    else this.showAlert(this.product_categories_data.error_messages)

    // set table options & category options base allow shop product
    this.table_data.options.select_options.enabled = this.show_add_button
    this.category_options_action_product = this.category_options
  },
  mounted() {
    this.table_filter.shop_id = this.shop_data.shop_id
    this.loadTableData()
  },
  methods: {
    ...mapActions('product_category', [
      'getProductCategoriesDataAsync',
    ]),
    ...mapActions('product', [
      'getProductsDataAsync',
      'setProductActionData',
      'updateProductData'
    ]),
    formatMoneyCol(number){
      return formatMoney(number, 0) // :decimal="2"
    },
    showShareCol(){
      let class_name = 'hide'
      if(checkShowGoodsSharedCol(options.sharing_goods_type.product)) class_name = 'show-shared'
      return class_name
    },
    formatTrueFalseCol(shared){
      return shared == true? 'O' : 'X'
    },
    // table
    async loadTableData() {
      this.preLoader()
      await this.getProductsDataAsync(this.table_filter)
      
      if(this.products_data.is_ok){
        this.table_data.rows = this.products_data.data.items
        this.table_data.pagination = this.products_data.data.pagination
        this.table_data.pagination.total_pages = Math.ceil(this.table_data.pagination.total_items / this.table_data.pagination.page_size)

        this.table_data.rows.map(row => {
          this.convertUsageToType(row)
        })
      }
      else this.showAlert(this.products_data.error_messages)

      // group data for table UI
      this.table_data.groups[0].rows = this.table_data.rows

      this.preLoader(false)
    },
    formatMoney(num, decimal){
      formatMoney(num, decimal)
    },
    convertUsageToType(product){
      let type = ''
      switch (product.usage){
        case options.usage_status.sales:
          type = 'S'
          break
        case options.usage_status.internal_use:
          type = 'I'
          break
        case options.usage_status.sales_and_internal_use:
          type = 'A'
          break
      }
      this.$set(product, 'type', type)
    },
    onChangePage(page_num){
      this.table_filter.page_number = page_num
      this.loadTableData()
    },

    // table UI
    onSearch(){
      this.table_filter.page_number = 1
      this.loadTableData()
    },
    onShowInactives(){
      this.table_filter.page_number = 1
      this.loadTableData()
    },
    onSelectRows(rows) {
      this.selected_products = []
      for(let key in rows){
        this.selected_products.push(rows[key].id)
      }
    },
    async onChangeProductStatus(status){
      let update_status_data = {
        product_ids: this.selected_products,
        status: status,
        shop_id: this.shop_data.shop_id
      }

      if(this.selected_products.length > 0) {
        this.preLoader()
        let result = await this.product_api.updateProductStatusAsync(update_status_data)
        this.preLoader(false)
        
        if(result.is_ok) this.loadTableData()
        else this.showAlert(result.error_messages)
      }
    },

    // modal action
    onActionProduct(action, product = {}){
      this.product_action = {
        action: action,
        data: product
      }
      
      this.setProductActionData(this.product_action)
      this.showDialogById('action-product-modal')
    },

    // evenloadTableDatas
    onReloadPage(){
      this.loadTableData()
    },
    onUpdatePage(product){
      if(this.product_action.data.category_id != product.category_id || this.product_action.data.status != product.status) this.loadTableData()
      else {
        this.convertUsageToType(product)
        this.updateProductData(product)
      }
    },
  }
}
</script>

<style lang="scss">
@import './products.scss';
</style>
