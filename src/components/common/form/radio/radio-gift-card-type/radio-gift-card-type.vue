<template>
  <div class="choose-giftcard-type">
    <b-form-checkbox v-model="is_gift_card" :value="true" @input="onInputIsGiftCard">
      {{ $t('sales.gift-card') }}
    </b-form-checkbox>
    <b-form-radio-group v-if="is_gift_card" v-model="gift_card_type" :options="gift_card_type_options" 
                        class="form-btn-group" @input="onInputGiftCardType"/>

    <div v-if="!is_gift_card" class="fail-code-img" @click="showGiftCardGuide"/>
  </div>
</template>

<script>
import { sales_options } from '../../../../../helpers/options/sales-options'
import component_base from '../../../component-base/component-base'

export default {
  extends: component_base,
  props: {
    value: {
      type: Number,
      default: 0
    },
    prepaid_card_type: {
      type: Number,
      default: 0
    }
  },
  data(){
    return {
      sales_options,
      is_gift_card: false,
      gift_card_type: sales_options.gift_card_type.sales,

      set: sales_options.gift_card_type.none
    }
  },
  computed: {
    gift_card_using_guide(){
      let guide = this.$i18n.t('sales.gift-card-using-guide-prepaid-card')
      if(this.prepaid_card_type == sales_options.sales_goods_type.prepaid_service)
        guide = this.$i18n.t('sales.gift-card-using-guide-prepaid-service')
      return guide
    },
    gift_card_type_options(){
      return [
        { text: this.$i18n.t('sales.sales'),  value: sales_options.gift_card_type.sales },
        { text: this.$i18n.t('sales.redeem'), value: sales_options.gift_card_type.redeem }
      ]
    }, 
    gift_card_type_selected:{
      set(new_value){
        this.set = new_value
      },
      get(){
        this.viewGiftCardTypeNone(this.value)
        return this.value
      }
    }
  },
  methods: {
    showGiftCardGuide(){
      this.showAlert([this.gift_card_using_guide])
    },
    viewGiftCardTypeNone(gift_card_type){
      if(gift_card_type == sales_options.gift_card_type.none){
        this.is_gift_card = false
      }
    },
    onInputIsGiftCard(is_gift_card){
      if(is_gift_card){
        this.gift_card_type          = sales_options.gift_card_type.sales
        this.gift_card_type_selected = sales_options.gift_card_type.sales
      } else {
        this.gift_card_type_selected = sales_options.gift_card_type.none
      }
      this.onEmitInput()
    },
    onInputGiftCardType(){
      this.gift_card_type_selected = this.gift_card_type
      this.onEmitInput()
    },
    onEmitInput(){ 
      this.$emit('input', this.set)
    }
  }
}
</script>

<style lang='scss'>
.choose-giftcard-type {
  position: relative;
  .fail-code-img {
    position: absolute;
    top: 1px;
    left: 90px;
  }
  .form-btn-group {
    margin-top: 5px;
    .custom-radio {
      display: inline-block;
      margin-right: 0;
      &:first-child {
        margin-right: 15px;
      }
    }
  }
  label {
    padding-top: 2px;
    font-weight: normal !important;
  }
}
</style>