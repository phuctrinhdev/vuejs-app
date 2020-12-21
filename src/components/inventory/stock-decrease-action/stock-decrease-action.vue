<template>
  <b-modal :id="modal_id" 
           :title="modal_title"
           :no-close-on-backdrop="true"
           hide-footer 
           class="alert-modal stock-safety-action-modal"  
           @show="onLoadForm()">
    <div class="form-wrapper">
      <div class="row form-group product-name">
        <div class="col-12 col-sm-4">
          <label>{{ $t('products.product-name') }}</label>
        </div>
        <div class="col-12 col-sm-8">
          <b-form-input v-model="stock_decrease.fields.product_name" disabled/>
        </div>
      </div>

      <div class="row form-group quantity">
        <div class="col-12 col-sm-4">
          <label class="require">{{ $t('stock-status.qty') }}</label>
        </div>
        <div class="col-12 col-sm-8">
          <input-money id="stock-status-qty" v-model="stock_decrease.fields.quantity" :decimal="0"
                       :zero="false"/>
        </div>
      </div>

      <div class="row form-group reason">
        <div class="col-12 col-sm-4">
          <label class="require">{{ $t('stock-status.reason') }}</label>
        </div>
        <div class="col-12 col-sm-8">
          <b-form-select id="stock-status-reason" v-model="stock_decrease.fields.action_reason" :options="reason_options"/>
        </div>
      </div>
      
      <div class="row form-group notes">
        <div class="col-12 col-sm-4">
          <label>{{ $t('general.notes') }}</label>
        </div>
        <div class="col-12 col-sm-8">
          <b-form-input id="stock-status-notes" v-model="stock_decrease.fields.notes"/>
        </div>
      </div>
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
import StockDecreaseViewModel from '../../../view-model/inventory/stock-status/stock-decrease-view-model'
import StockStatusApi from '../../../api/inventory/stock-status-api'
import { inventory_options } from '../../../helpers/options/inventory-options'
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
      inventory_options,

      form_options: {
        delete: false
      },
      stock_status_api: new StockStatusApi(),
      stock_decrease: new StockDecreaseViewModel(),

      modal_id: 'stock-decrease-action-modal',
      modal_title: 'Stock Decrease',

      errors: []
    }
  },
  computed: {
    ...mapGetters('stock_safety', {
      x_stock_decrease_action: 'getStockDecreaseAction',
    }),
    reason_options(){
      return [
        { value: inventory_options.action_reason_for_decrease_stock.damaged,     text: this.$i18n.t('stock-history.damaged') },
        { value: inventory_options.action_reason_for_decrease_stock.lost,        text: this.$i18n.t('stock-history.lost') },
        { value: inventory_options.action_reason_for_decrease_stock.out_of_date, text: this.$i18n.t('stock-history.out-of-date') },
        { value: inventory_options.action_reason_for_decrease_stock.return,      text: this.$i18n.t('stock-history.return') },
        { value: inventory_options.action_reason_for_decrease_stock.etc,         text: this.$i18n.t('stock-history.etc') }
      ]
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
      this.stock_decrease = new StockDecreaseViewModel()
      this.stock_decrease.mapFieldsFromProduct(this.x_stock_decrease_action.data)
    },
    async onConfirm(){
      this.stock_decrease.fields.user_id       = this.x_user.user_id,
      this.stock_decrease.fields.user_name     = this.x_user.user_name,
      this.stock_decrease.fields.shop_id       = this.shop_data.shop_id
      
      this.errors = this.stock_decrease.isValid()
      if(this.errors.length == 0){
        this.preLoader()
        let response = await this.stock_status_api.addStockDecreaseAsync(this.stock_decrease)
        this.preLoader(false)

        if(response.is_ok){
          this.$emit('added')
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