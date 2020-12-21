<template>
  <div class="sales-row-mini">
    <div :class="{ expand: row.show_more_on_mobile }" class="show-more-on-mobile">
      <p>
        {{ formatInvoiceDate(row.invoice_date_time_ts) }} {{ formatMoney(row.total_amount,0) }} 
        <span v-if="row.ref_type == sales_options.sales_ref_type.refund" class="tag-refund">{{ $t('sales-invoice-tab.refund') }}</span>
      </p>
      <div class="payment-detail">
        <p v-for="(payment, index) in row.payments" :key="index">
          - {{ payment.payment_method_name }}: {{ formatMoney(payment.payment_amount, 0) }}
        </p>
      </div>
      <p v-for="(item, index) in row.items" :key="index" class="sales-item">
        <span>{{ item.goods_name }} </span>
        <span class="color-red" v-html="formatSalesItemStaffs(item.staffs)"/>
      </p>
      <p class="notes color-red">{{ row.notes }}</p>
      <div v-if="row.show_more_on_mobile" class="menu">
        <template v-if="row.ref_status == sales_options.sales_status.deleted">{{ $t('general.deleted') }}</template>
        <template v-else-if="row.ref_type == sales_options.sales_ref_type.outstanding_payment">
          <div v-if="isDataOfCurrentShop(row)" class="btn outstanding-btn" @click="onDeleteOutstanding(row)">{{ $t('general.del') }}</div>
        </template>
        <template v-else>
          <menu-sales-actions :data="row"
                              :is_data_of_current_shop="isDataOfCurrentShop(row)"
                              :class="{ 'is-only-first-row': is_only_first_row }"
                              @action-sales="onActionSales"
                              @action-refund="onActionRefund"/>
        </template>
      </div>
      
      <span class="show-more-text" @click="row.show_more_on_mobile = !row.show_more_on_mobile">></span>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import SalesUtils                 from '../../../helpers/utils/sales-utils.js'
import { options } from '../../../helpers/options'
import { sales_options } from '../../../helpers/options/sales-options'
import component_base from '../../../components/common/component-base/component-base'
import menu_sales_actions from '../menu-sales-actions/menu-sales-actions.vue'
import {
  formatMoney,
  convertTimeStampToDate 
} from '../../../helpers/common'

export default {
  components: {
    'menu-sales-actions': menu_sales_actions
  },
  extends: component_base,
  props:{
    row:{
      type: Object,
      default: () => []
    },
    is_only_first_row:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      sales_options,
      SalesUtils,
    }
  },
  mounted(){
    // 
  },
  methods: {
    formatMoney,

    isDataOfCurrentShop(row){
      return row.shop_id == this.shop_data.shop_id
    },

    // action
    onDeleteOutstanding(row){
      this.$emit('delete-outstanding', row)
    },
    onActionSales(action, sales){
      this.$emit('action-sales', action, sales)
    },
    onActionRefund(action, refund){
      this.$emit('action-refund', action, refund)
    },
    
    // format
    formatStaffs(row){
      let tmp = ''
      if(row.ref_type == sales_options.sales_ref_type.outstanding_payment)
        tmp = row.staff_name
      else
        tmp = SalesUtils.formatStaffsOnSalesTable(row.items)
      if(tmp.length > 0)
        tmp = `(${tmp})`
      return tmp
    },
    formatSalesItemStaffs(staffs){
      let tmp = ''
      if(staffs.length == 1){
        tmp = staffs[0].staff_name
        if(this.row.show_more_on_mobile){
          tmp = `<br>- ${tmp} ${formatMoney(staffs[0].amount, 0)}`
        }
      }
      if(staffs.length > 1){
        if(!this.row.show_more_on_mobile){
          tmp = `${staffs[0].staff_name}+`
        }
        else{
          let tmp_staffs = staffs.map(s => `- ${s.staff_name} ${formatMoney(s.amount, 0)}`)
          tmp = `<br>${tmp_staffs.join('<br>')}`
        }
      }
      return tmp
    },
    formatInvoiceDate(invoice_date_time_ts){
      return moment(convertTimeStampToDate(invoice_date_time_ts,true)).format(options.standard_date_format.ymd)
    },
  }
}
</script>

<style lang='scss'>
@import './sales-row-mini.scss';
</style>