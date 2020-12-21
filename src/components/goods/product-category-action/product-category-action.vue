<template>
  <b-modal id="action-product-category-modal" 
           :title="form_title"
           :no-close-on-backdrop="true"
           hide-footer
           no-stacking
           class="action-product-category-modal" 
           @show="onLoadForm()">
    <form class="form-wrapper"> 
      <div class="row form-group">
        <div class="col-12 col-sm-5">
          <label class="require">{{ $t('product-category.category-name') }}</label>
        </div>
        <div class="col-12 col-sm-7">
          <b-form-input v-model="product_category.fields.name" :disabled="!allow_edit" type="text"/>
        </div>
      </div> 
      <div v-if="product_category.fields.id > 0" class="row form-group status">
        <div class="col-12 col-sm-5">
          <label>{{ $t('product-category.status') }}</label>
        </div>
        <div class="col-12 col-sm-7">
          <radio-group v-model="product_category.fields.status" :options="options.option_goods_status" :buttons="true" 
                       :disabled="!allow_edit"/>
        </div>
      </div>
    </form>

    <error-box :errors="product_category_errors"/>
    <div class="modal-footer">
      <btn-action-group :data="form_options" 
                        @confirm="onConfirm" @cancel="onCancel" @delete="onDelete"/>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import ProductCategoryViewModel from '../../../view-model/goods/product-category-view-model.js'
import ProductCategoryApi from '../../../api/goods/product-category-api.js'
import { options } from '../../../helpers/options'
import radio_group from '../../../components/common/form/radio/radio-group/radio-group' 
import error_box from '../../common/form/error-box/error-box' 
import btn_action_group from '../../common/button/btn-action-group/btn-action-group'
import component_base    from '../../common/component-base/component-base'

export default {
  components: {
    'radio-group': radio_group,
    'error-box': error_box,
    'btn-action-group': btn_action_group
  },
  extends: component_base,
  data(){
    return {
      options,

      product_category: {},
      product_category_errors: [], 

      form_title: '',
      form_options: {
        delete: false,
        confirm: true
      },
      allow_edit: true
    }
  },
  computed: {
    ...mapGetters('product_category', {
      action_data: 'getProductCategoryAction'
    }),
  },
  beforeMount(){
    this.product_category = new ProductCategoryViewModel()
  },
  methods: {
    hideModal(){
      this.hideDialogById('action-product-category-modal')
    },
    onCancel(){
      this.hideModal()
    },
    onDelete(){
      this.submitActionAsync('deleteProductCategoryAsync', 'reload-page')
    },
    onLoadForm(){
      if(this.action_data.action == options.form_actions.add) {
        this.form_title = this.$i18n.t('product-category.product-category-add')
        this.form_options.delete = false
        this.allow_edit = true
        this.product_category = new ProductCategoryViewModel()
      }
      if(this.action_data.action == options.form_actions.edit){

        this.form_title = this.$i18n.t('product-category.product-category-edit')
        if(this.action_data.data.shared)
        {
          this.allow_edit = false
          this.form_options.confirm = false
          this.form_options.delete = false
        }    
        else
        {
          this.allow_edit = true
          this.form_options.confirm = true
          this.form_options.delete = true
        } 
        this.product_category.fields = Object.assign({}, this.action_data.data)
      }

      this.product_category_errors = []
    },
    onConfirm(){
      if(this.action_data.action == options.form_actions.add){
        this.submitActionAsync('addProductCategoryAsync', 'reload-page')
      }
      else if(this.action_data.action == options.form_actions.edit){
        this.submitActionAsync('updateProductCategoryAsync', 'update-page')
      }
    },
    // api_action is connect to api, success_action is return UI event
    async submitActionAsync(api_action, success_action){
      this.product_category.fields = Object.assign(this.product_category.fields, this.shop_data)

      // validate
      this.product_category_errors = this.product_category.isValid() 
      if(this.product_category_errors.length == 0) {
        this.preLoader()
        let product_category_api = new ProductCategoryApi() 
        let result = await product_category_api[api_action](this.product_category.fields)
        this.preLoader(false)

        if(result.is_ok) this.actionSuccess(result, success_action)
        else this.product_category_errors = result.error_messages
      }
    },
    actionSuccess(result, event){
      if(result.is_ok){
        this.$emit(event, result.data)
        this.hideModal()
      } 
      else {
        this.product_category_errors = result.error_messages
      } 
    }
  }
}
</script>

<style lang="scss">
@import './product-category-action.scss';
</style>