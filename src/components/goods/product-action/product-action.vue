<template>
  <b-modal id="action-product-modal"
           :title="form_title"
           :no-close-on-backdrop="true"
           hide-footer
           class="action-product-modal"
           @show="onLoadForm()">
    <form ref="form" class="form-wrapper">
      <div class="row form-group">
        <div class="col-12 col-sm-5">
          <label class="require">{{ $t('products.product-code') }}</label>
        </div>
        <div class="col-12 col-sm-7">
          <b-form-input v-model="product.fields.code" :disabled="!allow_edit" type="text" />
        </div>
      </div>
      <div class="row form-group">
        <div class="col-12 col-sm-5">
          <label class="require">{{ $t('products.product-name') }}</label>
        </div>
        <div class="col-12 col-sm-7">
          <b-form-input v-model="product.fields.name" :disabled="!allow_edit" type="text"/>
        </div>
      </div>
      <div class="row form-group">
        <div class="col-12 col-sm-5">
          <label class="require">{{ $t('products.category') }}</label>
        </div>
        <div class="col-12 col-sm-7">
          <b-form-select v-model="product.fields.product_category_id" :options="category_options_action_product" :disabled="!allow_edit"
                         value-field="id" text-field="name"/></div>
      </div>
      <div class="row form-group">
        <div class="col-12 col-sm-5">
          <label>{{ $t('products.bar-code') }}</label>
        </div>
        <div class="col-12 col-sm-7">
          <b-form-input v-model="product.fields.bar_code" :disabled="!allow_edit" type="text"/>
        </div>
      </div>
      <div class="row form-group">
        <div class="col-12 col-sm-5">
          <label>{{ $t('products.specification') }}</label>
        </div>
        <div class="col-12 col-sm-7">
          <b-form-input v-model="product.fields.specification" :disabled="!allow_edit" type="text"/>
        </div>
      </div>
      <div class="row form-group">
        <div class="col-12 col-sm-5">
          <label>{{ $t('products.supplier-price') }}</label>
        </div>
        <div class="col-12 col-sm-7">
          <input-money v-model="product.fields.supplier_price" :disabled="!allow_edit" :decimal="0"/>
        </div>
      </div>
      <div class="row form-group">
        <div class="col-12 col-sm-5">
          <label>{{ $t('products.retail-price') }}</label>
        </div>
        <div class="col-12 col-sm-7">
          <!-- :decimal="2" -->
          <input-money v-model="product.fields.retail_price" :disabled="!allow_edit" :decimal="0"/>
        </div>
      </div>
      <div class="row form-group">
        <div class="col-12 col-sm-5">
          <label>{{ $t('products.safety-stock') }}</label>
        </div>
        <div class="col-12 col-sm-7">
          <input-money v-model="product.fields.stock_safety" :decimal="0"/>
        </div>
      </div>
      <div class="row form-group">
        <div class="col-12 col-sm-5">
          <label class="require">{{ $t('products.usage') }}</label>
        </div>
        <div class="col-12 col-sm-7">
          <b-form-checkbox-group v-model="product.fields.usage" :disabled="!allow_edit" :options="usage_options"/>
        </div>
      </div>
      <div class="row form-group notes">
        <div class="col-12 col-sm-5">
          <label>{{ $t('products.notes') }}</label>
        </div>
        <div class="col-12 col-sm-7">
          <b-form-textarea v-model="product.fields.notes" :disabled="!allow_edit" :rows="3"/>
        </div>
      </div>
      <div class="row form-group status">
        <div class="col-12 col-sm-5">
          <label>{{ $t('products.status') }}</label>
        </div>
        <div class="col-12 col-sm-7">
          <radio-group v-model="product.fields.status" :options="options.option_goods_status" :buttons="true" 
                       :disabled="!allow_edit"/>
        </div>
      </div>
    </form>

    <error-box :errors="product_errors"/>
    <footer class="modal-footer">
      <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
    </footer>
  </b-modal>
</template>

<script>
import { checkStringEmpty } from '../../../helpers/common'
import { mapGetters, mapActions } from 'vuex'
import ProductViewModel from '../../../view-model/goods/product-view-model.js'
import ProductApi from '../../../api/goods/product-api'
import input_money from '../../common/form/input/input-money/input-money.vue' 
import { options } from '../../../helpers/options'
import radio_group from '../../common/form/radio/radio-group/radio-group'
import error_box from '../../common/form/error-box/error-box' 
import btn_action_group from '../../common/button/btn-action-group/btn-action-group'
import component_base    from '../../common/component-base/component-base'

import StockSafetyViewModel from '../../../view-model/inventory/stock-safety/stock-safety-view-model'
import StockStatusApi from '../../../api/inventory/stock-status-api'

export default {
  components: {
    'input-money': input_money,
    'radio-group': radio_group,
    'error-box': error_box,
    'btn-action-group': btn_action_group
  },
  extends: component_base,
  props: {
    category_options_action_product: {
      type: Array,
      default: () => []
    }
  },
  data(){
    return {
      options,

      product: new ProductViewModel(),
      product_api: new ProductApi(),
      product_errors: [], 

      stock_status_api: new StockStatusApi(),

      form_title: '',
      form_options: {
        delete: false
      },
      allow_edit: true,
      original_safety_stock: 0
    }
  },
  computed: {
    ...mapGetters('product', {
      action_data: 'getProductAction'
    }),
    ...mapGetters('product_category', {
      product_categories_data: 'getProductCategories'
    }),
    usage_options(){
      return [
        { value: options.usage_status.sales,        text: this.$i18n.t('products.sales') },
        { value: options.usage_status.internal_use, text: this.$i18n.t('products.internal-use') },
      ]
    }
  },
  methods: {
    ...mapActions('product_category', [
      'getProductCategoriesDataAsync',
    ]),
    onCancel(){
      this.hideModal()
    },
    hideModal(){
      this.hideDialogById('action-product-modal')
    },
    async onLoadForm(){
      this.allow_edit = true
      if(this.action_data.action == options.form_actions.add) {
        this.form_title = this.$i18n.t('products.product-add')
        this.product = new ProductViewModel()
        this.product.fields.usage = [options.usage_status.sales, options.usage_status.internal_use]
      }
      if(this.action_data.action == options.form_actions.edit){
        if(this.action_data.data.shared) this.allow_edit = false 

        this.form_title = this.$i18n.t('products.product-edit')
        this.product.fields = Object.assign(this.product.fields, this.action_data.data)
        this.mapDataViewForm()
        
        // stock safety
        let query = {
          product_ids: [this.product.fields.id],
          shop_id: this.shop_data.shop_id
        }
        this.preLoader()
        let response = await this.stock_status_api.getProductWithStockStatusAsync(query)
        if(response.is_ok){
          this.product.fields.stock_safety = response.data.stock_safety
        }else this.product.fields.stock_safety = null
        this.preLoader(false)
        this.original_safety_stock = this.product.fields.stock_safety
      }

      this.product_errors = []
    },
    mapDataToApi(){
      if(this.product.fields.usage.length == 0) this.product.fields.usage = undefined
      else if(this.product.fields.usage.length > 1) this.product.fields.usage = options.usage_status.sales_and_internal_use
      else this.product.fields.usage = this.product.fields.usage[0]

      if(checkStringEmpty(this.product.fields.supplier_price)) this.product.fields.supplier_price = 0
      if(checkStringEmpty(this.product.fields.retail_price)) this.product.fields.retail_price = 0
      if(checkStringEmpty(this.product.fields.stock_safety)) this.product.fields.stock_safety = 0
    },
    mapDataViewForm(){
      if(this.product.fields.usage == undefined) this.product.fields.usage = []
      else if(this.product.fields.usage == options.usage_status.sales_and_internal_use) {
        this.product.fields.usage = [options.usage_status.sales, options.usage_status.internal_use]
      }
      else this.product.fields.usage = [this.product.fields.usage]

      if(this.product.fields.supplier_price == 0) this.product.fields.supplier_price = ''
      if(this.product.fields.retail_price == 0) this.product.fields.retail_price = ''
    },
    onConfirm(){
      if(this.action_data.action == options.form_actions.add){
        this.submitActionAsync('addProductAsync', 'reload-page', false)
      }
      else{
        if(!this.action_data.data.shared){
          this.submitActionAsync('updateProductAsync', 'update-page', false)
        }
        else if(this.product.fields.stock_safety != this.original_safety_stock){
          this.submitActionAsync('', 'update-page', true)
        }
        else if(this.product.fields.stock_safety == this.original_safety_stock) this.onCancel()
      }
    },
    // api_action is connect to api, success_action is return UI event
    async submitActionAsync(api_action, success_action, only_update_safty_stock){
      this.product.fields = Object.assign(this.product.fields, this.shop_data)
      this.mapDataToApi()
      //stock-safety
      let stock_safety_vm = new StockSafetyViewModel()
      stock_safety_vm.fields.product_code = this.product.fields.code
      stock_safety_vm.fields.product_name = this.product.fields.name
      stock_safety_vm.fields.stock_safety = this.product.fields.stock_safety
      stock_safety_vm.fields.shop_id      = this.shop_data.shop_id

      // validate
      this.product_errors = this.product.isValid()
      if(this.product_errors.length > 0) this.mapDataViewForm()
      else {
        if(!only_update_safty_stock)
        {
          this.preLoader()
          let result = await this.product_api[api_action](this.product.fields)
          this.preLoader(false)
          if(result.is_ok) {
            stock_safety_vm.fields.product_id   = result.data.id
            this.preLoader()
            let response = await this.stock_status_api.updateSafetyStockAsync(stock_safety_vm)
            this.preLoader(false)
            if(response.is_ok){
              this.actionSuccess(result, success_action)
            }
            else this.product_errors = result.error_messages
          }
          else this.product_errors = result.error_messages
        }
        else{
          stock_safety_vm.fields.product_id   = this.action_data.data.id
          this.preLoader()
          let response = await this.stock_status_api.updateSafetyStockAsync(stock_safety_vm)
          this.preLoader(false)

          if(response.is_ok){
            this.actionSuccess(response, success_action)
          }
          else this.product_errors = response.error_messages
        }

      }
    },
    actionSuccess(result, event){
      if(result.is_ok){
        this.$emit(event, result.data)
        this.hideModal()
      } 
      else {
        this.product_errors = result.error_messages
        this.mapDataViewForm()
      } 
    },
  }
}
</script>

<style lang="scss">
@import './product-action.scss';
</style>