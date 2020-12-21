<template>
  <b-modal id="refund-items-adding-action-modal" 
           :title="form_title"
           :no-close-on-backdrop="true"
           hide-footer 
           class="refund-items-adding-action-modal"
           @show="onLoadForm"
           @hide="onCancel">
    <div :class="{ 'is-showed-goods': is_showed_goods, 'is-showed-prepaid-goods': is_showed_prepaid_goods }" class="refund-items-adding-action-wrapper">
      <refund-goods-types ref="refund_goods_types" :is_show_modal="false" @clicked-goods-type="onClickedGoodsType"/>

      <div v-show="showed_sales_goods_types[0].showed || showed_sales_goods_types[1].showed" class="row goods-wrapper">
        <div class="col-12 col-md-9 col-xl-10">
          <div class="sales-goods-content-wrapper">
            <div v-if="is_viewed_services" :class="{ 'hide': !showed_sales_goods_types[0].showed }">
              <!-- #todo: sales-setup -> :is_show_service_price="is_show_service_price" -->
              <select-service-panel ref="select_service_panel" 
                                    @get-selected-services="onGetSelectedServices"/>
            </div>

            <sales-item-products v-if="is_viewed_products" 
                                 :class="{ 'hide': !showed_sales_goods_types[1].showed }"
                                 @select-product="onSelectProduct"/>
          </div>
        </div>

        <div class="col-12 col-md-3 col-xl-2">
          <div class="sales-items-selected-wrapper">
            <div class="modal-footer refund-item-adding-submit top">
              <div class="btn-action-group">
                <button class="btn btn-default" @click="onConfirm">{{ $t('general.confirm') }}</button>
                <button class="btn btn-secondary" @click="onCancel">{{ $t('general.cancel') }}</button>
              </div>
            </div>

            <div class="staffs-selected">
              <label>{{ $t('sales.select-staff') }}</label>
              <b-form-select v-model="staff.fields.staff_id" :options="staff_options"
                             value-field="staff_id" text-field="staff_name"
                             @input="onInputStaff"/>
            </div>

            <!-- goods selected -->
            <div v-if="refund_items_selected.items.length > 0
                   && (refund_items_selected.type == sales_options.sales_goods_type.service 
                 || refund_items_selected.type == sales_options.sales_goods_type.product)"
                 class="sales-items-selected services-products">
              <label v-if="refund_items_selected.type == sales_options.sales_goods_type.service">{{ $t('services.services') }}</label>
              <label v-if="refund_items_selected.type == sales_options.sales_goods_type.product">{{ $t('products.products') }}</label>
              <table>
                <thead>
                  <tr>
                    <th>{{ $t('bookings.selected-items') }}</th>
                    <th>{{ $t('general.del') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(refund_item, index) in refund_items_selected.items" :key="index">
                    <td>{{ refund_item.goods_name }}</td>
                    <td><a class="btn" @click="onRemoveRefundItemGoods(refund_item.key)">x</a></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div v-show="showed_sales_goods_types[2].showed || showed_sales_goods_types[3].showed" class="row prepaid-goods-wrapper">
        <div v-if="is_viewed_prepaid_cards" :class="{ 'hide': !showed_sales_goods_types[2].showed }" class="col-12">
          <view-table :data="table_prepaid_cards">
            <template slot="mobile" slot-scope="{ row }">
              <b>{{ row.prepaid_card_name }}</b>
              <template v-if="has_client && x_client.data.id != row.client_id">
                <br><span class="family-card">({{ row.client_name }})</span>
              </template>
              <p>({{ formatMoney(row.balance, 0) }}, {{ sales_utils.formatNoLimitDateTs(row.expiry_date_ts) }})</p>
              <p>{{ $t('prepaid-cards.initial-balance') }} {{ sales_utils.formatNoLimitNumber(row.initial_balance, 0) }}</p>
              <p>{{ $t('sales-prepaid-card-tab.issue-date') }} {{ sales_utils.formatNoLimitDateTs(row.invoice_date_time_ts) }}</p>
              <div class="input-amount">
                <div class="deduction">
                  <label>{{ $t('refund.deduction-balance') }}</label>
                  <input-money v-model="row.deduction_balance" 
                               :disabled="!isDataOfCurrentShop(row) || row.prepaid_card_type == sales_options.prepaid_card_type.discount_card" 
                               @input="onInputClientPrepaidCard(row)"/>
                </div>
                <div class="refund-amount">
                  <label>{{ $t('refund.refund-amount') }}</label>
                  <input-money v-model="row.refund_amount" :disabled="!isDataOfCurrentShop(row)" @input="onInputClientPrepaidCard(row)"/>
                </div>
              </div>
            </template>

            <template slot="id" slot-scope="{ row }">
              <b-form-checkbox v-model="row.is_selected" :value="true" :disabled="!isDataOfCurrentShop(row)"
                               @input="onSelectClientPrepaidCard(row)"/>
            </template>
            <template slot="prepaid_card_name" slot-scope="{ row }">
              {{ row.prepaid_card_name }}
              <template v-if="has_client && x_client.data.id != row.client_id">
                <br><span class="family-card">({{ row.client_name }})</span>
              </template>
            </template>
            <template slot="balance" slot-scope="{ row }">
              {{ formatMoney(row.balance, 0) }}
            </template>
            <template slot="initial_balance" slot-scope="{ row }">
              {{ sales_utils.formatNoLimitNumber(row.initial_balance, 0) }}
            </template>
            <template slot="invoice_date_time_ts" slot-scope="{ row }">
              {{ formatDateOnTable(row.invoice_date_time_ts) }}
            </template>
            <template slot="expiry_date_ts" slot-scope="{ row }">
              {{ sales_utils.formatNoLimitDateTs(row.expiry_date_ts) }}
            </template>
            <template slot="shop_id" slot-scope="{ row }">
              <input-money v-model="row.deduction_balance" 
                           :disabled="!isDataOfCurrentShop(row) || row.prepaid_card_type == sales_options.prepaid_card_type.discount_card" 
                           @input="onInputClientPrepaidCard(row)"/>
            </template>
            <template slot="client_id" slot-scope="{ row }">
              <input-money v-model="row.refund_amount" :disabled="!isDataOfCurrentShop(row)" @input="onInputClientPrepaidCard(row)"/>
            </template>
          </view-table>
        </div>
        
        <div v-if="is_viewed_prepaid_services" :class="{ 'hide': !showed_sales_goods_types[3].showed }" class="col-12">
          <view-table :data="table_prepaid_services">
            <template slot="mobile" slot-scope="{ row }">
              <b>{{ row.prepaid_service_name }}</b>
              <template v-if="has_client && x_client.data.id != row.client_id">
                <br><span class="family-card">({{ row.client_name }})</span>
              </template>
              <p>({{ $t('sales.q-ty') }} {{ sales_utils.formatNoLimitNumber(row.quantity, 0) }}, {{ sales_utils.formatNoLimitDateTs(row.expiry_date_ts) }})</p>
              <p>{{ $t('prepaid-services.initial-quantity') }} {{ sales_utils.formatNoLimitNumber(row.initial_quantity, 0) }}</p>
              <p>{{ $t('sales-prepaid-card-tab.issue-date') }} {{ sales_utils.formatNoLimitDateTs(row.invoice_date_time_ts) }}</p>
              <div class="input-amount">
                <div class="deduction">
                  <label>{{ $t('refund.deduction-quantity') }}</label>
                  <input-money v-model="row.deduction_quantity" :disabled="!isDataOfCurrentShop(row) || row.quantity == -1" 
                               @input="onInputClientPrepaidService(row)"/>
                </div>
                <div class="refund-amount">
                  <label>{{ $t('refund.refund-amount') }}</label>
                  <input-money v-model="row.refund_amount" :disabled="!isDataOfCurrentShop(row)" @input="onInputClientPrepaidService(row)"/>
                </div>
              </div>
            </template>

            <template slot="id" slot-scope="{ row }">
              <b-form-checkbox v-model="row.is_selected" :value="true" :disabled="!isDataOfCurrentShop(row)"
                               @input="onSelectClientPrepaidService(row)"/>
            </template>
            <template slot="prepaid_service_name" slot-scope="{ row }">
              {{ row.prepaid_service_name }}
              <template v-if="has_client && x_client.data.id != row.client_id">
                <br><span class="family-card">({{ row.client_name }})</span>
              </template>
            </template>
            <template slot="quantity" slot-scope="{ row }">
              {{ sales_utils.formatNoLimitNumber(row.quantity, 0) }}
            </template>
            <template slot="initial_quantity" slot-scope="{ row }">
              {{ sales_utils.formatNoLimitNumber(row.initial_quantity, 0) }}
            </template>
            <template slot="invoice_date_time_ts" slot-scope="{ row }">
              {{ formatDateOnTable(row.invoice_date_time_ts) }}
            </template>
            <template slot="expiry_date_ts" slot-scope="{ row }">
              {{ sales_utils.formatNoLimitDateTs(row.expiry_date_ts) }}
            </template>
            <template slot="shop_id" slot-scope="{ row }">
              <input-money v-model="row.deduction_quantity" :disabled="!isDataOfCurrentShop(row) || row.quantity == -1" 
                           @input="onInputClientPrepaidService(row)"/>
            </template>
            <template slot="client_id" slot-scope="{ row }">
              <input-money v-model="row.refund_amount" :disabled="!isDataOfCurrentShop(row)" @input="onInputClientPrepaidService(row)"/>
            </template>
          </view-table>
        </div>
      </div>
      
      <div class="modal-footer refund-item-adding-submit bottom">
        <div class="btn-action-group">
          <button class="btn btn-default" @click="onConfirm">{{ $t('general.confirm') }}</button>
          <button class="btn btn-secondary" @click="onCancel">{{ $t('general.cancel') }}</button>
        </div>
      </div>
    </div>

    <alert-confirm :id="alert_id" :data_alerts="alert_data"
                   @confirm="onAlertConfirm" @cancel="onAlertCancel"/>
  </b-modal>
</template>


<script>
import _ from 'lodash'
import moment from 'moment'
import { mapGetters, mapMutations }  from 'vuex'
import { options }                 from '../../../../helpers/options'
import { sales_options }           from '../../../../helpers/options/sales-options'
import RefundItemViewModel          from '../../../../view-model/sales/refund-item/refund-item-view-model'
import RefundItemStaffViewModel     from '../../../../view-model/sales/refund-item/refund-item-staff-view-model'
import ClientPrepaidCardsApi from '../../../../api/sales/prepaid-cards-api'
import ClientPrepaidServicesApi from '../../../../api/sales/prepaid-services-api'
import SalesCache                  from '../../../../helpers/cache/sales-cache'
import component_base              from '../../../common/component-base/component-base'
import view_table                  from '../../../common/view-table/view-table'
import refund_goods_types           from '../refund-goods-types/refund-goods-types.vue'
import select_service_panel        from '../../../common/select-services-panel/select-services-panel.vue'
import sales_item_products         from '../../sales-action/sales-item-products/sales-item-products.vue'
import input_money                 from '../../../common/form/input/input-money/input-money'
import alert_confirm               from '../../../common/alert/alert-confirm'
import SalesUtils                  from '../../../../helpers/utils/sales-utils'

import {
  formatMoney
}          from '../../../../helpers/common'

export default {
  components: {
    'view-table': view_table,
    'refund-goods-types': refund_goods_types,
    'select-service-panel': select_service_panel,
    'sales-item-products': sales_item_products,
    'input-money': input_money,
    'alert-confirm': alert_confirm,
  },
  extends: component_base,
  props: {
    staffs: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      options,
      sales_options,
      sales_utils : SalesUtils,

      is_viewed_services: false,
      is_viewed_products: false,
      is_viewed_prepaid_cards: false,
      is_viewed_prepaid_services: false,

      sales_cache: new SalesCache(),
      sales_setup: {},

      refund_items_selected: {
        type: sales_options.sales_goods_type.service,
        items: []
      },

      selected_products: [],

      // prepaid cards
      client_prepaid_card_api: new ClientPrepaidCardsApi(),

      // prepaid service
      client_prepaid_service_api: new ClientPrepaidServicesApi(),

      staff: new RefundItemStaffViewModel(),

      alert_id: 'warning-selected-refund-items-not-save',
      alert_data: [],
      alert_refund_goods_type: 0,

      errors: [],
    }
  },
  computed: {
    ...mapGetters('client', {
      x_client: 'getClientInformation'
    }),
    ...mapGetters('refund', {
      x_refund_action: 'getRefundAction',
      x_refund_action_helper: 'getRefundActionHelper'
    }),
    form_title(){return this.$i18n.t('refund.add-refund-item')},
    customized_prepaid_service(){return this.$i18n.t('sales.customized-prepaid-service')},
    warning_change_sales_item_tab(){return this.$i18n.t('sales.warning-selected-sales-items-not-save')},
    warning_deduct_qty_larger_existing_qty(){return this.$i18n.t('sales.warning-deduct-qty-larger-existing-qty')},
    warning_deduction_balance_can_not_empty(){return this.$i18n.t('sales.warning_deduction_balance_can_not_empty')},
    warning_can_not_input_beyond_balance(){return this.$i18n.t('sales.warning_can_not_input_beyond_balance')},
    warning_deduction_quantity_can_not_empty(){return this.$i18n.t('sales.warning_deduction_quantity_can_not_empty')},
    warning_can_not_input_beyond_remaining_quantity(){return this.$i18n.t('sales.warning-can-not-input-beyond-remaining-quantity')},
    warning_please_choose_somethings(){return this.$i18n.t('sales.warning-please-choose-somethings')},

    is_showed_goods(){
      return this.showed_sales_goods_types[0].showed || this.showed_sales_goods_types[1].showed
    },
    is_showed_prepaid_goods(){
      return this.showed_sales_goods_types[2].showed || this.showed_sales_goods_types[3].showed
    },
    showed_sales_goods_types(){
      let tmp_types = [
        { id: sales_options.sales_goods_type.service,         showed: false },
        { id: sales_options.sales_goods_type.product,         showed: false },
        { id: sales_options.sales_goods_type.prepaid_card,    showed: false },
        { id: sales_options.sales_goods_type.prepaid_service, showed: false }
      ]
      for(let i in tmp_types){
        if(tmp_types[i].id == this.x_refund_action.options.sales_goods_type)
          tmp_types[i].showed = true
        else
          tmp_types[i].showed = false
      }
      return tmp_types
    },
    has_client(){
      return this.x_client && this.x_client.data && this.x_client.data.id > 0
    },
    staff_options(){
      let tmp_option_not_selected = {
        sales_item_staff_id: 0,
        staff_id: 0,
        staff_name: 'Not Selected',
        amount: 0,
        selected: true
      }

      return [tmp_option_not_selected, ...this.staffs]
    },
    table_prepaid_cards() {
      return {
        fields: [
          { field: 'mobile',              label: 'prepaid-cards.prepaid-cards',   width: 'auto', sortable: false, thClass: 'mobile',         expand: true, tdClass: 'mobile' },
          { field: 'id',                  label: '',                              width: '5%',   sortable: false, thClass: 'location',       expand: true, tdClass: 'id' },
          { field: 'prepaid_card_name',   label: 'prepaid-cards.prepaid-cards',   width: '20%',  sortable: false, thClass: 'date',           expand: true },
          { field: 'balance',             label: 'sales.balance',                 width: '11%',  sortable: false, thClass: 'sales-items',    expand: true },
          { field: 'initial_balance',     label: 'prepaid-cards.initial-balance', width: '11%',  sortable: false, thClass: 'staffs',         expand: true },
          { field: 'invoice_date_time_ts',label: 'sales.sales-date',              width: '11%',  sortable: false, thClass: 'sales-type',     expand: true },
          { field: 'expiry_date_ts',      label: 'refund.expiry-date',            width: '11%',  sortable: false, thClass: 'discount',       expand: true },
          { field: 'shop_id',             label: 'refund.deduction-balance',      width: '15%',  sortable: false, thClass: 'amount',         expand: true },
          { field: 'client_id',           label: 'refund.refund-amount',          width: '15%',  sortable: false, thClass: 'payment-method', expand: true },
        ],
        rows: this.x_refund_action_helper.client_prepaid_cards_all,
        pagination: {
          total_pages: 1
        },
        options: {
          pagination: true,
          fixed_header: true
        }
      }
    },
    table_prepaid_services(){
      return {
        fields: [
          { field: 'mobile',              label: 'refund.prepaid-service',            width: 'auto', sortable: false, thClass: 'mobile',         expand: true, tdClass: 'mobile' },
          { field: 'id',                  label: '',                                  width: '5%',   sortable: false, thClass: 'location',       expand: true, tdClass: 'id' },
          { field: 'prepaid_service_name',label: 'refund.prepaid-service',            width: '20%',  sortable: false, thClass: 'date',           expand: true },
          { field: 'quantity',            label: 'sales.remaining-quantity',          width: '13%',  sortable: false, thClass: 'sales-items',    expand: true },
          { field: 'initial_quantity',    label: 'prepaid-services.initial-quantity', width: '13%',  sortable: false, thClass: 'staffs',         expand: true },
          { field: 'invoice_date_time_ts',label: 'sales.sales-date',                  width: '11%',  sortable: false, thClass: 'sales-type',     expand: true },
          { field: 'expiry_date_ts',      label: 'refund.expiry-date',                width: '11%',  sortable: false, thClass: 'discount',       expand: true },
          { field: 'shop_id',             label: 'refund.deduction-quantity',         width: '12%',  sortable: false, thClass: 'amount',         expand: true },
          { field: 'client_id',           label: 'refund.refund-amount',              width: '12%',  sortable: false, thClass: 'payment-method', expand: true },
        ],
        rows: this.x_refund_action_helper.client_prepaid_services,
        pagination: {
          total_pages: 1
        },
        options: {
          pagination: true,
          fixed_header: true
        }
      }
    }
  },
  methods: {
    ...mapMutations('refund', [
      'setRefundActionShowedGoodsType',
      'setSalesActionHelperBalanceMoves'
    ]),
    moment,
    formatMoney,
    hideModal(){
      this.setRefundActionShowedGoodsType(sales_options.sales_goods_type.service)
      this.$refs['refund_goods_types'].sales_goods_type_selected = sales_options.sales_goods_type.service
      this.hideDialogById('refund-items-adding-action-modal')
    },
    onCancel(){
      this.hideModal()

      this.is_viewed_services = false
      this.is_viewed_products = false
      this.is_viewed_prepaid_cards = false
      this.is_viewed_prepaid_services = false
    },
    async onLoadForm(){
      this.sales_setup = await this.sales_cache.getAllSalesSetupCache(this.shop_data.shop_id)
      if(this.isMissingSalesSetup(this.sales_setup)){
        this.showAlert(this.sales_setup.error_messages)
      }

      this.errors = []
      this.staff = new RefundItemStaffViewModel()

      this.viewGoodsTypeContent()
      
      if(this.has_client && this.sales_setup.sales_general_setup.auto_select_staff_when_sales && this.staff_options.length > 1){
        this.onInputStaff(this.x_client.data.preferred_staff_id)
      }
    },
    onClickedGoodsType(sales_goods_type){
      // #todo: change goods_type tab -> alert when items selected
      // if(this.refund_items_selected.items.length > 0){
      //   this.alert_sales_goods_type = sales_goods_type
      //   this.alert_data = [this.warning_change_sales_item_tab]
      //   this.showDialogById(this.alert_id)
      // }
      // else {
      //   this.setRefundActionShowedGoodsType(sales_goods_type)
      //   this.viewGoodsTypeContent()
      // }
      
      this.setRefundActionShowedGoodsType(sales_goods_type)
      this.viewGoodsTypeContent()
    },
    viewGoodsTypeContent(){
      if(this.x_refund_action.options.sales_goods_type == sales_options.sales_goods_type.service){
        this.is_viewed_services = true
        this.resetSalesItemsSelected(sales_options.sales_goods_type.service)

        let ref_select_service_panel = this.$refs['select_service_panel']
        if(ref_select_service_panel){
          ref_select_service_panel.onSelectServiceCategory(0)
          ref_select_service_panel.resetSelectedServices()
        }
      }
      if(this.x_refund_action.options.sales_goods_type == sales_options.sales_goods_type.product){
        this.is_viewed_products = true
        this.resetSalesItemsSelected(sales_options.sales_goods_type.product)
        this.selected_products = []
      }
      if(this.x_refund_action.options.sales_goods_type == sales_options.sales_goods_type.prepaid_card){
        this.is_viewed_prepaid_cards = true
        this.resetSalesItemsSelected(sales_options.sales_goods_type.prepaid_card)
      }
      if(this.x_refund_action.options.sales_goods_type == sales_options.sales_goods_type.prepaid_service){
        this.is_viewed_prepaid_services = true
        this.resetSalesItemsSelected(sales_options.sales_goods_type.prepaid_service)
      }
    },
    resetSalesItemsSelected(sales_goods_type){
      this.refund_items_selected.type = sales_goods_type
      this.refund_items_selected.items = []
      // this.staff.fields.staff_id = 0
    },
    isDataOfCurrentShop(row){
      return row.shop_id == this.shop_data.shop_id
    },

    // goods
    onRemoveRefundItemGoods(key){
      if(this.refund_items_selected.type == sales_options.sales_goods_type.service){
        this.onRemoveSalesItemService(key)
      }
      if(this.refund_items_selected.type == sales_options.sales_goods_type.product){
        this.onRemoveSalesItemProduct(key)
      }
      if(this.refund_items_selected.type == sales_options.sales_goods_type.deduct_prepaid_service){
        this.onRemoveSalesItemDeductPrepaidService(key)
      }
    },

    // service
    onGetSelectedServices(selected_services){
      this.mapServicesToRefundItems(selected_services)
    },
    mapServicesToRefundItems(selected_services){
      let tmp_refund_items = []
      for(let service of selected_services){
        let tmp_refund_item = new RefundItemViewModel()
        
        tmp_refund_item.fields.goods_type         = sales_options.sales_goods_type.service
        tmp_refund_item.fields.goods_category_id  = service.category
        tmp_refund_item.fields.goods_category_name= service.category_name
        tmp_refund_item.fields.goods_id           = service.id
        tmp_refund_item.fields.original_goods_id  = service.id
        tmp_refund_item.fields.goods_name         = service.name
        tmp_refund_item.fields.unit_price         = service.price
        tmp_refund_item.fields.amount             = service.price
        tmp_refund_item.fields.key                = service.key
        tmp_refund_items.push(tmp_refund_item.getFields())
      }
      this.refund_items_selected.items = tmp_refund_items
    },
    onRemoveSalesItemService(service_key){
      this.$refs['select_service_panel'].onRemoveService(service_key)
    },

    // product
    onSelectProduct(selected_product){
      this.selected_products.push(selected_product)
      for(let i in this.selected_products){
        this.selected_products[i].key = i
      }
      this.mapProductsToRefundItems(this.selected_products)
    },
    mapProductsToRefundItems(selected_products){
      let tmp_refund_items = []
      for(let product of selected_products){
        let tmp_refund_item = new RefundItemViewModel()
        
        tmp_refund_item.fields.goods_type               = sales_options.sales_goods_type.product
        tmp_refund_item.fields.goods_category_id        = product.product_category_id
        tmp_refund_item.fields.goods_category_name      = product.product_category_name
        tmp_refund_item.fields.goods_id                 = product.id
        tmp_refund_item.fields.original_goods_id        = product.id
        tmp_refund_item.fields.goods_name               = product.name
        tmp_refund_item.fields.unit_price               = product.retail_price
        tmp_refund_item.fields.amount                   = product.retail_price
        tmp_refund_item.fields.key                      = product.key

        tmp_refund_item.fields.product_code             = product.code
        tmp_refund_item.fields.product_supplier_price   = product.supplier_price
        tmp_refund_items.push(tmp_refund_item.getFields())
      }
      this.refund_items_selected.items = tmp_refund_items
    },
    onRemoveSalesItemProduct(product_key){
      this.selected_products = this.selected_products.filter(p => p.key != product_key)
      this.mapProductsToRefundItems(this.selected_products)
    },

    // prepaid card
    onSelectClientPrepaidCard(row_selected){
      for(let row of this.table_prepaid_cards.rows){
        if(row.id == row_selected.id){
          row.is_selected = row_selected.is_selected
        }
      }
    },
    onInputClientPrepaidCard(row){
      for(let tmp_prepaid_card of this.table_prepaid_cards.rows){
        if(tmp_prepaid_card.id == row.id){
          tmp_prepaid_card.deduction_balance = row.deduction_balance
          tmp_prepaid_card.refund_amount     = row.refund_amount
        }
      }
    },
    mapPrepaidCardToRefundItem(){
      let tmp_prepaid_cards_selected = this.table_prepaid_cards.rows.filter(c => c.is_selected)
      let tmp_refund_items = []

      if(tmp_prepaid_cards_selected.length > 0){
        for(let prepaid_card of tmp_prepaid_cards_selected){
          let tmp_refund_item = new RefundItemViewModel()
          
          tmp_refund_item.fields.goods_type        = sales_options.sales_goods_type.prepaid_card
          tmp_refund_item.fields.goods_category_id = 0
          tmp_refund_item.fields.goods_id          = prepaid_card.id
          tmp_refund_item.fields.original_goods_id = prepaid_card.prepaid_card_id
          tmp_refund_item.fields.goods_name        = prepaid_card.prepaid_card_name
          tmp_refund_item.fields.unit_price        = prepaid_card.sales_price
          tmp_refund_item.fields.amount            = prepaid_card.refund_amount
          tmp_refund_item.fields.key               = prepaid_card.key
          
          tmp_refund_item.fields.deduction_amount           = prepaid_card.deduction_balance
          tmp_refund_item.fields.prepaid_card_type          = prepaid_card.prepaid_card_type
          tmp_refund_item.fields.is_head_quarter_goods      = prepaid_card.is_head_quarter_goods
          tmp_refund_item.fields.is_customize_prepaid_goods = prepaid_card.is_customize_prepaid_goods          
          
          tmp_refund_items.push(tmp_refund_item.getFields())
        }
        this.refund_items_selected.items = tmp_refund_items
      }
    },

    // prepaid service
    onSelectClientPrepaidService(row_selected){
      for(let row of this.table_prepaid_services.rows){
        if(row.id == row_selected.id){
          row.is_selected = row_selected.is_selected
        }
      }
    },
    onInputClientPrepaidService(row){
      for(let tmp_prepaid_card of this.table_prepaid_services.rows){
        if(tmp_prepaid_card.id == row.id){
          tmp_prepaid_card.deduction_quantity = row.deduction_quantity
          tmp_prepaid_card.refund_amount      = row.refund_amount
        }
      }
    },
    mapPrepaidServiceToRefundItem(){
      let tmp_prepaid_services_selected = this.table_prepaid_services.rows.filter(s => s.is_selected)
      let tmp_refund_items = []

      if(tmp_prepaid_services_selected.length > 0){
        for(let prepaid_service of tmp_prepaid_services_selected){
          let tmp_refund_item = new RefundItemViewModel()
          
          tmp_refund_item.fields.goods_type           = sales_options.sales_goods_type.prepaid_service
          tmp_refund_item.fields.goods_category_id    = prepaid_service.service_category_id
          tmp_refund_item.fields.goods_category_name  = prepaid_service.service_category_name
          tmp_refund_item.fields.goods_id             = prepaid_service.id
          tmp_refund_item.fields.original_goods_id    = prepaid_service.prepaid_service_id
          tmp_refund_item.fields.goods_name           = prepaid_service.related_service_name
          tmp_refund_item.fields.unit_price           = prepaid_service.sales_price
          tmp_refund_item.fields.amount               = prepaid_service.refund_amount
          tmp_refund_item.fields.key                  = prepaid_service.key
          
          tmp_refund_item.fields.deduction_amount               = prepaid_service.deduction_quantity
          tmp_refund_item.fields.deducted_prepaid_goods_ref_name= prepaid_service.prepaid_service_name
          tmp_refund_item.fields.is_head_quarter_goods          = prepaid_service.is_head_quarter_goods
          tmp_refund_item.fields.is_customize_prepaid_goods     = prepaid_service.is_customize_prepaid_goods
          
          tmp_refund_items.push(tmp_refund_item.getFields())
        }
        this.refund_items_selected.items = tmp_refund_items
      }
    },
    
    // staffs
    onInputStaff(staff_id){
      let tmp_staffs = this.staff_options.filter(s => s.staff_id == staff_id)
      if(tmp_staffs.length > 0){
        this.staff.setFields(tmp_staffs[0])
      }
    },

    // alert confirm
    onAlertConfirm(){
      this.setSalesActionShowedGoodsType(this.alert_sales_goods_type)
      this.viewGoodsTypeContent()
    },
    onAlertCancel(){
      this.hideDialogById(this.alert_id)
    },

    async onConfirm(){
      // prepaid card
      if(this.showed_sales_goods_types[2].showed){
        let tmp_prepaid_cards_selected = this.table_prepaid_cards.rows.filter(c => c.is_selected)
        if(tmp_prepaid_cards_selected.length == 0){
          this.showAlert([this.warning_please_choose_somethings])
          return
        }
        else {
          for(let prepaid_card of tmp_prepaid_cards_selected){
            if(prepaid_card.prepaid_card_type == sales_options.prepaid_card_type.deposit_card && !prepaid_card.deduction_balance > 0){
              this.showAlert([this.warning_deduction_balance_can_not_empty])
              return
            }
          }
        }
        for(let prepaid_card of this.table_prepaid_cards.rows){
          if(prepaid_card.deduction_balance > prepaid_card.balance){
            this.showAlert([this.warning_can_not_input_beyond_balance])
            return
          }
        }
        this.mapPrepaidCardToRefundItem()
      }
      
      // prepaid service
      if(this.showed_sales_goods_types[3].showed){
        let tmp_prepaid_services_selected = this.table_prepaid_services.rows.filter(s => s.is_selected)
        if(tmp_prepaid_services_selected.length == 0){
          this.showAlert([this.warning_please_choose_somethings])
          return
        }
        else {
          for(let prepaid_service of tmp_prepaid_services_selected){
            if(prepaid_service.initial_quantity != -1 && !prepaid_service.deduction_quantity > 0){
              this.showAlert([this.warning_deduction_quantity_can_not_empty])
              return
            }
          }
        }
        for(let prepaid_service of this.table_prepaid_services.rows){
          if(prepaid_service.deduction_quantity > 0 && prepaid_service.deduction_quantity > prepaid_service.quantity){
            this.showAlert([this.warning_can_not_input_beyond_remaining_quantity])
            return
          }
        }
        this.mapPrepaidServiceToRefundItem()
      }
      
      // staffs
      for(let refund_item of this.refund_items_selected.items){
        if(this.staff.fields.staff_id > 0){
          this.staff.fields.amount = refund_item.amount
          refund_item.staffs = [_.cloneDeep(this.staff.fields)]
        }
        else 
          refund_item.staffs = []
      }
      
      this.$emit('add-refund-items', this.refund_items_selected.items)
      this.hideModal()
    },

    formatDateOnTable(date_ts){
      return moment(new Date(date_ts * 1000)).format(options.standard_date_format.ymd)
    }
  }
}
</script>

<style lang='scss'>
@import './refund-items-adding-action.scss';
</style>