<template>
  <b-modal id="sales-detail-modal" 
           :title="t_form_title"
           :no-close-on-backdrop="true"
           hide-footer 
           class="sales-detail-modal"
           @show="onLoadForm">

    <!-- SALES INFO -->
    <div class="sales-info">
      <h1>{{ t_form_title }}</h1>
      <div class="detail">
        <div class="name">
          <template v-if="sales.fields.client_id > 0">{{ sales.fields.client_name }}</template>
          <template v-else>{{ $t('sales.unregistered-client') }}</template>
        </div>
        <div class="date">{{ moment(convertTimeStampToDate(sales.fields.invoice_date_time_ts,true)).format(common_options.standard_date_format.dymd) }}</div>
        <div class="status">({{ getTypeNameOfArray(sales_options.sales_status_type,sales.fields.status) }})</div>
      </div>
    </div>

    <!-- SALES ITEMS -->
    <div class="sales-items-table">
      <view-table :data="table_data">
        <template slot="unit_price" slot-scope="{ row }">
          {{ formatMoney(row.unit_price, 0) }}
        </template>
        <template slot="quantity" slot-scope="{ row }">
          {{ formatMoney(row.quantity, 0) }}
        </template>
        <template slot="discount_value" slot-scope="{ row }">
          <div><span v-if="row.discount_category_id > 0" class="tag-dc">DC</span></div>
          <div>
            {{ formatMoney(row.discount_value, 0) }}<span v-if="row.discount_type == sales_options.discount_type.percentage">%</span>
          </div>
        </template>
        <template slot="amount" slot-scope="{ row }">
          <div v-if="row.deduction_type == sales_options.deduction_type.prepaid_service" class="deduct-service">
            <div class="amount-calculated">{{ formatMoney(row.unit_price * row.quantity, 0) }}</div>
          </div>
          <div v-else>{{ formatMoney(row.amount, 0) }}</div>
        </template>
        <template slot="staffs" slot-scope="{ row }">
          <div v-html="formatSalesItemStaffs(row.staffs)"/>
        </template>
        <template slot="sales_type_name" slot-scope="{ row }">
          <div>{{ row.sales_type_name }}</div>
        </template>
        <template slot="deduction_points" slot-scope="{ row }">
          <div v-if="row.deduction_points > 0">
            {{ formatMoney(row.deduction_points, 0) }}
          </div>
          <div v-else class="no-action"/>
        </template>
        <template slot="deduction_amount" slot-scope="{ row }">
          <div v-if="row.deduction_amount > 0">
            {{ formatMoney(row.deduction_amount, 0) }}
          </div>
          <div v-else class="no-action"/>
        </template>
        <template slot="delete" slot-scope="{ row }">
          <a class="btn" @click="onDeleteSalesItem(row)">x</a>
        </template>
      </view-table>
    </div>

    <!-- CHECK OUT -->
    <div class="check-out-wrapper">
      <div class="check-out-title">{{ $t('sales.check-out') }}</div>
      <div class="check-out-brief">
        <ul>
          <li class="total-amount">
            <div>{{ $t('sales.total-amount') }}</div>
            <div>{{ formatMoney(sales.fields.total_amount, 0) }}</div>
          </li>
          <li v-if="sales.fields.booking_deposit_amount > 0" class="booking-deposit">
            <div>{{ $t('sales.booking-deposit') }}</div>
            <div>{{ formatMoney(sales.fields.booking_deposit_amount, 0) }}</div>
          </li>
          <li class="point-deduction">
            <div>{{ $t('sales.point-deduction') }}</div>
            <div>{{ formatMoney(sales.fields.deduction_points, 0) }}</div>
          </li>
          <li class="balance-deduction">
            <div>{{ $t('sales.balance-deduction') }}</div>
            <div>{{ formatMoney(sales.fields.balance_deduction, 0) }}</div>
          </li>
          
          <li v-for="(payment, index) in sales.fields.payments" :key="index" 
              :class="{ first: index == 0 }" class="payment">
            <div>{{ payment.payment_method_name }}</div>
            <div class="payment-amount">
              {{ formatMoney(payment.payment_amount, 0) }}
            </div>
          </li>

          <li :class="{ 'change': sales.fields.outstanding < 0 }" class="outstanding">
            <template v-if="sales.fields.outstanding >= 0">
              <div>{{ $t('sales.outstanding') }}</div>
              <div>{{ formatMoney(sales.fields.outstanding, 0) }}</div>
            </template>
            <template v-else>
              <div>{{ $t('sales.change') }}</div>
              <div>{{ formatMoney(sales.fields.outstanding * -1, 0) }}</div>
            </template>
          </li>
          <li class="earn-loyalty-points">
            <div>{{ $t('sales.earn-loyalty-points') }}</div>
            <div>{{ formatMoney(sales.fields.earned_points, 0) }}</div>
          </li>
        </ul>
      </div>
      <div class="more-info">
        <b-form-textarea v-model="sales.fields.notes" :disabled="true" :rows="4" />
        <p v-html="formatSalesDeleteHistory()"/>
      </div>
      <div class="group-button">
        <!-- <button>{{ $t('general.edit') }}</button>
        <button>{{ $t('general.delete') }}</button>
        <button>{{ $t('general.print-receipt') }}</button> -->
        <button @click="onCancel">{{ $t('general.close') }}</button>
      </div>
    </div>
  </b-modal>
</template>

<script>
import moment            from 'moment'
import { mapGetters }    from 'vuex'
import { options }       from '../../../helpers/options'
import { sales_options } from '../../../helpers/options/sales-options.js'
import { common_options }from '../../../helpers/options/common-options.js'
import SalesApi          from '../../../api/sales/sales-api'
import SalesViewModel    from '../../../view-model/sales/sales/sales-view-model'
import SalesCache        from '../../../helpers/cache/sales-cache'
import view_table        from '../../common/view-table/view-table'
import ClientViewModel   from '../../../view-model/clients/client-view-model'
import component_base    from '../../common/component-base/component-base'
import error_box         from '../../common/form/error-box/error-box' 
import { formatMoney,
  convertTimeStampToDate,
  convertTimeStampMinusSettingzone,
  getTypeNameOfArray }   from '../../../helpers/common.js'

export default {
  components: {
    'view-table': view_table,
    'error-box': error_box,
  },
  extends: component_base,
  props: {
    is_call_api: {
      type: Boolean,
      default: true
    },
    is_view_sales_edit_delete_history: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options,
      sales_options,
      common_options,

      form_title           : '',

      sales_cache          : new SalesCache(),
      sales_setup          : {},

      sales_api            : new SalesApi(),
      sales                : new SalesViewModel(),
      client               : new ClientViewModel()
    }
  },
  computed: {
    ...mapGetters('sales', {
      x_sales_action: 'getSalesAction'
    }),
    t_form_title(){
      return this.$i18n.t('sales.sales-detail')
    },
    table_data(){
      return {
        fields: [
          { field: 'goods_name',                  label: 'sales.sales-items',     width: '25%', sortable: false,               tdClass: 'sales-items' },
          { field: 'unit_price',                  label: 'sales.unit-price',      width: '10%', sortable: false, expand: true, tdClass: 'unit-price' },
          { field: 'quantity',                    label: 'sales.q-ty',            width: '7%',  sortable: false, expand: true, tdClass: 'quantity' },
          { field: 'discount_value',              label: 'sales.discount',        width: '7%',  sortable: false, expand: true, tdClass: 'discount' },
          { field: 'amount',                      label: 'sales.amount',          width: '10%', sortable: false, expand: true, tdClass: 'amount' },
          { field: 'staffs',                      label: 'sales.staff',           width: '15%', sortable: false, expand: true, tdClass: 'staff' },
          { field: 'sales_type_name',             label: 'sales.sales-type',      width: '7%',  sortable: false, expand: true, tdClass: 'sales-type' },
          { field: 'deduction_points',            label: 'sales.points-deduct',   width: '7%',  sortable: false, expand: true, tdClass: 'points-deduct' },
          { field: 'deduction_amount',            label: 'sales.balance-deduct',  width: '7%',  sortable: false, expand: true, tdClass: 'balance-deduct' },
          // { field: 'delete',                      label: 'general.delete',        width: '7%',  sortable: false, expand: true, tdClass: 'delete' }
        ],
        rows: this.sales.fields.sales_items,
        pagination:{
          total_pages: 1
        },
        options: {}
      }
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
    }
  },
  methods: {
    async onLoadForm(){
      // sales setup
      this.sales_setup = await this.sales_cache.getAllSalesSetupCache(this.shop_data.shop_id)
      if(this.isMissingSalesSetup(this.sales_setup)){
        this.showAlert(this.sales_setup.error_messages)
      }
      
      if (this.is_call_api) {
        await this.getSalesDetailAsync()
      } else {
        this.sales.setFields(this.x_sales_action.data)
      }
      this.$forceUpdate()
    },
    async getSalesDetailAsync(){
      // Get Sales Details
      let query = {
        sales_id    : 0,
        sales_number: 0,
        status      : 0,
        shop_id     : this.x_sales_action.data.shop_id
      }
      let tmp_api_function = ''
      
      if(this.is_view_sales_edit_delete_history){
        if(this.x_sales_action.data.ref_status == sales_options.sales_status.edited){
          if(this.x_sales_action.options.status == sales_options.sales_status.edited)
            query.sales_id = this.x_sales_action.data.ref_id
          if(this.x_sales_action.options.status == sales_options.sales_status.deleted)
            query.sales_id = this.x_sales_action.data.edited_sales_id
        }
        if(this.x_sales_action.data.ref_status == sales_options.sales_status.deleted){
          query.sales_id = this.x_sales_action.data.ref_id
        }

        tmp_api_function = 'getSalesByIdLiveAsync'
      }
      else {
        query.sales_number = this.x_sales_action.data.sales_number
        query.status       = this.x_sales_action.options.status
        tmp_api_function   = 'getSalesLiveAsync'
      }
      
      this.preLoader()
      let result = await this.sales_api[tmp_api_function](query)
      this.preLoader(false)

      if(result.is_ok){
        this.sales.setFields(result.data)
      }
      else {
        this.showAlert(result.error_messages)
      }
    },
    
    formatSalesItemStaffs(staffs){
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
      let sales_fields        = this.sales.getFields()
      let created_info        = this.created_info_text
      let deleted_info        = this.deleted_info_text
      let edited_info         = this.edited_info_text
      let deleted_edited_info = this.deleted_edited_info_text
      created_info = this.replaceSalesDeleteHistory(created_info,sales_fields.created_by_name,sales_fields.created_date_time_ts)
      info.push(created_info)

      switch(sales_fields.status){
        case sales_options.sales_status.deleted:
          if(sales_fields.edited_sales_id == null || sales_fields.edited_sales_id != sales_fields.sales_id){
            deleted_info = this.replaceSalesDeleteHistory(deleted_info, sales_fields.deleted_by_name, sales_fields.deleted_date_time_ts)
            info.push(deleted_info)
          }
          else{
            deleted_edited_info = this.replaceSalesDeleteHistory(deleted_edited_info,sales_fields.deleted_by_name,sales_fields.deleted_date_time_ts)
            info.push(deleted_edited_info)
          }
          break
        case sales_options.sales_status.edited:
          edited_info = this.replaceSalesDeleteHistory(edited_info, sales_fields.edited_by_name, sales_fields.edited_date_time_ts)
          info.push(edited_info)
          break
      }
      return info.join('<br/>')
    },

    replaceSalesDeleteHistory(value,name,date_ts){
      let text = value
      let tmp_date_ts = convertTimeStampMinusSettingzone(date_ts)
      text = text.replace('{name}',name)
      text = text.replace('{date}',moment(convertTimeStampToDate(tmp_date_ts,true)).format(common_options.standard_date_format.ymdh))
      return text
    },

    onCancel(){
      this.hideModal()
    },
    hideModal(){
      this.hideDialogById('sales-detail-modal')
    },
    moment,
    formatMoney,
    getTypeNameOfArray,
    convertTimeStampToDate
  }
}
</script>

<style lang='scss'>
@import './sales-detail.scss';
</style>