<template>
  <div class="outstanding-payment-action-wrapper">
    <b-modal id="outstanding-payment-action-modal"
             :title="$t('sales-outstanding-payment.outstanding-payment')"
             :no-close-on-backdrop="true"
             size="xl"
             hide-footer
             class="outstanding-payment-action-modal"
             @show="onLoadForm()"
             @hide="onCancel()">
      <div class="modal-body">

        <!-- CLIENT INFO -->
        <div class="client-info">
          <h3><strong>{{ outstanding_add.fields.client_name }}</strong></h3>
          <p>{{ $t('sales-outstanding-payment.outstanding-balance') }} : {{ formatMoney(outstanding_add.fields.outstanding,0) }}</p>
        </div>

        <!-- PAYMENT INFO -->
        <div class="payment-info">
          <div class="payment">
            <div class="payment-method">
              <select-payment-method-panel v-if="form_showed" :payment_method_setup="payment_method_setup" @selected="onSelectedPaymentMethod"/>
            </div>
            <div class="payment-detail">
              <ul>
                <li v-for="(payment,index) in outstanding_add.fields.payments" :key="index" class="cash">
                  <div>{{ payment.fields.payment_method_name }}</div>
                  <div class="payment-amount">
                    {{ formatMoney(payment.fields.payment_amount,0) }}
                    <span @click="onRemovePayment(payment)">x</span>
                  </div>
                </li>
                <li class="loyalty-point">
                  <div>{{ $t('sales-outstanding-payment.loyalty-point') }}</div>
                  <div>
                    <input-money v-model="outstanding_add.fields.earned_points"/>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="staff-info">
            <div class="staffs-selected">
              <label>{{ $t('sales-outstanding-payment.staff') }}</label>
              <b-form-select
                :options="staff_options"
                v-model="outstanding_add.fields.staff_id"
                value-field="staff_id"
                text-field="staff_name"
                @input="onInputStaff">
                <template v-slot:first>
                  <option :value="staff_id_default">{{ $t('sales-outstanding-payment.not-selected') }}</option>
                </template>
              </b-form-select>
            </div>
            <div class="notes">
              <label>{{ $t('sales-outstanding-payment.notes') }}</label>
              <b-form-textarea v-model="outstanding_add.fields.notes" :rows="2"/>
            </div>
            <div class="date-time">
              <label>{{ $t('sales-outstanding-payment.sales-date') }}</label>
              <input :disabled="true" v-model="invoice_date" class="date">
              <input :disabled="true" v-model="invoice_time" class="time">
            </div>
          </div>
        </div>
        <error-box :errors="errors"/>
      </div>
      <footer class="modal-footer">
        <btn-action-group :data="form_options" @confirm="onConfirm" @cancel="onCancel"/>
      </footer>

      <!-- ACTION -->
      <calculator-action @input-money-calculator="onInputMoneyCalculator"/>
    </b-modal>
  </div>
</template>

<script>
const ADDED_OUTSTANDING_EVENT_NAME = 'added-outstanding'
import balance_deduction_action      from '../../sales/balance-deduction-action/balance-deduction-action.vue'
import calculator_action             from '../input-money-calculator-panel-action/input-money-calculator-panel-action.vue'
import input_money                   from '../../common/form/input/input-money/input-money.vue'
import OutstandingPaymentAPI         from '../../../api/sales/outstanding-payment-api.js'
import OutstandingAddViewModel       from '../../../view-model/sales/outstanding/outstanding-add-view-model.js'
import PaymentViewModel              from '../../../view-model/sales/outstanding/payment-view-model.js'
import btn_action_group              from '../../../components/common/button/btn-action-group/btn-action-group.vue'
import component_base                from '../../../components/common/component-base/component-base.vue'
import error_box                     from '../../../components/common/form/error-box/error-box.vue'
import select_payment_method_panel   from '../select-payment-method-panel/select-payment-method-panel.vue'
import SalesCache                    from '../../../helpers/cache/sales-cache'
import staff_mixin                   from '../../../helpers/mixins/staff-mixin'
import sales_mixin                   from '../../../helpers/mixins/sales-mixin'
import client_prepaid_cards_mixin    from '../../../helpers/mixins/client-prepaid-cards-mixin'
import SalesItemStaffViewModel       from '../../../view-model/sales/sales-item/sales-item-staff-view-model'

import { common_options }            from '../../../helpers/options/common-options.js'
import { options }                   from '../../../helpers/options'
import { sales_options }             from '../../../helpers/options/sales-options.js'
import _                             from 'lodash'
import moment                        from 'moment'
import { mapMutations, mapGetters }  from 'vuex'
import { convertDateToTimezone,
  formatMoney, }                     from '../../../helpers/common'

export default {
  components : {
    'error-box'                  : error_box,
    'btn-action-group'           : btn_action_group,
    'select-payment-method-panel': select_payment_method_panel,
    'input-money'                : input_money,
    'calculator-action'          : calculator_action,
    'balance-deduction-action'   : balance_deduction_action
  },
  extends    : component_base,
  mixins     : [staff_mixin,sales_mixin,client_prepaid_cards_mixin],
  data(){
    return {
      form_options                : {
        delete  : false,
        confirm : true
      },
      sales_cache                 : new SalesCache(),
      sales_setup                 : {},
      form_showed                 : false,
      payment_method_setup        : [],
      errors                      : [],
      outstanding_add             : new OutstandingAddViewModel(),
      invoice_date                : {},
      invoice_time                : '',
      payment                     : {},
      outstanding_payment_api     : new OutstandingPaymentAPI(),
      staff_id_default            : null
    }
  },
  computed:{
    ...mapGetters('user',{
      x_user : 'getUser'
    }),
    ...mapGetters('sales_client_account',{
      x_client_account_action : 'getClientAccountAction'
    }),
    ...mapGetters('staff',{
      x_staff_options : 'getStaffOptions'
    }),
    staff_options(){
      let tmp_staff_options = []
      for(let staff of this.x_staff_options){
        let tmp_staff = new SalesItemStaffViewModel()
        tmp_staff.mapFieldsFromStaffInfo(staff)
        tmp_staff_options.push(tmp_staff.getFields())
      }
      return tmp_staff_options
    },
  },
  methods:{
    ...mapMutations('sales',[
      'setMoneyCalculatorPanelAction',
      'setSalesActionHelperClientPrepaidCards',
      'setSalesActionHelperClientPrepaidCardsOrigin',
    ]),
    formatMoney,

    hideModal(){
      this.hideDialogById('outstanding-payment-action-modal')
    },
    onCancel(){
      this.hideModal()
    },
    async onLoadForm(){
      let date_setting = convertDateToTimezone(new Date())
      this.errors          = []
      this.form_showed     = true
      this.outstanding_add.setFields(new OutstandingAddViewModel().getFields())

      this.outstanding_add.setInvoiceDateTimeTs(date_setting)
      this.outstanding_add.setOutstandingBeforePaid(this.x_client_account_action.data.outstanding)
      this.outstanding_add.setClientInformation(this.x_client_account_action.data)
      this.outstanding_add.setUserInformation(this.x_user)
      this.outstanding_add.setShopInformation(this.shop_data)
      this.outstanding_add.calOutstanding()

      // chain-sharing: client only has outstanding at shop what registered client
      this.outstanding_add.fields.chain_id              = this.shop_data.chain_id
      this.outstanding_add.fields.branch_number         = this.shop_data.branch_number
      this.outstanding_add.fields.shop_name             = this.shop_data.shop_name
      this.outstanding_add.fields.client_shop_id        = this.shop_data.shop_id
      this.outstanding_add.fields.client_shop_name      = this.shop_data.shop_name
      
      // date-time
      this.invoice_date = moment(date_setting).format(common_options.standard_date_format.ymd)
      this.invoice_time = moment(date_setting).format(common_options.standard_hour_format.h24)

      this.sales_setup  = await this.sales_cache.getAllSalesSetupCache(this.shop_data.shop_id)
      await this.loadClientPrepaidCardsAsync()
      if(this.isMissingSalesSetup(this.sales_setup)){
        this.showAlert(this.sales_setup.error_messages)
      }
      else {
        this.payment_method_setup = this.sales_setup.payment_method_setup
      }
    },

    async onConfirm(){
      let tmp_outstanding_add = _.cloneDeep(this.outstanding_add)

      this.errors = tmp_outstanding_add.isValid()
      if(this.errors.length == 0){
        this.preLoader()
        let response = await this.outstanding_payment_api.addOutstandingPaymentAsync(tmp_outstanding_add)
        this.preLoader(false)
        if (response.is_ok){
          this.$emit(ADDED_OUTSTANDING_EVENT_NAME, response.data)
          this.hideModal()
        }else{
          this.errors = response.error_messages
        }
      }
    },

    async loadClientPrepaidCardsAsync(){
      let result = await this.getClientPrepaidCardsAsyncMixin(this.outstanding_add.fields.client_id, sales_options.prepaid_card_type.deposit_card, true)
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
        this.setSalesActionHelperClientPrepaidCards(tmp_client_prepaid_cards_deposit)
        this.setSalesActionHelperClientPrepaidCardsOrigin(tmp_client_prepaid_cards_deposit)
      } else {
        this.showAlert(result.error_messages)
      }
    },

    onSelectedPaymentMethod(payment_method_selected){
      let action_model = {
        action  : sales_options.calculator_type.sales_payment,
        data    : this.outstanding_add.getPaymentAmount(payment_method_selected.id),
        options : { payment_method_selected : payment_method_selected }
      }
      this.payment = new PaymentViewModel()
      this.payment.setPaymentMethodId(payment_method_selected.id)
      this.payment.setPaymentMethodName(payment_method_selected.name)
      this.setMoneyCalculatorPanelAction(action_model)
      this.showDialogById('input-money-calculator-panel-action-modal')
    },

    onInputStaff(staff_id){
      if(staff_id == null) {
        this.outstanding_add.setStaffName('')
      }else{
        let tmp_staff = _.find(this.staff_options,x => x.staff_id == staff_id)
        if( typeof tmp_staff !== 'undefined'){
          this.outstanding_add.setStaffName(tmp_staff.staff_name)
        }
      }
    },

    onInputMoneyCalculator(money_calculator){
      this.payment.setPaymentAmount(money_calculator)
      this.outstanding_add.updatePayment(this.payment)
      this.calOutstandingPayment()
    },

    onRemovePayment(payment){
      this.outstanding_add.removePayment(payment)
      this.calOutstandingPayment()
    },
    calOutstandingPayment(){
      this.outstanding_add.calTotalPaid()
      this.outstanding_add.calOutstanding()
      this.$forceUpdate()
    }
  }
}
</script>

<style lang="scss">
@import './outstanding-payment-action.scss'
</style>
