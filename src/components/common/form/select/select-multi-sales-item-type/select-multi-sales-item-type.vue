<template>
  <multiselect ref="multiselect" 
               v-model="item_types" :options="item_types_options" :multiple="true"
               :searchable="false" :close-on-select="false" :clear-on-select="false" 
               :show-labels="false" :preserve-search="true" :disabled="disabled"
               :placeholder="select_items_text" label="name" track-by="value" 
               class="multi-checkbox select-multi-sales-item-type" 
               @input="onInput($event)"
               @mouseleave.native="onMouseleave">
    <template slot="selection" slot-scope="{ values }">
      <span v-if="values.length > 1" class="selected">{{ values.length }} {{ $t('general.selected') }}</span>
      <span v-else class="selected">
        <span v-for="item in values" :key="item.index">
          {{ item.name }}
        </span>
      </span>
    </template>
  </multiselect>
</template>

<script>
// import _ from 'lodash'
import { options } from '../../../../../helpers/options'
import multiselect from 'vue-multiselect'

export default {
  components: {
    multiselect
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    has_outstanding: {
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
      options,

      set   : [],
      errors: []
    }
  },
  computed: {
    item_types: {
      set(new_values){
        this.set = new_values
      },
      get(){
        return this.value
      }
    },
    item_type_first(){
      return { name: this.$i18n.t('sales.select-items'), $isDisabled: true }
    },
    item_type_options(){
      let tmp_options = [
        { name: this.$i18n.t('report.service'),             value: options.sales_enum.goods_type.service },
        { name: this.$i18n.t('report.product'),             value: options.sales_enum.goods_type.product },
        { name: this.$i18n.t('report.prepaid-card'),        value: options.sales_enum.goods_type.prepaid_card },
        { name: this.$i18n.t('report.prepaid-service'),     value: options.sales_enum.goods_type.prepaid_service },
      ]
      if(this.has_outstanding){
        let outstanding_option = { name: this.$i18n.t('report.outstanding-payment'), value: 5 }
        tmp_options = [...tmp_options, outstanding_option]
      }
      return tmp_options
    },
    item_types_options(){
      return [this.item_type_first, ...this.item_type_options]
    },
    select_items_text(){return this.$i18n.t('sales.select-items')},
    text_choose_at_least_one_item(){
      return this.$i18n.t('sales-invoice-tab.there-must-at-least-one-item')
    },
  },
  methods: {
    onInput(){
      let tmp_errors = []
      let tmp_item_types = []
      for(let type of this.set){
        tmp_item_types.push(type.value)
      }
      if(tmp_item_types.length == 0){
        tmp_errors = [this.text_choose_at_least_one_item]
      }
      this.errors = tmp_errors
      this.$emit('input', this.set, tmp_item_types)
    },
    onMouseleave(){
      if(this.$refs.multiselect.isOpen)
        this.$refs.multiselect.toggle()
    }
  }
}
</script>

<style lang="scss">
.multiselect.multi-checkbox.select-multi-sales-item-type{
  min-height: auto;
  .multiselect__select:before {
    border-width: 9px 4.5px 0;
    border-color: rgba(0,0,0,0.6) transparent transparent;
  }
  .multiselect__tags {
    width: 200px;
    margin-top: 0;
    border: 1px solid $gray;
    border-radius: 0;
    .selected {
      color: $gray-dark;
    }
  }
  .multiselect__content {
    .multiselect__element {
      &:first-child {
        .multiselect__option.multiselect__option--disabled{
          background: transparent !important;
          span:before{
            display: none;
          }
        } 
      }
      .multiselect__option.multiselect__option--disabled{
        background: $gray-lighten !important;
        span:before{
          display: block;
          content: "\2714";
          position: absolute;
          top: 4px;
          left: 10px;
        }
      }
    }
  } 
}
</style>