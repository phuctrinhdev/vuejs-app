<template>
  <div class="common-style add-item-modal">
    <b-modal id="sales-type-action-modal"
             :title="t_form_title"
             :no-close-on-backdrop="true"
             hide-footer
             size="sm"
             class="sales-type-action-modal"
             @show="onLoadForm()">
      <misc-codes-item-form :model="sales_type" :errors="errors"
                            @confirm="onConfirm" @cancel="onCancel"/>
    </b-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import { options }            from '../../../../helpers/options'
import SalesTypeViewModel     from '../../../../view-model/sales/sales-type-view-model'
import SalesTypeApi           from '../../../../api/sales/sales-type-api'

import component_base         from '../../../common/component-base/component-base'
import misc_codes_item_form   from '../misc-codes-item-form/misc-codes-item-form'

export default {
  components: {
    'misc-codes-item-form': misc_codes_item_form
  },
  extends: component_base,
  data(){
    return {
      options:options, 
      
      sales_type: new SalesTypeViewModel(),
      
      form_title: '',
      form_options: {
        delete: false
      },
    }
  },
  computed: {
    ...mapGetters('sales_type', {
      x_sales_type_action: 'getSalesTypeAction'
    }),
    t_form_title(){
      let tmp_title = ''
      if(this.x_sales_type_action.action == options.form_actions.add)
        tmp_title = this.$i18n.t('misc-codes.add-item')
      if(this.x_sales_type_action.action == options.form_actions.edit)
        tmp_title = this.$i18n.t('misc-codes.edit-item')
      return tmp_title
    }
  },
  methods: {
    ...mapActions('sales_type', [
      'setSalesTypeActionData'
    ]),
    hideModal(){
      this.hideDialogById('sales-type-action-modal')
    },
    onCancel(){
      this.hideModal()
    },
    onLoadForm(){
      if(this.x_sales_type_action.action == options.form_actions.add) {
        this.sales_type = new SalesTypeViewModel()
      }
      if(this.x_sales_type_action.action == options.form_actions.edit){
        this.sales_type.fields = Object.assign(this.sales_type.fields, _.cloneDeep(this.x_sales_type_action.data))
      }

      this.errors = []
    },
    async onConfirm(sales_type){
      this.sales_type.fields = Object.assign(this.sales_type.fields, sales_type.fields)
      this.sales_type.fields = Object.assign(this.sales_type.fields, this.shop_data)

      if(this.x_sales_type_action.action == options.form_actions.add) {
        await this.submitActionAsync('addSalesTypeAsync')
      }
      if(this.x_sales_type_action.action == options.form_actions.edit){
        await this.submitActionAsync('updateSalesTypeAsync')
      }
    },
    async submitActionAsync(api_action){
      // validate
      this.errors = this.sales_type.isValid() 
      if(this.errors.length == 0) {
        this.preLoader()
        let sales_type_api = new SalesTypeApi() 
        let result = await sales_type_api[api_action](this.sales_type)
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