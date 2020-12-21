<template>
  <b-modal id="receiving-item-add-action-modal"
           :no-close-on-backdrop="true"
           title="Add Product"
           size="xl"
           hide-footer
           class="receiving-item-add-action-modal"
           @show="onLoadForm()"
           @hide="onCancel()">

    <!-- BEGIN MODAL BODY -->
    <div class="row filter">
      <div class="col-8 col-sm-6">
        <b-form-input v-model="table_filter.key_word" type="text"/>
        <div class="btn btn-search view-pc" @click="onSearchAsync"><i class="btn-search-white"/></div>
      </div>
      <div class="col-4 col-sm-6">
        <b-form-select v-model="table_filter.product_category_id"
                       :options="category_options" value-field="id" text-field="name"
                       class="product-category">
          <template v-slot:first>
            <option :value="0">{{ $t('general.all') }}</option>
          </template>
        </b-form-select>
      </div>
    </div>
    <div class="table">
      <view-table :data="table_data" @change-page="onChangePageAsync">
        <template slot="unit_price" slot-scope="{row}">
          <input-money v-model="row.unit_price" :decimal="0" :zero="true"
                       @input="updateRecievingItem(row)"/>
        </template>
        <template slot="quantity" slot-scope="{row}">
          <input-money v-model="row.quantity" :decimal="0" :zero="true"
                       @input="updateRecievingItem(row)"/>
        </template>
        <template slot="amount" slot-scope="{row}">
          <span>{{ formatMoney(row.amount,0) }}</span>
        </template>
        <template slot="stock_on_hand" slot-scope="{row}">
          <span>{{ formatMoney(row.fields.stock_on_hand,0) }}</span>
        </template>
      </view-table>
    </div>

    <!-- BEGIN MODAL FOOTER -->
    <div class="modal-footer">
      <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
    </div>
  </b-modal>
</template>

<script>
const ADDED_RECEIVING_ITEM_EVENT_NAME = 'added-receiving-item'
import ReceivingApi                  from '../../../../api/inventory/receiving-api.js'
import input_money              from '../../../common/form/input/input-money/input-money.vue'
import btn_action_group              from '../../../common/button/btn-action-group/btn-action-group'
import component_base                from '../../../common/component-base/component-base.vue'
import view_table                    from '../../../common/view-table/view-table.vue'
import { mapGetters, mapActions }    from 'vuex'
import { options } from '../../../../helpers/options'
import { formatMoney }               from '../../../../helpers/common.js'
import _ from 'lodash'

export default {
  components : {
    'view-table'      : view_table,
    'btn-action-group': btn_action_group,
    'input-money':input_money
  },
  extends: component_base,
  data(){
    return {
      table_filter : {
        product_category_id : 0,
        key_word            : '',
        usage_status        : options.usage_status.all,
        status              : options.good_status.active,
        page_size           : options.pagination.default,
        page_number         : 1,
        shop_id             : 0,
      },
      category_options : [],
      form_options     : {},
      receiving_api    : {},
      receiving_items  : [],
      pagination       : {}
    }
  },
  computed:{
    ...mapGetters('product_category', {
      x_product_categories: 'getProductCategories'
    }),
    ...mapGetters('product', {
      x_products: 'getProducts'
    }),
    table_data(){
      return {
        fields : [
          {field: 'product_code',          label: 'receivings.product-code',   width: '15%',   sortable: false},
          {field: 'product_name',          label: 'receivings.product-name',   width: '25%',   sortable: false},
          {field: 'unit_price',            label: 'receivings.unit-price',     width: '15%',   sortable: false, expand: true },
          {field: 'quantity',              label: 'receivings.qty',            width: '15%',   sortable: false, expand: true },
          {field: 'amount',                label: 'receivings.amount',         width: '15%',   sortable: false, expand: true },
          {field: 'stock_on_hand',         label: 'receivings.stock-on-hand',  width: '15%',   sortable: false, expand: true }
        ],
        rows       : this.receiving_items,
        pagination : this.pagination,
        options    : {
          pagination : true
        }
      }
    }
  },
  async created(){
    this.receiving_api        = new ReceivingApi()
    this.table_filter.shop_id = this.shop_data.shop_id
    this.form_options         = { delete: false }

    await this.loadProductCategoriesAsync()
  },
  methods:{
    ...mapActions('product_category', [
      'getProductCategoriesDataAsync',
    ]),
    ...mapActions('product', [
      'setProductActionData',
      'updateProductData'
    ]),
    formatMoney,

    hideModal(){
      this.hideDialogById('receiving-item-add-action-modal')
    },
    onCancel(){
      this.hideModal()
    },

    async loadProductCategoriesAsync(){
      let product_category_param = {
        page_size   : 100,
        page_number : 1,
        shop_id     : this.shop_data.shop_id,
        status      : 0
      }
      this.preLoader()
      await this.getProductCategoriesDataAsync(product_category_param)
      this.preLoader(false)
      if(this.x_product_categories.is_ok){
        this.category_options = this.x_product_categories.data.items
      }else{
        this.showAlert(this.x_product_categories.error_messages)
      }
    },

    async onLoadForm(){
      this.resetTableFilter()
      await this.loadTableDataAsync()
    },
    resetTableFilter(){
      this.category_options = []
      this.table_filter.key_word = ''
      this.table_filter.product_category_id = 0
      this.table_filter.page_number = 1
    },
    async loadTableDataAsync(){
      this.preLoader()
      let response = await this.receiving_api.getProductsAsync(this.table_filter)
      this.preLoader(false)
      if(response.is_ok){
        this.receiving_items = response.data.items
        this.pagination      = response.data.pagination
      }
      else{
        this.showAlert(this.products_data.error_messages)
      }
    },
    async onSearchAsync(){
      this.table_filter.page_number = 1
      await this.loadTableDataAsync()
    },
    async onChangePageAsync(page){
      this.table_filter.page_number = page
      await this.loadTableDataAsync()
    },

    updateRecievingItem(receiving_item){
      let index = this.receiving_items.findIndex(x=>x.product_id == receiving_item.product_id)
      if(index != -1){
        this.$set(this.receiving_items,index,receiving_item)
      }
    },
    
    onConfirm(){
      let errors = []
      let tmp_receiving_items_vm = []
      tmp_receiving_items_vm     = this.receiving_items.filter(x=>x.fields.quantity > 0)

      for(let item of tmp_receiving_items_vm){
        let tmp_errors = item.isValid()
        if(tmp_errors.length > 0) 
          errors = errors.concat(tmp_errors)
      }
      if(errors.length == 0){
        this.$emit(ADDED_RECEIVING_ITEM_EVENT_NAME,tmp_receiving_items_vm)
        this.hideModal()
      }
      else
        this.showAlert(_.uniq(errors))
    },
  }
}
</script>

<style lang="scss">
@import './receiving-item-add-action.scss';
</style>
