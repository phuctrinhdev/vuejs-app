<template>
  <div class="sales-item-products">
    <div class="filter">
      <div class="row view-pc">
        <div class="col-md-8 col-lg-7">
          <div class="form-group keyword">
            <input v-model="table_filter.key_word" :placeholder="$t('sales.search-sales-item-products-placeholder')">  
            <div class="btn btn-search" @click="onSearch"><i class="btn-search-white"/></div>
          </div>
        </div>
        <div class="col-md-4 col-lg-5">
          <div class="form-group product-category">
            <b-form-select v-model="table_filter.product_category_id" :options="category_options"
                           value-field="id" text-field="name"
                           @input="onInputProductCategory"/>
          </div>
        </div>
      </div>
      <div class="row view-mobile">
        <div class="col-12">
          <div class="form-group product-category">
            <label>{{ $t('products.category') }}</label>
            <b-form-select v-model="table_filter.product_category_id" :options="category_options"
                           value-field="id" text-field="name"
                           @input="onInputProductCategory"/>
          </div>
        </div>
        <div class="col-12">
          <div class="form-group keyword">
            <label>{{ $t('products.product') }}</label>
            <input v-model="table_filter.key_word" :placeholder="$t('sales.search-sales-item-products-placeholder-short')">  
            <div class="btn btn-search" @click="onSearch"><i class="btn-search-white"/></div>
          </div>
        </div>
      </div>
    </div>

    <div class="table-products">
      <view-table :data="table_data" @click-rows="onSelectProduct" @change-page="onChangePage">
        <template slot="retail_price" slot-scope="{ row }">
          {{ formatMoney(row.retail_price, 0) }}
        </template>
        <template slot="stock_on_hand" slot-scope="{ row }">
          {{ formatMoney(row.stock_on_hand, 0) }}
        </template>
      </view-table>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { options } from '../../../../helpers/options'
import { sales_options } from '../../../../helpers/options/sales-options'
// import ProductCategoryViewModel from '../../../../view-model/goods/product-category-view-model'
// import ProductViewModel from '../../../../view-model/goods/product-view-model'
import product_category_mixin from '../../../../helpers/mixins/product-category-mixin'
import product_mixin from '../../../../helpers/mixins/product-mixin'
import view_table from '../../../common/view-table/view-table.vue'
import component_base from '../../../common/component-base/component-base'

import { formatMoney } from '../../../../helpers/common'


export default {
  components: {
    'view-table': view_table
  },
  extends: component_base,
  mixins: [product_category_mixin, product_mixin],
  data() {
    return {
      options,
      sales_options,

      table_data: {
        fields: [
          { field: 'product_category_name', label: 'products.product-category', width: '25%', sortable: false },
          { field: 'code',                  label: 'products.product-code',     width: '15%', sortable: false },
          { field: 'name',                  label: 'products.product-name',     width: '35%', sortable: false },
          { field: 'retail_price',          label: 'products.retail-price',     width: '15%', sortable: false, expand: true },
          { field: 'stock_on_hand',         label: 'sales.stock-on-hand',       width: '10%', sortable: false, expand: true }
        ],
        rows:[],
        pagination:{
          total_pages: 1
        },
        options: {
          pagination: true
        },
      },
      table_filter: {
        product_category_id: 0,
        key_word: '',
        usage_status: options.usage_status.sales_all,
        page_size: options.pagination.default,
        page_number: 1,
        shop_id: 0,
        status: options.good_status.list_default
      },
      category_options: [],

      errors: [],
    }
  },
  created(){
    this.loadProductCategoryOptionsAsync()
    this.loadTableData()
  },
  methods: {
    formatMoney,
    async loadProductCategoryOptionsAsync(){
      let result = await this.getProductCategorysAsyncMixin()

      if(result.is_ok){
        this.category_options = [{ id: 0, name: 'All'}]
        this.category_options = this.category_options.concat(result.data.items)
      } else {
        this.showAlert(result.error_messages)
      }
    },
    async loadTableData(){
      this.table_filter.shop_id = this.shop_data.shop_id

      this.preLoader()
      let result = await this.getProductsWithStockAsyncMixin(this.table_filter)
      this.preLoader(false)
      
      if(result.is_ok){
        this.table_data.rows       = result.data.items
        this.table_data.pagination = result.data.pagination
      } else {
        this.showAlert(result.error_messages)
      }
    },
    onSearch(){
      this.table_filter.page_number = 1
      this.loadTableData()
    },
    onInputProductCategory(){
      this.loadTableData()
    },
    onChangePage(page_num){
      this.table_filter.page_number = page_num
      this.loadTableData()
    },

    onSelectProduct(row_product){
      let tmp_product = _.cloneDeep(row_product.row)
      this.$emit('select-product', tmp_product)
    },
  }
}
</script>

<style lang='scss'>
@import './sales-item-products.scss';
</style>