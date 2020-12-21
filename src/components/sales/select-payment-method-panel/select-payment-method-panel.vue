<template>
  <div class="select-payment-method-panel">
    <div class="title">{{ $t('sales.payment') }}</div>
    <ul class="list-btn">
      <li v-for="(payment_method, index) in payment_method_options.viewing" :key="index">
        <a @click="onSelectPaymentMethod(payment_method.id)">{{ payment_method.name }}</a>
      </li>
      <li>
        <b-form-select v-model="payment_method_selected_id" :options="payment_method_options.selection" 
                       value-field="id" text-field="name"
                       @input="onSelectPaymentMethod">
          <template v-slot:first>
            <option :value="0">{{ $t('general.more') }}</option>
          </template>
        </b-form-select>
      </li>
    </ul>
  </div>
</template>


<script>
import _ from 'lodash'

export default {
  props: {
    payment_method_setup: {
      type: Array,
      default: () => []
    }
  },
  data(){
    return {
      payment_method_selected_id: 0,
      payment_method_selected: {}
    }
  },
  computed: {
    payment_method_options() {
      let tmp_options = {
        viewing: [],
        selection: []
      }
      for(let i in this.payment_method_setup){
        let tmp_payment_method = this.payment_method_setup[i]
        if(i < 3) // viewing 3 by default
          tmp_options.viewing.push(tmp_payment_method)
        else
          tmp_options.selection.push(tmp_payment_method)
      }
      return tmp_options
    }
  },
  methods: {
    onSelectPaymentMethod(payment_method_id){
      if(payment_method_id > 0){
        this.payment_method_selected = _.find(this.payment_method_setup, { 'id': payment_method_id })
        this.$emit('selected', this.payment_method_selected)
      }
    }
  }
}
</script>

<style lang="scss">
@import './select-payment-method-panel.scss';
</style>