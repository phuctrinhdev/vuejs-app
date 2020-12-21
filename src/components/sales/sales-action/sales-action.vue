<template>
  <b-modal id="sales-action-modal" 
           :title="form_title"
           :no-close-on-backdrop="true"
           hide-footer 
           class="sales-action-modal"
           @show="onLoadForm">

    <div class="view-pc">
      <div class="sales-items-wrapper">
        <div class="add-sales-item">
          <div class="title">{{ $t('sales.add-sales-item') }}</div>
          <sales-goods-types :is_show_modal="true" @clicked-goods-type="onClickedGoodsType"/>
        </div>
        <div class="sales-items-table">
          <view-table :data="table_data">
            <template slot="unit_price" slot-scope="{ row }">
              <div v-if="row.gift_card_type == sales_options.gift_card_type.redeem" class="disable-block"/>
              <div v-else class="active-block">
                <input-money v-model="row.unit_price" :decimal="0" :zero="true"
                             @input="onInputSalesItemUnitPrice(row)"/>
              </div>
            </template>

            <template slot="quantity" slot-scope="{ row }">
              <div v-if="!isEditableQuantityOfPrepaidGoods(row)" class="disable-block">{{ row.quantity }}</div>
              <input-money v-else 
                           v-model="row.quantity" :decimal="0" :zero="true"
                           @input="onInputSalesItemQuantity(row)"/>
            </template>

            <template slot="discount_value" slot-scope="{ row }">
              <div v-if="isSalesItemDisabledAction(row)" class="disable-block"/>
              <div v-else class="active-block">
                <div :id="'discount-' + row.key" class="discount-value" 
                     @click="onActionSalesItem(row, sales_options.sales_item_action_type.discount_action)">
                  <span v-if="row.discount_category_id > 0" class="tag-dc">DC</span>
                  <div>{{ formatSalesItemDiscount(row) }}</div>
                </div>
                <b-tooltip v-if="row.discount_category_id > 0" :target="'discount-' + row.key" placement="top">
                  <p>{{ row.discount_category_name }}</p>
                </b-tooltip>
              </div>
            </template>

            <template slot="amount" slot-scope="{ row }">
              <div v-if="row.gift_card_type == sales_options.gift_card_type.redeem" class="disable-block"/>
              <div v-else-if="row.deduction_type == sales_options.deduction_type.prepaid_service" class="deduct-service">
                <div class="amount-calculated">{{ formatMoney(row.unit_price * row.quantity, 0) }}</div>
              </div>
              <div v-else class="active-block" @click="onActionSalesItem(row, sales_options.sales_item_action_type.amount)">
                {{ formatMoney(row.amount, 0) }} <br>
                <!-- todo: Sales/Live api missing prepaidCardInitialBalance  -->
                <div v-if="row.goods_type == sales_options.sales_goods_type.prepaid_card 
                       && row.prepaid_card_type == options.prepaid_card_type.deposit_card
                     && x_sales_action.action != options.form_actions.edit"
                     class="initial-balance">({{ formatMoney(row.prepaid_card_initial_balance * row.quantity, 0) }})</div>
              </div>
            </template>

            <template slot="staffs" slot-scope="{ row }">
              <div class="active-block" @click="onActionSalesItem(row, sales_options.sales_item_action_type.staff_action)"
                   v-html="formatSalesItemStaffs(row.staffs)"/>
            </template>

            <template slot="sales_type_name" slot-scope="{ row }">
              <div class="active-block" @click="onActionSalesItem(row, sales_options.sales_item_action_type.sales_type_action)">
                {{ row.sales_type_name }}
              </div>
            </template>

            <template slot="deduction_points" slot-scope="{ row }">
              <div v-if="isSalesItemDisabledAction(row)" class="disable-block"/>
              <template v-else>
                <div v-if="has_client" class="active-block" @click="onActionSalesItem(row, sales_options.sales_item_action_type.deduction_point_action)">
                  <template v-if="row.deduction_points > 0">{{ formatMoney(row.deduction_points, 0) }}</template>
                </div>
                <div v-else class="no-action"/>
              </template>
            </template>

            <template slot="deduction_amount" slot-scope="{ row }">
              <div v-if="isSalesItemDisabledAction(row)" class="disable-block">
                <template v-if="row.deduction_type == sales_options.deduction_type.prepaid_service">{{ $t('sales.service-deduct') }}</template>
              </div>
              <template v-else>
                <div v-if="has_client" class="active-block" @click="onActionSalesItem(row, sales_options.sales_item_action_type.balance_deduction_action)">
                  <template v-if="row.deduction_amount > 0">{{ formatMoney(row.deduction_amount, 0) }}</template>
                </div>
                <div v-else class="no-action"/>
              </template>
            </template>

            <template slot="delete" slot-scope="{ row }">
              <a class="btn" @click="onDeleteSalesItem(row)">x</a>
            </template>
          </view-table>
          <p class="guide">{{ $t('sales.click-cell-to-edit') }}</p>
        </div>
      </div>
      <div class="check-out-wrapper">
        <div class="row">
          <div class="col-12 title">{{ $t('sales.check-out') }}</div>
        </div>
        <div class="row">
          <div class="col-12 col-lg-10">
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

                <li v-for="(payment, i) in sales.fields.payments" :key="i" 
                    :class="{ first: i == 0 }" class="payment">
                  <div>{{ payment.payment_method_name }}</div>
                  <div class="payment-amount">
                    {{ formatMoney(payment.payment_amount, 0) }} 
                    <span @click="removeSalesPayment(payment)">x</span>
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
                  <div>{{ formatMoney(sales.fields.earned_points,0) }}</div>
                </li>
              </ul>
            </div>

            <div class="paying">
              <div class="deduction-wrapper">
                <div class="title">{{ $t('sales.deduction') }}</div>
                <div class="deduction-action">
                  <template v-if="has_client && sales.fields.sales_items.length > 0">
                    <!-- #todo: update client_points & client_balance when change sales items -->
                    <ul class="list-btn">
                      <li>
                        <a :id="'client-points-' + x_client.data.id" @click="onActionSalesDeductionPoints">{{ $t('sales.point') }}</a>
                      <!-- <b-tooltip :target="'client-points-' + x_client.data.id" placement="bottom">
                        {{ formatMoney(client_points, 0) }}
                      </b-tooltip> -->
                      </li>
                      <li>
                        <a :id="'client-balance-' + x_client.data.id" @click="onActionSalesDeductionBalance">{{ $t('sales.balance') }}</a>
                      <!-- <b-tooltip :target="'client-balance-' + x_client.data.id" placement="bottom">
                        {{ formatMoney(client_balance, 0) }}
                      </b-tooltip> -->
                      </li>
                    </ul>
                  </template>
                  <template v-else>
                    <ul class="list-btn no-action">
                      <li><a>{{ $t('sales.point') }}</a></li>
                      <li><a>{{ $t('sales.balance') }}</a></li>
                    </ul>
                  </template>
                </div>
              </div>
              <div class="payment-wrapper">
                <select-payment-method-panel v-if="form_showed"
                                             :payment_method_setup="payment_method_setup" 
                                             @selected="onSelectedPaymentMethod"/>
              </div>
              <div class="notes-date-wrapper">
                <div class="notes">
                  <b-form-textarea v-model="sales.fields.notes" :rows="2" placeholder=""/>
                </div>
                <div class="date-time">
                  <label>{{ $t('sales.sales-date') }}</label>
                  <div>
                    <!-- <v-date-picker v-model="invoice_date" :popover="{ placement: 'bottom' }"
                                 :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }" class="date"/> -->
                    <input v-model="invoice_date" :disabled="false" class="date">
                    <input v-model="invoice_time" :disabled="false" class="time">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-2">
            <div class="modal-footer sales-submit">
              <div class="btn-action-group">
                <button class="btn btn-default" @click="onConfirm">{{ $t('general.save') }}</button>
                <!-- <li class="btn">{{ $t('sales.save-and-print-receipt') }}</li> -->
                <button class="btn btn-secondary" @click="onCancel">{{ $t('general.cancel') }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="view-mobile">
      <div class="sales-action-header">
        <div class="btn btn-white btn-add-sales-item" @click="onClickedGoodsType(sales_options.sales_goods_type.service)">{{ $t('sales.add-sales-item') }}</div>
      </div>
      <div class="sales-action-body">
        <div :class="{ 'show': is_show_total_amount }" class="total-amount-wrapper">
          <div class="total-amount-header">
            <label>{{ $t('sales.total-amount') }}</label>
            <span>{{ formatMoney(sales.fields.total_amount,0) }}</span>
            <span class="show-total-amount" @click="onChangeShowTotalAmount">></span>
          </div>
          <div v-if="is_show_total_amount" class="total-amount-body">
            <ul class="sales-items-wrapper">
              <li v-for="(row, i) in table_data.rows" :key="i" 
                  :class="{ 'show': row.show_sales_item }" class="sales-item-wrapper">
                <div class="sales-item-header">
                  <label class="goods-name">{{ row.goods_name }}</label>
                  <span class="show-sales-item" @click="onChangeShowSalesItem(row)">></span>
                </div>
                <div v-if="row.show_sales_item" class="sales-item-body">
                  <div class="first-line">
                    <div class="unit-price">
                      <label>{{ $t('sales.unit-price') }}</label>
                      <div v-if="row.gift_card_type == sales_options.gift_card_type.redeem" class="disable-block"/>
                      <div v-else class="active-block">
                        <input-money v-model="row.unit_price" :decimal="0" :zero="true"
                                     @input="onInputSalesItemUnitPrice(row)"/>
                      </div>
                    </div>
                    <div class="qty">
                      <label>{{ $t('sales.q-ty') }}</label>
                      <div v-if="!isEditableQuantityOfPrepaidGoods(row)" class="disable-block">{{ row.quantity }}</div>
                      <input-money v-else 
                                   v-model="row.quantity" :decimal="0" :zero="true"
                                   @input="onInputSalesItemQuantity(row)"/>
                    </div>
                    <div class="discount">
                      <label>{{ $t('sales.discount') }}</label>
                      <div class="discount-value-wrapper">
                        <div v-if="isSalesItemDisabledAction(row)" class="disable-block"/>
                        <div v-else class="active-block">
                          <div class="discount-value" @click="onActionSalesItem(row, sales_options.sales_item_action_type.discount_action)">
                            <span v-if="row.discount_category_id > 0" class="tag-dc">DC</span>
                            <div>{{ formatSalesItemDiscount(row) }}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="second-line">
                    <div class="staff">
                      <div class="staff-content" @click="onActionSalesItem(row, sales_options.sales_item_action_type.staff_action)">
                        <div v-if="row.staffs.length == 0" class="btn btn-white btn-select-staff">{{ $t('sales.select-staff') }}</div>
                        <div v-else class="active-block" v-html="formatSalesItemStaffs(row.staffs)"/>
                      </div>
                    </div>
                    <div class="amount-label">
                      <label>{{ $t('sales.amount') }}</label>
                    </div>
                    <div class="amount">
                      <div v-if="row.gift_card_type == sales_options.gift_card_type.redeem" class="disable-block"/>
                      <div v-else-if="row.deduction_type == sales_options.deduction_type.prepaid_service" class="deduct-service">
                        <div class="amount-calculated">{{ formatMoney(row.unit_price * row.quantity, 0) }}</div>
                      </div>
                      <div v-else class="active-block" @click="onActionSalesItem(row, sales_options.sales_item_action_type.amount)">
                        {{ formatMoney(row.amount, 0) }} <br>
                        <!-- todo: Sales/Live api missing prepaidCardInitialBalance -->
                        <!-- <div v-if="row.goods_type == sales_options.sales_goods_type.prepaid_card 
                               && row.prepaid_card_type == options.prepaid_card_type.deposit_card
                             && x_sales_action.action != options.form_actions.edit"
                             class="initial-balance">({{ formatMoney(row.prepaid_card_initial_balance * row.quantity, 0) }})</div> -->
                      </div>
                    </div>
                  </div>
                  <div class="third-line">
                    <div class="sales-type">
                      <label>{{ $t('sales.sales-type') }}</label>
                      <div class="active-block" @click="onActionSalesItem(row, sales_options.sales_item_action_type.sales_type_action)">
                        {{ row.sales_type_name }}
                      </div>
                    </div>
                    <div class="points-deduct">
                      <label>{{ $t('sales.points-deduct') }}</label>
                      <div v-if="isSalesItemDisabledAction(row)" class="disable-block"/>
                      <template v-else>
                        <div v-if="has_client" class="active-block" @click="onActionSalesItem(row, sales_options.sales_item_action_type.deduction_point_action)">
                          <template v-if="row.deduction_points > 0">{{ formatMoney(row.deduction_points, 0) }}</template>
                        </div>
                        <div v-else class="no-action"/>
                      </template>
                    </div>
                    <div class="balance-deduct">
                      <label>{{ $t('sales.balance-deduct') }}</label>
                      <div v-if="isSalesItemDisabledAction(row)" class="disable-block">
                        <template v-if="row.deduction_type == sales_options.deduction_type.prepaid_service">{{ $t('sales.service-deduct') }}</template>
                      </div>
                      <template v-else>
                        <div v-if="has_client" class="active-block" @click="onActionSalesItem(row, sales_options.sales_item_action_type.balance_deduction_action)">
                          <template v-if="row.deduction_amount > 0">{{ formatMoney(row.deduction_amount, 0) }}</template>
                        </div>
                        <div v-else class="no-action"/>
                      </template>
                    </div>
                  </div>
                  <div class="delete-sales-item">
                    <div class="btn btn-white btn-delete-sales-item" @click="onDeleteSalesItem(row)">{{ $t('sales.delete-this-item') }}</div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div :class="{ 'show': is_show_checkout }" class="checkout-wrapper">
          <div class="checkout-header">
            <label>{{ $t('sales.check-out') }}</label>
            <span class="show-checkout" @click="onChangeShowCheckout">></span>
          </div>
          <div v-if="is_show_checkout" class="checkout-body">
            <div class="deduction-wrapper">
              <div class="title">{{ $t('sales.deduction') }}</div>
              <div class="deduction-action">
                <template v-if="has_client && sales.fields.sales_items.length > 0">
                  <!-- #todo: update client_points & client_balance when change sales items -->
                  <ul class="list-btn">
                    <li>
                      <a :id="'client-points-' + x_client.data.id" @click="onActionSalesDeductionPoints">{{ $t('sales.point') }}</a>
                      <!-- <b-tooltip :target="'client-points-' + x_client.data.id" placement="bottom">
                        {{ formatMoney(client_points, 0) }}
                      </b-tooltip> -->
                    </li>
                    <li>
                      <a :id="'client-balance-' + x_client.data.id" @click="onActionSalesDeductionBalance">{{ $t('sales.balance') }}</a>
                      <!-- <b-tooltip :target="'client-balance-' + x_client.data.id" placement="bottom">
                        {{ formatMoney(client_balance, 0) }}
                      </b-tooltip> -->
                    </li>
                  </ul>
                </template>
                <template v-else>
                  <ul class="list-btn no-action">
                    <li><a>{{ $t('sales.point') }}</a></li>
                    <li><a>{{ $t('sales.balance') }}</a></li>
                  </ul>
                </template>
              </div>
            </div>
            <div class="payment-wrapper">
              <select-payment-method-panel v-if="form_showed"
                                           :payment_method_setup="payment_method_setup" 
                                           @selected="onSelectedPaymentMethod"/>
            </div>
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

                <li v-for="(payment, i) in sales.fields.payments" :key="i" 
                    :class="{ first: i == 0 }" class="payment">
                  <div>{{ payment.payment_method_name }}</div>
                  <div class="payment-amount">
                    {{ formatMoney(payment.payment_amount, 0) }} 
                    <span @click="removeSalesPayment(payment)">x</span>
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
                  <div>{{ formatMoney(sales.fields.earned_points,0) }}</div>
                </li>
              </ul>
            </div>
            <div class="notes-date-wrapper">
              <div class="notes">
                <b-form-textarea v-model="sales.fields.notes" :rows="2" placeholder=""/>
              </div>
              <div class="date-time">
                <label>{{ $t('sales.sales-date') }}</label>
                <div>
                  <!-- <v-date-picker v-model="invoice_date" :popover="{ placement: 'bottom' }"
                                 :formats="{ title: 'MM-YYYY', input: [shop_data.format_date] }" class="date"/> -->
                  <input v-model="invoice_date" :disabled="false" class="date">
                  <input v-model="invoice_time" :disabled="false" class="time">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="sales-action-footter">
        <div class="modal-footer sales-submit">
          <div class="btn-action-group">
            <button class="btn btn-default" @click="onConfirm">{{ $t('general.save') }}</button>
            <!-- <li class="btn">{{ $t('sales.save-and-print-receipt') }}</li> -->
            <button class="btn btn-secondary" @click="onCancel">{{ $t('general.cancel') }}</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- modals -->
    <sales-items-adding-action ref="sales_item_action"
                               :has_client="has_client"
                               :staffs="staff_options"
                               @add-sales-items="onAddSalesItems"/>
    <sales-item-discount-action :sales_setup="sales_setup" 
                                @apply-discount="onSalesItemDiscountApply"/>
    <sales-item-discount-card-apply @selected-discount-card="onSelectedDiscountCard"/>
    <sales-item-staff-action :staff_options="staff_options"
                             type="sales"
                             @apply-staffs="onSalesItemStaffsApply"/>
    <sales-item-sales-type-action @apply-sales-type="onSalesItemSalesTypeApply"/>  

    <balance-deduction-action v-if="has_client" 
                              @apply-balance-deduction="onBalanceDeductionApply"/>
    <input-money-calculator-panel-action @input-money-calculator="onInputMoneyCalculator"/>
    <alert-confirm :id="alert_id" :data_alerts="alert_data" 
                   :hide_yes="alert_hide_yes" :label_no="alert_label_no"
                   @confirm="onAlertConfirm"/>
                   
  </b-modal>
</template>

<script>
import _      from 'lodash'
import moment from 'moment'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { setupCalendar, DatePicker }                       from 'v-calendar'
import { options }                          from '../../../helpers/options'
import { sales_options }                    from '../../../helpers/options/sales-options'
import SalesViewModel                       from '../../../view-model/sales/sales/sales-view-model'
import SalesApi                             from '../../../api/sales/sales-api'
import staff_mixin                          from '../../../helpers/mixins/staff-mixin'
import client_prepaid_cards_mixin           from '../../../helpers/mixins/client-prepaid-cards-mixin'
import client_prepaid_services_mixin        from '../../../helpers/mixins/client-prepaid-services-mixin'
import sales_client_account_mixin           from '../../../helpers/mixins/sales-client-account-mixin'
import SalesItemStaffViewModel              from '../../../view-model/sales/sales-item/sales-item-staff-view-model'
import SalesUtils                           from '../../../helpers/utils/sales-utils'
import SalesCache                           from '../../../helpers/cache/sales-cache'

import component_base                       from '../../common/component-base/component-base'
import view_table                           from '../../common/view-table/view-table'
import input_money                          from '../../common/form/input/input-money/input-money'
import select_hour                          from '../../common/form/select/select-hour/select-hour'
import error_box                            from '../../common/form/error-box/error-box' 
import btn_action_group                     from '../../common/button/btn-action-group/btn-action-group'
import sales_goods_types                    from './sales-goods-types/sales-goods-types.vue'
import sales_items_adding_action            from './sales-items-adding-action/sales-items-adding-action.vue'
import sales_item_discount_action           from '../sales-item-discount-action/sales-item-discount-action.vue'
import sales_item_discount_card_apply       from '../sales-item-discount-card-apply/sales-item-discount-card-apply.vue'
import sales_item_staff_action              from '../sales-item-staff-action/sales-item-staff-action.vue'
import sales_item_sales_type_action         from '../sales-item-sales-type-action/sales-item-sales-type-action.vue'
import balance_deduction_action             from '../balance-deduction-action/balance-deduction-action.vue'
import input_money_calculator_panel_action  from '../input-money-calculator-panel-action/input-money-calculator-panel-action.vue'
import select_payment_method_panel          from '../select-payment-method-panel/select-payment-method-panel.vue'
import alert_confirm                        from '../../common/alert/alert-confirm'

import { formatMoney,
  convertDateToTimezone,
  // convertDateFromTimezoneToTimestamp,
  // convertTimeStampToDate,
  convertTimeStampPlusLocalzone,
  convertDateToTimeStamp,
  guid,
  mapActionSecurityInfo, 
  convertDateFromLocalToTimezone, convertTimeStampToDate}                   from '../../../helpers/common'

export default {
  components: {
    'view-table'   : view_table,
    'input-money'  : input_money,
    'select-hour'  : select_hour,
    'v-date-picker': DatePicker,
    'error-box'    : error_box,

    'btn-action-group'              : btn_action_group,
    'sales-goods-types'             : sales_goods_types,
    'sales-items-adding-action'     : sales_items_adding_action,
    'sales-item-discount-card-apply': sales_item_discount_card_apply,
    'sales-item-discount-action'    : sales_item_discount_action,
    'sales-item-staff-action'       : sales_item_staff_action,
    'sales-item-sales-type-action'  : sales_item_sales_type_action,

    'balance-deduction-action'           : balance_deduction_action,
    'input-money-calculator-panel-action': input_money_calculator_panel_action,
    'select-payment-method-panel'        : select_payment_method_panel,

    'alert-confirm': alert_confirm
  },
  extends: component_base,
  mixins: [staff_mixin, client_prepaid_cards_mixin, client_prepaid_services_mixin, sales_client_account_mixin],
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
      discount_category_setup: [],

      sales_api: new SalesApi(),
      sales    : new SalesViewModel(),

      invoice_date: new Date(),
      invoice_time: '',

      sales_items_apply_discount_card_selected: [],

      alert_id: 'alert-confirm-sales-action-submit',
      alert_data: [],

      watch_sales_total_amount: 0,
      watch_sales_deduction_points: 0,
      watch_sales_balance_deduction: 0,

      // mobile
      is_show_total_amount: true,
      is_show_checkout: true,

      errors: []
    }
  },
  computed: {
    ...mapGetters('client', {
      x_client: 'getClientInformation'
    }),
    ...mapGetters('sales', {
      x_sales_action: 'getSalesAction',
      x_sales_action_helper: 'getSalesActionHelper',
      x_sales_item_action: 'getSalesItemAction',
      x_money_calculator_panel_action: 'getMoneyCalculatorPanelAction'
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
      this.setSalesActionHelperStaffOptions(tmp_staff_options)
      return tmp_staff_options
    },
    form_title(){
      let tmp_title = ''
      if(this.x_sales_action.action == options.form_actions.add)
        tmp_title = this.$i18n.t('sales.add-sales')
      if(this.x_sales_action.action == options.form_actions.edit)
        tmp_title = this.$i18n.t('sales.edit-sales')
      return tmp_title
    },
    no_selected_staff(){return this.$i18n.t('sales.no-selected-staff')},
    warning_points_deduction_exceed_client_points(){return this.$i18n.t('sales.warning-can-not-using-exceed-client-points')},
    warning_points_deduction_of_sales_item_exceed_amount(){return this.$i18n.t('sales.warning-sales-item-points-deduct-and-amount')},
    warning_sales_balance_deduction_max(){return this.$i18n.t('sales.warning-sales-balance-deduction-max')},
    warning_sales_item_balance_deduct_max(){return this.$i18n.t('sales.warning-sales-item-balance-deduct-max')},
    warning_client_prepaid_card_used_and_can_not_delete(){return this.$i18n.t('sales.warning-client-prepaid-card-used-and-can-not-delete')},
    warning_client_prepaid_service_used_and_can_not_delete(){return this.$i18n.t('sales.warning-client-prepaid-service-used-and-can-not-delete')},
    warning_sales_items_list_can_not_be_empty(){return this.$i18n.t('sales.warning-sales-items-list-can-not-be-empty')},
    warning_sales_item_service_not_have_staffs(){return this.$i18n.t('sales.warning-sales-item-service-not-have-staffs')},
    warning_sales_item_product_not_have_staffs(){return this.$i18n.t('sales.warning-sales-item-product-not-have-staffs')},
    warning_sales_has_outstanding(){return this.$i18n.t('sales.warning-sales-has-outstanding')},
    warning_sales_has_outstanding_with_unregistered_client(){return this.$i18n.t('sales.warning-sales-has-outstanding-with-unregistered-client')},
    warning_sales_has_outstanding_with_shared_client(){ return this.$i18n.t('sales.warning-sales-has-outstanding-with-shared-client')},
    warning_can_not_add_sales_in_future(){return this.$i18n.t('sales.warning-can-not-add-sales-in-future')},
    warning_sales_not_allow_change_for_multiple_payments(){return this.$i18n.t('sales.warning-sales-not-allow-change-for-multiple-payments')},
    warning_the_deducted_amount_exceeds_total_amount(){return this.$i18n.t('sales.warning-the-deducted-amount-exceeds-total-amount')},
    warning_booking_deposit_can_not_exceeds_sales_amount(){return this.$i18n.t('sales.warning-booking-deposit-can-not-exceeds-sales-amount')},
    warning_sales_item_amount_can_not_exceed_unit_price_multiply_quantity(){return this.$i18n.t('sales.warning-sales-item-amount-can-not-exceed-unit-price-multiply-quantity')},
    alert_hide_yes(){
      if(this.has_client) return false
      return true
    },
    alert_label_no(){
      let tmp_label_no = ''
      if(!this.has_client) tmp_label_no = this.$i18n.t('general.close')
      return tmp_label_no
    },
    has_client(){
      return this.x_client && this.x_client.data && this.x_client.data.id > 0
    },
    client_points(){
      let tmp_points = this.x_client.data.loyalty_points
      if(this.x_client.data.family_id > 0)
        tmp_points = this.x_client.data.family_point
      return tmp_points
    },
    client_balance(){
      let tmp_balance = this.x_client.data.balance
      if(this.x_client.data.family_id > 0)
        tmp_balance = this.x_client.data.family_balance
      return tmp_balance
    },
    is_client_of_current_shop(){
      return this.shop_data.shop_id == this.x_client.data.shop_id
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
          { field: 'delete',                      label: 'general.delete',        width: '7%',  sortable: false, expand: true, tdClass: 'delete' }
        ],
        rows: this.sales.fields.sales_items,
        pagination:{
          total_pages: 1
        },
        options: {
          // pagination: false
        }
      }
    }
  },
  beforeMount(){
    setupCalendar({
      locale: this.locale,
      firstDayOfWeek: 2,
      titleTransition: 'none',
      weeksTransition: 'none',
      datePickerTintColor: '#3499db'
    })
  },
  methods: {
    ...mapMutations('sales',[
      'setSalesActionShowedGoodsType',
      'setSalesActionSalesFields',
      'setSalesItemActionItemFields',
      'setMoneyCalculatorPanelAction',
      'setSalesActionHelperStaffOptions',
      'setSalesActionHelperClientPrepaidCards',
      'setSalesActionHelperClientPrepaidCardsOrigin',
      'setSalesActionHelperClientPrepaidCardsDiscount',
      'setSalesActionHelperClientPrepaidCardsAll',
      'setSalesActionHelperBalanceMoves',
      'setSalesActionHelperClientPrepaidServicesAll',
      'deleteItemFromClientPrepaidServicesAll',
      'updateItemQuantityToClientPrepaidServicesAll'
    ]),
    ...mapActions('client', [
      'getClientInformationDataAsync'
    ]),
    ...mapActions('sales_client_account',[
      'setSalesClientAccountDataAsync',
    ]),
    formatMoney,
    hideModal(){
      this.hideDialogById('sales-action-modal')
    },
    onCancel(){
      this.hideModal()
      this.form_showed = false
    },
    async loadClientPrepaidCardsAsync(){
      let result = await this.getClientPrepaidCardsAsyncMixin(this.x_client.data.id, sales_options.prepaid_card_type.all, true)
      
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

        this.setSalesActionHelperClientPrepaidCardsDiscount(tmp_client_prepaid_cards_discount)
        this.setSalesActionHelperClientPrepaidCardsAll(result.data.items)
      } else {
        this.showAlert(result.error_messages)
      }
    },
    async loadClientPrepaidServicesAsync(){
      let response = await this.getClientPrepaidServicesAsyncMixin(this.x_client.data.id, true)

      if(response.is_ok){
        this.setSalesActionHelperClientPrepaidServicesAll(response.data.items)
      }
      else {
        this.showAlert(response.error_messages)
      }
    },
    async loadClientInformationById(client_id){
      this.preLoader()
      await this.getClientInformationDataAsync(Object.assign({}, { shop_id: this.shop_data.shop_id, client_id: client_id }))
      this.preLoader(false)
    },
    async loadClientAccountAsync(){
      let response = await this.setSalesClientAccountDataAsync({ client_id: this.x_client.data.id, shop_id  : this.shop_data.shop_id })
      if(!response.is_ok) this.showAlert(response.error_messages)
    },
    async onLoadForm(){
      this.preLoader()
      this.form_showed = true
      this.errors = []
      
      if(this.x_sales_action.action == options.form_actions.add) {
        if(this.x_sales_action.data.booking_id > 0){
          this.sales.setFields(this.x_sales_action.data)
          this.updateSalesItemsKey()
          this.updateSalesCheckout()
        } 
        else {
          this.sales = new SalesViewModel()
          this.showDialogById('sales-items-adding-action-modal')
        }
        this.sales.fields.invoice_date_time = convertDateToTimezone(new Date())
      }
      if(this.x_sales_action.action == options.form_actions.edit && this.x_sales_action.data.ref_id > 0){
        if(this.x_sales_action.data.client_id > 0 && !this.has_client){
          // load client in client-part
          await this.loadClientInformationById(this.x_sales_action.data.client_id)
          if(!this.x_client.is_ok){
            this.showAlert(this.x_client.error_messages)
          }
          else {
            // load client-account in sales-part
            await this.loadClientAccountAsync()
          }
        }
        let query = {
          sales_number : this.x_sales_action.data.sales_number,
          shop_id      : this.shop_data.shop_id,
          status       : this.x_sales_action.options.status
        }
        let result = await this.sales_api.getSalesLiveAsync(query)

        if(result.is_ok){
          this.sales.setFields(result.data)
          this.updateSalesItemsKey()
        } else {
          this.showAlert(result.error_messages)
        }
        this.sales.fields.invoice_date_time = convertDateToTimezone(new Date(this.sales.fields.invoice_date_time_ts * 1000))
      }

      // watch checkout data
      let tmp_total_balance_deduction = 0
      for(let sales_item of this.sales.fields.sales_items){
        tmp_total_balance_deduction += Number(sales_item.deduction_amount)
      }
      this.watch_sales_balance_deduction= tmp_total_balance_deduction
      this.watch_sales_total_amount     = this.sales.fields.total_amount
      this.watch_sales_deduction_points = this.sales.fields.deduction_points
      
      this.setClientInfoToSales()
      this.setDateTimeToSales()
      this.$forceUpdate()

      // clear balance_moves
      this.setSalesActionHelperBalanceMoves([])
      this.$refs.sales_item_action.prepaid_cards_balance_moves = []
      
      // sales setup
      this.sales_setup = await this.sales_cache.getAllSalesSetupCache(this.shop_data.shop_id)
      if(this.isMissingSalesSetup(this.sales_setup)){
        this.showAlert(this.sales_setup.error_messages)
      }
      else{
        this.payment_method_setup    = this.sales_setup.payment_method_setup
        this.discount_category_setup = this.sales_setup.discount_category_setup
        this.loyalty_points_setups   = this.sales_setup.loyalty_points_setups
      }

      // client prepaid cards & client prepaid services
      if(this.has_client){
        await this.loadClientPrepaidCardsAsync()
        await this.loadClientPrepaidServicesAsync()
      }
      this.preLoader(false)
    },
    setClientInfoToSales(){
      // chain-sharing
      this.sales.fields.chain_id              = this.shop_data.chain_id
      this.sales.fields.branch_number         = this.shop_data.branch_number
      this.sales.fields.shop_name             = this.shop_data.shop_name
      this.sales.fields.client_shop_id        = this.shop_data.shop_id
      this.sales.fields.client_shop_name      = this.shop_data.shop_name

      if(this.has_client){
        this.sales.fields.client_id             = this.x_client.data.id
        this.sales.fields.member_number         = this.x_client.data.member_number
        this.sales.fields.client_name           = this.x_client.data.client_name
        this.sales.fields.client_phone_number   = this.x_client.data.phone_number  == null ? '' : this.x_client.data.phone_number
        this.sales.fields.client_mobile_number  = this.x_client.data.mobile_number == null ? '' : this.x_client.data.mobile_number
        this.sales.fields.client_mobile_number2 = this.x_client.data.mobile_number2== null ? '' : this.x_client.data.mobile_number2
        this.sales.fields.client_rating_id      = this.x_client.data.client_rating_id,
        this.sales.fields.client_rating_name    = this.x_client.data.client_rating_name,
        this.sales.fields.client_sex            = this.x_client.data.sex,
        this.sales.fields.family_id             = this.sales_client_account.fields.family_id

        // chain-sharing
        this.sales.fields.client_shop_id        = this.x_client.data.shop_id
        this.sales.fields.client_shop_name      = this.x_client.data.shop_name
      }
    },
    setDateTimeToSales(){
      this.invoice_date = moment(this.sales.fields.invoice_date_time).format(options.standard_date_format.ymd)
      this.invoice_time = moment(this.sales.fields.invoice_date_time).format(options.standard_hour_format.h24)
    },
    isSalesItemDisabledAction(sales_item){
      return sales_item.gift_card_type == sales_options.gift_card_type.redeem || sales_item.deduction_type == sales_options.deduction_type.prepaid_service
    },
    isEditableQuantityOfPrepaidGoods(sales_item){
      let is_editable = true
      if(this.x_sales_action.action == options.form_actions.add
      && sales_item.goods_type == sales_options.sales_goods_type.prepaid_card 
      && sales_item.prepaid_card_type == sales_options.prepaid_card_type.discount_card
      && (sales_item.gift_card_type == sales_options.gift_card_type.none || sales_item.gift_card_type == sales_options.gift_card_type.redeem)){
        is_editable = false
      }
      if(this.x_sales_action.action == options.form_actions.edit
      && (sales_item.goods_type == sales_options.sales_goods_type.prepaid_card || sales_item.goods_type == sales_options.sales_goods_type.prepaid_service)){
        if(sales_item.client_prepaid_goods_id > 0)
          is_editable = false
        else {
          if(sales_item.goods_type == sales_options.sales_goods_type.prepaid_card 
          && sales_item.prepaid_card_type == sales_options.prepaid_card_type.discount_card
          && (sales_item.gift_card_type == sales_options.gift_card_type.none || sales_item.gift_card_type == sales_options.gift_card_type.redeem))
            is_editable = false
        }
      }
      return is_editable
    },

    // add & delete sales-items
    onClickedGoodsType(sales_goods_type){
      this.setSalesActionShowedGoodsType(sales_goods_type)
      this.showDialogById('sales-items-adding-action-modal')
    },
    onAddSalesItems(sales_items){
      this.is_show_total_amount = true // view on mobile
      for(let sales_item of sales_items){
        this.sales.fields.sales_items.push(sales_item)
      }
      this.updateSalesItemsKey()

      // services & products
      if(this.canUsingDiscountCards()){
        let tmp_discount_cards_to_apply = SalesUtils.getDiscountCardsToApply(this.x_sales_action.options.sales_goods_type)
        
        // discount card apply automatically
        if(tmp_discount_cards_to_apply.length == 1){
          for(let sales_item of sales_items){
            this.applyDiscountCardToSalesItem(tmp_discount_cards_to_apply[0], sales_item)
            this.updateSalesItemAmountWithDiscount(sales_item)
          }
        }

        // discount card apply by selection
        if(tmp_discount_cards_to_apply.length > 1){
          this.sales_items_apply_discount_card_selected = sales_items
          this.showDialogById('sales-item-discount-card-apply-modal')
        }
      }

      this.updateSalesCheckout()
    },
    canUsingDiscountCards(){
      return this.has_client && 
            (this.x_sales_action.options.sales_goods_type == sales_options.sales_goods_type.service || 
             this.x_sales_action.options.sales_goods_type == sales_options.sales_goods_type.product)
    },
    onSelectedDiscountCard(discount_card_selected){
      for(let sales_item of this.sales_items_apply_discount_card_selected){
        this.applyDiscountCardToSalesItem(discount_card_selected, sales_item)
        this.updateSalesItemAmount(sales_item)
      }
      this.updateSalesItemsKey()
      this.updateSalesCheckout()
    },
    applyDiscountCardToSalesItem(discount_card, sales_item){
      sales_item.discount_type  = sales_options.discount_type.percentage

      if(sales_item.goods_type == sales_options.sales_goods_type.service){
        sales_item.discount_value = discount_card.discount_for_service
      }
      if(sales_item.goods_type == sales_options.sales_goods_type.product){
        sales_item.discount_value = discount_card.discount_for_product
      }
    },
    onDeleteSalesItem(sales_item){
      let tmp_error_messages = []

      // service
      
      
      // product


      // prepaid card
      if(sales_item.goods_type == sales_options.sales_goods_type.prepaid_card){
        // prepaid card used to deducted then can not delete
        for(let tmp_sales_item of this.sales.fields.sales_items){
          if(this.isDeductedInSales(sales_item, tmp_sales_item)){
            let tmp_error_message = this.warning_client_prepaid_card_used_and_can_not_delete.replace('{sales-item-name}', tmp_sales_item.goods_name)
            tmp_error_messages.push(tmp_error_message)
          }
        }

        if(tmp_error_messages.length == 0){
          // remove client-prepaid-card out of store
          this.x_sales_action_helper.client_prepaid_cards = this.x_sales_action_helper.client_prepaid_cards.filter(c => c.id != sales_item.prepaid_goods_guid)

          // balance-moves to this card
          let tmp_balance_moves = this.x_sales_action_helper.balance_moves.filter(bm => bm.to_prepaid_card_guid == sales_item.prepaid_goods_guid)
          
          // client prepaid cards merged
          let tmp_client_prepaid_cards_merged = []
          for(let tmp_balance_move of tmp_balance_moves){
            let tmp_client_prepaid_card_merged = this.x_sales_action_helper.client_prepaid_cards_origin.filter(c => c.id == tmp_balance_move.from_client_prepaid_card_id)
            tmp_client_prepaid_cards_merged = [...tmp_client_prepaid_cards_merged, ...tmp_client_prepaid_card_merged]
          }

          // back to before merged cards
          this.x_sales_action_helper.client_prepaid_cards = [...this.x_sales_action_helper.client_prepaid_cards, ...tmp_client_prepaid_cards_merged]
          this.x_sales_action_helper.balance_moves = this.x_sales_action_helper.balance_moves.filter(bm => bm.to_prepaid_card_guid != sales_item.prepaid_goods_guid)
        }
      }

      // prepaid service
      if(sales_item.goods_type == sales_options.sales_goods_type.prepaid_service){
        for(let tmp_sales_item of this.sales.fields.sales_items){
          if(this.isDeductedInSales(sales_item, tmp_sales_item)){
            let tmp_error_message = this.warning_client_prepaid_service_used_and_can_not_delete.replace('{sales-item-name}', tmp_sales_item.goods_name)
            tmp_error_messages.push(tmp_error_message)
          }
        }

        if(tmp_error_messages.length == 0){
          // sales item: deducted prepaid service
          if(sales_item.amount == 0){
            let deducted_prepaid_goods_ref = sales_item.deducted_prepaid_goods_ref   // deducted from existing prepaid service
            if(!sales_item.deducted_prepaid_goods_ref > 0){
              deducted_prepaid_goods_ref = sales_item.deducted_by_prepaid_goods_guid // deducted from new prepaid service
            }
            
            let tmp_prepaid_service_ref = _.find(this.x_sales_action_helper.client_prepaid_services_all, c => c.id == deducted_prepaid_goods_ref)
            if(tmp_prepaid_service_ref != undefined && tmp_prepaid_service_ref.initial_quantity != -1){
              this.updateClientPrepaidServiceQuantityToStore(tmp_prepaid_service_ref.id, Number(tmp_prepaid_service_ref.quantity) + Number(sales_item.quantity))
            }
          }

          // sales item: prepaid service
          if(sales_item.amount > 0){
            this.deleteItemFromClientPrepaidServicesAll(sales_item.prepaid_goods_guid) // when just added
            this.deleteItemFromClientPrepaidServicesAll(sales_item.client_prepaid_goods_id) // wehn added before
          }
        }
      }

      // sales item has deduction balance
      if(sales_item.deduction_type == sales_options.deduction_type.prepaid_card){
        for(let client_prepaid_card of this.x_sales_action_helper.client_prepaid_cards){
          if(client_prepaid_card.id == sales_item.deducted_prepaid_goods_ref || client_prepaid_card.id == sales_item.deducted_by_prepaid_goods_guid){
            client_prepaid_card.balance += Number(sales_item.deduction_amount)
          }
        }
      }

      if(tmp_error_messages.length == 0){
        this.sales.fields.sales_items = this.sales.fields.sales_items.filter(i => i.key != sales_item.key)
        this.updateSalesItemsKey()
        this.updateSalesCheckout()
      }
      else {
        this.showAlert(tmp_error_messages)
      }
    },
    isDeductedInSales(sales_item_deleted, sales_item_other){
      let is_deducted_in_sales = false

      if(this.x_sales_action.action == options.form_actions.add
      && sales_item_deleted.prepaid_goods_guid != null
      && sales_item_deleted.prepaid_goods_guid != 0
      && sales_item_deleted.prepaid_goods_guid == sales_item_other.deducted_by_prepaid_goods_guid){
        is_deducted_in_sales = true
      }
      if(this.x_sales_action.action == options.form_actions.edit
      && sales_item_deleted.client_prepaid_goods_id != null
      && sales_item_deleted.client_prepaid_goods_id != 0
      && sales_item_deleted.client_prepaid_goods_id == sales_item_other.deducted_prepaid_goods_ref){
        is_deducted_in_sales = true
      }

      return is_deducted_in_sales
    },
    updateSalesItemsKey(){
      for(let i in this.sales.fields.sales_items){
        this.sales.fields.sales_items[i].key = i
      }
    },

    // edit sales-item
    onInputSalesItemUnitPrice(sales_item){
      for(let tmp_sales_item of this.sales.fields.sales_items){
        if(tmp_sales_item.key == sales_item.key){
          tmp_sales_item.unit_price = sales_item.unit_price
        }
      }
      this.updateSalesItemAmount(sales_item)
    },
    onInputSalesItemQuantity(sales_item){
      let previous_quantity = 0
      for(let tmp_sales_item of this.sales.fields.sales_items){
        if(tmp_sales_item.key == sales_item.key){
          previous_quantity = tmp_sales_item.quantity
          tmp_sales_item.quantity = sales_item.quantity
        }
      }
      this.updateSalesItemAmount(sales_item)

      // prepaid card: update store
      if(sales_item.goods_type == sales_options.sales_goods_type.prepaid_card){
        // 
      }

      // prepaid service: update store
      if(sales_item.goods_type == sales_options.sales_goods_type.prepaid_service){
        let tmp_current_quantity  = 0
        let tmp_deducted_quantity = 0
        let tmp_remaining_quantity= 0

        // sales item: deducted prepaid service
        if(sales_item.amount == 0){
          // deducted from existing prepaid service
          if(sales_item.deducted_prepaid_goods_ref > 0){
            let tmp_prepaid_service_ref = _.find(this.x_sales_action_helper.client_prepaid_services_all, c => c.id == sales_item.deducted_prepaid_goods_ref)
            if(tmp_prepaid_service_ref != undefined && tmp_prepaid_service_ref.initial_quantity != -1){
              tmp_current_quantity = Number(tmp_prepaid_service_ref.quantity) + Number(previous_quantity)
              tmp_deducted_quantity = Number(sales_item.quantity)
              tmp_remaining_quantity = this.calRemainingQuantityOfPrepaidService(tmp_current_quantity, tmp_deducted_quantity)
              this.updateClientPrepaidServiceQuantityToStore(tmp_prepaid_service_ref.id, tmp_remaining_quantity)
            }
          }
          // deducted from new prepaid service
          else {
            let tmp_sales_item_deducted_ref = _.find(this.sales.fields.sales_items, i => i.prepaid_goods_guid == sales_item.deducted_by_prepaid_goods_guid)
            sales_item = tmp_sales_item_deducted_ref
          }
        }

        // sales item: new prepaid service
        if(sales_item.amount > 0){
          if(sales_item.prepaid_service_initial_quantity != -1){
            tmp_current_quantity  = Number(sales_item.quantity) * Number(sales_item.prepaid_service_initial_quantity)
            for(let tmp_sales_item of this.sales.fields.sales_items){
              if(tmp_sales_item.deducted_by_prepaid_goods_guid == sales_item.prepaid_goods_guid){
                tmp_deducted_quantity += Number(tmp_sales_item.quantity)
              }
            }
            tmp_remaining_quantity = this.calRemainingQuantityOfPrepaidService(tmp_current_quantity, tmp_deducted_quantity)
            this.updateClientPrepaidServiceQuantityToStore(sales_item.prepaid_goods_guid, tmp_remaining_quantity)
          }
        }
      }
    },
    updateClientPrepaidServiceQuantityToStore(client_prepaid_service_id, new_quantity){
      let tmp_client_prepaid_service_changed_quantity = {
        id          : client_prepaid_service_id,
        new_quantity: new_quantity
      }
      this.updateItemQuantityToClientPrepaidServicesAll(tmp_client_prepaid_service_changed_quantity)
    },
    calRemainingQuantityOfPrepaidService(current_quantity, deducted_quantity){
      return current_quantity - deducted_quantity
    },
    onActionSalesItem(sales_item, sales_item_action_type){
      this.setSalesItemActionItemFields(_.cloneDeep(sales_item))
      
      switch (sales_item_action_type) {
        case sales_options.sales_item_action_type.discount_action:
          this.showDialogById('sales-item-discount-action-modal')
          break
        case sales_options.sales_item_action_type.staff_action:
          this.showDialogById('sales-item-staff-action-modal')
          break
        case sales_options.sales_item_action_type.sales_type_action:
          this.showDialogById('sales-item-sales-type-action-modal')
          break
        case sales_options.sales_item_action_type.deduction_point_action: {
          let tmp_deduction_points = sales_item.deduction_points
          if(!tmp_deduction_points > 0) {
            if(this.client_points >= sales_item.amount){
              tmp_deduction_points = sales_item.amount
            }
            else {
              tmp_deduction_points = this.client_points
            }
          }
          let money_calculator_panel_action = {
            action: sales_options.calculator_type.sales_item_deduction_points,
            data: tmp_deduction_points
          }
          this.setMoneyCalculatorPanelAction(money_calculator_panel_action)
          this.showDialogById('input-money-calculator-panel-action-modal')
          break
        }
        case sales_options.sales_item_action_type.balance_deduction_action: {
          let tmp_deduction_amount = sales_item.deduction_amount
          if(!tmp_deduction_amount > 0) {
            tmp_deduction_amount = sales_item.amount - sales_item.deduction_points
          }
          
          let money_calculator_panel_action = {
            action: sales_options.calculator_type.sales_item_deduction_balance,
            data: tmp_deduction_amount
          }
          this.setMoneyCalculatorPanelAction(money_calculator_panel_action)
          this.showDialogById('balance-deduction-action-modal')
          break
        }
        case sales_options.sales_item_action_type.amount: {
          let money_calculator_panel_action = {
            action: sales_options.calculator_type.sales_item_amount,
            data: sales_item.amount
          }
          this.setMoneyCalculatorPanelAction(money_calculator_panel_action)
          this.showDialogById('input-money-calculator-panel-action-modal')
          break
        }
      }
    },
    onSalesItemDiscountApply(discount){
      let tmp_sales_item = this.sales.fields.sales_items[this.x_sales_item_action.data.key]
      tmp_sales_item.discount_category_id   = discount.discount_category_id
      tmp_sales_item.discount_category_name = discount.discount_category_name
      tmp_sales_item.discount_type          = discount.discount_type
      tmp_sales_item.discount_value         = discount.discount_value
      this.updateSalesItemAmount(tmp_sales_item)
    },
    onSalesItemStaffsApply(staffs){
      for(let sales_item of this.sales.fields.sales_items){
        if(sales_item.key == this.x_sales_item_action.data.key){
          sales_item.staffs = staffs
        }
      }
    },
    onSalesItemSalesTypeApply(sales_type){
      for(let sales_item of this.sales.fields.sales_items){
        if(sales_item.key == this.x_sales_item_action.data.key){
          sales_item.sales_type_id   = sales_type.sales_type_id
          sales_item.sales_type_name = sales_type.sales_type_name
        }
      }
    },
    onBalanceDeductionApply(balance_deduction, client_prepaid_card_deducted){
      if(this.x_money_calculator_panel_action.action == sales_options.calculator_type.sales_item_deduction_balance){
        for(let sales_item of this.sales.fields.sales_items){
          if(sales_item.key == this.x_sales_item_action.data.key){
            let tmp_sales_item_amount_not_deducted = sales_item.amount - sales_item.deduction_points
            if(balance_deduction > tmp_sales_item_amount_not_deducted){
              this.showAlert([this.warning_sales_item_balance_deduct_max])
              return
            }
            if(isNaN(client_prepaid_card_deducted.id)){
              sales_item.deducted_by_prepaid_goods_guid = client_prepaid_card_deducted.id
            } else {
              sales_item.deducted_prepaid_goods_ref = client_prepaid_card_deducted.id
            }

            sales_item.deduction_type = sales_options.deduction_type.prepaid_card
            sales_item.deduction_amount = balance_deduction
          }
        }
      }

      let tmp_sales_total_balance_deduction = 0
      if(this.x_money_calculator_panel_action.action == sales_options.calculator_type.sales_deduction_balance){
        tmp_sales_total_balance_deduction = this.sales.fields.balance_deduction
        let tmp_remain_balance = balance_deduction
        for(let sales_item of this.sales.fields.sales_items){
          if(sales_item.prepaid_goods_guid == client_prepaid_card_deducted.id 
          || sales_item.deduction_type == sales_options.deduction_type.prepaid_service){
            continue
          }

          sales_item.deduction_type = sales_options.deduction_type.prepaid_card

          if(isNaN(client_prepaid_card_deducted.id)){
            sales_item.deducted_by_prepaid_goods_guid = client_prepaid_card_deducted.id
          }
          else {
            sales_item.deducted_prepaid_goods_ref = client_prepaid_card_deducted.id
          }
          
          let tmp_sales_item_amount_not_deducted = sales_item.amount - sales_item.deduction_points
          if(tmp_remain_balance > tmp_sales_item_amount_not_deducted){
            sales_item.deduction_amount = tmp_sales_item_amount_not_deducted
            tmp_remain_balance = tmp_remain_balance - tmp_sales_item_amount_not_deducted
          }
          else {
            sales_item.deduction_amount = tmp_remain_balance
            break
          }
        }
      }
      
      this.updateSalesCheckout()
      
      // re-calculate client-prepaid-cards in store
      let tmp_client_prepaid_cards = this.x_sales_action_helper.client_prepaid_cards
      for(let tmp_client_prepaid_card of tmp_client_prepaid_cards){
        if(tmp_client_prepaid_card.id == client_prepaid_card_deducted.id){
          if(this.x_money_calculator_panel_action.action == sales_options.calculator_type.sales_item_deduction_balance){
            tmp_client_prepaid_card.balance = Number(tmp_client_prepaid_card.balance) 
                                              + Number(this.x_money_calculator_panel_action.data) 
                                              - Number(balance_deduction)
          }
          if(this.x_money_calculator_panel_action.action == sales_options.calculator_type.sales_deduction_balance){
            tmp_client_prepaid_card.balance = Number(tmp_client_prepaid_card.balance)
                                              + Number(tmp_sales_total_balance_deduction)
                                              - Number(this.sales.fields.balance_deduction)
          }
          break
        }
      }
      
      // balance move
      
    },
    onInputMoneyCalculator(money_calculator){
      if(this.x_money_calculator_panel_action.action == sales_options.calculator_type.sales_payment){
        this.onInputPaymentMethodAmount(money_calculator)
      }
      if(this.x_money_calculator_panel_action.action == sales_options.calculator_type.sales_item_deduction_points){
        let tmp_client_points = this.sales_client_account.getPoints()
        if(this.x_sales_action.action == options.form_actions.edit){
          tmp_client_points += this.x_money_calculator_panel_action.data
        }
        if(money_calculator > tmp_client_points){
          this.showAlert([this.warning_points_deduction_exceed_client_points])
          return
        }

        for(let sales_item of this.sales.fields.sales_items){
          if(sales_item.key == this.x_sales_item_action.data.key){
            if(money_calculator > sales_item.amount){
              this.showAlert([this.warning_points_deduction_of_sales_item_exceed_amount])
              return
            }
            sales_item.deduction_points = money_calculator
            sales_item.deduction_amount = 0 // #todo: return balance to prepaid card in store
            // let tmp_prepaid_card = this.x_sales_action_helper.client_prepaid_cards.filter(c => c.id != sales_item.deducted_by_prepaid_goods_guid || sales_item.deducted_prepaid_goods_ref)
          }
        }
      }
      if(this.x_money_calculator_panel_action.action == sales_options.calculator_type.sales_deduction_points){
        let tmp_client_points = this.sales_client_account.getPoints()
        if(this.x_sales_action.action == options.form_actions.edit){
          tmp_client_points += this.x_money_calculator_panel_action.data // #todo: reset sales-point: all sales-item to zero -> re-add by new-point inputed
        }
        if(money_calculator > tmp_client_points){
          this.showAlert([this.warning_points_deduction_exceed_client_points])
          return
        }
      
        let tmp_remain_points = money_calculator
        for(let sales_item of this.sales.fields.sales_items){
          if(tmp_remain_points > sales_item.amount){
            sales_item.deduction_points = sales_item.amount
            tmp_remain_points = tmp_remain_points - sales_item.amount
          }
          else {
            sales_item.deduction_points = tmp_remain_points
            break
          }
        }
      }
      if(this.x_money_calculator_panel_action.action == sales_options.calculator_type.sales_item_amount){
        let tmp_sales_item        = this.x_sales_item_action.data
        let tmp_sales_item_amount = tmp_sales_item.unit_price * tmp_sales_item.quantity
        if(money_calculator > tmp_sales_item_amount){
          let tmp_error_message = this.warning_sales_item_amount_can_not_exceed_unit_price_multiply_quantity
          tmp_error_message = tmp_error_message.replace('{amount}', formatMoney(tmp_sales_item_amount, 0))
          this.showAlert([tmp_error_message])
          return
        }
        else {
          let tmp_discount = {
            discount_category_id  : 0,
            discount_category_name: '',
            discount_type         : sales_options.discount_type.amount,
            discount_value        : tmp_sales_item_amount - money_calculator
          }
          this.onSalesItemDiscountApply(tmp_discount)
        }
      }
      this.updateSalesCheckout()
    },
    updateSalesItemAmount(sales_item){
      this.updateSalesItemAmountWithDiscount(sales_item)
      this.updateSalesItemsKey()

      for(let tmp_sales_item of this.sales.fields.sales_items){
        if(tmp_sales_item.key == sales_item.key){
          // #todo: reset deduction when sales-item amount changed
          // let deducted_prepaid_goods_ref = sales_item.deducted_prepaid_goods_ref   // deducted from existing prepaid service
          // if(!sales_item.deducted_prepaid_goods_ref > 0){
          //   deducted_prepaid_goods_ref = sales_item.deducted_by_prepaid_goods_guid // deducted from new prepaid service
          // }
          
          // let tmp_prepaid_service_ref = _.find(this.x_sales_action_helper.client_prepaid_services_all, ps => ps.id == deducted_prepaid_goods_ref)
          // if(tmp_prepaid_service_ref != undefined && tmp_prepaid_service_ref.initial_quantity != -1){
          //   this.updateClientPrepaidServiceQuantityToStore(tmp_prepaid_service_ref.id, Number(tmp_prepaid_service_ref.quantity) + Number(sales_item.quantity))
          // }
          sales_item.deduction_amount = 0
          sales_item.deduction_points = 0
          
          if(sales_item.deduction_type == sales_options.deduction_type.prepaid_service
          || sales_item.gift_card_type == sales_options.gift_card_type.redeem){
            sales_item.amount = 0
          }
          tmp_sales_item = Object.assign(tmp_sales_item, sales_item)
        }
      }
      this.updateSalesCheckout()
    },
    updateSalesItemAmountWithDiscount(sales_item){
      let tmp_amount = sales_item.unit_price * sales_item.quantity
      let tmp_discount_amount = 0

      if(sales_item.discount_type == sales_options.discount_type.percentage)
        tmp_discount_amount = tmp_amount * (sales_item.discount_value / 100)
      if(sales_item.discount_type == sales_options.discount_type.amount)
        tmp_discount_amount = sales_item.discount_value
      
      sales_item.amount = tmp_amount - tmp_discount_amount
      sales_item.staffs = SalesUtils.updateStaffsAmountOfSalesItem(sales_item.staffs, sales_item.amount)
    },

    // sales deduction & payment
    onActionSalesDeductionPoints(){
      let tmp_deduction_points = this.sales.fields.deduction_points
      if(!tmp_deduction_points > 0) {
        if(this.client_points >= this.sales.fields.total_amount){
          tmp_deduction_points = this.sales.fields.total_amount - this.sales.fields.booking_deposit_amount
        }
        else {
          tmp_deduction_points = this.client_points
        }
      }
      let money_calculator_panel_action = {
        action: sales_options.calculator_type.sales_deduction_points,
        data: tmp_deduction_points
      }
      this.setMoneyCalculatorPanelAction(money_calculator_panel_action)
      this.showDialogById('input-money-calculator-panel-action-modal')
    },
    onActionSalesDeductionBalance(){
      let tmp_balance_deduction = this.sales.fields.balance_deduction
      if(!tmp_balance_deduction > 0) {
        tmp_balance_deduction = Number(this.sales.fields.total_amount) - this.sales.fields.booking_deposit_amount - Number(this.sales.fields.deduction_points)
      }
      let money_calculator_panel_action = {
        action: sales_options.calculator_type.sales_deduction_balance,
        data: tmp_balance_deduction
      }
      this.setMoneyCalculatorPanelAction(money_calculator_panel_action)
      this.showDialogById('balance-deduction-action-modal')
    },
    onSelectedPaymentMethod(payment_method_selected){
      let money_calculator_panel_action = {
        action: sales_options.calculator_type.sales_payment,
        data: 0,
        options: {
          payment_method_selected: payment_method_selected
        }
      }

      if(this.sales.fields.outstanding > 0){
        money_calculator_panel_action.data = this.sales.fields.outstanding
      }

      let used_payment_method = this.getUsedPaymentMethod(payment_method_selected.id)
      if(used_payment_method != undefined){
        money_calculator_panel_action.data = used_payment_method.payment_amount
      }
      
      this.setMoneyCalculatorPanelAction(money_calculator_panel_action)
      this.showDialogById('input-money-calculator-panel-action-modal')
    },
    getUsedPaymentMethod(payment_method_selected_id){
      return _.find(this.sales.fields.payments, { 'payment_method_id': payment_method_selected_id })
    },
    onInputPaymentMethodAmount(money_calculator){
      let payment_method_selected = this.x_money_calculator_panel_action.options.payment_method_selected
      let tmp_payment = {
        sales_payment_id    : 0,
        payment_method_id   : payment_method_selected.id,
        payment_method_name : payment_method_selected.name,
        payment_amount      : Number(money_calculator)
      }
      let used_payment_method = this.getUsedPaymentMethod(payment_method_selected.id)
      if(used_payment_method != undefined){
        used_payment_method.payment_amount = tmp_payment.payment_amount
      }
      else {
        this.sales.fields.payments.push(tmp_payment)
      }
      this.sales.fields.payments = this.sales.fields.payments.filter(p => p.payment_amount > 0)
      this.updateSalesCheckout()
    },
    removeSalesPayment(payment_removed){
      this.sales.fields.payments = this.sales.fields.payments.filter(p => p.payment_method_id != payment_removed.payment_method_id)
      this.updateSalesCheckout()
    },
    updateSalesCheckout(){
      let tmp_total_amount = 0

      // booking deposit
      let tmp_booking_deposit = this.sales.fields.booking_deposit_amount

      // points deduction & balance deduction
      let tmp_total_points_deduction = 0
      let tmp_total_balance_deduction = 0
      for(let sales_item of this.sales.fields.sales_items){
        tmp_total_amount += Number(sales_item.amount)
        tmp_total_points_deduction += Number(sales_item.deduction_points)
        tmp_total_balance_deduction += Number(sales_item.deduction_amount)
      }
      this.sales.fields.total_amount      = tmp_total_amount
      this.sales.fields.deduction_points  = tmp_total_points_deduction
      this.sales.fields.balance_deduction = tmp_total_balance_deduction
      
      if(this.watch_sales_total_amount      != tmp_total_amount
      || this.watch_sales_deduction_points  != tmp_total_points_deduction
      || this.watch_sales_balance_deduction != tmp_total_balance_deduction){
        this.watch_sales_total_amount       = tmp_total_amount
        this.watch_sales_deduction_points   = tmp_total_points_deduction
        this.watch_sales_balance_deduction  = tmp_total_balance_deduction

        this.sales.fields.payments = []
      }
      
      // payments
      let tmp_total_payments = 0
      for(let payment of this.sales.fields.payments){
        tmp_total_payments += payment.payment_amount
      }

      // outstanding
      this.sales.fields.outstanding = tmp_total_amount
                                      - tmp_total_points_deduction
                                      - tmp_total_balance_deduction
                                      - tmp_booking_deposit
                                      - tmp_total_payments

      // loyalty points
      if(this.has_client) 
        this.sales.calEarnLoyaltyPoints(this.loyalty_points_setups, 0)

      this.$forceUpdate()
    },

    onConfirm(){
      // pre-sending data
      this.sales.fields.balance_moves       = this.x_sales_action_helper.balance_moves
      this.sales.fields.invoice_date_time_ts= this.getInvoiceDateTimeTS()
      this.sales.fields.hour_of_day         = this.getInvoiceTime()[0]

      // set expire-date to new prepaid goods
      for(let sales_item of this.sales.fields.sales_items){
        if(this.isNewPrepaidGoods(sales_item)){
          sales_item.prepaid_goods_expiry_date_ts = this.getNewPrepaidGoodsExpiryDateTS(sales_item.goods_ref.validity, sales_item.goods_ref.validity_type)
        }
      }
      
      // validate ui
      if(!this.isValidateUISalesAction()) return

      // validate view model
      this.errors = this.sales.isValid()
      
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
      let tmp_second = moment(this.sales.fields.invoice_date_time).format(options.standard_hour_format.h24_seconds)
      tmp_second = tmp_second.substr(6, 2)
      tmp_date.setHours(tmp_hour[0], tmp_hour[1], tmp_second)
      let tmp_date_time_ts = convertDateToTimeStamp(tmp_date, false, true)
      return tmp_date_time_ts
    },
    getInvoiceTime(){
      return this.invoice_time.trim().split(':')
    },
    isNewPrepaidGoods(sales_item){
      let is_valid = false
      if(sales_item.goods_type === sales_options.sales_goods_type.prepaid_card 
      || sales_item.goods_type === sales_options.sales_goods_type.prepaid_service){
        if(isNaN(sales_item.client_prepaid_goods_id)){
          is_valid = true
        }
      }
      return is_valid
    },
    getNewPrepaidGoodsExpiryDateTS(validity, validity_type){
      let tmp_date = convertTimeStampToDate(this.sales.fields.invoice_date_time_ts)
      let tmp_expiry_date_ts = 0

      if(validity == -1)
        tmp_expiry_date_ts = -1
      else {
        if(validity_type == options.validity_type.months){
          tmp_date = moment(tmp_date).add(validity, 'months')
        }
        if(validity_type == options.validity_type.days){
          tmp_date = moment(tmp_date).add(validity, 'days')
        }
        tmp_date = tmp_date.add(1, 'days')
        tmp_date = tmp_date.format(options.standard_date_format.ymd)
        tmp_expiry_date_ts = convertDateToTimeStamp(tmp_date) - 1
      }
      return tmp_expiry_date_ts
    },
    isValidateUISalesAction(){
      let tmp_sales_vm = _.cloneDeep(this.sales)
      let error_messages = []
      let is_valid = true
      
      // sales items
      if(tmp_sales_vm.fields.sales_items.length == 0){
        error_messages.push(this.warning_sales_items_list_can_not_be_empty)
      }
      for(let sales_item of tmp_sales_vm.fields.sales_items){
        if(sales_item.goods_type == sales_options.sales_goods_type.service){
          if(this.sales_setup.sales_general_setup.allow_omit_staff_when_add_service_sales == sales_options.omit_staff_type_enum.not_allow){
            if(sales_item.staffs.length == 0){
              error_messages.push(this.warning_sales_item_service_not_have_staffs)
            }
          }
        }
        if(sales_item.goods_type == sales_options.sales_goods_type.product){
          if(this.sales_setup.sales_general_setup.allow_omit_staff_when_add_product_sales == sales_options.omit_staff_type_enum.not_allow){
            if(sales_item.staffs.length == 0){
              error_messages.push(this.warning_sales_item_product_not_have_staffs)
            }
          }
        }
      }

      // can not add sales in future
      let current_date_time_ts = convertDateToTimeStamp(convertDateToTimezone(new Date()), false, true)
      if(this.sales.fields.invoice_date_time_ts > current_date_time_ts){
        is_valid = false
        this.showAlert([this.warning_can_not_add_sales_in_future])
        return
      }
      
      // outstanding < 0: alert
      if(tmp_sales_vm.fields.outstanding < 0){
        let tmp_total_nopay = tmp_sales_vm.fields.booking_deposit_amount + tmp_sales_vm.fields.deduction_points + tmp_sales_vm.fields.balance_deduction
        if(tmp_sales_vm.fields.booking_deposit_amount > tmp_sales_vm.fields.total_amount){
          error_messages.push(this.warning_booking_deposit_can_not_exceeds_sales_amount)
        }
        if(tmp_total_nopay > tmp_sales_vm.fields.total_amount){
          error_messages.push(this.warning_the_deducted_amount_exceeds_total_amount)
        }
        if(tmp_sales_vm.fields.payments.length > 1){
          error_messages.push(this.warning_sales_not_allow_change_for_multiple_payments)
        }
      }
      if(error_messages.length > 0){
        is_valid = false
        this.showAlert(error_messages)
        return
      }
      
      // outstanding > 0: alert confirm
      if(tmp_sales_vm.fields.outstanding > 0){
        is_valid = false
        if(this.has_client){
          if(this.is_client_of_current_shop){
            this.alert_data = [this.warning_sales_has_outstanding.replace('{amount}', formatMoney(tmp_sales_vm.fields.outstanding, 0))]
            this.showDialogById(this.alert_id)
          }
          else {
            this.showAlert([this.warning_sales_has_outstanding_with_shared_client])
          }
        }
        else {
          this.showAlert([this.warning_sales_has_outstanding_with_unregistered_client])
        }
        return
      }
      
      return is_valid
    },
    async submitActionAsync(){
      let current_date_time_ts = convertDateToTimeStamp(convertDateToTimezone(new Date()), false, true)
      let tmp_sales_vm = _.cloneDeep(this.sales)
      tmp_sales_vm.fields = mapActionSecurityInfo(tmp_sales_vm.fields, this.x_sales_action.action, current_date_time_ts)
      
      let api_action = ''
      let success_action = ''
      if(this.x_sales_action.action == options.form_actions.add){
        api_action     = 'addSalesAsync'
        success_action = 'added'

        // time
        tmp_sales_vm.fields.created_date_time_ts = convertTimeStampPlusLocalzone(current_date_time_ts)
      }
      else if(this.x_sales_action.action == options.form_actions.edit){
        api_action     = 'updateSalesAsync'
        success_action = 'edited'

        // time
        tmp_sales_vm.fields.edited_date_time_ts = convertTimeStampPlusLocalzone(current_date_time_ts)

        // prepaid service & deducted prepaid service
        for(let sales_item of tmp_sales_vm.fields.sales_items){
          if(sales_item.deducted_prepaid_goods_ref > 0){
            sales_item.prepaid_goods_guid = guid()
          }
        }
      }

      // re-calculate outstanding < 0
      if(tmp_sales_vm.fields.outstanding < 0){
        tmp_sales_vm.fields.payments[0].payment_amount += tmp_sales_vm.fields.outstanding
        tmp_sales_vm.fields.outstanding = 0
      }

      // sending
      this.preLoader()
      let result = await this.sales_api[api_action](tmp_sales_vm)
      this.preLoader(false)

      if(result.is_ok) {
        this.$emit(success_action)
        this.hideModal()

        this.setSalesActionHelperBalanceMoves([])
      }
      else this.showAlert(result.error_messages)
    },

    // alert confirm
    onAlertConfirm(){
      this.submitActionAsync()
    },

    // mobile
    onChangeShowTotalAmount(){
      this.is_show_total_amount = !this.is_show_total_amount
    },
    onChangeShowSalesItem(row){
      row.show_sales_item = !row.show_sales_item
      this.$forceUpdate()
    },
    onChangeShowCheckout(){
      this.is_show_checkout = !this.is_show_checkout
    },

    // format for template
    formatSalesItemDiscount(sales_item){
      let tmp_discount_text = ''
      let tmp_discount_value = Number(sales_item.discount_value)
      if(sales_item.discount_value != null && sales_item.discount_value != undefined){
        if(tmp_discount_value > 0){
          if(sales_item.discount_type == sales_options.discount_type.percentage)
            tmp_discount_text = sales_item.discount_value + '%'
          else
            tmp_discount_text = formatMoney(sales_item.discount_value, 0)
        }
      }
      return tmp_discount_text
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
    }
  }
}
</script>

<style lang='scss'>
@import './sales-action.scss';
</style>