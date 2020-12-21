<template>
  <div class="receiving-item-edit-action-wrapper">
    <b-modal id="receiving-item-edit-action-modal"
             :no-close-on-backdrop="true"
             :title="$t('general.edit')"
             size="sm"
             hide-footer
             @show="onLoadForm()"
             @hide="onCancel()">

      <!-- BEGIN MODAL BODY -->
      <form class="form-wrapper">
        <div class="row form-group">
          <div class="col-12 col-sm-3">
            <label>{{ $t('receivings.unit-price') }}</label>
          </div>
          <div class="col-12 col-sm-9">
            <input-money id="txtEditUnitPrice" v-model="receiving_item_vm.unit_price" :decimal="0" 
                         :zero="true"/>
          </div>
        </div>
        <div class="row form-group">
          <div class="col-12 col-sm-3">
            <label>{{ $t('receivings.qty') }}</label>
          </div>
          <div class="col-12 col-sm-9">
            <input-money id="txtEditQty" v-model="receiving_item_vm.quantity" :decimal="0" 
                         :zero="true"/>
          </div>
        </div>
        <error-box :errors="errors"/>
      </form>
      <!-- END MODAL BODY -->

      <!-- BEGIN MODAL FOOTER -->
      <div class="modal-footer">
        <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
      </div>
      <!-- END MODAL FOOTER -->
    </b-modal>
  </div>
</template>

<script>
const UPDATED_RECEIVING_ITEM_EVENT_NAME = 'updated-receiving-item'

import ReceivingApi           from '../../../../api/inventory/receiving-api.js'
import ReceivingItemViewModel from '../../../../view-model/inventory/receivings/receiving-item-view-model.js'
import error_box              from '../../../common/form/error-box/error-box.vue'
import input_money            from '../../../common/form/input/input-money/input-money.vue'
import btn_action_group       from '../../../common/button/btn-action-group/btn-action-group'
import component_base         from '../../../common/component-base/component-base.vue'
import { mapGetters }         from 'vuex'
import _                      from 'lodash'
export default {
  components : {
    'error-box'       : error_box,
    'btn-action-group': btn_action_group,
    'input-money'     :input_money
  },
  extends: component_base,
  data(){
    return {
      receiving_item_vm  : {},
      receiving_api      : {},
      errors : []
    }
  },
  computed:{
    ...mapGetters('user',{
      x_user : 'getUser'
    }),
    ...mapGetters('receiving',{
      x_receiving_item_action : 'getReceivingItemAction'
    })
  },
  created(){
    this.receiving_item_vm = new ReceivingItemViewModel()
    this.receiving_api     = new ReceivingApi()
    this.form_options      = { delete: false }
  },
  methods:{
    onLoadForm(){
      this.errors = []
      this.receiving_item_vm = _.cloneDeep(this.x_receiving_item_action.data)
      this.receiving_item_vm.user_id   = this.x_user.user_id
      this.receiving_item_vm.user_name = this.x_user.user_name
      this.receiving_item_vm.shop_id   = this.shop_data.shop_id
    },
    onCancel(){
      this.hideModal()
    },
    async onConfirm(){
      this.errors = this.receiving_item_vm.isValid()
      if (this.errors.length == 0){
        this.preLoader()
        let response = await this.receiving_api.updateReceivingItemAsync(this.receiving_item_vm)
        this.preLoader(false)
        if (response.is_ok){
          this.$emit(UPDATED_RECEIVING_ITEM_EVENT_NAME,response.data)
          this.hideModal()
        }else{
          this.showAlert(response.error_messages)
        }
      }
    },
    hideModal(){
      this.hideDialogById('receiving-item-edit-action-modal')
    }
  }
}
</script>

<style lang="scss">
@import './receiving-item-edit-action.scss';
</style>
