<template> 
  <input ref="input"
         v-model="money"
         :disabled="disabled"
         class="form-control input-money" 
         @focus="onFocus"
         @input="onInput">
</template>

<script>
import { formatMoney } from '../../../../../helpers/common'

export default {
  props:{
    value:{
      type: [String, Number],
      default: 0
    },
    decimal:{
      type: [Number],
      default: 0
    },
    zero:{
      type: Boolean,
      default: false
    },
    negative:{
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data(){
    return {
      set: ''
    }
  },
  computed: {
    money: {
      set(value){
        this.set = value.replace(/,/g,'')
      },
      get(){
        let input = this.value

        if(!this.isNumber(input)){
          input = ''
        }
        else {
          input = formatMoney(input, this.decimal)
        }
        
        return input
      }
    },
  },
  methods: {
    isNumber(value){
      return value != null || value != undefined || value != ''
    },
    preventNegative(value){
      let tmp_number = Number(value)
      if(!this.negative && tmp_number < 0){
        value = tmp_number * -1
      }
      this.$forceUpdate()
      return value
    },
    onFocus(){
      this.set = this.preventNegative(this.value)
    },
    onInput(){
      if(isNaN(this.set))
        this.set = ''
      else
        this.set = this.preventNegative(this.set)
        
      this.$forceUpdate()
      this.$emit('input', this.set)
    },
    autoSelectInput(){
      this.$nextTick(() => {
        this.$refs.input.select()
      })
    }
  }
}
</script>

<style lang="scss">
.input-money {
  border-radius: 0;
}
</style>
