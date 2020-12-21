<template>
  <b-modal :id="modal_id" 
           :title="modal_title"
           :no-close-on-backdrop="true"
           hide-footer 
           class="alert-modal stock-safety-action-modal"  
           @show="onLoadForm()">
    <div class="form-group">
      <label>{{ $t('products.safety-stock') }}</label>
      <input-money v-model="stock_safety" :decimal="0" :zero="true"/>
    </div>

    <error-box :errors="errors"/>
    <footer class="modal-footer">
      <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
    </footer>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex' 
import component_base    from '../../common/component-base/component-base'
import input_money from '../../common/form/input/input-money/input-money'
import btn_action_group from '../../common/button/btn-action-group/btn-action-group'
import StockStatusApi from '../../../api/inventory/stock-status-api'
import StockSafetyViewModel from '../../../view-model/inventory/stock-safety/stock-safety-view-model'
import error_box from '../../../components/common/form/error-box/error-box'

export default {
  components: {
    'input-money': input_money,
    'btn-action-group': btn_action_group,
    'error-box': error_box
  },
  extends: component_base,
  data(){
    return {
      stock_safety: 0,
      stock_status_api: new StockStatusApi(),

      modal_id: 'stock-safety-action-modal',
      form_options: {
        delete: false
      },
      errors: []
    }
  },
  computed: {
    ...mapGetters('stock_safety', {
      x_stock_safety_action: 'getStockSafetyAction',
    }),
    modal_title(){
      return this.$i18n.t('products.safety-stock')
    }
  },
  methods: { 
    hideModal(){
      this.hideDialogById(this.modal_id)
    },
    onCancel(){
      this.hideModal()
    },
    onLoadForm(){
      this.stock_safety = this.x_stock_safety_action.data.stock_safety
    },
    async onConfirm(){
      let stock_safety_vm = new StockSafetyViewModel()
      stock_safety_vm.fields.product_id   = this.x_stock_safety_action.data.id
      stock_safety_vm.fields.product_code = this.x_stock_safety_action.data.code
      stock_safety_vm.fields.product_name = this.x_stock_safety_action.data.name
      stock_safety_vm.fields.stock_safety = this.stock_safety
      stock_safety_vm.fields.shop_id      = this.shop_data.shop_id

      this.errors = stock_safety_vm.isValid()
      if(this.errors.length == 0){
        this.preLoader()
        let response = await this.stock_status_api.updateSafetyStockAsync(stock_safety_vm)
        this.preLoader(false)

        if(response.is_ok){
          this.$emit('updated', this.stock_safety)
          this.onCancel()
        }
        else {
          this.showAlert(response.error_messages)
        }
      }
    }
  }
}
</script>

<style lang='scss'>
.stock-safety-action-modal {
  .form-group {
    display: flex;
    align-items: center;
    label {
      width: 150px;
    }
  }
}
</style>