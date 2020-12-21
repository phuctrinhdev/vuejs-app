<template>
  <div class="common-style add-item-modal">
    <b-modal id="payment-method-action-modal"
             :title="form_title"
             :no-close-on-backdrop="true"
             hide-footer
             size="sm"
             class="payment-method-action-modal"
             @show="onLoadForm()">
      <misc-codes-item-form :model="payment_method" :errors="errors"
                            @confirm="onConfirm" @cancel="onCancel"/>
    </b-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import { options }            from '../../../../helpers/options'
import PaymentMethodViewModel from '../../../../view-model/sales/payment-method-view-model'
import PaymentMethodApi       from '../../../../api/sales/payment-method-api'

import component_base         from '../../../common/component-base/component-base'
import misc_codes_item_form   from '../misc-codes-item-form/misc-codes-item-form'

import { cache_session }      from '../../../../helpers/common'

export default {
  components: {
    'misc-codes-item-form': misc_codes_item_form
  },
  extends: component_base,
  data(){
    return {
      options, 
      
      payment_method: new PaymentMethodViewModel(),
      
      form_options: {
        delete: false
      },
    }
  },
  computed: {
    ...mapGetters('payment_method', {
      x_payment_method_action: 'getPaymentMethodAction'
    }),
    form_title(){
      let tmp_title = ''
      if(this.x_payment_method_action.action == options.form_actions.add)
        tmp_title = this.$i18n.t('misc-codes.add-item')
      if(this.x_payment_method_action.action == options.form_actions.edit)
        tmp_title = this.$i18n.t('misc-codes.edit-item')
      return tmp_title
    }
  },
  methods: {
    ...mapActions('payment_method', [
      'setPaymentMethodActionData'
    ]),
    hideModal(){
      this.hideDialogById('payment-method-action-modal')
    },
    onCancel(){
      this.hideModal()
    },
    onLoadForm(){
      if(this.x_payment_method_action.action == options.form_actions.add) {
        this.payment_method = new PaymentMethodViewModel()
      }
      if(this.x_payment_method_action.action == options.form_actions.edit){
        this.payment_method.setFields(_.cloneDeep(this.x_payment_method_action.data))
      }

      this.errors = []
    },
    async onConfirm(payment_method){
      this.payment_method.fields = Object.assign(this.payment_method.fields, payment_method.fields)
      this.payment_method.fields = Object.assign(this.payment_method.fields, this.shop_data)

      if(this.x_payment_method_action.action == options.form_actions.add) {
        await this.submitActionAsync('addPaymentMethodAsync')
      }
      if(this.x_payment_method_action.action == options.form_actions.edit){
        await this.submitActionAsync('updatePaymentMethodAsync')
      }
    },
    async submitActionAsync(api_action){
      // validate
      this.errors = this.payment_method.isValid() 
      if(this.errors.length == 0) {
        this.preLoader()
        let payment_method_api = new PaymentMethodApi() 
        let result = await payment_method_api[api_action](this.payment_method)
        this.preLoader(false)

        if(result.is_ok) {
          this.$emit('action-success', result.data)
          cache_session.clearSessionPaymentMethodSetup()
          this.hideModal()
        }
        else this.errors = result.error_messages
      }
    }
  }
}
</script>