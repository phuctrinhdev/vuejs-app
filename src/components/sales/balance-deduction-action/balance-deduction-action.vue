<template>
  <b-modal id="balance-deduction-action-modal" 
           :title="form_title"
           :no-close-on-backdrop="true"
           hide-footer 
           class="balance-deduction-action-modal"
           @show="onLoadForm"
           @hide="onCancel">
    <div class="row">
      <div class="col-md-6">
        <radio-client-prepaid-card ref="radio_client_prepaid_card"
                                   v-model="client_prepaid_card_id_selected" 
                                   :is_exclude_prepaid_cards="is_exclude_prepaid_cards"
                                   @input-card="onInputClientPrepaidCard"/>
      </div>
      <div class="col-md-6">
        <input-money-calculator-panel ref="money_calculator_panel"
                                      v-model="balance_deduction"
                                      @confirm="onConfirm"
                                      @cancel="onCancel"/>
      </div>
    </div>
  </b-modal>
</template>


<script>
import _                            from 'lodash'
import { mapGetters }               from 'vuex'
import ClientPrepaidCardViewModel   from '../../../view-model/sales/prepaid-card/prepaid-card-view-model'
import radio_client_prepaid_card    from '../../common/form/radio/radio-client-prepaid-card/radio-client-prepaid-card.vue'
import input_money_calculator_panel from '../../common/form/input/input-money-calculator-panel/input-money-calculator-panel.vue'
import component_base               from '../../common/component-base/component-base'

export default {
  components: {
    'radio-client-prepaid-card'   : radio_client_prepaid_card,
    'input-money-calculator-panel': input_money_calculator_panel,
  },
  extends: component_base,
  props: {
    is_validate_max_deduction: {
      type: Boolean,
      default: true
    },
    is_exclude_prepaid_cards: {
      type: Boolean,
      default: false
    },
  },
  data(){
    return {
      client_prepaid_card_id_selected: 0,
      client_prepaid_card_selected: new ClientPrepaidCardViewModel(),
      
      balance_deduction: 0,
      
      errors: []
    }
  },
  computed: {
    ...mapGetters('sales', {
      x_sales_item_action: 'getSalesItemAction',
      x_money_calculator_panel_action: 'getMoneyCalculatorPanelAction',
    }),
    form_title(){return this.$i18n.t('sales.balance-deduction')},
    warning_balance_deduction_missing_input(){return this.$i18n.t('sales.warning-balance-deduction-missing-input')},
    warning_balance_deduction_max(){return this.$i18n.t('sales.warning-balance-deduction-max')}
  },
  methods: {
    hideModal(){
      this.hideDialogById('balance-deduction-action-modal')
    },
    onCancel(){
      this.hideModal()
    },
    onLoadForm(){
      this.errors = []
      this.client_prepaid_card_id_selected = 0
      this.client_prepaid_card_selected = new ClientPrepaidCardViewModel()
      
      // select card
      // let tmp_row = {
      //   row: {
      //     id: 0 // tmp_client_prepaid_card_id_selected
      //   }
      // }
      // if(this.x_sales_item_action.data.deducted_prepaid_goods_ref > 0){
      //   tmp_row.row.id = this.x_sales_item_action.data.deducted_prepaid_goods_ref
      // }
      // else if(this.x_sales_item_action.data.deducted_by_prepaid_goods_guid.length > 0) {
      //   tmp_row.row.id = this.x_sales_item_action.data.deducted_by_prepaid_goods_guid
      // }
      // this.$refs.radio_client_prepaid_card.onClickRowClientPrepaidCard(tmp_row)

      // input money
      this.balance_deduction = this.x_money_calculator_panel_action.data
      this.$refs['money_calculator_panel'].money_calculator = this.x_money_calculator_panel_action.data

      this.$nextTick(() => {
        if(this.$refs.radio_client_prepaid_card.table_data.rows.length == 1){
          this.$refs.radio_client_prepaid_card.onClickRowClientPrepaidCard({ row: this.$refs.radio_client_prepaid_card.table_data.rows[0] })
        }
        this.$refs.money_calculator_panel.autoSelectMoney()
      })
    },
    onConfirm(){
      let is_valid = true
      let error_messages = []

      if(!(this.client_prepaid_card_selected.fields.balance > 0 && this.balance_deduction >= 0)){
        is_valid = false
        error_messages.push(this.warning_balance_deduction_missing_input)
      }
      
      if(this.is_validate_max_deduction){
        if(this.balance_deduction > this.client_prepaid_card_selected.fields.balance){
          is_valid = false
          error_messages.push(this.warning_balance_deduction_max)
        }
      }

      if(!is_valid){
        this.showAlert(error_messages)
      } else {
        this.$emit('apply-balance-deduction', this.balance_deduction, _.cloneDeep(this.client_prepaid_card_selected.getFields()))
        this.hideModal()
      }
    },
    onInputClientPrepaidCard(client_prepaid_card_selected){
      this.client_prepaid_card_selected.setFields(client_prepaid_card_selected)
    }
  }
}
</script>

<style lang="scss">
@import './balance-deduction-action.scss';
</style>