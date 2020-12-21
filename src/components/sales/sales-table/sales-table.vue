<template>
  <div class="sales-table-wrapper">
    <div class="show-deleted">
      <b-form-checkbox v-model="is_show_deleted" :value="true" @input="onInputShowDeleted">{{ $t('sales.show-deleted') }}</b-form-checkbox>
    </div>

    <!-- BEGIN TABLE -->
    <view-table :data="table_data" :class="{ 'table-expand-menu-options': table_data.rows.length < 3 }" class="sales-table-data"
                @change-page="onChangePage">
      <template slot="mobile_col" slot-scope="">
        {{ $t('general.all') }} {{ table_data.pagination.total_items }} {{ $t('general.records') }} /
        {{ $t('sales.total-amount') }} {{ formatMoney(table_data.pagination.total_amount, 0) }}
      </template>
      <template slot="mobile" slot-scope="{ row }">
        <sales-row-mini :row="row" :is_only_first_row="isOnlyFirstRow(row)"
                        @delete-outstanding="onActionOutstandingAsync(row)"
                        @action-sales="onActionSalesAsync"
                        @action-refund="onActionRefundAsync"/>
      </template>

      <template slot="branch_number" slot-scope="{ row }">
        <div :id="'tooltip-branch-number' + row.ref_id">
          {{ row.branch_number }}
        </div>
        <b-tooltip :target="'tooltip-branch-number' + row.ref_id" placement="bottom">
          {{ row.shop_name }}
        </b-tooltip>
      </template>

      <template slot="invoice_date_time_ts" slot-scope="{ row }">
        {{ formatInvoiceDate(row.invoice_date_time_ts) }}
      </template>

      <template slot="client_name" slot-scope="{ row }">
        <template v-if="row.client_id > 0">
          <span v-if="isClientOfCurrentShop(row)">
            {{ row.client_name }}
          </span>
          <span v-else :class="{ 'is-client-of-other-shop': !isClientOfCurrentShop(row) }">
            <div :id="'tooltip-client-name' + row.ref_id">
              {{ row.client_name }}
            </div>
            <b-tooltip :target="'tooltip-client-name' + row.ref_id" placement="bottom">
              {{ row.client_shop_name }}
            </b-tooltip>
          </span>
        </template>
        <template v-else>
          <span v-if="canConnectClientToSales(row)" class="unregistered-client" @click="onUnregisteredClientAction(options.form_actions.edit,row)">
            {{ unregistered_client_text }}
          </span> 
          <span v-else>
            {{ unregistered_client_text }}
          </span>
        </template>
      </template>

      <template slot="items" slot-scope="{ row }">
        <template v-if="row.ref_type == sales_options.sales_ref_type.outstanding_payment">
          <span >{{ $t('sales-outstanding-payment.outstanding-payment') }}<br></span>
        </template>
        <template v-else>
          <span v-if="row.ref_type == sales_options.sales_ref_type.refund" class="tag-refund">{{ $t('sales-invoice-tab.refund') }}<br></span>
          <span v-html="formatGoodsName(row)"/>
        </template>
      </template>

      <template slot="staffs" slot-scope="{ row }">
        <template v-if="row.ref_type == sales_options.sales_ref_type.outstanding_payment">{{ row.staff_name }}</template>
        <template v-else>
          <div :id="'staffs-' + row.ref_id" v-html="SalesUtils.formatStaffsOnSalesTable(row.items)"/>
          <b-tooltip v-if="SalesUtils.isStaffsCompact(row.items)" 
                     :target="'staffs-' + row.ref_id" placement="bottom">
            <div v-html="SalesUtils.formatStaffsOnSalesTable(row.items, true)"/>
          </b-tooltip>
        </template>
      </template>

      <template slot="sales_type" slot-scope="{ row }">
        <span v-html="formatSalesTypeOnSalesTable(row.items)"/>
      </template>

      <template slot="discount" slot-scope="{ row }">
        <div :id="'discount-' + row.ref_id" v-html="formatDiscountOnSalesTable(row.items)"/>
        <!-- #todo: tool-tip for discount is_view_full -->
        <!-- <b-tooltip :target="'discount-' + row.ref_id" placement="bottom">
          <div v-html="formatDiscountOnSalesTable(row.items, true)"/>
        </b-tooltip> -->
      </template>

      <template slot="item_amount" slot-scope="{ row }">
        <div v-html="SalesUtils.formatItemAmountOnSalesTable(row.items)"/>
      </template>

      <template slot="payment_method" slot-scope="{ row }">
        <div v-html="formatPaymentMethodOnSalesTable(row, false)"/>
      </template>

      <template slot="payment_amount" slot-scope="{ row }">
        <div v-html="formatPaymentMethodOnSalesTable(row, true)"/>
      </template>

      <template slot="notes" slot-scope="{ row }">
        <div :class="{ 'not-editable': !canEditNotes(row) }" class="notes-detail" @click="onClickNotes(row)">{{ row.notes }}</div>
      </template>

      <template slot="menu" slot-scope="{ row }">
        <template v-if="row.ref_status == sales_options.sales_status.deleted">{{ $t('general.deleted') }}</template>
        <template v-else-if="row.ref_type == sales_options.sales_ref_type.outstanding_payment">
          <div v-if="isDataOfCurrentShop(row)" class="btn outstanding-btn" @click="onActionOutstandingAsync(row)">{{ $t('general.del') }}</div>
        </template>
        <template v-else>
          <menu-sales-actions :data="row"
                              :is_data_of_current_shop="isDataOfCurrentShop(row)"
                              :class="{ 'is-only-first-row': isOnlyFirstRow(row) }"
                              @action-sales="onActionSalesAsync"
                              @action-refund="onActionRefundAsync"/>
        </template>
      </template>
    </view-table>

    <!-- BEGIN ACTION -->
    <alert-confirm :id="alert_id"
                   :data_alerts="alert_data"
                   @confirm="onAlertConfirmAsync"
                   @cancel="onAlertCancel"/>
    <sales-detail/>
    <sales-action v-if="is_attached_sales_action" @added="onAddedSales" @edited="onEditedSales"/>
    <notes-action @edited-notes="onEditedNotes"/>
    <unregistered-client-action @connected-client-sales="onConnectedSalesClient" />

    <refund-detail/>
    <refund-action v-if="is_attached_sales_action" @added="onAddedRefund"/> <!-- todo: recheck refund-action preLoader impact to SalesHistory Tab -->
  </div>
</template>

<script>
import moment from 'moment'
import { mapGetters, mapMutations } from 'vuex'
import { options }                from '../../../helpers/options'
import { sales_options }          from '../../../helpers/options/sales-options'
import SalesUtils                 from '../../../helpers/utils/sales-utils.js'
import SalesCache                 from '../../../helpers/cache/sales-cache'
import SalesApi                   from '../../../api/sales/sales-api'
import SalesViewModel             from '../../../view-model/sales/sales/sales-view-model.js'
import OutstandingDeleteViewModel from '../../../view-model/sales/outstanding/outstanding-delete-view-model'
import OutstandingPaymentAPI      from '../../../api/sales/outstanding-payment-api'
import ClientApi                  from '../../../api/clients/client-api'
import RefundApi                  from '../../../api/sales/refund-api'
import RefundDeleteViewModel      from '../../../view-model/sales/refund/refund-delete-view-model'

import view_table                 from '../../../components/common/view-table/view-table'
import sales_mixin                from '../../../helpers/mixins/sales-mixin'
import refund_mixin               from '../../../helpers/mixins/refund-mixin'
import sales_row_mini             from '../sales-row-mini/sales-row-mini.vue'

import component_base             from '../../../components/common/component-base/component-base'
import unregistered_client_action from '../../../components/sales/unregistered-client-action/unregistered-client-action.vue'
import menu_sales_actions         from '../../../components/sales/menu-sales-actions/menu-sales-actions.vue'
import alert_confirm              from '../../common/alert/alert-confirm'
import sales_detail               from '../../../components/sales/sales-detail/sales-detail.vue'
import sales_action               from '../../../components/sales/sales-action/sales-action'
import notes_action               from '../../../components/sales/notes-action/notes-action.vue'
import refund_detail              from '../../../components/sales/refund-detail/refund-detail.vue'
import refund_action              from '../../../components/sales/refund-action/refund-action.vue'

import { convertTimeStampToDate,
  formatMoney,
  convertDateToTimeStamp,
  convertDateToTimezone
} from '../../../helpers/common'

export default {
  components: {
    'view-table'         : view_table,
    'menu-sales-actions' : menu_sales_actions,
    'alert-confirm'      : alert_confirm,
    'sales-row-mini'     : sales_row_mini,

    'sales-detail'              : sales_detail,
    'sales-action'              : sales_action,
    'notes-action'              : notes_action,
    'unregistered-client-action': unregistered_client_action,

    'refund-detail': refund_detail,
    'refund-action': refund_action
  },
  extends: component_base,
  mixins: [sales_mixin, refund_mixin],
  props: {
    is_attached_sales_action: {
      type: Boolean,
      default: true
    },
    is_connect_client_to_sales: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      options,
      sales_options,
      SalesUtils,

      sales_cache    : new SalesCache(),
      sales_api      : new SalesApi(),
      sales_setup    : {},
      is_show_deleted: false,

      outstanding_delete: {},
      outstanding_api: new OutstandingPaymentAPI(),
      client_api     : new ClientApi(),
      refund_api     : new RefundApi(),

      alert_id       : 'alert-confirm-on-sales-table-modal',
      alert_data     : [],
      alert_sales_ref_type: 0
    }
  },
  computed: {
    ...mapGetters('client', {
      x_client: 'getClientInformation'
    }),
    ...mapGetters('sales', {
      x_sales_list: 'getSalesList',
      x_sales_action: 'getSalesAction',
    }),
    has_client(){
      return this.x_client && this.x_client.data && this.x_client.data.id > 0
    },
    is_client_of_current_shop(){
      return this.has_client && this.shop_data.shop_id == this.x_client.data.shop_id
    },
    table_data(){
      let tmp_data = {
        fields: this.getTableDataFields(),
        rows: [],
        pagination: {
          total_pages: 1
        },
        options: {
          pagination: true,
          fixed_header: true
        }
      }
      tmp_data.rows       = this.x_sales_list.items
      tmp_data.pagination = this.x_sales_list.pagination
      return tmp_data
    },
    unregistered_client_text(){return this.$i18n.t('sales.unregistered-client')},
    sales_booking_deposit_text(){return this.$i18n.t('sales.booking-deposit')},
    point_text(){return this.$i18n.t('sales.point')},
    deduction_text(){return this.$i18n.t('sales.deduction-balance')},
    outstanding_text(){return this.$i18n.t('sales.outstanding')},
    warning_delete(){return this.$i18n.t('general.warning-delete')},
  },
  async created(){
    await this.loadSalesSetup()
    await this.$emit('created-sales-table')
  },
  methods: {
    ...mapMutations('sales',[
      'updateSalesNotes',
      'updateSales'
    ]),
    moment,
    formatMoney,
    convertTimeStampToDate,

    // table
    getTableDataFields(){
      let tmp_fields_custom = [
        { field: 'mobile',              label: '',                    width: 'auto',sortable: false, thClass: 'mobile',         expand: true, tdClass: 'mobile', column_expand: true }
      ]
      let tmp_field_branch_number = 
      { field:   'branch_number',       label: 'general.loc',         width: '7%',  sortable: false, thClass: 'location',       expand: true }
      
      let tmp_field_invoice_date_time_ts = 
      { field:   'invoice_date_time_ts',label: 'general.date',        width: '15%', sortable: false, thClass: 'date',           expand: true }
      
      let tmp_field_client_name = 
      { field:   'client_name',         label: 'sales.client-name',   width: '16%', sortable: false, thClass: 'client-name',    expand: true , tdClass: 'client-name' }
      
      let tmp_fields = [
        { field: 'items',               label: 'sales.sales-items',   width: '16%', sortable: false, thClass: 'sales-items',    expand: true },
        { field: 'staffs',              label: 'sales.staff',         width: '8%',  sortable: false, thClass: 'staffs',         expand: true },
        { field: 'sales_type',          label: 'sales.sales-type',    width: '9%',  sortable: false, thClass: 'sales-type',     expand: true },
        { field: 'discount',            label: 'sales.discount',      width: '8%',  sortable: false, thClass: 'discount',       expand: true },
        { field: 'item_amount',         label: 'sales.amount',        width: '8%',  sortable: false, thClass: 'amount',         expand: true },
        { field: 'payment_method',      label: 'sales.payment-method',width: '15%', sortable: false, thClass: 'payment-method', expand: true },
        { field: 'payment_amount',      label: 'sales.payment',       width: '8%',  sortable: false, thClass: 'payment-amount', expand: true },
        { field: 'notes',               label: 'general.notes',       width: '20%', sortable: false, thClass: 'notes',          expand: true, tdClass: 'notes' },
        { field: 'menu',                label: 'sales.menu',          width: '8%',  sortable: false, thClass: 'menu',           expand: true, tdClass: 'menu' }
      ]

      // branch_number
      if(this.shop_data.chain_id && this.shop_data.chain_sharing_settings.share_client && !this.is_connect_client_to_sales)
        tmp_fields_custom.push(tmp_field_branch_number)
      
      // invoice_date_time_ts
      tmp_fields_custom.push(tmp_field_invoice_date_time_ts)

      // client_name
      if(this.is_connect_client_to_sales)
        tmp_fields_custom.push(tmp_field_client_name)
      
      return [...tmp_fields_custom, ...tmp_fields]
    },
    isClientOfCurrentShop(row){
      return this.shop_data.shop_id == row.client_shop_id
    },
    isDataOfCurrentShop(row){
      return row.shop_id == this.shop_data.shop_id
    },
    canConnectClientToSales(row){
      return this.is_connect_client_to_sales 
             && row.ref_type == sales_options.sales_ref_type.sales 
             && row.ref_status != sales_options.sales_status.deleted
    },
    async loadSalesSetup(){
      try{
        this.sales_setup = await this.sales_cache.getAllSalesSetupCache(this.shop_data.shop_id)
      }
      catch{
        this.preLoader(false)
      }
      
      if(this.isMissingSalesSetup(this.sales_setup)){
        this.showAlert(this.sales_setup.error_messages)
      }
    },

    // table ui
    async onActionSalesAsync(action, sales){
      await this.onActionSalesMixin(action, sales, sales.ref_status)
      if(action == options.form_actions.delete){
        this.alert_sales_ref_type = sales_options.sales_ref_type.sales
        this.alert_data = [this.warning_delete]
        this.showDialogById(this.alert_id)
      }
    },

    async onActionRefundAsync(action, refund){
      if(action == options.form_actions.view){
        let refund_action = {
          action: action,
          data: refund,
          options: {
            sales_goods_type: sales_options.sales_goods_type.service
          }
        }
        this.setRefundAction(refund_action)
        this.showDialogById('refund-detail-modal')
      }
      if(action == options.form_actions.part){
        let notes_action = {
          action : action,
          data   : refund,
          options: {
            sales_goods_type: sales_options.sales_goods_type.service,
            status : status
          }
        }
        this.setSalesAction(notes_action)
        this.showDialogById('notes-action-modal')
      }
      if(action == options.form_actions.delete){
        this.refund_delete = refund
        this.alert_sales_ref_type = sales_options.sales_ref_type.refund
        this.alert_data = [this.warning_delete]
        this.showDialogById(this.alert_id)
      }
    },
    async onDeleteRefundAsync(){
      // sales page
      let tmp_client_id = 0
      let tmp_family_id = 0
      let tmp_client_name = ''

      // client sales page
      if(this.has_client){
        tmp_client_id   = this.x_client.data.id
        tmp_family_id   = this.x_client.data.family_id
        tmp_client_name = this.x_client.data.client_name
      }
      else {
        // sales history page
        if(this.refund_delete.client_id > 0){
          tmp_client_id   = this.refund_delete.client_id
          tmp_family_id   = this.refund_delete.family_id
          tmp_client_name = this.refund_delete.client_name
        }
      }

      let current_date_time_ts = convertDateToTimeStamp(convertDateToTimezone(new Date()), false, true)
      let refund_delete_vm = new RefundDeleteViewModel()
      refund_delete_vm.setFields({
        client_id       : tmp_client_id,
        family_id       : tmp_family_id,
        client_name     : tmp_client_name,
        refund_id       : this.refund_delete.ref_id,
        deleted_by_id   : this.x_user.user_id,
        deleted_by_name : this.x_user.user_name,
        deleted_date_time_ts: current_date_time_ts,
        session_token   : this.x_user.session_token,
        shop_location   : this.shop_data.shop_location,
        shop_id         : this.shop_data.shop_id
      })
      let result = await this.refund_api.deleteRefundAsync(refund_delete_vm)
      
      if(result.is_ok){
        this.onDeletedRefund(result.data)
      }
      else {
        this.showAlert(result.error_messages)
      }
    },

    async onActionOutstandingAsync(outstanding){
      this.outstanding_delete = outstanding
      this.alert_sales_ref_type = sales_options.sales_ref_type.outstanding_payment
      this.alert_data = [this.warning_delete]
      this.showDialogById(this.alert_id)
    },
    async deleteOutstandingAsync(){
      let tmp_client = {}
      if(!this.has_client || (this.has_client && this.x_client.data.id != this.outstanding_delete.client_id)){
        let result = await this.client_api.getClientAsync({ client_id: this.outstanding_delete.client_id, shop_id: this.shop_data.shop_id })
        if(result.is_ok){
          tmp_client = result.data
        }
        else {
          this.showAlert(result.error_messages)
          return
        }
      }
      else {
        tmp_client = this.x_client.data
      }
      
      if(tmp_client.mobile_number == null) tmp_client.mobile_number = ''
      if(tmp_client.phone_number == null) tmp_client.phone_number = ''

      let outstanding_delete_vm = new OutstandingDeleteViewModel()
      outstanding_delete_vm.setFields({
        outstanding_payment_id: this.outstanding_delete.ref_id,
        client_id             : tmp_client.id,
        client_name           : tmp_client.client_name,
        phone_number          : tmp_client.phone_number,
        mobile_number         : tmp_client.mobile_number,
        family_id             : tmp_client.family_id,
        created_by_id         : this.x_user.user_id,
        created_by_name       : this.x_user.user_name,
        session_token         : this.x_user.session_token,
        shop_location         : this.shop_data.shop_location,
        shop_id               : this.shop_data.shop_id
      })

      let result = await this.outstanding_api.deleteOutstandingPaymentAsync(outstanding_delete_vm)
      if(result.is_ok){
        this.onDeletedOutstanding(result.data)
      }
      else {
        this.showAlert(result.error_messages)
      }
    },
    onClickNotes(row){
      if(this.canEditNotes(row))
        this.onActionSalesMixin(options.form_actions.part, row)
    },
    canEditNotes(row){ 
      let tmp_editable = true
      if(row.ref_type == sales_options.sales_ref_type.outstanding_payment 
      || row.ref_status == sales_options.sales_status.deleted 
      || !this.isDataOfCurrentShop(row)){
        tmp_editable = false
      }
      return tmp_editable
    },
    async onEditedNotes(notes){
      let sales_notes = {
        client_id    : this.x_sales_action.data.client_id,
        sales_number : this.x_sales_action.data.sales_number,
        refund_id    : this.x_sales_action.data.ref_id,
        notes        : notes,
        session_token: this.x_user.session_token,
        shop_location: this.shop_data.shop_location,
        shop_id      : this.shop_data.shop_id
      }
      
      this.preLoader()
      let result = {}
      if(this.x_sales_action.data.ref_type == sales_options.sales_ref_type.sales){
        result = await this.sales_api.updateSalesNotesAsync(sales_notes)
      }
      if(this.x_sales_action.data.ref_type == sales_options.sales_ref_type.refund){
        result = await this.refund_api.updateRefundNotesAsync(sales_notes)
      }
      this.preLoader(false)
      
      if(result.is_ok){
        this.updateSalesNotes(result.data)
        this.hideDialogById('notes-action-modal')
      } else {
        this.showAlert(result.error_messages)
      }
    },
    onUnregisteredClientAction(action, sales){
      let sales_action = { 
        action  : action, 
        data    : sales,
        options : { status : sales.ref_status }
      }
      this.setSalesAction(sales_action)
      this.showDialogById('unregistered-client-action-modal')
    },
    
    // alert confirm
    async onAlertConfirmAsync(){
      this.preLoader()
      if(this.alert_sales_ref_type == sales_options.sales_ref_type.sales){
        let result = await this.deleteSalesMixin()
        if(result.is_ok){
          this.onDeletedSales(result.data)
        }
        else this.showAlert(result.error_messages)
      }
      if(this.alert_sales_ref_type == sales_options.sales_ref_type.refund){
        await this.onDeleteRefundAsync()
      }
      if(this.alert_sales_ref_type == sales_options.sales_ref_type.outstanding_payment){
        await this.deleteOutstandingAsync()
      }
      this.preLoader(false)

      this.hideDialogById(this.alert_id)
      this.$emit('deleted')
    },
    onAlertCancel(){
      this.hideDialogById(this.alert_id)
    },

    // format for template
    isOnlyFirstRow(row){
      return row.originalIndex == 0 && this.table_data.rows.length == 1
    },
    formatGoodsName(row){
      let tmp = ''
      for(let i in row.items){
        if(i < 10){
          let item = row.items[i]
          tmp += `<span>${item.goods_name}<br></span>`
        }
        else {
          tmp += '<span>...</span>'
          break
        }
      }
      return tmp
    },
    formatInvoiceDate(invoice_date_time_ts){
      return moment(convertTimeStampToDate(invoice_date_time_ts,true)).format(options.standard_date_format.ymdh)
    },
    formatSalesTypeOnSalesTable(sales_items){
      let tmp_sales_types = sales_items.map(i => i.sales_type_name)
      tmp_sales_types = tmp_sales_types.filter(st => st != null)
      return tmp_sales_types.join('<br>')
    },
    formatDiscountOnSalesTable(sales_items) {
      let tmp_discounts = []
      for( let item of sales_items){
        let tmp_discount = ''
        if(item.discount_value != null && item.discount_value != undefined && item.discount_value > 0){
          if(item.discount_type == sales_options.discount_type.percentage)
            tmp_discount = item.discount_value + '%'
          else
            tmp_discount = formatMoney(item.discount_value, 0)
          tmp_discounts.push(tmp_discount)
        }
      }
      return tmp_discounts.join('<br>')
    },
    formatPaymentMethodOnSalesTable(sales, is_amount = false){
      let payment_method_text = ''
      let payment_amount_text = ''
      if(sales){
        if(sales.booking_deposit_amount > 0){
          payment_method_text += `${this.sales_booking_deposit_text}<br/>`
          payment_amount_text += `${formatMoney(sales.booking_deposit_amount, 0)}<br/>`
        }
        if(sales.deduction_points > 0){
          payment_method_text += `${this.point_text}<br/>`
          payment_amount_text += `${formatMoney(sales.deduction_points, 0)}<br/>`
        }
        if(sales.balance_deduction > 0){
          payment_method_text += `${this.deduction_text}<br/>`
          payment_amount_text += `${formatMoney(sales.balance_deduction, 0)}<br/>`
        }
        for(let payment of sales.payments){
          payment_method_text += `${payment.payment_method_name}<br/>`
          payment_amount_text += `${formatMoney(payment.payment_amount, 0)}<br/>`
        }
        if(sales.outstanding > 0){
          payment_method_text += `${this.outstanding_text}<br/>`
          payment_amount_text += `<div class="text-danger">${formatMoney(sales.outstanding, 0)}</div>`
        }
      }
      return is_amount == true ? payment_amount_text : payment_method_text
    },

    // emit events
    onInputShowDeleted(){
      this.$emit('show-deleted', this.is_show_deleted)
    },
    onChangePage(page_num){
      this.$emit('change-page', page_num)
    },
    onAddedSales(){
      this.$emit('sales-added')
    },
    onEditedSales(){
      this.$emit('sales-edited')
    },
    onDeletedSales(){
      this.$emit('sales-deleted')
    },
    onAddedRefund(){
      this.$emit('refund-added')
    },
    onDeletedRefund(){
      this.$emit('refund-deleted')
    },
    onDeletedOutstanding(){
      this.$emit('outstanding-deleted')
    },
    
    onConnectedSalesClient(sales){
      let sales_vm = new SalesViewModel()
      sales_vm.setFields(sales)
      this.updateSales(sales_vm.mapToSalesBriefViewModel().getFields())
    }
  }
}
</script>

<style lang='scss'>
@import './sales-table.scss';
</style>
