<template>
  <div class="menu-sales-actions">
    <b-dropdown :dropleft="true"
                text="=" class="dropdown-custom"
                no-caret no-flip dropdown>
      <menu-sales-action-item :action="options.form_actions.view"/>
      <menu-sales-action-item v-if="is_data_of_current_shop" :action="options.form_actions.part"/>
      <menu-sales-action-item v-if="is_data_of_current_shop && is_sales" :action="options.form_actions.edit"/>
      <menu-sales-action-item v-if="is_data_of_current_shop" :action="options.form_actions.delete"/>
    </b-dropdown>
  </div>
</template>

<script>
import { options }       from '../../../helpers/options'
import { sales_options } from '../../../helpers/options/sales-options'

let MenuSalesActionItem = {
  props: {
    action: {
      type: Number,
      default: 0
    }
  },
  data(){
    return {
      options,
    }
  },
  computed: {
    action_text(){
      let tmp_text = ''
      if(this.action == options.form_actions.view) tmp_text = 'sales.view-detail'
      else if(this.action == options.form_actions.part) tmp_text = 'sales.edit-notes'
      else if(this.action == options.form_actions.edit) tmp_text = 'general.edit'
      else if(this.action == options.form_actions.delete) tmp_text = 'general.delete'
      return tmp_text
    }
  },
  methods:{
    onClickMenuItem(action){
      return this.$parent.$parent.onActionMenuItem(action)
    }
  },
  template: '<b-dropdown-item @click="onClickMenuItem(action)">{{ $t(action_text) }}</b-dropdown-item>'
}

export default {
  components: {
    'menu-sales-action-item': MenuSalesActionItem
  },
  props: {
    data: {
      type: Object,
      default: () => []
    },
    is_data_of_current_shop: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      options,
      sales_options,
    }
  },
  computed:{
    is_sales(){
      return this.data.ref_type == sales_options.sales_ref_type.sales
    }
  },
  methods: {
    onActionMenuItem(action){
      if(this.data.ref_type == sales_options.sales_ref_type.sales)
        this.$emit('action-sales', action, this.data)
      if(this.data.ref_type == sales_options.sales_ref_type.refund)
        this.$emit('action-refund', action, this.data)
    }
  }
}
</script>

<style lang='scss'>
@import './menu-sales-actions.scss';
</style>