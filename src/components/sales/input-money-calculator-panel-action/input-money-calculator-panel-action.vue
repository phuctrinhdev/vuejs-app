<template>
  <b-modal id="input-money-calculator-panel-action-modal" 
           :title="form_title"
           :no-close-on-backdrop="true"
           hide-footer 
           class="input-money-calculator-panel-action-modal"
           @show="onLoadForm"
           @hide="onCancel()">
    <input-money-calculator-panel ref="money_calculator_panel"
                                  v-model="money_calculator" 
                                  @cancel="onCancel"
                                  @confirm="onConfirm"/>
  </b-modal>
</template>


<script>
import { mapGetters } from 'vuex'
import component_base               from '../../common/component-base/component-base'
import input_money_calculator_panel from '../../common/form/input/input-money-calculator-panel/input-money-calculator-panel.vue'

export default {
  components: {
    'input-money-calculator-panel': input_money_calculator_panel,
  },
  extends: component_base,
  data(){
    return {
      money_calculator: 0,
      errors: []
    }
  },
  computed: {
    ...mapGetters('sales', {
      x_money_calculator_panel_action: 'getMoneyCalculatorPanelAction'
    }),
    form_title(){return this.$i18n.t('general.input')},
  },
  methods: {
    hideModal(){
      this.hideDialogById('input-money-calculator-panel-action-modal')
    },
    onCancel(){
      this.hideModal()
    },
    onLoadForm(){
      this.errors = []
      this.money_calculator = this.x_money_calculator_panel_action.data
      this.$refs['money_calculator_panel'].onSetVmodel(this.money_calculator)

      this.$nextTick(() => {
        this.$refs.money_calculator_panel.autoSelectMoney()
      })
    },
    onConfirm(){
      this.$emit('input-money-calculator', Number(this.money_calculator))
      this.hideModal()
    }
  }
}
</script>

<style lang="scss">
@import './input-money-calculator-panel-action.scss';
</style>