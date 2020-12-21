<template>
  <div class="common-style add-item-modal">
    <b-modal id="discount-category-action-modal"
             :title="t_form_title"
             :no-close-on-backdrop="true"
             hide-footer
             size="sm"
             class="discount-category-action-modal"
             @show="onLoadForm()">
      <div class="common-style add-item-modal">
        <form class="form-wrapper clearfix">
          <div class="row form-group">
            <div class="col-12 col-sm-4">
              <label class="require">{{ $t('misc-codes.item-name') }} </label>
            </div>
            <div class="col-12 col-sm-8">
              <input v-model="discount_category.fields.name" type="text" class="form-control">
            </div>
          </div>

          <div class="row form-group discount"> 
            <div class="col-12 col-sm-4" >  
              <label class="require">{{ $t('misc-codes.discount') }}</label>
            </div> 
            <div class="col-12 col-sm-8" >
              <input-money v-model="discount_category.fields.discount_value"/>
            </div>
            <div class="col-12 offset-sm-4 col-sm-8 radio-group">
              <radio-group v-model="discount_category.fields.discount_type" :options="options.sales_enum.discount_type_options" :buttons="true"/> 
            </div> 
          </div>

          <div class="row form-group">
            <div class="col-12 col-sm-4">
              <label>{{ $t('misc-codes.status') }} </label>
            </div>
            <div class="col-12 col-sm-8">
              <radio-group v-model="discount_category.fields.status" :options="options.option_goods_status" :buttons="true"/>
            </div>
          </div>
        </form>

        <error-box :errors="errors"/>
        <div class="modal-footer">
          <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import { options }                from '../../../../helpers/options'
import DiscountCategoryViewModel  from '../../../../view-model/sales/discount-category-view-model'
import DiscountCategoryApi        from '../../../../api/sales/discount-category-api'

import radio_group                from '../../../common/form/radio/radio-group/radio-group' 
import error_box                  from '../../../common/form/error-box/error-box' 
import btn_action_group           from '../../../common/button/btn-action-group/btn-action-group'
import component_base             from '../../../common/component-base/component-base'
import input_money                from '../../../common/form/input/input-money/input-money'

export default {
  components: {
    'radio-group': radio_group,
    'error-box': error_box,
    'btn-action-group': btn_action_group,
    'input-money': input_money
  },
  extends: component_base,
  data(){
    return {
      options:options, 
      
      discount_category: new DiscountCategoryViewModel(),
      
      form_title: '',
      form_options: {
        delete: false
      },
    }
  },
  computed: {
    ...mapGetters('discount_category', {
      x_discount_category_action: 'getDiscountCategoryAction'
    }),
    t_form_title(){
      let tmp_title = ''
      if(this.x_discount_category_action.action == options.form_actions.add)
        tmp_title = this.$i18n.t('misc-codes.add-item')
      if(this.x_discount_category_action.action == options.form_actions.edit)
        tmp_title = this.$i18n.t('misc-codes.edit-item')
      return tmp_title
    }
  },
  methods: {
    ...mapActions('discount_category', [
      'setDiscountCategoryActionData'
    ]),
    hideModal(){
      this.hideDialogById('discount-category-action-modal')
    },
    onCancel(){
      this.hideModal()
    },
    onLoadForm(){
      if(this.x_discount_category_action.action == options.form_actions.add) {
        this.discount_category = new DiscountCategoryViewModel()
      }
      if(this.x_discount_category_action.action == options.form_actions.edit){
        this.discount_category.fields = Object.assign(this.discount_category.fields, _.cloneDeep(this.x_discount_category_action.data))
      }

      this.errors = []
    },
    async onConfirm(){
      this.discount_category.fields = Object.assign(this.discount_category.fields, this.discount_category.fields)
      this.discount_category.fields = Object.assign(this.discount_category.fields, this.shop_data)

      if(this.x_discount_category_action.action == options.form_actions.add) {
        await this.submitActionAsync('addDiscountCategoryAsync')
      }
      if(this.x_discount_category_action.action == options.form_actions.edit){
        await this.submitActionAsync('updateDiscountCategoryAsync')
      }
    },
    async submitActionAsync(api_action){
      // validate
      this.errors = this.discount_category.isValid() 
      if(this.errors.length == 0) {
        this.preLoader()
        let discount_category_api = new DiscountCategoryApi() 
        let result = await discount_category_api[api_action](this.discount_category)
        this.preLoader(false)

        if(result.is_ok) {
          this.$emit('action-success', result.data)
          this.hideModal()
        }
        else this.errors = result.error_messages
      }
    }
  }
}
</script>