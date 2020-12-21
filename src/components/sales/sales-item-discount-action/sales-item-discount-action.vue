<template> 
  <b-modal id="sales-item-discount-action-modal" 
           :title="form_title"
           :no-close-on-backdrop="true"
           hide-footer 
           class="sales-item-discount-action-modal"
           @show="onLoadForm">
    <div class="discount-tabs-wrapper">
      <b-tabs content-class="mt-3">
        <b-tab :title="$t('sales.keypad')" :active="is_active_tab_keypad" class="keypad"
               @click="onClickTabKeypad">
          <ul>
            <li v-for="(percent, index) in percentages" :key="index" 
                @click="onSelectPercent(percent)">{{ percent }}%</li>
          </ul>
        </b-tab>
        <b-tab :title="$t('misc-codes.discount-category')" :active="is_active_tab_discount_category" class="discount-category"
               @click="onClickTabDiscountCategory">
          <ul>
            <li v-for="(discount_category, index) in discount_categorys" :key="index" 
                @click="onSelectDiscountCategory(discount_category)">
              {{ discount_category.name }} 
              <span v-if="discount_category.discount_type == sales_options.discount_type.percentages">%</span>
            </li>
          </ul>
        </b-tab>
      </b-tabs>
    </div>

    <div class="discount-custom">
      <div class="form-group">
        <label>{{ $t('general.amount') }}</label>
        <input-money v-model="sales_item_discount.fields.discount_value" :decimal="0"/>
      </div>
      <ul class="apply-btns">
        <li class="btn" @click="onApplyAmount">{{ $t('sales.apply-amount') }}</li>
        <li class="btn" @click="onApplyPercent">{{ $t('sales.apply-percent') }}</li>
      </ul>
    </div>

    <error-box :errors="errors"/>
    <div class="modal-footer">
      <div class="btn-action-group">
        <button class="btn btn-secondary" @click="onCancel">{{ $t('general.close') }}</button>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { sales_options }            from '../../../helpers/options/sales-options'
import SalesItemDiscountViewModel   from '../../../view-model/sales/sales-item/sales-item-discount-view-model'
import input_money                  from '../../common/form/input/input-money/input-money.vue'
import component_base               from '../../common/component-base/component-base'
import error_box                    from '../../common/form/error-box/error-box'


export default {
  components: {
    'input-money': input_money,
    'error-box': error_box,
  },
  extends: component_base,
  props: {
    sales_setup: {
      type: Object,
      default: () => []
    }
  },
  data(){
    return {
      sales_options,
      sales_item_discount: new SalesItemDiscountViewModel(),
      
      is_active_tab_keypad: true,
      is_active_tab_discount_category: false,
      percentages: [5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 100],
    }
  },
  computed: {
    ...mapGetters('sales', {
      x_sales_item_action: 'getSalesItemAction'
    }),
    form_title(){return this.$i18n.t('sales.discount')},
    warning_discount_amount_exceeds_item_amount(){return this.$i18n.t('sales.warning-discount-amount-can-not-exceed-item-amount')},
    discount_categorys(){
      return this.sales_setup.discount_category_setup
    }
  },
  methods: {
    ...mapMutations('sales',[
      'updateSalesActionSalesItem',
    ]),
    hideModal(){
      this.hideDialogById('sales-item-discount-action-modal')
    },
    onCancel(){
      this.hideModal()
    },
    onLoadForm(){
      this.errors = []

      if(this.sales_setup.sales_general_setup.discount_input_default_window == sales_options.discount_input_default_window_type_enum.number_keypad)
        this.onClickTabKeypad()
      else
        this.onClickTabDiscountCategory()
      
      this.setDiscountCategory(0, '')
      this.setDiscount(this.x_sales_item_action.data.discount_type, this.x_sales_item_action.data.discount_value)
    },
    onClickTabKeypad(){
      this.is_active_tab_keypad = true
      this.is_active_tab_discount_category = false
    },
    onClickTabDiscountCategory(){
      this.is_active_tab_keypad = false
      this.is_active_tab_discount_category = true
    },
    setDiscountCategory(category_id, category_name){
      this.sales_item_discount.fields.discount_category_id   = category_id
      this.sales_item_discount.fields.discount_category_name = category_name
    },
    setDiscount(discount_type, discount_value){
      this.sales_item_discount.fields.discount_type  = discount_type
      this.sales_item_discount.fields.discount_value = Number(discount_value)
    },
    onSelectPercent(percent){
      this.setDiscountCategory(0, '')
      this.setDiscount(sales_options.discount_type.percentage, percent)
      this.applyDiscount()
    },
    onSelectDiscountCategory(discount_category){
      this.setDiscountCategory(discount_category.id, discount_category.name)
      this.setDiscount(discount_category.discount_type, discount_category.discount_value)
      this.applyDiscount()
    },
    onApplyAmount(){
      this.setDiscountCategory(0, '')
      this.setDiscount(sales_options.discount_type.amount, this.sales_item_discount.fields.discount_value)
      this.applyDiscount()
    },
    onApplyPercent(){
      this.setDiscountCategory(0, '')
      this.setDiscount(sales_options.discount_type.percentage, this.sales_item_discount.fields.discount_value)
      this.applyDiscount()
    },
    applyDiscount(){
      let tmp_errors = []
      let tmp_item_amount_origin = this.x_sales_item_action.data.unit_price * this.x_sales_item_action.data.quantity
      let can_not_apply_discount_amount = this.sales_item_discount.fields.discount_type == sales_options.discount_type.amount 
                                       && this.sales_item_discount.fields.discount_value > tmp_item_amount_origin
      if(can_not_apply_discount_amount){
        tmp_errors.push(this.warning_discount_amount_exceeds_item_amount)
      }
      this.errors = [...this.sales_item_discount.isValid(), ...tmp_errors]
      if(this.errors.length == 0){
        this.$emit('apply-discount', this.sales_item_discount.getFields())
        this.hideModal()
      }
    }
  }
}
</script>

<style lang="scss">
@import './sales-item-discount-action.scss';
</style>
