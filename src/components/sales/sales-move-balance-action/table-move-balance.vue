<template>
  <div class="table-move-balance-wrapper">
    <p>{{ title }}</p>
    <table>
      <thead>
        <tr>
          <th>{{ $t('sales-prepaid-card-tab.prepaid-card') }}</th>
          <th>{{ $t('sales-prepaid-card-tab.balance') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in items" 
            :key="index" 
            :class="{'disabled' : item.fields.id == disabled_item_id}"
            @click.stop.prevent="onSelected(item)">
          <td>
            <b-form-radio
              v-model="selected_item_id"
              :disabled ="item.fields.id == disabled_item_id" 
              :name ="radio_name"
              :value="item.fields.id">
              {{ item.fields.prepaid_card_name }}
            </b-form-radio>
          </td>
          <td>{{ sales_utils.formatNoLimitNumber(item.fields.balance,0) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import component_base  from '../../common/component-base/component-base.vue'
import SalesUtils      from '../../../helpers/utils/sales-utils'

export default {
  extends : component_base,
  props : {
    title : {
      type : String,
      default : ''
    },
    radio_name : {
      type : String,
      default : ''
    },
    items : {
      type : Array,
      default : ()=>[]
    },
    disabled_item_id : {
      type : Number,
      default : undefined  
    },
    reset_state : {
      type    : Boolean,
      default : false
    }
  },
  data(){
    return {
      selected_item_id : 0,
      sales_utils      : SalesUtils,
    }
  },
  watch:{
    disabled_item_id:function(newVal){
      if(newVal == this.selected_item_id && this.reset_state){
        this.selected_item_id = 0
        this.$emit('selectedItem',0)
      }
    }
  },
  methods:{
    onSelected(item){
      if(item.fields.id != this.disabled_item_id){
        this.selected_item_id = item.fields.id
        this.$emit('selectedItem',item.fields.id)
      }
    }
  }
}
</script>

<style lang="scss">
@import './table-move-balance.scss';
</style>