<template>
  <b-modal id="refund-detail-modal" 
           :title="t_form_title"
           :no-close-on-backdrop="true"
           hide-footer 
           class="refund-detail-modal"
           @show="onLoadForm">
    <div class="refund-info">
      <h1>{{ t_form_title }}</h1>
      <div class="detail">
        <div class="name">
          <template v-if="refund.fields.client_id > 0">{{ refund.fields.client_name }}</template>
          <template v-else>{{ $t('sales.unregistered-client') }}</template>
        </div>
        <div class="date">{{ moment(convertTimeStampToDate(refund.fields.invoice_date_time_ts, true)).format(common_options.standard_date_format.dymd) }}</div>
        <div class="status">
          <template v-if="refund.fields.status == sales_options.sales_status.completed">{{ $t('sales.completed') }}</template>
          <template v-if="refund.fields.status == sales_options.sales_status.deleted">{{ $t('sales.deleted') }}</template>
        </div>
      </div>
    </div>

    <div class="refund-items-table">
      <view-table :data="table_data">
        <template slot="goods_name" slot-scope="{ row }">
          {{ row.goods_name }}
        </template>
        <template slot="quantity" slot-scope="{ row }">
          <template v-if="isPrepaidService(row)">
            {{ formatMoney(row.deduction_amount,0) }}
          </template>
          <template v-else>
            {{ formatMoney(row.quantity, 0) }}
          </template>
        </template>
        <template slot="amount" slot-scope="{ row }">
          <div class="amount">
            {{ formatMoney(row.amount, 0) }}
            <span v-if="isDepositCard(row)"><br>({{ formatMoney(row.deduction_amount, 0) }})</span>
          </div>
        </template>
        <template slot="staffs" slot-scope="{ row }">
          <div v-html="formatRefundItemStaffs(row.staffs)"/>
        </template>
        <template slot="delete" slot-scope="{ row }">
          <a class="btn" @click="onDeleteSalesItem(row)">x</a>
        </template>
      </view-table>
    </div>

    <div class="check-out-wrapper">
      <div class="check-out-title">{{ $t('sales.check-out') }}</div>
      <div class="check-out-brief">
        <ul>
          <li class="total-amount">
            <div>{{ $t('sales.total-amount') }}</div>
            <div>{{ formatMoney(refund.fields.total_amount, 0) }}</div>
          </li>

          <li v-for="(payment, index) in refund.fields.payments" :key="index" 
              :class="{ first: index == 0 }" class="payment">
            <div>{{ payment.payment_method_name }}</div>
            <div class="payment-amount">
              {{ formatMoney(payment.payment_amount, 0) }}
            </div>
          </li>
          
          <li class="earn-loyalty-points">
            <div>{{ $t('sales.deduction-loyalty-points') }}</div>
            <div>{{ formatMoney(refund.fields.deduction_points, 0) }}</div>
          </li>
        </ul>
      </div>
      <div class="more-info">
        <b-form-textarea v-model="refund.fields.notes" :disabled="true" :rows="4" />
        <p v-html="formatSalesDeleteHistory()"/>
        <div class="group-button">
          <!-- <button>{{ $t('general.edit') }}</button>
          <button>{{ $t('general.delete') }}</button>
          <button>{{ $t('general.print-receipt') }}</button> -->
          <button @click="onCancel">{{ $t('general.close') }}</button>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import moment from 'moment'
import { mapGetters, mapActions } from 'vuex'
import { options }                from '../../../helpers/options'
import { common_options }         from '../../../helpers/options/common-options'
import { sales_options }          from '../../../helpers/options/sales-options'
import RefundApi                  from '../../../api/sales/refund-api'
import SalesCache                 from '../../../helpers/cache/sales-cache'
import RefundViewModel            from '../../../view-model/sales/refund/refund-view-model'
import component_base             from '../../common/component-base/component-base'
import error_box                  from '../../common/form/error-box/error-box' 
import view_table                 from '../../common/view-table/view-table'
import { 
  formatMoney,
  convertTimeStampToDate 
} from '../../../helpers/common'


export default {
  components: {
    'view-table': view_table,
    'error-box': error_box,
  },
  extends: component_base,
  data() {
    return {
      options,
      common_options,
      sales_options,

      form_title: '',

      sales_cache: new SalesCache(),
      sales_setup: {},

      refund_api: new RefundApi(),
      refund: new RefundViewModel(),
      errors: []
    }
  },
  computed: {
    ...mapGetters('client', {
      x_client: 'getClientInformation'
    }),
    ...mapGetters('refund', {
      x_refund_action: 'getRefundAction'
    }),
    t_form_title(){
      return this.$i18n.t('sales.refund-detail')
    },
    created_info_text(){
      return this.$i18n.t('sales.created-info')
    },
    deleted_info_text(){
      return this.$i18n.t('sales.deleted-info')
    },
    edited_info_text(){
      return this.$i18n.t('sales.edited-info')
    },
    deleted_edited_info_text(){
      return this.$i18n.t('sales.deleted-edited-info')
    },
    has_client(){
      return this.x_client && this.x_client.data && this.x_client.data.id > 0
    },
    table_data(){
      return {
        fields: [
          { field: 'goods_name',                label: 'refund.refund-items',        width: '40%', sortable: false,               tdClass: 'sales-items' },
          { field: 'quantity',                  label: 'refund.quantity',           width: '15%', sortable: false, expand: true, tdClass: 'quantity' },
          { field: 'amount',                    label: 'refund.amount',             width: '15%', sortable: false, expand: true, tdClass: 'amount' },
          { field: 'staffs',                    label: 'refund.staff',              width: '30%', sortable: false, expand: true, tdClass: 'staffs' },
        ],
        rows: this.refund.fields.refund_items,
        pagination:{
          total_pages: 1
        },
        options: {}
      }
    },
  },
  methods: {
    ...mapActions('refund', [
      'updateRefundData'
    ]),
    moment,
    formatMoney,
    convertTimeStampToDate, 

    onCancel(){
      this.hideModal()
    },
    hideModal(){
      this.hideDialogById('refund-detail-modal')
    },
    async onLoadForm(){
      this.errors = []

      // sales setup
      this.sales_setup = await this.sales_cache.getAllSalesSetupCache(this.shop_data.shop_id)
      if(this.isMissingSalesSetup(this.sales_setup)){
        this.showAlert(this.sales_setup.error_messages)
      }
      
      // refund detail
      let query = {
        refund_id: this.x_refund_action.data.ref_id,
        shop_id  : this.x_refund_action.data.shop_id
      }

      this.preLoader()
      let result = await this.refund_api.getRefundAsync(query)
      this.preLoader(false)
      
      if(result.is_ok){
        this.refund.setFields(result.data)
        this.$forceUpdate()
      } else {
        this.showAlert(result.error_messages)
      }
    },

    // format
    isDepositCard(row){
      return row.goods_type == sales_options.sales_goods_type.prepaid_card
          && row.prepaid_card_type == options.prepaid_card_type.deposit_card
    },
    isPrepaidService(row){
      return row.goods_type == sales_options.sales_goods_type.prepaid_service
    },
    formatRefundItemStaffs(staffs){
      if(staffs.length == 0){
        return this.no_selected_staff
      }
      else if (staffs.length == 1){
        return staffs[0].staff_name
      }
      else {
        let tmp_staffs = staffs.map(s => s.staff_name + '(' + formatMoney(s.amount, 0) + ')')
        return tmp_staffs.join('<br>')
      }
    },

    formatSalesDeleteHistory(){
      let info = []
      let refund_fields       = this.refund.getFields()
      let created_info        = this.created_info_text
      let deleted_info        = this.deleted_info_text
      let deleted_edited_info = this.deleted_edited_info_text
      created_info = this.replaceSalesDeleteHistory(created_info,refund_fields.created_by_name,refund_fields.created_date_time_ts)
      info.push(created_info)

      switch(refund_fields.status){
        case sales_options.sales_status.deleted:
          if(refund_fields.edited_by_id != null && refund_fields.edited_by_id != undefined && refund_fields.edited_by_id > 0){
            deleted_edited_info = this.replaceSalesDeleteHistory(deleted_edited_info, refund_fields.deleted_by_name, refund_fields.edited_date_time_ts)
            info.push(deleted_edited_info)  
          }
          else{
            deleted_info = this.replaceSalesDeleteHistory(deleted_info, refund_fields.deleted_by_name, refund_fields.deleted_date_time_ts)
            info.push(deleted_info)
          }
          break
      }
      return info.join('<br/>')
    },
    replaceSalesDeleteHistory(value,name,date_ts){
      let text = value
      text = text.replace('{name}',name)
      text = text.replace('{date}',moment(convertTimeStampToDate(date_ts,true)).format(common_options.standard_date_format.ymdh))
      return text
    },
  }
}
</script>

<style lang='scss'>
@import './refund-detail.scss';
</style>