<template>
  <b-modal id="refund-action-modal" 
           :title="form_title"
           :no-close-on-backdrop="true"
           hide-footer 
           class="refund-action-modal"
           @show="onLoadForm">
    <div class="refund-items-wrapper">
      <div class="add-refund-item">
        <div class="view-pc">
          <div class="title">{{ $t('refund.add-refund-item') }}</div>
          <refund-goods-types :is_show_modal="true" @clicked-goods-type="onClickedGoodsType"/>
        </div>
        <div class="view-mobile">
          <div class="btn" @click="onClickedGoodsType(sales_options.sales_goods_type.service)">{{ $t('refund.add-refund-item') }}</div>
        </div>
      </div>
      <div class="refund-items-table">
        <view-table :data="table_data">
          <template slot="quantity" slot-scope="{ row }">
            <div v-if="isPrepaidCard(row)" class="is-prepaid-card" @click="onClickDeductPrepaidCard">
              {{ formatMoney(row.quantity,0) }}
            </div>
            <div v-else-if="isPrepaidService(row)" class="is-prepaid-service" @click="onClickDeductPrepaidService">
              {{ formatMoney(row.deduction_amount,0) }}
            </div>
            <div v-else class="active-block">
              <input-money v-model="row.quantity" :decimal="0" :zero="true"
                           @input="onInputRefundItemQuantity(row)"/>
            </div>
          </template>

          <template slot="amount" slot-scope="{ row }" class="test">
            <div class="active-block amount">
              <template v-if="isPrepaidCard(row)">
                <div class="is-prepaid-card" @click="onClickDeductPrepaidCard">
                  {{ formatMoney(row.amount, 0) }}
                  <span v-if="isDepositCard(row)"><br>({{ formatMoney(row.deduction_amount,0) }})</span>
                </div>
              </template>
              <template v-else-if="isPrepaidService(row)">
                <div class="is-prepaid-service" @click="onClickDeductPrepaidService">
                  {{ formatMoney(row.amount, 0) }}
                </div>
              </template>
              <template v-else>
                <input-money v-model="row.amount" :decimal="0" :zero="true"
                             @input="onInputRefundItemAmount(row)"/>
              </template>
            </div>
          </template>

          <template slot="staffs" slot-scope="{ row }">
            <div class="active-block">
              <div @click="onActionRefundItem(row, sales_options.refund_item_action_type.staff_action)"
                   v-html="formatRefundItemStaffs(row.staffs)"/>
            </div>
          </template>

          <template slot="delete" slot-scope="{ row }">
            <a class="btn" @click="onDeleteRefundItem(row)">x</a>
          </template>
        </view-table>
      </div>
    </div>
    
    <div class="check-out-wrapper">
      <div class="row view-pc">
        <div class="col-12 title">{{ $t('sales.refund') }}</div>
      </div>
      <div class="row">
        <div class="col-12 col-lg-10">
          <div class="check-out-brief view-pc">
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
                  <span @click="removeRefundPayment(payment)">x</span>
                </div>
              </li>

              <li :class="{ 'change': refund.fields.remaining < 0 }" class="outstanding remaining hide">
                <template v-if="refund.fields.remaining >= 0">
                  <div>{{ $t('sales.outstanding') }}</div>
                  <div>{{ formatMoney(refund.fields.remaining, 0) }}</div>
                </template>
                <template v-else>
                  <div>{{ $t('sales.change') }}</div>
                  <div>{{ formatMoney(refund.fields.remaining * -1, 0) }}</div>
                </template>
              </li>

              <li class="earn-loyalty-points">
                <div>{{ $t('sales.deduction-loyalty-points') }}</div>
                <div v-if="has_client">
                  <input-money v-model="refund.fields.deduction_points" :decimal="0" :zero="true"/>
                </div>
                <div v-else class="no-client">0</div>
              </li>
            </ul>
          </div>

          <div class="paying">
            <div class="payment-wrapper">
              <select-payment-method-panel v-if="form_showed"
                                           :payment_method_setup="payment_method_setup" 
                                           @selected="onSelectedPaymentMethod"/>
            </div>
            <div class="check-out-brief view-mobile">
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
                    <span @click="removeRefundPayment(payment)">x</span>
                  </div>
                </li>

                <li :class="{ 'change': refund.fields.remaining < 0 }" class="outstanding remaining hide">
                  <template v-if="refund.fields.remaining >= 0">
                    <div>{{ $t('sales.outstanding') }}</div>
                    <div>{{ formatMoney(refund.fields.remaining, 0) }}</div>
                  </template>
                  <template v-else>
                    <div>{{ $t('sales.change') }}</div>
                    <div>{{ formatMoney(refund.fields.remaining * -1, 0) }}</div>
                  </template>
                </li>

                <li class="earn-loyalty-points">
                  <div>{{ $t('sales.deduction-loyalty-points') }}</div>
                  <div v-if="has_client">
                    <input-money v-model="refund.fields.deduction_points" :decimal="0" :zero="true"/>
                  </div>
                  <div v-else class="no-client">0</div>
                </li>
              </ul>
            </div>
            <div class="notes-date-wrapper">
              <div class="notes">
                <b-form-textarea v-model="refund.fields.notes" :rows="2" placeholder=""/>
              </div>
              <div class="date-time">
                <label>{{ $t('sales.sales-date') }}</label>
                <div>
                  <input v-model="invoice_date" :disabled="false" class="date">
                  <input v-model="invoice_time" :disabled="false" class="time">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-2">
          <div class="modal-footer refund-submit">
            <div class="btn-action-group">
              <button class="btn btn-default" @click="onConfirm">{{ $t('general.save') }}</button>
              <button class="btn btn-secondary" @click="onCancel">{{ $t('general.cancel') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <refund-items-adding-action ref="sales_item_action"
                                :has_client="has_client"
                                :staffs="staff_options" 
                                @add-refund-items="onAddRefundItems"/>
    <sales-item-staff-action :staff_options="staff_options"
                             type="refund"
                             @apply-staffs="onRefundItemStaffsApply"/>
    <input-money-calculator-panel-action @input-money-calculator="onInputMoneyCalculator"/>
  </b-modal>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { mapGetters, mapMutations } from 'vuex'
import { options } from '../../../helpers/options'
import { sales_options } from '../../../helpers/options/sales-options'
import SalesCache from '../../../helpers/cache/sales-cache'
import SalesUtils from '../../../helpers/utils/sales-utils'
import RefundViewModel from '../../../view-model/sales/refund/refund-view-model'
import RefundItemStaffViewModel from '../../../view-model/sales/refund-item/refund-item-staff-view-model'
import ClientPrepaidServicesApi from '../../../api/sales/prepaid-services-api'
import staff_mixin from '../../../helpers/mixins/staff-mixin'
import client_prepaid_cards_mixin from '../../../helpers/mixins/client-prepaid-cards-mixin'
import RefundApi from '../../../api/sales/refund-api'
import component_base     from '../../common/component-base/component-base'
import error_box          from '../../common/form/error-box/error-box' 
import btn_action_group   from '../../common/button/btn-action-group/btn-action-group'
import refund_goods_types from '../../sales/refund-action/refund-goods-types/refund-goods-types.vue'
import refund_items_adding_action from './refund-items-adding-action/refund-items-adding-action.vue'
import sales_item_staff_action from '../sales-item-staff-action/sales-item-staff-action.vue'
import select_payment_method_panel from '../select-payment-method-panel/select-payment-method-panel.vue'
import input_money_calculator_panel_action  from '../input-money-calculator-panel-action/input-money-calculator-panel-action.vue'
import view_table from '../../common/view-table/view-table'
import input_money from '../../common/form/input/input-money/input-money'
import sales_client_account_mixin from '../../../helpers/mixins/sales-client-account-mixin'

import { 
  formatMoney,
  convertDateToTimezone,
  convertDateFromLocalToTimezone,
  // convertTimeStampPlusLocalzone,
  convertDateToTimeStamp,
  mapActionSecurityInfo 
}                  from '../../../helpers/common'

export default {
  components: {
    'refund-goods-types': refund_goods_types,
    'refund-items-adding-action': refund_items_adding_action,
    'sales-item-staff-action': sales_item_staff_action,
    'select-payment-method-panel': select_payment_method_panel,
    'input-money-calculator-panel-action': input_money_calculator_panel_action,
    'error-box': error_box,
    'btn-action-group': btn_action_group,
    'view-table': view_table,
    'input-money': input_money
  },
  extends: component_base,
  mixins: [staff_mixin, client_prepaid_cards_mixin, sales_client_account_mixin],
  data() {
    return {
      options,
      sales_options,

      form_showed : false,
      form_options: {
        delete: false
      },

      sales_cache            : new SalesCache(),
      sales_setup            : {},
      loyalty_points_setups  : {},
      payment_method_setup   : [],

      refund_api: new RefundApi(),
      refund: new RefundViewModel(),

      client_prepaid_services_api: new ClientPrepaidServicesApi(),

      invoice_date: new Date(),
      invoice_time: '',

      watch_total_amount: 0,

      errors: []
    }
  },
  computed: {
    ...mapGetters('client', {
      x_client: 'getClientInformation'
    }),
    ...mapGetters('refund', {
      x_refund_action: 'getRefundAction',
      x_refund_item_action: 'getRefundItemAction',
    }),
    ...mapGetters('sales', {
      x_money_calculator_panel_action: 'getMoneyCalculatorPanelAction'
    }),
    ...mapGetters('staff',{
      x_staff_options : 'getStaffOptions'
    }),
    staff_options(){
      let tmp_staff_options = []
      for(let staff of this.x_staff_options){
        let tmp_staff = new RefundItemStaffViewModel()
        tmp_staff.mapFieldsFromStaffInfo(staff)
        tmp_staff_options.push(tmp_staff.getFields())
      }
      this.setRefundActionHelperStaffOptions(tmp_staff_options)

      return tmp_staff_options
    },
    form_title(){
      let tmp_title = ''
      if(this.x_refund_action.action == options.form_actions.add)
        tmp_title = this.$i18n.t('sales.add-refund')
      if(this.x_refund_action.action == options.form_actions.edit)
        tmp_title = this.$i18n.t('sales.edit-refund')
      return tmp_title
    },
    no_selected_staff(){return this.$i18n.t('sales.no-selected-staff')},
    refund_amount_not_equal_total_amount(){return this.$i18n.t('refund.refund-amount-not-equal-total-amount')},
    warning_refund_items_list_can_not_be_empty(){return this.$i18n.t('refund.warning-refund-items-list-can-not-be-empty')},
    warning_can_not_add_refund_in_future(){return this.$i18n.t('sales.warning-can-not-add-refund-in-future')},
    has_client(){
      return this.x_client && this.x_client.data && this.x_client.data.id > 0
    },
    table_data(){
      return {
        fields: [
          { field: 'goods_name',                  label: 'refund.refund-items',   width: '35%', sortable: false,               tdClass: 'refund-items' },
          { field: 'quantity',                    label: 'sales.q-ty',            width: '15%', sortable: false, expand: true, tdClass: 'quantity' },
          { field: 'amount',                      label: 'sales.amount',          width: '20%', sortable: false, expand: true, tdClass: 'amount' },
          { field: 'staffs',                      label: 'sales.staff',           width: '20%', sortable: false, expand: true, tdClass: 'staff' },
          { field: 'delete',                      label: 'general.delete',        width: '10%', sortable: false, expand: true, tdClass: 'delete' }
        ],
        rows: this.refund.fields.refund_items,
        pagination:{
          total_pages: 1
        },
        options: {
          // pagination: false
        }
      }
    }
  },
  methods: {
    ...mapMutations('refund', [
      'setRefundActionShowedGoodsType',
      'setRefundActionRefundFields',
      'setRefundItemActionItemFields',
      'setRefundActionHelperStaffOptions',
      'setRefundActionHelperClientPrepaidCardsAll',
      'setRefundActionHelperClientPrepaidCards',
      'setRefundActionHelperClientPrepaidServices'
    ]),
    ...mapMutations('sales', [
      'setMoneyCalculatorPanelAction',
      'setSalesActionHelperClientPrepaidCards',
      'setSalesActionHelperClientPrepaidCardsDiscount',
      'setSalesActionHelperClientPrepaidCardsAll'
    ]),
    formatMoney,

    hideModal(){
      this.hideDialogById('refund-action-modal')
    },
    onCancel(){
      this.hideModal()
      this.form_showed = false
    },
    async loadClientPrepaidCardsAsync(){
      if(this.has_client){
        let result = await this.getClientPrepaidCardsAsyncMixin(this.x_client.data.id, sales_options.prepaid_card_type.all, false)

        if(result.is_ok) {
          let tmp_client_prepaid_cards_deposit = []
          let tmp_client_prepaid_cards_discount = []
          for(let card of result.data.items){
            if(card.prepaid_card_type == options.prepaid_card_type.deposit_card){
              tmp_client_prepaid_cards_deposit.push(card)
            }
            if(card.prepaid_card_type == options.prepaid_card_type.discount_card){
              tmp_client_prepaid_cards_discount.push(card)
            }
          }
          this.setRefundActionHelperClientPrepaidCardsAll(result.data.items)
          this.setRefundActionHelperClientPrepaidCards(tmp_client_prepaid_cards_deposit)
          this.setSalesActionHelperClientPrepaidCards(tmp_client_prepaid_cards_deposit)
          
          this.setSalesActionHelperClientPrepaidCardsDiscount(tmp_client_prepaid_cards_discount)
          this.setSalesActionHelperClientPrepaidCardsAll(result.data.items)
        } else {
          this.showAlert(result.error_messages)
        }
      }
    },
    async loadClientPrepaidServicesAsync(){
      if(this.has_client){
        let query = {
          client_id             : this.x_client.data.id,
          show_expired          : false,
          include_family_service: false,
          page_size             : options.pagination.default,
          page_number           : 1,
          shop_id               : this.shop_data.shop_id
        }
        
        this.preLoader()
        let result = await this.client_prepaid_services_api.getPrepaidServicesAsync(query)
        this.preLoader(false)
        
        if(result.is_ok){
          this.setRefundActionHelperClientPrepaidServices(result.data.items)
        }else{
          this.showAlert(result.error_messages)
        }
      }
    },
    async onLoadForm(){
      this.form_showed = true
      this.errors = []

      if(this.x_refund_action.action == options.form_actions.add) {
        this.refund = new RefundViewModel()
        this.showDialogById('refund-items-adding-action-modal')
        
        this.refund.fields.invoice_date_time = convertDateToTimezone(new Date())
        this.watch_total_amount = this.refund.fields.total_amount
      }
      this.setClientInfoToRefund()
      this.setDateTimeToSales()

      // sales setup
      this.sales_setup = await this.sales_cache.getAllSalesSetupCache(this.shop_data.shop_id)
      if(this.isMissingSalesSetup(this.sales_setup)){
        this.showAlert(this.sales_setup.error_messages)
      }
      else{
        this.payment_method_setup    = this.sales_setup.payment_method_setup
        this.loyalty_points_setups   = this.sales_setup.loyalty_points_setups
      }

      // client prepaid cards
      await this.loadClientPrepaidCardsAsync()

      // client prepaid services
      await this.loadClientPrepaidServicesAsync()
    },
    setClientInfoToRefund(){
      // chain-sharing
      this.refund.fields.chain_id              = this.shop_data.chain_id
      this.refund.fields.branch_number         = this.shop_data.branch_number
      this.refund.fields.shop_name             = this.shop_data.shop_name
      this.refund.fields.client_shop_id        = this.shop_data.shop_id
      this.refund.fields.client_shop_name      = this.shop_data.shop_name

      if(this.has_client){
        this.refund.fields.client_id             = this.x_client.data.id
        this.refund.fields.member_number         = this.x_client.data.member_number
        this.refund.fields.client_name           = this.x_client.data.client_name
        this.refund.fields.client_phone_number   = this.x_client.data.phone_number  == null ? '' : this.x_client.data.phone_number
        this.refund.fields.client_mobile_number  = this.x_client.data.mobile_number == null ? '' : this.x_client.data.mobile_number
        this.refund.fields.client_mobile_number2 = this.x_client.data.mobile_number2== null ? '' : this.x_client.data.mobile_number2
        this.refund.fields.client_rating_id      = this.x_client.data.client_rating_id,
        this.refund.fields.client_rating_name    = this.x_client.data.client_rating_name,
        this.refund.fields.client_sex            = this.x_client.data.sex,
        this.refund.fields.family_id             = this.sales_client_account.fields.family_id
        
        // chain-sharing
        this.refund.fields.client_shop_id        = this.x_client.data.shop_id
        this.refund.fields.client_shop_name      = this.x_client.data.shop_name
      }
    },
    setDateTimeToSales(){
      this.invoice_date = moment(this.refund.fields.invoice_date_time).format(options.standard_date_format.ymd)
      this.invoice_time = moment(this.refund.fields.invoice_date_time).format(options.standard_hour_format.h24)
    },
    
    // add & delete refund-items
    onClickedGoodsType(sales_goods_type){
      this.setRefundActionShowedGoodsType(sales_goods_type)
      this.showDialogById('refund-items-adding-action-modal')
    },
    onAddRefundItems(refund_items_selected){
      for(let refund_item_selected of refund_items_selected){
        if(refund_item_selected.goods_type == sales_options.sales_goods_type.prepaid_card
        || refund_item_selected.goods_type == sales_options.sales_goods_type.prepaid_service){
          let same_refund_items = this.refund.fields.refund_items.filter(i => i.goods_type == refund_item_selected.goods_id && i.goods_id == refund_item_selected.goods_id)
          if(same_refund_items.length == 0){
            this.refund.fields.refund_items.push(refund_item_selected)
          }
          else {
            for(let refund_item of same_refund_items){
              refund_item.deduction_amount = refund_item_selected.deduction_amount
              refund_item.amount           = refund_item_selected.amount
            }
          }
        }
        else {
          this.refund.fields.refund_items.push(refund_item_selected)
        }
      }
      this.updateRefundItemsKey()
      this.updateRefundCheckout()
    },
    onDeleteRefundItem(refund_item){
      let tmp_error_messages = []

      // service
      if(refund_item.goods_type == sales_options.sales_goods_type.service){
        // 
      }
      
      // product
      if(refund_item.goods_type == sales_options.sales_goods_type.product){
        // 
      }

      // prepaid card
      if(refund_item.goods_type == sales_options.sales_goods_type.prepaid_card){
        // 
      }

      // prepaid service
      if(refund_item.goods_type == sales_options.sales_goods_type.prepaid_service){
        // 
      }
      
      if(tmp_error_messages.length == 0){
        this.refund.fields.refund_items = this.refund.fields.refund_items.filter(i => i.key != refund_item.key)
        this.updateRefundItemsKey()
        this.updateRefundCheckout()
      }
      else {
        this.showAlert(tmp_error_messages)
      }
    },
    updateRefundItemsKey(){
      for(let i in this.refund.fields.refund_items){
        this.refund.fields.refund_items[i].key = i
      }
    },

    // edit refund-item
    onInputRefundItemQuantity(refund_item){
      refund_item.amount = refund_item.unit_price * refund_item.quantity
      this.updateRefundItemAmount(refund_item)
    },
    onInputRefundItemAmount(refund_item){
      refund_item.unit_price = refund_item.amount / refund_item.quantity
      this.updateRefundItemAmount(refund_item)
    },
    onActionRefundItem(refund_item, refund_item_action_type){
      this.setRefundItemActionItemFields(_.cloneDeep(refund_item))

      switch (refund_item_action_type) {
        case sales_options.refund_item_action_type.staff_action:
          this.showDialogById('sales-item-staff-action-modal')
          break
      }
    },
    onRefundItemStaffsApply(staffs){
      for(let refund_item of this.refund.fields.refund_items){
        if(refund_item.key == this.x_refund_item_action.data.key){
          refund_item.staffs = staffs
        }
      }
    },
    updateRefundItemAmount(refund_item){
      // update staffs amount
      for(let tmp_refund_item of this.refund.fields.refund_items){
        if(tmp_refund_item.key == refund_item.key){
          tmp_refund_item = Object.assign(tmp_refund_item, refund_item)
          tmp_refund_item.staffs = SalesUtils.updateStaffsAmountOfSalesItem(tmp_refund_item.staffs, tmp_refund_item.amount)
        }
      }
      
      this.updateRefundCheckout()
    },
    onClickDeductPrepaidCard(){
      this.onClickedGoodsType(sales_options.sales_goods_type.prepaid_card)
    },
    onClickDeductPrepaidService(){
      this.onClickedGoodsType(sales_options.sales_goods_type.prepaid_service)
    },
    
    // payment
    onSelectedPaymentMethod(payment_method_selected){
      let money_calculator_panel_action = {
        action: sales_options.calculator_type.sales_payment,
        data: 0,
        options: {
          payment_method_selected: payment_method_selected
        }
      }

      if(this.refund.fields.remaining > 0){
        money_calculator_panel_action.data = this.refund.fields.remaining
      }

      let used_payment_method = this.getUsedPaymentMethod(payment_method_selected.id)
      if(used_payment_method != undefined){
        money_calculator_panel_action.data = used_payment_method.payment_amount
      }
      
      this.setMoneyCalculatorPanelAction(money_calculator_panel_action)
      this.showDialogById('input-money-calculator-panel-action-modal')
    },
    getUsedPaymentMethod(payment_method_selected_id){
      return _.find(this.refund.fields.payments, { 'payment_method_id': payment_method_selected_id })
    },
    onInputMoneyCalculator(money_calculator){
      if(this.x_money_calculator_panel_action.action == sales_options.calculator_type.sales_payment){
        this.onInputPaymentMethodAmount(money_calculator)
      }
      this.updateRefundCheckout()
    },
    onInputPaymentMethodAmount(money_calculator){
      let payment_method_selected = this.x_money_calculator_panel_action.options.payment_method_selected
      let tmp_payment = {
        payment_method_id   : payment_method_selected.id,
        payment_method_name : payment_method_selected.name,
        payment_amount      : Number(money_calculator)
      }
      
      let used_payment_method = this.getUsedPaymentMethod(payment_method_selected.id)
      if(used_payment_method != undefined){
        used_payment_method.payment_amount = tmp_payment.payment_amount
      }
      else {
        this.refund.fields.payments.push(tmp_payment)
      }

      this.refund.fields.payments = this.refund.fields.payments.filter(p => p.payment_amount > 0)
      this.updateRefundCheckout()
    },
    removeRefundPayment(payment_removed){
      this.refund.fields.payments = this.refund.fields.payments.filter(p => p.payment_method_id != payment_removed.payment_method_id)
      this.updateRefundCheckout()
    },
    updateRefundCheckout(){
      // total amount
      let tmp_total_amount = 0
      for(let refund_item of this.refund.fields.refund_items){
        tmp_total_amount += Number(refund_item.amount)
      }
      this.refund.fields.total_amount = tmp_total_amount

      if(this.watch_total_amount != tmp_total_amount){
        this.watch_total_amount = tmp_total_amount

        this.refund.fields.payments = []
      }

      // payments
      let tmp_total_payments = 0
      for(let payment of this.refund.fields.payments){
        tmp_total_payments += payment.payment_amount
      }

      // remaining
      this.refund.fields.remaining = tmp_total_amount 
                                     - tmp_total_payments

      // loyalty points
      if(this.has_client) {
        this.refund.fields.deduction_points = SalesUtils.calculateRefundLoyaltyPoints(this.refund.fields.refund_items, this.refund.fields.payments, this.loyalty_points_setups, 0)
      }

      this.$forceUpdate()
    },

    async onConfirm(){
      if(this.x_refund_action.action == options.form_actions.add) {
        this.refund.fields.invoice_date_time_ts = this.getInvoiceDateTimeTS()
        this.refund.fields.hour_of_day          = this.getInvoiceTime()[0]
      }

      // validate ui
      if(!this.isValidateUIRefundAction()) return

      // validate view model
      this.errors = this.refund.isValid()
      
      if(this.errors.length > 0) {
        this.showAlert(this.errors)
      }
      else {
        this.submitActionAsync()
      }
    },
    getInvoiceDateTimeTS(){
      let tmp_date = new Date(this.invoice_date)
      if(tmp_date.getTimezoneOffset() > 0){
        tmp_date = convertDateFromLocalToTimezone(tmp_date)
      }

      let tmp_hour = this.getInvoiceTime()
      let tmp_second = moment(this.refund.fields.invoice_date_time).format(options.standard_hour_format.h24_seconds)
      tmp_second = tmp_second.substr(6, 2)
      tmp_date.setHours(tmp_hour[0], tmp_hour[1], tmp_second)

      let tmp_date_time_ts = convertDateToTimeStamp(tmp_date, null, true)
      return tmp_date_time_ts
    },
    getInvoiceTime(){
      return this.invoice_time.trim().split(':')
    },
    isValidateUIRefundAction(){
      let tmp_refund_vm = _.cloneDeep(this.refund)
      let error_messages = []
      let is_valid = true
      
      // refund items
      if(tmp_refund_vm.fields.refund_items.length == 0){
        error_messages.push(this.warning_refund_items_list_can_not_be_empty)
      }
      if(this.refund.fields.remaining != 0){
        error_messages.push(this.refund_amount_not_equal_total_amount)
      }
      if(error_messages.length > 0){
        is_valid = false
        this.showAlert(error_messages)
        return
      }

      // can not add refund in future
      let current_date_time_ts = convertDateToTimeStamp(convertDateToTimezone(new Date()), false, true)
      if(this.refund.fields.invoice_date_time_ts > current_date_time_ts){
        is_valid = false
        this.showAlert([this.warning_can_not_add_refund_in_future])
        return
      }

      return is_valid
    },
    async submitActionAsync(){
      // prepair sending data
      let current_date_time_ts = convertDateToTimeStamp(convertDateToTimezone(new Date()), false, true)
      let tmp_refund_vm = _.cloneDeep(this.refund)
      tmp_refund_vm.fields = mapActionSecurityInfo(tmp_refund_vm.fields, this.x_refund_action.action)

      let api_action = ''
      let success_action = ''
      if(this.x_refund_action.action == options.form_actions.add){
        api_action     = 'addRefundAsync'
        success_action = 'added'

        // time
        tmp_refund_vm.fields.created_date_time_ts = current_date_time_ts
      }
      
      // sending
      this.preLoader()
      let result = await this.refund_api[api_action](tmp_refund_vm)
      this.preLoader(false)
      
      if(result.is_ok) {
        this.$emit(success_action)
        this.hideModal()
      }
      else {
        this.showAlert(result.error_messages)
      }
    },

    // format for template
    isPrepaidCard(row){
      return row.goods_type == sales_options.sales_goods_type.prepaid_card
    },
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
    }
  }
}
</script>

<style lang='scss'>
@import './refund-action.scss';
</style>