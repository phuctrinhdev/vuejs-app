<template>
  <div class="input-money-calculator-panel-wrapper">
    <input-money ref="input_money"
                 v-model="money_calculator" :decimal="0" :zero="false"
                 @input="onInput"/>
    <div class="clear" @click="onClearMoneyCalculator">x</div>

    <div class="calculator-wrapper">
      <div class="number">
        <ul>
          <li v-for="(character, index) in number_options" :key="index" @click="onInputCharacter(character)">{{ character }}</li>
          <li class="delete" @click="onDeleteCharacter"><i class="pad-back"/></li>
        </ul>
      </div>
      <div class="action">
        <ul class="zero-many">
          <li class="zero3" @click="onInputCharacter('000')">000</li>
          <li class="zero4" @click="onInputCharacter('0000')">0000</li>
        </ul>
        <ul class="action-btn">
          <li class="confirm" @click="onConfirm">{{ $t('general.confirm') }}</li>
          <li class="cancel" @click="onCancel">{{ $t('general.cancel') }}</li>
          <!-- <li class="delete" @click="onDeleteCharacter"><i class="pad-back"/></li> -->
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import input_money from '../input-money/input-money'
import component_base from '../../../component-base/component-base'

let MAX_CHARACTER_INPUT_MONEY = 12

export default {
  components: {
    'input-money': input_money,
  },
  extends: component_base,
  props:{
    value:{
      type: [String, Number],
      default: 0
    },
  },
  data(){
    return {
      set: '',

      number_options: [1,2,3,4,5,6,7,8,9,0,'00']
    }
  },
  computed: {
    waring_max_number(){return this.$i18n.t('validate_messages.maxLength')},
    waring_input_number(){return this.$i18n.t('validate_messages.number')},
    money_calculator: {
      set(new_value){
        this.setVmodel(new_value)
      },
      get(){
        return this.value
      }
    }
  },
  methods: {
    // action modal
    onCancel(){
      this.$emit('cancel')
    },
    onConfirm(){
      this.$emit('confirm')
    },

    // action panel
    onInput(){
      if(this.isValid(this.set)){
        this.$emit('input', this.set)
      }
    },
    onInputCharacter(character){
      let current_number = Math.round(Number(this.set))
      let tmp_money_calculator = current_number + character.toString()
      this.onSetVmodel(tmp_money_calculator)
    },
    onDeleteCharacter(){
      let current_number_string = this.set.toString()
      let tmp_money_calculator = current_number_string.substr(0, current_number_string.length - 1)
      this.onSetVmodel(tmp_money_calculator)
    },
    onClearMoneyCalculator(){
      this.onSetVmodel(0)
    },
    onSetVmodel(money_calculator){
      if(this.isValid(money_calculator)){
        this.setVmodel(money_calculator)
        this.$emit('input', money_calculator)
      }
    },
    setVmodel(value){
      this.set = value.toString().replace(/,/g,'')
    },
    isValid(money_calculator){
      let is_valid = true
      let tmp_number = Number(money_calculator)
      let tmp_messages = []
      let tmp_message = ''

      if(isNaN(tmp_number)){
        is_valid = false
        tmp_message = this.waring_input_number.replace('{field}', this.$i18n.t('general.number'))
        tmp_messages.push(tmp_message)
      }
      if(tmp_number > 999999999999){
        is_valid = false
        tmp_message = this.waring_max_number.replace('{field}', this.$i18n.t('general.number'))
        tmp_message = tmp_message.replace('{max_value}', MAX_CHARACTER_INPUT_MONEY)
        tmp_messages.push(tmp_message)
      }

      if(!is_valid){
        this.showAlert(tmp_messages)
        this.set = this.value
      }
      return is_valid
    },

    // UI
    autoSelectMoney(){
      this.$nextTick(() => {
        this.$refs.input_money.autoSelectInput()
      })
    }
  }
}
</script>

<style lang="scss">
@import './input-money-calculator-panel.scss';
</style>