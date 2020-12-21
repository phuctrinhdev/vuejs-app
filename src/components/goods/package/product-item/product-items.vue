<template>
  <div class="box-item-product">
    <div class="box-item"> 
      <div class="row"> 
        <div class="col-md-12"> 
          <div class="box-i-1">  
            <b-form-select v-model="category_id" :options="category_options" value-field="id" 
                           text-field="name" @input="onSelectCategory">
              <template slot="first">
                <option :value="0">{{ $t('packages.category') }}</option>
              </template>
            </b-form-select>

          </div>
          <div class="box-i-2"> 
            <b-form-input v-model="table_filter.key_word" :placeholder="$i18n.t('packages.product-code-or-name')" type="text"/>
          </div> 
          <div class="box-i-3"> 
            <button type="button" class="btn-submit" @click="onClickSearch">{{ $t('general.search') }}</button> 
          </div>
        </div>
      </div>
      <div class="box-i-product">   
        <div class="box-i-body">
          <h3>
            <span class="code"> {{ $t('packages.product-code') }} </span> 
            <span class="name"> {{ $t('packages.product-name') }} </span> 
          </h3>
          <b-list-group @scroll="onHandleScrollProduct">  
            <b-list-group-item v-for="(product, index) in data_product.items" :key="product.id" :variant="product.warning"
                               @click="onChooseProduct(product)"> 
                               
              <span class="no"> {{ (index + 1) }}  </span> 
              <span class="code">  {{ product.code }} </span> 
              <span class="name"> {{ product.name }} </span> 
            </b-list-group-item> 
          </b-list-group>
          <p class="lb-total-items">{{ $t('packages.total-items') }}: {{ data_product.pagination.total_items }}</p>
        </div>    
      </div> 
    </div>  
  </div>
</template>  
<script>  

import { mapGetters, mapActions } from 'vuex' 
import { GOODS_TYPE } from '../../../../config/constant'
import { options } from '../../../../helpers/options'
import goods_table from '../../goods-table/goods-table.vue'  
import component_base    from '../../../common/component-base/component-base'

export default {
  components: {    
    'goods-table': goods_table,  
  },
  extends: component_base,
  data() {
    return {   
      data_product: {
        items:[],
        is_loading_scroll:false,
        pagination: {
          total_pages: 1,
          total_items: 0,
        } 
      },
      table_filter: { 
        page_size: options.pagination.max,
        page_number: 1,
        shop_id: 0,
        status: options.good_status.list_default
      }, 
      table_filter_product: {
        product_category_id : 0,
        key_word            : '',
        usage_status        : options.usage_status.sales_all,
        status              : options.good_status.list_default,
        page_size           : options.pagination.max,
        page_number         : 1, 
        shop_id             : 0
      }, 
      category_options:[],
      category_id:0, 
      alerts: []
    }
  },
  computed: {
    ...mapGetters('product', {
      x_products_data: 'getProducts'
    }),
    ...mapGetters('product_category', {
      product_categories_data: 'getProductCategories'
    }),
  }, 
  created() {
    this.$root.$on('loadProductItem', this.loadProductItem)
  },
  methods: {  
    ...mapActions('product_category', [
      'getProductCategoriesDataAsync',
    ]),
    ...mapActions('product', [
      'getProductsDataAsync', 
    ]),
    loadProductItem(){ 
      this.category_id=0
      this.data_product = {
        items:[],
        is_loading_scroll:false,
        pagination: {
          total_pages: 1,
          total_items: 0,
        } 
      } 
      this.loadProductCategory() 
    },
    async loadProductCategory(){ 
      this.table_filter = Object.assign(this.table_filter, this.shop_data)   
      this.preLoader()
      await this.getProductCategoriesDataAsync(this.table_filter)  
      this.preLoader(false) 
      if(this.product_categories_data.is_ok){   
        this.category_options = this.product_categories_data.data.items  
      } else {
        this.showAlert(this.product_categories_data.error_messages)
      }
    }, 
    // table
    async loadProducts(is_load_scroll = false) {
      if(!is_load_scroll){  
        this.table_filter_product.page_number =1
      }
      this.table_filter_product = Object.assign(this.table_filter_product, this.shop_data) 
      this.preLoader()
      await this.getProductsDataAsync(this.table_filter_product)
       
      if(this.x_products_data.is_ok){ 
        Object.assign(this.data_product.pagination, this.x_products_data.data.pagination)   
        this.table_filter_product.page_number = this.table_filter_product.page_number + 1
        if(is_load_scroll){ 
          this.data_product.items = this.data_product.items.concat(this.x_products_data.data.items)
          this.data_product.is_loading_scroll = false
        }else{
          this.data_product.items = this.x_products_data.data.items 
        }
      }
      else this.showAlert(this.x_products_data.error_messages)
      this.preLoader(false)
    },  
    onChooseProduct(product){ 
      for(let row in this.data_product.items){
        if(this.data_product.items[row].id == product.id) {
          this.$set(this.data_product.items[row], 'warning', 'warning')
        }
        else this.$set(this.data_product.items[row], 'warning', '')
      }  
      this.$emit('choose-item', { type: GOODS_TYPE.PRODUCT, item: product} )
    }, 
    async onHandleScrollProduct(e){
      let sh = e.target.scrollHeight
      let st =  e.target.scrollTop
      let oh =  e.target.offsetHeight
      if((sh-st-oh+1) < 3){  
        if(this.data_product.is_loading_scroll == false 
        && this.table_filter_product.page_number <= this.data_product.pagination.total_pages ){
          this.data_product.is_loading_scroll = true
          this.loadProducts( true)
        }
      }
    },
    onSelectCategory(category_id){
      this.category_id=category_id
      this.table_filter_product.product_category_id = category_id
    },
    onClickSearch(){
      if(this.table_filter_product.key_word == undefined ){ 
        this.table_filter_product.key_word =''
      }
      if(this.table_filter_product.product_category_id  == undefined ){ 
        this.table_filter_product.product_category_id  =0
      }
      this.loadProducts() 
    }
  }
}
</script>

<style lang="scss">
@import './product-items.scss';
</style>