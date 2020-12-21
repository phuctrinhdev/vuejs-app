<template>
  <div class="edit-receivable-action-wrapper">
    <b-modal id="edit-receivable-action-modal"
             :title="$t('receivables.edit-outstanding')"
             :no-close-on-backdrop="true"
             size="sm"
             hide-footer
             @show="onLoadForm()"
             @hide="onCancel()">

      <!-- BEGIN MODAL-BODY -->
      <div class="modal-body">
        <div class="client-info">
          <h3><strong>{{ outstanding_edit.fields.client_name }}</strong></h3>
          <p>{{ $t('receivables.outstanding-balance') }} : {{ formatMoney(outstanding_edit.fields.outstanding_balance,0) }}</p>
        </div>
        <div class="new-balance">
          <label class="require">{{ $t('receivables.new-balance') }}</label>
          <input-money v-if="outstanding_edit.fields.new_balance == ''" v-model="outstanding_edit.fields.new_balance" :zero="false"/>
          <input-money v-else v-model="outstanding_edit.fields.new_balance" :zero="true"/>
        </div>
        <div class="notes">
          <label>{{ $t('receivables.notes') }}</label>
          <b-form-textarea v-model="outstanding_edit.fields.notes" :rows="4"/>
        </div>
        <error-box :errors="errors"/>
      </div>
      <!-- END MODAL-BODY -->

      <!-- BEGIN MODAL-FOOTER -->
      <div class="modal-footer">
        <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
      </div>
      <!-- END MODAL-FOOTER -->
    </b-modal>
  </div>
</template>

<script>
const EDITED_OUTSTANDING_EVENT_NAME = 'edited-outstanding'

import OutstandingPaymentAPI    from '../../../api/sales/outstanding-payment-api.js'
import OutstandingEditViewModel from '../../../view-model/sales/outstanding/outstanding-edit-view-model.js'
import error_box                from '../../../components/common/form/error-box/error-box.vue'
import btn_action_group         from '../../../components/common/button/btn-action-group/btn-action-group.vue'
import component_base           from '../../../components/common/component-base/component-base.vue'
import input_money              from '../../common/form/input/input-money/input-money.vue'
import { formatMoney }          from '../../../helpers/common.js'
import { mapGetters, mapMutations } from 'vuex'
export default {
  components : {
    'error-box'        : error_box,
    'btn-action-group' : btn_action_group,
    'input-money'      : input_money,
  },
  extends : component_base,
  data(){
    return {
      outstanding_api  : {},
      outstanding_edit : {}, 
      form_options     : {},
      errors           : [],
    }
  },
  computed : {
    ...mapGetters('sales_client_account',{
      x_client_account_action : 'getClientAccountAction'
    }),
    ...mapGetters('user',{
      x_user_information : 'getUser'
    })
  },
  created(){
    this.outstanding_api  = new OutstandingPaymentAPI()
    this.outstanding_edit = new OutstandingEditViewModel()
    this.form_options     = {
      delete  : false,
      confirm : true
    }
  },
  methods : {
    ...mapMutations('sales_client_account',[
      'setClientAccounts'
    ]),
    
    onLoadForm(){
      this.errors = []
      this.outstanding_edit.setFields(new OutstandingEditViewModel().getFields())
      this.outstanding_edit.setShopInformation(this.shop_data)
      this.outstanding_edit.setUserInformation(this.x_user_information)
      this.outstanding_edit.setClientAccount(this.x_client_account_action.data)
    },

    async onConfirm(){
      this.errors = this.outstanding_edit.isValid()
      if(this.errors.length == 0){
        this.preLoader()
        let response = await this.outstanding_api.updateOutstandingPaymentAsync(this.outstanding_edit)
        this.preLoader(false)
        if(response.is_ok){
          this.$emit(EDITED_OUTSTANDING_EVENT_NAME,response.data)
          this.hideModal()
        }else{
          this.errors = response.error_messages
        }
      }
    },

    onCancel(){
      this.hideModal()
    },
    hideModal(){
      this.hideDialogById('edit-receivable-action-modal')
    },
    formatMoney
  }
}
</script>

<style lang="scss">
@import './outstanding-editing-action.scss'
</style>